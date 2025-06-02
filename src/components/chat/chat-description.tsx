'use client';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Sparkles, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';


type Character = {
    id: string;
    name: string;
    personality: string;
    description: string;
    environment: string;
    avatar: string|null;
    additionalInfo: string;
    tags: string[];
    backstory: string;
    role: string;
    goals: string;
    quirks: string;
    tone: string;
    speechStyle: string;
    exampleDialogues: {
        user: string;
        character: string;
    }[];
    ownerId: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

function ChatDescription({character,accentColor,dominantColor,showCharacterDetails,setShowCharacterDetails}:{
    character: Character;
    accentColor: string;
    dominantColor: string;
    showCharacterDetails: boolean;
    setShowCharacterDetails: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [expandedDescription, setExpandedDescription] = useState(false);
  return (
    <div className={`fixed md:relative z-30 ${showCharacterDetails ? 'w-full left-0' : 'w-0 -left-full'} md:w-full md:max-w-[320px] lg:max-w-[360px] xl:max-w-[400px] h-full border-r backdrop-blur-sm transition-all duration-300 overflow-hidden md:translate-x-0 md:left-0`}
        style={{
          borderColor: accentColor,
          background: `linear-gradient(to bottom, 
            rgba(15, 23, 42, 0.8) 0%, 
            ${dominantColor} 50%, 
            rgba(0, 0, 0, 0.8) 100%)`,
        }}
      >
        <div className="flex flex-col h-full p-3 sm:p-4 md:p-5 lg:p-6 overflow-y-auto">
          {/* Mobile Close Button */}
          <div className="flex justify-end md:hidden mb-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCharacterDetails(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Character Avatar & Basic Info */}
          <div className="flex flex-col items-center text-center mb-3 md:mb-4 flex-shrink-0">
            <div className="relative mb-2 md:mb-3">
              <img 
                src={character.avatar || "https://via.placeholder.com/150"} 
                alt={character.name}
                className="w-56 h-60 sm:w-60 sm:h-68 md:w-56 md:h-60 lg:w-60 lg:h-68 xl:w-64 xl:h-72 rounded-2xl shadow-2xl transition-all duration-300 object-cover"
                style={{ borderColor: accentColor }}
              />
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg px-2">
              {character.name}
            </h1>
            <div className="relative mb-2 md:mb-3">
              <p className={`text-xs sm:text-sm md:text-sm lg:text-base text-gray-300 max-w-[90%] mx-auto ${expandedDescription ? '' : 'line-clamp-3'}`}>
                {character.description}
              </p>
              {character.description && character.description.length > 100 && (
                <button 
                  onClick={() => setExpandedDescription(!expandedDescription)}
                  className="text-[0.65rem] sm:text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors duration-200 font-medium"
                >
                  {expandedDescription ? 'See less' : 'See more'}
                </button>
              )}
            </div>
            
            {/* Character Tags */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center mb-3 max-w-[95%]">
              {character.tags?.slice(0, 5).map((tag, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-[0.65rem] sm:text-xs px-2.5 py-1 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: `${dominantColor.replace('0.15', '0.1')}`,
                    borderColor: `${accentColor.replace('0.4', '0.3')}`,
                    color: 'white'
                  }}
                >
                  <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 mr-1.5" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          
            <div className="space-y-3 sm:space-y-3 md:space-y-4 pb-4">
              {/* Role Card - Modern Quote Style */}
              {character.role && (
                <Card
                  className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                    borderColor: `${dominantColor.replace('0.15', '0.3')}`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={accentColor}
                          className="w-full h-full"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                            style={{ 
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 animate-pulse" 
                              style={{ backgroundColor: accentColor.replace('0.4', '0.9') }}></span>
                            Role
                          </h3>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic p-2 sm:p-3 rounded-lg backdrop-blur-sm line-clamp-4"
                          style={{ 
                            borderLeft: `2px solid ${accentColor.replace('0.4', '0.6')}`,
                            background: 'rgba(255,255,255,0.03)' 
                          }}>
                          "{character.role}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Personality Card - Modern Quote Style */}
              <Card
                className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                style={{
                  backgroundColor: `rgba(0, 0, 0, 0.3)`,
                  borderColor: `${dominantColor.replace('0.15', '0.3')}`
                }}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={accentColor}
                        className="w-full h-full"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}>
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 animate-pulse" 
                            style={{ backgroundColor: accentColor.replace('0.4', '0.9') }}></span>
                          Essence
                        </h3>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic p-2 sm:p-3 rounded-lg backdrop-blur-sm"
                        style={{ 
                          borderLeft: `2px solid ${accentColor.replace('0.4', '0.6')}`,
                          background: 'rgba(255,255,255,0.03)' 
                        }}>
                        "{character.personality}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goals Card - Modern Quote Style */}
              {character.goals && (
                <Card
                  className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                    borderColor: `${dominantColor.replace('0.15', '0.3')}`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#f97316"
                          className="w-full h-full"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                            style={{ 
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                            <span className="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" 
                              style={{ backgroundColor: "#f97316" }}></span>
                            Mission
                          </h3>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic p-2 sm:p-3 rounded-lg backdrop-blur-sm"
                          style={{ 
                            borderLeft: `2px solid rgba(249, 115, 22, 0.6)`,
                            background: 'rgba(255,255,255,0.03)' 
                          }}>
                          "{character.goals}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}

              {/* Quirks Card - Modern Quote Style */}
              {character.quirks && (
                <Card
                  className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                    borderColor: `${dominantColor.replace('0.15', '0.3')}`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#ec4899"
                          className="w-full h-full"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                            clipRule="evenodd"
                          />
                        </svg>
                    </div>
                    <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" 
                            style={{ backgroundColor: "#ec4899" }}></span>
                          Oddities
                        </h3>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic p-2 sm:p-3 rounded-lg backdrop-blur-sm"
                        style={{ 
                          borderLeft: `2px solid rgba(236, 72, 153, 0.6)`,
                          background: 'rgba(255,255,255,0.03)' 
                        }}>
                        "{character.quirks}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}

              {/* Speech Style Card - Modern Quote Style */}
              {(character.tone || character.speechStyle) && (
                <Card
                  className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                    borderColor: `${dominantColor.replace('0.15', '0.3')}`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#06b6d4"
                          className="w-full h-full"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                            clipRule="evenodd"
                          />
                        </svg>
                    </div>
                    <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" 
                            style={{ backgroundColor: "#06b6d4" }}></span>
                          Verbal Style
                        </h3>
                      </div>
                      
                      <div className="rounded-lg backdrop-blur-sm p-2 sm:p-3"
                        style={{ 
                          borderLeft: `2px solid rgba(6, 182, 212, 0.6)`,
                          background: 'rgba(255,255,255,0.03)' 
                        }}>
                        <div className="flex flex-wrap gap-2">
                          {character.tone && (
                            <div
                              className="flex items-center px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all duration-200 hover:shadow-glow-sm"
                              style={{
                                backgroundColor: `rgba(6, 182, 212, 0.15)`,
                                borderColor: `rgba(6, 182, 212, 0.4)`,
                                boxShadow: '0 0 8px rgba(6, 182, 212, 0.2)'
                              }}
                            >
                              <span className="text-cyan-400 text-xs font-semibold mr-1.5">Tone:</span>
                              <span className="text-gray-300 text-xs italic">"{character.tone}"</span>
                            </div>
                          )}
                          {character.speechStyle && (
                            <div
                              className="flex items-center px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all duration-200 hover:shadow-glow-sm"
                              style={{
                                backgroundColor: `rgba(6, 182, 212, 0.15)`,
                                borderColor: `rgba(6, 182, 212, 0.4)`,
                                boxShadow: '0 0 8px rgba(6, 182, 212, 0.2)'
                              }}
                            >
                              <span className="text-cyan-400 text-xs font-semibold mr-1.5">Style:</span>
                              <span className="text-gray-300 text-xs italic">"{character.speechStyle}"</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Environment Card - Modern Quote Style */}
              {character.environment && (
                <Card
                  className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                    borderColor: `rgba(34, 197, 94, 0.4)`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#34c55e"
                          className="w-full h-full"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                            clipRule="evenodd"
                          />
                        </svg>
                    </div>
                    <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" 
                            style={{ backgroundColor: "#34c55e" }}></span>
                          Setting
                        </h3>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic p-2 sm:p-3 rounded-lg backdrop-blur-sm"
                        style={{ 
                          borderLeft: `2px solid rgba(52, 197, 94, 0.6)`,
                          background: 'rgba(255,255,255,0.03)' 
                        }}>
                        "{character.environment}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}

              {/* Backstory Card - Modern Quote Style */}
              {character.backstory && (
                <Card
                  className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                    borderColor: `${dominantColor.replace('0.15', '0.3')}`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#a855f7"
                          className="w-full h-full"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                            clipRule="evenodd"
                          />
                        </svg>
                    </div>
                    <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" 
                            style={{ backgroundColor: "#a855f7" }}></span>
                          Genesis
                        </h3>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic p-2 sm:p-3 rounded-lg backdrop-blur-sm"
                        style={{ 
                          borderLeft: `2px solid rgba(168, 85, 247, 0.6)`,
                          background: 'rgba(255,255,255,0.03)' 
                        }}>
                        "{character.backstory}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}

              {/* Additional Info Card - Modern Quote Style */}
              {character.additionalInfo && (
                <Card
                  className="backdrop-blur-sm border transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                    borderColor: `${dominantColor.replace('0.15', '0.3')}`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#6366f1"
                          className="w-full h-full"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.207 11.207 0 01-7.877 3.08A.75.75 0 003.33 6.367l.015.043a9.75 9.75 0 001.387 7.535.75.75 0 001.248.595l.008-.003a11.207 11.207 0 013.08 7.877.75.75 0 001.032 0l.014-.04A9.75 9.75 0 0015.704 13.432a.75.75 0 00-1.248-.595l-.008.003a11.207 11.207 0 01-3.08-7.877.75.75 0 000-1.032l-.014.04zm-2.19 17.528a7.5 7.5 0 014.69-4.69.75.75 0 00-1.061-1.06 6 6 0 00-3.788 3.789.75.75 0 001.06 1.061z"
                            clipRule="evenodd"
                          />
                        </svg>
                    </div>
                    <div className="relative z-10 px-2 sm:px-3 md:px-4 py-2">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg px-2 py-0.5 sm:py-1 rounded-lg inline-flex items-center relative"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" 
                            style={{ backgroundColor: "#6366f1" }}></span>
                          Details
                        </h3>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic p-2 sm:p-3 rounded-lg backdrop-blur-sm "
                        style={{ 
                          borderLeft: `2px solid rgba(99, 102, 241, 0.6)`,
                          background: 'rgba(255,255,255,0.03)' 
                        }}>
                        "{character.additionalInfo}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
            </div>
          </div>
        </div>
      
  )
}

export default ChatDescription;