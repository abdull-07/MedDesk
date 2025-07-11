import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filters, setFilters] = useState({
    availability: '',
    gender: '',
    experience: '',
    rating: '',
  });

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'Neurology',
    'Obstetrics',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Urology'
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const DoctorCard = ({ doctor }) => (
    <Link
      to={`/doctors/${doctor.id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="aspect-w-3 aspect-h-2">
        <img
          src={doctor.image}
          alt={`Dr. ${doctor.name}`}
          className="object-cover w-full h-48"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#1D3557] mb-1">Dr. {doctor.name}</h3>
        <p className="text-[#457B9D] text-sm mb-2">{doctor.specialty}</p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < doctor.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-[#457B9D] ml-2">
            ({doctor.reviewCount} reviews)
          </span>
        </div>
        <div className="flex items-center text-sm text-[#457B9D]">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {doctor.location}
        </div>
      </div>
    </Link>
  );

  const FilterSection = ({ title, options, value, onChange }) => (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-[#1D3557] mb-2">{title}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-gray-300 text-sm focus:ring-[#006D77] focus:border-[#006D77]"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1D3557] mb-2">Find a Doctor</h1>
            <p className="text-[#457B9D]">Browse through our network of trusted medical professionals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-[#1D3557] mb-4">Filters</h2>
              
              {/* Search */}
              <div className="mb-4">
                <label htmlFor="search" className="sr-only">Search doctors</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border-gray-300 pl-10 focus:ring-[#006D77] focus:border-[#006D77]"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Specialty Filter */}
              <FilterSection
                title="Specialty"
                options={specialties}
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
              />

              {/* Availability Filter */}
              <FilterSection
                title="Availability"
                options={['Today', 'This Week', 'Next Week']}
                value={filters.availability}
                onChange={(value) => setFilters({ ...filters, availability: value })}
              />

              {/* Gender Filter */}
              <FilterSection
                title="Gender"
                options={['Male', 'Female']}
                value={filters.gender}
                onChange={(value) => setFilters({ ...filters, gender: value })}
              />

              {/* Experience Filter */}
              <FilterSection
                title="Experience"
                options={['0-5 years', '5-10 years', '10+ years']}
                value={filters.experience}
                onChange={(value) => setFilters({ ...filters, experience: value })}
              />

              {/* Rating Filter */}
              <FilterSection
                title="Rating"
                options={['4+ Stars', '3+ Stars']}
                value={filters.rating}
                onChange={(value) => setFilters({ ...filters, rating: value })}
              />
            </div>
          </div>

          {/* Doctor List */}
          <div className="lg:col-span-3">
            {doctors.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-[#457B9D]">No doctors found matching your criteria</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList; 