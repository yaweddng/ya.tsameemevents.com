import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, Search, ChevronLeft, MoreVertical, Check, CheckCheck, ArrowLeft, Phone, Video, Paperclip, Mic, ShieldAlert, Eye, Trash2, File as FileIcon, Download, X, MicOff, VideoOff, PhoneOff, Minimize2, Maximize2, UserPlus, Camera, CameraOff, Volume2, VolumeX, RefreshCcw, Settings, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  type?: string;
  file_id?: string;
  created_at: string;
  is_read: boolean;
  is_deleted?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  email: string;
  role?: string;
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const notificationSound = useRef(new Audio('https://tsameemevents.com/wp-content/uploads/notification-sound.mp3'));

  // Call State
  const [callState, setCallState] = useState<{
    isReceivingCall: boolean;
    caller: string;
    callerName: string;
    callerSignal: any;
    callAccepted: boolean;
    callEnded: boolean;
    callType: 'audio' | 'video';
    callId: string | null;
  }>({
    isReceivingCall: false,
    caller: '',
    callerName: '',
    callerSignal: null,
    callAccepted: false,
    callEnded: false,
    callType: 'audio',
    callId: null
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Sounds
  const sounds = useRef({
    notification: new Audio('https://tsameemevents.com/wp-content/uploads/notification-sound.mp3'),
    messageDelivered: new Audio('https://tsameemevents.com/wp-content/uploads/message-delivered.mp3'),
    chatbox: new Audio('https://tsameemevents.com/wp-content/uploads/chatbox-notifications.mp3'),
    callWaiting: new Audio('https://tsameemevents.com/wp-content/uploads/call-waiting.mp3'),
    calling: new Audio('https://tsameemevents.com/wp-content/uploads/calling.mp3'),
    typing: new Audio('https://tsameemevents.com/wp-content/uploads/typing.mp3'),
    error: new Audio('https://tsameemevents.com/wp-content/uploads/declined-ended-error.mp3')
  });

  useEffect(() => {
    sounds.current.callWaiting.loop = true;
    sounds.current.calling.loop = true;
    return () => {
      Object.values(sounds.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // File Upload State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Admin Monitoring State
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [monitoringCall, setMonitoringCall] = useState<string | null>(null);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [userPreferences, setUserPreferences] = useState({ allow_calls: true });
  const [featureBlocks, setFeatureBlocks] = useState<any[]>([]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const subscribeToPush = async (userId: string) => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.log('Notification permission denied.');
            return;
          }
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BAmbzv49ncwG3KaUwfeEmHRL0iRyBNR9Rq-0ckgs98qCp_-OsesHTgWzFmAOImUFVDuxQHFdWHTUNUD2wbeGP6g'
        });

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription, userId })
        });
      } catch (error) {
        console.error('Push subscription failed:', error);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      try {
        const res = await fetch(`/api/user/preferences?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUserPreferences({ allow_calls: data.allow_calls === 1 });
        }
      } catch (err) {
        console.error("Failed to fetch preferences", err);
      }
    };
    
    const fetchFeatureBlocks = async () => {
      try {
        const res = await fetch(`/api/admin/feature-blocks`);
        if (res.ok) {
          const data = await res.json();
          setFeatureBlocks(data);
        }
      } catch (err) {
        console.error("Failed to fetch feature blocks", err);
      }
    };

    fetchPreferences();
    fetchFeatureBlocks();
    subscribeToPush(user.id);

    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.emit('join', user.id);

    newSocket.on('new_message', (message: Message) => {
      // Play sound
      if (document.hidden) {
        sounds.current.notification.play().catch(e => console.error("Error playing sound:", e));
      } else {
        sounds.current.chatbox.play().catch(e => console.error("Error playing sound:", e));
      }

      // Show local notification if not focused on this chat
      if (document.hidden || !selectedUser || (message.sender_id !== selectedUser.id && message.receiver_id !== selectedUser.id)) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Message', {
            body: message.content,
            icon: '/favicon.svg'
          });
        }
      }

      if (selectedUser && (message.sender_id === selectedUser.id || message.receiver_id === selectedUser.id)) {
        setMessages(prev => [...prev, message]);
      }
      // Refresh conversations list for admin
      if (user.role === 'admin') {
        fetchConversations();
      }
    });

    newSocket.on('message_sent', (message: Message) => {
      sounds.current.messageDelivered.play().catch(e => console.error("Error playing sound:", e));
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('message_error', (data: any) => {
      sounds.current.error.play().catch(e => console.error("Error playing sound:", e));
      console.error('Message error:', data.error);
      alert('Failed to send message: ' + data.error);
    });

    newSocket.on('message_deleted', (data: any) => {
      setMessages(prev => prev.map(msg => msg.id === data.messageId ? { ...msg, is_deleted: true } : msg));
    });

    newSocket.on('user_typing', (data: { userId: string, isTyping: boolean }) => {
      setTypingUsers(prev => ({ ...prev, [data.userId]: data.isTyping }));
    });

    newSocket.on('user_status', (data: { userId: string, status: 'online' | 'offline' }) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: data.status === 'online' }));
    });

    // Call Listeners
    newSocket.on('call_initiated', (data: any) => {
      setCallState(prev => ({ ...prev, callId: data.callId }));
    });

    newSocket.on('call_incoming', (data: any) => {
      sounds.current.callWaiting.play().catch(e => console.error("Error playing sound:", e));
      setCallState({
        isReceivingCall: true,
        caller: data.from,
        callerName: data.name,
        callerSignal: data.signal,
        callAccepted: false,
        callEnded: false,
        callType: data.type,
        callId: data.callId
      });
    });

    newSocket.on('call_rejected', (data: any) => {
      sounds.current.calling.pause();
      sounds.current.calling.currentTime = 0;
      sounds.current.error.play().catch(e => console.error("Error playing sound:", e));
      alert(data.reason);
      endCall();
    });

    newSocket.on('call_ended', (data: any) => {
      sounds.current.calling.pause();
      sounds.current.calling.currentTime = 0;
      sounds.current.callWaiting.pause();
      sounds.current.callWaiting.currentTime = 0;
      sounds.current.error.play().catch(e => console.error("Error playing sound:", e));
      if (data?.reason) alert(data.reason);
      endCall();
    });

    // Admin Monitoring Listeners
    if (user.role === 'admin') {
      newSocket.emit('join_admin_monitoring');
      
      newSocket.on('admin_call_started', (data: any) => {
        setActiveCalls(prev => [...prev, data]);
      });

      newSocket.on('admin_call_ended', (data: any) => {
        setActiveCalls(prev => prev.filter(call => call.callId !== data.callId));
        if (monitoringCall === data.callId) {
          setMonitoringCall(null);
        }
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
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

  const toggleCamera = async () => {
    if (!stream || callState.callType !== 'video') return;
    
    try {
      const newFacingMode = isFrontCamera ? 'environment' : 'user';
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: newFacingMode }, 
        audio: true 
      });
      
      const videoTrack = newStream.getVideoTracks()[0];
      const oldVideoTrack = stream.getVideoTracks()[0];
      
      if (connectionRef.current) {
        connectionRef.current.replaceTrack(oldVideoTrack, videoTrack, stream);
      }
      
      // Update local stream state
      oldVideoTrack.stop();
      const updatedStream = new MediaStream([videoTrack, ...stream.getAudioTracks()]);
      setStream(updatedStream);
      
      if (myVideo.current) {
        myVideo.current.srcObject = updatedStream;
      }
      
      setIsFrontCamera(!isFrontCamera);
    } catch (err) {
      console.error("Error toggling camera:", err);
      setNotification({ message: "Failed to switch camera.", type: 'error' });
    }
  };

  const callUser = async (type: 'audio' | 'video') => {
    if (!selectedUser || !socket || !user) return;
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: currentStream
      });

      peer.on('signal', (data) => {
        socket.emit('call_user', {
          userToCall: selectedUser.id,
          signalData: data,
          from: user.id,
          name: user.name,
          type
        });
        sounds.current.calling.play().catch(e => console.error("Error playing sound:", e));
      });

      peer.on('stream', (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });

      socket.on('call_accepted', (signal) => {
        sounds.current.calling.pause();
        sounds.current.calling.currentTime = 0;
        setCallState(prev => ({ ...prev, callAccepted: true }));
        peer.signal(signal);
        
        // Start duration timer
        setCallDuration(0);
        const timer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        setCallTimer(timer);
      });

      connectionRef.current = peer;
      setCallState(prev => ({ ...prev, callType: type }));
      
      // 40 seconds timeout
      setTimeout(() => {
        if (!callState.callAccepted) {
          sounds.current.calling.pause();
          sounds.current.calling.currentTime = 0;
          sounds.current.error.play().catch(e => console.error("Error playing sound:", e));
          endCall();
        }
      }, 40000);
    } catch (err) {
      console.error("Failed to get local stream", err);
      setNotification({ message: "Could not access camera/microphone. Please check permissions.", type: 'error' });
    }
  };

  const answerCall = async (withVideo: boolean = true) => {
    sounds.current.callWaiting.pause();
    sounds.current.callWaiting.currentTime = 0;
    setCallState(prev => ({ ...prev, callAccepted: true, callType: withVideo ? 'video' : 'audio' }));
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: withVideo, audio: true });
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: currentStream
      });

      peer.on('signal', (data) => {
        socket?.emit('answer_call', { signal: data, to: callState.caller });
      });

      peer.on('stream', (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });

      peer.signal(callState.callerSignal);
      connectionRef.current = peer;
      
      // Start duration timer
      setCallDuration(0);
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      setCallTimer(timer);
    } catch (err) {
      console.error("Failed to get local stream", err);
      setNotification({ message: "Could not access camera/microphone. Please check permissions.", type: 'error' });
    }
  };

  const endCall = () => {
    sounds.current.calling.pause();
    sounds.current.calling.currentTime = 0;
    sounds.current.callWaiting.pause();
    sounds.current.callWaiting.currentTime = 0;
    
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    setCallState({
      isReceivingCall: false,
      caller: '',
      callerName: '',
      callerSignal: null,
      callAccepted: false,
      callEnded: true,
      callType: 'audio',
      callId: null
    });
    setIsMinimized(false);
    setIsVideoOff(false);
    setIsMuted(false);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (myVideo.current) myVideo.current.srcObject = null;
    if (userVideo.current) userVideo.current.srcObject = null;
    
    if (socket) {
      const targetId = callState.caller || selectedUser?.id;
      if (targetId) {
        socket.emit('end_call', { callId: callState.callId, to: targetId });
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser || !user) return;

    if (file.size > 10 * 1024 * 1024) {
      setNotification({ message: "File size exceeds 10MB limit.", type: 'error' });
      return;
    }

    // If it's a voice message (from startRecording), upload immediately
    if (file.type === 'audio/webm' && file.name.startsWith('voice_message_')) {
      await uploadFile(file);
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', user!.id);
    formData.append('receiverId', selectedUser!.id);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ya_token')}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        socket?.emit('send_message', {
          senderId: user!.id,
          receiverId: selectedUser!.id,
          content: `Sent a file: ${data.name}`,
          type: 'file',
          fileId: data.fileId
        });
      } else {
        alert(data.error || "Failed to upload file");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ya_token')}` }
      });
      if (!res.ok) throw new Error("Failed to download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Error downloading file");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], `voice_message_${Date.now()}.webm`, { type: 'audio/webm' });
        
        // Use a mock event to reuse handleFileUpload logic
        const mockEvent = {
          target: {
            files: [file]
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        
        await handleFileUpload(mockEvent);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      setNotification({ message: "Could not access microphone.", type: 'error' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    if (user?.role === 'admin' && socket) {
      socket.emit('delete_message', { messageId, adminId: user.id });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stop typing indicator
    if (socket && user && selectedUser) {
      socket.emit('typing', { senderId: user.id, receiverId: selectedUser.id, isTyping: false });
    }

    if (selectedFile) {
      await uploadFile(selectedFile);
      if (newMessage.trim() && socket && user && selectedUser) {
        socket.emit('send_message', {
          senderId: user.id,
          receiverId: selectedUser.id,
          content: newMessage
        });
        setNewMessage('');
      }
      return;
    }

    if (!newMessage.trim() || !selectedUser || !socket || !user) return;

    socket.emit('send_message', {
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage
    });

    setNewMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (socket && user && selectedUser) {
      socket.emit('typing', { senderId: user.id, receiverId: selectedUser.id, isTyping: true });
      
      if (typingTimeoutRef.current[selectedUser.id]) {
        clearTimeout(typingTimeoutRef.current[selectedUser.id]);
      }
      
      typingTimeoutRef.current[selectedUser.id] = setTimeout(() => {
        socket.emit('typing', { senderId: user.id, receiverId: selectedUser.id, isTyping: false });
      }, 3000);
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedUser(conv);
    fetchMessages(conv.id);
  };

  const renderMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:opacity-80 break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
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
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                    {conv.name[0]}
                  </div>
                  {onlineUsers[conv.id] && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand border-2 border-dark rounded-full"></div>
                  )}
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
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${onlineUsers[selectedUser.id] ? 'text-brand' : 'text-gray-500'}`}>
                    {onlineUsers[selectedUser.id] ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => callUser('audio')} className="text-gray-400 p-2 hover:bg-white/5 rounded-full transition-colors">
                  <Phone size={20} />
                </button>
                <button onClick={() => callUser('video')} className="text-gray-400 p-2 hover:bg-white/5 rounded-full transition-colors">
                  <Video size={20} />
                </button>
                <button onClick={() => setShowSettings(true)} className="text-gray-400 p-2 hover:bg-white/5 rounded-full transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div ref={messagesContainerRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id || idx}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl relative ${
                      isMe ? 'bg-brand text-dark rounded-tr-none' : 'bg-white/5 text-white rounded-tl-none border border-white/10'
                    }`}>
                      {msg.is_deleted ? (
                        <p className="text-sm italic opacity-50">This message was deleted by an admin.</p>
                      ) : (
                        <>
                          {msg.type === 'file' ? (
                            <div className="flex items-center gap-3 bg-black/10 p-3 rounded-xl">
                              {msg.content.includes('.webm') ? (
                                <div className="flex flex-col gap-2">
                                  <span className="text-sm font-medium">Voice Message</span>
                                  <audio 
                                    controls 
                                    src={`/api/files/${msg.file_id}`} 
                                    className="h-10 w-full max-w-[240px] filter invert brightness-200" 
                                  />
                                </div>
                              ) : msg.content.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                <div className="flex flex-col gap-2">
                                  <img src={`/api/files/${msg.file_id}`} alt="Preview" className="max-w-[200px] max-h-[200px] rounded-lg object-cover" />
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium truncate max-w-[150px]">{msg.content.replace('Sent a file: ', '')}</span>
                                    <button onClick={() => downloadFile(msg.file_id!, msg.content.replace('Sent a file: ', ''))} className="p-2 hover:bg-black/20 rounded-full transition-colors">
                                      <Download size={16} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <FileIcon size={24} className={isMe ? 'text-dark' : 'text-brand'} />
                                  <span className="text-sm font-medium truncate max-w-[150px]">{msg.content.replace('Sent a file: ', '')}</span>
                                  <button onClick={() => downloadFile(msg.file_id!, msg.content.replace('Sent a file: ', ''))} className="ml-auto p-2 hover:bg-black/20 rounded-full transition-colors">
                                    <Download size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed">{renderMessageContent(msg.content)}</p>
                          )}
                          
                          {/* Admin Delete Button */}
                          {user.role === 'admin' && !msg.is_deleted && (
                            <button 
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded-full"
                              title="Delete Message"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      )}
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
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/5 bg-dark-lighter/50 backdrop-blur-md">
              <AnimatePresence>
                {selectedUser && typingUsers[selectedUser.id] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="max-w-4xl mx-auto mb-2 px-4"
                  >
                    <p className="text-xs text-brand italic flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                      {selectedUser.name} is typing...
                    </p>
                  </motion.div>
                )}
                {selectedFile && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mb-4 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 relative"
                  >
                    <button 
                      onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl" />
                    ) : (
                      <div className="w-16 h-16 bg-brand/20 text-brand rounded-xl flex items-center justify-center">
                        <FileIcon size={32} />
                      </div>
                    )}
                    <div className="flex-grow overflow-hidden">
                      <p className="text-white font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || isRecording}
                  className="text-gray-400 p-3 hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={uploading || !!selectedFile}
                  className={`p-3 rounded-xl transition-colors disabled:opacity-50 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <input
                  type="text"
                  value={isRecording ? `Recording... ${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}` : newMessage}
                  onChange={handleInputChange}
                  placeholder={uploading ? "Uploading..." : isRecording ? "Recording..." : selectedFile ? "Add a message (optional)..." : "Type your message..."}
                  disabled={uploading || isRecording}
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white outline-none focus:border-brand transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !selectedFile) || uploading || isRecording}
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

      {/* Call UI Overlay */}
      {(stream || callState.isReceivingCall) && !isMinimized && (
        <div className="fixed inset-0 bg-dark z-50 flex flex-col items-center justify-between p-4 sm:p-8">
          {/* Background for video call */}
          {callState.callType === 'video' && callState.callAccepted && (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video 
                playsInline 
                ref={userVideo} 
                autoPlay 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          )}

          {/* Hidden audio for remote stream in audio-only calls */}
          {callState.callType === 'audio' && callState.callAccepted && (
            <audio ref={userVideo as any} autoPlay className="hidden" />
          )}

          {/* Top Bar */}
          <div className="relative z-10 w-full max-w-4xl flex justify-between items-start">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 bg-brand/20 rounded-full flex items-center justify-center text-brand">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {callState.isReceivingCall && !callState.callAccepted 
                    ? `Incoming Call from ${callState.callerName || 'YA Wedding'}` 
                    : selectedUser?.name || callState.callerName}
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </h3>
                <p className="text-sm text-gray-300 capitalize">
                  {selectedUser?.role || 'User'} • {callState.callType} call
                </p>
                <p className="text-xs text-brand font-mono mt-1">
                  {callState.callAccepted 
                    ? `${Math.floor(callDuration / 60).toString().padStart(2, '0')}:${(callDuration % 60).toString().padStart(2, '0')}`
                    : callState.isReceivingCall ? 'Ringing...' : 'Calling...'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsMinimized(true)}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Center Content (Audio Call or Pre-Accept) */}
          {(!callState.callAccepted || callState.callType === 'audio') && (
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-40 h-40 bg-brand/20 rounded-full flex items-center justify-center border-4 border-brand/30 shadow-[0_0_50px_rgba(0,200,150,0.3)] mb-8"
              >
                <User size={64} className="text-brand" />
              </motion.div>
            </div>
          )}

          {/* Picture-in-Picture (Video Call) */}
          {callState.callType === 'video' && callState.callAccepted && stream && (
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 w-32 sm:w-48 aspect-video bg-black rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-pointer hover:scale-105 transition-transform">
              <video 
                playsInline 
                muted 
                ref={myVideo} 
                autoPlay 
                className="w-full h-full object-cover" 
                style={{ transform: isFrontCamera ? 'scaleX(-1)' : 'none' }}
              />
            </div>
          )}

          {/* Bottom Controls */}
          <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
            {/* Security Badge */}
            <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-xs text-gray-300">
              <ShieldAlert size={14} className="text-brand" />
              <span>Call may be monitored for security</span>
            </div>

            {/* Control Icons */}
            {callState.isReceivingCall && !callState.callAccepted ? (
              <div className="flex gap-6">
                <button 
                  onClick={() => answerCall(true)}
                  className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                >
                  <Video size={24} />
                </button>
                <button 
                  onClick={() => answerCall(false)}
                  className="w-16 h-16 bg-brand text-dark rounded-full flex items-center justify-center hover:bg-brand/90 transition-colors shadow-lg shadow-brand/30"
                >
                  <Phone size={24} />
                </button>
                <button 
                  onClick={endCall}
                  className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  <PhoneOff size={24} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl shadow-2xl">
                <button 
                  onClick={() => {
                    if (stream) {
                      stream.getVideoTracks().forEach(t => t.enabled = !t.enabled);
                      setIsVideoOff(!isVideoOff);
                    }
                  }}
                  className={`p-4 rounded-2xl transition-colors ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {isVideoOff ? <CameraOff size={24} /> : <Camera size={24} />}
                </button>
                <button 
                  onClick={() => {
                    if (stream) {
                      stream.getAudioTracks().forEach(t => t.enabled = !t.enabled);
                      setIsMuted(!isMuted);
                    }
                  }}
                  className={`p-4 rounded-2xl transition-colors ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                {callState.callType === 'video' && (
                  <button 
                    onClick={toggleCamera}
                    className="p-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <RefreshCcw size={24} />
                  </button>
                )}
                {/* Group calls not implemented yet
                <button className="p-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-colors">
                  <UserPlus size={24} />
                </button>
                */}
                <button 
                  onClick={endCall}
                  className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 ml-2"
                >
                  <PhoneOff size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Minimized Call UI */}
      {(stream || callState.isReceivingCall) && isMinimized && (
        <div 
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-24 right-4 bg-brand text-dark p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="animate-pulse">
            {callState.callType === 'video' ? <Video size={24} /> : <Phone size={24} />}
          </div>
          <div>
            <p className="font-bold text-sm">Active Call</p>
            <p className="text-xs opacity-80">
              {callState.callAccepted 
                ? `${Math.floor(callDuration / 60).toString().padStart(2, '0')}:${(callDuration % 60).toString().padStart(2, '0')}`
                : 'Ringing...'}
            </p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); endCall(); }}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors ml-2"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      )}

      {/* Admin Call Monitoring Panel */}
      {user?.role === 'admin' && activeCalls.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-dark-lighter border border-white/10 rounded-2xl p-4 shadow-2xl z-40 w-80">
          <div className="flex items-center gap-2 mb-4 text-brand">
            <ShieldAlert size={20} />
            <h4 className="font-bold">Active Calls ({activeCalls.length})</h4>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeCalls.map(call => (
              <div key={call.callId} className="bg-black/20 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm text-white font-medium">{call.callerName} &rarr; {call.receiverName}</p>
                  <p className="text-xs text-gray-400 capitalize">{call.type} Call</p>
                </div>
                <button 
                  onClick={() => {
                    if (socket) {
                      socket.emit('admin_terminate_call', { callId: call.callId, callerId: call.callerId, receiverId: call.receiverId });
                    }
                  }}
                  className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/40 transition-colors"
                  title="Terminate Call"
                >
                  <PhoneOff size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-lighter border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings size={24} className="text-brand" />
                  Chat Settings
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">Allow Incoming Calls</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={userPreferences.allow_calls}
                        onChange={async (e) => {
                          const newVal = e.target.checked;
                          setUserPreferences({ allow_calls: newVal });
                          try {
                            await fetch('/api/user/preferences', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, allowCalls: newVal ? 1 : 0 })
                            });
                          } catch (err) {
                            console.error("Failed to update preferences", err);
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400">When disabled, other users will not be able to call you.</p>
                </div>

                {user?.role === 'admin' && selectedUser && (
                  <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                    <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">
                      <ShieldAlert size={18} />
                      Admin Controls
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">Manage features for {selectedUser.name}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white">Block Calling Feature</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={featureBlocks.some(b => b.user_id === selectedUser.id && b.feature === 'calls')}
                          onChange={async (e) => {
                            const block = e.target.checked;
                            try {
                              await fetch('/api/admin/feature-blocks', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: selectedUser.id, feature: 'calls', block })
                              });
                              // Refresh blocks
                              const res = await fetch(`/api/admin/feature-blocks`);
                              if (res.ok) {
                                setFeatureBlocks(await res.json());
                              }
                            } catch (err) {
                              console.error("Failed to update feature blocks", err);
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              notification.type === 'error' ? 'bg-red-500/90 border-red-500/20 text-white' : 'bg-brand/90 border-brand/20 text-dark'
            }`}
          >
            {notification.type === 'error' ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
            <span className="font-bold">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inbox;
