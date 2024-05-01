<template>
    <div v-for="artist in artists" :key="artist.name" class="artist-card">
      <div class="artist-image">
        <a :href="`${artist.url}`"
          ><img :src="artist.image" :alt="artist.name + ' photo'"
        /></a>
      </div>
      <div>{{ artist.name }}</div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    artists: {
      type: Array,
      required: true,
    },
  });
  </script>