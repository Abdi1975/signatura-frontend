import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Search, Plus, MoreVertical, Edit, Trash2, X, User, Clock } from 'lucide-react';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  name: string;
  email: string;
  unread_count: number;
  last_message: string | null;
  last_message_time: string | null;
}

interface UserOption {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ChatPage() {
  const [currentUser] = useState({ id: 1, name: 'John Doe', email: 'john@example.com' });
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Jane Smith',
      email: 'jane@example.com',
      unread_count: 2,
      last_message: 'Hello, how are you?',
      last_message_time: '2024-11-16 14:30:00'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      unread_count: 0,
      last_message: 'Thanks for the update!',
      last_message_time: '2024-11-15 09:20:00'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      unread_count: 1,
      last_message: 'Can we schedule a meeting?',
      last_message_time: '2024-11-14 16:45:00'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      conversation_id: 1,
      sender_id: 2,
      receiver_id: 1,
      message: 'Hello, how are you?',
      read: false,
      created_at: '2024-11-16 14:30:00'
    },
    {
      id: 2,
      conversation_id: 1,
      sender_id: 1,
      receiver_id: 2,
      message: 'I\'m doing great, thanks for asking!',
      read: true,
      created_at: '2024-11-16 14:32:00'
    },
    {
      id: 3,
      conversation_id: 1,
      sender_id: 2,
      receiver_id: 1,
      message: 'That\'s wonderful to hear!',
      read: false,
      created_at: '2024-11-16 14:33:00'
    }
  ]);

  const [allUsers] = useState<UserOption[]>([
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'admin' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'user' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'user' }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editMessageText, setEditMessageText] = useState('');

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, activeConversationId]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = messages.filter(m => m.conversation_id === activeConversationId);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.last_message && conv.last_message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversationId) return;

    const newMessage: Message = {
      id: messages.length + 1,
      conversation_id: activeConversationId,
      sender_id: currentUser.id,
      receiver_id: activeConversation?.id || 0,
      message: messageInput,
      read: false,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Update conversation last message
    setConversations(conversations.map(conv =>
      conv.id === activeConversationId
        ? { ...conv, last_message: messageInput, last_message_time: newMessage.created_at }
        : conv
    ));
  };

  const handleNewChat = () => {
    if (!selectedUser || !newChatMessage.trim()) return;

    const newConvId = conversations.length + 1;
    const newConversation: Conversation = {
      id: newConvId,
      name: selectedUser.name,
      email: selectedUser.email,
      unread_count: 0,
      last_message: newChatMessage,
      last_message_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const newMessage: Message = {
      id: messages.length + 1,
      conversation_id: newConvId,
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      message: newChatMessage,
      read: false,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    setConversations([newConversation, ...conversations]);
    setMessages([...messages, newMessage]);
    setActiveConversationId(newConvId);
    setShowNewChatModal(false);
    setSelectedUser(null);
    setNewChatMessage('');
    setUserSearchTerm('');
  };

  const handleDeleteConversation = () => {
    if (!activeConversationId) return;
    if (confirm('Apakah Anda yakin ingin menghapus seluruh percakapan ini? Tindakan ini tidak dapat dibatalkan.')) {
      setConversations(conversations.filter(c => c.id !== activeConversationId));
      setMessages(messages.filter(m => m.conversation_id !== activeConversationId));
      setActiveConversationId(null);
      setShowChatMenu(false);
    }
  };

  const handleEditMessage = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditMessageText(message.message);
    }
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editMessageText.trim()) {
      setMessages(messages.map(m =>
        m.id === editingMessageId ? { ...m, message: editMessageText } : m
      ));
      setEditingMessageId(null);
      setEditMessageText('');
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      setMessages(messages.filter(m => m.id !== messageId));
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Obrolan</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex h-[calc(100vh-180px)]">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <MessageCircle className="mr-2" size={24} />
                    Percakapan
                  </h2>
                  <span className="text-sm text-gray-500">{conversations.length} obrolan</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari percakapan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left hover:bg-gray-50 transition-colors duration-150 ${
                      activeConversationId === conv.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : ''
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="text-gray-500" size={24} />
                            </div>
                            {conv.unread_count > 0 && (
                              <div className="absolute -top-1 -right-1">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                  {conv.unread_count}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conv.name}
                            </h3>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {conv.last_message_time ? (
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              {formatTime(conv.last_message_time).split(',')[0]}
                            </div>
                          ) : (
                            <span className="italic">Tidak ada pesan</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600 truncate flex items-center">
                          <MessageCircle
                            size={16}
                            className={`mr-1 ${
                              conv.unread_count > 0 ? 'text-blue-500' : 'text-gray-400'
                            }`}
                          />
                          {conv.last_message || 'Mulai percakapan'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col bg-white">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {activeConversation.name}
                    </h2>
                    <div className="relative">
                      <button
                        onClick={() => setShowChatMenu(!showChatMenu)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MoreVertical size={24} />
                      </button>
                      {showChatMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={handleDeleteConversation}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Hapus Obrolan
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    ref={chatMessagesRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                  >
                    {activeMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg relative group ${
                            message.sender_id === currentUser.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-800'
                          }`}
                        >
                          {editingMessageId === message.id ? (
                            <div>
                              <input
                                type="text"
                                value={editMessageText}
                                onChange={(e) => setEditMessageText(e.target.value)}
                                className="w-full px-2 py-1 border rounded text-gray-900"
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingMessageId(null)}
                                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p>{message.message}</p>
                              <div
                                className={`text-xs mt-1 ${
                                  message.sender_id === currentUser.id
                                    ? 'text-blue-200'
                                    : 'text-gray-600'
                                }`}
                              >
                                {formatTime(message.created_at)}
                              </div>
                              {message.sender_id === currentUser.id && (
                                <div className="hidden group-hover:flex absolute -top-2 -right-2 gap-1">
                                  <button
                                    onClick={() => handleEditMessage(message.id)}
                                    className="bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-600"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ketik pesan"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Send size={20} />
                        Kirim
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Pilih percakapan untuk memulai obrolan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Conversation Button */}
        <button
          onClick={() => setShowNewChatModal(true)}
          className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-40"
        >
          <Plus size={24} />
        </button>

        {/* New Conversation Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[450px] shadow-xl">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                  <MessageCircle className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mulai Percakapan Baru
                </h3>
                <p className="text-sm text-gray-600">Pilih pengguna untuk memulai obrolan</p>
              </div>

              <div className="space-y-4">
                {/* User Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-2" size={16} />
                    Pilih Pengguna
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                    >
                      <span className="flex items-center">
                        {selectedUser ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-2">
                              <span className="text-white text-xs font-bold">
                                {selectedUser.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">{selectedUser.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {selectedUser.email}
                            </span>
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 text-gray-400" size={20} />
                            <span className="text-gray-500">Cari atau pilih pengguna...</span>
                          </>
                        )}
                      </span>
                    </button>

                    {showUserDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
                        <div className="p-2">
                          <div className="relative mb-2">
                            <input
                              type="text"
                              value={userSearchTerm}
                              onChange={(e) => setUserSearchTerm(e.target.value)}
                              placeholder="Cari pengguna..."
                              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                          </div>

                          <div className="max-h-48 overflow-y-auto">
                            {filteredUsers.map((user) => (
                              <button
                                key={user.id}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserDropdown(false);
                                  setUserSearchTerm('');
                                }}
                                className="w-full px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-150 flex items-center justify-between group"
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                                    <span className="text-white text-xs font-bold">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium text-gray-900 text-sm">
                                      {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="inline mr-2" size={16} />
                    Pesan Pertama
                  </label>
                  <textarea
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Ketik pesan Anda..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleNewChat}
                    disabled={!selectedUser || !newChatMessage.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Kirim Pesan
                  </button>
                  <button
                    onClick={() => {
                      setShowNewChatModal(false);
                      setSelectedUser(null);
                      setNewChatMessage('');
                      setUserSearchTerm('');
                    }}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}