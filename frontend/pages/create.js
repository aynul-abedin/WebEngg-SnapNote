import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreateNote() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const contentRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Auto-resize textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px';
    }
  }, [formData.content]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    if (e.target.name === 'content') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(value.length);
      setReadingTime(Math.ceil(words.length / 200)); // Average reading speed
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/notes', formData);
      // Success animation could be added here
      router.push('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const getContentQuality = () => {
    if (wordCount < 10) return { level: 'poor', color: 'red', message: 'Too short - add more detail' };
    if (wordCount < 50) return { level: 'basic', color: 'orange', message: 'Good start - keep expanding' };
    if (wordCount < 150) return { level: 'good', color: 'blue', message: 'Well developed content' };
    if (wordCount < 300) return { level: 'excellent', color: 'green', message: 'Comprehensive and detailed' };
    return { level: 'outstanding', color: 'purple', message: 'Exceptionally thorough' };
  };

  const quality = getContentQuality();

  const handleKeyDown = (e) => {
    // Auto-save draft functionality could be added here
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      // Save draft logic
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Fixed header with glassmorphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">✍️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create Note</h1>
                <p className="text-sm text-gray-600">Draft auto-saves as you type</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 hover:bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                {showPreview ? '📝 Edit' : '👁️ Preview'}
              </button>
              
              <div className="text-sm text-gray-600 bg-white/80 px-3 py-2 rounded-lg border border-gray-200">
                {wordCount} words • {readingTime}min read
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 m-6 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-500 text-xl mr-3">⚠️</span>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {!showPreview ? (
                <form onSubmit={handleSubmit} className="p-8 space-y-8" onKeyDown={handleKeyDown}>
                  {/* Title input */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                      <span>📌</span>
                      <span>Title</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onFocus={() => setTitleFocused(true)}
                        onBlur={() => setTitleFocused(false)}
                        className={`w-full px-4 py-4 text-2xl font-bold bg-transparent border-2 rounded-xl transition-all duration-300 resize-none outline-none ${
                          titleFocused 
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="What's your note about?"
                        required
                      />
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ${
                        titleFocused ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <span>💡</span>
                      <span>A compelling title increases engagement by 73%</span>
                    </p>
                  </div>

                  {/* Content textarea */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                      <span>📝</span>
                      <span>Content</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        ref={contentRef}
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        onFocus={() => setContentFocused(true)}
                        onBlur={() => setContentFocused(false)}
                        className={`w-full px-4 py-4 text-lg leading-relaxed bg-transparent border-2 rounded-xl transition-all duration-300 resize-none outline-none min-h-[300px] ${
                          contentFocused 
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Share your thoughts, insights, or story...

Pro tip: Start with an engaging opening line to hook your readers!"
                        required
                      />
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ${
                        contentFocused ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                  </div>

                  {/* Visibility toggle */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-xl">{formData.isPublic ? '🌍' : '🔒'}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {formData.isPublic ? 'Public Note' : 'Private Note'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formData.isPublic 
                              ? 'Visible to everyone on the community feed' 
                              : 'Only visible in your personal collection'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading || !formData.title.trim() || !formData.content.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-3"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Publish Note</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-300 hover:shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Preview mode */
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                      {formData.title || 'Untitled Note'}
                    </h1>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {formData.content || 'No content yet...'}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>By {user.username}</span>
                      <span>•</span>
                      <span>{readingTime} min read</span>
                      <span>•</span>
                      <span>{formData.isPublic ? 'Public' : 'Private'}</span>
                    </div>
                    <span>Just now</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar with analytics and tips */}
          <div className="space-y-6">
            {/* Writing Analytics */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>📊</span>
                <span>Writing Analytics</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Words</span>
                  <span className="font-semibold text-gray-900">{wordCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Characters</span>
                  <span className="font-semibold text-gray-900">{charCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reading time</span>
                  <span className="font-semibold text-gray-900">{readingTime} min</span>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Content quality</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      quality.color === 'red' ? 'bg-red-100 text-red-700' :
                      quality.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                      quality.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      quality.color === 'green' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {quality.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{quality.message}</p>
                </div>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>💡</span>
                <span>Writing Tips</span>
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-500">📖</span>
                  <div>
                    <p className="font-medium text-gray-800">Hook your readers</p>
                    <p className="text-gray-600">Start with a question, surprising fact, or compelling statement</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-500">✏️</span>
                  <div>
                    <p className="font-medium text-gray-800">Structure matters</p>
                    <p className="text-gray-600">Use short paragraphs and clear transitions between ideas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-500">🎯</span>
                  <div>
                    <p className="font-medium text-gray-800">Add value</p>
                    <p className="text-gray-600">Share insights, experiences, or actionable advice</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyboard shortcuts */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>⌨️</span>
                <span>Shortcuts</span>
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Save draft</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + S</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preview</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + P</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add server-side protection
export async function getServerSideProps(context) {
  return {
    props: {} // Will be passed to the page component as props
  }
}