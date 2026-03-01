// src/lib/consumet.js
import axios from 'axios';

// Using the Consumet API for anime data
// You can self-host: https://github.com/consumet/api.consumet.org
// Or use a public instance
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.consumet.org';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Retry logic
api.interceptors.response.use(null, async (error) => {
  const config = error.config;
  if (!config || config.__retryCount >= 2) return Promise.reject(error);
  config.__retryCount = config.__retryCount || 0;
  config.__retryCount++;
  await new Promise(r => setTimeout(r, 1000 * config.__retryCount));
  return api(config);
});

export const consumetApi = {
  // Search anime
  search: async (query, page = 1) => {
    const { data } = await api.get(`/anime/gogoanime/${encodeURIComponent(query)}`, {
      params: { page },
    });
    return data;
  },

  // Get anime info
  getAnimeInfo: async (id) => {
    const { data } = await api.get(`/anime/gogoanime/info/${id}`);
    return data;
  },

  // Get streaming links
  getStreamingLinks: async (episodeId, server = 'gogocdn') => {
    const { data } = await api.get(`/anime/gogoanime/watch/${episodeId}`, {
      params: { server },
    });
    return data;
  },

  // Get top airing
  getTopAiring: async (page = 1) => {
    const { data } = await api.get('/anime/gogoanime/top-airing', {
      params: { page },
    });
    return data;
  },

  // Get recent episodes
  getRecentEpisodes: async (page = 1, type = 1) => {
    const { data } = await api.get('/anime/gogoanime/recent-episodes', {
      params: { page, type },
    });
    return data;
  },

  // Get by genre
  getByGenre: async (genre, page = 1) => {
    const { data } = await api.get(`/anime/gogoanime/genre/${genre}`, {
      params: { page },
    });
    return data;
  },

  // --- Anilist-based endpoints for richer data ---
  // Search with Anilist
  searchAnilist: async (query, page = 1, perPage = 20) => {
    const { data } = await api.get(`/meta/anilist/${encodeURIComponent(query)}`, {
      params: { page, perPage },
    });
    return data;
  },

  // Trending
  getTrending: async (page = 1, perPage = 20) => {
    const { data } = await api.get('/meta/anilist/trending', {
      params: { page, perPage },
    });
    return data;
  },

  // Popular
  getPopular: async (page = 1, perPage = 20) => {
    const { data } = await api.get('/meta/anilist/popular', {
      params: { page, perPage },
    });
    return data;
  },

  // Anilist anime info (richer data with episodes)
  getAnilistInfo: async (id, provider = 'gogoanime') => {
    const { data } = await api.get(`/meta/anilist/info/${id}`, {
      params: { provider },
    });
    return data;
  },

  // Get Anilist episode streaming links
  getAnilistWatch: async (episodeId) => {
    const { data } = await api.get(`/meta/anilist/watch/${episodeId}`);
    return data;
  },

  // Advanced search with filters
  advancedSearch: async (params) => {
    const { data } = await api.get('/meta/anilist/advanced-search', { params });
    return data;
  },

  // Get random anime
  getRandom: async () => {
    const { data } = await api.get('/meta/anilist/random-anime');
    return data;
  },
};

export default consumetApi;
