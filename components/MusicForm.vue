<template>
  <div id="formulario">
    <form>
      <div class="form-section">
        <h3>Tipo de datos</h3>
        <div class="radio-group">
          <div class="radio-option">
            <input type="radio" id="topArtists" v-model="topMusic" value="artists" checked>
            <label for="topArtists">Artistas más escuchados</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="topSongs" v-model="topMusic" value="tracks">
            <label for="topSongs">Canciones más escuchadas</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="topAlbums" v-model="topMusic" value="albums">
            <label for="topAlbums">Álbumes más escuchados</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="recentlyPlayed" v-model="topMusic" value="recently_played">
            <label for="recentlyPlayed">Reproducidas recientemente</label>
          </div>
        </div>
      </div>

      <div class="form-section" v-if="topMusic !== 'recently_played'">
        <h3>Período de tiempo</h3>
        <select v-model="timeRange" name="time" id="time" class="select-input">
          <option value="short_term">Últimas 4 semanas</option>
          <option value="medium_term">Últimos 6 meses</option>
          <option value="long_term">Todo el tiempo</option>
        </select>
      </div>

      <div class="form-section">
        <h3>Cantidad de resultados</h3>
        <select v-model="quantity" name="quantity" id="quantity" class="select-input">
          <option value="10">10 resultados</option>
          <option value="20">20 resultados</option>
          <option value="30">30 resultados</option>
          <option value="50">50 resultados</option>
        </select>
      </div>

      <button class="show-button" @click.prevent="showChart">Mostrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const topMusic = ref('artists');
const timeRange = ref('short_term');
const quantity = ref('20');

const emit = defineEmits(['chartData']);
const showChart = () => {
  emit('chartData', {
    dataTime: timeRange.value,
    dataTopMusic: topMusic.value,
    dataQuantity: parseInt(quantity.value, 10),
    dataType: topMusic.value,
  });
};
</script>

<style scoped>
#formulario {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #282828;
  border-radius: 10px;
  color: white;
}

.form-section {
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #1db954;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
}

input[type="radio"] {
  margin-right: 10px;
  accent-color: #1db954;
}

.select-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: #333;
  color: white;
  border: none;
  font-size: 16px;
}

.show-button {
  background-color: #1db954;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 10px;
}

.show-button:hover {
  background-color: #1ed760;
}

@media (max-width: 600px) {
  #formulario {
    margin: 10px;
    padding: 15px;
  }
}
</style>