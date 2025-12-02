import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  mobile: string;
  position: string;
}

export default function EditProfilePage() {
  const [userData, setUserData] = useState<UserData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '081234567890',
    position: 'Manager'
  });

  const [formData, setFormData] = useState({
    name: userData.name,
    mobile: userData.mobile,
    position: userData.position,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, one capital letter, and one symbol
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' });
    }, 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate current password (mock validation)
    if (formData.currentPassword !== 'password123') {
      showNotification('error', 'Password saat ini salah.');
      return;
    }

    // Check if new password is provided
    if (formData.newPassword) {
      // Validate new password match
      if (formData.newPassword !== formData.confirmPassword) {
        showNotification('error', 'Password baru dan konfirmasi tidak cocok.');
        return;
      }

      // Validate password complexity
      if (!validatePassword(formData.newPassword)) {
        showNotification(
          'error',
          'Password baru harus minimal 8 karakter, menyertakan satu huruf kapital dan satu simbol.'
        );
        return;
      }

      // Update profile with new password
      setUserData({
        ...userData,
        name: formData.name,
        mobile: formData.mobile,
        position: formData.position
      });
      showNotification('success', 'Profil dan password berhasil diperbarui!');
    } else {
      // Update profile without password change
      setUserData({
        ...userData,
        name: formData.name,
        mobile: formData.mobile,
        position: formData.position
      });
      showNotification('success', 'Profil berhasil diperbarui!');
    }

    // Clear password fields
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Ubah Profil</h1>

        {/* Notification */}
        {notification.show && (
          <div
            className={`border-l-4 p-4 mb-4 ${
              notification.type === 'success'
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-red-100 border-red-500 text-red-700'
            }`}
            role="alert"
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="mr-2" size={20} />
              ) : (
                <AlertCircle className="mr-2" size={20} />
              )}
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <User size={16} />
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email (Tidak dapat diubah)
            </label>
            <input
              type="email"
              value={userData.email}
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <Phone size={16} />
              Telepon
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <Briefcase size={16} />
              Posisi
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lock size={20} />
              Ubah Password
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password Saat Ini
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password Baru (Kosongkan untuk tidak mengubah)
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-600 mt-1">
                Minimal 8 karakter, satu huruf kapital, dan satu simbol.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Perbarui Profil
            </button>
          </div>
        </div>

        {/* Password Requirements Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 mb-1">
                Persyaratan Password
              </h4>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Minimal 8 karakter</li>
                <li>Minimal satu huruf kapital (A-Z)</li>
                <li>Minimal satu simbol (!@#$%^&* dll)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}