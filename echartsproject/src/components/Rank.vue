<template>
	<div class="com-container" >
		<div class="com-chart" ref="rank_ref"></div>
	</div>
	
</template>

<script>
	import { mapState } from 'vuex'
	
	export default {
		name:'Rank',
		mounted() {
			this.initChart()
			this.getData()
			window.addEventListener('resize', this.screenAdapter)
		
			//在屏幕第一次加载完成时，主动进行屏幕的适配
			this.screenAdapter()
		},
		destroyed() {
			//组件销毁时清除定时器
		  clearInterval(this.timerId)
			
			//组件销毁时取消屏幕的适配
			window.removeEventListener('resize', this.screenAdapter)
		},
		data() {
			return {
		    //图表初始化对象
				chartInstance: null,
		
				//请求存储的数据
				allData: [],
				
				//区域缩放的起点值
				startValue:0,
				
				//区域缩放的终点值
				endValue:9,
		
				//定时器标识
				timerId:null
		
			}
		},
		methods:{
			initChart(){
				this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
				const initOption = {
					title:{
						text:'▎ 地区销售排行',
						left: 20,
						top: 20
					},
					grid:{
						top:'40%',
						left:'5%',
						right:'5%',
						bottom:'5%',
						containLabel:true
					},
					tooltip:{
						show:true
					},
					xAxis:{
						type:'category'
					},
					yAxis:{
						type:'value'
					},
					series:[
						{
							type:'bar'
						}
					]
						
					
				}
				this.chartInstance.setOption(initOption)
				
				//对图表对象进行鼠标移入、移除事件的监听
				this.chartInstance.on('mouseover',() => 
						clearInterval(this.timerId)
				)
				this.chartInstance.on('mouseout',() => {
						this.startInterval()
				})
			},
			
			getData() {
				this.$http.get('rank.json').then(
					response => {
						//console.log('获取数据成功rank', response.data)
						//存储的储存数据
						this.allData = response.data
						this.allData.sort((a,b) => b.value-a.value)
				
						this.updateChart()
						this.startInterval()
				
					},
					error => {
						console.log('获取数据失败', error.message)
				
					}
				)
			},
			
			updateChart(){
				const colorArr = [
					['#0BA82C', '#4FF778'],
					['#2E72BF', '#23E5E5'],
					['#5052EE', '#AB6EE5']
				]
				
				//所以省份所形成的数组
				const provinceArr = this.allData.map(item => item.name)
				//所以省份对应的销售金额
				const valueArr = this.allData.map(item => item.value)
				
				const dataOption = {
					xAxis:{
						data:provinceArr
					},
					dataZoom:{
						show:false,
						startValue:this.startValue,
						endValue:this.endValue
					},
					series:[
						{
							data:valueArr,
							itemStyle:{
								color:arg => {
									let targetColorArr = null
									if(arg.value> 300){
										targetColorArr = colorArr[0]
									}else if(arg.value> 200){
										targetColorArr = colorArr[1]
									}else{
										targetColorArr = colorArr[2]
									}
									return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
										{
											offset: 0,
											color:targetColorArr[0]
										},
										{
											offset: 1,
											color:targetColorArr[1]
										}
									])
								}
							}
						},
					]
				}
				this.chartInstance.setOption(dataOption)
			},
			
			//屏幕适配
			screenAdapter(){
				const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
				
				const adapterOption = {
					title:{
						textStyle:{
							fontSize:titleFontSize
						}
					},
					series:[
						{
							barWith:titleFontSize,
							itemStyle:{
								barBorderRadius:[titleFontSize/1.3, titleFontSize/1.3, 0, 0]
							}
						}
					]
				}
				
				this.chartInstance.setOption(adapterOption)
				//调用resiz()方法，能自动计算窗口大小
				this.chartInstance.resize()	
			},
			
			
			//定义定时器
			startInterval(){
				if(this.timerId){
					clearInterval(this.timerId)
				}
				
				this.timerId = setInterval(() =>{
					this.startValue++
					this.endValue++
					if(this.endValue > this.allData.length - 1){
						this.startValue = 0
						this.endValue = 9
					} 
					this.updateChart()
				},1000)
			}
			
		},
    computed: {
  	...mapState(['theme'])
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

<style>
</style>
