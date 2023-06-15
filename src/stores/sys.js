import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import pkgJson from '../../package.json';

export const useSysStore = defineStore('sys', () => {
  const initDarkMode = false;
  const version = pkgJson.version;
  const isDarkMode = ref(initDarkMode);
  let initStarList = {};
  try {
    initStarList = JSON.parse(localStorage.getItem('starList') || '{}');
  } catch (e) {
    console.error('initStarList Error parsing');
  }
  const starList = ref(initStarList);
  const starListArray = computed(() => {
    const output = [];
    Object.keys(starList.value).forEach((key) => {
      output.push(starList.value[key]);
    });
    return output.reverse();
  });
  const downloadPath = ref('');
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
    if (value) {
      if (!Object.hasOwn(initStarList, value.id)) {
        initStarList[value.id] = value;
      } else {
        delete initStarList[value.id];
      }
    }
    starList.value = JSON.parse(JSON.stringify(initStarList));
    localStorage.setItem('starList', JSON.stringify(starList.value));
  }
  updateStar();
  function setDarkMode(value) {
    isDarkMode.value = value;
  }
  function setDefaultOrigin(value) {
    defaultOrigin.value = value;
    localStorage.setItem('defaultOrigin', value);
  }
  const setDownloadPath = async () => {
    const res = await window.App.setDownloadPath();
    downloadPath.value = res;
  };
  const getDownloadPath = async () => {
    const res = await window.App.getDownloadPath();
    downloadPath.value = res;
  };
  getDownloadPath();
  const openPath = (str) => {
    window.App.openPath(str);
  };
  return {
    isDarkMode,
    downloadPath,
    defaultOrigin,
    openPath,
    updateStar,
    getDownloadPath,
    setDownloadPath,
    starList,
    starListArray,
    setDefaultOrigin,
    version,
    originList,
    setDarkMode
  };
});
