<template>
  <div id="loginform">
    <div class="login-container">
      <h2 class="login-title">See your own charts</h2>
      <p class="login-text">
        Discover your top artists and songs on Spotify with this app. Select if
        you want to view your most listened to artists or tracks, and choose a
        time range - last 4 weeks, 6 months, or all-time. Connect your Spotify
        account to see your personalized music tastes displayed in a sleek,
        card-based interface with album covers and links to listen on Spotify.
      </p>
      <div class="button-container">
        <button class="login-btn" @click="initiateSpotifyLogin">
          <span>Log in with Spotify</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const initiateSpotifyLogin = () => {
  window.location.href = `${config.public.baseUrl}/api/login`;
};
</script>

<style>
#loginform {
  max-width: 500px;
  margin: 30px auto;
  padding: 30px;
  background-color: #282828;
  border-radius: 10px;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
}

.login-container {
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
}

.login-text {
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 30px;
}

.button-container {
  display: flex;
  justify-content: center;
}

.login-btn {
  background-color: #1ed760;
  color: #fff;
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #16a34a;
}

@media (max-width: 400px) {
  #loginform {
    padding: 20px;
    margin: 20px;
  }

  .login-title {
    font-size: 20px;
  }

  .login-text {
    font-size: 14px;
  }

  .login-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
