import React, { useState } from 'react';
import { CheckCircle, Clock, Search, X, Download } from 'lucide-react';

interface Document {
  id: number;
  file_path: string;
  signed_file_path: string;
  drive_link: string;
  requirements: string;
  description: string;
  status: 'sent' | 'pending' | 'signed' | 'completed';
  upload_date: string;
  due_date: string | null;
  signed_at: string | null;
  recipient_name: string;
  recipient_email: string;
}

export default function ActivityLogPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      file_path: '/uploads/contract_2024.pdf',
      signed_file_path: '/uploads/signed/contract_2024_signed.pdf',
      drive_link: '',
      requirements: 'Signature, Date & Time',
      description: 'Employment Contract 2024',
      status: 'completed',
      upload_date: '2024-11-15 10:30:00',
      due_date: '2024-11-22',
      signed_at: '2024-11-16 14:20:00',
      recipient_name: 'John Doe',
      recipient_email: 'john.doe@company.com'
    },
    {
      id: 2,
      file_path: '/uploads/nda_agreement.pdf',
      signed_file_path: '',
      drive_link: '',
      requirements: 'Signature, Stamp',
      description: 'Non-Disclosure Agreement',
      status: 'pending',
      upload_date: '2024-11-14 14:20:00',
      due_date: '2024-11-21',
      signed_at: null,
      recipient_name: 'Jane Smith',
      recipient_email: 'jane.smith@company.com'
    },
    {
      id: 3,
      file_path: '/uploads/project_proposal.pdf',
      signed_file_path: '',
      drive_link: 'https://drive.google.com/file/example',
      requirements: 'Signature',
      description: 'Q4 Project Proposal',
      status: 'sent',
      upload_date: '2024-11-13 16:45:00',
      due_date: '2024-11-20',
      signed_at: null,
      recipient_name: 'Mike Johnson',
      recipient_email: 'mike.johnson@company.com'
    }
  ]);

  const [search, setSearch] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'signed':
        return 'bg-green-500 text-white';
      case 'completed':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const searchLower = search.toLowerCase();
    return (
      doc.recipient_name.toLowerCase().includes(searchLower) ||
      doc.recipient_email.toLowerCase().includes(searchLower) ||
      doc.status.toLowerCase().includes(searchLower) ||
      doc.id.toString().includes(searchLower)
    );
  });

  const handleRowClick = (doc: Document) => {
    setSelectedDocument(doc);
    setShowModal(true);
  };

  const handleDownload = (docId: number) => {
    alert(`Downloading document ${docId}...`);
    // In real implementation, this would trigger file download
  };

  const statuses = ['sent', 'pending', 'signed', 'completed'];

  const getStatusOrder = (status: string) => {
    return statuses.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Log Aktivitas</h1>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan penerima, status, atau ID Dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} /> Hapus
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="py-3 px-6">ID Dokumen</th>
                <th className="py-3 px-6">Penerima</th>
                <th className="py-3 px-6">Dokumen</th>
                <th className="py-3 px-6">Tanggal Unggah</th>
                <th className="py-3 px-6">Tenggat</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => {
                  const docLink =
                    doc.status === 'completed' || doc.status === 'signed'
                      ? doc.signed_file_path || doc.file_path
                      : doc.drive_link || doc.file_path;
                  const docName =
                    doc.status === 'completed' || doc.status === 'signed'
                      ? 'Lihat Versi Signed'
                      : doc.drive_link
                      ? 'Lihat di Google Drive'
                      : doc.file_path.split('/').pop();

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => handleRowClick(doc)}
                      className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {doc.id}
                      </td>
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
                          <span className="text-xs text-gray-500">
                            {doc.recipient_email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={docLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:underline"
                        >
                          {docName}
                        </a>
                      </td>
                      <td className="py-4 px-6">{doc.upload_date}</td>
                      <td className="py-4 px-6">{doc.due_date || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            doc.status
                          )}`}
                        >
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {(doc.status === 'completed' || doc.status === 'signed') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(doc.id);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                          >
                            <Download size={16} />
                            Unduh Final
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-white">
                  <td colSpan={7} className="py-4 px-6 text-center text-gray-500">
                    {search
                      ? 'Tidak ada dokumen yang cocok dengan pencarian Anda.'
                      : 'Tidak ada dokumen ditemukan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedDocument && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Detail Dokumen
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>
                        <strong>ID Dokumen:</strong> {selectedDocument.id}
                      </p>
                      <p>
                        <strong>Persyaratan:</strong> {selectedDocument.requirements}
                      </p>
                      <p>
                        <strong>Deskripsi:</strong> {selectedDocument.description}
                      </p>
                      <p>
                        <strong>Tanggal Unggah:</strong> {selectedDocument.upload_date}
                      </p>
                      <p>
                        <strong>Tanggal Tenggat:</strong>{' '}
                        {selectedDocument.due_date || 'T/A'}
                      </p>
                      <p>
                        <strong>Status Tanda Tangan:</strong>{' '}
                        {selectedDocument.status === 'completed' ||
                        selectedDocument.status === 'signed'
                          ? 'Dokumen telah ditandatangani'
                          : selectedDocument.status === 'pending'
                          ? 'Menunggu tanda tangan'
                          : 'Dikirim untuk ditandatangani'}
                      </p>
                      {selectedDocument.signed_at && (
                        <p>
                          <strong>Tanggal Ditandatangani:</strong>{' '}
                          {selectedDocument.signed_at}
                        </p>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between w-full gap-2">
                        {statuses.map((status, index) => (
                          <React.Fragment key={status}>
                            <div
                              className={`px-2 py-1 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                getStatusOrder(selectedDocument.status) >=
                                getStatusOrder(status)
                                  ? getStatusColor(status)
                                  : 'bg-gray-300'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </div>
                            {index < statuses.length - 1 && (
                              <div
                                className={`flex-grow h-1 ${
                                  getStatusOrder(selectedDocument.status) >=
                                  getStatusOrder(status)
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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