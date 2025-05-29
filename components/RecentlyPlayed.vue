<template>
  <div class="recently-played-container">
    <div v-for="song in songs" :key="song.played_at" class="recently-played-card">
      <div class="timestamp">
        <span>{{ formatDate(song.played_at) }}</span>
      </div>
      <div class="cover">
        <img :src="song.cover" alt="Cover Image" />
      </div>
      <div class="info">
        <h2 class="name">{{ song.title }}</h2>
        <p class="artists">{{ song.artists.join(', ') }}</p>
        <p class="album">{{ song.albumName }}</p>
        <div class="spotify-link">
          <a :href="song.url" target="_blank" rel="noopener noreferrer">
            <img
              class="spotify-logo"
              src="https://static.vecteezy.com/system/resources/previews/023/986/728/original/spotify-logo-spotify-logo-transparent-spotify-icon-transparent-free-free-png.png"
              alt="Spotify logo"
            />
          </a>
        </div>
      </div>
      <div class="preview" v-if="song.preview_url">
        <audio controls :src="song.preview_url"></audio>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  songs: {
    type: Array,
    required: true,
  },
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
</script>

<style scoped>
.recently-played-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.recently-played-card {
  display: flex;
  align-items: center;
  background-color: #282828;
  border-radius: 8px;
  padding: 15px;
  color: white;
  transition: background-color 0.3s;
}

.recently-played-card:hover {
  background-color: #333;
}

.timestamp {
  min-width: 100px;
  text-align: center;
  color: #b3b3b3;
  font-size: 14px;
}

.cover {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  flex-shrink: 0;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0;
}

.info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.artists, .album {
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
}

.spotify-link {
  margin-top: 5px;
}

.spotify-logo {
  width: 20px;
  height: 20px;
  transition: opacity 0.3s;
}

.spotify-logo:hover {
  opacity: 0.8;
}

.preview {
  margin-left: 15px;
}

.preview audio {
  height: 30px;
}

@media (max-width: 600px) {
  .recently-played-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .timestamp {
    width: 100%;
    text-align: left;
  }
  
  .cover {
    margin-right: 0;
  }
  
  .info {
    width: 100%;
  }
  
  .preview {
    margin-left: 0;
    width: 100%;
  }
  
  .preview audio {
    width: 100%;
  }
}
</style> 