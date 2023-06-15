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
    <div class="setting-item" style="flex-direction: column; align-items: start">
      <n-button strong secondary @click="sysStore.setDownloadPath">
        <n-icon size="20">
          <FileTray />
        </n-icon>
        <span>设置下载目录</span>
      </n-button>
      <p>
        <n-space>
          当前地址为：{{ sysStore.downloadPath }}
          <span style="cursor: pointer" title="复制路径" @click="() => clipboard(sysStore.downloadPath)">
            <n-icon size="20"><CopyOutline /></n-icon>
          </span>
          <span style="cursor: pointer" title="打开文件夹" @click="() => sysStore.openPath(sysStore.downloadPath)">
            <n-icon size="20">
              <FolderOpenOutline />
            </n-icon>
          </span>
        </n-space>
      </p>
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
import { Moon, Sunny, Bug, FileTray, CopyOutline, FolderOpenOutline } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { useSysStore } from '@/stores/sys';

const $message = useMessage();
const sysStore = useSysStore();
const themeToggle = async () => {
  const isDarkMode = await window.App.toggleThemeMode();
  sysStore.setDarkMode(isDarkMode);
};
const openDevTool = () => {
  window.App.openDevTool();
};
const clipboard = async (text) => {
  await window.App.clipboard({ text });
  $message.success('已复制');
};
</script>
<style scoped lang="scss">
.setting-item {
  display: flex;
  align-items: center;
  margin: 1em 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}
</style>
