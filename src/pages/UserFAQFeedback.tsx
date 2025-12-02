import React, { useState } from 'react';
import { Search, Upload, X } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface User {
  name: string;
  email: string;
}

export default function UserFAQFeedbackPage() {
  const [currentUser] = useState<User>({
    name: 'John Doe',
    email: 'john.doe@company.com'
  });

  const [activeTab, setActiveTab] = useState<'faq' | 'feedback'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // FAQ States
  const [faqs] = useState<FAQ[]>([
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

  // Feedback Form States
  const [feedbackForm, setFeedbackForm] = useState({
    subject: '',
    message: '',
    attachment: null as File | null
  });

  // Notification Handler
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  // Feedback Handlers
  const handleSubmitFeedback = () => {
    if (!feedbackForm.subject || !feedbackForm.message) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Submit feedback logic here
    showNotification('Feedback submitted successfully!', 'success');
    setFeedbackForm({ subject: '', message: '', attachment: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      setFeedbackForm({ ...feedbackForm, attachment: file });
    }
  };

  const filteredFAQs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">FAQs & Feedback</h1>
          <p className="text-gray-600 mt-2">Find answers or share your feedback with us</p>
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
                    ? 'text-blue-600 bg-gray-100 border-b-2 border-blue-600'
                    : 'hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                Frequently Asked Questions
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('feedback')}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === 'feedback'
                    ? 'text-blue-600 bg-gray-100 border-b-2 border-blue-600'
                    : 'hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                Submit Feedback
              </button>
            </li>
          </ul>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

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
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No FAQs found matching your search.
              </p>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Submit Feedback
            </h2>
            <p className="text-gray-600 mb-6">
              We value your feedback! Share your thoughts, report issues, or suggest improvements.
            </p>

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
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={feedbackForm.subject}
                  onChange={(e) =>
                    setFeedbackForm({ ...feedbackForm, subject: e.target.value })
                  }
                  placeholder="Brief description of your feedback"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={feedbackForm.message}
                  onChange={(e) =>
                    setFeedbackForm({ ...feedbackForm, message: e.target.value })
                  }
                  placeholder="Please provide detailed feedback..."
                  required
                  rows={6}
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
                  accept="image/*,.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {feedbackForm.attachment && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {feedbackForm.attachment.name}
                  </p>
                )}
              </div>
              <button
                onClick={handleSubmitFeedback}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded flex items-center gap-2 transition"
              >
                <Upload size={20} />
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}