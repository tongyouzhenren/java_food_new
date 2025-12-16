<template>
  <a-config-provider :locale="zhCN">
    <div class="app-shell">
      <header class="app-header">
        <a-button
          class="theme-toggle"
          type="default"
          size="small"
          @click="toggleTheme"
        >
          <template #icon>
            <span aria-hidden="true">{{ isDark ? '🌙' : '☀️' }}</span>
          </template>
          <span class="theme-toggle__label">
            {{ isDark ? '深色模式' : '浅色模式' }}
          </span>
        </a-button>
      </header>

      <main class="app-content">
        <router-view v-slot="{ Component, route }">
          <LayoutShell v-if="route.meta?.layout === 'admin'">
            <component :is="Component" />
          </LayoutShell>
          <component v-else :is="Component" />
        </router-view>
      </main>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import LayoutShell from '/@/core/layout/LayoutShell.vue';

import { useThemeProvider } from '/@/core/ThemeProvider';
import '/@/styles/tokens.scss';

const { mode, toggleTheme } = useThemeProvider();
const isDark = computed(() => mode.value === 'dark');
</script>

<style scoped>
#app {
  min-height: 100vh;
}

.theme-toggle {
  background: var(--color-surface-muted);
  border-color: var(--color-border);
  color: var(--color-text);
  border-radius: var(--radius-sm);
}

.theme-toggle:hover,
.theme-toggle:focus {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.theme-toggle__label {
  font-weight: 600;
}
</style>

