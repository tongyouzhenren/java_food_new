<template>
  <a-form
    ref="formRef"
    :model="formModel"
    :layout="schema.layout || 'vertical'"
    :label-col="schema.labelCol || { span: 6 }"
    :wrapper-col="schema.wrapperCol || { span: 18 }"
    :rules="formRules"
    @finish="handleFinish"
  >
    <template v-for="field in schema.fields" :key="field.field">
      <a-form-item
        v-if="isVisible(field)"
        :name="field.field"
        :label="field.label"
        :extra="field.description"
        :rules="formRules[field.field]"
      >
        <component
          :is="resolveComponent(field.component)"
          v-model:value="formModel[field.field]"
          v-bind="field.props"
          :placeholder="field.placeholder"
          :options="field.options"
          :disabled="isDisabled(field)"
          @change="(value:any) => handleFieldChange(field.field, value)"
        />
      </a-form-item>
    </template>
    <div class="form-footer">
      <slot name="footer" :submit="handleSubmit" :model="formModel" />
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, Rule } from 'ant-design-vue/es/form';
import type { FormSchema, FormField } from './types';
import { usePermissionStore } from '/@/store/modules/permission';

const props = defineProps<{
  schema: FormSchema;
  modelValue: Record<string, any>;
  context?: Record<string, any>;
}>();

const emit = defineEmits(['update:modelValue', 'change', 'submit']);

const formModel = reactive<Record<string, any>>({ ...props.modelValue });
const formRef = ref<FormInstance>();
const permissionStore = usePermissionStore();

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(formModel, val);
  },
  { deep: true },
);

const visibleCache = new Map<FormField, boolean>();
const disabledCache = new Map<FormField, boolean>();

const isVisible = (field: FormField) => {
  const cached = visibleCache.get(field);
  if (cached !== undefined) return cached;

  const allowed = permissionStore.canAccess({ roles: field.roles, permissions: field.permissions });
  const visible = field.visible ? field.visible(formModel, props.context) : true;
  const result = allowed && visible;
  visibleCache.set(field, result);
  return result;
};

const isDisabled = (field: FormField) => {
  const cached = disabledCache.get(field);
  if (cached !== undefined) return cached;
  const blockedByPermission = !permissionStore.canAccess({ roles: field.roles, permissions: field.permissions });
  const disabled = typeof field.disabled === 'function' ? field.disabled(formModel, props.context) : false;
  const result = blockedByPermission || disabled;
  disabledCache.set(field, result);
  return result;
};

watch(
  () => ({ ...formModel, ...props.context, permissions: permissionStore.grantedPermissions }),
  () => {
    visibleCache.clear();
    disabledCache.clear();
  },
  { deep: true },
);

const formRules = computed<Record<string, Rule[]>>(() => {
  const rules: Record<string, Rule[]> = {};
  props.schema.fields.forEach((field) => {
    const ruleList: Rule[] = [];
    if (field.required) {
      ruleList.push({ required: true, message: `${field.label}为必填项`, trigger: 'change' });
    }
    if (field.asyncValidator) {
      ruleList.push({
        async validator(_rule, value) {
          if (!isVisible(field)) return Promise.resolve();
          await field.asyncValidator?.(value, formModel);
          return Promise.resolve();
        },
        trigger: 'blur',
      });
    }
    if (ruleList.length) {
      rules[field.field] = ruleList;
    }
  });
  return rules;
});

const handleFieldChange = (field: string, value: any) => {
  emit('change', { field, value, model: formModel });
  emit('update:modelValue', { ...formModel, [field]: value });
};

const handleFinish = () => {
  emit('submit', { ...formModel });
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  handleFinish();
};

const resolveComponent = (component: string) => {
  const map: Record<string, any> = {
    input: 'a-input',
    password: 'a-input-password',
    textarea: 'a-textarea',
    select: 'a-select',
    switch: 'a-switch',
    number: 'a-input-number',
  };
  return map[component] || 'a-input';
};

defineExpose({
  submit: handleSubmit,
  validate: () => formRef.value?.validate(),
});
</script>

<style scoped lang="less">
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.is-permission-disabled {
  cursor: not-allowed;
}
</style>
