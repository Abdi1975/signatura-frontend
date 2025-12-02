import React, { useState } from 'react';
import { Upload, Link as LinkIcon, FileText, User, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface Recipient {
  id: number;
  name: string;
  email: string;
}

export default function UploadDocumentPage() {
  const [uploadMethod, setUploadMethod] = useState<'local' | 'drive'>('local');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const [formData, setFormData] = useState({
    driveLink: '',
    recipient: '',
    requirements: [] as string[],
    description: '',
    dueDate: ''
  });

  const recipients: Recipient[] = [
    { id: 1, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 2, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 3, name: 'Sarah Williams', email: 'sarah@example.com' }
  ];

  const requirements = [
    { value: 'signature', label: 'Signature' },
    { value: 'stamp', label: 'Stamp' },
    { value: 'date_time', label: 'Date & Time' },
    { value: 'text', label: 'Text' }
  ];

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' });
    }, 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        showNotification('error', 'Kesalahan: File Anda terlalu besar (maksimal 5MB).');
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        showNotification('error', 'Kesalahan: Hanya file PDF, DOC, DOCX & TXT yang diperbolehkan.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequirementChange = (value: string) => {
    if (formData.requirements.includes(value)) {
      setFormData({
        ...formData,
        requirements: formData.requirements.filter(r => r !== value)
      });
    } else {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, value]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate recipient
    if (!formData.recipient) {
      showNotification('error', 'Kesalahan: Silakan pilih penerima.');
      return;
    }

    // Validate file or drive link
    if (uploadMethod === 'local' && !selectedFile) {
      showNotification('error', 'Kesalahan: Silakan pilih file untuk diunggah.');
      return;
    }

    if (uploadMethod === 'drive' && !formData.driveLink) {
      showNotification('error', 'Kesalahan: Silakan masukkan tautan Google Drive.');
      return;
    }

    setIsLoading(true);

    // Simulate upload process
    setTimeout(() => {
      setIsLoading(false);
      showNotification('success', 'Sukses: Dokumen berhasil diunggah dan dikirim ke penerima.');
      
      // Reset form
      setSelectedFile(null);
      setFormData({
        driveLink: '',
        recipient: '',
        requirements: [],
        description: '',
        dueDate: ''
      });
      setUploadMethod('local');
    }, 2000);
  };

  const showDriveHelp = () => {
    alert(
      'Pastikan file Google Drive Anda dapat diakses secara publik:\n\n' +
      '1. Klik kanan pada file di Google Drive\n' +
      '2. Klik "Bagikan"\n' +
      '3. Klik "Ubah ke siapa saja yang memiliki link"\n' +
      '4. Salin link dan tempelkan di sini'
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kirim ke eSign</h1>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-6 p-4 rounded-md text-sm font-medium flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p>{notification.message}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Upload Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metode Unggah
            </label>
            <select
              value={uploadMethod}
              onChange={(e) => setUploadMethod(e.target.value as 'local' | 'drive')}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            >
              <option value="local">File Lokal</option>
              <option value="drive">Tautan Google Drive</option>
            </select>
          </div>

          {/* File Upload (Local) */}
          {uploadMethod === 'local' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unggah Dokumen
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT (MAX. 5MB)</p>
                    {selectedFile && (
                      <p className="mt-2 text-sm text-indigo-600 font-medium">
                        File terpilih: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Google Drive Link */}
          {uploadMethod === 'drive' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <LinkIcon size={16} />
                Google Drive Link
                <button
                  type="button"
                  onClick={showDriveHelp}
                  className="text-indigo-600 hover:text-indigo-800 text-xs underline"
                >
                  (Bantuan)
                </button>
              </label>
              <input
                type="url"
                name="driveLink"
                value={formData.driveLink}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/file/d/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          )}

          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <User size={16} />
              Penerima
            </label>
            <select
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            >
              <option value="">Pilih penerima</option>
              {recipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name} ({recipient.email})
                </option>
              ))}
            </select>
          </div>

          {/* Requirements */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-4">
              Pilih Persyaratan
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              {requirements.map((req) => (
                <label key={req.value} className="inline-flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.requirements.includes(req.value)}
                      onChange={() => handleRequirementChange(req.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center ${
                        formData.requirements.includes(req.value)
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-white border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      {formData.requirements.includes(req.value) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-indigo-600">
                    {req.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText size={16} />
              Deskripsi Tambahan
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Masukkan instruksi atau informasi tambahan di sini..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Calendar size={16} />
              Tanggal Tenggat (Opsional)
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
            <p className="mt-1 text-sm text-gray-500">
              Jika tidak dipilih, tanggal tenggat akan diatur ke 1 minggu dari hari ini.
            </p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Mengunggah...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Unggah dan Kirim Dokumen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}