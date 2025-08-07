import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Fetch all patients for this doctor using the new endpoint
        const response = await api.get('/patients');
        const patientsArray = response.data || [];
        
        // Format the data to ensure consistency
        const formattedPatients = patientsArray.map(patient => ({
          _id: patient._id,
          name: patient.name || 'Unknown Patient',
          email: patient.email || 'No email',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name || 'U')}&background=83C5BE&color=fff`,
          age: patient.age || 'N/A',
          gender: patient.gender || 'N/A',
          phone: patient.phone || 'N/A',
          medicalHistory: patient.medicalHistory || { conditions: [], allergies: [], medications: [], surgeries: [], familyHistory: [] },
          notes: patient.notes || '',
          recentAppointments: patient.recentAppointments || []
        }));
        
        setPatients(formattedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to load patients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PatientCard = ({ patient }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-[#1D3557]">
              {patient.name}
            </h3>
            <p className="text-sm text-[#457B9D]">{patient.email}</p>
            <div className="mt-1 flex items-center space-x-4">
              <span className="text-sm text-[#457B9D]">
                Age: {patient.age}
              </span>
              <span className="text-sm text-[#457B9D]">
                Gender: {patient.gender}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedPatient(selectedPatient?._id === patient._id ? null : patient)}
          className="text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
        >
          {selectedPatient?._id === patient._id ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {selectedPatient?._id === patient._id && (
        <div className="mt-6 border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-[#1D3557] mb-2">
                Medical History
              </h4>
              <div className="space-y-3">
                {patient.medicalHistory.conditions && patient.medicalHistory.conditions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#1D3557] mb-1">Conditions:</p>
                    {patient.medicalHistory.conditions.map((condition, index) => (
                      <div key={index} className="text-sm text-[#457B9D] bg-gray-50 p-2 rounded mb-1">
                        {condition}
                      </div>
                    ))}
                  </div>
                )}
                {patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#1D3557] mb-1">Allergies:</p>
                    {patient.medicalHistory.allergies.map((allergy, index) => (
                      <div key={index} className="text-sm text-[#457B9D] bg-red-50 p-2 rounded mb-1">
                        {allergy}
                      </div>
                    ))}
                  </div>
                )}
                {patient.medicalHistory.medications && patient.medicalHistory.medications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#1D3557] mb-1">Current Medications:</p>
                    {patient.medicalHistory.medications.map((medication, index) => (
                      <div key={index} className="text-sm text-[#457B9D] bg-blue-50 p-2 rounded mb-1">
                        {medication}
                      </div>
                    ))}
                  </div>
                )}
                {(!patient.medicalHistory.conditions || patient.medicalHistory.conditions.length === 0) &&
                 (!patient.medicalHistory.allergies || patient.medicalHistory.allergies.length === 0) &&
                 (!patient.medicalHistory.medications || patient.medicalHistory.medications.length === 0) && (
                  <div className="text-sm text-[#457B9D] bg-gray-50 p-2 rounded">
                    No medical history available
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#1D3557] mb-2">
                Recent Appointments
              </h4>
              <div className="space-y-2">
                {patient.recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gray-50 p-2 rounded"
                  >
                    <p className="text-sm font-medium text-[#1D3557]">
                      {format(new Date(appointment.date), 'MMM d, yyyy')} - {appointment.time}
                    </p>
                    <p className="text-sm text-[#457B9D]">
                      {appointment.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-[#1D3557] mb-2">
                Notes
              </h4>
              <textarea
                value={patient.notes || ''}
                onChange={async (e) => {
                  // Update local state immediately for better UX
                  const newNotes = e.target.value;
                  setPatients(currentPatients =>
                    currentPatients.map(p =>
                      p._id === patient._id
                        ? { ...p, notes: newNotes }
                        : p
                    )
                  );
                  
                  // Update selected patient state as well
                  if (selectedPatient?._id === patient._id) {
                    setSelectedPatient({ ...selectedPatient, notes: newNotes });
                  }
                }}
                placeholder="Add notes about the patient..."
                className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-[#006D77] focus:border-[#006D77]"
              />
            </div>
          </div>
        </div>
      )}
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Patients</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name or email..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#006D77] focus:border-[#006D77] pl-10"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
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

        <div className="space-y-6">
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-[#457B9D]">
                {searchQuery
                  ? 'No patients found matching your search'
                  : 'No patients yet'}
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients; 