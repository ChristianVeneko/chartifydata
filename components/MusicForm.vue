<template>
  <div class="music-form card fade-in">
    <h2 class="form-title">Explore your statistics</h2>
    
    <form>
      <div class="form-section">
        <h3>Data type</h3>
        <div class="option-grid">
          <div 
            v-for="(option, index) in dataOptions" 
            :key="index"
            class="option-card" 
            :class="{ active: topMusic === option.value }"
            @click="topMusic = option.value"
          >
            <div class="option-icon">
              <component :is="option.icon" />
            </div>
            <div class="option-label">{{ option.label }}</div>
          </div>
        </div>
      </div>

      <div class="form-section" v-if="topMusic !== 'recently_played'">
        <h3>Time period</h3>
        <div class="time-range-slider">
          <div class="time-labels">
            <span>4 weeks</span>
            <span>6 months</span>
            <span>All time</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="1" 
            v-model="timeRangeIndex"
            class="range-slider"
          >
        </div>
      </div>

      <div class="form-section">
        <h3>Number of results</h3>
        <div class="quantity-selector">
          <button 
            v-for="qty in [10, 20, 30, 50]" 
            :key="qty"
            type="button"
            class="quantity-btn"
            :class="{ active: quantity === qty.toString() }"
            @click="quantity = qty.toString()"
          >
            {{ qty }}
          </button>
        </div>
      </div>

      <button class="btn btn-primary show-button" @click.prevent="showChart">
        <span>Show results</span>
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Data type options with icons
const dataOptions = [
  {
    label: 'Artists',
    value: 'artists',
    icon: defineComponent({
      template: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
      </svg>`
    })
  },
  {
    label: 'Songs',
    value: 'tracks',
    icon: defineComponent({
      template: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" />
      </svg>`
    })
  },
  {
    label: 'Albums',
    value: 'albums',
    icon: defineComponent({
      template: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
      </svg>`
    })
  },
  {
    label: 'Recent',
    value: 'recently_played',
    icon: defineComponent({
      template: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
      </svg>`
    })
  }
];

const topMusic = ref('artists');
const quantity = ref('20');

// Handle time range with a slider
const timeRangeIndex = ref(0);
const timeRangeOptions = ['short_term', 'medium_term', 'long_term'];
const timeRange = computed(() => timeRangeOptions[timeRangeIndex.value]);

const emit = defineEmits(['chartData']);
const showChart = () => {
  if (!authStore.isLoggedIn) {
    console.error('User not logged in. Cannot fetch data.');
    return;
  }
  
  const dataToEmit = {
    dataTime: timeRange.value,
    dataTopMusic: topMusic.value,
    dataQuantity: parseInt(quantity.value, 10),
    dataType: topMusic.value,
  };
  
  console.log('MusicForm - Emitting data:', dataToEmit);
  emit('chartData', dataToEmit);
};

// Handle auth state changes
const handleAuthStateChange = (event) => {
  console.log('MusicForm - Auth state changed:', event.detail);
};

onMounted(() => {
  window.addEventListener('auth-state-changed', handleAuthStateChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('auth-state-changed', handleAuthStateChange);
});
</script>

<style scoped>
.music-form {
  max-width: 500px;
  margin: 15px auto;
  padding: var(--space-lg);
  background-color: var(--spotify-gray);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: var(--space-md);
  color: var(--spotify-white);
  text-align: center;
  background: linear-gradient(to right, var(--spotify-green), var(--spotify-green-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-section {
  margin-bottom: var(--space-lg);
}

.form-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--spotify-white);
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background-color: var(--spotify-dark-gray);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.option-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.option-card.active {
  border-color: var(--spotify-green);
  background-color: rgba(29, 185, 84, 0.1);
}

.option-icon {
  color: var(--spotify-light-gray);
  margin-bottom: var(--space-xs);
  transition: color 0.2s ease;
  transform: scale(0.9);
}

.option-card.active .option-icon {
  color: var(--spotify-green);
}

.option-label {
  font-size: 13px;
  font-weight: 500;
}

.time-range-slider {
  padding: 0 var(--space-sm);
}

.time-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
  font-size: 11px;
  color: var(--spotify-light-gray);
}

.range-slider {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: var(--spotify-dark-gray);
  border-radius: var(--radius-full);
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--spotify-green);
  cursor: pointer;
  transition: all 0.2s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: var(--spotify-green-light);
}

.quantity-selector {
  display: flex;
  justify-content: space-between;
  gap: var(--space-xs);
}

.quantity-btn {
  flex: 1;
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--spotify-dark-gray);
  color: var(--spotify-light-gray);
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.quantity-btn.active {
  background-color: var(--spotify-green);
  color: var(--spotify-white);
}

.show-button {
  width: 100%;
  margin-top: var(--space-md);
  padding: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .music-form {
    margin: 10px;
    padding: var(--space-md);
  }
  
  .option-grid {
    grid-template-columns: 1fr;
  }
}
</style>