<script setup>
import { ref } from 'vue';
import { CloudDownload, StarOutline, Star, Headset, DocumentText } from '@vicons/ionicons5';
import { useSysStore } from '@/stores/sys';
import Utils from '@/utils';

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['play', 'download']);
const sysStore = useSysStore();
const isStarred = ref(false);
const getIsStarred = () => {
  isStarred.value = Object.hasOwn(sysStore.starList, props.item.id);
};
getIsStarred();
const toggleStar = (item) => {
  sysStore.updateStar(item);
  setTimeout(getIsStarred, 200);
};
const onPlay = () => {
  // console.warn('props', props.item);
  emit('play', props.item);
};
const onDownload = () => {
  emit('download', {
    url: props.item.url,
    name: props.item.name,
    size: props.item.size
  });
  // emit('download', props.item);
};
const onDownloadLrc = () => {
  emit('download', {
    url: props.item.lrc,
    name: props.item.lrcName,
    size: 1024 * 5 //没有歌词文件大小，就默认为5k吧
  });
};
</script>
<template>
  <section class="result-item">
    <template v-if="item.url">
      <span style="cursor: pointer" title="下载歌曲"
        ><n-icon @click="onDownload" size="20"><CloudDownload /></n-icon
      ></span>
      <span v-if="item.lrc" style="cursor: pointer; margin-left: 10px" title="下载歌词"
        ><n-icon @click="onDownloadLrc" size="20"> <DocumentText /> </n-icon>
      </span>
      <span style="cursor: pointer; margin-left: 10px" title="试听">
        <n-icon @click="onPlay" style="cursor: pointer" size="20"><Headset /></n-icon>
      </span>
    </template>
    <span style="cursor: pointer; margin: 0 10px" title="收藏">
      <n-icon size="20" @click="toggleStar(item)">
        <Star v-if="isStarred" />
        <StarOutline v-else />
      </n-icon>
    </span>
    <n-image width="100" :src="item.cover" />
    <p :title="item.name" class="song-name">
      {{ item.name }}
    </p>
    <span>{{ Utils.byteConvert(item.size) }}</span>
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
  max-width: 320px;
  color: #f70;
  margin: 0 20px 0 10px;
  line-height: 1.5;
  overflow: hidden;
}
</style>
