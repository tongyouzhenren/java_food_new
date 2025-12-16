<template>
  <div class="user">

    <Header />

    <div class="user-content">
      <div class="user-content-left">
        <MineInfosView />
      </div>
      <div class="user-content-right">
        <router-view />
      </div>
    </div>

    <Footer />

  </div>
</template>
<script>
import Header from '/@/views/index/components/header.vue'
import Footer from '/@/views/index/components/footer.vue'
import MineInfosView from '/@/views/index/user/mine-infos-view.vue'

export default {
  components: {
    MineInfosView,
    Footer,
    Header
  },
  data () {
    return {
      collapsed: false
    }
  }
}
</script>
<style scoped lang="less">

.user {
  display: block;
}

.user-content {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-width: 0;
  margin: 60px 0 20px;
  padding: 0 12px;
  box-sizing: border-box;

  .user-content-left {
    width: 100%;
  }

  .user-content-right{
    width: 100%;
    padding-right: 0;
    margin-top: 16px;
  }
}

@media screen and (min-width: 769px) {
  .user-content {
    display: grid;
    grid-template-columns: 260px 1fr;
    column-gap: 20px;
    align-items: flex-start;
    max-width: 1200px;
    min-width: 800px;
    margin: 80px auto;
    padding: 0;
  }

  .user-content-left {
    position: sticky;
    top: 100px;
    align-self: flex-start;
  }

  .user-content-right {
    padding-right: 20px;
    margin-top: 0;
  }
}
</style>
