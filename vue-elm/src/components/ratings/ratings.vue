<template>
  <div class="ratings" ref="ratingsWrap">
    <div class="ratingsWrap">
      <div class="rating-score">
        <div class="left">
          <p class="score">{{seller.score}}</p>
          <p class="scoreAll">综合评分</p>
          <p class="scoreSide">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="right">
          <ul>
            <li class="rightList clearblock">
              <span class="text">服务态度</span>
              <div class="startWrap">
                <start :score="seller.serviceScore" :size="36"></start>
              </div>
              <span class="rightListScore">{{seller.serviceScore}}</span>
            </li>
            <li class="rightList clearblock">
              <span class="text">商品评分</span>
              <div class="startWrap">
                <start :score="seller.foodScore" :size="36"></start>
              </div>
              <span class="rightListScore">{{seller.foodScore}}</span>
            </li>
            <li class="rightList clearblock">
              <span class="text">送达时间</span>
              <span class="rightListScore co">{{seller.deliveryTime}}分钟</span>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"></ratingselect>
      <div class="list-wrap">
        <ul>
          <li v-for="rating in ratings" class="ratings-item border-1px"
              v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" alt="" width="28" height="28">
            </div>
            <div class="rating-content">
              <h3>{{rating.username}}</h3>
              <div class="rating-pf">
                <start :size="24" :score="rating.score"></start>
                <span v-show="rating.deliveryTime" class="pf-deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <div class="text">
                {{rating.text}}
              </div>
              <div class="shop">
                <span :class="{'icon-thumb_down':rating.rateType === 1,'icon-thumb_up':rating.rateType === 0}"></span>
                <span class="shop-list">
                  <i v-for="item in rating.recommend">
                    {{item}}
                  </i>
                </span>
              </div>
              <div class="dTime">
                {{rating.rateTime}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import start from '../../components/star/star.vue'
  import split from '../../components/split/split.vue'
  import ratingselect from '../../components/ratingselect/ratingselect.vue'
  const ERR_OK = 0;
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data(){
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    created(){
      this.$http.get('./api/ratings').then((response) => {
        response = response.body;
        if (response.errno == ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.ratingsScroll = new BScroll(this.$refs.ratingsWrap, {
              click: true
            });
          })
        }
      });

      this.$root.eventHub.$on('toggleContent', (isCount) => {
        this.onlyContent = isCount;
        this.$nextTick(() => {
          if (!this.ratingsScroll) {
            this.ratingsScroll = new BScroll(this.$refs.ratingsWrap);
          } else {
            this.ratingsScroll.refresh();
          }
        })
      });
      this.$root.eventHub.$on('ratingsType', (type) => {
        this.selectType = type;
        this.$nextTick(() => {
          if (!this.ratingsScroll) {
            this.ratingsScroll = new BScroll(this.$refs.ratingsWrap);
          } else {
            this.ratingsScroll.refresh();
          }
        })
      });
    },
    methods: {
      needShow(type, text){
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    components: {
      start,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .ratings
    position fixed
    top: 174px
    bottom: 0
    width: 100%
    overflow hidden
    .rating-score
      padding: 18px 0
      display: flex
      .left
        flex: 0 0 137px
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        padding: 6px 0
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          font-size: 24px
          color: rgb(255, 153, 0)
          line-height: 28px
          margin-bottom: 6px
        .scoreAll
          font-size: 12px
          color: rgb(7, 17, 27)
          line-height: 12px
          margin-bottom: 8px
        .scoreSide
          font-size: 10px
          color: rgba(7, 17, 27, 0.5)
          line-height: 10px
      .right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .rightList
          margin-bottom: 8px
          span
            float: left
            margin-right: 12px
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 18px
            @media only screen and (max-width: 320px)
              margin-right: 6px
            &.startWrap
              float: left
              margin-right: 12px
              @media only screen and (max-width: 320px)
                margin-right: 6px
            &.rightListScore
              margin-right: 0
              font-size: 12px
              color: rgb(255, 153, 0)
              line-height: 18px
              &.co
                color: rgb(147, 153, 159)
    .list-wrap
      padding: 0 18px
      .ratings-item
        padding 18px 0
        border-1px(rgba(147, 153, 159, 0.1))
        display: flex
        .avatar
          flex: 0 0 28px
          img
            border-radius: 50%
        .rating-content
          flex: 1
          margin-left: 12px
          position: relative
          h3
            font-size: 10px
            color: rgb(7, 17, 27)
            line-height: 12px
          .rating-pf
            margin: 4px 0 6px 0
            font-size: 0
            .star
              display: inline-block
            .pf-deliveryTime
              margin-left: 6px
              font-size: 10px
              font-weight: 200
              color: rgb(147, 153, 159)
              line-height: 12px
          .text
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 18px
            margin-bottom: 8px
            font-weight: 400
          .shop
            font-size: 0
            .icon-thumb_down, .icon-thumb_up
              display: inline-block
              font-size: 12px
              line-height: 16px
              margin-right: 8px
              color: rgb(183, 187, 191)
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .shop-list
              display: inline-block
              i
                display: inline-block
                font-size: 9px
                color: rgb(147, 153, 159)
                font-style: normal
                margin-right: 8px
                line-height: 16px
                padding: 0 6px
                border: 1px solid rgba(7, 17, 27, 0.1)
                border-radius: 1px

          .dTime
            position: absolute
            right: 18px
            top: 0
            font-size: 10px
            font-weight: 200
            line-height: 12px
            color: rgb(147, 153, 159)


</style>
