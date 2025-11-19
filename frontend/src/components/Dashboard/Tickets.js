// Archivo: pages/Support.js
import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import { Link, useParams } from 'react-router-dom';

const Tickets = () => {
  const { id } = useParams();
  const [conversations, setConversations] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const fetchConversations = async () => {
    setError('');
    try {
      const res = await api.get('/support/my-conversations', authHeader);
      setConversations(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error loading conversations');
    }
  };

  const fetchConversationWithComments = async () => {
    if (!id) return;
    setError('');
    try {
      const res = await api.get(`/support/conversation/${id}/comments`, authHeader);
      setConversation(res.data.conversation || null);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error loading conversation');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Please provide both title and message.');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/support/conversation', { title, content }, authHeader);
      setTitle('');
      setContent('');
      setMessage('Conversation created.');
      await fetchConversations();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error creating conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!comment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    setIsLoading(true);
    try {
      await api.post(`/support/conversation/${id}/comment`, { comment }, authHeader);
      setComment('');
      setMessage('Comment posted.');
      await fetchConversationWithComments();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchConversationWithComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: create + list */}
          <div className="lg:col-span-1 bg-white/6 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
            <p className="text-sm text-white/70 mb-4">Create a conversation or pick one to view details.</p>

            {message && <div className="mb-3 px-3 py-2 bg-green-600/10 border border-green-600/30 text-green-200 rounded">{message}</div>}
            {error && <div className="mb-3 px-3 py-2 bg-red-600/10 border border-red-600/30 text-red-200 rounded">{error}</div>}

            {!id && (
              <>
                <form onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <label className="text-xs text-white/80 block mb-1">Title</label>
                    <input
                      aria-label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Subject, e.g. Billing issue"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/80 block mb-1">Message</label>
                    <textarea
                      aria-label="Message"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={4}
                      placeholder="Describe your issue"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow hover:scale-[1.01] transition disabled:opacity-60"
                  >
                    {isLoading ? 'Sending...' : 'Create Conversation'}
                  </button>
                </form>

                <h4 className="mt-6 text-sm text-white/70 mb-3">My Conversations</h4>
                <div className="space-y-3 max-h-[40vh] overflow-auto pr-2">
                  {conversations.length === 0 && <div className="text-sm text-white/60">No conversations yet.</div>}
                  {conversations.map((c) => (
                    <div key={c.id} className="bg-white/4 border border-white/8 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">{c.title}</div>
                          <div className="text-xs text-white/70 mt-1 line-clamp-2">{c.content}</div>
                        </div>
                        <div className="ml-3 flex flex-col items-end space-y-2">
                          <Link to={`/tickets/${c.id}`} className="text-xs px-2 py-1 bg-white/6 text-white rounded-md hover:bg-white/8">View</Link>
                          <div className="text-xs text-white/60">{new Date(c.createdAt || c.created_at || Date.now()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: conversation detail */}
          <div className="lg:col-span-2 bg-white/6 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg min-h-[60vh]">
            {!id && (
              <div className="flex flex-col items-center justify-center h-full text-center text-white/70">
                <svg className="w-16 h-16 mb-4 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                <p className="text-sm">Or create a new conversation on the left to get support.</p>
                <div className="mt-6 w-full max-w-sm">
                  <Link to="/tickets" className="w-full inline-flex justify-center py-2 bg-white/5 rounded-lg text-white">Refresh list</Link>
                </div>
              </div>
            )}

            {id && conversation && (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{conversation.title}</h3>
                    <p className="text-sm text-white/70 mt-1">{conversation.content}</p>
                    <div className="text-xs text-white/50 mt-2">Started: {new Date(conversation.createdAt || conversation.created_at || Date.now()).toLocaleString()}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to="/tickets" className="px-3 py-2 bg-white/6 rounded-lg text-white hover:bg-white/8">Back</Link>
                    <button
                      onClick={fetchConversationWithComments}
                      className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-3 max-h-[45vh] overflow-auto pr-2">
                  {comments.length === 0 && <div className="text-sm text-white/60">No messages yet.</div>}
                  {comments.map((c) => (
                    <div key={c.id} className={`p-3 rounded-lg ${c.from_admin ? 'bg-indigo-600/20 self-end' : 'bg-white/4'}`}>
                      <div className="text-sm text-white/90">{c.comment}</div>
                      <div className="text-xs text-white/60 mt-2">{new Date(c.createdAt || c.created_at || Date.now()).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleComment} className="mt-6">
                  <label className="text-xs text-white/80 block mb-2">Add a comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Write your message..."
                    required
                  />
                  <div className="mt-3 flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
                    >
                      {isLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                    <Link to="/tickets" className="px-4 py-2 bg-white/6 rounded-lg text-white">Close</Link>
                  </div>
                </form>
              </>
            )}

            {id && !conversation && !error && (
              <div className="flex items-center justify-center h-full text-white/60">Loading conversation...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
