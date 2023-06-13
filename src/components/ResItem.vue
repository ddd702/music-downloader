<script setup>
import { CloudDownload, StarOutline, Star, Headset } from '@vicons/ionicons5';
import { useSysStore } from '@/stores/sys';
import { defineEmits } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['play', 'download']);
const sysStore = useSysStore();
const toggleStar = (item) => {
  sysStore.updateStar(item);
};
const onPlay = () => {
  // console.warn('props', props.item);
  emit('play', props.item);
};
const onDownload = () => {
  window.App.downloadSong({
    url: props.item.url,
    name: props.item.name
  });
  emit('download', props.item);
};
</script>
<template>
  <section class="result-item">
    <template v-if="item.url">
      <n-icon @click="onDownload" style="cursor: pointer" size="20"><CloudDownload /></n-icon>
      <n-icon @click="onPlay" style="cursor: pointer; margin: 0 10px" size="20"><Headset /></n-icon>
    </template>
    <n-icon style="cursor: pointer; margin: 0 10px" size="20" @click="toggleStar(item)">
      <Star v-if="item.starred" />
      <StarOutline v-else />
    </n-icon>
    <n-image width="100" :src="item.cover" />
    <p :title="item.name" class="song-name">
      {{ item.name }}
    </p>
  </section>
</template>
<style lang="scss" scoped>
.result-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 5px 0;
  border-bottom: 1px solid #efefef;
}
.song-name {
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  max-width: 500px;
  color: #f70;
  margin: 0 0 0 10px;
  line-height: 1.5;
  overflow: hidden;
}
</style>
