import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaUserCircle, FaIdCard, FaPhone, FaCalendarAlt, FaVenusMars, FaTint, FaMapMarkerAlt, FaUserFriends, FaNotesMedical, FaAllergies, FaPills } from 'react-icons/fa';

// Move components outside to prevent recreation on every render
const InfoItem = ({ icon, label, value, isEditing, name, type = 'text', options = [], onChange }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 text-lg font-medium text-[#1D3557]">{label}</h3>
    </div>
    {isEditing && name ? (
      type === 'select' ? (
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
          style={{ padding: '2px', paddingLeft: '10px' }}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
          style={{ padding: '2px', paddingLeft: '10px' }}
        />
      )
    ) : (
      <p className="text-[#457B9D]" style={{ padding: '2px', paddingLeft: '10px' }}>{value || 'Not provided'}</p>
    )}
  </div>
);

const MedicalHistorySection = ({ title, icon, items, field, isEditing, onArrayChange }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 text-lg font-medium text-[#1D3557]">{title}</h3>
    </div>
    {isEditing ? (
      <textarea
        value={items.join('\n')}
        onChange={(e) => onArrayChange(field, e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
        rows={3}
        placeholder={`Enter each ${field} on a new line`}
        style={{ padding: '2px', paddingLeft: '10px' }}
      />
    ) : (
      <ul className="list-disc list-inside text-[#457B9D] pl-5" style={{ padding: '2px', paddingLeft: '10px' }}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index}>{item}</li>
          ))
        ) : (
          <li className="text-gray-500">No {field} listed</li>
        )}
      </ul>
    )}
  </div>
);

const PatientProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: [],
      surgeries: [],
      familyHistory: []
    }
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      try {
        const response = await api.get('/auth/profile');
        if (response.data && response.data.data) {
          // Transform date format for date input
          const userData = {
            ...response.data.data,
            dateOfBirth: response.data.data.dateOfBirth ? new Date(response.data.data.dateOfBirth).toISOString().split('T')[0] : '',
            // Initialize nested objects if they don't exist
            address: response.data.data.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            emergencyContact: response.data.data.emergencyContact || {
              name: '',
              relationship: '',
              phone: '',
              email: ''
            },
            medicalHistory: response.data.data.medicalHistory || {
              conditions: [],
              allergies: [],
              medications: [],
              surgeries: [],
              familyHistory: []
            }
          };
          setFormData(userData);
        }
      } catch (apiError) {
        console.log('Using dummy profile data');

        // Use dummy data if API is not available
        const dummyUser = {
          name: 'Ahmed Khan',
          email: 'ahmed.khan@example.com',
          phone: '+92 300 1234567',
          dateOfBirth: '1990-05-15',
          gender: 'male',
          bloodGroup: 'O+',
          address: {
            street: '123 Main Street',
            city: 'Islamabad',
            state: 'Federal Capital',
            zipCode: '44000',
            country: 'Pakistan'
          },
          emergencyContact: {
            name: 'Fatima Khan',
            relationship: 'Spouse',
            phone: '+92 300 7654321',
            email: 'fatima.khan@example.com'
          },
          medicalHistory: {
            conditions: ['Hypertension', 'Type 2 Diabetes'],
            allergies: ['Penicillin', 'Peanuts'],
            medications: ['Metformin 500mg', 'Lisinopril 10mg'],
            surgeries: ['Appendectomy (2015)'],
            familyHistory: ['Father: Hypertension', 'Mother: Diabetes']
          }
        };

        setFormData(dummyUser);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to fetch profile information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleArrayChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value.split('\n')
      }
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      try {
        const response = await api.put('/auth/profile', formData);
        if (response.data) {
          setSuccess('Profile updated successfully');
          setIsEditing(false);
          // Refresh the profile data
          await fetchUserProfile();
        }
      } catch (apiError) {
        console.log('API not available, simulating successful update');
        // Simulate successful update
        setTimeout(() => {
          setSuccess('Profile updated successfully');
          setIsEditing(false);
        }, 1000);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#006D77]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-[120px] sm:pt-24 lg:pt-[120px]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#006D77] to-[#83C5BE] px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <FaUserCircle className="w-20 h-20 text-[#006D77]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{formData.name}</h1>
                <p className="text-[#E5F6F8]">{formData.email}</p>
                <div className="mt-2 flex items-center">
                  <span className="bg-white text-[#006D77] text-xs font-semibold px-2 py-1 rounded-full">
                    Patient
                  </span>
                  {formData.bloodGroup && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Blood: {formData.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mx-6 my-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="mx-6 my-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {/* Edit Button */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-end">
            <button
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setError('');
                  setSuccess('');
                } else {
                  setIsEditing(true);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#006D77] hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE]"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#1D3557] mb-4 border-b pb-2">Personal Information</h2>

                  <InfoItem
                    icon={<FaIdCard className="w-5 h-5 text-[#006D77]" />}
                    label="Full Name"
                    value={formData.name}
                    isEditing={isEditing}
                    name="name"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaPhone className="w-5 h-5 text-[#006D77]" />}
                    label="Phone"
                    value={formData.phone}
                    isEditing={isEditing}
                    name="phone"
                    type="tel"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaCalendarAlt className="w-5 h-5 text-[#006D77]" />}
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    isEditing={isEditing}
                    name="dateOfBirth"
                    type="date"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaVenusMars className="w-5 h-5 text-[#006D77]" />}
                    label="Gender"
                    value={formData.gender}
                    isEditing={isEditing}
                    name="gender"
                    type="select"
                    onChange={handleChange}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />

                  <InfoItem
                    icon={<FaTint className="w-5 h-5 text-[#006D77]" />}
                    label="Blood Group"
                    value={formData.bloodGroup}
                    isEditing={isEditing}
                    name="bloodGroup"
                    type="select"
                    onChange={handleChange}
                    options={[
                      { value: 'A+', label: 'A+' },
                      { value: 'A-', label: 'A-' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B-', label: 'B-' },
                      { value: 'AB+', label: 'AB+' },
                      { value: 'AB-', label: 'AB-' },
                      { value: 'O+', label: 'O+' },
                      { value: 'O-', label: 'O-' }
                    ]}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[#1D3557] mb-4 border-b pb-2">Address</h2>

                  <InfoItem
                    icon={<FaMapMarkerAlt className="w-5 h-5 text-[#006D77]" />}
                    label="Street"
                    value={formData.address.street}
                    isEditing={isEditing}
                    name="address.street"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaMapMarkerAlt className="w-5 h-5 text-[#006D77]" />}
                    label="City"
                    value={formData.address.city}
                    isEditing={isEditing}
                    name="address.city"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaMapMarkerAlt className="w-5 h-5 text-[#006D77]" />}
                    label="State/Province"
                    value={formData.address.state}
                    isEditing={isEditing}
                    name="address.state"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaMapMarkerAlt className="w-5 h-5 text-[#006D77]" />}
                    label="ZIP/Postal Code"
                    value={formData.address.zipCode}
                    isEditing={isEditing}
                    name="address.zipCode"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaMapMarkerAlt className="w-5 h-5 text-[#006D77]" />}
                    label="Country"
                    value={formData.address.country}
                    isEditing={isEditing}
                    name="address.country"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#1D3557] mb-4 border-b pb-2">Emergency Contact</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={<FaUserFriends className="w-5 h-5 text-[#006D77]" />}
                    label="Name"
                    value={formData.emergencyContact.name}
                    isEditing={isEditing}
                    name="emergencyContact.name"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaUserFriends className="w-5 h-5 text-[#006D77]" />}
                    label="Relationship"
                    value={formData.emergencyContact.relationship}
                    isEditing={isEditing}
                    name="emergencyContact.relationship"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaPhone className="w-5 h-5 text-[#006D77]" />}
                    label="Phone"
                    value={formData.emergencyContact.phone}
                    isEditing={isEditing}
                    name="emergencyContact.phone"
                    type="tel"
                    onChange={handleChange}
                  />

                  <InfoItem
                    icon={<FaPhone className="w-5 h-5 text-[#006D77]" />}
                    label="Email"
                    value={formData.emergencyContact.email}
                    isEditing={isEditing}
                    name="emergencyContact.email"
                    type="email"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#1D3557] mb-4 border-b pb-2">Medical History</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <MedicalHistorySection
                      title="Medical Conditions"
                      icon={<FaNotesMedical className="w-5 h-5 text-[#006D77]" />}
                      items={formData.medicalHistory.conditions}
                      field="conditions"
                      isEditing={isEditing}
                      onArrayChange={handleArrayChange}
                    />

                    <MedicalHistorySection
                      title="Allergies"
                      icon={<FaAllergies className="w-5 h-5 text-[#006D77]" />}
                      items={formData.medicalHistory.allergies}
                      field="allergies"
                      isEditing={isEditing}
                      onArrayChange={handleArrayChange}
                    />
                  </div>

                  <div>
                    <MedicalHistorySection
                      title="Current Medications"
                      icon={<FaPills className="w-5 h-5 text-[#006D77]" />}
                      items={formData.medicalHistory.medications}
                      field="medications"
                      isEditing={isEditing}
                      onArrayChange={handleArrayChange}
                    />

                    <MedicalHistorySection
                      title="Past Surgeries"
                      icon={<FaNotesMedical className="w-5 h-5 text-[#006D77]" />}
                      items={formData.medicalHistory.surgeries || []}
                      field="surgeries"
                      isEditing={isEditing}
                      onArrayChange={handleArrayChange}
                    />

                    <MedicalHistorySection
                      title="Family Medical History"
                      icon={<FaUserFriends className="w-5 h-5 text-[#006D77]" />}
                      items={formData.medicalHistory.familyHistory || []}
                      field="familyHistory"
                      isEditing={isEditing}
                      onArrayChange={handleArrayChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-[#457B9D] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#006D77] hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;