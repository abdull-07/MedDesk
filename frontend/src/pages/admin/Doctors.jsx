import { useState, useEffect } from 'react';
import api from '../../utils/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]); // Store all doctors for filtering
  const [specialties, setSpecialties] = useState([]); // Store unique specialties
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/admin/doctors');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        const doctorsData = Array.isArray(data) ? data : [];

        // Store all doctors
        setAllDoctors(doctorsData);
        setDoctors(doctorsData);

        // Extract unique specialties from the doctors data
        const uniqueSpecialties = [...new Set(
          doctorsData
            .map(doctor => doctor.specialization)
            .filter(specialty => specialty && specialty.trim() !== '')
        )].sort();

        setSpecialties(uniqueSpecialties);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors');
        setDoctors([]);
        setAllDoctors([]);
        setSpecialties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleVerificationAction = async (doctorId, action) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const endpoint = action === 'approve'
        ? `/api/admin/doctors/${doctorId}/verify`
        : `/api/admin/doctors/${doctorId}/reject`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: action === 'reject' ? JSON.stringify({ reason: 'Application rejected by admin' }) : undefined,
      });

      if (response.ok) {
        // Update the local state
        setDoctors(currentDoctors =>
          currentDoctors.map(doctor =>
            doctor._id === doctorId
              ? { ...doctor, isVerified: action === 'approve' }
              : doctor
          )
        );
        setIsModalOpen(false);

        // Show success message
        alert(`Doctor ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      } else {
        throw new Error(`Failed to ${action} doctor`);
      }
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert(`Failed to ${action} doctor: ${error.message}`);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Map backend status to frontend status
    const doctorStatus = doctor.isVerified ? 'verified' : 'pending';
    const matchesStatus = selectedStatus === 'all' || doctorStatus === selectedStatus;

    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const VerificationModal = ({ doctor }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-[#1D3557]">
              Verify Doctor Application
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-[#006D77] flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {doctor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-[#1D3557]">{doctor.name}</h4>
                <p className="text-[#457B9D]">{doctor.email}</p>
                <p className="text-[#457B9D]">{doctor.specialization || 'Not specified'}</p>
                <p className="text-sm text-[#457B9D]">
                  Status: {doctor.isVerified ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-[#1D3557] mb-2">Professional Information</h5>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#1D3557]">Qualifications</p>
                  <p className="text-sm text-[#457B9D]">{doctor.qualifications || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1D3557]">Clinic/Hospital</p>
                  <p className="text-sm text-[#457B9D]">{doctor.clinicName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1D3557]">Experience</p>
                  <p className="text-sm text-[#457B9D]">
                    {doctor.experience ? `${doctor.experience} years` : 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1D3557]">Consultation Fee</p>
                  <p className="text-sm text-[#457B9D]">
                    {doctor.consultationFee ? `$${doctor.consultationFee}` : 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-[#1D3557] mb-2">License Information</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">License Number:</span> {doctor.licenseNumber || 'Not provided'}</p>
                <p><span className="font-medium">Registration Date:</span> {new Date(doctor.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {doctor.about && (
              <div>
                <h5 className="font-medium text-[#1D3557] mb-2">About</h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-[#457B9D]">{doctor.about}</p>
                </div>
              </div>
            )}

            {doctor.services && doctor.services.length > 0 && (
              <div>
                <h5 className="font-medium text-[#1D3557] mb-2">Services</h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {doctor.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#E5F6F8] text-[#006D77] text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {doctor.languages && doctor.languages.length > 0 && (
              <div>
                <h5 className="font-medium text-[#1D3557] mb-2">Languages</h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              {!doctor.isVerified && (
                <>
                  <button
                    onClick={() => handleVerificationAction(doctor._id, 'reject')}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerificationAction(doctor._id, 'approve')}
                    className="px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005c66]"
                  >
                    Approve
                  </button>
                </>
              )}
              {doctor.isVerified && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  Already Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-[120px] sm:pt-24 lg:pt-[120px]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Verify Doctors</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-[#457B9D] mb-2">
              Search Doctors
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77] pl-10"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#457B9D] mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#457B9D] mb-2">
              Filter by Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-[#457B9D]">
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor) => {
                    const doctorStatus = doctor.isVerified ? 'verified' : 'pending';
                    return (
                      <tr key={doctor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#006D77] flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {doctor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#1D3557]">
                                {doctor.name}
                              </div>
                              <div className="text-sm text-[#457B9D]">
                                {doctor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#457B9D]">
                          {doctor.specialization || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${doctorStatus === 'verified' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'}`}
                          >
                            {doctorStatus.charAt(0).toUpperCase() + doctorStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#457B9D]">
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => {
                              setCurrentDoctor(doctor);
                              setIsModalOpen(true);
                            }}
                            className="text-[#006D77] hover:text-[#83C5BE]"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && currentDoctor && (
        <VerificationModal doctor={currentDoctor} />
      )}
    </div>
  );
};

export default Doctors; 