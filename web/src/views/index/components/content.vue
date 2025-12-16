<template>
  <div class="content">
    <div class="content-header">
      <div class="filter-toggle">
        <button class="filter-button" @click="toggleFilters">
          {{ contentData.showFilters ? '收起菜品筛选' : '打开菜品筛选' }}
        </button>
        <p class="toggle-tip">点开后可查看菜品分类和热门标签</p>
      </div>
      <transition name="fade">
        <div v-if="contentData.showFilters" class="filter-panel">
          <div class="filter-row">
            <div class="panel-title">
              <span class="title-icon">🍽️</span>
              <div class="title-text">
                <h4>菜品分类</h4>
                <p class="subtitle">挑选你想吃的菜系</p>
              </div>
            </div>
            <div class="panel-card category-panel">
              <div class="category-scroll">
                <span
                  v-for="item in contentData.cData"
                  :key="item.key"
                  class="category-chip"
                  :class="{'category-chip-select': contentData.selectedKeys.includes(item.key)}"
                  @click="selectCategory(item.key)">{{ item.title }}</span>
              </div>
            </div>
          </div>
          <div class="filter-row">
            <div class="panel-title">
              <span class="title-icon fire">🔥</span>
              <div class="title-text">
                <h4>热门标签</h4>
                <p class="subtitle">灵感标签，一键直达</p>
              </div>
            </div>
            <div class="panel-card tag-panel">
              <div class="tag-view tag-flex-view">
                <span class="tag"
                      :class="{'tag-select': contentData.selectTagId===item.id}"
                      v-for="item in contentData.tagData" :key="item.id"
                      @click="clickTag(item.id)">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="content-right">
      <div class="top-select-view flex-view">
        <div class="order-view">
          <span class="title"></span>
          <span class="tab"
                :class="contentData.selectTabIndex===index? 'tab-select':''"
                v-for="(item,index) in contentData.tabData"
                :key="index"
                @click="selectTab(index)">
            {{ item }}
          </span>
          <span :style="{left: contentData.tabUnderLeft + 'px'}" class="tab-underline"></span>
        </div>
      </div>
      <a-spin :spinning="contentData.loading" style="min-height: 200px;">
        <div class="pc-thing-list flex-view">
          <!-- ↓↓↓↓↓↓↓↓↓ 开始修改 ↓↓↓↓↓↓↓↓↓ -->
          <!-- 循环渲染菜品列表 -->
          <div class="thing-item item-column-4" v-for="item in contentData.pageData" :key="item.id" @click="handleDetail(item)">
            <div class="img-view">
              <img :src="item.cover">
            </div>
            <div class="info-view">
              <h3 class="thing-name">{{ item.title ? item.title.substring(0, 12) : '' }}</h3>
              <span>
                <span class="a-price-symbol">¥</span>
                <span class="a-price">{{ item.price }}</span>
              </span>
            </div>
          </div>
          <!-- 如果没有数据，显示暂无数据 -->
          <div v-if="contentData.pageData.length <= 0" class="no-data" style="width: 100%; text-align: center; padding-top: 50px;">
            暂无数据
          </div>
        </div>
      </a-spin>
      <div class="page-view" style="">
        <a-pagination v-model="contentData.page" size="small" @change="changePage" :hideOnSinglePage="true"
                      :defaultPageSize="contentData.pageSize" :total="contentData.total" :showSizeChanger="false"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {listApi as listClassificationList} from '/@/api/classification'
import {listApi as listTagList} from '/@/api/tag'
import {listApi as listThingList} from '/@/api/thing'
import {BASE_URL} from "/@/store/constants";
import {useUserStore} from "/@/store";

const userStore = useUserStore()
const router = useRouter();

const contentData = reactive({
  selectX: 0,
  selectTagId: -1,
  cData: [],
  selectedKeys: [],
  tagData: [],
  loading: false,
  showFilters: false,

  tabData: ['最新', '最热', '推荐'],
  selectTabIndex: 0,
  tabUnderLeft: 12,

  thingData: [],
  pageData: [],

  page: 1,
  total: 0,
  pageSize: 12,
})

