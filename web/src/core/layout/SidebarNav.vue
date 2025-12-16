<template>
  <a-menu
    :inline-collapsed="collapsed"
    theme="dark"
    mode="inline"
    :selectedKeys="selectedKeys"
    @click="handleMenuClick"
  >
    <template v-for="item in menuTree" :key="item.key">
      <a-sub-menu v-if="item.children && item.children.length" :key="item.key">
        <template #icon>
          <component :is="resolveIcon(item.icon)" />
        </template>
        <template #title>{{ item.title }}</template>
        <a-menu-item v-for="child in item.children" :key="child.key">
          <template #icon>
            <component :is="resolveIcon(child.icon)" />
          </template>
          {{ child.title }}
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item v-else :key="item.key">
        <template #icon>
          <component :is="resolveIcon(item.icon)" />
        </template>
        {{ item.title }}
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router';
import {
  AppstoreOutlined,
  BugOutlined,
  CommentOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  InfoCircleOutlined,
  NotificationOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
  AreaChartOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue';

interface MenuItem {
  key: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
}

const props = defineProps<{ routes: RouteRecordRaw[]; collapsed: boolean }>();
const router = useRouter();
const route = useRoute();
const selectedKeys = ref<string[]>([]);

const iconMap: Record<string, any> = {
  'dashboard': DashboardOutlined,
  'dollar': DollarOutlined,
  'database': DatabaseOutlined,
  'comment': CommentOutlined,
  'user': UserOutlined,
  'appstore': AppstoreOutlined,
  'tag': TagOutlined,
  'picture': PictureOutlined,
  'notification': NotificationOutlined,
  'file-search': FileSearchOutlined,
  'file-protect': FileProtectOutlined,
  'bug': BugOutlined,
  'info': InfoCircleOutlined,
  'team': TeamOutlined,
  'area-chart': AreaChartOutlined,
};

const resolveIcon = (icon?: string) => {
  if (!icon) return null;
  return iconMap[icon] || null;
};

const menuTree = computed<MenuItem[]>(() => {
  return props.routes
    .filter((item) => item.meta?.title)
    .map((item) => ({
      key: item.name as string,
      title: item.meta?.title as string,
      icon: item.meta?.icon as string,
      children: (item.children || [])
        .filter((child) => child.meta?.title)
        .map((child) => ({
          key: child.name as string,
          title: child.meta?.title as string,
          icon: child.meta?.icon as string,
        })),
    }));
});

const handleMenuClick = ({ key }: { key: string }) => {
  router.push({ name: key });
};

watch(
  () => route.name,
  (name) => {
    if (typeof name === 'string') {
      selectedKeys.value = [name];
    }
  },
  { immediate: true },
);
</script>
