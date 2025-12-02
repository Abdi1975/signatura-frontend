import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  Calendar,
  Send,
  RefreshCw,
  Trophy,
  User,
  Mail,
  Activity
} from 'lucide-react';

// Simple chart placeholder components will be used instead of Chart.js

// Types
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  email: string;
  created_at: string;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface DocumentType {
  status: string;
  count: number;
}

interface TopUser {
  name: string;
  document_count: number;
}

interface Activity {
  name: string;
  file_path: string;
  status: string;
  upload_date: string;
}

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  receiver_name: string;
  message: string;
  created_at: string;
}

interface UserActivityTrend {
  id: number;
  name: string;
  document_count: number;
  message_count: number;
  last_activity: string;
}

interface DashboardData {
  user: User;
  userDocuments: number;
  userSignedDocuments: number;
  userPendingDocuments: number;
  userMessages: number;
  totalUsers?: number;
  totalDocuments?: number;
  totalSignedDocuments?: number;
  totalPendingDocuments?: number;
  totalMessages?: number;
  monthlyUsers?: MonthlyData[];
  monthlyDocuments?: MonthlyData[];
  monthlySignedDocuments?: MonthlyData[];
  monthlyMessages?: MonthlyData[];
  allDocumentTypes?: DocumentType[];
  topUsers?: TopUser[];
  userActivityTrends?: UserActivityTrend[];
  recentActivities: Activity[];
  recentMessages: Message[];
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        user: {
          id: 1,
          name: 'Admin User',
          role: 'admin',
          email: 'admin@signatura.com',
          created_at: '2024-01-01'
        },
        userDocuments: 45,
        userSignedDocuments: 38,
        userPendingDocuments: 7,
        userMessages: 123,
        totalUsers: 156,
        totalDocuments: 432,
        totalSignedDocuments: 389,
        totalPendingDocuments: 43,
        totalMessages: 1247,
        monthlyUsers: [
          { month: '2024-05', count: 12 },
          { month: '2024-06', count: 18 },
          { month: '2024-07', count: 15 },
          { month: '2024-08', count: 22 },
          { month: '2024-09', count: 19 },
          { month: '2024-10', count: 25 }
        ],
        monthlyDocuments: [
          { month: '2024-05', count: 45 },
          { month: '2024-06', count: 52 },
          { month: '2024-07', count: 48 },
          { month: '2024-08', count: 61 },
          { month: '2024-09', count: 55 },
          { month: '2024-10', count: 68 }
        ],
        monthlySignedDocuments: [
          { month: '2024-05', count: 40 },
          { month: '2024-06', count: 47 },
          { month: '2024-07', count: 43 },
          { month: '2024-08', count: 56 },
          { month: '2024-09', count: 50 },
          { month: '2024-10', count: 62 }
        ],
        monthlyMessages: [
          { month: '2024-05', count: 98 },
          { month: '2024-06', count: 112 },
          { month: '2024-07', count: 105 },
          { month: '2024-08', count: 134 },
          { month: '2024-09', count: 121 },
          { month: '2024-10', count: 145 }
        ],
        allDocumentTypes: [
          { status: 'signed', count: 389 },
          { status: 'pending', count: 43 }
        ],
        topUsers: [
          { name: 'John Doe', document_count: 45 },
          { name: 'Jane Smith', document_count: 38 },
          { name: 'Bob Johnson', document_count: 32 },
          { name: 'Alice Brown', document_count: 28 },
          { name: 'Charlie Wilson', document_count: 24 }
        ],
        userActivityTrends: [
          { id: 1, name: 'John Doe', document_count: 45, message_count: 89, last_activity: '2024-10-15 14:30:00' },
          { id: 2, name: 'Jane Smith', document_count: 38, message_count: 76, last_activity: '2024-10-15 13:45:00' },
          { id: 3, name: 'Bob Johnson', document_count: 32, message_count: 65, last_activity: '2024-10-15 12:20:00' }
        ],
        recentActivities: [
          { name: 'John Doe', file_path: 'contract_2024.pdf', status: 'signed', upload_date: '2024-10-15 14:30:00' },
          { name: 'Jane Smith', file_path: 'agreement.pdf', status: 'pending', upload_date: '2024-10-15 13:45:00' },
          { name: 'Bob Johnson', file_path: 'proposal.pdf', status: 'signed', upload_date: '2024-10-15 12:20:00' }
        ],
        recentMessages: [
          { id: 1, sender_id: 1, sender_name: 'John Doe', receiver_id: 2, receiver_name: 'Jane Smith', message: 'Please review the contract', created_at: '2024-10-15 14:30:00' },
          { id: 2, sender_id: 2, sender_name: 'Jane Smith', receiver_id: 1, receiver_name: 'John Doe', message: 'I will check it today', created_at: '2024-10-15 14:35:00' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const isAdmin = dashboardData.user.role === 'admin';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Simple chart placeholder components
  const ChartPlaceholder = ({ title, type }: { title: string; type: 'line' | 'bar' | 'pie' }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
      <div className="mb-4">
        {type === 'line' && <TrendingUp className="w-16 h-16 text-gray-300" />}
        {type === 'bar' && <FileText className="w-16 h-16 text-gray-300" />}
        {type === 'pie' && <Users className="w-16 h-16 text-gray-300" />}
      </div>
      <p className="text-lg font-semibold mb-2">{title}</p>
      <p className="text-sm text-gray-400">Chart visualization placeholder</p>
      <p className="text-xs text-gray-400 mt-2">Chart.js needed for actual charts</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Dasbor Signatura</h1>
                <p className="text-lg opacity-90">
                  Selamat datang kembali, <span className="font-semibold">{dashboardData.user.name}</span>
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                    {dashboardData.user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isAdmin ? (
            <>
              <StatCard
                icon={<Users className="w-6 h-6" />}
                title="Total Pengguna"
                value={dashboardData.totalUsers || 0}
                subtitle="Pengguna terdaftar"
                color="blue"
                trend="+12%"
              />
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                title="Total Dokumen"
                value={dashboardData.totalDocuments || 0}
                subtitle="Semua dokumen"
                color="green"
                trend="+8%"
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                title="Dokumen Ditandatangani"
                value={dashboardData.totalSignedDocuments || 0}
                subtitle="Sudah selesai"
                color="red"
                trend="95%"
              />
              <StatCard
                icon={<MessageSquare className="w-6 h-6" />}
                title="Total Pesan"
                value={dashboardData.totalMessages || 0}
                subtitle="Komunikasi"
                color="purple"
                trend="New"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                title="Dokumen Anda"
                value={dashboardData.userDocuments}
                subtitle="Semua dokumen"
                color="red"
                trend="Total"
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                title="Dokumen Ditandatangani"
                value={dashboardData.userSignedDocuments}
                subtitle="Sudah selesai"
                color="green"
                trend="Selesai"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                title="Dokumen Tertunda"
                value={dashboardData.userPendingDocuments}
                subtitle="Menunggu tindakan"
                color="amber"
                trend="Pending"
              />
              <StatCard
                icon={<MessageSquare className="w-6 h-6" />}
                title="Pesan Anda"
                value={dashboardData.userMessages}
                subtitle="Komunikasi"
                color="blue"
                trend="Chat"
              />
            </>
          )}
        </div>

        {/* Charts Section (Admin Only) */}
        {isAdmin && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="w-6 h-6 text-blue-500 mr-3" />
                Analitik & Statistik
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Pendaftaran Pengguna" badge="Trend" badgeColor="blue">
                <ChartPlaceholder title="Pendaftaran Pengguna" type="line" />
              </ChartCard>

              <ChartCard title="Aktivitas Dokumen" badge="Monthly" badgeColor="green">
                <ChartPlaceholder title="Aktivitas Dokumen" type="bar" />
              </ChartCard>

              <ChartCard title="Status Dokumen" badge="Distribusi" badgeColor="red">
                <ChartPlaceholder title="Status Dokumen" type="pie" />
              </ChartCard>

              <ChartCard title="Aktivitas Pesan" badge="Komunikasi" badgeColor="purple">
                <ChartPlaceholder title="Aktivitas Pesan" type="line" />
              </ChartCard>
            </div>
          </div>
        )}

        {/* Admin Tables Section */}
        {isAdmin && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Users className="w-6 h-6 text-blue-500 mr-3" />
                Manajemen Pengguna
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Users Table */}
              <Card className="p-6 rounded-2xl shadow-lg border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Pengguna Teratas</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center">
                    <Trophy className="w-3 h-3 mr-1" />
                    Dokumen
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          <User className="w-4 h-4 mr-2 inline" />
                          Pengguna
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          <FileText className="w-4 h-4 mr-2 inline" />
                          Dokumen
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.topUsers?.map((user, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                              </div>
                              <span className="font-medium text-gray-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                              {user.document_count}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* User Activity Trends Table */}
              <Card className="p-6 rounded-2xl shadow-lg border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Tren Aktivitas</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    Live
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          <User className="w-4 h-4 mr-2 inline" />
                          Pengguna
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          <FileText className="w-4 h-4 mr-2 inline" />
                          Dok
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          <MessageSquare className="w-4 h-4 mr-2 inline" />
                          Msg
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          <Clock className="w-4 h-4 mr-2 inline" />
                          Terakhir
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.userActivityTrends?.map((activity) => (
                        <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-800">{activity.name}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                              {activity.document_count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                              {activity.message_count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-500">
                              {formatDate(activity.last_activity)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Activity Tables Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Clock className="w-6 h-6 text-blue-500 mr-3" />
              Aktivitas Terkini
            </h2>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card className="p-6 rounded-2xl shadow-lg border-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Aktivitas Dokumen</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  Terbaru
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <User className="w-4 h-4 mr-2 inline" />
                        Pengguna
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <FileText className="w-4 h-4 mr-2 inline" />
                        Dokumen
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <Activity className="w-4 h-4 mr-2 inline" />
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 inline" />
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentActivities.map((activity, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-800">{activity.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600" title={activity.file_path}>
                            {activity.file_path.split('/').pop()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(activity.status)}`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-500">
                            {formatDate(activity.upload_date)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Recent Messages */}
            <Card className="p-6 rounded-2xl shadow-lg border-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Pesan Terbaru</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Chat
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <User className="w-4 h-4 mr-2 inline" />
                        Pengirim
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <User className="w-4 h-4 mr-2 inline" />
                        Penerima
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <MessageSquare className="w-4 h-4 mr-2 inline" />
                        Pesan
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        <Clock className="w-4 h-4 mr-2 inline" />
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentMessages.map((message) => (
                      <tr key={message.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-bold">{message.sender_name.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{message.sender_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{message.receiver_name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600" title={message.message}>
                            {message.message.length > 40 ? message.message.substring(0, 40) + '...' : message.message}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-500">
                            {formatDate(message.created_at)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  color: 'blue' | 'green' | 'red' | 'amber' | 'purple';
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color, trend }) => {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      badge: 'bg-green-100 text-green-700'
    },
    red: {
      gradient: 'from-blue-500 to-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    amber: {
      gradient: 'from-amber-500 to-amber-600',
      badge: 'bg-amber-100 text-amber-700'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border-0">
      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].gradient} flex items-center justify-center`}>
            {icon}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${colorClasses[color].badge}`}>
            {trend}
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
      </div>
    </Card>
  );
};

// ChartCard Component
interface ChartCardProps {
  title: string;
  badge: string;
  badgeColor: 'blue' | 'green' | 'red' | 'purple';
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, badge, badgeColor, children }) => {
  const badgeColorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <Card className="p-6 rounded-2xl shadow-lg border-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${badgeColorClasses[badgeColor]}`}>
          {badge}
        </span>
      </div>
      <div className="h-64">
        {children}
      </div>
    </Card>
  );
};

export default AdminDashboard