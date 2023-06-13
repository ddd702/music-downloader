<script setup>
defineProps({
  hasBg: {
    type: Boolean,
    value: false
  }
});
</script>
<template>
  <header class="top-bar" :class="{ bg: hasBg }"></header>
</template>

<style scoped lang="scss">
.bg {
  background-color: var(--n-color);
}
.top-bar {
  z-index: 100;
  width: 100%;
  cursor: move;
  height: 40px;
  position: sticky;
  top: 0;
  left: 0;
  -webkit-app-region: drag;
}
</style>
