<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <ul>
        <li v-for="item in $store.state.cartList">
          {{ item }}
        </li>
      </ul>
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-images-info :images-info="detailsInfo" @load="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <Detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailImagesInfo from "@/views/detail/childComps/DetailImagesInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";

import {getDetail, Goods, Shop, GoodsParams, getRecommend} from "@/network/detail";
import {debounce} from "@/common/utils";
import {itemListenerMixin} from "@/common/mixin";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImagesInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailsInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
      isShowBackTop: false
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部的图片轮播数据
      // console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailsInfo = data.detailInfo;

      // 5.获取参数信息
      this.paramInfo = new GoodsParams(data.itemParams.info, data.itemParams.rule)

      // 6.取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // 第一次获取：值不对
      // 原因：this.$refs.params.$el压根没有渲染
      // this.themeTopYs = []
      //
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //
      // console.log(this.themeTopYs);


      // 第二次获取：值不对
      // 原因：图片没有计算在内
      this.$nextTick(() => {
        // 根据最新的数据，对应的dom已经渲染出来了
        // 但是图片依旧是没有加载完（目前获取到的offsetTop不包含其中的图片）
        // this.themeTopYs = []
        //
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //
        // console.log(this.themeTopYs);
      })
    })

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
    // 4.
    // this. getThemeTopY= debounce(() => {
    //   this.themeTopYs = []
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    //
    //   console.log(this.themeTopYs);
    // }, 1000)
  },
  methods: {
    imageLoad() {
      // this.$refs.scroll.refresh()
      this.refresh()

      // this.itemImgListLoad()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE)

      console.log(this.themeTopYs);
    },
    contentScroll(position) {
      // 获取y值
      const positionY = -position.y

      // position和主题中的值进行对比
      let length = this.themeTopYs.length
      for (let i = 0; i < length - 1; i++) {
        // if (this.currentIndex !== i && ((i < length - 1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY > this.themeTopYs[i]))) {
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    addToCart() {
      // 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 将商品添加到购物车里面
      this.$store.commit('addCart', product)
    }
  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListLoad)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}

</style>
