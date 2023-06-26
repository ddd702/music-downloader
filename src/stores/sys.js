import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import pkgJson from '../../package.json';

export const useSysStore = defineStore('sys', () => {
  const initDarkMode = false;
  const version = pkgJson.version;
  const isDarkMode = ref(initDarkMode);
  let initStarList = {};
  let initHistoryList = [];
  try {
    initStarList = JSON.parse(localStorage.getItem('starList') || '{}');
  } catch (e) {
    console.error('initStarList Error parsing');
  }
  try {
    initHistoryList = JSON.parse(localStorage.getItem('historyList') || '[]');
  } catch (e) {
    console.error('initHistoryList Error parsing');
  }
  const starList = ref(initStarList);
  const starListArray = computed(() => {
    const output = [];
    Object.keys(starList.value).forEach((key) => {
      output.push(starList.value[key]);
    });
    return output.reverse();
  });
  const historyList = ref(initHistoryList);
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
  //updateStar();
  function updateHistory(value) {
    if (value) {
      value.timeStamp = Date.now();
      value.plat = defaultOrigin.value;
      value.folder = downloadPath.value;
      initHistoryList = [value].concat(initHistoryList);
      if (initHistoryList.length > 1000) {
        //最多保存1000个数据，多了就删掉
        initHistoryList.splice(1000);
      }
      historyList.value = JSON.parse(JSON.stringify(initHistoryList));
    } else {
      initHistoryList = [];
      historyList.value = [];
    }
    localStorage.setItem('historyList', JSON.stringify(historyList.value));
  }
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
    updateHistory,
    historyList,
    starList,
    starListArray, //序列化后的列表
    setDefaultOrigin,
    version,
    originList,
    setDarkMode
  };
});
