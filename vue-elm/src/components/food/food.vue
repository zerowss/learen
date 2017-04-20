<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="foodItemScorll">
      <div class="food-content">
        <div class="food-img">
          <img :src="food.image">
          <div class="back" @click="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="title">
          <h1>{{food.name}}</h1>
          <div class="detail">
            <span>月售{{food.sellCount}}份</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="new">￥{{food.price}}</span>
            <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="addFoods" @click="addFoods($event)" v-show="!food.count || food.count === 0">
            <p class="foodCar">加入购物车</p>
          </div>
          <div class="cartControl-wrap" v-show="isShow">
            <cartControl :food="food"></cartControl>
          </div>
        </div>
        <div class="separate">
          <split></split>
        </div>
        <div class="introduction" v-show="food.info">
          <h1>商品介绍</h1>
          <p>{{food.info}}</p>
        </div>
        <div class="separate" v-show="food.info">
          <split></split>
        </div>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingsselect :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent"
                         :desc="desc"></ratingsselect>
          <div class="ratings-list">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="item in food.ratings" class="ratingList-item border-1px"
                  v-show="needShow(item.rateType,item.text)">
                <div class="listTitle clearfix">
                  <div class="time">
                    <span class="time-day">{{getTime(item.rateTime)}}</span>
                  </div>
                  <div class="username">
                    <span class="name">{{item.username}}</span>
                    <img class="namePic" :src="item.avatar" width="12" height="12">
                  </div>
                </div>
                <div class="ratingText">
                  <span :class="{'icon-thumb_down':item.rateType === 1,'icon-thumb_up':item.rateType === 0}"></span>
                  <span class="text">{{item.text}}</span>
                </div>
              </li>
            </ul>
            <div v-show="!food.ratings || !food.ratings.length " class="no-rating">暂无评论</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartControl from '../../components/cartControl/cartControl.vue'
  import split from '../../components/split/split.vue'
  import ratingsselect from '../../components/ratingselect/ratingselect.vue'
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data(){
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    created(){
      this.$root.eventHub.$on('toggleContent', (isCount) => {
        this.onlyContent = isCount;
        this.$nextTick(() => {
          if (this.foodScorll) {
            this.foodScorll = new BScroll(this.$refs.foodItemScorll);
          } else {
            this.foodScorll.refresh();
          }
        })
      });
      this.$root.eventHub.$on('ratingsType', (type) => {
        this.selectType = type;
        this.$nextTick(() => {
          if (!this.foodScorll) {
            this.foodScorll = new BScroll(this.$refs.foodItemScorll);
          } else {
            this.foodScorll.refresh();
          }
        })
      });
    },
    computed: {
      isShow(){
        if (this.food.count > 0) {
          return true;
        }
        return false;
      }
    },
    methods: {
      flag(){
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        if (!this.foodsScroll) {
          this.$nextTick(() => {
            this.foodScorll = new BScroll(this.$refs.foodItemScorll, {
              click: true
            });
          })
        } else {
          this.foodScorll.refresh();
        }
      },
      back(){
        this.showFlag = false;
      },
      addFoods(event){
        if (!event._constructed) {
          return;
        }
        Vue.set(this.food, 'count', 1);
      },
      getTime(time){
        var str = '';
        const dTime = new Date(time);
        const year = dTime.getFullYear();
        const month = dTime.getMonth() + 1;
        const days = dTime.getDate();
        const hours = dTime.getHours();
        const minutes = dTime.getMinutes();
        str = `${year}-${month}-${days}  ${hours}:${minutes}`;
        return str;
      },
      needShow(type, text){
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    },
    components: {
      cartControl,
      split,
      ratingsselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index 30
    width: 100%
    background-color #fff
    &.move-enter-active, &.move-leave-active
      transition: all 0.5s
    &.move-enter, &.move-leave-active
      transform translateX(-100%)
    .food-img
      position: relative
      width: 100%
      height 0
      padding-top: 100%
      img
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        left: 10px
        top: 10px
        .icon-arrow_lift
          display block
          padding 10px
          font-size 14px
          color: #fff
    .title
      position: relative
      padding 18px
      h1
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
        line-height 14px
        margin-bottom: 8px
      .detail
        margin-bottom 18px
        font-size: 0
        span
          display inline-block
          font-size: 10px
          color: rgb(147, 158, 159)
          line-height: 10px
          margin-right: 12px
      .price
        font-size: 0
        span
          display inline-block
          &.new
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
            line-height: 24px
            margin-right: 12px
          &.oldPrice
            font-size: 10px
            font-weight: normal
            color: rgb(147, 153, 159)
            line-height: 24px
      .addFoods
        position: absolute
        right: 18px
        bottom: 18px
        height: 24px
        .foodCar
          width: 100%
          height 100%
          box-sizing border-box
          padding 6px 12px
          font-size: 10px
          color: #fff
          line-height: 12px
          border-radius: 12px
          background-color rgb(0, 160, 220)
      .cartControl-wrap
        position: absolute
        right: 12px
        bottom: 12px
    .introduction
      padding 18px
      p
        padding 6px 8px 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
        line-height: 24px

    .rating
      .title
        margin 18px 0 0 18px
      .ratings-list
        padding 0 18px
        .ratingList-item
          border-1px(rgba(7, 17, 27, 0.1))
          padding: 16px 0
          width: 100%
          box-sizing: border-box
          .listTitle
            margin-bottom: 6px
            width: 100%
            .time
              float: left
              .time-day
                font-size: 10px
                color: rgb(147, 153, 159)
                line-height: 12px
            .username
              float: right
              .name
                font-size: 10px
                color: rgb(147, 153, 159)
                line-height: 12 pxs
                margin-right: 6px
              .namePic
                border-radius: 50%

          .ratingText
            font-size: 0
            .icon-thumb_down, .icon-thumb_up
              font-size: 12px
              color: rgb(147, 153, 159)
              line-height: 24px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .text
              margin-left: 4px
              font-size: 12px
              color: rgb(147, 153, 159)
              line-height: 12px

      .no-rating
        padding 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)
</style>
