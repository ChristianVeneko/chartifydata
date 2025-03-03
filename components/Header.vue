<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7C9.24,7 7,9.24 7,12C7,14.76 9.24,17 12,17C14.76,17 17,14.76 17,12C17,9.24 14.76,7 12,7M12,9C13.66,9 15,10.34 15,12C15,13.66 13.66,15 12,15C10.34,15 9,13.66 9,12C9,10.34 10.34,9 12,9Z" />
          </svg>
        </div>
        <h1>Chartifydata</h1>
      </div>
      
      <div class="user-info" v-if="username">
        <div class="user-avatar">
          <span>{{ username.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="user-details">
          <span class="username">{{ username }}</span>
          <button class="logout-button" @click="$emit('logout')">
            <span>Cerrar sesión</span>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  username: {
    type: String,
    default: null
  }
});

defineEmits(['logout']);
</script>

<style scoped>
.app-header {
  background: linear-gradient(to right, #121212, #1e1e1e);
  color: white;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #1db954;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(to right, #1db954, #1ed760);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 5px 10px 5px 5px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1db954, #1ed760);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: white;
  box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.logout-button {
  background-color: transparent;
  border: none;
  color: #b3b3b3;
  padding: 0;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.logout-button:hover {
  color: #1db954;
}

@media (max-width: 600px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .user-info {
    width: 100%;
    justify-content: center;
    padding: 8px 15px;
  }
  
  .user-details {
    align-items: center;
  }
}
</style>