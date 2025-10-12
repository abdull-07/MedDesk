import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState({
    appointments: [],
    revenue: [],
    specialties: [],
    userGrowth: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [
          appointmentsResponse,
          revenueResponse,
          specialtiesResponse,
          userGrowthResponse,
        ] = await Promise.all([
          api.get(`/admin/reports/appointments?range=${timeRange}`),
          api.get(`/admin/reports/revenue?range=${timeRange}`),
          api.get('/admin/reports/specialties'),
          api.get(`/admin/reports/user-growth?range=${timeRange}`),
        ]);

        const [
          appointmentsData,
          revenueData,
          specialtiesData,
          userGrowthData,
        ] = [
          appointmentsResponse.data,
          revenueResponse.data,
          specialtiesResponse.data,
          userGrowthResponse.data,
        ];

        setReportData({
          appointments: Array.isArray(appointmentsData) ? appointmentsData : [],
          revenue: Array.isArray(revenueData) ? revenueData : [],
          specialties: Array.isArray(specialtiesData) ? specialtiesData : [],
          userGrowth: Array.isArray(userGrowthData) ? userGrowthData : [],
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Failed to load report data');
        setReportData({
          appointments: [],
          revenue: [],
          specialties: [],
          userGrowth: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [timeRange]);

  const appointmentsChartData = {
    labels: reportData.appointments.map((item) => item.date),
    datasets: [
      {
        label: 'Total Appointments',
        data: reportData.appointments.map((item) => item.total),
        borderColor: '#006D77',
        backgroundColor: 'rgba(0, 109, 119, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Completed',
        data: reportData.appointments.map((item) => item.completed),
        borderColor: '#83C5BE',
        backgroundColor: 'transparent',
        tension: 0.4,
      },
    ],
  };

  const revenueChartData = {
    labels: reportData.revenue.map((item) => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: reportData.revenue.map((item) => item.amount),
        backgroundColor: '#006D77',
      },
    ],
  };

  const specialtiesChartData = {
    labels: reportData.specialties.map((item) => item.name),
    datasets: [
      {
        data: reportData.specialties.map((item) => item.count),
        backgroundColor: [
          '#006D77',
          '#83C5BE',
          '#E5F6F8',
          '#1D3557',
          '#457B9D',
        ],
      },
    ],
  };

  const userGrowthChartData = {
    labels: reportData.userGrowth.map((item) => item.date),
    datasets: [
      {
        label: 'New Users',
        data: reportData.userGrowth.map((item) => item.count),
        borderColor: '#006D77',
        backgroundColor: 'rgba(0, 109, 119, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const StatCard = ({ title, value, change, icon }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#457B9D]">{title}</p>
          <p className="text-2xl font-semibold text-[#1D3557] mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-[#E5F6F8] rounded-full">
          {icon}
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
            <div className="grid gap-6 mb-8 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-[#1D3557]">Reports & Analytics</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-[#006D77] focus:border-[#006D77]"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <StatCard
            title="Total Appointments"
            value={reportData.appointments.reduce((sum, item) => sum + item.total, 0)}
            change={5.2}
            icon={
              <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Total Revenue"
            value={`$${reportData.revenue.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`}
            change={8.1}
            icon={
              <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Active Doctors"
            value={reportData.specialties.reduce((sum, item) => sum + item.count, 0)}
            change={3.7}
            icon={
              <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <StatCard
            title="New Users"
            value={reportData.userGrowth.reduce((sum, item) => sum + item.count, 0)}
            change={-2.3}
            icon={
              <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#1D3557] mb-6">Appointments Overview</h2>
            <div className="h-80">
              <Line data={appointmentsChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#1D3557] mb-6">Revenue Analysis</h2>
            <div className="h-80">
              <Bar data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#1D3557] mb-6">Specialties Distribution</h2>
            <div className="h-80">
              <Doughnut data={specialtiesChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#1D3557] mb-6">User Growth</h2>
            <div className="h-80">
              <Line data={userGrowthChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 