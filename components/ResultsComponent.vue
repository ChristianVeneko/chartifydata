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
    <div v-else-if="type === 'recently_played'">
      <RecentlyPlayed :songs="data" />
    </div>
    <div v-else class="no-data">
      <p>No hay datos para mostrar</p>
    </div>
  </div>
</template>

<script setup>
import Songs from './Songs.vue';
import Artists from './Artists.vue';
import Albums from './Albums.vue';
import RecentlyPlayed from './RecentlyPlayed.vue';

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

<style scoped>
#results {
  margin-top: 30px;
}

.no-data {
  text-align: center;
  padding: 30px;
  background-color: #282828;
  border-radius: 8px;
  color: white;
  font-size: 18px;
}
</style>