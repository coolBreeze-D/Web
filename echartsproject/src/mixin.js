<template>
	<div class="com-container" >
		地区销量排行榜
		<div class="com-chart" ref="rank_ref"></div>
	</div>
	
</template>

<script>
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
		  //clearInterval(this.timerId)
			
			//组件销毁时取消屏幕的适配
			window.removeEventListener('resize', this.screenAdapter)
		},
		data() {
			return {
		    //图表初始化对象
				chartInstance: null,
		
				//请求存储的数据
				allData: [],
		
				//定时器标名
				timerId:null
		
			}
		},
		methods:{
			initChart(){
				this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
				const initOption = {}
				this.chartInstance.setOption(initOption)
			},
			
			getData() {
				this.$http.get('rank.json').then(
					response => {
						console.log('获取数据成功map', response.data)
						//存储的储存数据
						this.allData = response.data
				
						this.updateChart()
				
					},
					error => {
						console.log('获取数据失败', error.message)
				
					}
				)
			},
			
			updateChart(){
				
				const dataOption = {}
				this.chartInstance.setOption(dataOption)
			},
			
			
			screenAdapter(){
				
				const adapterOption = {}
				this.chartInstance.setOption(adapterOption)
				//调用resiz()方法，能自动计算窗口大小
				this.chartInstance.resize()	
			}
			
			
		}
		
		
		
	}
</script>

<style>
</style>
