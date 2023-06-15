<template>
  <div class="main-page" id="aboutPage">
    <h3>当前版本：{{ version }}</h3>
    <v-md-preview :text="text"></v-md-preview>
  </div>
</template>
<script setup>
import { onMounted, nextTick } from 'vue';
import readme from '../../README.md?raw';
import pkgJson from '../../package.json';
const version = pkgJson.version;
const text = `${readme}`;
onMounted(async () => {
  await nextTick();
  const allLinks = document.querySelectorAll('#aboutPage a[href]');
  allLinks.forEach((item) => {
    item.addEventListener('click', (e) => {
      const url = item.getAttribute('href');
      // console.warn('url',e,url);
      e.preventDefault();
      window.App.openLink(url);
    });
  });
});
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
