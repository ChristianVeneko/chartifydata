<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';
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
const formSection = ref(null);

// Cambiamos la URL hardcodeada por la ruta API correcta
const loginUrl = '/api/login';

// Usamos el store centralizado
const authStore = useAuthStore();

// Personalized welcome message
const welcomeMessage = computed(() => {
  if (authStore.userProfile && authStore.userProfile.display_name) {
    return `Hello, ${authStore.userProfile.display_name}!`;
  }
  return 'Welcome to Chartifydata!';
});

onMounted(() => {
  // Check if there's an error in the URL (redirected from auth)
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');
  if (errorParam) {
    error.value = `Authentication error: ${errorParam}`;
  }

  // Verificamos el estado de autenticación al montar
  authStore.checkAccessToken();
  
  // Escuchar eventos de cambio de autenticación
  window.addEventListener('auth-state-changed', handleAuthStateChange);
});

// Cleanup event listeners
onBeforeUnmount(() => {
  window.removeEventListener('auth-state-changed', handleAuthStateChange);
});

// Handle auth state changes
const handleAuthStateChange = (event) => {
  console.log('IndexPage - Auth state changed:', event.detail);
  if (!event.detail.isLoggedIn) {
    // Clear chart data when user logs out
    chartData.value = [];
  }
};

// Crear instancia de Music cada vez que cambie el token
watch(() => authStore.accessToken, (newToken) => {
  if (newToken) {
    music.value = new Music(newToken);
  } else {
    music.value = null;
    // Clear chart data when token is removed
    chartData.value = [];
  }
}, { immediate: true });

