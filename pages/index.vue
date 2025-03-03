<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuth } from '~/utils/useAuth';
import { Music } from '~/utils/music';
import LoginForm from '~/components/LoginForm.vue';
import Header from '~/components/Header.vue';
import MusicForm from '~/components/MusicForm.vue';
import ResultsComponent from '~/components/ResultsComponent.vue';
import Loading from '~/components/Loading.vue';

const chartData = ref([]);
const dataType = ref('artists');
const music = ref(null);
const error = ref(null);
const isLoadingData = ref(false);

const { isLoading, isLoggedIn, accessToken, userProfile, logout } = useAuth();

// Mensaje de bienvenida personalizado
const welcomeMessage = computed(() => {
  if (userProfile.value && userProfile.value.display_name) {
    return `¡Hola, ${userProfile.value.display_name}!`;
  }
  return '¡Bienvenido a Chartifydata!';
});

onMounted(() => {
  // Verificar si hay un error en la URL (redireccionado desde auth)
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');
  if (errorParam) {
    error.value = `Error de autenticación: ${errorParam}`;
  }

  if (accessToken.value) {
    music.value = new Music(accessToken.value);
  }
});

const getChart = async (data) => {
  error.value = null;
  isLoadingData.value = true;
  
  try {
    if (!music.value) {
      music.value = new Music(accessToken.value);
    }

    if (data.dataType === 'artists') {
      dataType.value = 'artist';
      const dataArtist = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
      chartData.value = music.value.createTopArtist(dataArtist);
    } else if (data.dataType === 'tracks') {
      dataType.value = 'song';
      const dataTracks = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
      chartData.value = music.value.createTopSongs(dataTracks);
    } else if (data.dataType === 'albums') {
      dataType.value = 'album';
      const dataAlbums = await music.value.getTopMusic(data.dataTime, data.dataQuantity, 'tracks');
      chartData.value = music.value.getTopAlbums(dataAlbums);
    } else if (data.dataType === 'recently_played') {
      dataType.value = 'recently_played';
      const recentlyPlayed = await music.value.getRecentlyPlayed(data.dataQuantity);
      chartData.value = music.value.processRecentlyPlayed(recentlyPlayed);
    }
  } catch (err) {
    console.error('Error al obtener datos:', err);
    error.value = `Error al obtener datos: ${err.message}`;
    chartData.value = [];
  } finally {
    isLoadingData.value = false;
  }
};

const handleLogout = () => {
  logout();
  chartData.value = [];
};
</script>


<template>
  <div id="app">
    <Header :username="userProfile?.display_name" @logout="handleLogout" />
    
    <div class="error-message" v-if="error">
      {{ error }}
      <button class="close-button" @click="error = null">×</button>
    </div>
    
    <div id="container">
      <div v-if="isLoading"><Loading /></div>
      <div v-else-if="isLoggedIn">
        <div class="welcome-message" v-if="chartData.length === 0">
          <h2>{{ welcomeMessage }}</h2>
          <p>Selecciona el tipo de datos que quieres visualizar</p>
        </div>
        
        <MusicForm @chartData="getChart" />
        
        <div v-if="isLoadingData" class="loading-container">
          <Loading />
        </div>
        <ResultsComponent v-else :data="chartData" :type="dataType" />
      </div>
      <div v-else>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-message {
  text-align: center;
  margin: 40px 0;
  color: white;
}

.welcome-message h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #1db954;
}

.error-message {
  background-color: #e74c3c;
  color: white;
  padding: 12px 20px;
  border-radius: 5px;
  margin: 20px auto;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.loading-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}
</style>