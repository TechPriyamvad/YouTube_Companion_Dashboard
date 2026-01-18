'use client'

import { useState, useEffect } from 'react'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  views: string
  likes: string
  commentCount: string
}

interface Comment {
  id: string
  authorName: string
  text: string
  likes: number
  publishedAt: string
}

interface Note {
  _id: string
  content: string
  tags: string
  createdAt: string
}

export default function Home() {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'video' | 'comments' | 'notes' | 'suggestions'>('video')

  // Video edit
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isEditingVideo, setIsEditingVideo] = useState(false)

  // Comments
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  // Notes
  const [notes, setNotes] = useState<Note[]>([])
  const [noteContent, setNoteContent] = useState('')
  const [noteTags, setNoteTags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // AI Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  // Fetch video on mount
  useEffect(() => {
    fetchVideo()
  }, [])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/video')
      const data = await res.json()
      if (res.ok) {
        setVideo(data)
        setEditTitle(data.title)
        setEditDescription(data.description)
      } else {
        setError(data.error || 'Failed to fetch video')
      }
    } catch (err) {
      setError('Error fetching video')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateVideo = async () => {
    try {
      const res = await fetch('/api/video', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })

      if (res.ok) {
        setVideo({
          ...video!,
          title: editTitle,
          description: editDescription,
        })
        setIsEditingVideo(false)
        logEvent('video_updated', {
          oldTitle: video?.title,
          newTitle: editTitle,
        })
      } else {
        setError('Failed to update video')
      }
    } catch (err) {
      setError('Error updating video')
    }
  }

  const fetchComments = async () => {
    try {
      setCommentLoading(true)
      const res = await fetch('/api/comments')
      const data = await res.json()
      if (res.ok) {
        setComments(data.comments)
      }
    } catch (err) {
      setError('Error fetching comments')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      })

      if (res.ok) {
        setNewComment('')
        fetchComments()
        logEvent('comment_added', { text: newComment })
      } else {
        setError('Failed to add comment')
      }
    } catch (err) {
      setError('Error adding comment')
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id))
        logEvent('comment_deleted', { commentId: id })
      }
    } catch (err) {
      setError('Error deleting comment')
    }
  }

  const fetchNotes = async (query: string = '') => {
    try {
      const url = query ? `/api/notes?q=${encodeURIComponent(query)}` : '/api/notes'
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) {
        setNotes(data.notes)
      }
    } catch (err) {
      setError('Error fetching notes')
    }
  }

  const handleAddNote = async () => {
    if (!noteContent.trim()) return

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteContent, tags: noteTags }),
      })

      if (res.ok) {
        setNoteContent('')
        setNoteTags('')
        fetchNotes()
        logEvent('note_created', { tags: noteTags })
      }
    } catch (err) {
      setError('Error adding note')
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotes(notes.filter((n) => n._id !== id))
        logEvent('note_deleted', { noteId: id })
      }
    } catch (err) {
      setError('Error deleting note')
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchNotes(query)
  }

  const generateSuggestions = async () => {
    if (!video) return

    try {
      setSuggestionsLoading(true)
      const res = await fetch('/api/ai/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: video.title, description: video.description }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuggestions(data.suggestions)
        logEvent('ai_suggestions_generated', { count: data.suggestions.length })
      } else {
        setError(data.error || 'Failed to generate suggestions')
      }
    } catch (err) {
      setError('Error generating suggestions')
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    setEditTitle(suggestion)
    logEvent('ai_suggestion_selected', { suggestion })
  }

  const logEvent = async (action: string, metadata: any) => {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata }),
      })
    } catch (err) {
      console.error('Error logging event', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-red-600">YouTube Companion Dashboard</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {(['video', 'comments', 'notes', 'suggestions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                if (tab === 'comments' && comments.length === 0) fetchComments()
                if (tab === 'notes' && notes.length === 0) fetchNotes()
              }}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Video Tab */}
        {activeTab === 'video' && video && (
          <div className="bg-white rounded shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full rounded h-auto max-h-96"
              />
              <div>
                {!isEditingVideo ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
                    <p className="text-gray-700 mb-4">{video.description}</p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-100 p-3 rounded">
                        <div className="text-sm text-gray-600">Views</div>
                        <div className="text-xl font-bold">{video.views}</div>
                      </div>
                      <div className="bg-gray-100 p-3 rounded">
                        <div className="text-sm text-gray-600">Likes</div>
                        <div className="text-xl font-bold">{video.likes}</div>
                      </div>
                      <div className="bg-gray-100 p-3 rounded">
                        <div className="text-sm text-gray-600">Comments</div>
                        <div className="text-xl font-bold">{video.commentCount}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditingVideo(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Edit Video
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2 h-32"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateVideo}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingVideo(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Add Comment</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border rounded px-3 py-2 h-24"
              />
              <button
                onClick={handleAddComment}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Post Comment
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{comment.authorName}</p>
                      <p className="text-sm text-gray-600">{new Date(comment.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-600 mt-2">👍 {comment.likes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Notes</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded">
              <label className="block text-sm font-medium mb-2">Note Content</label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your idea..."
                className="w-full border rounded px-3 py-2 h-20 mb-3"
              />
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="Tags (comma-separated)"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={handleAddNote}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note._id} className="border rounded p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-gray-700 mb-2">{note.content}</p>
                      {note.tags && (
                        <p className="text-sm text-blue-600">
                          Tags: {note.tags}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-4">AI Title Suggestions</h2>

            <button
              onClick={generateSuggestions}
              disabled={suggestionsLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {suggestionsLoading ? 'Generating...' : 'Generate Suggestions'}
            </button>

            {suggestions.length > 0 && (
              <div className="mt-6 space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="border rounded p-4 bg-blue-50 flex justify-between items-center">
                    <p className="text-gray-800">{suggestion}</p>
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
