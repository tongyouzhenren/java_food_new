<template>
  <div class="not-found">
    <div class="not-found__content">
      <div class="not-found__code">404</div>
      <div class="not-found__title">页面不存在</div>
      <p class="not-found__desc">抱歉，您访问的页面不存在或已被移除。</p>
      <div class="not-found__actions">
        <a-button type="primary" shape="round" size="large" @click="goHome">返回首页</a-button>
        <a-button shape="round" size="large" @click="goBack">返回上一页</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goHome = () => {
  router.push({ path: '/' });
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="less">
.not-found {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc, #eef2ff);
  color: #1f2937;
}

.not-found__content {
  max-width: 520px;
  padding: 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 45px -18px rgba(15, 23, 42, 0.35);
  text-align: center;
}

.not-found__code {
  font-size: 64px;
  font-weight: 800;
  color: #4f46e5;
  letter-spacing: 6px;
}

.not-found__title {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 700;
}

.not-found__desc {
  margin: 12px auto 28px;
  max-width: 360px;
  color: #6b7280;
  line-height: 1.6;
}

.not-found__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
