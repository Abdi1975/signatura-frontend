import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Eye } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Feedback {
  id: number;
  user_id: number;
  user_name: string;
  email: string;
  subject: string;
  message: string;
  attachment: string | null;
  created_at: string;
}

interface User {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function FAQFeedbackPage() {
  // Toggle between admin and user view for demo
  const [currentUser, setCurrentUser] = useState<User>({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'user' // Change to 'admin' to see admin view
  });

  const [activeTab, setActiveTab] = useState<'faq' | 'feedback'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // FAQ States
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: 'How do I upload a document?',
      answer: 'You can upload a document by going to the "Send for eSign" page and selecting your file.'
    },
    {
      id: 2,
      question: 'What file formats are supported?',
      answer: 'We support PDF, DOC, and DOCX file formats for document signing.'
    },
    {
      id: 3,
      question: 'How long does the signing process take?',
      answer: 'The signing process typically takes 1-3 business days depending on the recipient response time.'
    }
  ]);

  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  // Feedback States
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      user_id: 1,
      user_name: 'Jane Smith',
      email: 'jane.smith@company.com',
      subject: 'Feature Request',
      message: 'It would be great to have bulk upload functionality for multiple documents at once.',
      attachment: null,
      created_at: '2024-11-15 10:30:00'
    },
    {
      id: 2,
      user_id: 2,
      user_name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      subject: 'Bug Report',
      message: 'I encountered an issue when trying to download signed documents. The download button is not responsive.',
      attachment: '/uploads/screenshot.png',
      created_at: '2024-11-14 14:20:00'
    }
  ]);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    subject: '',
    message: '',
    attachment: null as File | null
  });

  const isAdmin = currentUser.role === 'admin';

  // Notification Handler
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  // FAQ Handlers
  const openFAQModal = (faq: FAQ | null = null) => {
    if (faq) {
      setEditingFAQ(faq);
      setFaqForm({ question: faq.question, answer: faq.answer });
    } else {
      setEditingFAQ(null);
      setFaqForm({ question: '', answer: '' });
    }
    setShowFAQModal(true);
  };

  const handleSaveFAQ = () => {
    if (!faqForm.question || !faqForm.answer) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (editingFAQ) {
      setFaqs(faqs.map(f => f.id === editingFAQ.id ? { ...f, ...faqForm } : f));
      showNotification('FAQ updated successfully!', 'success');
    } else {
      const newFaq: FAQ = {
        id: faqs.length + 1,
        ...faqForm
      };
      setFaqs([newFaq, ...faqs]);
      showNotification('FAQ added successfully!', 'success');
    }
    setShowFAQModal(false);
    setFaqForm({ question: '', answer: '' });
  };

  const handleDeleteFAQ = (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(f => f.id !== id));
      showNotification('FAQ deleted successfully!', 'success');
    }
  };

  // Feedback Handlers
  const handleSubmitFeedback = () => {
    if (!feedbackForm.subject || !feedbackForm.message) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const newFeedback: Feedback = {
      id: feedbacks.length + 1,
      user_id: 1,
      user_name: currentUser.name,
      email: currentUser.email,
      subject: feedbackForm.subject,
      message: feedbackForm.message,
      attachment: feedbackForm.attachment ? `/uploads/${feedbackForm.attachment.name}` : null,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    showNotification('Feedback submitted successfully!', 'success');
    setFeedbackForm({ subject: '', message: '', attachment: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeedbackForm({ ...feedbackForm, attachment: e.target.files[0] });
    }
  };

  const filteredFAQs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full">
        {/* Header with Role Toggle (for demo) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isAdmin ? 'Insights Hub' : 'FAQs & Feedback'}
          </h1>
          
          {/* Demo: Role Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentUser({ ...currentUser, role: 'user' })}
              className={`px-4 py-2 rounded ${
                !isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              User View
            </button>
            <button
              onClick={() => setCurrentUser({ ...currentUser, role: 'admin' })}
              className={`px-4 py-2 rounded ${
                isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              Admin View
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className="fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className={`h-6 w-6 ${
                      notification.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => setNotification({ ...notification, show: false })}
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4">
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('faq')}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === 'faq'
                    ? 'text-blue-600 bg-gray-100'
                    : 'hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                FAQs
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('feedback')}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === 'feedback'
                    ? 'text-blue-600 bg-gray-100'
                    : 'hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isAdmin ? 'Feedback' : 'Submit Feedback'}
              </button>
            </li>
          </ul>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isAdmin ? 'FAQs' : 'Frequently Asked Questions'}
              </h2>
              {isAdmin && (
                <button
                  onClick={() => openFAQModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add FAQ
                </button>
              )}
            </div>

            {!isAdmin && (
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            )}

            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 mb-4">{faq.answer}</p>
                    {isAdmin && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openFAQModal(faq)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                {isAdmin
                  ? 'No FAQs available. Add your first FAQ!'
                  : 'No FAQs found matching your search.'}
              </p>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {isAdmin ? 'Feedback' : 'Submit Feedback'}
            </h2>

            {isAdmin ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Email</th>
                      <th className="py-3 px-6">Subject</th>
                      <th className="py-3 px-6">Message</th>
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-6">Attachment</th>
                      <th className="py-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((feedback) => (
                      <tr
                        key={feedback.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="py-4 px-6">{feedback.user_name}</td>
                        <td className="py-4 px-6">{feedback.email}</td>
                        <td className="py-4 px-6">{feedback.subject}</td>
                        <td className="py-4 px-6">
                          {feedback.message.substring(0, 50)}...
                        </td>
                        <td className="py-4 px-6">{feedback.created_at}</td>
                        <td className="py-4 px-6">
                          {feedback.attachment ? (
                            <a
                              href={feedback.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setShowFeedbackModal(true);
                            }}
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={currentUser.name}
                    readOnly
                    className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    readOnly
                    className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.subject}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, subject: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Message
                  </label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, message: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Attachment (Optional, max 5MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={handleSubmitFeedback}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2"
                >
                  <Upload size={20} />
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAQ Modal (Admin) */}
      {showFAQModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowFAQModal(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingFAQ ? 'Edit FAQ' : 'Add FAQ'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) =>
                        setFaqForm({ ...faqForm, question: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer
                    </label>
                    <textarea
                      value={faqForm.answer}
                      onChange={(e) =>
                        setFaqForm({ ...faqForm, answer: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSaveFAQ}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowFAQModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Details Modal (Admin) */}
      {showFeedbackModal && selectedFeedback && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowFeedbackModal(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Feedback Details
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Name:</strong> {selectedFeedback.user_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedFeedback.email}
                  </p>
                  <p>
                    <strong>Subject:</strong> {selectedFeedback.subject}
                  </p>
                  <p>
                    <strong>Message:</strong> {selectedFeedback.message}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedFeedback.created_at}
                  </p>
                  {selectedFeedback.attachment && (
                    <p>
                      <strong>Attachment:</strong>{' '}
                      <a
                        href={selectedFeedback.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Attachment
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}