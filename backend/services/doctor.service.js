import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';
import Schedule from '../models/schedule.model.js';
import Appointment from '../models/appointment.model.js';

class DoctorService {
  static async searchDoctors(filters = {}, options = {}) {
    try {
      const {
        search,
        specialization,
        minRating,
        minExperience,
        maxFee,
        languages,
        location,
        availableOn,
        sortBy = 'experience'
      } = filters;

      const {
        page = 1,
        limit = 10,
        coordinates
      } = options;

      // Build aggregation pipeline
      const pipeline = [];

      // Match stage - filter doctors
      const matchStage = {};

      // Specialization filter
      if (specialization) {
        matchStage.specialization = specialization;
      }

      // Experience filter
      if (minExperience) {
        matchStage.experience = { $gte: parseInt(minExperience) };
      }

      // Consultation fee filter
      if (maxFee) {
        matchStage.consultationFee = { $lte: parseFloat(maxFee) };
      }

      // Location filter
      if (location) {
        matchStage['location.city'] = location;
      }

      // Geospatial search if coordinates provided
      if (coordinates && coordinates.length === 2) {
        matchStage['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            $maxDistance: 50000 // 50km radius
          }
        };
      }

      pipeline.push({ $match: matchStage });

      // Lookup stage - join with users collection
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      });

      // Unwind the user array
      pipeline.push({ $unwind: '$user' });

      // Match verified users only
      pipeline.push({
        $match: {
          'user.role': 'doctor',
          'user.isVerified': true
        }
      });

      // Text search on user name if provided
      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { 'user.name': { $regex: search, $options: 'i' } },
              { specialization: { $regex: search, $options: 'i' } },
              { clinicName: { $regex: search, $options: 'i' } }
            ]
          }
        });
      }

      // Add computed fields - use actual ratings from user model
      pipeline.push({
        $addFields: {
          ratings: '$user.ratings'
        }
      });

      // Rating filter
      if (minRating) {
        pipeline.push({
          $match: {
            'ratings.average': { $gte: parseFloat(minRating) }
          }
        });
      }

      // Sorting
      let sortStage = {};
      switch (sortBy) {
        case 'ratings':
          sortStage = { 'ratings.average': -1 };
          break;
        case 'experience':
          sortStage = { experience: -1 };
          break;
        case 'fee':
          sortStage = { consultationFee: 1 };
          break;
        case 'name':
          sortStage = { 'user.name': 1 };
          break;
        default:
          sortStage = { experience: -1 };
      }

      pipeline.push({ $sort: sortStage });

      // Pagination
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });

      // Project final structure
      pipeline.push({
        $project: {
          _id: 1,
          userId: 1,
          name: '$user.name',
          email: '$user.email',
          specialization: 1,
          qualifications: 1,
          experience: 1,
          licenseNumber: 1,
          clinicName: 1,
          consultationFee: 1,
          services: 1,
          education: 1,
          certifications: 1,
          about: 1,
          location: 1,
          contactInfo: 1,
          availability: 1,
          ratings: 1,
          createdAt: 1,
          updatedAt: 1
        }
      });

      // Execute aggregation
      const [doctors, totalResult] = await Promise.all([
        Doctor.aggregate(pipeline),
        Doctor.aggregate([
          { $match: matchStage },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $match: {
              'user.role': 'doctor',
              'user.isVerified': true
            }
          },
          ...(search ? [{
            $match: {
              $or: [
                { 'user.name': { $regex: search, $options: 'i' } },
                { specialization: { $regex: search, $options: 'i' } },
                { clinicName: { $regex: search, $options: 'i' } }
              ]
            }
          }] : []),
          { $count: 'total' }
        ])
      ]);

      const total = totalResult.length > 0 ? totalResult[0].total : 0;

      return {
        doctors,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Search doctors error:', error);
      throw error;
    }
  }

  static async getSpecializations() {
    try {
      // Get specializations from doctors collection, but only for verified users
      const pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $match: {
            'user.role': 'doctor',
            'user.isVerified': true,
            specialization: { $ne: null }
          }
        },
        {
          $group: {
            _id: '$specialization'
          }
        },
        { $sort: { _id: 1 } }
      ];

      const result = await Doctor.aggregate(pipeline);
      return result.map(item => item._id);
    } catch (error) {
      console.error('Get specializations error:', error);
      throw error;
    }
  }

  static async getLanguages() {
    try {
      // Get languages from users collection for verified doctors
      const pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $match: {
            'user.role': 'doctor',
            'user.isVerified': true,
            'user.languages': { $exists: true, $ne: [] }
          }
        },
        { $unwind: '$user.languages' },
        {
          $group: {
            _id: '$user.languages'
          }
        },
        { $sort: { _id: 1 } }
      ];

      const result = await Doctor.aggregate(pipeline);
      return result.map(item => item._id);
    } catch (error) {
      console.error('Get languages error:', error);
      throw error;
    }
  }

  static async getCities() {
    try {
      // Get cities from doctors collection, but only for verified users
      const pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $match: {
            'user.role': 'doctor',
            'user.isVerified': true,
            'location.city': { $ne: null, $exists: true }
          }
        },
        {
          $group: {
            _id: '$location.city'
          }
        },
        { $sort: { _id: 1 } }
      ];

      const result = await Doctor.aggregate(pipeline);
      return result.map(item => item._id);
    } catch (error) {
      console.error('Get cities error:', error);
      throw error;
    }
  }

  static async getDoctorById(doctorId) {
    try {
      const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(doctorId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $match: {
            'user.role': 'doctor',
            'user.isVerified': true
          }
        },
        {
          $addFields: {
            ratings: '$user.ratings'
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            name: '$user.name',
            email: '$user.email',
            specialization: 1,
            qualifications: 1,
            experience: 1,
            licenseNumber: 1,
            clinicName: 1,
            consultationFee: 1,
            services: 1,
            education: 1,
            certifications: 1,
            about: 1,
            location: 1,
            contactInfo: 1,
            availability: 1,
            ratings: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ];

      const result = await Doctor.aggregate(pipeline);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Get doctor by ID error:', error);
      throw error;
    }
  }
}

export default DoctorService; 