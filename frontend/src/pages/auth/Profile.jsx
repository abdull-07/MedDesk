import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Patient specific fields
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    insuranceProvider: '',
    insuranceNumber: '',
    
    // Doctor specific fields
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    education: '',
    hospitalAffiliation: '',
    availableHours: {
      start: '',
      end: '',
    },
    consultationFee: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setFormData(data.profile);
        setUserRole(data.role);
      } else {
        setError('Failed to fetch profile information');
      }
    } catch (err) {
      setError('An error occurred while fetching your profile');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (label, value, name = '') => (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-[#1D3557]">{label}</dt>
      <dd className="mt-1 text-sm text-[#457B9D] sm:mt-0 sm:col-span-2">
        {isEditing && name ? (
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
          />
        ) : (
          value || 'Not provided'
        )}
      </dd>
    </div>
  );

  const renderCommonFields = () => (
    <>
      <div className="border-t border-gray-200">
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-[#1D3557]">Full name</dt>
          <dd className="mt-1 text-sm text-[#457B9D] sm:mt-0 sm:col-span-2">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            ) : (
              `${formData.firstName} ${formData.lastName}`
            )}
          </dd>
        </div>
        {renderField('Email', formData.email)}
        {renderField('Phone Number', formData.phoneNumber, 'phoneNumber')}
        {renderField('Date of Birth', formData.dateOfBirth, 'dateOfBirth')}
        {renderField('City', formData.city, 'city')}
        {renderField('State', formData.state, 'state')}
        {renderField('ZIP Code', formData.zipCode, 'zipCode')}
      </div>
    </>
  );

  const renderPatientFields = () => (
    <>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-[#1D3557] px-4 sm:px-6">Emergency Contact</h3>
        {renderField('Name', formData.emergencyContact.name, 'emergencyContact.name')}
        {renderField('Relationship', formData.emergencyContact.relationship, 'emergencyContact.relationship')}
        {renderField('Phone', formData.emergencyContact.phone, 'emergencyContact.phone')}
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-[#1D3557] px-4 sm:px-6">Insurance Information</h3>
        {renderField('Provider', formData.insuranceProvider, 'insuranceProvider')}
        {renderField('Number', formData.insuranceNumber, 'insuranceNumber')}
      </div>
    </>
  );

  const renderDoctorFields = () => (
    <>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-[#1D3557] px-4 sm:px-6">Professional Information</h3>
        {renderField('Specialization', formData.specialization, 'specialization')}
        {renderField('License Number', formData.licenseNumber, 'licenseNumber')}
        {renderField('Years of Experience', formData.yearsOfExperience, 'yearsOfExperience')}
        {renderField('Education', formData.education, 'education')}
        {renderField('Hospital Affiliation', formData.hospitalAffiliation, 'hospitalAffiliation')}
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-[#1D3557] px-4 sm:px-6">Availability & Fees</h3>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt className="text-sm font-medium text-[#1D3557]">Available Hours</dt>
          <dd className="mt-1 text-sm text-[#457B9D] sm:mt-0 sm:col-span-2">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  name="availableHours.start"
                  value={formData.availableHours.start}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
                />
                <input
                  type="time"
                  name="availableHours.end"
                  value={formData.availableHours.end}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006D77] focus:ring-[#006D77] sm:text-sm"
                />
              </div>
            ) : (
              `${formData.availableHours.start} - ${formData.availableHours.end}`
            )}
          </dd>
        </div>
        {renderField('Consultation Fee ($)', formData.consultationFee, 'consultationFee')}
      </div>
    </>
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
              <h2 className="text-3xl font-extrabold text-[#1D3557]">Profile</h2>
              <p className="mt-1 max-w-2xl text-sm text-[#457B9D]">
                Your personal and account details
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
              {renderCommonFields()}
              {userRole === 'patient' && renderPatientFields()}
              {userRole === 'doctor' && renderDoctorFields()}
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