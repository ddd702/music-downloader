<script setup>
import { Search, Beer, FolderOpen } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { computed, reactive, ref } from 'vue';
import ResItem from '../components/ResItem.vue';
import { useSysStore } from '@/stores/sys';
import { usePlayerStore } from '@/stores/player';
// import Utils from '@/utils';

const playerStore = usePlayerStore();

const sysStore = useSysStore();
const downloadStatus = reactive({
  percent: 0,
  completed: false
});
const loading = ref(false);
const downloadIng = ref(false);
const starListShow = ref(false);
const $message = useMessage();
const result = ref({ args: {}, list: [], total: 0, msg: '赶紧搜索试试🤔' });
const origin = ref(sysStore.defaultOrigin);
const form = reactive({
  keyword: '',
  pageNo: 1
});
const pageCount = computed(() => {
  return Math.ceil(result.value.total / 20);
});
const originChange = () => {
  sysStore.setDefaultOrigin(origin.value);
  if (form.keyword) {
    onSearch();
  }
};
const onSearch = async () => {
  if (!form.keyword) {
    return $message.warning('请输入关键字');
  }
  if (form.keyword === result.value.args.keyword && origin.value === result.value.args.origin) {
    return;
  }
  form.pageNo = 1;
  fetchData();
};
const fetchData = async () => {
  if (loading.value) {
    $message.info('当前请求未完成，请等待');
    return;
  }
  loading.value = true;
  try {
    const res = await window.App.searchSong({
      keyword: form.keyword || result.value.args.keyword,
      pageNo: form.pageNo,
      origin: origin.value
    });
    console.warn('res', res);
    result.value = res;
    form.pageNo = res.args.pageNo;
  } catch (error) {
    $message.error('发生了一点错误');
  }
  loading.value = false;
};
const onPlay = (item) => {
  // console.warn('onPlay', item);
  playerStore.setPlayer(item);
};
const onOpenStarList = () => {
  starListShow.value = true;
};
window.App.onDownloadProcess((event, res) => {
  console.warn('onDownloading', res);
  downloadStatus.percent = res.percent;
  downloadStatus.completed = res.done && res.state === 'completed';
  if (res.done) {
    setTimeout(() => {
      downloadIng.value = false;
    }, 1000);

    if (res.state === 'completed') {
      $message.success(`${res.filename}:下载成功!`);
    } else {
      $message.error(`${res.filename}:${res.msg || '下载失败!'}`);
    }
  }
});
const onDownload = (item) => {
  if (downloadIng.value) {
    return $message.warning('有其他下载任务进行中，请稍后再试');
  }
  downloadIng.value = true;
  downloadStatus.percent = 0;
  downloadStatus.completed = false;
  window.App.downloadSong({
    url: item.url,
    name: item.name,
    size: item.size
  });
};
</script>

<template>
  <main class="page">
    <header class="search-header">
      <!-- <n-form> -->
      <div class="form-box">
        <n-input
          @keyup.enter="onSearch"
          :loading="loading"
          v-model:value="form.keyword"
          size="large"
          clearable
          round
          placeholder="输入歌曲或者歌手"
        >
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
        <n-button style="margin-left: 10px" type="primary" size="large" @click="onSearch" round>搜索</n-button>
      </div>
      <!-- </n-form> -->
      <br />
      <n-space>
        <b>选择来源平台：</b>
        <n-radio-group @change="originChange" v-model:value="origin" name="radiogroup">
          <n-space>
            <n-radio v-for="item in sysStore.originList" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
        <div class="to-star" @click="onOpenStarList">
          <n-icon size="20"><FolderOpen /></n-icon><span>打开我的收藏</span>
        </div>
      </n-space>
      <div class="tip" v-if="result.total">
        关键词:<n-gradient-text type="warning"> {{ result.args.keyword }} </n-gradient-text>,共搜到歌曲:{{
          result.total
        }}首
      </div>
    </header>
    <section v-if="result.total" class="result-box">
      <n-spin :show="loading">
        <div class="result-list">
          <ResItem
            v-for="(item, index) in result.list"
            @download="onDownload"
            @play="onPlay"
            :key="item.id"
            :item="item"
          />
        </div>
      </n-spin>
      <section class="pagination">
        <n-pagination
          :disabled="loading"
          v-model:page="form.pageNo"
          :onUpdate:page="fetchData"
          :page-count="pageCount"
        />
      </section>
    </section>
    <section v-else class="result-empty">
      <n-icon color="gray" size="150">
        <Beer />
      </n-icon>
      <p>{{ result.msg || '暂无数据，搜索一下或试试其他的？' }}</p>
    </section>
    <n-modal v-model:show="starListShow">
      <n-card size="huge" style="width: 730px" title="我的收藏">
        <p>数量:{{ sysStore.starListArray.length }}</p>
        <n-spin :show="loading">
          <div class="result-list star-list">
            <ResItem
              v-for="(item, index) in sysStore.starListArray"
              @download="onDownload"
              @play="onPlay"
              :key="item.id"
              :item="item"
            />
          </div>
          <n-button round type="error" @click="starListShow = false">关闭</n-button>
        </n-spin>
      </n-card>
    </n-modal>
    <n-modal :mask-closable="false" v-model:show="downloadIng">
      <n-card style="width: 200px" title="下载中......" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-progress type="circle" :percentage="downloadStatus.percent" />
      </n-card>
    </n-modal>
  </main>
</template>
<style scoped lang="scss">
.result-box {
  padding: 15px;
}
.result-list {
  padding: 10px 20px 60px 20px;
}
.pagination {
  padding: 10px 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: var(--n-color);
  width: 100%;
  box-sizing: border-box;
}
.search-header {
  position: sticky;
  top: 20px;
  left: 0;
  z-index: 102;
  background-color: var(--n-color);
  box-shadow: rgba(251, 251, 251, 0.1) 0px 4px 6px -1px, rgba(16, 18, 22, 0.06) 0px 2px 4px -1px;
  padding: 10px 20px;
}
.tip {
  color: gray;
  margin: 10px 0;
}
.result-empty {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
}
.form-box {
  display: flex;
  align-items: center;
}
.to-star {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #36ad6a;
}
.star-list {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
