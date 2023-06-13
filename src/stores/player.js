import { reactive } from 'vue';
import { defineStore } from 'pinia';
export const usePlayerStore = defineStore('player', () => {
  const playerOpts = reactive({
    src: '',
    title: 'none',
    coverImage: ''
  });
  function setPlayer(options) {
    playerOpts.src = options.url;
    playerOpts.title = options.name;
    playerOpts.coverImage = options.cover;
  }
  return {
    playerOpts,
    setPlayer
  };
});
