import { ref, onMounted, computed, onUnmounted } from 'vue';

export async function getRefreshToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    const res = await fetch(`/api/refresh?refresh_token=${refreshToken}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Error refreshing token:', errorData.statusMessage || res.statusText);
      return false;
    }
    
    const data = await res.json();

    if (data.access_token) {
      // Actualizar el tiempo de expiración si está disponible
      if (data.expires_in) {
        const expiresAt = Date.now() + (data.expires_in * 1000);
        localStorage.setItem('expiresAt', expiresAt.toString());
      }
      
      return data.access_token;
    }
    
    return false;
  } catch (error) {
    console.error('Error in getRefreshToken:', error);
    return false;
  }
}

export function useAuth() {
  const isLoading = ref(true);
  const isLoggedIn = ref(false);
  const accessToken = ref(null);
  const userProfile = ref(null);
  const tokenExpiresAt = ref(null);

  // Tiempo restante en segundos antes de que expire el token
  const tokenExpiresIn = computed(() => {
    if (!tokenExpiresAt.value) return 0;
    const timeLeft = Math.floor((tokenExpiresAt.value - Date.now()) / 1000);
    return timeLeft > 0 ? timeLeft : 0;
  });

  // Verificar si el token está próximo a expirar (menos de 5 minutos)
  const isTokenExpiringSoon = computed(() => {
    return tokenExpiresIn.value < 300; // 5 minutos en segundos
  });

  const validateAccessToken = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Guardar el perfil del usuario
        const profile = await response.json();
        userProfile.value = profile;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al validar el token de acceso:', error);
      return false;
    }
  };

  const checkAccessToken = async () => {
    isLoading.value = true;

    try {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedExpiresAt = localStorage.getItem('expiresAt');
      
      if (storedExpiresAt) {
        tokenExpiresAt.value = parseInt(storedExpiresAt, 10);
      }

      if (storedAccessToken) {
        // Si el token está próximo a expirar, refrescarlo directamente
        if (isTokenExpiringSoon.value) {
          console.log('Token próximo a expirar, refrescando...');
          const newAccessToken = await getRefreshToken();
          
          if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            accessToken.value = newAccessToken;
            isLoggedIn.value = true;
          } else {
            // Si no se pudo refrescar, intentar validar el token actual
            const isTokenValid = await validateAccessToken(storedAccessToken);
            isLoggedIn.value = isTokenValid;
            accessToken.value = isTokenValid ? storedAccessToken : null;
          }
        } else {
          // Si el token no está próximo a expirar, validarlo
          const isTokenValid = await validateAccessToken(storedAccessToken);
          
          if (isTokenValid) {
            isLoggedIn.value = true;
            accessToken.value = storedAccessToken;
          } else {
            // Si el token no es válido, intentar refrescarlo
            const newAccessToken = await getRefreshToken();
            
            if (newAccessToken) {
              localStorage.setItem('accessToken', newAccessToken);
              accessToken.value = newAccessToken;
              isLoggedIn.value = true;
            } else {
              isLoggedIn.value = false;
              accessToken.value = null;
              clearAuthData();
            }
          }
        }
      } else {
        isLoggedIn.value = false;
        accessToken.value = null;
      }
    } catch (error) {
      console.error('Error checking access token:', error);
      isLoggedIn.value = false;
      accessToken.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // Función para limpiar datos de autenticación
  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    accessToken.value = null;
    userProfile.value = null;
    tokenExpiresAt.value = null;
    isLoggedIn.value = false;
  };

  // Función para cerrar sesión
  const logout = () => {
    clearAuthData();
  };

  // Configurar un intervalo para verificar y refrescar el token automáticamente
  let tokenRefreshInterval;

  onMounted(() => {
    checkAccessToken();
    
    // Verificar el token cada minuto
    tokenRefreshInterval = setInterval(() => {
      if (isLoggedIn.value && isTokenExpiringSoon.value) {
        getRefreshToken().then(newToken => {
          if (newToken) {
            localStorage.setItem('accessToken', newToken);
            accessToken.value = newToken;
          }
        });
      }
    }, 60000); // Cada minuto
  });

  // Limpiar el intervalo cuando el componente se desmonta
  onUnmounted(() => {
    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval);
    }
  });

  return { 
    isLoading, 
    isLoggedIn, 
    accessToken, 
    userProfile,
    tokenExpiresIn,
    isTokenExpiringSoon,
    logout,
    checkAccessToken
  };
}
