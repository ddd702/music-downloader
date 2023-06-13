<script setup>
import { Search } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { computed, reactive, ref } from 'vue';
import ResItem from '../components/ResItem.vue';
import { useSysStore } from '@/stores/sys';

const sysStore = useSysStore();
const loading = ref(false);
const $message = useMessage();
const result = ref({ args: {}, list: [], total: 0 });
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
};
const onSearch = async () => {
  if (!form.keyword) {
    return $message.warning('请输入关键字');
  }
  if (form.keyword === result.value.args.keyword) {
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
</script>

<template>
  <main class="page">
    <header class="search-header">
      <n-form>
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
      </n-form>
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
          <ResItem v-for="(item, index) in result.list" :key="index" :item="item" />
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
  color: blue;
  margin: 10px 0;
}
</style>