const getChart = async (data) => {
  error.value = null;
  isLoadingData.value = true;
  
  console.log('getChart - Received data:', data);
  
  try {
    if (!music.value && authStore.accessToken) {
      music.value = new Music(authStore.accessToken);
    }

    if (!music.value) {
      throw new Error('No se pudo inicializar el cliente de música. Por favor, inicia sesión de nuevo.');
    }

    if (data.dataType === 'artists') {
      dataType.value = 'artist';
      const dataArtist = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
      console.log('getChart - Artists data received:', dataArtist);
      chartData.value = music.value.createTopArtist(dataArtist);
    } else if (data.dataType === 'tracks') {
      dataType.value = 'song';
      const dataTracks = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
      console.log('getChart - Tracks data received:', dataTracks);
      chartData.value = music.value.createTopSongs(dataTracks);
    } else if (data.dataType === 'albums') {
      dataType.value = 'album';
      const dataAlbums = await music.value.getTopMusic(data.dataTime, data.dataQuantity, 'tracks');
      console.log('getChart - Albums data received:', dataAlbums);
      chartData.value = music.value.getTopAlbums(dataAlbums);
    } else if (data.dataType === 'recently_played') {
      dataType.value = 'recently_played';
      const recentlyPlayed = await music.value.getRecentlyPlayed(data.dataQuantity);
      console.log('getChart - Recently played data received:', recentlyPlayed);
      chartData.value = music.value.processRecentlyPlayed(recentlyPlayed);
    }
    
    console.log('getChart - Final chartData:', chartData.value);
  } catch (err) {
    console.error('Error getting data:', err);
    error.value = `Error getting data: ${err.message}`;
    chartData.value = [];
    
    // Check if the error is due to authentication issues
    if (err.message.includes('authentication') || err.message.includes('token') || err.message.includes('login')) {
      authStore.checkAccessToken();
    }
  } finally {
    isLoadingData.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  chartData.value = [];
};

const updateChartData = (data) => {
  console.log('updateChartData - Received data:', data);
  getChart(data);
  
  // Scroll to results after a short delay to allow for rendering
  setTimeout(() => {
    const resultsElement = document.querySelector('.results-container');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

const scrollToForm = () => {
  if (formSection.value) {
    formSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>


<template>
  <div class="home-page">
    <!-- Not logged in - Login page -->
    <div v-if="!authStore.isLoggedIn" class="login-page">
      <div class="container">
        <div class="login-content">
          <h1 class="app-title">Welcome to <span class="highlight">Chartifydata</span></h1>
          <p class="app-description">
            Explore and visualize your Spotify statistics. Discover your most listened artists, songs, and albums.
          </p>
          
          <div class="login-card card">
            <h2>Connect with Spotify</h2>
            <p>To use Chartifydata, you need to connect your Spotify account. This allows us to access your listening data.</p>
            <a :href="loginUrl" class="btn btn-primary login-button">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7V12L15,15L13.59,16.41L10,12.83V7H12Z" />
              </svg>
              <span>Login with Spotify</span>
            </a>
          </div>
          
          <div class="features-section">
            <h2 class="section-title">What can you do?</h2>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                  </svg>
                </div>
                <h3>Favorite Artists</h3>
                <p>Discover who your most listened artists are across different time periods.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path fill="currentColor" d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" />
                  </svg>
                </div>
                <h3>Favorite Songs</h3>
                <p>Visualize your most played songs and discover patterns in your music taste.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path fill="currentColor" d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                </div>
                <h3>Favorite Albums</h3>
                <p>Explore the albums you've listened to the most and rediscover forgotten gems.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                  </svg>
                </div>
                <h3>Recently Played</h3>
                <p>Review your recent listening history and analyze your latest listening sessions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Logged in - Main page -->
    <div v-else class="main-content">
      <div class="container">
        <div class="welcome-section">
          <h1 class="welcome-title">{{ welcomeMessage }}</h1>
          <p class="welcome-subtitle">Ready to explore your Spotify statistics?</p>
        </div>
        
        <div id="form-section" class="form-section" ref="formSection">
          <h2 class="section-title">Explore Your Statistics</h2>
          <MusicForm @chartData="updateChartData" />
        </div>
        
        <div v-if="chartData.length > 0" class="results-section">
          <ResultsComponent :chartData="chartData" :dataType="dataType" />
        </div>
        
        <div class="features-section">
          <h2 class="section-title">What can you do?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                </svg>
              </div>
              <h3>Favorite Artists</h3>
              <p>Discover who your most listened artists are across different time periods.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="currentColor" d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" />
                </svg>
              </div>
              <h3>Favorite Songs</h3>
              <p>Visualize your most played songs and discover patterns in your music taste.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="currentColor" d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
              </div>
              <h3>Favorite Albums</h3>
              <p>Explore the albums you've listened to the most and rediscover forgotten gems.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                </svg>
              </div>
              <h3>Recently Played</h3>
              <p>Review your recent listening history and analyze your latest listening sessions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Login page styles */
.login-page {
  padding: var(--space-xl) 0;
  background: linear-gradient(135deg, var(--spotify-black), var(--spotify-dark-gray));
}

.login-content {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-lg);
  text-align: center;
}

.app-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

.highlight {
  color: var(--spotify-green);
}

.app-description {
  font-size: var(--font-size-lg);
  color: var(--spotify-light-gray);
  margin-bottom: var(--space-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.login-card {
  max-width: 500px;
  margin: 0 auto var(--space-2xl);
  padding: var(--space-xl);
  background-color: var(--spotify-gray);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.login-card h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  color: var(--spotify-white);
}

.login-card p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--space-lg);
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-md);
  font-weight: 600;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

/* Main content styles */
.main-content {
  padding: var(--space-xl) 0;
  background-color: var(--spotify-black);
}

.welcome-section {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.welcome-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--spotify-white);
}

.welcome-subtitle {
  font-size: var(--font-size-lg);
  color: var(--spotify-light-gray);
}

.form-section {
  margin-bottom: var(--space-2xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-xl);
  text-align: center;
  background: linear-gradient(to right, var(--spotify-green), var(--spotify-green-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.results-section {
  margin-bottom: var(--space-2xl);
}

/* Features section styles */
.features-section {
  padding: var(--space-2xl) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
}

.feature-card {
  background-color: var(--spotify-gray);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  text-align: center;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background-color: rgba(29, 185, 84, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-lg);
  color: var(--spotify-green);
}

.feature-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-md);
  color: var(--spotify-white);
}

.feature-card p {
  color: var(--spotify-light-gray);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .app-title {
    font-size: var(--font-size-2xl);
  }
  
  .login-card {
    padding: var(--space-lg);
  }
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-sm);
  }
  
  .login-content,
  .main-content {
    padding: var(--space-lg);
  }
}
</style>