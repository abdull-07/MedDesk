import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('week'); // 'week' or 'slots'
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00',
    slotDuration: 30, // in minutes
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/doctor/schedule');
        const data = await response.json();
        setTimeSlots(data.slots);
        setWorkingHours(data.workingHours);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Failed to load schedule');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleSlotToggle = async (date, time) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/doctor/schedule/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time }),
      });

      if (response.ok) {
        setTimeSlots(currentSlots => {
          const slotIndex = currentSlots.findIndex(
            slot => slot.date === date && slot.time === time
          );
          if (slotIndex === -1) {
            return [...currentSlots, { date, time, available: true }];
          }
          return currentSlots.filter((_, index) => index !== slotIndex);
        });
      }
    } catch (error) {
      console.error('Error toggling time slot:', error);
      alert('Failed to update time slot');
    }
  };

  const updateWorkingHours = async (newHours) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/doctor/schedule/working-hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHours),
      });

      if (response.ok) {
        setWorkingHours(newHours);
      }
    } catch (error) {
      console.error('Error updating working hours:', error);
      alert('Failed to update working hours');
    }
  };

  const WeekView = () => {
    const startDate = startOfWeek(selectedDate);
    const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((date) => (
            <div
              key={date.toString()}
              className="bg-white p-4"
            >
              <h3 className="text-sm font-medium text-[#1D3557]">
                {format(date, 'EEE')}
              </h3>
              <p className="mt-1 text-2xl font-semibold text-[#457B9D]">
                {format(date, 'd')}
              </p>
              <div className="mt-2 space-y-1">
                {timeSlots
                  .filter(slot => isSameDay(new Date(slot.date), date))
                  .map(slot => (
                    <div
                      key={`${slot.date}-${slot.time}`}
                      className="text-sm p-1 rounded bg-[#E5F6F8] text-[#006D77]"
                    >
                      {slot.time}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SlotsView = () => {
    const timeSlots = [];
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    for (let time = startTime; time < endTime; time += workingHours.slotDuration) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      timeSlots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {timeSlots.map((time) => {
            const isAvailable = true; // TODO: Check availability
            return (
              <button
                key={time}
                onClick={() => handleSlotToggle(format(selectedDate, 'yyyy-MM-dd'), time)}
                className={`p-4 rounded-lg border ${
                  isAvailable
                    ? 'border-[#006D77] bg-[#E5F6F8] text-[#006D77]'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                } hover:shadow-md transition-all duration-300`}
              >
                {time}
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#1D3557]">Manage Schedule</h1>
          <div className="flex items-center space-x-4">
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

        <WorkingHoursForm />

        {view === 'week' ? <WeekView /> : <SlotsView />}
      </div>
    </div>
  );
};

export default Schedule; 