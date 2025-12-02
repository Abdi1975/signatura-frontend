import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface Document {
  id: number;
  file_path: string;
  signed_file_path: string;
  drive_link: string;
  description: string;
  status: 'sent' | 'pending' | 'signed' | 'completed';
  upload_date: string;
  due_date: string | null;
  signed_at: string | null;
  sender_name: string;
  sender_email: string;
  recipient_id: number;
}

export default function DocumentsToSignPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      file_path: '/uploads/contract_2024.pdf',
      signed_file_path: '',
      drive_link: '',
      description: 'Employment Contract 2024',
      status: 'pending',
      upload_date: '2024-11-15 10:30:00',
      due_date: '2024-11-22',
      signed_at: null,
      sender_name: 'John Doe',
      sender_email: 'john.doe@company.com',
      recipient_id: 1
    },
    {
      id: 2,
      file_path: '/uploads/nda_agreement.pdf',
      signed_file_path: '/uploads/signed/nda_agreement_signed.pdf',
      drive_link: '',
      description: 'Non-Disclosure Agreement',
      status: 'signed',
      upload_date: '2024-11-14 14:20:00',
      due_date: '2024-11-21',
      signed_at: '2024-11-15 09:15:00',
      sender_name: 'Jane Smith',
      sender_email: 'jane.smith@company.com',
      recipient_id: 1
    },
    {
      id: 3,
      file_path: '/uploads/project_proposal.pdf',
      signed_file_path: '',
      drive_link: '',
      description: 'Q4 Project Proposal',
      status: 'sent',
      upload_date: '2024-11-13 16:45:00',
      due_date: '2024-11-20',
      signed_at: null,
      sender_name: 'Mike Johnson',
      sender_email: 'mike.johnson@company.com',
      recipient_id: 1
    }
  ]);

  const currentUserId = 1; // Simulated user ID

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

  const handleSignClick = (documentId: number, documentPath: string) => {
    // Navigate to doc-editor
    window.location.href = '/src/pages/doc-editor/index.html';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Receive for eSign</h1>

        {documents.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="py-3 px-6">Document ID</th>
                  <th className="py-3 px-6">Sender</th>
                  <th className="py-3 px-6">Document</th>
                  <th className="py-3 px-6">Upload Date & Time</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Your Position</th>
                  <th className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const isMyTurn = doc.recipient_id === currentUserId;
                  const hasSigned = doc.status === 'signed' || doc.status === 'completed';
                  const documentToShow = doc.signed_file_path || doc.file_path;

                  return (
                    <tr
                      key={doc.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {doc.id}
                      </td>
                      <td className="py-4 px-6">
                        {doc.sender_name}
                        <br />
                        <span className="text-xs text-gray-500">
                          {doc.sender_email}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={documentToShow}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {documentToShow.split('/').pop()}
                        </a>
                      </td>
                      <td className="py-4 px-6">{doc.upload_date}</td>
                      <td className="py-4 px-6">{doc.due_date || 'N/A'}</td>
                      <td className="py-4 px-6">{doc.description}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            doc.status
                          )}`}
                        >
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">Penerima 1 dari 1</td>
                      <td className="py-4 px-6">
                        {!hasSigned && isMyTurn ? (
                          <button
                            onClick={() => handleSignClick(doc.id, documentToShow)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                          >
                            Sign
                          </button>
                        ) : hasSigned ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> Signed
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            Awaiting Previous Signature
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No documents to sign at the moment.</p>
        )}
      </div>
    </div>
  );
}