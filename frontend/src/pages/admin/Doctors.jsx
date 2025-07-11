import { useState, useEffect } from 'react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/admin/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleVerificationAction = async (doctorId, action) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/admin/doctors/${doctorId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setDoctors(currentDoctors =>
          currentDoctors.map(doctor =>
            doctor.id === doctorId
              ? { ...doctor, status: action === 'approve' ? 'verified' : 'rejected' }
              : doctor
          )
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert('Failed to update doctor status');
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || doctor.status === selectedStatus;
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
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
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-20 h-20 rounded-full"
              />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-[#1D3557]">{doctor.name}</h4>
                <p className="text-[#457B9D]">{doctor.email}</p>
                <p className="text-[#457B9D]">{doctor.specialty}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-[#1D3557] mb-2">Education</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                {doctor.education.map((edu, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-[#457B9D]">{edu.institution}</p>
                    <p className="text-sm text-[#457B9D]">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-[#1D3557] mb-2">License Information</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">License Number:</span> {doctor.license.number}</p>
                <p><span className="font-medium">Issuing Authority:</span> {doctor.license.authority}</p>
                <p><span className="font-medium">Valid Until:</span> {doctor.license.validUntil}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-[#1D3557] mb-2">Documents</h5>
              <div className="grid grid-cols-2 gap-4">
                {doctor.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border rounded-lg hover:border-[#006D77]"
                  >
                    <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="ml-2 text-sm text-[#457B9D]">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleVerificationAction(doctor.id, 'reject')}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleVerificationAction(doctor.id, 'approve')}
                className="px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005c66]"
              >
                Approve
              </button>
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
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
              <option value="cardiology">Cardiology</option>
              <option value="dermatology">Dermatology</option>
              <option value="neurology">Neurology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="psychiatry">Psychiatry</option>
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
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full"
                          />
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
                        {doctor.specialty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${doctor.status === 'verified' ? 'bg-green-100 text-green-800' :
                            doctor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#457B9D]">
                        {new Date(doctor.appliedAt).toLocaleDateString()}
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
                  ))
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