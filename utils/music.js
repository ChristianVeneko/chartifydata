export class Music {
  constructor(token) {
    this.token = token;
    this.userProfile = {};
  }

  async makeAPIRequest(endpoint, method, body) {
    try {
      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        method,
        body: JSON.stringify(body),
      });

      // Si la respuesta indica que el token ha expirado (código 401), manejar el error
      if (res.status === 401) {
        throw new Error("Token de autenticación expirado");
      }

      return await res.json();
    } catch (error) {
      console.log("Error durante la solicitud:", error.message);
    }
  }

  async isInvalidToken() {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Token vencido");
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getPlaylistItems() {
    const items = await this.makeAPIRequest(
      "v1/playlists/1wYxDvyqoe1YWQzZvXfcCz/tracks",
      "GET"
    );
    return items;
  }

  async getUserProfile() {
    const userData = await this.makeAPIRequest("v1/me", "GET");
    this.userProfile = userData;
  }

  createTopArtist(artistsObj) {
    let artists = [];
    artistsObj.forEach((artist) => {
      let image = artist.images[1].url;
      let name = artist.name;
      let url = artist.external_urls.spotify;
      artists.push({ name, url, image });
    });
    return artists;
  }

  extractArtists(artists) {
    let artistsNames = [];
    artists.forEach((artist) => {
      let name = artist.name;
      artistsNames.push(name);
    });
    return artistsNames;
  }

  createTopSongs(songsObj) {
    let songs = [];
    let i = 1;
    songsObj.forEach((song) => {
      let title = song.name;
      let artists = this.extractArtists(song.artists);
      let albumName = song.album.name;
      let cover = song.album.images[2].url;
      let url = song.external_urls.spotify;
      songs.push({
        index: i,
        cover: cover,
        albumName: albumName,
        artists: artists,
        title: title,
        url: url,
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
          name: album.name,
          image: album.images[0].url,
          artists: album.artists.map((a) => a.name),
          url: album.external_urls.spotify,
          popularity: 0,
          index: index,
        };
      }

      topAlbums[album.id].popularity += item.popularity;
    });

    let topAlbumsArray = Object.values(topAlbums);

    topAlbumsArray.sort((a, b) => {
      return b.popularity - a.popularity;
    });
    console.log(topAlbumsArray)
    return topAlbumsArray;
  }

  async getTopMusic(range, limit, type) {
    try {
      const response = await this.makeAPIRequest(
        `v1/me/top/${type}?time_range=${range}&limit=${limit}`,
        "GET"
      );
      if (type == "artists") {
        return response.items;
      } else {
        return response.items;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