onMounted(() => {
  initSider()
  getThingList({})
})

const initSider = () => {
  contentData.cData.push({key: -1, title: '全部'})
  listClassificationList().then(res => {
    res.data.forEach(item=>{
      item.key = item.id
      contentData.cData.push(item)
    })
  })
  listTagList().then(res => {
    contentData.tagData = res.data
  })
}

const toggleFilters = () => {
  contentData.showFilters = !contentData.showFilters
}

const getSelectedKey = () => {
  if (contentData.selectedKeys.length > 0) {
    return contentData.selectedKeys[0]
  } else {
    return -1
  }
}
const selectCategory = (key) => {
  contentData.selectedKeys = [key]
  if (contentData.selectedKeys.length > 0) {
    getThingList({c: getSelectedKey()})
  }
  contentData.selectTagId = -1
}
const clickTag = (index) => {
  contentData.selectedKeys = []
  contentData.selectTagId = index
  getThingList({tag: contentData.selectTagId})
}

// 最新|最热|推荐
const selectTab = (index) => {
  contentData.selectTabIndex = index
  contentData.tabUnderLeft = 12 + 50 * index
  console.log(contentData.selectTabIndex)
  let sort = (index === 0 ? 'recent' : index === 1 ? 'hot' : 'recommend')
  const data = {sort: sort}
  if (contentData.selectTagId !== -1) {
    data['tag'] = contentData.selectTagId
  } else {
    data['c'] = getSelectedKey()
  }
  getThingList(data)
}
const handleDetail = (item) => {
  // 跳转新页面
  let text = router.resolve({name: 'detail', query: {id: item.id}})
  window.open(text.href, '_blank')
}
// 分页事件
const changePage = (page) => {
  contentData.page = page
  let start = (contentData.page - 1) * contentData.pageSize
  contentData.pageData = contentData.thingData.slice(start, start + contentData.pageSize)
  console.log('第' + contentData.page + '页')
}
const getThingList = (data) => {
  contentData.loading = true
  listThingList(data).then(res => {
    contentData.loading = false
    res.data.forEach((item, index) => {
      if (item.cover) {
        item.cover = BASE_URL + '/api/staticfiles/image/' +  item.cover
      }
    })
    console.log(res)
    contentData.thingData = res.data
    contentData.total = contentData.thingData.length
    changePage(1)
  }).catch(err => {
    console.log(err)
    contentData.loading = false
  })
}


</script>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  width: 1100px;
  margin: 80px auto;
  gap: 16px;
}

