<template>
  <div class="seller" ref="sellerSc">
    <div class="seller-wrap">
      <div class="busInfo">
        <div class="tit border-1px">
          <h1>{{seller.name}}</h1>
          <div class="star-wrap">
            <star :size="36" :score="seller.score"></star>
            <span class="count">({{seller.ratingCount}})</span>
            <span class="count">月售{{seller.sellCount}}单</span>
          </div>
          <div class="collection" @click="isCollection($event)">
            <p class="icon-favorite" :class="{'on':isFavorite}"></p>
            <p class="text">{{favoriteText}}</p>
          </div>
        </div>
        <div class="deliver">
          <div class="delivery">
            <span>起送价</span>
            <p>{{seller.minPrice}}<i>元</i></p>
          </div>
          <div class="delivery">
            <span>商家配送</span>
            <p>{{seller.deliveryPrice}}<i>元</i></p>
          </div>
          <div class="delivery no-border">
            <span>平均配送时间</span>
            <p>{{seller.deliveryTime}}<i>分</i></p>
          </div>
        </div>
      </div>
      <split></split>
      <div class="notice">
        <div class="info border-1px">
          <h1 class="notice-tit">公告与活动</h1>
          <p class="notice-text">{{seller.bulletin}}</p>
        </div>
        <ul class="supports-wrap">
          <li v-for="(item,index) in seller.supports" class="supports-item">
            <span class="supportsList-icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="supportsList-text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-photo">
        <h1>商家实景</h1>
        <div class="photoP" ref="photoP">
          <ul class="photo-wrap clearblock" ref="photoWrap">
            <li v-for="item in seller.pics" class="pics-item">
              <img :src="item" alt="" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-news">
        <h1>商家信息</h1>
        <ul class="news-wrap">
          <li v-for="info in seller.infos" class="info-item">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import star from '../../components/star/star'
  import split from '../../components/split/split'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data(){
      return {
        isFavorite:false,
        favoriteText:'收藏'
      }
    },
    components: {
      star,
      split
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    mounted(){
      this.selScroll = new BScroll(this.$refs.sellerSc, {
        click: true
      });
      this._initPicsScroll();
    },
    updated(){
      this._initSelScroll();
      this._initPicsScroll();
    },
    methods: {
      _initSelScroll(){
        if (!this.selScroll) {
          this.selScroll = new BScroll(this.$refs.sellerSc, {
            click: true
          });
        } else {
          this.selScroll.refresh();
        }
      },
      _initPicsScroll(){
        if(this.seller.pics){
          let liW = 120;
          let margin = 6;
          this.$refs.photoWrap.style.width = this.seller.pics.length*(liW + margin) - margin + 'px';
          this.$nextTick(()=>{
            if(!this.picsScroll){
              this.picsScroll = new BScroll(this.$refs.photoP,{
                scrollX: true
              })
            }else{
              this.picsScroll.refresh();
            }
          })
        }
      },
      isCollection(event){
        if (!event._constructed) {
          return;
        }
        this.isFavorite = !this.isFavorite;
        this.favoriteText = this.isFavorite ? '已收藏':'收藏';
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .seller
    position: absolute
    top: 174px
    bottom:0
    left:0
    width: 100%
    overflow: hidden
    .seller-wrap
      .busInfo
        padding: 18px
        .tit
          border-1px(rgba(7, 17, 27, 0.1))
          h1
          font-size: 14px
          color: rgb(7, 17, 27)
          line-height: 14px
          .star-wrap
            margin-top: 8px
            font-size: 0
            padding-bottom: 18px
            .star
              display: inline-block
            .count
              font-size: 10px
              color: rgb(77, 85, 93)
              line-height: 18px
              margin-right: 12px
              vertical-align top
          .collection
            position: absolute
            top: 0
            right: 18px
            .icon-favorite
              font-size: 24px
              color:rgb(77,85,93)
              line-height: 24px
              margin-bottom: 4px
              text-align center
              &.on
                color:rgb(240,20,20)
            .text
              font-size:10px
              color:rgb(77,85,93)
              line-height: 10px

        .deliver
          padding-top: 18px
          display: flex
          .delivery
            flex: 1
            border-right: 1px solid rgba(7, 17, 27, 0.1)
            text-align: center
            &.no-border
              border-right: 0
            span
              display: block
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 10px
              margin-bottom: 4px
            p
              font-size: 24px
              font-weight: 200
              color: rgb(7, 17, 27)
              line-height: 24px
              i
                font-style: normal
                font-size: 10px
                color: rgba(7, 17, 27, 0.6)
      .notice
        padding: 18px
        .info
          .notice-tit
            font-size: 14px
            color: rgb(7, 17, 27)
            line-height: 14px
          .notice-text
            font-size: 12px
            font-weight: 200
            color: rgb(240, 20, 20)
            line-height: 24px
            padding 8px 12px 18px 12px
            border-1px(rgba(7, 17, 27, 0.1))
      .supports-wrap
        .supports-item
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-no()
            padding-bottom: 0
          .supportsList-icon
            display inline-block
            width: 16px
            height: 16px
            background-repeat no-repeat
            background-size 16px 16px
            &:last-child
              margin-bottom: 0
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .supportsList-text
            vertical-align top
            font-size 12px
            line-height: 16px
            font-weight: 200
            margin-left 6px
      .seller-photo
        padding 18px
        h1
          line-height: 14px
          color: rgb(7, 17, 27)
          font-size: 14px
        .photoP
          width:100%
          overflow hidden
          margin-top: 12px
          .photo-wrap
            .pics-item
              margin-right 6px
              float:left
              &:last-child
                margin-right:0
      .seller-news
        padding 18px
        h1
          line-height: 14px
          color: rgb(7, 17, 27)
          font-size: 14px
        .news-wrap
          margin-top: 12px
          .info-item
            padding 16px 0 16px 12px
            font-size: 12px
            font-weight: 200
            color:rgb(7,17,27)
            line-height: 16px
            border-1px(rgba(7,17,27,0.1))
            &:last-child
              border-no()
              padding-bottom:0
</style>
