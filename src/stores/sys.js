import { ref } from 'vue';
import { defineStore } from 'pinia';
import pkgJson from '../../package.json';

export const useSysStore = defineStore('sys', () => {
  const initDarkMode = false;
  const version = pkgJson.version;
  const isDarkMode = ref(initDarkMode);
  let initStarList = {};
  try {
    initStarList = JSON.parse(localStorage.getItem('starList'));
  } catch (e) {
    console.error('initStarList Error parsing');
  }
  const starList = ref(initStarList);
  const defaultOrigin = ref(localStorage.getItem('defaultOrigin') || 'migu');
  const originList = [
    {
      value: 'kuwo',
      label: '酷我音乐'
    },
    {
      value: 'migu',
      label: '咪咕音乐'
    },
    {
      value: 'wangyi',
      label: '网易云'
    },
    {
      value: 'kugou',
      label: '酷狗音乐'
    }
  ];
  window.App.getIsDarkMode().then((val) => {
    setDarkMode(val);
  });
  function updateStar(value) {
    console.warn('updateStar', value.id);
    if (!Object.hasOwn(initStarList, value.id)) {
      initStarList[value.id] = value;
    } else {
      delete initStarList[value.id];
    }
    starList.value = initStarList;
    console.warn('updateStar', starList.value);
    localStorage.setItem('starList', JSON.stringify(starList.value));
  }
  function setDarkMode(value) {
    isDarkMode.value = value;
  }
  function setDefaultOrigin(value) {
    defaultOrigin.value = value;
    localStorage.setItem('defaultOrigin', value);
  }
  return { isDarkMode, defaultOrigin, updateStar, starList, setDefaultOrigin, version, originList, setDarkMode };
});
