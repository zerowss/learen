<template>
  <div class="header">
    <div class="content-wrap">
      <div class="avatar">
        <img :src="seller.avatar" alt="tit" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supports-content" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrap" @click="showDetail">
      <span class="bulletin-tit"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
        <img :src="seller.avatar" width="100%" height="200%">
      </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="tit">{{seller.name}}</h1>
            <div class="star-wrap">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="supportsList" v-if="seller.supports">
              <li v-for="(support, index) in seller.supports" :key="index" class="supportsList-item">
                <span class="supportsList-icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="supportsList-text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin-text">
              <p>{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue'
  export default{
    props:{
        seller :{
            type: Object
        }
    },
    components:{star},
    data(){
        return {
            detailShow : false
        }
    },
    methods:{
      showDetail(){
        this.detailShow = true;
      },
      hideDetail(){
        this.detailShow = false;
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .header
    position:relative
    color: #ffffff
    background-color :rgba(7,17,27,.5)
    .content-wrap
      position: relative
      padding:24px 12px 18px 24px
      font-size:0
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display:inline-block
        margin-left: 16px
        font-size: 14px
        .title
          margin:2px 0 8px 0
          .brand
            display:inline-block
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size:30px 18px
            background-repeat:no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            color:rgb(255,255,255)
            font-weight bold
            line-height:18px;
        .description
          font-size: 12px
          margin-bottom:10px
          line-height: 12px
        .supports
          .icon
            display:inline-block
            width: 12px
            height: 12px
            margin-right: 4px
            background-size:12px 12px
            background-repeat:no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            vertical-align: top
            font-size:10px
            line-height:12px

      .supports-content
        position: absolute
        right: 12px
        bottom:8px
        padding:0 8px
        height: 24px
        line-height: 24px
        font-size: 10px
        background:rgba(0,0,0,.2)
        text-align center
        border-radius 14px
        .count
          vertical-align top
        .icon-keyboard_arrow_right
          line-height: 24px
          margin-left:2px
    .bulletin-wrap
      position relative
      height:28px
      line-height: 28px
      padding:0 22px 0 12px
      white-space:nowrap
      overflow:hidden
      text-overflow:ellipsis
      background-color:rgba(7,17,27,0.2)
      .bulletin-tit
        display inline-block
        vertical-align:top
        bg-image('bulletin')
        width: 22px
        height: 12px
        background-size:22px 12px
        background-repeat:no-repeat
        margin-top: 7px
      .bulletin-text
        vertical-align: top
        font-size: 10px
        line-height: 28px
        margin-left 4px
      .icon-keyboard_arrow_right
        position: absolute
        right: 12px
        font-size: 10px
        top:8px
    .background
      position: absolute
      left:0
      top:0
      width:100%
      height:100%
      z-index:-1
      filter:blur(10px)
      overflow:hidden
    .detail
      position:fixed
      left:0
      bottom:0
      z-index:100
      width:100%
      height:100%
      overflow:auto
      background-color:rgba(7,17,27,.8)
      backdrop:blur(10px)
      &.fade-enter-active, &.fade-leave-active
        transition: opacity .5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
      .detail-wrapper
        min-height: 100%
        width:100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .tit
            font-style: 16px
            font-weight:700
            line-height: 32px
            text-align: center
          .star-wrap
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width:80%
            margin: 28px auto 24px auto
            .line
              flex:1
              position: relative
              top: -6px
              border-bottom:1px solid rgba(255,255,255,.2);
            .text
              padding: 0 12px
              font-size: 16px
              font-weight:700
          .supportsList
            width:80%
            margin 0 auto
            font-size 0
            .supportsList-item
              margin-bottom: 12px
              padding 0 12px
              .supportsList-icon
                display inline-block
                width: 16px
                height: 16px
                background-repeat no-repeat
                background-size 16px 16px
                &:last-child
                  margin-bottom:0
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .supportsList-text
                vertical-align top
                font-size 12px
                line-height: 16px
                font-weight:200
                margin-left 6px
          .bulletin-text
            width:80%
            margin: 24px auto 0 auto
            p
              padding 0 12px
              font-size: 12px
              font-weight:200
              line-height:24px
      .detail-close
        position: relative
        margin: -64px auto 0 auto
        font-size: 32px
        color:rgba(255,255,255,.5)
        width: 32px
        height: 32px
        clear: both


</style>

