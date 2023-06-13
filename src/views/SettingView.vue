<template>
  <section class="main-page">
    <div class="setting-item">
      <n-button strong secondary @click="themeToggle">
        <n-icon size="20">
          <Moon v-if="!sysStore.isDarkMode" />
          <Sunny v-else />
        </n-icon>
        <span>切换至{{ sysStore.isDarkMode ? '浅色主题' : '深色主题' }}</span>
      </n-button>
    </div>
    <div class="setting-item">
      <n-button strong secondary @click="openDevTool">
        <n-icon size="20">
          <Bug />
        </n-icon>
        <span>打开devtool</span>
      </n-button>
    </div>
  </section>
</template>
<script setup>
import { Moon, Sunny, Bug } from '@vicons/ionicons5';
import { useSysStore } from '@/stores/sys';
const sysStore = useSysStore();
const themeToggle = async () => {
  const isDarkMode = await window.App.toggleThemeMode();
  sysStore.setDarkMode(isDarkMode);
};
const openDevTool = () => {
  window.App.openDevTool();
};
</script>
<style scoped lang="scss">
.setting-item {
  display: flex;
  align-items: center;
  margin: 1em 0;
}
</style>
