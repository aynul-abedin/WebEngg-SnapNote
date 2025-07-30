import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes([]);
    }
  }, [searchTerm, notes]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex justify-center items-center min-h-96 relative">
          {/* Animated background elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-2">Loading amazing notes...</div>
            <div className="text-gray-500">Please wait while we gather the community's best content</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4 leading-tight">
              Welcome to SnapNote
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-6"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover and share inspiring notes from our vibrant community of thinkers, creators, and knowledge seekers
          </p>
          
          {/* Stats or decorative elements */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
              <div className="text-sm text-gray-500">Community Notes</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-500">Ideas Shared</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">🌟</div>
              <div className="text-sm text-gray-500">Inspiration</div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search notes by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white bg-opacity-95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 pr-12"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {searchTerm && (
            <div className="text-center mt-4 text-gray-600">
              Found {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} matching "{searchTerm}"
            </div>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✍️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No notes shared yet</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Be the pioneer! Share the first note and start building our knowledge community.
              </p>
              <Link 
                href="/create" 
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>🚀</span>
                <span>Create the First Note</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note, index) => (
              <div 
                key={note._id} 
                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 pr-3">
                      {note.title}
                    </h3>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex-shrink-0"></div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {note.content.length > 150 
                      ? `${note.content.substring(0, 150)}...` 
                      : note.content
                    }
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-6">
                    <div className="flex items-center space-x-2">
                      {note.author ? (
                        <>
                          <Link href={`/profile/${note.author._id}`} className="group">
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-blue-500 transition-all duration-200">
                              {note.author.avatar ? (
                                <img
                                  src={note.author.avatar}
                                  alt={note.authorName}
                                  className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                                  <span className="text-white text-sm font-semibold">
                                    {note.authorName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                          <Link 
                            href={`/profile/${note.author._id}`}
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                          >
                            {note.authorName}
                          </Link>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-semibold">
                              {note.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{note.authorName}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>

                  <Link 
                    href={`/view/${note._id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>📖</span>
                    <span>Read Full Note</span>
                  </Link>
                </div>
                
                {/* Animated bottom accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action section */}
        {notes.length > 0 && (
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Share Your Ideas?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join our community of knowledge sharers and contribute your unique perspective
            </p>
            <Link 
              href="/create" 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span>✨</span>
              <span>Create Your Note</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}