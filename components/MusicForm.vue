<template>
    <div id="formulario">
      <form>
        <input type="radio" id="topArtists" v-model="topMusic" value="artists" checked>
        <label for="topArtists">Top Artists</label><br>
        <input type="radio" id="topSongs" v-model="topMusic" value="tracks">
        <label for="topSongs">Top Songs</label><br>
  
        <label for="time">Time</label>
        <select v-model="timeRange" name="time" id="time">
          <option value="short_term" selected>Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
        <br>
        <button @click.prevent="showChart">Show</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const topMusic = ref('artists');
  const timeRange = ref('short_term');
  
  const emit = defineEmits(['chartData']);
  const showChart = () => {
    emit('chartData', {
      dataTime: timeRange.value,
      dataTopMusic: topMusic.value,
      dataQuantity: 50,
      dataType: topMusic.value,
    });
  };
  </script>