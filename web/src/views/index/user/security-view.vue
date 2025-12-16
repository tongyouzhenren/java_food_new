<template>
  <div class="content-list">
    <div class="list-title">帐号安全</div>
    <div class="list-content">
      <PermissionGate :roles="['admin']">
        <a-alert type="success" message="管理员可配置高级安全策略" show-icon />
      </PermissionGate>

      <ConfigurableForm
        :schema="formSchema"
        v-model:modelValue="formState"
        :context="{ twoFactor: formState.twoFactor }"
        @submit="handleSubmit"
        @change="handleFormChange"
      >
        <template #footer="{ submit }">
          <a-space>
            <a-button v-permission-disabled="['profile:update']" @click="submit">保存</a-button>
            <a-button
              type="primary"
              v-permission="['account:password:update']"
              @click="submit"
            >提交修改</a-button>
          </a-space>
        </template>
      </ConfigurableForm>

      <div class="action-bar">
        <a-button type="dashed" v-permission-disabled="{ permissions: ['profile:2fa'] }" @click="toggleTwoFactor">
          {{ formState.twoFactor ? '关闭双因素认证' : '开启双因素认证' }}
        </a-button>
        <a-button danger v-permission="{ roles: ['admin'] }" @click="resetPassword">强制重置密码</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { ConfigurableForm, type FormSchema } from '/@/core/form';
import { usePermissionStore, useUserStore } from '/@/store';
import PermissionGate from '/@/components/PermissionGate.vue';
import { updateUserPwdApi } from '/@/api/user';

const userStore = useUserStore();
const permissionStore = usePermissionStore();

const formState = reactive({
  username: userStore.user_name || '未登录用户',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  mobile: '',
  twoFactor: false,
  twoFactorChannel: 'sms',
  adminNote: '',
});

const asyncMobileValidator = async (value: string) => {
  if (!value) return Promise.resolve();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (String(value).endsWith('000')) {
        reject(new Error('该手机号已被占用'));
      } else {
        resolve(null);
      }
    }, 500);
  });
};

const formSchema: FormSchema = {
  layout: 'vertical',
  fields: [
    {
      field: 'username',
      label: '用户名',
      component: 'input',
      required: true,
      disabled: () => true,
      description: '当前登录账号，默认为只读。',
    },
    {
      field: 'mobile',
      label: '绑定手机',
      component: 'input',
      placeholder: '请输入手机号',
      required: true,
      asyncValidator: asyncMobileValidator,
      description: '输入以000结尾的号码会触发异步校验错误。',
    },
    {
      field: 'twoFactor',
      label: '双因素认证',
      component: 'switch',
      permissions: ['profile:2fa'],
      description: '需要对应权限才能切换。',
    },
    {
      field: 'twoFactorChannel',
      label: '验证码渠道',
      component: 'select',
      options: [
        { label: '短信', value: 'sms' },
        { label: '邮箱', value: 'email' },
      ],
      visible: (model) => !!model.twoFactor,
      placeholder: '请选择验证码渠道',
    },
    {
      field: 'currentPassword',
      label: '当前密码',
      component: 'password',
      required: true,
      permissions: ['account:password:update'],
    },
    {
      field: 'newPassword',
      label: '新密码',
      component: 'password',
      required: true,
      permissions: ['account:password:update'],
      description: '请输入至少6位新密码。',
    },
    {
      field: 'confirmPassword',
      label: '确认新密码',
      component: 'password',
      required: true,
      permissions: ['account:password:update'],
      visible: (model) => !!model.newPassword,
      asyncValidator: async (_value, model) => {
        if (model.newPassword && model.newPassword !== model.confirmPassword) {
          throw new Error('两次输入的密码不一致');
        }
      },
    },
    {
      field: 'adminNote',
      label: '管理员备注',
      component: 'textarea',
      roles: ['admin'],
      placeholder: '仅管理员可见的备注信息',
    },
  ],
};

const handleFormChange = ({ field, value }: { field: string; value: any }) => {
  if (field === 'twoFactor' && !value) {
    formState.twoFactorChannel = 'sms';
  }
};

const handleSubmit = async () => {
  try {
    await updateUserPwdApi({
      userId: userStore.user_id,
      password: formState.currentPassword,
      newPassword: formState.newPassword,
    });
    message.success('安全设置已更新');
  } catch (error: any) {
    message.error(error?.msg || '提交失败，请稍后重试');
  }
};

const toggleTwoFactor = () => {
  formState.twoFactor = !formState.twoFactor;
};

const resetPassword = () => {
  if (!permissionStore.can('account:password:update')) return;
  formState.currentPassword = '';
  formState.newPassword = '';
  formState.confirmPassword = '';
  message.info('已清空密码输入，请重新设置');
};
</script>

<style scoped lang="less">
.content-list {
  flex: 1;

  .list-title {
    color: #152844;
    font-weight: 600;
    font-size: 18px;
    height: 48px;
    margin-bottom: 4px;
    border-bottom: 1px solid #cedce4;
  }
}

.list-content {
  padding: 12px 0;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
</style>
