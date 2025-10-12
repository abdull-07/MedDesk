import { useState, useEffect } from 'react';
import api from '../../utils/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          status: selectedStatus,
          date: selectedDate,
          search: searchQuery
        });

        const response = await api.get(`/admin/appointments?${queryParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentPage, selectedStatus, selectedDate, searchQuery]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/admin/appointments/${appointmentId}/status`, { status: newStatus });
      setAppointments(currentAppointments =>
        currentAppointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      alert('Appointment status updated successfully');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert(`Failed to update appointment status: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

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
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Manage Appointments</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-[#457B9D] mb-2">
              Search Appointments
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by patient or doctor name..."
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
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#457B9D] mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#457B9D] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-[#457B9D]">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => {
                    const { date, time } = formatDateTime(appointment.startTime);
                    return (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#006D77] flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {appointment.patient.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#1D3557]">
                                {appointment.patient.name}
                              </div>
                              <div className="text-sm text-[#457B9D]">
                                {appointment.patient.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#83C5BE] flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {appointment.doctor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#1D3557]">
                                {appointment.doctor.name}
                              </div>
                              <div className="text-sm text-[#457B9D]">
                                {appointment.doctor.specialization || 'Not specified'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#1D3557]">{date}</div>
                          <div className="text-sm text-[#457B9D]">{time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#457B9D]">
                          {appointment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                            className="rounded-md border-gray-300 text-sm focus:ring-[#006D77] focus:border-[#006D77]"
                          >
                            <option value="pending">Pending</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no-show">No Show</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                    ? 'text-gray-300'
                    : 'text-[#006D77] hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === index + 1
                      ? 'z-10 bg-[#E5F6F8] border-[#006D77] text-[#006D77]'
                      : 'bg-white text-[#457B9D] hover:bg-gray-50'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                    ? 'text-gray-300'
                    : 'text-[#006D77] hover:bg-gray-50'
                  }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments; 