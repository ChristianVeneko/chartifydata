/**
 * Functions to interact with the Spotify API
 */

// Verifies if the access token has expired and refreshes it if necessary
const ensureValidToken = async () => {
  const accessToken = localStorage.getItem('spotify_access_token');
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  
  // If there's no token, we can't do anything
  if (!accessToken || !refreshToken) {
    throw new Error('No access token available. Please log in.');
  }
  
  // If the token is about to expire (less than 5 minutes), refresh it
  const now = new Date().getTime();
  const isExpired = !expiresAt || now >= parseInt(expiresAt);
  
  if (isExpired) {
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Token refresh error details:', errorData);
        throw new Error(errorData.error || 'Error refreshing token');
      }
      
      const data = await response.json();
      
      // Update the token in localStorage
      localStorage.setItem('spotify_access_token', data.access_token);
      
      // Calculate new expiration time (subtract 5 minutes for safety margin)
      const expiresIn = data.expires_in - 300;
      const newExpiresAt = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem('spotify_token_expires_at', newExpiresAt.toString());
      
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If there's an error refreshing, clear the tokens and force a new login
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_token_expires_at');
      throw new Error('Session expired. Please log in again.');
    }
  }
  
  return accessToken;
};

// Gets the most listened items (artists, songs or albums)
export const getTopItems = async (type, timeRange, limit) => {
  try {
    const accessToken = await ensureValidToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error getting data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error(`Error getting most listened ${type}:`, error);
    throw error;
  }
};

// Gets recently played songs
export const getRecentlyPlayed = async (limit) => {
  try {
    const accessToken = await ensureValidToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error getting data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error getting recently played songs:', error);
    throw error;
  }
};

