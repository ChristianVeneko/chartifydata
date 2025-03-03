<template>
  <div class="results-container fade-in" v-if="chartData">
    <div class="results-header">
      <h2 class="results-title">
        {{ getTitle() }}
        <span class="time-period">{{ getTimePeriod() }}</span>
      </h2>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading your data...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
      </div>
      <h3>An error occurred</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="retryFetch">Try again</button>
    </div>

    <div v-else class="results-grid">
      <div 
        v-for="(item, index) in results" 
        :key="index"
        class="result-card"
        :style="{ '--delay': `${index * 0.05}s` }"
      >
        <div class="rank-badge">{{ index + 1 }}</div>
        <div class="result-image-container">
          <img 
            :src="getImageUrl(item)" 
            :alt="getName(item)" 
            class="result-image"
            loading="lazy"
          />
          <div class="play-overlay">
            <a 
              :href="getSpotifyUrl(item)" 
              target="_blank" 
              rel="noopener noreferrer"
              class="play-button"
              title="Open in Spotify"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z" />
              </svg>
            </a>
          </div>
        </div>
        <div class="result-info">
          <div class="result-header">
            <h3 class="result-name">{{ getName(item) }}</h3>
            <a 
              :href="getSpotifyUrl(item)" 
              target="_blank" 
              rel="noopener noreferrer"
              class="spotify-link"
              title="Open on Spotify"
            >
              <img src="/assets/spotify-icon.svg" class="spotify-icon" alt="Spotify" />
            </a>
          </div>
          <p class="result-details">{{ getDetails(item) }}</p>
          <div v-if="dataType === 'song'" class="audio-preview">
            <audio-preview v-if="item.preview_url" :preview-url="item.preview_url" />
            <span v-else class="no-preview">Preview not available</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="results && results.length > 0" class="export-section">
      <button class="btn btn-secondary" @click="exportData">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
        </svg>
        <span>Export results</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import AudioPreview from './AudioPreview.vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const props = defineProps({
  chartData: {
    type: Array,
    required: true
  },
  dataType: {
    type: String,
    required: true
  }
});

console.log('ResultsComponent - Received props:', {
  chartData: props.chartData,
  dataType: props.dataType
});

const results = ref([]);
const loading = ref(false);
const error = ref(null);

watch(() => props.chartData, (newData) => {
  if (newData) {
    results.value = newData;
    loading.value = false;
    error.value = null;
  }
}, { immediate: true });

// Watch authentication state changes
watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  console.log('ResultsComponent - Auth state changed:', isLoggedIn);
  if (!isLoggedIn) {
    // Clear results when user logs out
    results.value = [];
  }
});

const getTitle = () => {
  if (props.dataType === 'artist') return 'Your Favorite Artists';
  if (props.dataType === 'song') return 'Your Favorite Songs';
  if (props.dataType === 'album') return 'Your Favorite Albums';
  if (props.dataType === 'recently_played') return 'Recently Played';
  return 'Results';
};

const getTimePeriod = () => {
  return '';
};

const getName = (item) => {
  return item.name || item.title || '';
};

const getDetails = (item) => {
  if (props.dataType === 'artist') {
    return item.genres ? item.genres.join(', ') : '';
  } else if (props.dataType === 'song' || props.dataType === 'album') {
    return item.artists ? item.artists.join(', ') : '';
  } else if (props.dataType === 'recently_played') {
    return `${item.artists ? item.artists.join(', ') : ''} • ${new Date(item.played_at).toLocaleString()}`;
  }
  return '';
};

const getImageUrl = (item) => {
  return item.image || item.cover || '/img/default-album.png';
};

const getSpotifyUrl = (item) => {
  return item.url || '#';
};

// Handle auth state changes from custom event
const handleAuthStateChange = (event) => {
  console.log('ResultsComponent - Auth state changed event:', event.detail);
  if (!event.detail.isLoggedIn) {
    // Clear results when user logs out
    results.value = [];
  }
};

onMounted(() => {
  window.addEventListener('auth-state-changed', handleAuthStateChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('auth-state-changed', handleAuthStateChange);
});

const exportData = () => {
  if (!results.value || results.value.length === 0) return;
  
  let csvContent = 'data:text/csv;charset=utf-8,';
  
  // Header
  csvContent += 'Rank,Name,Details,Spotify URL\n';
  
  // Data rows
  results.value.forEach((item, index) => {
    const row = [
      index + 1,
      `"${getName(item).replace(/"/g, '""')}"`,
      `"${getDetails(item).replace(/"/g, '""')}"`,
      getSpotifyUrl(item)
    ];
    csvContent += row.join(',') + '\n';
  });
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${getTitle().toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.results-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: var(--space-lg);
}

.results-header {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.results-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--spotify-white);
  margin-bottom: var(--space-md);
  background: linear-gradient(to right, var(--spotify-green), var(--spotify-green-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.time-period {
  font-size: 16px;
  font-weight: 400;
  color: var(--spotify-light-gray);
  display: block;
  margin-top: var(--space-xs);
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(29, 185, 84, 0.3);
  border-radius: 50%;
  border-top-color: var(--spotify-green);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: var(--space-lg);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  color: var(--spotify-error);
  margin-bottom: var(--space-md);
}

.error-container h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.error-container p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--space-lg);
  max-width: 500px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}

.result-card {
  background-color: var(--spotify-gray);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  box-shadow: var(--shadow-md);
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.rank-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--spotify-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  z-index: 2;
}

.result-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background-color: var(--spotify-dark-gray);
}

.result-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  background-color: var(--spotify-dark-gray);
}

.result-card:hover .result-image {
  transform: scale(1.08);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.result-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 40px;
  height: 40px;
  background-color: var(--spotify-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--spotify-black);
  transition: transform var(--transition-normal), background-color var(--transition-normal);
}

.play-button:hover {
  transform: scale(1.1);
  background-color: var(--spotify-green-light);
}

.result-info {
  padding: var(--space-md);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.result-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0;
  color: var(--spotify-white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  padding-right: var(--space-xs);
}

.spotify-link {
  flex-shrink: 0;
  display: block;
  width: 20px;
  height: 20px;
}

.spotify-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: invert(0.8);
  opacity: 0.7;
  transition: opacity var(--transition-normal);
}

.spotify-link:hover .spotify-icon {
  opacity: 1;
}

.result-details {
  font-size: 13px;
  color: var(--spotify-light-gray);
  margin-bottom: var(--space-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-preview {
  margin-top: var(--space-md);
}

.no-preview {
  font-size: 12px;
  color: var(--spotify-light-gray);
  font-style: italic;
}

.export-section {
  margin-top: var(--space-2xl);
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-sm);
  }
  
  .results-title {
    font-size: 22px;
  }
  
  .result-info {
    padding: var(--space-sm);
  }
  
  .result-name {
    font-size: 14px;
  }
  
  .result-details {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-xs);
  }
  
  .rank-badge {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
  
  .play-button {
    width: 36px;
    height: 36px;
  }
  
  .spotify-link {
    width: 16px;
    height: 16px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>