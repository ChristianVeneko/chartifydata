<template>
  <header class="header">
    <div class="header-container">
      <div class="logo-container">
        <NuxtLink to="/" class="logo-link">
          <div class="logo">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
            </svg>
            <span class="logo-text">Chartify<span class="highlight">data</span></span>
          </div>
        </NuxtLink>
        <div class="tagline">Visualize your Spotify statistics</div>
      </div>
      
      <nav class="nav-menu">
        <ul class="nav-list">
          <li v-if="!authStore.isLoggedIn" class="nav-item">
            <a :href="loginUrl" class="nav-link login-btn">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
              </svg>
              <span>Login</span>
            </a>
          </li>
          <li v-else class="nav-item user-profile">
            <div class="user-info" @click="toggleUserMenu">
              <div v-if="authStore.userProfile && authStore.isLoggedIn" class="user-avatar">
                <img 
                  v-if="authStore.userProfile.images && authStore.userProfile.images.length > 0" 
                  :src="authStore.userProfile.images[0].url" 
                  :alt="authStore.userProfile.display_name"
                />
                <div v-else class="avatar-placeholder">
                  {{ authStore.userProfile.display_name ? authStore.userProfile.display_name.charAt(0).toUpperCase() : 'U' }}
                </div>
              </div>
              <span class="user-name">{{ authStore.userProfile && authStore.isLoggedIn ? authStore.userProfile.display_name : 'Please login' }}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" class="dropdown-icon">
                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
              </svg>
            </div>
            
            <div v-if="showUserMenu" class="user-dropdown">
              <a href="#" class="dropdown-item" @click.prevent="logout">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                </svg>
                <span>Logout</span>
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const showUserMenu = ref(false);
const loginUrl = '/api/login';

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = (event) => {
  if (showUserMenu.value && !event.target.closest('.user-profile')) {
    showUserMenu.value = false;
  }
};

const logout = () => {
  authStore.logout();
  showUserMenu.value = false;
  router.push('/');
};

// Actualización reactiva al cambio de estado de autenticación
watch(() => authStore.isLoggedIn, (newValue) => {
  console.log('Auth state changed in Header:', newValue);
}, { immediate: true });

onMounted(() => {
  window.addEventListener('click', closeUserMenu);
  
  // Verificar autenticación al montar el componente
  authStore.checkAccessToken();
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeUserMenu);
});
</script>

<style scoped>
.header {
  background-color: var(--spotify-black);
  border-bottom: 1px solid var(--spotify-dark-gray);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md) var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  flex-direction: column;
}

.logo-link {
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  color: var(--spotify-white);
  gap: var(--space-sm);
}

.logo svg {
  color: var(--spotify-green);
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.highlight {
  color: var(--spotify-green);
}

.tagline {
  font-size: 12px;
  color: var(--spotify-light-gray);
  margin-top: var(--space-xs);
  margin-left: var(--space-md);
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: var(--space-md);
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--spotify-light-gray);
  text-decoration: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover, .nav-link.active {
  color: var(--spotify-white);
  background-color: rgba(255, 255, 255, 0.1);
}

.login-btn {
  background-color: var(--spotify-green);
  color: var(--spotify-black) !important;
  font-weight: 600;
}

.login-btn:hover {
  background-color: var(--spotify-green-light) !important;
  transform: translateY(-2px);
}

.user-profile {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--spotify-dark-gray);
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--spotify-green);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: var(--spotify-black);
  font-weight: 700;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--spotify-white);
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  color: var(--spotify-light-gray);
  transition: transform 0.2s ease;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-xs);
  background-color: var(--spotify-gray);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 180px;
  z-index: 10;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  color: var(--spotify-white);
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .header-container {
    padding: var(--space-sm);
  }
  
  .tagline {
    display: none;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-link {
    padding: var(--space-sm);
  }
  
  .user-name {
    max-width: 80px;
  }
}
</style>