<template>
  <a-layout class="layout-shell">
    <a-layout-sider width="208" :collapsed="collapsed" collapsible @collapse="collapsed = $event">
      <div class="logo">菜品后台</div>
      <SidebarNav :routes="menuRoutes" :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout>
      <HeaderBar :collapsed="collapsed" @toggle="collapsed = !collapsed" />
      <BreadcrumbNav />
      <a-layout-content class="content">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SidebarNav from './SidebarNav.vue';
import HeaderBar from './HeaderBar.vue';
import BreadcrumbNav from './BreadcrumbNav.vue';

const collapsed = ref(false);
const router = useRouter();

const menuRoutes = computed(() => {
  const admin = router.getRoutes().find((item) => item.name === 'admin');
  return admin?.children || [];
});
</script>

<style scoped lang="less">
.layout-shell {
  height: 100vh;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  letter-spacing: 2px;
}

.content {
  margin: 12px 16px;
  min-height: calc(100vh - 200px);
  background: #fff;
  padding: 16px;
}
</style>
