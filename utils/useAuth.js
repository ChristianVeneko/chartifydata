import { ref, onMounted } from 'vue';

export function useAuth() {
  const isLoading = ref(true);
  const isLoggedIn = ref(false);
  const accessToken = ref(null);

  const validateAccessToken = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.json())
      return response.ok;
    } catch (error) {
      console.error('Error al validar el token de acceso:', error);
      return false;
    }
  }

  const checkAccessToken = async () => {
    isLoading.value = true;

    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedAccessToken) {
      const isTokenValid = await validateAccessToken(storedAccessToken);

      if (isTokenValid) {
        console.log('ta bueno el token')
        isLoggedIn.value = true;
        accessToken.value = storedAccessToken;
      } else {
        isLoggedIn.value = false;
      }
    } else {
      isLoggedIn.value = false;
    }

    isLoading.value = false;
  }

  onMounted(() => {
    checkAccessToken();
  });

  return { isLoading, isLoggedIn, accessToken };
}
