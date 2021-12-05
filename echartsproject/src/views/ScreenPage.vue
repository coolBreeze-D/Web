<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img v-if="item == false" src="~assets/img/header_border_dark.png" alt="">
				<img v-else src="~assets/img/header_border_light.png" alt="">
      </div>
			<span class="title" :style="item == false?'':'color:black'" >电商平台实时监控系统</span>
      <div class="title-right">
        <img  v-if="item == false" src="~assets/img/qiehuan_dark.png" class="qiehuan" @click="handleChangeTheme()" >
				<img  v-else src="~assets/img/qiehuan_light.png" class="qiehuan" @click="handleChangeTheme()" >
        <span class="datetime" :style="item == false?'':'color:black'">{{this.datetime}}</span>
      </div>
    </header>
		
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top"  :class="[fullScreenStatus.trend?'fullscreen':'']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
					<div class="resize"  >
						<span :style="item == false?'':'color: #000000;'" @click="changeSize('trend')" :class="['iconfont' ,fullScreenStatus.trend? 'icon-compress-alt':'icon-expand-alt']"></span>
					</div>
        </div>
				
        <div id="left-bottom"  :class="[fullScreenStatus.seller?'fullscreen':'']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
					<div class="resize"  >
						<span :style="item == false?'':'color: #000000;'" @click="changeSize('seller')" :class="['iconfont' ,fullScreenStatus.seller? 'icon-compress-alt':'icon-expand-alt']"></span>
					</div>
        </div>
      </section>
			
      <section class="screen-middle">
        <div id="middle-top"  :class="[fullScreenStatus.maps?'fullscreen':'']">
          <!-- 商家分布图表 -->
          <Map ref="maps"></Map>
					<div class="resize"  >
						<span :style="item == false?'':'color: #000000;'" @click="changeSize('maps')" :class="['iconfont' ,fullScreenStatus.maps? 'icon-compress-alt':'icon-expand-alt']"></span>
					</div>
        </div>
				
        <div id="middle-bottom" :class="[fullScreenStatus.rank?'fullscreen':'']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
					<div class="resize"  >
						<span :style="item == false?'':'color: #000000;'" @click="changeSize('rank')" :class="['iconfont' ,fullScreenStatus.rank? 'icon-compress-alt':'icon-expand-alt']"></span>
					</div>
        </div>
      </section>
			
      <section class="screen-right" >
        <div id="right-top"  :class="[fullScreenStatus.hot?'fullscreen':'']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
					<div class="resize" >
						<span :style="item == false?'':'color: #000000;'" @click="changeSize('hot')" :class="['iconfont' ,fullScreenStatus.hot? 'icon-compress-alt':'icon-expand-alt']" ></span>
					</div>
        </div>
				
        <div id="right-bottom"  :class="[fullScreenStatus.stock?'fullscreen':'']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
					<div class="resize"  >
						<span :style="item == false?'':'color: #000000;'" @click="changeSize('stock')" :class="['iconfont' ,fullScreenStatus.stock? 'icon-compress-alt':'icon-expand-alt']"></span>
					</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from 'components/Hot.vue'
import Map from 'components/Map.vue'
import Rank from 'components/Rank.vue'
import Seller from 'components/Seller.vue'
import Stock from 'components/Stock.vue'
import Trend from 'components/Trend.vue'
import * as dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  name:'ScrrenPage',
	mounted() {
		//时钟
		this.timer = setInterval(() => {
			this.datetime = dayjs().format("YYYY-MM-DD HH:mm:ss")
		},1000)
	},
	beforeDestroy() {
		if(this.timer){
			clearInterval(this.timer)
		}
		
	},
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
	data() {
		return {
			//定义每一个图表的全屏样式
			fullScreenStatus:{
				trend:false,
				seller:false,
				maps:false,
				rank:false,
				hot:false,
				stock:false
				
			},
			//切换主题的定点
			item:false,
			
			//时钟
			timer:null,
			datetime:null
		}
	},
	methods:{
		changeSize(val){
			 this.fullScreenStatus[val] = !this.fullScreenStatus[val]
			 
			 //screenAdapter方法必须是fullScreenStatus对象中的改变且更新Dom后调用才有效
			 this.$nextTick(() => {
				 this.$refs[val].screenAdapter()
			 })
			 
		},
		
		handleChangeTheme(){
			this.$store.commit('changeTheme')
			this.item = !this.item
		}
		
	},
	computed:{
		containerStyle(){
			return this.item === false? "background-color: #161522;":"background-color:#eeeeee"
		},
		
		...mapState(['theme'])
	}
	
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
	
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
      img {
        width: 100%;
      }
    }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
			position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
