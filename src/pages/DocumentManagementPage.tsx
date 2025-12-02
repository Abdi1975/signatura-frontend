import React, { useState } from 'react';
import { Search, CheckCircle, Clock, FileText, X } from 'lucide-react';

interface Document {
  id: number;
  sender_name: string;
  recipient_name: string;
  recipient_email: string;
  upload_date: string;
  due_date: string | null;
  status: 'sent' | 'pending' | 'signed' | 'completed';
  file_path: string;
  signed_file_path: string | null;
  requirements: string;
  description: string;
}

type TabType = 'all' | 'sent' | 'pending' | 'signed' | 'completed';

export default function DocumentManagementPage() {
  const [documents] = useState<Document[]>([
    {
      id: 1,
      sender_name: 'John Doe',
      recipient_name: 'Jane Smith',
      recipient_email: 'jane@example.com',
      upload_date: '2024-11-15 10:30:00',
      due_date: '2024-11-22 23:59:59',
      status: 'completed',
      file_path: '/uploads/contract_2024.pdf',
      signed_file_path: '/uploads/signed/contract_2024_signed.pdf',
      requirements: 'Signature, Date & Time',
      description: 'Employment Contract 2024'
    },
    {
      id: 2,
      sender_name: 'Mike Johnson',
      recipient_name: 'Sarah Williams',
      recipient_email: 'sarah@example.com',
      upload_date: '2024-11-14 14:20:00',
      due_date: '2024-11-21 23:59:59',
      status: 'pending',
      file_path: '/uploads/nda_agreement.pdf',
      signed_file_path: null,
      requirements: 'Signature, Stamp',
      description: 'Non-Disclosure Agreement'
    },
    {
      id: 3,
      sender_name: 'David Brown',
      recipient_name: 'Emily Davis',
      recipient_email: 'emily@example.com',
      upload_date: '2024-11-13 16:45:00',
      due_date: '2024-11-20 23:59:59',
      status: 'sent',
      file_path: '/uploads/project_proposal.pdf',
      signed_file_path: null,
      requirements: 'Signature',
      description: 'Q4 Project Proposal'
    },
    {
      id: 4,
      sender_name: 'Alice Cooper',
      recipient_name: 'Bob Wilson',
      recipient_email: 'bob@example.com',
      upload_date: '2024-11-12 09:15:00',
      due_date: '2024-11-19 23:59:59',
      status: 'signed',
      file_path: '/uploads/service_agreement.pdf',
      signed_file_path: '/uploads/signed/service_agreement_signed.pdf',
      requirements: 'Signature, Date & Time, Stamp',
      description: 'Service Agreement 2024'
    }
  ]);

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showModal, setShowModal] = useState(false);

  const translateStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      sent: 'Terkirim',
      pending: 'Tertunda',
      signed: 'Ditandatangani',
      completed: 'Selesai'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      sent: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-green-100 text-green-800',
      completed: 'bg-green-200 text-green-900'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(doc => doc.status === activeTab);
    }

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        doc =>
          doc.sender_name.toLowerCase().includes(search) ||
          doc.recipient_name.toLowerCase().includes(search) ||
          doc.recipient_email.toLowerCase().includes(search) ||
          doc.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const filteredDocuments = filterDocuments();

  const handleViewDetails = (doc: Document) => {
    setSelectedDocument(doc);
    setShowModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Dokumen</h1>

        {/* Tabs and Search Bar */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex items-center justify-between">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`inline-block p-4 rounded-tl-lg ${
                    activeTab === 'all'
                      ? 'text-blue-600 bg-gray-100'
                      : 'hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Semua Dokumen
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`inline-block p-4 ${
                    activeTab === 'sent'
                      ? 'text-blue-600 bg-gray-100'
                      : 'hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Terkirim
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`inline-block p-4 ${
                    activeTab === 'pending'
                      ? 'text-blue-600 bg-gray-100'
                      : 'hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tertunda
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('signed')}
                  className={`inline-block p-4 ${
                    activeTab === 'signed'
                      ? 'text-blue-600 bg-gray-100'
                      : 'hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Ditandatangani
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`inline-block p-4 ${
                    activeTab === 'completed'
                      ? 'text-blue-600 bg-gray-100'
                      : 'hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Selesai
                </button>
              </li>
            </ul>

            {/* Search Form */}
            <div className="flex items-center p-2 relative">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="Cari dokumen..."
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

        {/* Document Table */}
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Pengirim</th>
                <th className="py-3 px-6">Penerima</th>
                <th className="py-3 px-6">Tanggal Unggah</th>
                <th className="py-3 px-6">Tanggal Jatuh Tempo</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Dokumen</th>
                <th className="py-3 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">{doc.id}</td>
                    <td className="py-4 px-6">{doc.sender_name}</td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-medium flex items-center gap-2">
                          {doc.status === 'completed' || doc.status === 'signed' ? (
                            <CheckCircle className="text-green-500" size={16} />
                          ) : (
                            <Clock className="text-yellow-500" size={16} />
                          )}
                          {doc.recipient_name}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          {doc.recipient_email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{doc.upload_date}</td>
                    <td className="py-4 px-6">{doc.due_date || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {translateStatus(doc.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={
                          doc.status === 'completed' || doc.status === 'signed'
                            ? doc.signed_file_path || doc.file_path
                            : doc.file_path
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {doc.status === 'completed' || doc.status === 'signed'
                          ? 'Lihat Versi Tertandatangani'
                          : 'Lihat Dokumen Asli'}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewDetails(doc)}
                        className="text-blue-600 hover:underline"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b">
                  <td colSpan={8} className="py-4 px-6 text-center">
                    Tidak ada dokumen
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Details Modal */}
      {showModal && selectedDocument && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                    <FileText size={24} className="text-blue-600" />
                    Detail Dokumen
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">ID Dokumen</p>
                    <p className="font-medium text-gray-900">{selectedDocument.id}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Pengirim</p>
                    <p className="font-medium text-gray-900">{selectedDocument.sender_name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Penerima</p>
                    <div className="flex items-center gap-2">
                      {selectedDocument.status === 'completed' ||
                      selectedDocument.status === 'signed' ? (
                        <CheckCircle className="text-green-500" size={16} />
                      ) : (
                        <Clock className="text-yellow-500" size={16} />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedDocument.recipient_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedDocument.recipient_email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Tanggal Unggah</p>
                    <p className="font-medium text-gray-900">
                      {selectedDocument.upload_date}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Tanggal Jatuh Tempo</p>
                    <p className="font-medium text-gray-900">
                      {selectedDocument.due_date || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        selectedDocument.status
                      )}`}
                    >
                      {translateStatus(selectedDocument.status)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Persyaratan</p>
                    <p className="font-medium text-gray-900">
                      {selectedDocument.requirements || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Deskripsi</p>
                    <p className="font-medium text-gray-900">
                      {selectedDocument.description || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
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