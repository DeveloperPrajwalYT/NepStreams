// src/lib/api.js
// Client-side API calls that go through our Next.js API routes

const BASE = '';

export async function fetchTrending(page = 1) {
  const res = await fetch(`${BASE}/api/anime/trending?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
}

export async function fetchPopular(page = 1) {
  const res = await fetch(`${BASE}/api/anime/popular?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch popular');
  return res.json();
}

export async function fetchAnimeInfo(id) {
  const res = await fetch(`${BASE}/api/anime/${id}`);
  if (!res.ok) throw new Error('Failed to fetch anime info');
  return res.json();
}

export async function fetchEpisodes(id) {
  const res = await fetch(`${BASE}/api/episodes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch episodes');
  return res.json();
}

export async function fetchStreamingLinks(episodeId) {
  const res = await fetch(`${BASE}/api/streams/${encodeURIComponent(episodeId)}`);
  if (!res.ok) throw new Error('Failed to fetch streaming links');
  return res.json();
}

export async function searchAnime(query, page = 1) {
  const res = await fetch(`${BASE}/api/anime/search?q=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to search');
  return res.json();
}

export async function fetchComments(animeId, episodeNum) {
  const stored = localStorage.getItem(`comments_${animeId}_${episodeNum}`);
  return stored ? JSON.parse(stored) : [];
}

export async function postComment(animeId, episodeNum, comment) {
  const key = `comments_${animeId}_${episodeNum}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const newComment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...comment,
    timestamp: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    replies: [],
    reported: false,
    isSpoiler: false,
  };
  existing.unshift(newComment);
  localStorage.setItem(key, JSON.stringify(existing));
  return newComment;
}

export async function addReply(animeId, episodeNum, commentId, reply) {
  const key = `comments_${animeId}_${episodeNum}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const newReply = {
    id: `r_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...reply,
    timestamp: new Date().toISOString(),
    likes: 0,
    likedBy: [],
  };
  const comment = existing.find(c => c.id === commentId);
  if (comment) {
    comment.replies = comment.replies || [];
    comment.replies.push(newReply);
    localStorage.setItem(key, JSON.stringify(existing));
  }
  return newReply;
}

export async function toggleLike(animeId, episodeNum, commentId, userId) {
  const key = `comments_${animeId}_${episodeNum}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');

  function toggleInList(list) {
    for (const item of list) {
      if (item.id === commentId) {
        item.likedBy = item.likedBy || [];
        if (item.likedBy.includes(userId)) {
          item.likedBy = item.likedBy.filter(id => id !== userId);
          item.likes = Math.max(0, (item.likes || 0) - 1);
        } else {
          item.likedBy.push(userId);
          item.likes = (item.likes || 0) + 1;
        }
        return true;
      }
      if (item.replies && toggleInList(item.replies)) return true;
    }
    return false;
  }

  toggleInList(existing);
  localStorage.setItem(key, JSON.stringify(existing));
  return existing;
}

export async function reportSpoiler(animeId, episodeNum, commentId) {
  const key = `comments_${animeId}_${episodeNum}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');

  function markSpoiler(list) {
    for (const item of list) {
      if (item.id === commentId) {
        item.isSpoiler = true;
        return true;
      }
      if (item.replies && markSpoiler(item.replies)) return true;
    }
    return false;
  }

  markSpoiler(existing);
  localStorage.setItem(key, JSON.stringify(existing));
  return existing;
}
