import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, Search, ChevronLeft, MoreVertical, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  email: string;
  last_message: string;
  last_message_at: string;
}

const Inbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) return;

    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.emit('join', user.id);

    newSocket.on('new_message', (message: Message) => {
      if (selectedUser && (message.sender_id === selectedUser.id || message.receiver_id === selectedUser.id)) {
        setMessages(prev => [...prev, message]);
      }
      // Refresh conversations list for admin
      if (user.role === 'admin') {
        fetchConversations();
      }
    });

    newSocket.on('message_sent', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('message_error', (data: any) => {
      console.error('Message error:', data.error);
      alert('Failed to send message: ' + data.error);
    });

    return () => {
      newSocket.close();
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchConversations();
    } else if (user?.role === 'user' || user?.role === 'customer') {
      // For customers, the "conversation" is always with admin
      setSelectedUser({ id: 'admin', name: 'YA Wedding', email: 'admin@ya.com', last_message: '', last_message_at: '' });
      fetchMessages('admin');
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/admin/conversations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ya_token')}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('ya_token');
        localStorage.removeItem('ya_user');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON but got ${contentType}`);
      }
      
      const data = await response.json();
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      const response = await fetch(`/api/messages/${otherUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ya_token')}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('ya_token');
        localStorage.removeItem('ya_user');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON but got ${contentType}`);
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket || !user) return;

    socket.emit('send_message', {
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage
    });

    setNewMessage('');
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedUser(conv);
    fetchMessages(conv.id);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-4">
        <div className="text-center">
          <MessageSquare size={48} className="text-brand mx-auto mb-4 opacity-20" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to access your messages.</p>
          <a href="/login" className="bg-brand text-dark px-8 py-3 rounded-xl font-bold">Login Now</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-dark flex flex-col md:flex-row">
      {/* Sidebar - Conversations List (Admin Only) */}
      {user.role === 'admin' && (
        <div className={`w-full md:w-80 border-r border-white/5 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search conversations..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-brand outline-none"
              />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5 ${selectedUser?.id === conv.id ? 'bg-white/5' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                  {conv.name[0]}
                </div>
                <div className="flex-grow text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-bold truncate">{conv.name}</span>
                    <span className="text-[10px] text-gray-500">{new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{conv.last_message}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className={`flex-grow flex flex-col ${!selectedUser && user.role === 'admin' ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-dark-lighter/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (user.role === 'admin' && selectedUser) {
                      setSelectedUser(null);
                    } else {
                      navigate(-1);
                    }
                  }} 
                  className="text-gray-400 hover:text-brand transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h3 className="text-white font-bold">{selectedUser.name}</h3>
                  <span className="text-[10px] text-brand uppercase tracking-widest font-bold">Online</span>
                </div>
              </div>
              <button className="text-gray-400 p-2 hover:bg-white/5 rounded-full transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id || idx}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl ${
                      isMe ? 'bg-brand text-dark rounded-tr-none' : 'bg-white/5 text-white rounded-tl-none border border-white/10'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-dark/60' : 'text-gray-500'}`}>
                        <span className="text-[10px]">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (msg.is_read ? <CheckCheck size={12} /> : <Check size={12} />)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/5 bg-dark-lighter/50 backdrop-blur-md">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white outline-none focus:border-brand transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-brand text-dark p-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-center p-6">
            <div>
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a user from the sidebar to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
