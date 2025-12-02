import React, { useState } from 'react';
import { Calendar, Search, Filter, FileText, Download, CheckCircle, Clock } from 'lucide-react';

interface Document {
  id: number;
  file_path: string;
  sender_name: string;
  recipient_name: string;
  recipient_email: string;
  upload_date: string;
  due_date: string | null;
  status: 'sent' | 'pending' | 'signed' | 'completed';
}

export default function ReportsPage() {
  const [documents] = useState<Document[]>([
    {
      id: 1,
      file_path: '/uploads/contract_2024.pdf',
      sender_name: 'John Doe',
      recipient_name: 'Jane Smith',
      recipient_email: 'jane@example.com',
      upload_date: '2024-11-15 10:30:00',
      due_date: '2024-11-22',
      status: 'completed'
    },
    {
      id: 2,
      file_path: '/uploads/nda_agreement.pdf',
      sender_name: 'Mike Johnson',
      recipient_name: 'Sarah Williams',
      recipient_email: 'sarah@example.com',
      upload_date: '2024-11-14 14:20:00',
      due_date: '2024-11-21',
      status: 'pending'
    },
    {
      id: 3,
      file_path: '/uploads/project_proposal.pdf',
      sender_name: 'David Brown',
      recipient_name: 'Emily Davis',
      recipient_email: 'emily@example.com',
      upload_date: '2024-11-13 16:45:00',
      due_date: '2024-11-20',
      status: 'sent'
    },
    {
      id: 4,
      file_path: '/uploads/service_agreement.pdf',
      sender_name: 'Alice Cooper',
      recipient_name: 'Bob Wilson',
      recipient_email: 'bob@example.com',
      upload_date: '2024-11-12 09:15:00',
      due_date: '2024-11-19',
      status: 'signed'
    }
  ]);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    keyword: '',
    status: ''
  });

  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      sent: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-green-100 text-green-800',
      completed: 'bg-green-200 text-green-900'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const translateStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      sent: 'Terkirim',
      pending: 'Menunggu',
      signed: 'Ditandatangani',
      completed: 'Selesai'
    };
    return statusMap[status] || status;
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(doc => {
        const uploadDate = new Date(doc.upload_date).toISOString().split('T')[0];
        return uploadDate >= filters.startDate && uploadDate <= filters.endDate;
      });
    }

    // Filter by keyword
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        doc =>
          doc.file_path.toLowerCase().includes(keyword) ||
          doc.sender_name.toLowerCase().includes(keyword) ||
          doc.recipient_name.toLowerCase().includes(keyword) ||
          doc.recipient_email.toLowerCase().includes(keyword)
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    return filtered;
  };

  const filteredDocuments = filterDocuments();

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocuments.map(doc => doc.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectDoc = (docId: number) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedDocs, docId];
      setSelectedDocs(newSelected);
      if (newSelected.length === filteredDocuments.length) {
        setSelectAll(true);
      }
    }
  };

  const handleGeneratePDF = () => {
    const docsToExport = selectedDocs.length > 0
      ? filteredDocuments.filter(doc => selectedDocs.includes(doc.id))
      : filteredDocuments;

    alert(`Generating PDF report with ${docsToExport.length} documents...`);
    console.log('Documents to export:', docsToExport);
    // In real implementation, this would generate and download PDF
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan</h1>

        {/* Filter Form */}
        <div className="mb-6 bg-white p-5 rounded-lg shadow-lg">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Saring Dokumen</h2>
            <div className="w-full h-0.5 bg-blue-500 mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Calendar size={16} />
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm transition duration-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Calendar size={16} />
                Tanggal Akhir
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm transition duration-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Search size={16} />
                Kata Kunci
              </label>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Cari dokumen..."
                className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm transition duration-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Filter size={16} />
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm transition duration-300"
              >
                <option value="">Semua Status</option>
                <option value="sent">Terkirim</option>
                <option value="pending">Menunggu</option>
                <option value="signed">Ditandatangani</option>
                <option value="completed">Selesai</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {}}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm flex items-center gap-2"
            >
              <Filter size={16} />
              Terapkan Filter
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Nama Dokumen</th>
                <th className="py-3 px-6">Pengirim</th>
                <th className="py-3 px-6">Penerima</th>
                <th className="py-3 px-6">Tanggal Unggah</th>
                <th className="py-3 px-6">Tanggal Tenggat</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="bg-white border-b hover:bg-gray-50 transition duration-150">
                    <td className="p-4 w-4">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleSelectDoc(doc.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6">{doc.id}</td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      {doc.file_path.split('/').pop()}
                    </td>
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
                    <td className="py-4 px-6">{formatDate(doc.upload_date)}</td>
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
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b">
                  <td colSpan={8} className="py-4 px-6 text-center">
                    Tidak ada dokumen yang cocok dengan filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGeneratePDF}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center gap-2"
          >
            <Download size={20} />
            Buat Laporan PDF
          </button>
        </div>
      </div>
    </div>
  );
}