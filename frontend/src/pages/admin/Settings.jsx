import { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'MedDesk',
    siteDescription: 'Your trusted healthcare platform',
    contactEmail: 'admin@meddesk.com',
    supportPhone: '+92-300-1234567',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    maxAppointmentsPerDay: 10,
    consultationFeeRange: {
      min: 50,
      max: 500
    },
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    timezone: 'Asia/Karachi'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // For now, we'll use the default settings since we don't have a settings API yet
        // In a real application, you would fetch from /api/admin/settings
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // For now, we'll just simulate saving
      // In a real application, you would POST to /api/admin/settings
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const SettingCard = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-[#1D3557] mb-4">{title}</h3>
      {children}
    </div>
  );

  const InputField = ({ label, type = 'text', value, onChange, placeholder, disabled = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#457B9D] mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77] disabled:bg-gray-100"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, disabled = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#457B9D] mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77] disabled:bg-gray-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const timezoneOptions = [
    { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT) - Asia/Karachi' },
    { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) - Asia/Dubai' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST) - Asia/Kolkata' },
    { value: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST) - Asia/Dhaka' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT) - Europe/London' },
    { value: 'America/New_York', label: 'Eastern Standard Time (EST) - America/New_York' },
    { value: 'America/Chicago', label: 'Central Standard Time (CST) - America/Chicago' },
    { value: 'America/Los_Angeles', label: 'Pacific Standard Time (PST) - America/Los_Angeles' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST) - Asia/Tokyo' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET) - Australia/Sydney' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
  ];

  const ToggleField = ({ label, value, onChange, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <label className="text-sm font-medium text-[#1D3557]">{label}</label>
        {description && (
          <p className="text-sm text-[#457B9D]">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-[#006D77]' : 'bg-gray-200'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1D3557]">System Settings</h1>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005c66] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

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

        <div className="grid gap-6 md:grid-cols-2">
          {/* General Settings */}
          <SettingCard title="General Settings">
            <InputField
              label="Site Name"
              value={settings.siteName}
              onChange={(value) => handleInputChange(null, 'siteName', value)}
              placeholder="Enter site name"
            />
            <InputField
              label="Site Description"
              value={settings.siteDescription}
              onChange={(value) => handleInputChange(null, 'siteDescription', value)}
              placeholder="Enter site description"
            />
            <InputField
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={(value) => handleInputChange(null, 'contactEmail', value)}
              placeholder="Enter contact email"
            />
            <InputField
              label="Support Phone"
              type="tel"
              value={settings.supportPhone}
              onChange={(value) => handleInputChange(null, 'supportPhone', value)}
              placeholder="Enter support phone"
            />
          </SettingCard>

          {/* System Settings */}
          <SettingCard title="System Settings">
            <ToggleField
              label="Maintenance Mode"
              value={settings.maintenanceMode}
              onChange={(value) => handleInputChange(null, 'maintenanceMode', value)}
              description="Enable to put the site in maintenance mode"
            />
            <ToggleField
              label="Allow Registration"
              value={settings.allowRegistration}
              onChange={(value) => handleInputChange(null, 'allowRegistration', value)}
              description="Allow new users to register"
            />
            <SelectField
              label="Timezone"
              value={settings.timezone}
              onChange={(value) => handleInputChange(null, 'timezone', value)}
              options={timezoneOptions}
            />
            <InputField
              label="Max Appointments Per Day"
              type="number"
              value={settings.maxAppointmentsPerDay}
              onChange={(value) => handleInputChange(null, 'maxAppointmentsPerDay', parseInt(value))}
              placeholder="Enter max appointments"
            />
          </SettingCard>

          {/* Notification Settings */}
          <SettingCard title="Notification Settings">
            <ToggleField
              label="Email Notifications"
              value={settings.emailNotifications}
              onChange={(value) => handleInputChange(null, 'emailNotifications', value)}
              description="Send email notifications to users"
            />
            <ToggleField
              label="SMS Notifications"
              value={settings.smsNotifications}
              onChange={(value) => handleInputChange(null, 'smsNotifications', value)}
              description="Send SMS notifications to users"
            />
            <ToggleField
              label="Appointment Reminders"
              value={settings.appointmentReminders}
              onChange={(value) => handleInputChange(null, 'appointmentReminders', value)}
              description="Send appointment reminders"
            />
          </SettingCard>

          {/* Business Settings */}
          <SettingCard title="Business Settings">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputField
                label="Min Consultation Fee"
                type="number"
                value={settings.consultationFeeRange.min}
                onChange={(value) => handleInputChange('consultationFeeRange', 'min', parseInt(value))}
                placeholder="Min fee"
              />
              <InputField
                label="Max Consultation Fee"
                type="number"
                value={settings.consultationFeeRange.max}
                onChange={(value) => handleInputChange('consultationFeeRange', 'max', parseInt(value))}
                placeholder="Max fee"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Working Hours Start"
                type="time"
                value={settings.workingHours.start}
                onChange={(value) => handleInputChange('workingHours', 'start', value)}
              />
              <InputField
                label="Working Hours End"
                type="time"
                value={settings.workingHours.end}
                onChange={(value) => handleInputChange('workingHours', 'end', value)}
              />
            </div>
          </SettingCard>
        </div>

        {/* System Information */}
        <div className="mt-8">
          <SettingCard title="System Information">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#006D77]">1.0.0</div>
                <div className="text-sm text-[#457B9D]">Version</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#006D77]">99.9%</div>
                <div className="text-sm text-[#457B9D]">Uptime</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#006D77]">2.1GB</div>
                <div className="text-sm text-[#457B9D]">Storage Used</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#006D77]">Active</div>
                <div className="text-sm text-[#457B9D]">Status</div>
              </div>
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;