<template>
  <div class="goods">
    <div class="menu-wrap" ref="menuWrap">
      <ul class="menu-content">
        <li v-for="(item,index) in goods" class="goods-item" :class="{'current': currentIndex == index}"
            @click="selectMenu(index,$event)">
          <span class="tit border-1px">
            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrap" ref="foodsWrap">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul class="food-list-content">
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon">
                <img :src="food.icon" width="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="nowPrice">￥{{food.price}}</span><span class="oldPrice"
                                                                     v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartControl-wrap">
                  <cartControl :food="food"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"
              ref="shopcartball"></shopcart>
    <food :food="selectedFood" ref="selFood"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart.vue'
  import cartControl from '../cartControl/cartControl.vue'
  import food from '../food/food.vue'
  const ERR_OK = 0;
  import data from '../../../data.json'

  console.log(data)
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data(){
      return {
        goods: [],
        listHeights: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    created() {
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno == ERR_OK) {
          this.goods = response.data;

        }
      });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    },
    mounted(){
      this.$nextTick(() => {
        this._initScroll();
        this._calculateHeight();
        this.$root.eventHub.$on('cartAdd', (target) => {
          this._drop(target);
        })
      })
    },
    computed: {
      currentIndex(){
        for (let i = 0; i < this.listHeights.length; i++) {
          let hei1 = this.listHeights[i];
          let hei2 = this.listHeights[i + 1];
          if (!hei2 || (this.scrollY >= hei1 && this.scrollY < hei2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    methods: {
      _initScroll(){
        this.menuScroll = new Bscroll(this.$refs.menuWrap, {
          click: true
        });
        this.foodsScroll = new Bscroll(this.$refs.foodsWrap, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight(){
        let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
        let hei = 0;
        this.listHeights.push(hei);
        for (let i = 0; i < foodList.length; i++) {
          hei += foodList[i].clientHeight;
          this.listHeights.push(hei);
        }
      },
      selectMenu(index, event){
        if (!event._constructed)return;
        let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      _drop(target){
        this.$refs.shopcartball.drop(target);
      },
      selectFood(food, $event){
        if (!$event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.selFood.flag();
      }
    },
    components: {
      shopcart,
      cartControl,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    position absolute
    top: 174px
    bottom: 46px
    display flex
    width: 100%
    overflow hidden
    .menu-wrap
      flex: 0 0 80px
      width: 80px
      background-color #f3f5f7
      .goods-item
        display: table
        height: 54px
        width: 56px
        padding 0 12px
        line-height: 14px
        &.current
          position relative
          margin-top -1px
          z-index 10
          background-color #fff
          .tit
            font-weight: 700;
            border-no()
        .tit
          display table-cell
          vertical-align middle
          font-size: 12px
          font-weight: 200
          color: rgb(7, 17, 27)
          text-align center
          border-1px(rgba(7, 17, 27, .1))
          .icon
            display: inline-block
            width: 12px
            height: 12px
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')

    .foods-wrap
      flex: 1
      .food-list
        .title
          padding-left 14px
          height: 26px
          line-height: 26px
          background-color #f3f5f7
          font-size: 12px
          border-left 2px solid #d9dde1
          color: rgb(147, 153, 159)
        .food-list-content
          .food-item
            margin 18px
            border-1px(rgba(7, 17, 27, 0.1))
            display flex
            padding-bottom 18px
            &:last-child
              border-no()
              margin-bottom 0
            .icon
              flex: 0 0 57px
            .content
              flex: 1
              margin-left 10px
              padding-top 2px
              .name
                font-size 14px
                color: rgb(7, 17, 27)
              .description
                font-size: 10px
                color: rgb(147, 153, 159)
                line-height: 12px
                margin 8px 0
              .extra
                span
                  font-size: 10px
                  color: rgb(147, 153, 159)
                  line-height: 10px
                  margin-right 12px
              .price
                line-height: 24px
                .nowPrice
                  font-size: 14px
                  color: rgb(240, 20, 20)
                  font-weight: 700
                  margin-right: 8px
                .oldPrice
                  font-size: 10px
                  color: rgb(147, 153, 159)
                  font-weight: normal
                  margin-right: 8px
              .cartControl-wrap
                position: absolute
                right: 0
                bottom: 0

</style>
