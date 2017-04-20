<template>
  <div class="shopcart" >
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrap">
          <div class="logo" :class="{'active':totalCount>0}">
            <span class="icon-shopping_cart"></span>
          </div>
          <div class="count" v-show="totalCount > 0">
            {{totalCount}}
          </div>
        </div>
        <div class="price" :class="{'active':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="goprice">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <!--<transition
      name="ballsMove"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-bind:css="false"
    >
      <div class="balls-wrap">
        <div v-for="ball in balls" v-show="ball.show" class="ball-item">
          <div class="inner inner-hook"></div>
        </div>
      </div>
    </transition>-->
   <transition name="myfold">
     <div class="shopcart-list" v-show="listShow">
       <div class="list-header clearfix">
         <h1 class="title">购物车</h1>
         <span class="empty" @click="empty">清空</span>
       </div>
       <div class="list-content" ref="listContent">
         <ul>
           <li v-for="food in selectFoods" class="food">
             <span class="name">{{food.name}}</span>
             <div class="price">
               ￥{{food.price*food.count}}
             </div>
             <div class="cartcontrol-wrap">
               <cartcontrol :food="food"></cartcontrol>
             </div>
           </li>
         </ul>
       </div>
     </div>
   </transition>
    <transition name="bg">
      <div class="list-bg" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll'
  import cartcontrol from '../../components/cartControl/cartControl.vue'
  export default {
    props: {
      selectFoods: {
        type: Array,
        default(){
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: true
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        moveBalls: [],
        isShow: true
      }
    },
    computed: {
      totalPrice(){
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount(){
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc(){
        let min = this.minPrice;
        let dis = min - this.totalPrice;
        if (this.totalPrice === 0) {
          return `￥${min}起送`;
        } else if (this.totalPrice < this.minPrice) {
          return `还差￥${dis}起送`;
        } else {
          return '去结算';
        }
      },
      payClass(){
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow(){
        if(!this.totalCount){
          this.isShow = true;
          return false;
        }
        let show  = !this.isShow;
        if(show){
          this.$nextTick(() =>{
            if(!this.scroll){
              this.scroll = new Bscroll(this.$refs.listContent,{
                click:true
              })
            }else{
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop(el){
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.moveBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el){
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = el.getBoundingClientRect();
            let x = rect.x - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.transform = el.style.webkitTransform = `translate3d(0,${y},0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.transform = inner.style.webkitTransform = `translate3d(${x},0,0)`;
          }
        }
      },
      enter(el, done){
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.transfrom = el.style.webkitTransform = `translate3d(0,0,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`;
        });
        done();
      },
      afterEnter(el){
        let ball = this.moveBalls.shift();
        if (ball) {
          ball.show = false;
          ball.style.display = 'none';
        }
      },
      toggleList(){
        if(!this.totalCount){
          return;
        }
        this.isShow = !this.isShow;
      },
      empty(){
        this.selectFoods.forEach((foods)=>{
          foods.count = 0;
        })
      },
      hideList(){
          this.isShow = true;
      },
      pay(){
          if(this.totalPrice < this.minPrice){
            return;
          }else{
              alert('支付'+this.totalPrice)
          }
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width: 100%
    height 48px
    background-color #000
    .content
      font-size: 0
      background-color #141d27
      display flex
      .content-left
        flex: 1
        .logo-wrap
          display inline-block
          position relative
          top: -10px
          margin 0 12px
          padding 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align top
          border-radius: 50%
          background-color #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background-color #ccc
            text-align center
            &.active
              background-color rgb(0, 160, 220)
              .icon-shopping_cart
                color: #fff
            .icon-shopping_cart
              font-size 24px
              color: #80858a
              line-height: 44px
        .count
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align center
          border-radius: 16px
          box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
          font-size: 9px
          font-weight: 700;
          background-color rgb(240, 20, 20)
          color: rgb(255, 255, 255)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height: 24px
          padding-right: 12px
          box-sizing border-box
          border-right: 1px solid rgba(255, 255, 255, .1)
          font-size 16px
          font-weight: 700
          color: rgba(255, 255, 255, .4)
          &.active
            color: #fff
        .goprice
          display inline-block
          vertical-align top
          margin 12px
          line-height: 24px
          box-sizing border-box
          font-size 10px
          font-weight: 200
          color: rgba(255, 255, 255, .4)
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          font-size 12px
          line-height: 48px
          height 48px
          font-weight: 700
          text-align center
          color: rgba(255, 255, 255, .4)
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color: #fff
    .balls-wrap
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .ball-item
        position fixed
        left: 32px
        bottom: 22px
        z-index: 200
        .inner
          width: 16px
          height: 16px
          border-radius 50%
          background-color rgb(0, 160, 220)
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)

    .shopcart-list
      position: absolute
      left: 0
      top: -0
      z-index -1
      width:100%
      transform: translateY(-100%)
      background-color #fff
      &.myfold-enter-active, &.myfold-leave-active
        transition: all .5s linear
      &.myfold-enter,&.myfold-leave-active
        transform: translateY(0)
      .list-header
        height: 40px
        padding 0 18px
        box-sizing border-box
        width:100%
        background-color #f3f5f7
        border-bottom 2px solid rgba(7, 17, 27, 0.1)
        .title
          font-size: 14px
          font-weight: 200
          color: rgb(7, 17, 27)
          line-height: 40px
          float left
        .empty
          float right
          font-size: 12px
          color: rgb(0, 160, 220)
          line-height: 40px
          display block
          width: 40px
          height:40px
          text-align center
      .list-content
        padding 0 18px
        background-color #fff
        max-height:217px
        overflow hidden
        .food
          position relative
          width: 100%
          height: 48px
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 48px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 114px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrap
            position: absolute
            right: 0
            bottom: 6px
    .list-bg
      position fixed
      left:0
      top:0
      z-index -2
      width:100%
      height 100%
      background-color rgba(7,17,27,.6)
      backdrop-filter:blur(10px)
      &.bg-enter-active,&.bg-leave-active
        transition: all .5s
      &.bg-enter,&.bg-leave-active
        opacity 0
</style>
