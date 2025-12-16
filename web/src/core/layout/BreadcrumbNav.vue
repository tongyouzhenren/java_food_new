<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="item in crumbs" :key="item.path">
      {{ item.meta?.title || item.name }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const crumbs = computed(() => route.matched.filter((item) => item.meta?.title));
</script>

<style scoped lang="less">
.breadcrumb {
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
</style>
