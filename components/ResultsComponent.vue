<template>
  <div id="results">
    <div v-if="type === 'artist'">
      <Artists :artists="data" />
    </div>
    <div v-else-if="type === 'song'">
      <Songs :songs="data" />
    </div>
    <div v-else-if="type === 'album'">
      <Albums :albums="data"/>
    </div>
  </div>
</template>

<script setup>
import Songs from './Songs.vue';
import Artists from './Artists.vue';
import Albums from './Albums.vue';

defineProps({
  data: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
</script>