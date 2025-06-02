'use client'
import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, MessageCircle, Users, Sparkles, Search, X, Lock, Zap, Crown, Eye, Globe, Shield, Clock, MapPin, Star, Heart, MoreVertical } from 'lucide-react';

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
  if (personality.includes('analytical') || personality.includes('observant')) return '🤔 Contemplative';
  if (personality.includes('witty') || personality.includes('playful')) return '✨ Spirited';
  if (personality.includes('confident') || personality.includes('narcissistic')) return '😎 Confident';
  if (personality.includes('brilliant') || personality.includes('hardworking')) return '📚 Studious';
  if (personality.includes('eccentric') || personality.includes('cunning')) return '🏴‍☠️ Adventurous';
  if (personality.includes('passionate') || personality.includes('principled')) return '💪 Determined';
  return '😊 Friendly';
};

const getCharacterTheme = (environment, personality) => {
  if (environment?.includes('Victorian')) return 'from-amber-400 via-yellow-500 to-orange-600';
  if (environment?.includes('countryside') || personality.includes('romantic')) return 'from-rose-400 via-pink-500 to-purple-600';
  if (environment?.includes('modern') || environment?.includes('tech')) return 'from-blue-400 via-cyan-500 to-teal-600';
  if (environment?.includes('Wizarding') || environment?.includes('Hogwarts')) return 'from-purple-400 via-violet-500 to-indigo-600';
  if (environment?.includes('Caribbean') || environment?.includes('seas')) return 'from-emerald-400 via-teal-500 to-cyan-600';
  return 'from-slate-400 via-gray-500 to-zinc-600';
};

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

