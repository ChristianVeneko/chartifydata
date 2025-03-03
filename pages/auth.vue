<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);
const error = ref(null);
const success = ref(false);

// Obtener parámetros de URL
const getQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  const expiresIn = urlParams.get('expires_in');
  const errorParam = urlParams.get('error');
  
  return { accessToken, refreshToken, expiresIn, errorParam };
};

onMounted(async () => {
  try {
    const { accessToken, refreshToken, expiresIn, errorParam } = getQueryParams();
    
    if (errorParam) {
      error.value = `Authentication error: ${errorParam}`;
      isLoading.value = false;
      return;
    }
    
    if (accessToken && refreshToken && expiresIn) {
      // Save tokens in localStorage
      localStorage.setItem('spotify_access_token', accessToken);
      localStorage.setItem('spotify_refresh_token', refreshToken);
      
      // Calculate expiration time (subtract 5 minutes for safety margin)
      const expiresInSec = parseInt(expiresIn, 10) - 300;
      const expiresAt = new Date().getTime() + expiresInSec * 1000;
      localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
      
      // Actualizar el store
      await authStore.checkAccessToken();
      
      isLoading.value = false;
      success.value = true;
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      error.value = 'Missing authentication parameters. Please try again.';
      isLoading.value = false;
    }
  } catch (err) {
    console.error('Authentication error:', err);
    isLoading.value = false;
    error.value = err.message || 'An error occurred during authentication. Please try again.';
  }
});
</script>

<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">
        <div v-if="isLoading" class="loader-container">
          <div class="loader"></div>
          <h2>Authenticating with Spotify...</h2>
          <p>Please wait while we complete the authentication process.</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <svg viewBox="0 0 24 24" width="60" height="60">
              <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
          </div>
          <h2>Authentication Failed</h2>
          <p>{{ error }}</p>
          <a href="/api/login" class="btn btn-primary retry-btn">Try Again</a>
          <NuxtLink to="/" class="btn btn-secondary home-btn">Back to Home</NuxtLink>
        </div>
        
        <div v-else-if="success" class="success-container">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" width="60" height="60">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
            </svg>
          </div>
          <h2>Authentication Successful!</h2>
          <p>You have successfully connected your Spotify account.</p>
          <p class="redirect-info">Redirecting to the app...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--spotify-black), var(--spotify-dark-gray));
}

.container {
  width: 100%;
  max-width: 500px;
  padding: var(--space-xl);
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.auth-card {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loader-container,
.error-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(29, 185, 84, 0.3);
  border-radius: 50%;
  border-top-color: var(--spotify-green);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  color: var(--spotify-error);
}

.success-icon {
  color: var(--spotify-green);
}

h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--space-lg);
  max-width: 400px;
}

.retry-btn,
.home-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>