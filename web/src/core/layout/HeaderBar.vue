<template>
  <div class="header-bar">
    <a-button type="text" @click="$emit('toggle')">
      <menu-unfold-outlined v-if="collapsed" />
      <menu-fold-outlined v-else />
    </a-button>
    <div class="title">
      <span class="title__name">{{ route.meta.title || '后台管理' }}</span>
      <a-tag color="processing" class="title__tag">{{ (route.meta.permission as string[])?.join(', ') || '访问' }}</a-tag>
    </div>
    <div class="spacer"></div>
    <div class="header-actions">
      <a-button size="small" @click="handlePreview">前台预览</a-button>
      <span class="user">管理员 [{{ adminName }}]</span>
      <a class="logout" @click="handleLogout">退出</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '/@/store/modules/user';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';

defineProps<{ collapsed: boolean }>();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const adminName = computed(() => userStore.admin_user_name || '未登录');

const handlePreview = () => {
  window.open('/', '_blank');
};

const handleLogout = () => {
  userStore.logout?.();
  router.replace('/adminLogin');
};
</script>

<style scoped lang="less">
.header-bar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  height: 56px;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  font-weight: 600;
}

.title__name {
  font-weight: 600;
}

.title__tag {
  margin: 0;
}

.spacer {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user {
  color: #666;
}

.logout {
  color: #ff4d4f;
  cursor: pointer;
}
</style>
