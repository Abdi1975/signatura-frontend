import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import {
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Calendar,
  RefreshCw,
  User,
  Activity,
  Menu
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Types
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  email: string;
  created_at: string;
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

interface DashboardData {
  user: User;
  userDocuments: number;
  userSignedDocuments: number;
  userPendingDocuments: number;
  userMessages: number;
  recentActivities: Activity[];
  recentMessages: Message[];
}

const UserDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setDashboardData({
        user: {
          id: 2,
          name: 'Regular User',
          role: 'user',
          email: 'user@signatura.com',
          created_at: '2024-01-15'
        },
        userDocuments: 12,
        userSignedDocuments: 8,
        userPendingDocuments: 4,
        userMessages: 23,
        recentActivities: [
          { name: 'Regular User', file_path: 'my_contract.pdf', status: 'signed', upload_date: '2024-10-15 14:30:00' },
          { name: 'Regular User', file_path: 'agreement_draft.pdf', status: 'pending', upload_date: '2024-10-15 13:45:00' },
          { name: 'Regular User', file_path: 'document.pdf', status: 'signed', upload_date: '2024-10-15 12:20:00' }
        ],
        recentMessages: [
          { id: 1, sender_id: 1, sender_name: 'Admin', receiver_id: 2, receiver_name: 'Regular User', message: 'Please sign the document', created_at: '2024-10-15 14:30:00' },
          { id: 2, sender_id: 2, sender_name: 'Regular User', receiver_id: 1, receiver_name: 'Admin', message: 'I will review it', created_at: '2024-10-15 14:35:00' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Dashboard Pengguna</h1>
                <p className="text-lg opacity-90">
                  Selamat datang kembali, <span className="font-semibold">{dashboardData.user.name}</span>
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                    User
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
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            title="Dokumen Anda"
            value={dashboardData.userDocuments}
            subtitle="Semua dokumen"
            color="blue"
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
            color="purple"
            trend="Chat"
          />
        </div>

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
                        Dari
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
                          <span className="text-sm text-gray-600" title={message.message}>
                            {message.message.length > 30 ? message.message.substring(0, 30) + '...' : message.message}
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
  color: 'blue' | 'green' | 'amber' | 'purple';
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
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].gradient} flex items-center justify-center text-white`}>
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

export default UserDashboard;
