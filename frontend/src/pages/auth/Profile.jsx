import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Profile = () => {
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
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: [],
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
      const response = await api.get('/auth/profile');
      if (response.data) {
        // Transform date format for date input
        const userData = {
          ...response.data,
          dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split('T')[0] : '',
          // Initialize nested objects if they don't exist
          address: response.data.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
          },
          emergencyContact: response.data.emergencyContact || {
            name: '',
            relationship: '',
            phone: '',
          },
          medicalHistory: response.data.medicalHistory || {
            conditions: [],
            allergies: [],
            medications: [],
          }
        };
        setFormData(userData);
        console.log('Profile data loaded:', userData);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
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
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value.split('\n').filter(item => item.trim() !== '')
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        // Refresh the profile data
        await fetchUserProfile();
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (label, value, name = '', type = 'text') => (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-[#1D3557]">{label}</dt>
      <dd className="mt-1 text-sm text-[#457B9D] sm:mt-0 sm:col-span-2">
        {isEditing && name ? (
          type === 'select' ? (
            <select
              name={name}
              value={value || ''}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
            >
              <option value="">Select {label}</option>
              {name === 'gender' && (
                <>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </>
              )}
              {name === 'bloodGroup' && (
                <>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </>
              )}
            </select>
          ) : (
          <input
              type={type}
            name={name}
              value={value || ''}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
          />
          )
        ) : (
          value || 'Not provided'
        )}
      </dd>
    </div>
  );

  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#006D77]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1D3557]">My Profile</h2>
              <p className="mt-1 max-w-2xl text-sm text-[#457B9D]">
                Manage your personal information and medical history
              </p>
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  fetchUserProfile();
                } else {
                  setIsEditing(true);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#006D77] hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE]"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="mx-4 my-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="mx-4 my-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                <h3 className="text-lg font-medium text-[#1D3557]">Personal Information</h3>
              </div>
              {renderField('Full Name', formData.name, 'name')}
              {renderField('Email', formData.email, 'email', 'email')}
              {renderField('Phone', formData.phone, 'phone', 'tel')}
              {renderField('Date of Birth', formData.dateOfBirth, 'dateOfBirth', 'date')}
              {renderField('Gender', formData.gender, 'gender', 'select')}
              {renderField('Blood Group', formData.bloodGroup, 'bloodGroup', 'select')}
            </div>

            <div className="border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                <h3 className="text-lg font-medium text-[#1D3557]">Address</h3>
              </div>
              {renderField('Street', formData.address.street, 'address.street')}
              {renderField('City', formData.address.city, 'address.city')}
              {renderField('State', formData.address.state, 'address.state')}
              {renderField('ZIP Code', formData.address.zipCode, 'address.zipCode')}
            </div>

            <div className="border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                <h3 className="text-lg font-medium text-[#1D3557]">Emergency Contact</h3>
              </div>
              {renderField('Name', formData.emergencyContact.name, 'emergencyContact.name')}
              {renderField('Relationship', formData.emergencyContact.relationship, 'emergencyContact.relationship')}
              {renderField('Phone', formData.emergencyContact.phone, 'emergencyContact.phone', 'tel')}
            </div>

            <div className="border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                <h3 className="text-lg font-medium text-[#1D3557]">Medical History</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#1D3557] mb-2">Medical Conditions</label>
                  {isEditing ? (
                    <textarea
                      value={formData.medicalHistory.conditions.join('\n')}
                      onChange={(e) => handleArrayChange('conditions', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
                      rows={3}
                      placeholder="Enter each condition on a new line"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-sm text-[#457B9D]">
                      {formData.medicalHistory.conditions.length > 0 ? (
                        formData.medicalHistory.conditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No medical conditions listed</li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#1D3557] mb-2">Allergies</label>
                  {isEditing ? (
                    <textarea
                      value={formData.medicalHistory.allergies.join('\n')}
                      onChange={(e) => handleArrayChange('allergies', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
                      rows={3}
                      placeholder="Enter each allergy on a new line"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-sm text-[#457B9D]">
                      {formData.medicalHistory.allergies.length > 0 ? (
                        formData.medicalHistory.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No allergies listed</li>
                      )}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D3557] mb-2">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      value={formData.medicalHistory.medications.join('\n')}
                      onChange={(e) => handleArrayChange('medications', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
                      rows={3}
                      placeholder="Enter each medication on a new line"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-sm text-[#457B9D]">
                      {formData.medicalHistory.medications.length > 0 ? (
                        formData.medicalHistory.medications.map((medication, index) => (
                          <li key={index}>{medication}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No current medications listed</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="px-4 py-5 sm:px-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchUserProfile();
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

export default Profile; 