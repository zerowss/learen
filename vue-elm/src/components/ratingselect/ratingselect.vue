<template>
  <div class="ratingselect">
    <div class="ratings-type border-1px">
      <span class="qb" @click="select(2,$event)"
            :class="{'on': selType === 2}"><em>{{desc.all}}</em> <i>{{ratings.length}}</i> </span>
      <span class="tj" @click="select(0,$event)" :class="{'on': selType === 0}"><em>{{desc.positive}}</em> <i>{{positiveCount}}</i></span>
      <span class="tc" @click="select(1,$event)" :class="{'on': selType === 1}"><em>{{desc.negative}}</em> <i>{{negativeCount}}</i></span>
    </div>
    <div class="switch" @click="isOnlyContent($event)">
      <span class="icon-check_circle" :class="{'active':isCount}"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    data(){
      return {
        ratingList: [],
        isCount: this.onlyContent,
        selType: this.selectType
      }
    },
    props: {
      ratings: {
        type: Array,
        default(){
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default(){
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positiveCount(){
        let num = 0;
        this.ratings.forEach(function (item, i) {
          if (item.rateType === POSITIVE) {
            num++
          }
        });
        return num;
      },
      negativeCount(){
        let num = 0;
        this.ratings.forEach(function (item, i) {
          if (item.rateType === NEGATIVE) {
            num++
          }
        });
        return num;
      }
    },
    methods: {
      isOnlyContent(event){
        if (!event._constructed) {
          return;
        }
        this.isCount = !this.isCount;
        this.$root.eventHub.$emit('toggleContent',this.isCount);
      },
      select(type, event){
        if (!event._constructed) {
          return;
        }
        this.selType = type;
        this.$root.eventHub.$emit('ratingsType',type);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    .ratings-type
      margin: 0 18px
      padding: 18px 0
      font-size: 0
      border-1px(rgba(7, 17, 27, 0.1))
      span
        display inline-block
        padding 8px 12px
        font-size: 12px
        line-height: 16px
        margin-right 8px
        border-radius: 1px
        &.qb
          background-color rgba(0, 160, 220, 0.6)
          color: rgb(77, 85, 93)
          &.on
            background-color rgb(0, 160, 220)
            color: #fff
        &.tj
          color: rgb(77, 85, 93)
          background-color rgba(0, 160, 220, 0.2)
          &.on
            background-color rgb(0, 160, 220)
            color: #fff
        &.tc
          color: rgb(77, 85, 93)
          background-color rgba(77, 85, 93, 0.2)
          &.on
            background-color rgb(77, 85, 93)
            color: #fff
        i
          display inline-block
          vertical-align bottom
          font-size 8px
          font-style normal
        em
          display inline-block
          vertical-align middle
          font-style normal
          margin-right 2px
    .switch
      height: 24px
      border-bottom: 2px solid rgba(7, 17, 27, 0.1)
      font-size: 0
      padding 12px 18px
      .icon-check_circle
        display inline-block
        font-size: 24px
        color: rgb(147, 153, 159)
        line-height: 24px
        &.active
          color rgb(0, 160, 220)
      .text
        display inline-block
        margin-left 4px
        font-size: 12px
        color: rgb(147, 153, 159)
        line-height: 24px
        vertical-align top
</style>