.content-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-button {
  border: none;
  background: linear-gradient(120deg, #4c8af6, #3c6fd9);
  color: #fff;
  border-radius: 24px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(70, 132, 227, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.filter-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(70, 132, 227, 0.32);
}

.toggle-tip {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: linear-gradient(120deg, #fff7e6, #ffe3c7);
  border-radius: 12px;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(255, 125, 69, 0.2);
}

.title-icon.fire {
  background: linear-gradient(120deg, #ffe8ed, #ffd3d6);
  box-shadow: 0 4px 10px rgba(255, 103, 129, 0.18);
}

.title-text h4 {
  margin: 0;
  color: #1f2d3d;
  font-weight: 700;
  font-size: 17px;
  line-height: 24px;
}

.subtitle {
  margin: 2px 0 0;
  color: #6b7280;
  font-size: 12px;
  letter-spacing: 0.2px;
}

.panel-card {
  margin-top: 12px;
  background: linear-gradient(180deg, #f9fbff 0%, #f5f7fb 100%);
  border: 1px solid #e5ecf6;
  box-shadow: 0 8px 24px rgba(21, 40, 68, 0.06);
  border-radius: 16px;
  padding: 14px;
}

.category-panel {
  padding: 14px 14px 6px;
}

.category-scroll {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  max-height: none;
  overflow-x: auto;
  padding-bottom: 6px;
}

.category-chip {
  background: linear-gradient(135deg, #ffffff 0%, #f6f8ff 100%);
  border: 1px solid #d7e2f1;
  box-sizing: border-box;
  border-radius: 18px;
  height: 32px;
  line-height: 30px;
  padding: 0 14px;
  cursor: pointer;
  font-size: 13px;
  color: #1f2d3d;
  box-shadow: 0 6px 14px rgba(70, 132, 227, 0.08);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.category-chip:hover {
  background: linear-gradient(135deg, #f0f6ff 0%, #e4eeff 100%);
  color: #1c4fa0;
  border: 1px solid #c1d7ff;
  transform: translateY(-1px);
}

.category-chip-select {
  background: linear-gradient(135deg, #4684e3 0%, #2c6ed1 100%);
  color: #fff;
  border: 1px solid #2c6ed1;
  box-shadow: 0 10px 20px rgba(70, 132, 227, 0.25);
}

.tag-panel {
  padding: 12px 14px 6px;
  background: linear-gradient(180deg, #fff6f1 0%, #fff0e7 100%);
}

h4 {
  color: #4d4d4d;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  height: 24px;
}

.category-item {
  cursor: pointer;
  color: #333;
  margin: 12px 0 0;
  padding-left: 16px;
}

ul {
  margin: 0;
  padding: 0;
}

ul {
  list-style-type: none;
}

li {
  margin: 4px 0 0;
  display: list-item;
  text-align: -webkit-match-parent;
}

.flex-view {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  //justify-content: space-between;
  display: flex;
}

.name {
  font-size: 14px;
}

.name:hover {
  color: #4684e2;
}

.count {
  font-size: 14px;
  color: #999;
}

.tag-view {
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-top: 4px;
}

.tag-flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.tag {
  background: linear-gradient(135deg, #ffffff 0%, #f6f8ff 100%);
  border: 1px solid #d7e2f1;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 18px;
  height: 28px;
  line-height: 26px;
  padding: 0 12px;
  margin: 8px 8px 0 0;
  cursor: pointer;
  font-size: 12px;
  color: #1f2d3d;
  box-shadow: 0 6px 14px rgba(70, 132, 227, 0.08);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tag:hover {
  background: linear-gradient(135deg, #f0f6ff 0%, #e4eeff 100%);
  color: #1c4fa0;
  border: 1px solid #c1d7ff;
  transform: translateY(-1px);
}

.tag-select {
  background: linear-gradient(135deg, #4684e3 0%, #2c6ed1 100%);
  color: #fff;
  border: 1px solid #2c6ed1;
  box-shadow: 0 10px 20px rgba(70, 132, 227, 0.25);
}

.content-right {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: 100%;
  padding-top: 12px;

  .pc-search-view {
    margin: 0 0 24px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .search-icon {
      width: 20px;
      height: 20px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 20px;
      flex: 0 0 20px;
      margin-right: 16px;
    }

    input {
      outline: none;
      border: 0px;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      border-bottom: 1px solid #cedce4;
      color: #152844;
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      -ms-flex-item-align: end;
      align-self: flex-end;
      padding-bottom: 8px;
    }

    .clear-search-icon {
      position: relative;
      left: -20px;
      cursor: pointer;
    }

    button {
      outline: none;
      border: none;
      font-size: 14px;
      color: #fff;
      background: #288dda;
      border-radius: 32px;
      width: 88px;
      height: 32px;
      line-height: 32px;
      margin-left: 2px;
      cursor: pointer;
    }

    .float-count {
      color: #999;
      margin-left: 24px;
    }
  }

  .flex-view {
    display: flex;
  }

  .top-select-view {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 40px;
    line-height: 40px;

    .type-view {
      position: relative;
      font-weight: 400;
      font-size: 18px;
      color: #5f77a6;

      .type-tab {
        margin-right: 32px;
        cursor: pointer;
      }

      .type-tab-select {
        color: #152844;
        font-weight: 600;
        font-size: 20px;
      }

      .tab-underline {
        position: absolute;
        bottom: 0;
        //left: 22px;
        width: 16px;
        height: 4px;
        background: #4684e2;
        -webkit-transition: left .3s;
        transition: left .3s;
      }
    }

    .order-view {
      position: relative;
      color: #6c6c6c;
      font-size: 14px;

      .title {
        margin-right: 8px;
      }

      .tab {
        color: #999;
        margin-right: 20px;
        cursor: pointer;
      }

      .tab-select {
        color: #152844;
      }

      .tab-underline {
        position: absolute;
        bottom: 0;
        left: 84px;
        width: 16px;
        height: 4px;
        background: #4684e2;
        -webkit-transition: left .3s;
        transition: left .3s;
      }
    }

  }

  .pc-thing-list {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;

    .thing-item {
      min-width: 255px;
      max-width: 255px;
      position: relative;
      flex: 1;
      margin-right: 20px;
      height: fit-content;
      overflow: hidden;
      margin-top: 26px;
      margin-bottom: 36px;
      cursor: pointer;

      .img-view {
        //text-align: center;
        height: 200px;
        width: 255px;

        img {
          height: 200px;
          width: 255px;
          margin: 0 auto;
          background-size: cover;
          object-fit: cover;
        }
      }

      .info-view {
        //background: #f6f9fb;
        overflow: hidden;
        padding: 0 16px;

        .thing-name {
          line-height: 32px;
          margin-top: 12px;
          color: #0F1111 !important;
          font-size: 18px !important;
          font-weight: 400 !important;
          font-style: normal !important;
          text-transform: none !important;
          text-decoration: none !important;
        }

        .price {
          color: #ff7b31;
          font-size: 20px;
          line-height: 20px;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .translators {
          color: #6f6f6f;
          font-size: 12px;
          line-height: 14px;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .no-data {
      height: 200px;
      line-height: 200px;
      text-align: center;
      width: 100%;
      font-size: 16px;
      color: #152844;
    }
  }

  .page-view {
    width: 100%;
    text-align: center;
    margin-top: 48px;
  }
}

.a-price-symbol {
  top: -0.5em;
  font-size: 12px;
}

.a-price {
  color: #0F1111;
  font-size: 21px;
}

/* ↓↓↓↓↓↓↓↓↓ 新增移动端适配代码 ↓↓↓↓↓↓↓↓↓ */
@media screen and (max-width: 768px) {
  /* 1. 外层容器：宽度改为100%，去掉 margin */
  .content {
    width: 100% !important;
    margin: 60px 0 0 0 !important; /* 避开头部导航 */
    display: block !important; /* 取消 flex，改为上下排列 */
    padding: 0 10px; /* 两边留点缝隙 */
    box-sizing: border-box;
  }

  .content-header {
    gap: 10px;
  }

  .filter-toggle {
    align-items: flex-start;
  }

   .category-scroll {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
    overflow-x: hidden;
    padding-bottom: 4px;
  }

  .category-chip {
    justify-content: center;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tag-view {
    flex-wrap: wrap;
    overflow-x: hidden;
    padding-bottom: 4px;
  }

  /* 右侧内容区：宽度100% */
  .content-right {
    width: 100% !important;
    padding-top: 0 !important;
  }

  /* 顶部 Tab (最新/最热)：调整文字大小和间距 */
  .top-select-view {
    height: 50px !important;
    overflow-x: auto; /* 如果tab很多允许横向滚动 */
  }
  .order-view .tab {
    margin-right: 15px !important;
    font-size: 14px !important;
  }

  /* 商品列表：改为双列布局 */
  .pc-thing-list {
    justify-content: space-between; /* 两端对齐 */
  }

  .pc-thing-list .thing-item {
    width: 48% !important; /* 一行两个 */
    margin-right: 0 !important; /* 去掉右边距 */
    margin-bottom: 10px !important;
    min-width: 0 !important; /* 覆盖掉之前的 min-width */
    display: flex;
    flex-direction: column;
  }

  /* 图片高度自适应 */
  .pc-thing-list .thing-item .img-view {
    height: 160px !important; /* 手机上图片矮一点 */
    width: 100% !important;
  }

  .pc-thing-list .thing-item .img-view img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }

  .pc-thing-list .thing-item .info-view .thing-name {
    font-size: 14px !important; /* 字体改小 */
  }
}
/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */
</style>
