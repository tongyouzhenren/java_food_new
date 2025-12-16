<template>
  <a-card size="small" title="导航信息" class="meta-card">
    <p><strong>标题：</strong>{{ route.meta.title }}</p>
    <p><strong>权限：</strong>{{ (route.meta.permission as string[])?.join(', ') || '无' }}</p>
    <p><strong>面包屑：</strong>{{ breadcrumbTitles.join(' / ') }}</p>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbTitles = computed(() =>
  route.matched
    .filter((item) => item.meta?.title)
    .map((item) => item.meta?.title as string),
);
</script>

<style scoped lang="less">
.meta-card {
  margin-bottom: 16px;
}
</style>
