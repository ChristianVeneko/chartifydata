import { ref, onMounted } from 'vue';

export async function getRefreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const res = await fetch(`/api/refresh?refresh_token=${refreshToken}`);
  const data = await res.json();

  if (data.access_token) return data.access_token;
  return false;
}

export function useAuth() {
  const isLoading = ref(true);
  const isLoggedIn = ref(false);
  const accessToken = ref(null);

  const validateAccessToken = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error al validar el token de acceso:', error);
      return false;
    }
  };

  const checkAccessToken = async () => {
    isLoading.value = true;

    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedAccessToken) {
      const isTokenValid = await validateAccessToken(storedAccessToken);

      if (isTokenValid) {
        isLoggedIn.value = true;
        accessToken.value = storedAccessToken;
      } else {
        const newAccessToken = await getRefreshToken();
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          accessToken.value = newAccessToken;
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      }
    } else {
      isLoggedIn.value = false;
    }

    isLoading.value = false;
  };

  onMounted(() => {
    checkAccessToken();
  });
  return { isLoading, isLoggedIn, accessToken };
}
