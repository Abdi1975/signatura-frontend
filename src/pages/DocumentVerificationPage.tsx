import React, { useState } from 'react';
import { Shield, FileText, User, UserCheck, CheckCircle, XCircle, Info, Download, Upload } from 'lucide-react';

interface DocumentDetails {
  filename: string;
  status: string;
  uploadDate: string;
  signedDate: string;
  dueDate: string;
  requirements: string;
}

interface SenderInfo {
  name: string;
  position: string;
}

interface RecipientInfo {
  name: string;
  position: string;
}

interface ValidationResult {
  isValid: boolean;
  document: DocumentDetails;
  sender: SenderInfo;
  recipient: RecipientInfo;
}

export default function DocumentVerificationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        alert('Hanya file PDF yang diperbolehkan');
        return;
      }
      setSelectedFile(file);
      setShowResult(false);
    }
  };

  const handleValidate = () => {
    if (!selectedFile) {
      alert('Silakan pilih file terlebih dahulu');
      return;
    }

    setIsLoading(true);

    // Simulate validation process
    setTimeout(() => {
      // Mock validation result - In real app, this would be API call
      const mockResult: ValidationResult = {
        isValid: Math.random() > 0.3, // 70% chance of valid
        document: {
          filename: selectedFile.name,
          status: Math.random() > 0.3 ? 'Signed' : 'Invalid',
          uploadDate: '2024-11-15 10:30:00',
          signedDate: '2024-11-16 14:20:00',
          dueDate: '2024-11-22 23:59:59',
          requirements: 'Signature, Date & Time, Stamp'
        },
        sender: {
          name: 'John Doe',
          position: 'Manager'
        },
        recipient: {
          name: 'Jane Smith',
          position: 'Senior Developer'
        }
      };

      setValidationResult(mockResult);
      setShowResult(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    if (!validationResult) return;

    // In real implementation, this would generate and download actual PDF
    alert('Downloading validation report PDF...');
    console.log('Generating PDF with data:', validationResult);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Shield className="text-blue-600 mr-4" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Verifikasi Dokumen</h1>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="text-blue-600" size={20} />
              </div>
              <p className="ml-3 text-gray-600">
                Unggah dokumen PDF yang telah ditandatangani untuk memverifikasi keasliannya dan melihat metadata-nya.
                Ukuran file maksimal: 10MB.
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Dokumen PDF
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-blue-500" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-blue-600 font-medium">
                      File terpilih: {selectedFile.name}
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Validate Button */}
          <button
            onClick={handleValidate}
            disabled={!selectedFile || isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform hover:-translate-y-1 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            {isLoading ? 'Memverifikasi...' : 'Verifikasi Dokumen'}
          </button>

          {/* Results Card */}
          {showResult && validationResult && (
            <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-2 border-gray-100">
              <div className="flex items-center mb-6">
                {validationResult.isValid ? (
                  <CheckCircle className="text-green-500 mr-4" size={40} />
                ) : (
                  <XCircle className="text-red-500 mr-4" size={40} />
                )}
                <h2 className="text-2xl font-bold text-gray-800">
                  {validationResult.isValid ? 'Dokumen Valid' : 'Dokumen Tidak Valid'}
                </h2>
              </div>

              {/* Document Details */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center mb-4">
                  <FileText className="text-blue-500 mr-3" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Detail Dokumen</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500">Nama File</p>
                    <p className="font-medium text-gray-800 mt-1">{validationResult.document.filename}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium mt-1 ${
                      validationResult.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {validationResult.document.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500">Tanggal Unggah</p>
                    <p className="font-medium text-gray-800 mt-1">{validationResult.document.uploadDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500">Tanggal Tandatangan</p>
                    <p className="font-medium text-gray-800 mt-1">{validationResult.document.signedDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500">Tanggal Tenggat</p>
                    <p className="font-medium text-gray-800 mt-1">{validationResult.document.dueDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500">Persyaratan</p>
                    <p className="font-medium text-gray-800 mt-1">{validationResult.document.requirements}</p>
                  </div>
                </div>
              </div>

              {/* Sender Information */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center mb-4">
                  <User className="text-blue-500 mr-3" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Informasi Pengirim</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p>
                    <span className="text-gray-500">Nama:</span>
                    <span className="font-medium text-gray-800 ml-2">{validationResult.sender.name}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Posisi:</span>
                    <span className="font-medium text-gray-800 ml-2">{validationResult.sender.position}</span>
                  </p>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center mb-4">
                  <UserCheck className="text-blue-500 mr-3" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Informasi Penerima</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p>
                    <span className="text-gray-500">Nama:</span>
                    <span className="font-medium text-gray-800 ml-2">{validationResult.recipient.name}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Posisi:</span>
                    <span className="font-medium text-gray-800 ml-2">{validationResult.recipient.position}</span>
                  </p>
                </div>
              </div>

              {/* PDF Generation Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center gap-2"
                >
                  <Download size={20} />
                  Unduh Laporan PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto animate-spin"></div>
            <p className="mt-4 text-gray-700 text-center font-medium">Memverifikasi dokumen...</p>
          </div>
        </div>
      )}
    </div>
  );
}