<script setup>
import { ref } from 'vue';
import { useAuth } from '~/utils/useAuth';
import { Music } from '~/utils/music';

//components
import LoginForm from '~/components/LoginForm.vue';
import Header from '~/components/Header.vue';
import MusicForm from '~/components/MusicForm.vue';
import ResultsComponent from '~/components/ResultsComponent.vue';
import Loading from '~/components/Loading.vue';

const API_URL = import.meta.env.VITE_API_URL


const chartData = ref([]);
const dataType = ref('artists');
const music = ref(null);

const { isLoading, isLoggedIn, accessToken } = useAuth();

if(isLoading){
  music.value = new Music(accessToken);
}

const getChart = async (data) => {
  if (data.dataType === 'artists') {
    dataType.value = 'artist';
    const topArtists = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
    chartData.value = topArtists;
  } else {
    dataType.value = 'song';
    const topTracks = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
    console.log(topTracks)
    chartData.value = topTracks;
  }
};


const updateIsLoggedIn = (newValue) => {
  isLoggedIn.value = newValue;
  console.log(isLoading)
};

</script>

<template>
    <div id="app">
      <Header></Header>
      <div id="container">
        <div v-if="isLoading"><Loading/></div>
        <div v-else-if="isLoggedIn">
        <MusicForm @chartData="getChart"></MusicForm>
        <ResultsComponent :data="chartData" :type="dataType" />
        </div>
        <div v-else>
          <!-- Mostrar LoginForm solo cuando no se ha iniciado sesión -->
          <LoginForm v-if="!isLoggedIn" />
        </div>
      </div>
    </div>
</template>