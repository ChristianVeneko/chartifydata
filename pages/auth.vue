<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const emit = defineEmits(['updateIsLoggedIn']);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  
  if (accessToken && refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    emit('updateIsLoggedIn', true);
  } else {
    console.error('No se encontraron los tokens en la URL de redirección');
    emit('updateIsLoggedIn', false);
  }

  // Redirigir al usuario al inicio de la aplicación
  window.location.href = '/';
});
</script>