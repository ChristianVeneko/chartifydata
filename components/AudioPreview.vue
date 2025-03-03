<template>
  <div class="audio-player">
    <button 
      class="play-pause-btn" 
      :class="{ 'playing': isPlaying }" 
      @click="togglePlay"
      :title="isPlaying ? 'Pause' : 'Play'"
    >
      <svg v-if="!isPlaying" viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
      </svg>
    </button>
    
    <div class="progress-container" @click="seek">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  previewUrl: {
    type: String,
    required: true
  }
});

const audio = ref(null);
const isPlaying = ref(false);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(30); // Spotify previews are typically 30 seconds

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const togglePlay = () => {
  if (!audio.value) return;
  
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  }
};

const seek = (event) => {
  if (!audio.value) return;
  
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const clickPositionRatio = offsetX / rect.width;
  
  audio.value.currentTime = clickPositionRatio * audio.value.duration;
};

const updateProgress = () => {
  if (!audio.value) return;
  
  currentTime.value = audio.value.currentTime;
  progress.value = (audio.value.currentTime / audio.value.duration) * 100;
};

const setupAudio = () => {
  audio.value = new Audio(props.previewUrl);
  
  audio.value.addEventListener('play', () => {
    isPlaying.value = true;
  });
  
  audio.value.addEventListener('pause', () => {
    isPlaying.value = false;
  });
  
  audio.value.addEventListener('ended', () => {
    isPlaying.value = false;
    audio.value.currentTime = 0;
    progress.value = 0;
    currentTime.value = 0;
  });
  
  audio.value.addEventListener('timeupdate', updateProgress);
  
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration;
  });
};

const cleanupAudio = () => {
  if (audio.value) {
    audio.value.pause();
    audio.value.removeEventListener('play', () => {});
    audio.value.removeEventListener('pause', () => {});
    audio.value.removeEventListener('ended', () => {});
    audio.value.removeEventListener('timeupdate', updateProgress);
    audio.value.removeEventListener('loadedmetadata', () => {});
    audio.value = null;
  }
};

watch(() => props.previewUrl, (newUrl) => {
  cleanupAudio();
  setupAudio();
});

onMounted(() => {
  setupAudio();
});

onBeforeUnmount(() => {
  cleanupAudio();
});
</script>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  height: 30px;
}

.play-pause-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--spotify-green);
  color: var(--spotify-black);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.play-pause-btn:hover {
  background-color: var(--spotify-green-light);
  transform: scale(1.05);
}

.play-pause-btn.playing {
  background-color: var(--spotify-white);
}

.progress-container {
  flex: 1;
  cursor: pointer;
}

.progress-bar {
  height: 4px;
  background-color: var(--spotify-dark-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background-color: var(--spotify-green);
  border-radius: var(--radius-full);
  transition: width 0.1s linear;
}

.time-display {
  font-size: 10px;
  color: var(--spotify-light-gray);
  text-align: right;
}
</style> 