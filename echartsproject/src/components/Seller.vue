<!-- 商家销量统计的横向柱状图 -->
<template>
	<div class="com-container">
		<div class="com-chart" ref="seller_ref">hello world</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	
	export default{
		name:'Seller',
		data(){
			return {
				chartInstance:null,
				
				//请求存储的数据
				allData:null,
				
				//当前显示页数
				currentPage:1,
				
				//一共多少页
				totalPage:0,
				
				//图定时器标名
				timerId:null,
				
				//适配屏幕定时器标名
				//timerKeep:null
				
				
			}
		},
		mounted() {
			this.initChart()
			this.getData()
			window.addEventListener('resize',this.screenAdapter)
			
			//在屏幕第一次加载完成时，主动进行屏幕的适配
			this.screenAdapter()
		},
		destroyed() {
			clearInterval(this.timerId)
			
			
			//组件销毁时取消屏幕的适配
			window.removeEventListener('resize',this.screenAdapter)
		},
		methods:{
			//初始化echartInstance对象
			initChart(){
				 this.chartInstance = this.$echarts.init(this.$refs.seller_ref,this.theme)
				 //对图表初始化配置的控制
				 const initOption = {
					 title:{
					 	text:'▎商家销售统计',
					 	left:20,
					 	top:20
					 },
					 grid:{
					 	top:'20%',
					 	left:'3%',
					 	right:'6%',
					 	bottom:'3%',
					 	containLabel:true
					 },
					 xAxis:{
					 	type:'value'
					 },
					 yAxis:{
					 	type:'category',
					 },
					 tooltip:{
					 	trigger:'axis',
					 	axisPointer:{
					 		type:'line',
					 		z:0,
					 		lineStyle:{
					 			color:'#2D3443'
					 		}
					 	}
					 },
					 series:[
					 	{
					 		type:'bar',
					 		lable:{
					 			show:true,
					 			position:'right',
					 			textStyle:{
					 				color:'white'
					 			}
					 		},
					 		itemStyle:{
					 			//指明颜色渐变的方向，指明不同百分比之下颜色的值
					 			color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[
					 				// bar百分之0状态下的颜色值
					 				{
					 					offset:0,
					 					color:'#5052EE'
					 				},
					 				// bar百分之100状态下的颜色值
					 				{
					 					offset:1,
					 					color:'#AB6EE5'
					 				}
					 			])
					 		}
					 	}
					 ]
				 }
				 this.chartInstance.setOption(initOption)
				 
				 //对图表对象进行鼠标移入、移除事件的监听
				 this.chartInstance.on('mouseover',() => {
					 clearInterval(this.timerId)
				 })
				 this.chartInstance.on('mouseout',() => {
					 this.startInterval()
				 })
				
			},
			
			//获取服务器的数据
			 getData(){
				  this.$http.get('seller.json').then(
					  response => {
							//console.log('获取数据成功',response.data)
							//存储的储存数据
							this.allData = response.data
							
							//对存储得数据值进行从小到大的排序
							this.allData.sort((a,b) => a.value-b.value)
							
							//设置每5元素显示一页,总共totalPage页
							this.totalPage = this.allData.length % 5 === 0? this.allData.length/5 : this.allData.length/5 + 1
							//console.log(this.totalPage)
							this.updateChart()
							
							this.startInterval()
							
						},
						error => {
							console.log('获取数据失败',error.message)
							
						}
					)
					
			},
			
			//更新图表
			updateChart(){
				//选取this.allData中的5组元素
				let start = (this.currentPage - 1)*5
				let end = this.currentPage*5
        const showData = this.allData.slice(start,end)
								
				//绘表				
				const sellerNames = showData.map(item =>  item.name)
				const sellerValues = showData.map(item => item.value)
				
				const dataOption = {
					yAxis:{
						data: sellerNames
					},
					series:[
						{
							data: sellerValues,
						}
					],
				}
				
				this.chartInstance.setOption(dataOption)
			},
			
			//定义定时器
			startInterval(){
				this.timerId = setInterval(() =>{
					this.currentPage++
					if(this.currentPage > this.totalPage){
						 this.currentPage = 1
						 
					}
					//console.log(this.currentPage)
					this.updateChart()
				},3000)
			},
			
			//当浏览器的窗口大小发生变化的时候，会调用的方法，来完成屏幕的适配
			screenAdapter(){
				const titleFontSize = this.$refs.seller_ref.offsetWidth/100 * 3.6
				//console.log(titleFontSize)
				
				//和分辨率大小相关的配置项
				const adapterOption = {
					title:{
						textStyle:{
							fontSize:titleFontSize
						},
						left:20,
						top:20
					},
					tooltip:{
						axisPointer:{
							lineStyle:{
								width:titleFontSize,
								
							}
						}
					},
					series:[
						{
							barWidth:titleFontSize,
							itemStyle:{
								barBorderRadius:[0,titleFontSize/2,titleFontSize/2,0],
							}
						}
					],
				}
				
				this.chartInstance.setOption(adapterOption)
				//手动调用resize事件，才能产生效果
				this.chartInstance.resize()
				
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

<style lang="less" scoped>
	@import url('assets/css/global.less');
	

</style>
