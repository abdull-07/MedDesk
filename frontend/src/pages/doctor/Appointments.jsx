import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/doctor/appointments?status=${activeTab}`);
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/doctor/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppointments(currentAppointments =>
          currentAppointments.map(appointment =>
            appointment.id === appointmentId
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status');
    }
  };

  const AppointmentCard = ({ appointment }) => {
    const statusColors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={appointment.patient.avatar}
              alt={appointment.patient.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#1D3557]">
                {appointment.patient.name}
              </h3>
              <p className="text-sm text-[#457B9D]">
                {appointment.patient.email}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[appointment.status]
            }`}
          >
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-[#457B9D]">Date</p>
            <p className="font-medium text-[#1D3557]">
              {format(new Date(appointment.date), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#457B9D]">Time</p>
            <p className="font-medium text-[#1D3557]">{appointment.time}</p>
          </div>
          <div>
            <p className="text-sm text-[#457B9D]">Type</p>
            <p className="font-medium text-[#1D3557]">{appointment.type}</p>
          </div>
          <div>
            <p className="text-sm text-[#457B9D]">Duration</p>
            <p className="font-medium text-[#1D3557]">{appointment.duration} mins</p>
          </div>
        </div>
        {appointment.notes && (
          <div className="mb-4">
            <p className="text-sm text-[#457B9D]">Notes</p>
            <p className="text-[#1D3557]">{appointment.notes}</p>
          </div>
        )}
        {appointment.status === 'pending' && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
              className="flex-1 bg-[#006D77] text-white px-4 py-2 rounded-md hover:bg-[#005c66] transition-colors duration-300"
            >
              Confirm
            </button>
            <button
              onClick={() => handleStatusChange(appointment.id, 'cancelled')}
              className="flex-1 border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Appointments</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#006D77] text-[#006D77]'
                      : 'border-transparent text-[#457B9D] hover:text-[#1D3557] hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="space-y-6">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-[#457B9D]">No {activeTab} appointments</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments; 