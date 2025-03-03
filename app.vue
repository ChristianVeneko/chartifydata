<template>
  <div class="app-container">
    <Header />
    <main>
      <NuxtPage />
    </main>
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Chartifydata. Developed with <span class="heart">❤</span> for music lovers.</p>
        <p class="disclaimer">We are not related to Spotify AB or any of its partners in any way</p>
        <div class="footer-links">
          <NuxtLink to="/privacy" class="footer-link">Privacy Notice</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
import { onMounted } from 'vue';
import { useHead } from 'nuxt/app';

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
    { name: 'description', content: 'Chartify - Analiza tus datos de Spotify' },
    { charset: 'utf-8' }
  ],
  title: 'Chartify - Tu análisis musical',
  htmlAttrs: {
    lang: 'es'
  }
});

onMounted(() => {
  if (process.client) {
    // Función para detectar elementos que causan overflow
    function findCulprits() {
      const docWidth = document.documentElement.offsetWidth;
      const elements = document.querySelectorAll('*');
      
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.offsetWidth > docWidth) {
          console.log('Elemento con overflow:', el, `Ancho: ${el.offsetWidth}px, Doc ancho: ${docWidth}px`);
        }
      }
    }
    
    // Ejecutar después de que la página cargue completamente
    setTimeout(findCulprits, 1000);
  }
});
</script>

<style>
.footer {
  background-color: var(--spotify-black);
  border-top: 1px solid var(--spotify-dark-gray);
  padding: var(--space-lg) 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--spotify-light-gray);
  margin-top: var(--space-2xl);
}

.footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.heart {
  color: var(--spotify-error);
}

.disclaimer {
  margin-top: var(--space-sm);
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

.footer-links {
  margin-top: var(--space-md);
}

.footer-link {
  color: var(--spotify-green);
  text-decoration: none;
  transition: color var(--transition-normal);
  font-size: var(--font-size-sm);
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--spotify-green);
  border-radius: var(--radius-md);
  display: inline-block;
}

.footer-link:hover {
  color: var(--spotify-black);
  background-color: var(--spotify-green);
  text-decoration: none;
}

.app-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

