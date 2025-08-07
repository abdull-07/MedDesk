import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import api from '../../utils/api';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('week'); // 'week', 'slots', or 'month'
  const [schedule, setSchedule] = useState(null);
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00',
    slotDuration: 30, // in minutes
  });

  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        console.log('Step 1: Fetching user profile to verify role...');
        
        // Step 1: Get user data to verify role
        const userResponse = await api.get('/auth/profile');
        // Handle nested response structure - API returns {success: true, data: {user data}}
        const userData = userResponse.data.data || userResponse.data;
        
        console.log('User data received:', userData);
        console.log('User role:', userData?.role);
        
        // Verify this is a doctor
        if (!userData || userData.role !== 'doctor') {
          console.log('Role check failed. User role:', userData?.role);
          setError('Access denied. Only doctors can manage schedules.');
          return;
        }
        
        console.log('Step 2: User verified as doctor, now fetching doctor profile...');
        
        // Step 2: Get doctor profile data using userId reference
        // Since doctor collection references user._id as userId, we need to find by userId
        const doctorResponse = await api.get(`/doctors/user/${userData._id}`);
        // Handle potential nested response structure for doctor data too
        const doctorData = doctorResponse.data.data || doctorResponse.data;
        
        console.log('Doctor profile data received:', doctorData);
        console.log('Doctor availability:', doctorData.availability);
        
        setSchedule(doctorData);
        
        // Check if availability exists
        if (!doctorData.availability) {
          console.log('No availability data found, using defaults');
          setWorkingHours({
            start: '09:00',
            end: '17:00',
            slotDuration: 30
          });
        } else {
          // Extract working hours from Monday's availability
          const mondayAvailability = doctorData.availability.monday;
          console.log('Monday availability:', mondayAvailability);
          
          if (mondayAvailability && mondayAvailability.isAvailable && mondayAvailability.slots && mondayAvailability.slots.length > 0) {
            const firstSlot = mondayAvailability.slots[0];
            const lastSlot = mondayAvailability.slots[mondayAvailability.slots.length - 1];
            
            const newWorkingHours = {
              start: firstSlot.startTime,
              end: lastSlot.endTime,
              slotDuration: 30
            };
            console.log('Setting working hours from availability:', newWorkingHours);
            setWorkingHours(newWorkingHours);
          } else {
            console.log('No Monday availability found, using defaults');
            setWorkingHours({
              start: '09:00',
              end: '17:00',
              slotDuration: 30
            });
          }
        }
        
        setTimeSlots([]);
        
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        if (error.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (error.response?.status === 403) {
          setError('Access denied. Only doctors can manage schedules.');
        } else if (error.response?.status === 404) {
          setError('Doctor profile not found. Please contact support.');
        } else {
          setError(`Failed to load schedule: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorAvailability();
  }, []);

  const handleSlotToggle = async (date, time) => {
    try {
      // For now, this toggles availability locally
      // In a full implementation, you might want to add/remove break times or date overrides
      setTimeSlots(currentSlots => {
        const slotIndex = currentSlots.findIndex(
          slot => slot.date === date && slot.time === time
        );
        if (slotIndex === -1) {
          return [...currentSlots, { date, time, available: true }];
        }
        return currentSlots.filter((_, index) => index !== slotIndex);
      });
    } catch (error) {
      console.error('Error toggling time slot:', error);
      setError('Failed to update time slot');
    }
  };

  const updateWorkingHours = async (newHours) => {
    try {
      console.log('Updating working hours:', newHours);
      
      // First update local state immediately for better UX
      setWorkingHours(newHours);
      
      // Clear any previous errors
      setError('');
      
      // If doctor data is not loaded yet, just update local state
      if (!schedule || !schedule.availability) {
        console.log('Doctor availability not loaded yet, updating local state only');
        return;
      }

      // Create time slots based on new working hours
      const generateTimeSlots = (start, end, duration) => {
        const slots = [];
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        for (let time = startTime; time < endTime; time += duration) {
          const hour = Math.floor(time / 60);
          const minute = time % 60;
          const startTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const endTimeStr = `${Math.floor((time + duration) / 60).toString().padStart(2, '0')}:${((time + duration) % 60).toString().padStart(2, '0')}`;
          slots.push({ startTime: startTimeStr, endTime: endTimeStr });
        }
        return slots;
      };

      // Update availability for all working days
      const updatedAvailability = { ...schedule.availability };
      const newSlots = generateTimeSlots(newHours.start, newHours.end, newHours.slotDuration);
      
      // Update Monday through Friday as working days
      const workingDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      workingDays.forEach(day => {
        updatedAvailability[day] = {
          isAvailable: true,
          slots: newSlots
        };
      });

      const updateData = {
        availability: updatedAvailability
      };

      console.log('Sending availability update to server:', updateData);
      // Update doctor profile through auth profile endpoint
      await api.put('/auth/profile', updateData);
      console.log('Doctor availability updated successfully');
      
      // Update doctor state
      setSchedule(prev => ({
        ...prev,
        availability: updatedAvailability
      }));

    } catch (error) {
      console.error('Error updating working hours:', error);
      setError('Failed to update working hours. Please try again.');
      
      // Revert local state on error
      if (schedule && schedule.availability) {
        const mondayAvailability = schedule.availability.monday;
        if (mondayAvailability && mondayAvailability.isAvailable && mondayAvailability.slots.length > 0) {
          const firstSlot = mondayAvailability.slots[0];
          const lastSlot = mondayAvailability.slots[mondayAvailability.slots.length - 1];
          
          const revertedHours = {
            start: firstSlot.startTime,
            end: lastSlot.endTime,
            slotDuration: 30
          };
          console.log('Reverting to previous working hours:', revertedHours);
          setWorkingHours(revertedHours);
        }
      }
    }
  };

  const WeekView = () => {
    const startDate = startOfWeek(selectedDate);
    const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));

    const getDayAvailability = (dayOfWeek) => {
      if (!schedule?.availability) return null;
      
      // Map day numbers to day names
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayOfWeek];
      
      return schedule.availability[dayName];
    };

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((date, index) => {
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const dayAvailability = getDayAvailability(dayOfWeek);
            const isWorkingDay = dayAvailability?.isAvailable || false;
            
            return (
              <div
                key={date.toString()}
                className={`bg-white p-4 min-h-[200px] ${
                  isSameDay(date, selectedDate) ? 'ring-2 ring-[#006D77]' : ''
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <h3 className="text-sm font-medium text-[#1D3557]">
                  {format(date, 'EEE')}
                </h3>
                <p className="mt-1 text-2xl font-semibold text-[#457B9D]">
                  {format(date, 'd')}
                </p>
                
                {isWorkingDay ? (
                  <div className="mt-3">
                    <div className="text-xs text-green-600 font-medium mb-2">
                      Working Day
                    </div>
                    {dayAvailability.slots && dayAvailability.slots.length > 0 && (
                      <div className="text-xs text-[#457B9D] mb-2">
                        {dayAvailability.slots[0].startTime} - {dayAvailability.slots[dayAvailability.slots.length - 1].endTime}
                      </div>
                    )}
                    
                    {/* Show available slots for the selected date */}
                    {isSameDay(date, selectedDate) && dayAvailability.slots && (
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                        {dayAvailability.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="text-xs p-1 rounded bg-[#E5F6F8] text-[#006D77]"
                          >
                            {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 font-medium">
                      Day Off
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MonthlyView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding days to complete the calendar grid
    const startDay = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.
    const paddingDays = Array.from({ length: startDay }, (_, i) => null);
    const allDays = [...paddingDays, ...monthDays];
    
    // Complete the last week if needed
    const remainingDays = 42 - allDays.length; // 6 weeks * 7 days = 42
    const endPaddingDays = Array.from({ length: remainingDays }, (_, i) => null);
    const calendarDays = [...allDays, ...endPaddingDays];

    const getDayAvailability = (dayOfWeek) => {
      if (!schedule?.availability) return null;
      
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayOfWeek];
      
      return schedule.availability[dayName];
    };

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Month header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1D3557]">
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
        </div>
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 px-3 py-2 text-center">
              <span className="text-sm font-medium text-[#457B9D]">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div key={index} className="bg-gray-50 h-24 p-2">
                  {/* Empty padding cell */}
                </div>
              );
            }
            
            const dayOfWeek = date.getDay();
            const dayAvailability = getDayAvailability(dayOfWeek);
            const isWorkingDay = dayAvailability?.isAvailable || false;
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={date.toString()}
                className={`bg-white h-24 p-2 cursor-pointer hover:bg-gray-50 ${
                  isSelected ? 'ring-2 ring-[#006D77] ring-inset' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-blue-600' : 'text-[#1D3557]'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    {isWorkingDay && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  
                  {isWorkingDay && dayAvailability.slots && dayAvailability.slots.length > 0 && (
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs text-[#457B9D] mb-1">
                        {dayAvailability.slots[0].startTime} - {dayAvailability.slots[dayAvailability.slots.length - 1].endTime}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dayAvailability.slots.length} slots
                      </div>
                    </div>
                  )}
                  
                  {!isWorkingDay && (
                    <div className="flex-1 flex items-center">
                      <span className="text-xs text-gray-400">Day Off</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const SlotsView = () => {
    // Get availability for the selected date
    const selectedDayOfWeek = selectedDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const selectedDayName = dayNames[selectedDayOfWeek];
    const dayAvailability = schedule?.availability?.[selectedDayName];

    if (!dayAvailability || !dayAvailability.isAvailable) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No availability set</h3>
            <p className="text-gray-500">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')} is marked as a day off.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Update your working hours to set availability for this day.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-[#1D3557]">
            Available Time Slots for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <p className="text-sm text-[#457B9D]">
            {dayAvailability.slots.length} slots available
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dayAvailability.slots.map((slot, index) => {
            const isAvailable = true; // All slots in availability are available by default
            return (
              <button
                key={index}
                onClick={() => handleSlotToggle(format(selectedDate, 'yyyy-MM-dd'), slot.startTime)}
                className={`p-4 rounded-lg border ${
                  isAvailable
                    ? 'border-[#006D77] bg-[#E5F6F8] text-[#006D77] hover:bg-[#006D77] hover:text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                } hover:shadow-md transition-all duration-300`}
              >
                <div className="text-sm font-medium">
                  {slot.startTime}
                </div>
                <div className="text-xs opacity-75">
                  to {slot.endTime}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const WorkingHoursForm = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-[#1D3557] mb-4">Working Hours</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#457B9D] mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={workingHours.start}
            onChange={(e) =>
              updateWorkingHours({ ...workingHours, start: e.target.value })
            }
            className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#457B9D] mb-2">
            End Time
          </label>
          <input
            type="time"
            value={workingHours.end}
            onChange={(e) =>
              updateWorkingHours({ ...workingHours, end: e.target.value })
            }
            className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#457B9D] mb-2">
            Slot Duration (minutes)
          </label>
          <select
            value={workingHours.slotDuration}
            onChange={(e) =>
              updateWorkingHours({
                ...workingHours,
                slotDuration: parseInt(e.target.value),
              })
            }
            className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
          </select>
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
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#1D3557]">Manage Schedule</h1>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006D77] focus:border-[#006D77]"
            />
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                view === 'week'
                  ? 'bg-[#006D77] text-white'
                  : 'text-[#006D77] hover:bg-[#E5F6F8]'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                view === 'month'
                  ? 'bg-[#006D77] text-white'
                  : 'text-[#006D77] hover:bg-[#E5F6F8]'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setView('slots')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                view === 'slots'
                  ? 'bg-[#006D77] text-white'
                  : 'text-[#006D77] hover:bg-[#E5F6F8]'
              }`}
            >
              Slots View
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {view === 'week' ? <WeekView /> : view === 'month' ? <MonthlyView /> : <SlotsView />}
      </div>
    </div>
  );
};

export default Schedule; 