// Gets the user profile
export const getUserProfile = async () => {
  try {
    const accessToken = await ensureValidToken();
    
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error getting profile: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export class Music {
  constructor(token) {
    this.token = token;
    this.userProfile = {};
    this.baseUrl = 'https://api.spotify.com/v1';
  }

  async makeAPIRequest(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        method
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
      const res = await fetch(url, options);

      // Handle HTTP errors
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Authentication token expired");
        } else if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || 1;
          throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
        } else {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `HTTP Error ${res.status}`);
        }
      }

      // Only try to parse JSON if there is content
      if (res.status !== 204) {
        return await res.json();
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error during request:", error.message);
      throw error;
    }
  }

  async isTokenValid() {
    try {
      await this.makeAPIRequest('me');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserProfile() {
    this.userProfile = await this.makeAPIRequest('me');
    return this.userProfile;
  }

  // Methods to get user data
  async getTopMusic(range, limit, type) {
    try {
      console.log(`getTopMusic - Fetching ${type} with range: ${range}, limit: ${limit}`);
      const response = await this.makeAPIRequest(
        `me/top/${type}?time_range=${range}&limit=${limit}`
      );
      console.log(`getTopMusic - Received ${response.items?.length || 0} items`);
      return response.items;
    } catch (error) {
      console.error(`Error getting top ${type}:`, error);
      throw error;
    }
  }

  async getRecentlyPlayed(limit = 20) {
    try {
      console.log(`getRecentlyPlayed - Fetching with limit: ${limit}`);
      const response = await this.makeAPIRequest(
        `me/player/recently-played?limit=${limit}`
      );
      console.log(`getRecentlyPlayed - Received ${response.items?.length || 0} items`);
      return response.items;
    } catch (error) {
      console.error('Error getting recently played songs:', error);
      throw error;
    }
  }

  async getUserPlaylists(limit = 20, offset = 0) {
    try {
      const response = await this.makeAPIRequest(
        `me/playlists?limit=${limit}&offset=${offset}`
      );
      return response.items;
    } catch (error) {
      console.error('Error getting user playlists:', error);
      throw error;
    }
  }

  async getPlaylistItems(playlistId, limit = 100, offset = 0) {
    try {
      const response = await this.makeAPIRequest(
        `playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`
      );
      return response.items;
    } catch (error) {
      console.error(`Error getting playlist items for ${playlistId}:`, error);
      throw error;
    }
  }

  async getSavedTracks(limit = 20, offset = 0) {
    try {
      const response = await this.makeAPIRequest(
        `me/tracks?limit=${limit}&offset=${offset}`
      );
      return response.items;
    } catch (error) {
      console.error('Error getting saved tracks:', error);
      throw error;
    }
  }

  async getFollowedArtists(limit = 20, after = null) {
    try {
      let url = `me/following?type=artist&limit=${limit}`;
      if (after) {
        url += `&after=${after}`;
      }
      const response = await this.makeAPIRequest(url);
      return response.artists.items;
    } catch (error) {
      console.error('Error getting followed artists:', error);
      throw error;
    }
  }

  // Methods to process data
  createTopArtist(artistsObj) {
    console.log('createTopArtist - Processing artists:', artistsObj?.length || 0);
    let artists = [];
    artistsObj.forEach((artist) => {
      let image = artist.images && artist.images.length > 0 ? artist.images[1]?.url : null;
      let name = artist.name;
      let url = artist.external_urls.spotify;
      let genres = artist.genres || [];
      let popularity = artist.popularity;
      artists.push({ name, url, image, genres, popularity });
    });
    console.log('createTopArtist - Processed artists:', artists.length);
    return artists;
  }

  extractArtists(artists) {
    return artists.map(artist => artist.name);
  }

  createTopSongs(songsObj) {
    console.log('createTopSongs - Processing songs:', songsObj?.length || 0);
    let songs = [];
    let i = 1;
    songsObj.forEach((song) => {
      let title = song.name;
      let artists = this.extractArtists(song.artists);
      let albumName = song.album.name;
      let cover = song.album.images && song.album.images.length > 0 ? song.album.images[1]?.url : null;
      let url = song.external_urls.spotify;
      let popularity = song.popularity;
      let preview_url = song.preview_url;
      songs.push({
        index: i,
        cover,
        albumName,
        artists,
        title,
        url,
        popularity,
        preview_url
      });
      i++;
    });
    console.log('createTopSongs - Processed songs:', songs.length);
    return songs;
  }

  getTopAlbums(data) {
    console.log('getTopAlbums - Processing tracks for albums:', data?.length || 0);
    let items = data;
    let topAlbums = {};

    items.forEach((item, index) => {
      let album = item.album;

      if (!topAlbums[album.id]) {
        topAlbums[album.id] = {
          id: album.id,
          name: album.name,
          image: album.images && album.images.length > 0 ? album.images[0].url : null,
          artists: album.artists.map((a) => a.name),
          url: album.external_urls.spotify,
          release_date: album.release_date,
          total_tracks: album.total_tracks,
          popularity: 0,
          index: index,
        };
      }

      topAlbums[album.id].popularity += item.popularity || 0;
    });

    let topAlbumsArray = Object.values(topAlbums);
    topAlbumsArray.sort((a, b) => b.popularity - a.popularity);
    
    console.log('getTopAlbums - Processed albums:', topAlbumsArray.length);
    return topAlbumsArray;
  }

  // Method to process recently played songs data
  processRecentlyPlayed(items) {
    console.log('processRecentlyPlayed - Processing items:', items?.length || 0);
    const processed = items.map((item, index) => {
      const track = item.track;
      return {
        index: index + 1,
        title: track.name,
        artists: this.extractArtists(track.artists),
        albumName: track.album.name,
        cover: track.album.images && track.album.images.length > 0 ? track.album.images[1]?.url : null,
        url: track.external_urls.spotify,
        played_at: item.played_at,
        preview_url: track.preview_url
      };
    });
    console.log('processRecentlyPlayed - Processed items:', processed.length);
    return processed;
  }

  // Method to process playlists
  processPlaylists(playlists) {
    return playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : null,
      owner: playlist.owner.display_name,
      tracks_total: playlist.tracks.total,
      url: playlist.external_urls.spotify,
      public: playlist.public
    }));
  }
}
