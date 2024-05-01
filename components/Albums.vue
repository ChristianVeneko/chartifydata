<template>
    <div v-for="album in albums" :key="album.name" class="album-card">
      <div class="album-image">
        <a :href="`${album.url}`"
          ><img :src="album.image" :alt="album.name + ' photo'"
        /></a>
      </div>
      <div>{{ album.name }}</div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    albums: {
      type: Array,
      required: true,
    },
  });
  </script>