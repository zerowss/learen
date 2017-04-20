<template>
  <div class="cartControl">
    <transition name="fade">
      <div class="del icon-remove_circle_outline" v-show="food.count > 0" @click.stop.prevent="delFoods">
        <span></span>
      </div>
    </transition>
    <div class="count" v-show="food.count > 0">{{food.count}}</div>
    <div class="add icon-add_circle" @click.stop.prevent="addFoods"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addFoods(event){
        if (!event._constructed)return
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++;
        }
        this.$root.eventHub.$emit('cartAdd',event.target);
      },
      delFoods(event){
        if (!event._constructed)return;
        this.food.count--;
        if(this.food.count < 0){
          this.food.count = 0;
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartControl
    font-size: 0
    .del, .add
      display: inline-block
      padding 6px
      font-size: 24px
      line-height: 24px
    .count
      display: inline-block
      width: 24px
      font-size: 10px
      color: rgb(147, 153, 159)
      line-height: 36px
      text-align center
      vertical-align top
      height 36px
    .add
      color rgb(0, 160, 220)
    .del
      &.fade-enter-active, &.fade-leave-active
        transition: all .3s linear
      &.fade-enter, &.fade-leave-active
        transform:translateX(24px) rotateZ(180deg)
        opacity: 0
</style>
