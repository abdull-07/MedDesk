import { useState, useEffect } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualifications: [],
    experience: '',
    bio: '',
    languages: [],
    consultationFee: '',
    avatar: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/doctor/profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/doctor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setSuccessMessage('Profile updated successfully');
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // TODO: Replace with actual image upload API call
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/doctor/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => ({ ...prev, avatar: data.avatarUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const FormSection = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-[#1D3557] mb-6">{title}</h2>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Edit Profile</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="flex items-center mb-6">
              <img
                src={profile.avatar || 'https://via.placeholder.com/150'}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="ml-6">
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm text-[#457B9D]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Professional Details">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Qualifications
                </label>
                <textarea
                  value={profile.qualifications.join('\n')}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      qualifications: e.target.value.split('\n').filter(Boolean),
                    }))
                  }
                  placeholder="Enter each qualification on a new line"
                  className="w-full h-32 rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={profile.experience}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full h-32 rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Languages
                </label>
                <textarea
                  value={profile.languages.join('\n')}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      languages: e.target.value.split('\n').filter(Boolean),
                    }))
                  }
                  placeholder="Enter each language on a new line"
                  className="w-full h-24 rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  value={profile.consultationFee}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      consultationFee: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Address">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={profile.address.street}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={profile.address.city}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={profile.address.state}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={profile.address.zipCode}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, zipCode: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005c66] transition-colors duration-300 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 