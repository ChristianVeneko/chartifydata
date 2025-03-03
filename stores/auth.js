import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
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

  // Función para validar un token de acceso
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

  // Función para refrescar el token
  const getRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      if (!refreshToken) {
        console.error('No refresh token available');
        return false;
      }

      const res = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error refreshing token:', errorData.error || res.statusText);
        console.error('Error details:', errorData);
        return false;
      }
      
      const data = await res.json();

      if (data.access_token) {
        // Actualizar el token en el estado y localStorage
        accessToken.value = data.access_token;
        localStorage.setItem('spotify_access_token', data.access_token);
        
        // Actualizar el tiempo de expiración si está disponible
        if (data.expires_in) {
          const expiresAt = Date.now() + (data.expires_in * 1000);
          tokenExpiresAt.value = expiresAt;
          localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
        }
        
        return data.access_token;
      }
      
      return false;
    } catch (error) {
      console.error('Error in getRefreshToken:', error);
      return false;
    }
  };

  // Función para verificar y validar el token de acceso
  const checkAccessToken = async () => {
    isLoading.value = true;

    try {
      const storedAccessToken = localStorage.getItem('spotify_access_token');
      const storedExpiresAt = localStorage.getItem('spotify_token_expires_at');
      
      if (storedExpiresAt) {
        tokenExpiresAt.value = parseInt(storedExpiresAt, 10);
      }

      if (storedAccessToken) {
        // Si el token está próximo a expirar, refrescarlo directamente
        if (isTokenExpiringSoon.value) {
          console.log('Token próximo a expirar, refrescando...');
          const newAccessToken = await getRefreshToken();
          
          if (newAccessToken) {
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
      // Emitir evento personalizado después de actualizar el estado de autenticación
      if (process.client) {
        window.dispatchEvent(new CustomEvent('auth-state-changed', { 
          detail: { isLoggedIn: isLoggedIn.value }
        }));
      }
    }
  };

  // Función para limpiar datos de autenticación
  const clearAuthData = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires_at');
    accessToken.value = null;
    userProfile.value = null;
    tokenExpiresAt.value = null;
    isLoggedIn.value = false;
  };

  // Función para cerrar sesión
  const logout = () => {
    clearAuthData();
    
    // Emitir evento personalizado después de cerrar sesión
    if (process.client) {
      window.dispatchEvent(new CustomEvent('auth-state-changed', { 
        detail: { isLoggedIn: false }
      }));
    }
    
    console.log('Logout completed, authentication state reset');
  };

  // Inicializar el estado al cargar la página
  if (process.client) {
    checkAccessToken();

    // Suscripción a eventos de almacenamiento para sincronizar estados en diferentes pestañas
    window.addEventListener('storage', (event) => {
      if (event.key === 'spotify_access_token' || event.key === 'spotify_token_expires_at') {
        checkAccessToken();
      }
    });
  }

  return { 
    isLoading, 
    isLoggedIn, 
    accessToken, 
    userProfile,
    tokenExpiresIn,
    isTokenExpiringSoon,
    logout,
    checkAccessToken,
    getRefreshToken
  };
}); 