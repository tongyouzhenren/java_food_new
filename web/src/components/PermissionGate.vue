<template>
  <div v-if="allow">
    <slot />
  </div>
  <div v-else class="permission-fallback">
    <slot name="fallback">
      <a-alert type="warning" :show-icon="true" message="当前角色无法访问该内容" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissionStore } from '/@/store/modules/permission';

const props = defineProps<{
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
}>();

const permissionStore = usePermissionStore();

const allow = computed(() => {
  const rolePass = permissionStore.hasAnyRole(props.roles);
  const permissionPass = props.requireAll
    ? (props.permissions || []).every((permission) => permissionStore.can(permission))
    : permissionStore.canAny(props.permissions);
  return rolePass && permissionPass;
});
</script>

<style scoped lang="less">
.permission-fallback {
  margin: 12px 0;
}
</style>
