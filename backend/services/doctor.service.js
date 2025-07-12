import User from '../models/user.model.js';
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
        sortBy = 'ratings'
      } = filters;

      const {
        page = 1,
        limit = 10,
        coordinates
      } = options;

      // Base query
      const query = {
        role: 'doctor',
        isVerified: true
      };

      // Text search
      if (search) {
        query.$text = { $search: search };
      }

      // Specialization filter
      if (specialization) {
        query.specialization = specialization;
      }

      // Rating filter
      if (minRating) {
        query['ratings.average'] = { $gte: parseFloat(minRating) };
      }

      // Experience filter
      if (minExperience) {
        query.experience = { $gte: parseInt(minExperience) };
      }

      // Consultation fee filter
      if (maxFee) {
        query.consultationFee = { $lte: parseFloat(maxFee) };
      }

      // Languages filter
      if (languages && languages.length > 0) {
        query.languages = { $in: languages };
      }

      // Location filter
      if (location) {
        query['location.city'] = location;
      }

      // Geospatial search if coordinates provided
      if (coordinates && coordinates.length === 2) {
        query['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            $maxDistance: 50000 // 50km radius
          }
        };
      }

      // Availability filter
      let availableDoctorIds = [];
      if (availableOn) {
        const date = new Date(availableOn);
        const dayOfWeek = date.getDay();
        const timeStr = date.toTimeString().slice(0, 5); // HH:mm format

        // Find doctors available at the specified time
        const schedules = await Schedule.find({
          'recurringSchedule': {
            $elemMatch: {
              dayOfWeek,
              startTime: { $lte: timeStr },
              endTime: { $gt: timeStr },
              isWorkingDay: true
            }
          }
        });

        // Check for appointments
        const busyDoctors = await Appointment.find({
          startTime: { $lte: date },
          endTime: { $gt: date },
          status: 'scheduled'
        }).distinct('doctor');

        availableDoctorIds = schedules
          .map(s => s.doctor.toString())
          .filter(id => !busyDoctors.includes(id));

        if (availableDoctorIds.length > 0) {
          query._id = { $in: availableDoctorIds };
        } else {
          return { doctors: [], total: 0, page: 1, totalPages: 0 };
        }
      }

      // Sorting
      let sortOptions = {};
      switch (sortBy) {
        case 'ratings':
          sortOptions = { 'ratings.average': -1 };
          break;
        case 'experience':
          sortOptions = { experience: -1 };
          break;
        case 'fee':
          sortOptions = { consultationFee: 1 };
          break;
        default:
          sortOptions = { 'ratings.average': -1 };
      }

      // If there's a text search, sort by text score first
      if (search) {
        sortOptions = { score: { $meta: 'textScore' }, ...sortOptions };
      }

      // Execute query with pagination
      const skip = (page - 1) * limit;
      
      const [doctors, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

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
      return await User.distinct('specialization', {
        role: 'doctor',
        isVerified: true,
        specialization: { $ne: null }
      });
    } catch (error) {
      console.error('Get specializations error:', error);
      throw error;
    }
  }

  static async getLanguages() {
    try {
      return await User.distinct('languages', {
        role: 'doctor',
        isVerified: true,
        languages: { $ne: [] }
      });
    } catch (error) {
      console.error('Get languages error:', error);
      throw error;
    }
  }

  static async getCities() {
    try {
      return await User.distinct('location.city', {
        role: 'doctor',
        isVerified: true,
        'location.city': { $ne: null }
      });
    } catch (error) {
      console.error('Get cities error:', error);
      throw error;
    }
  }
}

export default DoctorService; 