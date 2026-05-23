import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  MessageCircle, 
  Heart, 
  PlusCircle, 
  Filter, 
  Search,
  BookOpen,
  Send,
  User,
  X,
  Megaphone,
  HelpCircle,
  Lightbulb,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { AgentShell } from '../components/AgentShell';
import { cn } from '../lib/utils';

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal for new discussion
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  
  // Comment reply state
  const [newReply, setNewReply] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}');

  // Load discussions
  useEffect(() => {
    const cached = localStorage.getItem('discussions');
    if (cached) {
      setDiscussions(JSON.parse(cached));
    } else {
      // Preload rich default community questions
      const defaultDiscussions = [
        {
          id: 'disc-1',
          title: '📢 System Upgrade Scheduled: Maintenance Window for Support Hub',
          content: 'We will be conducting database refactoring and dashboard speed optimization on Sunday, June 1st, from 02:00 UTC to 04:00 UTC. During this period, support inquiries can still be tracked but creation of new tickets might experience brief delays of up to 5 minutes. Thank you for your support!',
          category: 'Announcement',
          author: 'Alex Carter',
          authorRole: 'admin',
          likes: 24,
          likedBy: [],
          comments: [
            {
              id: 'comment-1',
              author: 'Sarah Jenkins',
              authorRole: 'agent',
              content: 'Got it! Will communicate this directly to my clients during weekly check-ins.',
              createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
            },
            {
              id: 'comment-2',
              author: 'David Vance',
              authorRole: 'user',
              content: 'Appreciate the early notice! Will ensure our team schedules around this.',
              createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'disc-2',
          title: '❓ Best practice for configuring SLA escalation triggers?',
          content: 'Hello team, what is your standard approach for prioritizing critical tickets that are close to exceeding their SLA thresholds? Are you setting a pending buffer of 2 hours, or using automated AI assignment triggers? Trying to optimize response rates across our departments.',
          category: 'Q&A',
          author: 'Marcus Lee',
          authorRole: 'agent',
          likes: 12,
          likedBy: [],
          comments: [
            {
              id: 'comment-3',
              author: 'Alex Carter',
              authorRole: 'admin',
              content: 'We highly recommend setting automated triggers at 75% SLA consumption. This escalates high-priority cases immediately to Level 2 agents.',
              createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
        },
        {
          id: 'disc-3',
          title: '💡 Quick Tip: Speed up replies by grouping common canned responses',
          content: 'If you find yourself writing the same response for password resets or corporate VPN access instructions, you can save custom reply macros in your Account Settings. This saves our agents an average of 4.2 minutes per ticket!',
          category: 'Tips & Tricks',
          author: 'Sarah Jenkins',
          authorRole: 'agent',
          likes: 18,
          likedBy: [],
          comments: [],
          createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
        },
        {
          id: 'disc-4',
          title: '🔧 Workaround for 403 Forbidden on Slack Hook triggers',
          content: 'If you are facing immediate 403 errors when dispatching tickets via Slack Webhooks, check your workspace OAuth token levels. Our latest portal update requires the "incoming-webhook" workspace scope. This fixes the headers error.',
          category: 'Troubleshooting',
          author: 'Nate Sterling',
          authorRole: 'agent',
          likes: 7,
          likedBy: [],
          comments: [],
          createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
        }
      ];
      setDiscussions(defaultDiscussions);
      localStorage.setItem('discussions', JSON.stringify(defaultDiscussions));
    }
  }, []);

  // Save discussions to localStorage helper
  const saveDiscussions = (updated) => {
    setDiscussions(updated);
    localStorage.setItem('discussions', JSON.stringify(updated));
  };

  // Filter & Search Logic
  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && d.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleLike = (id, e) => {
    e.stopPropagation();
    const updated = discussions.map(d => {
      if (d.id === id) {
        const hasLiked = d.likedBy?.includes(currentUser.name);
        const likedBy = hasLiked 
          ? d.likedBy.filter(username => username !== currentUser.name)
          : [...(d.likedBy || []), currentUser.name];
        const likes = hasLiked ? d.likes - 1 : d.likes + 1;
        return { ...d, likes, likedBy };
      }
      return d;
    });
    saveDiscussions(updated);
    // Update selected discussion view if opened
    if (selectedDiscussion && selectedDiscussion.id === id) {
      setSelectedDiscussion(updated.find(d => d.id === id));
    }
  };

  const handleNewDiscussion = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newTopic = {
      id: `disc-${Date.now()}`,
      title: newTitle,
      content: newContent,
      category: newCategory,
      author: currentUser.name,
      authorRole: currentUser.role,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    const updated = [newTopic, ...discussions];
    saveDiscussions(updated);
    setNewTitle('');
    setNewContent('');
    setIsNewDiscussionOpen(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newReply.trim() || !selectedDiscussion) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      authorRole: currentUser.role,
      content: newReply,
      createdAt: new Date().toISOString()
    };

    const updated = discussions.map(d => {
      if (d.id === selectedDiscussion.id) {
        return {
          ...d,
          comments: [...(d.comments || []), newComment]
        };
      }
      return d;
    });

    saveDiscussions(updated);
    setSelectedDiscussion(updated.find(d => d.id === selectedDiscussion.id));
    setNewReply('');
  };

  const categories = [
    { name: 'All', icon: BookOpen, color: 'text-slate-500 bg-slate-100' },
    { name: 'Announcement', icon: Megaphone, color: 'text-blue-600 bg-blue-50' },
    { name: 'Q&A', icon: HelpCircle, color: 'text-indigo-600 bg-indigo-50' },
    { name: 'Tips & Tricks', icon: Lightbulb, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Troubleshooting', icon: Wrench, color: 'text-rose-600 bg-rose-50' }
  ];

  return (
    <AgentShell
      title="Collaboration Hub"
      subtitle="Engage with other members, read support updates, and share workspace knowledge."
      actions={
        <button
          onClick={() => setIsNewDiscussionOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1034A6] hover:bg-[#0E2D8E] text-white rounded-xl font-bold text-xs transition-colors shadow-md shadow-indigo-100 uppercase tracking-wider"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Create New Thread
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Filter Sidebar (mobile top, desktop left) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Thread Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all text-left",
                      isActive 
                        ? "bg-[#1034A6] text-white" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <cat.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                      <span>{cat.name}</span>
                    </div>
                    {!isActive && (
                      <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded-full text-slate-500">
                        {cat.name === 'All' ? discussions.length : discussions.filter(d => d.category.toLowerCase() === cat.name.toLowerCase()).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Discussions list or details view */}
        <div className="lg:col-span-9 space-y-6">
          {/* Custom Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations, ideas, announcement details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] shadow-sm outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Thread List */}
            <div className={cn(
              "space-y-4", 
              selectedDiscussion ? "md:col-span-6" : "md:col-span-12"
            )}>
              {filteredDiscussions.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-[32px] border border-slate-200">
                  <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-500">No conversations found</p>
                  <p className="text-xs text-slate-400 mt-1">Be the first to start a thread in this category!</p>
                </div>
              ) : (
                filteredDiscussions.map((disc) => {
                  const currentCategory = categories.find(c => c.name.toLowerCase() === disc.category.toLowerCase()) || categories[0];
                  const hasLiked = disc.likedBy?.includes(currentUser.name);

                  return (
                    <div
                      key={disc.id}
                      onClick={() => setSelectedDiscussion(disc)}
                      className={cn(
                        "bg-white p-6 rounded-[24px] border transition-all text-left cursor-pointer group relative",
                        selectedDiscussion?.id === disc.id 
                          ? "border-[#1034A6] shadow-md shadow-indigo-50/50 bg-[#1034A6]/[0.01]" 
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100"
                      )}
                    >
                      {/* Badge and timestamp */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border",
                          disc.category === 'Announcement' ? "text-blue-600 bg-blue-50 border-blue-100" :
                          disc.category === 'Q&A' ? "text-indigo-600 bg-indigo-50 border-indigo-100" :
                          disc.category === 'Tips & Tricks' ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                          "text-rose-600 bg-rose-50 border-rose-100"
                        )}>
                          {disc.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {new Date(disc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#1034A6] transition-colors mb-2.5">
                        {disc.title}
                      </h4>

                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-5">
                        {disc.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        {/* Author credentials */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-500 uppercase">
                            {disc.author[0]}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-700">{disc.author}</span>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest ml-1.5 px-1 py-0.5 rounded",
                              disc.authorRole === 'admin' ? "bg-red-50 text-red-500 border border-red-100" :
                              disc.authorRole === 'agent' ? "bg-indigo-50 text-[#1034A6] border border-indigo-100" :
                              "bg-slate-100 text-slate-500"
                            )}>
                              {disc.authorRole}
                            </span>
                          </div>
                        </div>

                        {/* Likes & Comments Counters */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleLike(disc.id, e)}
                            className={cn(
                              "flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer",
                              hasLiked 
                                ? "text-red-600 bg-red-50 hover:bg-red-100" 
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                            )}
                          >
                            <Heart className={cn("h-3.5 w-3.5", hasLiked && "fill-current text-red-600")} />
                            <span>{disc.likes}</span>
                          </button>

                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 py-1.5 px-2.5">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>{disc.comments ? disc.comments.length : 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Expanded Comment View Sidepane */}
            {selectedDiscussion && (
              <div className="md:col-span-6 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm space-y-6 text-left relative animate-fadeIn duration-150">
                <button
                  onClick={() => setSelectedDiscussion(null)}
                  className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all"
                  aria-label="Close panel"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Top header details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border",
                      selectedDiscussion.category === 'Announcement' ? "text-blue-600 bg-blue-50 border-blue-100" :
                      selectedDiscussion.category === 'Q&A' ? "text-indigo-600 bg-indigo-50 border-indigo-100" :
                      selectedDiscussion.category === 'Tips & Tricks' ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                      "text-rose-600 bg-rose-50 border-rose-100"
                    )}>
                      {selectedDiscussion.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {new Date(selectedDiscussion.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedDiscussion.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                      {selectedDiscussion.author[0]}
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-slate-700">{selectedDiscussion.author}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest ml-1.5 px-1 bg-slate-100 text-slate-500 rounded">
                        {selectedDiscussion.authorRole}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50 whitespace-pre-wrap">
                    {selectedDiscussion.content}
                  </p>
                </div>

                {/* Likes Counter inside */}
                <div className="flex items-center justify-between py-2 border-y border-slate-100">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Comments ({selectedDiscussion.comments ? selectedDiscussion.comments.length : 0})</span>
                  <button
                    onClick={(e) => handleLike(selectedDiscussion.id, e)}
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-3 rounded-lg border transition-all cursor-pointer",
                      selectedDiscussion.likedBy?.includes(currentUser.name)
                        ? "text-red-600 bg-red-50 border-red-100"
                        : "text-slate-500 bg-white border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    <span>{selectedDiscussion.likes} Likes</span>
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                  {!selectedDiscussion.comments || selectedDiscussion.comments.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-medium">No comments yet. Start the conversation!</div>
                  ) : (
                    selectedDiscussion.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">{comment.author}</span>
                            <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-100 px-1 rounded">{comment.authorRole}</span>
                          </div>
                          <span className="text-[9px] font-medium text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Reply Box */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a supportive reply..."
                    className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-[#1034A6] focus:border-[#1034A6] rounded-xl px-4 py-2.5 text-xs font-medium transition-all outline-none"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#1034A6] hover:bg-[#0E2D8E] text-white rounded-xl transition-colors cursor-pointer"
                    aria-label="Send reply"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* modal create thread */}
      {isNewDiscussionOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg border border-slate-200 shadow-2xl p-6 md:p-8 text-left aspect-auto animate-fadeIn duration-150 relative">
            <button
              onClick={() => setIsNewDiscussionOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-6">Create New Discussion</h3>
            <form onSubmit={handleNewDiscussion} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Discussion Title</label>
                <input
                  type="text"
                  placeholder="What would you like to discuss?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none cursor-pointer focus:bg-white transition-all text-slate-700"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Q&A">Q&A</option>
                    <option value="Tips & Tricks">Tips & Tricks</option>
                    <option value="Troubleshooting">Troubleshooting</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Details / Content</label>
                <textarea
                  placeholder="Provide supporting context, logs, code, or description of your idea..."
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewDiscussionOpen(false)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1034A6] hover:bg-[#0E2D8E] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Publish Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AgentShell>
  );
}
