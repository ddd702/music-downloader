<script setup>
import { ref, computed, h } from 'vue';

import { RouterLink, RouterView } from 'vue-router';
import { darkTheme, NIcon } from 'naive-ui';
import { InformationCircle, Settings, ListCircle, TimeSharp } from '@vicons/ionicons5';
import TopBar from '@/components/TopBar.vue';
import { useSysStore } from '@/stores/sys';
import { usePlayerStore } from '@/stores/player';
import router from '@/router';
import AudioPlayer from 'vue3-audio-player';
import 'vue3-audio-player/dist/style.css';

const sysStore = useSysStore();
const playerStore = usePlayerStore();
const theme = computed(() => {
  return sysStore.isDarkMode ? darkTheme : null;
});
const themeOverrides = {
  common: { fontWeightStrong: '600', primaryColor: '#377df7' }
  // Input: {
  //   borderRadius: '20px'
  // }
};
const renderIcon = (icon) => {
  return () => h(NIcon, { size: 25 }, { default: () => h(icon) });
};
const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'HomeView'
          }
        },
        '首页'
      ),
    key: 'HomeView',
    icon: renderIcon(ListCircle)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'SettingView'
          }
        },
        '设置'
      ),
    key: 'SettingView',
    icon: renderIcon(Settings)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'HistoryView'
          }
        },
        '历史'
      ),
    key: 'HistoryView',
    icon: renderIcon(TimeSharp)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'AboutView'
          }
        },
        '关于'
      ),
    key: 'AboutView',
    icon: renderIcon(InformationCircle)
  }
];
const collapsed = ref(false);
const $player = ref(null);
const cacheRoutes = (() => {
  const output = [];
  router.getRoutes().map((item) => {
    if (item?.meta?.cache) {
      output.push(item.name);
    }
  });
  return output;
})();
playerStore.$subscribe(
  (mutation) => {
    $player.value.play();
    if (mutation.type === 'direct') {
      $player.value.play();
    }
  },
  { detached: false }
);
</script>

<template>
  <n-config-provider inline-theme-disabled :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-layout has-sider>
      <n-layout-sider
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false"
        collapse-mode="width"
        :collapsed-width="75"
        :width="170"
        bordered
      >
        <TopBar />
        <n-menu :collapsed="collapsed" :collapsed-width="75" :collapsed-icon-size="30" :options="menuOptions" />
        <AudioPlayer ref="$player" :option="playerStore.playerOpts" />
      </n-layout-sider>
      <n-layout-content content-style="height:100vh;over-flow-y:auto;">
        <TopBar hasBg />
        <main class="main-container">
          <n-message-provider>
            <RouterView v-slot="{ Component }">
              <KeepAlive :include="cacheRoutes">
                <component :is="Component" />
              </KeepAlive>
            </RouterView>
          </n-message-provider>
        </main>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>
<style lang="scss"></style>
<style>
#app {
  height: 100vh;
  width: 100vw;
}
.audio__player-title {
  color: var(--n-text-color) !important;
}
.audio__player-play {
  text-align: center !important;
}
.audio__player-play-icon {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>
