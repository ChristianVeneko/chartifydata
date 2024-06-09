<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '~/utils/useAuth';
import { Music } from '~/utils/music';
import LoginForm from '~/components/LoginForm.vue';
import Header from '~/components/Header.vue';
import MusicForm from '~/components/MusicForm.vue';
import ResultsComponent from '~/components/ResultsComponent.vue';
import Loading from '~/components/Loading.vue';

const chartData = ref([]);
const dataType = ref('artists');
const music = ref(null);

const { isLoading, isLoggedIn, accessToken } = useAuth();
console.log(accessToken)

onMounted(() => {
  if (accessToken) {
    music.value = new Music(accessToken);
  }
});

const getChart = async (data) => {
  if (data.dataType === 'artists') {
    dataType.value = 'artist';
    const dataArtist = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
    chartData.value = music.value.createTopArtist(dataArtist);
  } else if (data.dataType === 'tracks') {
    dataType.value = 'song';
    const dataTracks = await music.value.getTopMusic(data.dataTime, data.dataQuantity, data.dataType);
    chartData.value = music.value.createTopSongs(dataTracks);
  } else {
    dataType.value = 'album';
    const dataAlbums = await music.value.getTopMusic(data.dataTime, data.dataQuantity, 'tracks');
    chartData.value = music.value.getTopAlbums(dataAlbums);
  }
};
</script>


<template>
  <div id="app">
    <Header />
    <div id="container">
      <div v-if="isLoading"><Loading /></div>
      <div v-else-if="isLoggedIn">
        <MusicForm @chartData="getChart" />
        <ResultsComponent :data="chartData" :type="dataType" />
      </div>
      <div v-else>
        <LoginForm v-if="!isLoggedIn" />
      </div>
    </div>
  </div>
</template>