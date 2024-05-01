<template>
   <div v-for="(song, index) in songs" :key="song.index" class="song-card">
      <div class="index">
        <h2>{{ song.index }}</h2>
      </div>
      <div class="cover">
        <img :src="song.cover" alt="Cover Image" />
      </div>
      <div class="info">
        <h2 class="name">{{ song.title }}</h2>
        <p class="artists" v-if="Array.isArray(song.artists)">{{ song.artists.join(', ') }}</p>
        <div class="spotify-link">
          <a :href="`${song.url}`"
            ><img
              class="spotify-logo"
              src="https://static.vecteezy.com/system/resources/previews/023/986/728/original/spotify-logo-spotify-logo-transparent-spotify-icon-transparent-free-free-png.png"
              alt="Spotify logo"
          /></a>
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
  </script>