'use client'
import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, MessageCircle, Users, Sparkles, Search, X, Lock, Zap, Crown, Eye, Globe, Shield, Clock, MapPin, Star, Heart, MoreVertical, Play, Flame, Zap as Lightning, Camera } from 'lucide-react';

// Dummy Character Data matching database schema
const dummyCharacters = [
  {
    id: "1",
    name: "Sherlock Holmes",
    description: "Brilliant detective with exceptional analytical abilities and keen observation skills.",
    personality: "Analytical, observant, occasionally arrogant, and socially awkward.",
    environment: "Victorian London, primarily at 221B Baker Street.",
    avatar: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80",
    additionalInfo: "Expert in deduction, chemistry, and violin playing. Lives at 221B Baker Street with Dr. Watson.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:22:00Z"
  },
  {
    id: "2",
    name: "Elizabeth Bennet",
    description: "Intelligent, lively, and witty young woman with a strong sense of individuality.",
    personality: "Witty, playful, prejudiced at times, and values personal happiness over societal expectations.",
    environment: "19th century English countryside, Longbourn estate.",
    avatar: null,
    additionalInfo: "Second eldest of five daughters, known for her quick wit and independent spirit.",
    isPublic: false,
    ownerId: "user1",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:45:00Z"
  },
  {
    id: "3",
    name: "Tony Stark",
    description: "Genius inventor, billionaire, and superhero with a complex personality.",
    personality: "Brilliant, narcissistic, sarcastic, determined, and eventually selfless.",
    environment: "Modern day, high-tech facilities and Stark Tower.",
    avatar: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2031&q=80",
    additionalInfo: "CEO of Stark Industries, creator of the Iron Man suit, member of the Avengers.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-12T11:20:00Z",
    updatedAt: "2024-01-22T13:10:00Z"
  },
  {
    id: "4",
    name: "Hermione Granger",
    description: "Extremely intelligent, hardworking witch with a strong moral compass.",
    personality: "Brilliant, loyal, brave, sometimes overbearing, with strong ethical principles.",
    environment: "Wizarding world, primarily Hogwarts School of Witchcraft and Wizardry.",
    avatar: null,
    additionalInfo: "Muggle-born witch, top student at Hogwarts, best friend to Harry Potter and Ron Weasley.",
    isPublic: false,
    ownerId: "user1",
    createdAt: "2024-01-08T14:00:00Z",
    updatedAt: "2024-01-19T10:30:00Z"
  },
  {
    id: "5",
    name: "Captain Jack Sparrow",
    description: "Eccentric and cunning pirate captain with unpredictable behavior.",
    personality: "Eccentric, cunning, self-serving yet loyal, with a peculiar sense of honor.",
    environment: "18th century Caribbean seas, aboard the Black Pearl.",
    avatar: "https://images.unsplash.com/photo-1535063406830-27dfba933db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    additionalInfo: "Captain of the Black Pearl, seeks freedom above all else, master of improvisation.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-21T12:15:00Z"
  },
  {
    id: "6",
    name: "Jane Eyre",
    description: "Independent and passionate young woman with a strong sense of morality.",
    personality: "Independent, passionate, principled, resilient, and introspective.",
    environment: "Victorian England, primarily Thornfield Hall.",
    avatar: null,
    additionalInfo: "Orphaned governess with a strong moral compass, values equality and self-respect.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-09T08:30:00Z",
    updatedAt: "2024-01-17T15:20:00Z"
  },
];

// Helper functions for derived data
const getCharacterMood = (personality) => {
  if (personality.includes('analytical') || personality.includes('observant')) return { emoji: '🕵️', mood: 'Detective', color: 'amber' };
  if (personality.includes('witty') || personality.includes('playful')) return { emoji: '✨', mood: 'Charming', color: 'pink' };
  if (personality.includes('confident') || personality.includes('narcissistic')) return { emoji: '🔥', mood: 'Confident', color: 'red' };
  if (personality.includes('brilliant') || personality.includes('hardworking')) return { emoji: '📚', mood: 'Scholar', color: 'purple' };
  if (personality.includes('eccentric') || personality.includes('cunning')) return { emoji: '🏴‍☠️', mood: 'Rogue', color: 'emerald' };
  if (personality.includes('passionate') || personality.includes('principled')) return { emoji: '💪', mood: 'Noble', color: 'blue' };
  return { emoji: '😊', mood: 'Friendly', color: 'gray' };
};

