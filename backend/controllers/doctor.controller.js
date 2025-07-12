import DoctorService from '../services/doctor.service.js';

// Search doctors with filters
export const searchDoctors = async (req, res) => {
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
      sortBy,
      page,
      limit,
      lat,
      lng
    } = req.query;

    // Parse coordinates if provided
    const coordinates = lat && lng ? [parseFloat(lng), parseFloat(lat)] : null;

    // Parse languages array
    const parsedLanguages = languages ? languages.split(',') : null;

    const result = await DoctorService.searchDoctors(
      {
        search,
        specialization,
        minRating,
        minExperience,
        maxFee,
        languages: parsedLanguages,
        location,
        availableOn,
        sortBy
      },
      {
        page,
        limit,
        coordinates
      }
    );

    res.json(result);
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get list of specializations
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await DoctorService.getSpecializations();
    res.json(specializations);
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get list of languages
export const getLanguages = async (req, res) => {
  try {
    const languages = await DoctorService.getLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get list of cities
export const getCities = async (req, res) => {
  try {
    const cities = await DoctorService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 