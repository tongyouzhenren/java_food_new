<template>
  <div class="detail">
    <Header/>

    <div class="detail-content">
      <div class="detail-content-top">
        <div class="thing-infos-view">
          <div class="thing-infos">
            <!-- 左侧图片 -->
            <div class="thing-img-box">
              <img :src="detailData.cover" />
            </div>

            <!-- 右侧信息 -->
            <div class="thing-info-box">
              <div class="thing-state">
                <span class="state">在售</span>
                <span>商品编号：{{ detailData.id }}</span>
              </div>
              <h1 class="thing-name">{{ detailData.title }}</h1>
              <div class="translators">
                <span>分类：{{ detailData.classification_title || '--' }}</span>
              </div>
              <div class="thing-price">
                <span class="price-symbol">¥</span>
                <span class="price">{{ detailData.price }}</span>
              </div>

              <!-- 按钮操作区 -->
              <div class="buy-way">
                <div class="buy-btn" @click="handleOrder(detailData)">
                  <img :src="AddIcon" />
                  <span>加入购物车</span>
                </div>
                <div class="buy-btn" @click="addToWish()">
                  <img :src="WantIcon" />
                  <span>加入心愿单</span>
                </div>
                <div class="buy-btn" @click="collect()">
                  <img :src="RecommendIcon" />
                  <span>收藏</span>
                </div>
                <div class="buy-btn" @click="share()">
                  <img :src="ShareIcon" />
                  <span>分享</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧统计 (可选) -->
          <div class="thing-counts hidden-sm">
            <div class="count-item flex-view pointer" @click="addToWish()">
              <div class="count-img">
                <img :src="WantIcon">
              </div>
              <div class="count-box flex-view">
                <div class="count-text-box">
                  <span class="count-title">想吃</span>
                </div>
                <div class="count-num-box">
                  <span class="num-text">{{ detailData.wishCount }}</span>
                </div>
              </div>
            </div>
            <div class="count-item flex-view pointer" @click="collect()">
              <div class="count-img">
                <img :src="RecommendIcon">
              </div>
              <div class="count-box flex-view">
                <div class="count-text-box">
                  <span class="count-title">收藏</span>
                </div>
                <div class="count-num-box">
                  <span class="num-text">{{ detailData.collectCount }}</span>
                </div>
              </div>
            </div>
            <div class="count-item flex-view pointer">
              <div class="count-img">
                <img :src="ShareIcon">
              </div>
              <div class="count-box flex-view">
                <div class="count-text-box">
                  <span class="count-title">分享</span>
                </div>
                <div class="count-num-box">
                  <span class="num-text">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="thing-content-view">
        <div class="main-content">
          <!-- 切换 Tab -->
          <div class="order-view main-tab">
            <span
              class="tab"
              :class="selectTabIndex===index? 'tab-select':''"
              v-for="(item,index) in tabData"
              :key="index"
              @click="selectTab(index)">
              {{item}}
            </span>
            <span :style="{left: tabUnderLeft + 'px'}" class="tab-underline"></span>
          </div>

          <!-- 简介内容 -->
          <div class="text" v-if="selectTabIndex===0">
            {{ detailData.description || '暂无简介' }}
          </div>

          <!-- 评论内容 -->
          <div class="thing-comment" v-if="selectTabIndex===1">
            <div class="title">发表评论</div>
            <div class="publish flex-view">
              <img :src="AvatarIcon" class="mine-img">
              <input placeholder="说点什么..." class="content-input" ref="commentRef">
              <button class="send-btn" @click="sendComment()">发送</button>
            </div>
            <div class="tab-view flex-view">
              <div class="count-text">共有{{commentData.length}}条评论</div>
              <div class="tab-box flex-view" style="display: none;">
                <span :class="sortIndex===0? 'tab-select': ''" @click="sortCommentList('recent')">最新</span>
                <div class="line"></div>
                <span :class="sortIndex===1? 'tab-select': ''" @click="sortCommentList('hot')">热门</span>
              </div>
            </div>
            <div class="comments-list">
              <div class="comment-item" v-for="item in commentData">
                <div class="flex-item flex-view">
                  <img :src="AvatarIcon" class="avator">
                  <div class="person">
                    <div class="name">{{item.username}}</div>
                    <div class="time">{{item.commentTime}}</div>
                  </div>
                  <div class="float-right">
                    <span @click="like(item.id)">推荐</span>
                    <span class="num">{{item.likeCount}}</span>
                  </div>
                </div>
                <p class="comment-content">{{item.content}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧推荐 -->
        <div class="recommend hidden-sm">
          <div class="title">热门推荐</div>
          <div class="things">
            <div class="thing-item thing-item-cloumn" v-for="item in recommendData" @click="handleDetail(item)">
              <div class="img-view">
                <img :src="item.cover">
              </div>
              <div class="info-view">
                <h3 class="thing-name">{{item.title}}</h3>
                <span class="price">¥{{item.price}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer/>
  </div>
</template>

<script setup>
import {message} from "ant-design-vue";
import Header from '/@/views/index/components/header.vue'
import Footer from '/@/views/index/components/footer.vue'
import AddIcon from '/@/assets/images/add.svg';
import WantIcon from '/@/assets/images/want-read-hover.svg';
import RecommendIcon from '/@/assets/images/recommend-hover.svg';
import ShareIcon from '/@/assets/images/share-icon.svg';
import WeiboShareIcon from '/@/assets/images/wb-share.svg';
import AvatarIcon from '/@/assets/images/avatar.jpg';
import {
  detailApi,
  listApi as listThingList,
} from '/@/api/thing'
import {listThingCommentsApi, createApi as createCommentApi, likeApi} from '/@/api/comment'
import {wishApi} from '/@/api/thingWish'
import {collectApi} from '/@/api/thingCollect'
import {BASE_URL} from "/@/store/constants";
import {useRoute, useRouter} from "vue-router"; // 修正引用
import {useUserStore} from "/@/store";
import {getFormatTime} from "/@/utils";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();


let thingId = ref('')
let detailData = ref({})
let tabUnderLeft = ref(6)
let tabData = ref(['简介', '评论'])
let selectTabIndex = ref(0)

let commentData = ref([])
let recommendData = ref([])
let sortIndex = ref(0)
let order = ref('recent') // 默认排序最新

let commentRef = ref()

onMounted(()=>{
  thingId.value = route.query.id.trim()
  getThingDetail()
  getRecommendThing()
  getCommentList()
})

const selectTab =(index)=> {
  selectTabIndex.value = index
  tabUnderLeft.value = 6 + 54 * index
}

const getThingDetail =()=> {
  detailApi({id: thingId.value}).then(res => {
    detailData.value = res.data
    // 如果图片不是绝对路径，拼接上 BASE_URL (这里假设已经配置了Proxy，直接拼接相对路径)
    if(detailData.value.cover && !detailData.value.cover.startsWith('http')){
        detailData.value.cover = BASE_URL + '/api/staticfiles/image/' + detailData.value.cover
    }
  }).catch(err => {
    message.error('获取详情失败')
  })
}
const addToWish =()=> {
  let userId = userStore.user_id
  if (userId) {
    wishApi({thingId: thingId.value, userId: userId}).then(res => {
      message.success(res.msg)
      getThingDetail()
    }).catch(err => {
      console.log('操作失败')
    })
  } else {
    message.warn('请先登录')
  }
}
const collect =()=> {
  let userId = userStore.user_id
  if (userId) {
    collectApi({thingId: thingId.value, userId: userId}).then(res => {
      message.success(res.msg)
      getThingDetail()
    }).catch(err => {
      console.log('收藏失败')
    })
  } else {
    message.warn('请先登录')
  }
}
const share =()=> {
  let content = '分享一个非常好玩的网站 ' + window.location.href
  let shareHref = 'http://service.weibo.com/share/share.php?title=' + content
  window.open(shareHref)
}
const handleOrder = (detailData) => {
  console.log(detailData)
  // const userId = userStore.user_id
  let gwcDataText = localStorage.getItem("gwc");

  console.log('恢复数据===>' + gwcDataText);
  let gwcList = []
  if (gwcDataText) {
    let obj = JSON.parse(gwcDataText);
    if (obj && obj.gwc) {
      gwcList = obj.gwc
    }
    let has = false;
    gwcList.forEach(item => {
      if (item.id === detailData.id) {
        item.count += 1
        has = true
      }
    })
    console.log(gwcList)
    if (!has) {
      gwcList.push(
          {
            id: detailData.id,
            title: detailData.title,
            price: detailData.price,
            count: 1
          })
    }
  } else {
    gwcList.push(
        {
          id: detailData.id,
          title: detailData.title,
          price: detailData.price,
          count: 1
        })
  }
  let obj = {
    gwc: gwcList
  }
  let jsonText = JSON.stringify(obj);
  console.log('保存数据===>' + jsonText)
  // 保存购物车
  localStorage.setItem("gwc", jsonText);

  message.success("已添加到购物车");
}
const getRecommendThing =()=> {
  listThingList({sort: 'recommend'}).then(res => {
    res.data.forEach((item, index) => {
      if (item.cover && !item.cover.startsWith('http')) {
        item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
      }
    })
    console.log(res)
    recommendData.value = res.data.slice(0, 6)
  }).catch(err => {
    console.log(err)
  })
}
const handleDetail =(item)=> {
  // 跳转新页面
  let text = router.resolve({name: 'detail', query: {id: item.id}})
  window.open(text.href, '_blank')
}
const sendComment =()=> {
  console.log(commentRef.value)
  let text = commentRef.value.value.trim()
  console.log(text)
  if (text.length <= 0) {
    return
  }
  commentRef.value.value = ''
  let userId = userStore.user_id
  if (userId) {
    createCommentApi({content: text, thingId: thingId.value, userId: userId}).then(res => {
      getCommentList()
    }).catch(err => {
      console.log(err)
    })
  } else {
    message.warn('请先登录！')
    router.push({name: 'login'})
  }
}
const like =(commentId)=> {
  likeApi({id: commentId}).then(res => {
    getCommentList()
  }).catch(err => {
    console.log(err)
  })
}
const getCommentList =()=> {
  listThingCommentsApi({thingId: thingId.value, order: order.value}).then(res => {
    res.data.forEach(item => {
      item.commentTime = getFormatTime(item.commentTime, true)
    })
    commentData.value = res.data
  }).catch(err => {
    console.log(err)
  })
}
const sortCommentList =(sortType)=> {
  if (sortType === 'recent') {
    sortIndex.value = 0
  } else {
    sortIndex.value = 1
  }
  order.value = sortType
  getCommentList()
}

</script>

<style scoped lang="less">

.hide {
  display: none;
}

.detail-content {
  display: flex;
  flex-direction: column;
  width: 1100px;
  margin: 4px auto;
}

.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.hidden-lg {
  display: none !important;
}

.thing-infos-view {
  display: flex;
  margin: 89px 0 40px;
  overflow: hidden;

  .thing-infos {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: flex;
  }

  .mobile-share-box {
    height: 38px;
    background: transparent;
    padding: 0 16px;
    margin: 12px 0;
    font-size: 0;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    .state {
      width: 64px;
      height: 24px;
      line-height: 24px;
      background: rgba(70, 132, 226, .1);
      border-radius: 2px;
      font-weight: 500;
      font-size: 12px;
      color: #4684e2;
      text-align: center;
    }

    .share-img {
      background: #fff;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      text-align: center;

      img {
        position: relative;
        top: 4px;
        width: 24px;
      }
    }
  }

  .thing-img-box {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 235px;
    flex: 0 0 235px;
    margin: 0 40px 0 0;

    img {
      width: 200px;
      height: 200px;
      display: block;
      background-size: cover;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .thing-info-box {
    text-align: left;
    padding: 0;
    margin: 0;
  }

  .thing-state {
    height: 26px;
    line-height: 26px;

    .state {
      font-weight: 500;
      color: #4684e2;
      background: rgba(70, 132, 226, .1);
      border-radius: 2px;
      padding: 5px 8px;
      margin-right: 16px;
    }

    span {
      font-size: 14px;
      color: #152844;
    }
  }

  .thing-name {
    line-height: 32px;
    margin: 16px 0;
    color: #0F1111!important;
    font-size: 24px!important;
    font-weight: bold!important;
  }

  .translators, .authors {
    line-height: 18px;
    font-size: 14px;
    margin: 8px 0;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;

    .name {
      color: #315c9e;
      white-space: normal;
    }
  }

  .thing-price {
    margin-top: 20px;
    .price-symbol {
        color: #ff7b31;
        font-size: 18px;
    }
    .price {
        color: #ff7b31;
        font-size: 32px;
        font-weight: bold;
    }
  }

  .tags {
    position: absolute;
    bottom: 20px;
    margin-top: 16px;

    .category-box {
      color: #152844;
      font-size: 14px;

      .title {
        color: #787878;
      }
    }
  }

  .thing-counts {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 235px;
    flex: 0 0 235px;
    margin-left: 20px;
  }

  .pointer {
    cursor: pointer;
  }

  .count-item {
    height: 64px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
  }

  .count-img {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 32px;
    flex: 0 0 32px;
    margin-right: 24px;
    font-size: 0;

    img {
      width: 100%;
      display: block;
    }
  }

  .count-box {
    position: relative;
    border-bottom: 1px solid #cedce4;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 100%;
  }

  .count-text-box {
    font-size: 0;

    .count-title {
      color: #152844;
      font-weight: 600;
      font-size: 16px;
      line-height: 18px;
      display: block;
      height: 18px;
    }
  }

  .count-num-box {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #152844;
  }
}

.buy-way {
  display: flex;
  flex-direction: row;
  margin-top: 24px;
}

.buy-btn {
  cursor: pointer;
  display: block;
  background: #4684e2;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  width: 110px;
  outline: none;
  border: none;
  margin-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}


.thing-content-view {
  margin-top: 40px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: row;
}

.main-content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;

  .text {
    color: #484848;
    font-size: 16px;
    line-height: 26px;
    padding-left: 12px;
    margin: 11px 0;
    white-space: pre-wrap;
  }
}

.main-tab {
  border-bottom: 1px solid #cedce4;
}

.order-view {
  position: relative;
  color: #6c6c6c;
  font-size: 14px;
  line-height: 40px;

  .title {
    margin-right: 8px;
  }

  .tab {
    margin-right: 20px;
    cursor: pointer;
    color: #5f77a6;
    font-size: 16px;
    cursor: pointer;
  }

  .tab-select {
    color: #152844;
    font-weight: 600;
  }

  .tab-underline {
    position: absolute;
    bottom: 0;
    left: 0px; // dynamic
    width: 16px;
    height: 4px;
    background: #4684e2;
    -webkit-transition: left .3s;
    transition: left .3s;
  }
}

.recommend {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 235px;
  flex: 0 0 235px;
  margin-left: 20px;

  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 26px;
    color: #152844;
    margin-bottom: 12px;
  }

  .things {
    border-top: 1px solid #cedce4;

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
      padding-bottom: 24px;
      border-bottom: 1px #e1e1e1 solid;
      cursor: pointer;

      .img-view {
        //background: #f3f3f3;
        //text-align: center;
        height: 200px;
        width: 255px;
        //border: 1px #f3f3f3 solid;

        img {
          height: 200px;
          width: 255px;
          overflow: hidden;
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
          color: #0F1111!important;
          font-size: 15px!important;
          font-weight: 400!important;
          font-style: normal!important;
          text-transform: none!important;
          text-decoration: none!important;
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

  }
}

.flex-view {
  display: flex;
}

.thing-comment {
  .title {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    height: 22px;
    color: #152844;
    margin: 24px 0 12px;
  }

  .publish {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .mine-img {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 40px;
      flex: 0 0 40px;
      margin-right: 12px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }

    .content-input {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      background: #f6f9fb;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      color: #484848;
      padding: 5px 12px;
      white-space: nowrap;
      outline: none;
      border: 0px;
    }

    .send-btn {
      margin-left: 10px;
      background: #4684e2;
      border-radius: 4px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      outline: none;
      border: 0px;
      cursor: pointer;
    }
  }

  .tab-view {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 24px 0;

    .count-text {
      color: #484848;
      float: left;
    }

    .tab-box {
      color: #5f77a6;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .tab-select {
        color: #152844;
      }

      span {
        cursor: pointer;
      }
    }

    .line {
      width: 1px;
      height: 12px;
      margin: 0 12px;
      background: #cedce4;
    }
  }
}


.comments-list {
  .comment-item {
    .flex-item {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding-top: 16px;

      .avator {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 40px;
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        margin-right: 12px;
        border-radius: 50%;
        cursor: pointer;
      }

      .person {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .name {
        color: #152844;
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        height: 22px;
        cursor: pointer;
      }

      .time {
        color: #5f77a6;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        margin-top: 2px;
      }

      .float-right {
        color: #4684e2;
        font-size: 14px;
        float: right;

        span {
          margin-left: 19px;
          cursor: pointer;
        }

        .num {
          color: #152844;
          margin-left: 6px;
          cursor: auto;
        }
      }
    }
  }
}

.comment-content {
  margin-top: 8px;
  color: #484848;
  font-size: 14px;
  line-height: 22px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #cedce4;
  margin-left: 52px;
  overflow: hidden;
  word-break: break-word;
}

/* ↓↓↓↓↓↓↓↓↓ 新增移动端适配代码 ↓↓↓↓↓↓↓↓↓ */
@media screen and (max-width: 768px) {
  /* 1. 容器宽度 */
  .detail-content {
    width: 100% !important;
    margin: 60px 0 0 0 !important;
    padding: 0 16px;
    box-sizing: border-box;
  }

  /* 2. 顶部区域：改为垂直排列 */
  .thing-infos-view {
    margin-top: 10px !important;
    display: block !important; /* 取消 flex */
  }

  .thing-infos {
    display: block !important; /* 取消 flex */
  }

  /* 3. 图片区域 */
  .thing-img-box {
    margin: 0 auto 20px auto !important; /* 居中 */
    width: 100% !important;
    flex: none !important;
    text-align: center;
  }

  .thing-img-box img {
    width: 100% !important; /* 图片宽度撑满 */
    height: auto !important; /* 高度自适应 */
    max-height: 300px;
  }

  /* 4. 信息区域 */
  .thing-info-box {
    text-align: left;
  }

  .thing-name {
    font-size: 20px !important;
    margin: 10px 0 !important;
  }

  /* 5. 隐藏不适合手机显示的右侧统计栏和推荐栏 */
  .thing-counts,
  .recommend {
    display: none !important;
  }

  /* 6. 购买按钮组：允许换行 */
  .buy-way {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .buy-btn {
    width: 48% !important; /* 按钮变宽 */
    margin-right: 0 !important;
    margin-bottom: 10px;
  }

  /* 7. 内容详情页：去掉左padding */
  .main-content .text {
    padding-left: 0 !important;
  }
    /* 8. 详情信息区留出更多呼吸感 */
  .thing-info-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* 9. 内容和评论区域改为上下排列，避免横向滚动 */
  .thing-content-view {
    flex-direction: column;
    margin-top: 20px;
  }

  /* 10. Tab 和评论输入适配小屏 */
  .order-view {
    font-size: 15px;
    line-height: 32px;
  }

  .thing-comment .publish {
    align-items: flex-start;
  }

  .thing-comment .content-input {
    width: 100%;
  }

  .thing-comment .send-btn {
    flex-shrink: 0;
  }
}
/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */
</style>