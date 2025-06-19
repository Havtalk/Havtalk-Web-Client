'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Search, 
  MessageSquare, 
  User, 
  Trash2, 
  Loader2,
  Calendar,
  Filter
} from 'lucide-react';
import BackgroundDesign from '@/components/background-design';
import api from '@/lib/axiosInstance';

interface ChatSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  character: {
    id: string;
    name: string;
    avatar?: string;
    description?: string;
  };
  userpersona?: {
    id: string;
    name: string;
    avatar?: string;
  };
  messages: Array<{
    id: string;
    content: string;
    role: 'USER' | 'AI';
    createdAt: string;
  }>;
  _count: {
    messages: number;
};
}

export default function MyChatsPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'character'>('newest');
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  // Fetch user's chat sessions
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/chatsession', { withCredentials: true });
        const chatSessions = response.data.chats || [];
        setChats(chatSessions);
        setFilteredChats(chatSessions);
      } catch (err: unknown) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chat sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...chats];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(chat => 
        chat.character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.userpersona?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'character':
          return a.character.name.localeCompare(b.character.name);
        default:
          return 0;
      }
    });

    setFilteredChats(filtered);
  }, [chats, searchTerm, sortBy]);

  // Handle chat deletion
  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingChatId(chatId);
      await api.delete(`/chatsession/${chatId}`, { withCredentials: true });
      
      // Remove from local state
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      setFilteredChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (err: unknown) {
      console.error('Error deleting chat:', err);
      alert('Failed to delete chat session');
    } finally {
      setDeletingChatId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Get last message preview
  const getLastMessagePreview = (chat: ChatSession) => {
    if (!chat.messages || chat.messages.length === 0) {
      return 'No messages yet - Start the conversation!';
    }
    
    const lastMessage = chat.messages[0]; // API returns messages in desc order, so first is latest
    const isUserMessage = lastMessage.role === 'USER';
    const prefix = isUserMessage ? 'You: ' : `${chat.character.name}: `;
    
    // Truncate long messages
    const maxLength = 80;
    let content = lastMessage.content;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
    }
    
    return prefix + content;
  };

  // Get message count
  const getMessageCount = (chat: ChatSession) => {
    return chat._count ? chat._count.messages : 0;
  };

  if (loading) {
    return (
      <section className="w-full pb-8 md:pb-12 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950">
        <BackgroundDesign />
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">Loading your conversations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pb-8 md:pb-12 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950">
      <BackgroundDesign />
      
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16 relative z-10">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-center">
            My Conversations
          </h1>
          <p className="text-sm sm:text-base text-gray-300 text-center max-w-2xl mx-auto">
            Continue your conversations or start fresh with your favorite characters
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by character or persona name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 text-sm sm:text-base h-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'character') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-800/50 border-gray-700 text-white text-sm sm:text-base h-10">
              <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="character">By Character</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chat Sessions Grid */}
        {error ? (
          <div className="text-center py-8">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              <p className="text-red-400 text-base sm:text-lg">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-red-600 text-red-400 hover:bg-red-900/20 text-sm sm:text-base"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-700/50 max-w-md mx-auto">
              <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                {searchTerm ? 'No matches found' : 'No conversations yet'}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start chatting with characters to see your conversations here'
                }
              </p>
              {!searchTerm && (
                <Link href="/characters">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                    Explore Characters
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredChats.map((chat) => (
              <Card 
                key={chat.id} 
                className="gap-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group h-full"
              >
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 overflow-hidden">
                        {chat.character.avatar ? (
                          <img
                            src={chat.character.avatar}
                            alt={chat.character.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                        )}
                      </div>
                      {chat.userpersona && (
                        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border-2 border-gray-800 overflow-hidden">
                          {chat.userpersona.avatar ? (
                            <img
                              src={chat.userpersona.avatar}
                              alt={chat.userpersona.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                        {chat.character.name}
                      </h3>
                      {chat.userpersona && (
                        <p className="text-xs sm:text-sm text-gray-400 truncate">
                          as {chat.userpersona.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-3 sm:p-4 pt-0 flex flex-col justify-between flex-1">
                  <div className="space-y-2">
                    {/* Last Message Preview */}
                    <div className="min-h-[2.5rem]">
                      <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 overflow-hidden leading-relaxed">
                        {getLastMessagePreview(chat)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-1 min-w-0 flex-1 truncate">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{formatDate(chat.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                        {getMessageCount(chat) > 0 && (
                          <Badge variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-300 text-xs px-1.5 py-0.5">
                            {getMessageCount(chat)} msg{getMessageCount(chat) !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-auto">
                    <Link href={`/chat/${chat.id}`} className="flex-1 min-w-0">
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white group-hover:bg-purple-500 transition-colors text-xs sm:text-sm px-2 sm:px-3 py-2 h-8"
                      >
                        <span className="truncate">Continue</span>
                        <ArrowRight className="ml-1 sm:ml-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      </Button>
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 flex-shrink-0 h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteChat(chat.id);
                      }}
                      disabled={deletingChatId === chat.id}
                    >
                      {deletingChatId === chat.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {chats.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-800/30 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
              <div className="flex items-center space-x-2 text-gray-300">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {filteredChats.length} of {chats.length} conversations
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
