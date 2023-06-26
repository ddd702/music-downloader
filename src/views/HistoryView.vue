<template>
  <div class="main-page">
    <n-button type="error" round @click="() => sysStore.updateHistory()">清空</n-button>
    <p>共有数据{{ sysStore.historyList.length }}条(最多保存1000条)</p>
    <n-data-table size="small" :columns="columns" :data="sysStore.historyList" :pagination="false" :bordered="false" />
  </div>
</template>
<script setup>
import { useSysStore } from '../stores/sys';
import { h } from 'vue';
import { NTag } from 'naive-ui';
import dayjs from 'dayjs';

const sysStore = useSysStore();
const columns = [
  {
    title: 'NO',
    key: 'no',
    render(row, index) {
      return h(
        'span',
        {},
        {
          default: () => index + 1
        }
      );
    }
  },
  {
    title: '时间',
    key: 'time',
    render(row) {
      return h(
        NTag,
        {
          type: 'warning'
        },
        {
          default: () => dayjs(row.timeStamp).format('YYYY-MM-DD HH:mm:ss')
        }
      );
    }
  },
  {
    title: '来源',
    key: 'plat'
  },
  {
    title: 'Name',
    key: 'filename'
  },
  {
    title: '保存路径',
    key: 'folder'
  },
  {
    title: '下载状态',
    key: 'state',
    render(row) {
      return h(
        NTag,
        {
          type: row.state === 'completed' ? 'success' : 'error'
        },
        {
          default: () => (row.state === 'completed' ? '成功' : '失败')
        }
      );
    }
  }
];
</script>
<style></style>