const getCharacterTheme = (environment, personality) => {
  if (environment?.includes('Victorian')) return 'from-amber-600 via-orange-500 to-yellow-600';
  if (environment?.includes('countryside') || personality.includes('romantic')) return 'from-rose-500 via-pink-500 to-purple-500';
  if (environment?.includes('modern') || environment?.includes('tech')) return 'from-cyan-500 via-blue-500 to-indigo-600';
  if (environment?.includes('Wizarding') || environment?.includes('Hogwarts')) return 'from-purple-600 via-indigo-600 to-blue-700';
  if (environment?.includes('Caribbean') || environment?.includes('seas')) return 'from-teal-500 via-emerald-500 to-green-600';
  return 'from-slate-500 via-gray-600 to-zinc-700';
};

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1d ago';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const getCharacterTraits = (personality, additionalInfo) => {
  const traits = [];
  const combined = `${personality} ${additionalInfo}`.toLowerCase();
  
  if (combined.includes('observant') || combined.includes('detective')) traits.push({ icon: '🔍', text: 'Observant' });
  if (combined.includes('logical') || combined.includes('analytical')) traits.push({ icon: '🧠', text: 'Logical' });
  if (combined.includes('witty') || combined.includes('clever')) traits.push({ icon: '💭', text: 'Witty' });
  if (combined.includes('independent') || combined.includes('self')) traits.push({ icon: '🌟', text: 'Independent' });
  if (combined.includes('innovative') || combined.includes('inventor')) traits.push({ icon: '⚡', text: 'Innovative' });
  if (combined.includes('heroic') || combined.includes('superhero')) traits.push({ icon: '🛡️', text: 'Heroic' });
  if (combined.includes('studious') || combined.includes('student')) traits.push({ icon: '📚', text: 'Studious' });
  if (combined.includes('magical') || combined.includes('witch')) traits.push({ icon: '✨', text: 'Magical' });
  if (combined.includes('brave') || combined.includes('loyal')) traits.push({ icon: '🦁', text: 'Brave' });
  if (combined.includes('adventurous') || combined.includes('pirate')) traits.push({ icon: '🏴‍☠️', text: 'Adventurous' });
  if (combined.includes('cunning') || combined.includes('clever')) traits.push({ icon: '🗺️', text: 'Cunning' });
  if (combined.includes('resilient') || combined.includes('strong')) traits.push({ icon: '💪', text: 'Resilient' });
  if (combined.includes('passionate') || combined.includes('romantic')) traits.push({ icon: '🎭', text: 'Passionate' });
  
  return traits.slice(0, 3);
};

