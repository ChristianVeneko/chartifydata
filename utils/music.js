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

      // Manejar errores HTTP
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Token de autenticación expirado");
        } else if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || 1;
          throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
        } else {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Error HTTP ${res.status}`);
        }
      }

      // Solo intentar parsear JSON si hay contenido
      if (res.status !== 204) {
        return await res.json();
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error durante la solicitud:", error.message);
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

  // Métodos para obtener datos de usuario
  async getTopMusic(range, limit, type) {
    try {
      const response = await this.makeAPIRequest(
        `me/top/${type}?time_range=${range}&limit=${limit}`
      );
      return response.items;
    } catch (error) {
      console.error(`Error al obtener top ${type}:`, error);
      throw error;
    }
  }

  async getRecentlyPlayed(limit = 20) {
    try {
      const response = await this.makeAPIRequest(
        `me/player/recently-played?limit=${limit}`
      );
      return response.items;
    } catch (error) {
      console.error('Error al obtener canciones reproducidas recientemente:', error);
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
      console.error('Error al obtener playlists del usuario:', error);
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
      console.error(`Error al obtener items de la playlist ${playlistId}:`, error);
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
      console.error('Error al obtener canciones guardadas:', error);
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
      console.error('Error al obtener artistas seguidos:', error);
      throw error;
    }
  }

  // Métodos para procesar datos
  createTopArtist(artistsObj) {
    let artists = [];
    artistsObj.forEach((artist) => {
      let image = artist.images && artist.images.length > 0 ? artist.images[1]?.url : null;
      let name = artist.name;
      let url = artist.external_urls.spotify;
      let genres = artist.genres || [];
      let popularity = artist.popularity;
      artists.push({ name, url, image, genres, popularity });
    });
    return artists;
  }

  extractArtists(artists) {
    return artists.map(artist => artist.name);
  }

  createTopSongs(songsObj) {
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
    return songs;
  }

  getTopAlbums(data) {
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
    
    return topAlbumsArray;
  }

  // Método para procesar datos de canciones reproducidas recientemente
  processRecentlyPlayed(items) {
    return items.map((item, index) => {
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
  }

  // Método para procesar playlists
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