const getCharacterTraits = (personality, additionalInfo) => {
  const traits = [];
  const combined = `${personality} ${additionalInfo}`.toLowerCase();
  
  if (combined.includes('observant') || combined.includes('detective')) traits.push('🔍 Observant');
  if (combined.includes('logical') || combined.includes('analytical')) traits.push('🧠 Logical');
  if (combined.includes('witty') || combined.includes('clever')) traits.push('💭 Witty');
  if (combined.includes('independent') || combined.includes('self')) traits.push('🌟 Independent');
  if (combined.includes('innovative') || combined.includes('inventor')) traits.push('⚡ Innovative');
  if (combined.includes('heroic') || combined.includes('superhero')) traits.push('🛡️ Heroic');
  if (combined.includes('studious') || combined.includes('student')) traits.push('📚 Studious');
  if (combined.includes('magical') || combined.includes('witch')) traits.push('⚡ Magical');
  if (combined.includes('brave') || combined.includes('loyal')) traits.push('🦁 Brave');
  if (combined.includes('adventurous') || combined.includes('pirate')) traits.push('🏴‍☠️ Adventurous');
  if (combined.includes('cunning') || combined.includes('clever')) traits.push('🗺️ Cunning');
  if (combined.includes('resilient') || combined.includes('strong')) traits.push('💪 Resilient');
  if (combined.includes('passionate') || combined.includes('romantic')) traits.push('🎭 Passionate');
  
  return traits.slice(0, 3); // Return max 3 traits
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
                // Creative New Card Design
                <div
                  key={character.id}
                  className="group relative h-[450px]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Main Card */}
                  <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-[1.03] border border-gray-100 dark:border-gray-700 overflow-hidden">
                    
                    {/* Decorative Top Wave */}
                    <div className={`h-24 bg-gradient-to-r ${bgGradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      {/* Floating Orbs */}
                      <div className="absolute top-2 left-4 w-6 h-6 bg-white/20 rounded-full animate-bounce"></div>
                      <div className="absolute top-6 right-6 w-4 h-4 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-2 left-12 w-3 h-3 bg-white/25 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      
                      {/* Privacy Badge & Menu Button */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border-2 ${
                          character.isPublic 
                            ? 'bg-emerald-400/20 text-white border-white/30 shadow-lg' 
                            : 'bg-amber-400/20 text-white border-white/30 shadow-lg'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            {character.isPublic ? <Globe size={12} /> : <Shield size={12} />}
                            <span>{character.isPublic ? 'PUBLIC' : 'PRIVATE'}</span>
                          </div>
                        </div>
                        
                        {/* Menu Button - Only show for private characters */}
                        {!character.isPublic && (
                          <div className="relative">
                            <button
                              onClick={() => toggleMenu(character.id)}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white transition-all duration-200"
                            >
                              <MoreVertical size={14} />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                                <button
                                  onClick={() => {
                                    alert(`Edit character ${character.id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <Edit size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(character.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Wave Bottom */}
                      <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-6 fill-white dark:fill-gray-800">
                          <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Avatar Section - Overlapping */}
                    <div className="relative -mt-12 mb-6 flex justify-center">
                      <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                          {character.avatar ? (
                            <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {character.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        {/* Pulse Ring */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-30"></div>
                        {/* Status Dot */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Adjusted for proper spacing */}
                    <div className="px-6 pb-20">
                      {/* Name & Mood */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {character.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                          <span className="text-lg">{mood.split(' ')[0]}</span>
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{mood.split(' ')[1]}</span>
                        </div>
                      </div>

                      {/* Description with Gradient Text */}
                      <div className="relative mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed line-clamp-2 italic">
                          "{character.description}"
                        </p>
                        <div className="absolute -top-1 -left-1 text-purple-300 dark:text-purple-600 text-4xl font-serif">"</div>
                      </div>

                      {/* Traits with Icons */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {traits.slice(0, 3).map((trait, i) => (
                          <div key={i} className="group/trait relative">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-medium border border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-200">
                              <span className="text-base">{trait.split(' ')[0]}</span>
                              <span>{trait.split(' ')[1]}</span>
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Status Info with Beautiful Icons */}
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <Clock size={14} className="text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last Active</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{lastActive}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <Star size={12} className="text-gray-300 dark:text-gray-600" />
                          <Star size={12} className="text-gray-300 dark:text-gray-600" />
                        </div>
                      </div>
                    </div>

                    {/* Chat Button - Only action visible */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <button className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white py-3.5 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group/btn relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <MessageCircle size={18} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span>Start Conversation</span>
                          <Heart size={16} className="text-pink-200 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>

                    {/* Magical Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-xl -z-10 animate-pulse"></div>
                  </div>
                </div>
              ) : (
                // Enhanced Compact Card
                <div key={character.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:scale-[1.01] relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <div className={`w-full h-full bg-gradient-to-br ${bgGradient} rounded-full blur-xl`}></div>
                  </div>
                  
                  <div className="relative flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:rotate-3 transition-transform duration-300">
                        {character.avatar ? (
                          <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                            {character.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {character.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          character.isPublic ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {character.isPublic ? 'PUBLIC' : 'PRIVATE'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1 italic">"{character.description}"</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-emerald-500" />
                          {lastActive}
                        </span>
                        <span className="flex items-center gap-1">
                          {mood}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 hover:rotate-3">
                        <MessageCircle size={16} />
                      </button>
                      
                      {/* Menu Button - Only show for private characters */}
                      {!character.isPublic && (
                        <div className="relative">
                          <button
                            onClick={() => toggleMenu(character.id)}
                            className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                              <button
                                onClick={() => {
                                  alert(`Edit character ${character.id}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(character.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Section - Keeping Original Design */}
        <div className="mt-20 relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/stars-bg.png')] opacity-20 mix-blend-overlay"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 px-8 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Breathe Life Into Your Imagination
              </h2>
              <p className="text-purple-100 text-lg mb-8 leading-relaxed">
                Every character you create becomes a unique companion with their own personality, knowledge, and conversational style. What will you create next?
              </p>
              <button className="relative group overflow-hidden rounded-2xl bg-white text-purple-700 hover:text-purple-800 px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-600" />
                  Create New Character
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
            
            <div className="hidden md:block w-64 h-64 relative">
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-white/20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-4 rounded-full bg-white/20 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-9xl opacity-80">✨</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Attribution Footer */}
        <div className="mt-16 mb-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Bring your characters to life with HAVTalk</p>
          <p className="mt-1">Powered by advanced AI conversation technology</p>
        </div>
      </div>
    </div>
  );
}