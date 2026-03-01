// src/components/CommentSection.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Heart, Reply, AlertTriangle, Eye, EyeOff,
  Send, Clock, ChevronDown, ChevronUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/context/UserContext';
import LoginModal from './LoginModal';
import {
  fetchComments, postComment, addReply,
  toggleLike, reportSpoiler
} from '@/lib/api';

// Parse timestamps like 12:34 or 1:23:45 in text
function parseTimestamps(text) {
  const regex = /(\d{1,2}:\d{2}(?::\d{2})?)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'timestamp', value: match[1] });
    lastIndex = match.index + match[1].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', value: text }];
}

function CommentContent({ text, onTimestampClick }) {
  const parts = parseTimestamps(text);
  return (
    <p className="text-zinc-300 text-sm leading-relaxed">
      {parts.map((part, i) =>
        part.type === 'timestamp' ? (
          <button
            key={i}
            onClick={() => onTimestampClick && onTimestampClick(part.value)}
            className="timestamp-link"
          >
            {part.value}
          </button>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </p>
  );
}

function SingleComment({ comment, animeId, episodeNum, user, onRefresh, onTimestampClick, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const isSpoiler = comment.isSpoiler && !revealed;
  const isLiked = user && (comment.likedBy || []).includes(user.id);

  const handleLike = async () => {
    if (!user) { setShowLogin(true); return; }
    await toggleLike(animeId, episodeNum, comment.id, user.id);
    onRefresh();
  };

  const handleReport = async () => {
    await reportSpoiler(animeId, episodeNum, comment.id);
    onRefresh();
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user) { setShowLogin(true); return; }
    if (!replyText.trim()) return;
    await addReply(animeId, episodeNum, comment.id, {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      text: replyText.trim(),
    });
    setReplyText('');
    setReplying(false);
    setShowReplies(true);
    onRefresh();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${depth > 0 ? 'ml-8 mt-3' : 'mb-4'}`}
      >
        <img
          src={comment.avatar || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${comment.username}`}
          alt=""
          className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white">{comment.username}</span>
            <span className="text-xs text-zinc-500">
              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
            </span>
          </div>

          {/* Comment text with spoiler handling */}
          <div className={`relative ${isSpoiler ? 'spoiler-blur' : ''}`} onClick={() => isSpoiler && setRevealed(true)}>
            <CommentContent text={comment.text} onTimestampClick={onTimestampClick} />
          </div>

          {comment.isSpoiler && !revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="flex items-center gap-1 text-xs text-yellow-500 mt-1 hover:text-yellow-400"
            >
              <Eye size={12} />
              Show spoiler
            </button>
          )}

          {comment.isSpoiler && revealed && (
            <button
              onClick={() => setRevealed(false)}
              className="flex items-center gap-1 text-xs text-zinc-500 mt-1 hover:text-zinc-400"
            >
              <EyeOff size={12} />
              Hide spoiler
            </button>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? 'text-red-400' : 'text-zinc-500 hover:text-red-400'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-red-400' : ''} />
              {comment.likes || 0}
            </button>

            <button
              onClick={() => {
                if (!user) { setShowLogin(true); return; }
                setReplying(!replying);
              }}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
            >
              <Reply size={14} />
              Reply
            </button>

            {!comment.isSpoiler && (
              <button
                onClick={handleReport}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-yellow-500 transition-colors"
              >
                <AlertTriangle size={12} />
                Spoiler
              </button>
            )}
          </div>

          {/* Reply form */}
          <AnimatePresence>
            {replying && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleReply}
                className="mt-3 flex gap-2 overflow-hidden"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply... (use timestamps like 12:34)"
                  className="flex-1 bg-dark-50 border border-red-900/20 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Send size={14} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>

              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {comment.replies.map((reply) => (
                      <SingleComment
                        key={reply.id}
                        comment={reply}
                        animeId={animeId}
                        episodeNum={episodeNum}
                        user={user}
                        onRefresh={onRefresh}
                        onTimestampClick={onTimestampClick}
                        depth={depth + 1}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

export default function CommentSection({ animeId, episodeNum, onTimestampClick }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useUser();

  const loadComments = useCallback(async () => {
    const data = await fetchComments(animeId, episodeNum);
    setComments(data);
    setLoading(false);
  }, [animeId, episodeNum]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) { setShowLogin(true); return; }
    if (!newComment.trim()) return;

    await postComment(animeId, episodeNum, {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      text: newComment.trim(),
    });
    setNewComment('');
    loadComments();
  };

  return (
    <>
      <div className="bg-dark-200 rounded-xl border border-red-900/10 p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle size={20} className="text-red-500" />
          <h3 className="text-lg font-bold text-white">
            Comments <span className="text-zinc-500 text-sm font-normal">({comments.length})</span>
          </h3>
        </div>

        {/* Post comment */}
        <form onSubmit={handlePost} className="mb-6">
          <div className="flex gap-3">
            {user ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full mt-1" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-dark-50 flex items-center justify-center mt-1">
                <MessageCircle size={14} className="text-zinc-600" />
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onClick={() => !user && setShowLogin(true)}
                placeholder={user ? "Write a comment... (use timestamps like 12:34 to link to specific moments)" : "Login to comment..."}
                className="w-full bg-dark-50 border border-red-900/20 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors resize-none min-h-[80px]"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Clock size={12} />
                  <span>Tip: Type timestamps like 12:34 to create clickable time links</span>
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || !user}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
                >
                  <Send size={14} />
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded skeleton" />
                  <div className="h-3 w-full rounded skeleton" />
                  <div className="h-3 w-2/3 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={40} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {comments.map((comment) => (
              <SingleComment
                key={comment.id}
                comment={comment}
                animeId={animeId}
                episodeNum={episodeNum}
                user={user}
                onRefresh={loadComments}
                onTimestampClick={onTimestampClick}
              />
            ))}
          </div>
        )}
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
