<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const error = ref(null);
const isProcessing = ref(true);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  const expiresIn = urlParams.get('expires_in');
  const errorParam = urlParams.get('error');

  if (errorParam) {
    error.value = errorParam;
    isProcessing.value = false;
    setTimeout(() => {
      router.push('/');
    }, 3000);
    return;
  }

  if (accessToken && refreshToken) {
    // Guardar tokens en localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Calcular y guardar tiempo de expiración
    if (expiresIn) {
      const expiresAt = Date.now() + (parseInt(expiresIn, 10) * 1000);
      localStorage.setItem('expiresAt', expiresAt.toString());
    }
    
    // Redirigir a la página principal
    router.push('/');
  } else {
    error.value = 'No se encontraron los tokens en la URL de redirección';
    isProcessing.value = false;
    
    // Redirigir después de mostrar el error
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }
});
</script>

<template>
  <div class="auth-container">
    <div v-if="isProcessing" class="auth-message">
      <h1>Procesando autenticación...</h1>
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="error" class="auth-error">
      <h1>Error de autenticación</h1>
      <p>{{ error }}</p>
      <p>Redirigiendo a la página principal...</p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
  color: white;
  text-align: center;
}

.auth-message, .auth-error {
  background-color: #282828;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.auth-error {
  border-left: 4px solid #e74c3c;
}

.loading-spinner {
  margin: 20px auto;
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #1db954;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>