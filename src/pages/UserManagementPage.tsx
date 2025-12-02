import React, { useState } from 'react';
import { Search, X, Edit, Check, XCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  nic: string;
  position: string;
  mobile: string;
  employee_number: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved';
}

type TabType = 'all-users' | 'pending-approvals';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      nic: '1234567890',
      position: 'Manager',
      mobile: '081234567890',
      employee_number: 'EMP001',
      role: 'admin',
      status: 'approved'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      nic: '0987654321',
      position: 'Developer',
      mobile: '081234567891',
      employee_number: 'EMP002',
      role: 'user',
      status: 'approved'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      nic: '1122334455',
      position: 'Designer',
      mobile: '081234567892',
      employee_number: 'EMP003',
      role: 'user',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      nic: '5566778899',
      position: 'Marketing',
      mobile: '081234567893',
      employee_number: 'EMP004',
      role: 'user',
      status: 'pending'
    }
  ]);

  const [activeTab, setActiveTab] = useState<TabType>('all-users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  const filterUsers = () => {
    let filtered = users;

    if (activeTab === 'pending-approvals') {
      filtered = filtered.filter(user => user.status === 'pending');
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.nic.toLowerCase().includes(search) ||
          user.position.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const filteredUsers = filterUsers();

  const handleApprove = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'approved' as const } : user
    ));
  };

  const handleReject = (userId: number) => {
    if (confirm('Apakah Anda yakin ingin menolak pengguna ini?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleUpdateUser = () => {
    if (formData) {
      setUsers(users.map(user => 
        user.id === formData.id ? formData : user
      ));
      handleCloseModal();
    }
  };

  const handleDeleteUser = () => {
    if (formData && confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      setUsers(users.filter(user => user.id !== formData.id));
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Pengguna</h1>

        {/* Tabs and Search Bar */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex items-center justify-between">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('all-users')}
                  className={`inline-block p-4 rounded-tl-lg ${
                    activeTab === 'all-users'
                      ? 'text-blue-600 bg-gray-100'
                      : 'hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Semua Pengguna
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('pending-approvals')}
                  className={`inline-block p-4 ${
                    activeTab === 'pending-approvals'
                      ? 'text-blue-600 bg-gray-100'
                      : 'hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Menunggu Persetujuan
                </button>
              </li>
            </ul>

            {/* Search Form */}
            <div className="flex items-center p-2 relative">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 p-2 border rounded-full transition-all duration-300 outline-none border-blue-500 mr-2"
                  autoFocus
                />
              )}
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 h-10 w-10 flex items-center justify-center"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* All Users Tab */}
        {activeTab === 'all-users' && (
          <div className="overflow-x-auto relative shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="py-3 px-6">Nama</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">NIC</th>
                  <th className="py-3 px-6">Posisi</th>
                  <th className="py-3 px-6">Telepon</th>
                  <th className="py-3 px-6">Nomor Karyawan</th>
                  <th className="py-3 px-6">Peran</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{user.name}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.nic}</td>
                      <td className="py-4 px-6">{user.position}</td>
                      <td className="py-4 px-6">{user.mobile}</td>
                      <td className="py-4 px-6">{user.employee_number}</td>
                      <td className="py-4 px-6 capitalize">{user.role}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.status === 'approved' ? 'Disetujui' : 'Tertunda'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Ubah
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white border-b">
                    <td colSpan={9} className="py-4 px-6 text-center">
                      Tidak ada pengguna
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'pending-approvals' && (
          <div className="overflow-x-auto relative shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="py-3 px-6">Nama</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">NIC</th>
                  <th className="py-3 px-6">Posisi</th>
                  <th className="py-3 px-6">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{user.name}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.nic}</td>
                      <td className="py-4 px-6">{user.position}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center gap-2"
                        >
                          <Check size={16} />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Tolak
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white border-b">
                    <td colSpan={5} className="py-4 px-6 text-center">
                      Tidak ada persetujuan yang tertunda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update User Modal */}
      {showModal && formData && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Ubah Pengguna
                  </h3>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <div className="mt-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NIC</label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Posisi</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telepon</label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nomor Karyawan
                      </label>
                      <input
                        type="text"
                        name="employee_number"
                        value={formData.employee_number}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Peran</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      >
                        <option value="user">Pengguna</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2 border"
                      >
                        <option value="pending">Tertunda</option>
                        <option value="approved">Disetujui</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleUpdateUser}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Simpan Pengguna
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Hapus Pengguna
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}