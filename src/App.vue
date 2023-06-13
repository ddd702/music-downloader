<script setup>
import { ref, computed, h } from 'vue';

import { RouterLink, RouterView } from 'vue-router';
import { darkTheme, NIcon } from 'naive-ui';
import { InformationCircle, Settings, ListCircle } from '@vicons/ionicons5';
import TopBar from '@/components/TopBar.vue';
import { useSysStore } from '@/stores/sys';
import router from '@/router';

const sysStore = useSysStore();
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
  return () => h(NIcon, null, { default: () => h(icon) });
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
            name: 'AboutView'
          }
        },
        '关于'
      ),
    key: 'AboutView',
    icon: renderIcon(InformationCircle)
  }
];
const collapsed = ref(true);
const cacheRoutes = (() => {
  const output = [];
  router.getRoutes().map((item) => {
    if (item?.meta?.cache) {
      output.push(item.name);
    }
  });
  return output;
})();
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
        :width="150"
        show-trigger="arrow-circle"
        bordered
      >
        <TopBar />
        <n-menu :collapsed="collapsed" :collapsed-width="75" :collapsed-icon-size="30" :options="menuOptions" />
      </n-layout-sider>
      <n-layout-content content-style="height:100vh;over-flow-y:auto;">
        <TopBar hasBg />
        <main class="main-container">
          <!-- <header>
            <div class="wrapper">
              <n-button @click="openToolDev">打开devtool{{ sysStore.version }}</n-button>
              <n-button @click="themeToggle">主题toggle</n-button>
            </div>
          </header> -->
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
</style>