export default function MyCharactersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedTab, setSelectedTab] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);

  // Filter characters based on search term and tab
  const filteredCharacters = dummyCharacters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.personality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.additionalInfo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'public' && character.isPublic) ||
      (selectedTab === 'private' && !character.isPublic);
    
    return matchesSearch && matchesTab;
  });

  const handleDelete = (id) => {
    alert(`Character with ID ${id} would be deleted`);
    setOpenMenuId(null);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden pt-12 pb-20">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Crown className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Character Kingdom</span>
          </div>
          <h1 className="text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Your Character
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Universe
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Where imagination meets conversation. Create, customize, and chat with characters that come alive through AI magic.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        {/* Enhanced Control Panel */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    My Characters
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">Manage your AI companions</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full">
                <span className="text-lg font-bold text-purple-700 dark:text-purple-300">{dummyCharacters.length}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your universe..."
                  className="pl-12 pr-12 py-3 w-full sm:w-80 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all placeholder-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              {/* View Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <button
                  onClick={() => setSelectedView('grid')}
                  className={`p-3 rounded-lg transition-all ${
                    selectedView === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-md text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="2"/>
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedView('compact')}
                  className={`p-3 rounded-lg transition-all ${
                    selectedView === 'compact'
                      ? 'bg-white dark:bg-gray-600 shadow-md text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="18" x2="3" y2="18"/>
                  </svg>
                </button>
              </div>
              
              {/* Create Button */}
              <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="flex items-center gap-2 relative z-10">
                  <PlusCircle size={20} />
                  <span className="font-medium">Create</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20">
            {[
              { id: 'all', label: 'All Characters', icon: Users },
              { id: 'public', label: 'Public', icon: Eye },
              { id: 'private', label: 'Private', icon: Lock }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTab === id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white/30 dark:hover:bg-gray-700/30'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Character Grid */}
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex justify-center items-center w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
              {searchTerm ? <Search size={32} className="text-purple-600 dark:text-purple-400" /> : <Users size={32} className="text-purple-600 dark:text-purple-400" />}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {searchTerm ? 'No matching characters' : 'Your character universe awaits'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm ? 'Try a different search term or browse all characters' : 'Create your first character and bring your imagination to life!'}
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              {searchTerm ? 'Clear Search' : 'Create Your First Character'}
            </button>
          </div>
        ) : (
          <div className={selectedView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
            {filteredCharacters.map((character, index) => {
              // Derive additional properties from schema fields
              const mood = getCharacterMood(character.personality);
              const bgGradient = getCharacterTheme(character.environment, character.personality);
              const traits = getCharacterTraits(character.personality, character.additionalInfo);
              const lastActive = getTimeAgo(character.updatedAt);
              const isMenuOpen = openMenuId === character.id;
              
              return selectedView === 'grid' ? (
                // Revolutionary New Card Design - Full Image with Overlay
                <div
                  key={character.id}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-[1.02] hover:-translate-y-2 border border-gray-100 dark:border-gray-800 h-96">
                    
                    {/* Full Card Background Image */}
                    <div className="absolute inset-0">
                      {character.avatar ? (
                        <img 
                          src={character.avatar} 
                          alt={character.name} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white text-6xl font-bold relative overflow-hidden`}>
                          {/* Pattern Background */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 -translate-y-16"></div>
                            <div className="absolute top-20 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-12 -translate-y-12"></div>
                            <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/10 rounded-full transform -translate-x-20 translate-y-20"></div>
                          </div>
                          <div className="relative z-10 text-8xl">
                            {character.name.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Dark Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:from-black/90 group-hover:via-black/40 group-hover:to-black/50 transition-all duration-500"></div>
                    
                    {/* Top Row - Status and Menu */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                      {/* Online Status */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/30">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                        <span className="text-white text-sm font-medium">Online</span>
                      </div>
                      
                      {/* Menu Button */}
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(character.id)}
                          className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/30 text-white transition-all duration-200 transform hover:scale-110"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 backdrop-blur-sm">
                            <button
                              onClick={() => {
                                alert(`Edit character ${character.id}`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(character.id)}
                              className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Center Content - Character Info */}
                    <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 z-20">
                      {/* Character Name */}
                      <div className="text-center mb-4">
                        <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-2xl">
                          {character.name}
                        </h3>
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <span className="text-3xl drop-shadow-lg">{mood.emoji}</span>
                          <span className="text-white/90 font-medium text-lg drop-shadow-lg">{mood.mood}</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed drop-shadow-lg max-w-sm mx-auto">
                          {character.description}
                        </p>
                      </div>
                      
                      {/* Traits */}
                      <div className="flex justify-center gap-2 mb-6">
                        {traits.slice(0, 3).map((trait, i) => (
                          <div key={i} className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              <span className="text-base">{trait.icon}</span>
                              {trait.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Bottom Section - Hover Actions & Stats */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      {/* Action Buttons - Show on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 mb-4">
                        <div className="grid grid-cols-2 gap-3">
                          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm">
                            <MessageCircle size={18} />
                            <span>Chat</span>
                          </button>
                          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border border-white/30">
                            <Edit size={18} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Stats Row - Always Visible */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                            character.isPublic 
                              ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/50' 
                              : 'bg-amber-500/30 text-amber-200 border-amber-400/50'
                          } backdrop-blur-sm`}>
                            {character.isPublic ? 'PUBLIC' : 'PRIVATE'}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart size={14} className="text-red-400" />
                              <span className="text-xs text-white/80">247</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle size={14} className="text-blue-400" />
                              <span className="text-xs text-white/80">89</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-white/60" />
                          <span className="text-xs text-white/80">{lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Compact List View
                <div
                  key={character.id}
                  className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 p-6"
                >
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                        {character.avatar ? (
                          <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white text-xl font-bold`}>
                            {character.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                          {character.name}
                        </h3>
                        <span className="text-xl">{mood.emoji}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          character.isPublic 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                        }`}>
                          {character.isPublic ? 'PUBLIC' : 'PRIVATE'}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-1">
                        {character.description}
                      </p>
                      <div className="flex items-center gap-4">
                        {traits.slice(0, 3).map((trait, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-sm">{trait.icon}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{trait.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="hidden lg:flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Heart size={14} className="text-red-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">247</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Likes</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <MessageCircle size={14} className="text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">89</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Chats</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{lastActive}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Updated</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                        <MessageCircle size={16} />
                        <span className="hidden sm:inline">Chat</span>
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(character.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {isMenuOpen && (
                          <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                            <button
                              onClick={() => {
                                alert(`Edit character ${character.id}`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(character.id)}
                              className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Powered by AI Magic
            </span>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}