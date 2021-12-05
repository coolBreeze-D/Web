<template>
	<div class="com-container">
		<div class="title" :style="comStyle">
			<span>{{'▎' + showTitle}}</span>
			<span class="iconfont title-icon" @click="showChice = !showChice" :style="comStyle">&#xe6eb;</span>
			<div class="select-con" v-show="showChice" :style="marginStyle">
				<div class="select-item title-icon" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">{{item.text}}</div>
			</div>
		</div>
		<div class="com-chart" ref="trend_ref"></div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { getThemeValue } from '@/plugins/theme_utils.js'
	
	export default {
		name:'Trend',
		mounted() {
	    this.initChart()
			this.getData()
			window.addEventListener('resize',this.screenAdapter)
			
			//在屏幕第一次加载完成时，主动进行屏幕的适配
			this.screenAdapter()
		},
		destroyed() {
			//组件销毁时清除定时器
			clearInterval(this.timerId)

			//组件销毁时取消屏幕的适配
			window.removeEventListener('resize',this.screenAdapter)
		},
		data(){
			return {
				
				chartInstance:null,
				
				//请求存储的数据
				allData:[],
				
				//是否显示标题的可选项
				showChice:false,
				
				//显示的数据类型+-
				choiceType:'map',
				
				//指明标题的字体大小
				titleFontSize:null,
				
				//定时器标名
				timerId:null
				
			}
		},
		computed:{
			selectTypes(){
				if(!this.allData){
					return []
				}else{
					
					//console.log('cpmoute',this.allData.type)
					const typeArr = this.allData.type
					return typeArr
				}
			},
			
			showTitle(){
				if(!this.allData){
					return ''
				}else{
					return this.allData[this.choiceType].title
				}
			},
			
			//设置给标题的样式	
			comStyle () {
				return {
					fontSize:this.titleFontSize + 'px',
					color:getThemeValue(this.theme).titleColor
				}
			},
			
			//控制标题的左外边距
			marginStyle() {
				return {
					marginLeft: this.titleFontSize + 'px'
				}
			},
			
			...mapState(['theme'])
		},
		methods:{
			initChart(){
				this.chartInstance = this.$echarts.init(this.$refs.trend_ref,this.theme)
				const initOption = {
					grid:{
						left:'3%',
						top:'35%',
						right:'4%',
						bottom:'1%',
						containLabel:true
					},
					tooltip:{
						trigger:'axis'
					},
					legend:{
						left:20,
						top:'15%',
					  icon:'circle'
					},
					xAxis:{
						type:'category',
						boundaryGap:false
					},
					yAxis:{
						type:'value'
					}
				}
				this.chartInstance.setOption(initOption)
			},
			
			getData(){
				this.$http.get('trend.json').then(
				  response => {
						//console.log('获取数据成功',response.data)
						//存储的储存数据
						this.allData = response.data
						
						this.updateChart()		
						
					},
					error => {
						console.log('获取数据失败',error.message)
						
					}
				)
			},
		  
			//更新图表
			updateChart(){
				//半透明的颜色值
				const colorArr1 = [
					'rgba(11, 168, 44, 0.5)',
					'rgba(44, 110, 255, 0.5)',
					'rgba(22, 242, 217, 0.5)',
					'rgba(254, 33, 30, 0.5)',
					'rgba(250, 105, 0, 0.5)'
				]
				
				//全透明颜色值
				const colorArr2 = [
					'rgba(11, 168, 44, 0)',
					'rgba(44, 110, 255, 0)',
					'rgba(22, 242, 217, 0)',
					'rgba(254, 33, 30, 0)',
					'rgba(250, 105, 0, 0)'
				]
				
				
				//处理数据
				//类目轴的数据
				const timeArr = this.allData.common.month
        //y轴的数据 series下的数据
				const valueArr = this.allData[this.choiceType].data
				const seriesArr = valueArr.map((item,index) => {
					return {
						name:item.name,
						type:'line',
						data:item.data,
						stack:'this.choiceType',
						areaStyle:{
							color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
								{
									offset:0,
									color:colorArr1[index]
								},
								
								{ 
									offset:1,
									color:colorArr2[index]
								}
							]) 
						}
					}
				}) 
				
				//图例的数据
				const legendArr = valueArr.map(item => item.name)
				
				const dataOption = {
					xAxis:{
						data:timeArr
					},
					legend:{
						data:legendArr
					},
					series:seriesArr
				}
				
				this.chartInstance.setOption(dataOption)
				
			},
			
			//当浏览器的窗口大小发生变化的时候，会调用的方法，来完成屏幕的适配
			screenAdapter(){
				this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3
				
				const adapterOption = {
					legend:{
						itemWidth:this.titleFontSize,
						itemHeight:this.titleFontSize,
						itemGap: this.titleFontSize,
						textStyle:{
							fontSize: this.titleFontSize / 2
						}
					}
				}

				this.chartInstance.setOption(adapterOption)
				//手动调用resize事件，才能产生效果
				this.chartInstance.resize()
				
			},
			
			//手动显示下拉框
			handleSelect(currenType){
				this.choiceType = currenType
				this.updateChart()
				this.showChice = false
			},
		},
    watch: {
			theme(){
				//console.log('主题切换了')
				this.chartInstance.dispose()//销毁当前的图表
				this.initChart()//重新初始化图表对象
				this.screenAdapter()//完成屏幕的适配
				this.updateChart()//更新图表的展示
				
			}
    }
	}
</script>

<style lang="less" scoped>
	.title{
		position: absolute;
		top:1.25rem;
		z-index:10;
		color:white;
		margin-left: 20px;
		.title-icon{
			cursor:pointer;
		}
		
		.select-con{
			background-color: #222733;
		}
	}
</style>
