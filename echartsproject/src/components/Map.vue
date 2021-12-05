<template>
	<div class="com-container" @dblclick="revertMap">
		<div class="com-chart" ref="map_ref"></div>
	</div>
</template>

<script>
	import axios from 'axios'
	import { mapState } from 'vuex'
	
	//这个插件可以把中国中文省份转换为拼音
	import {getProvinceMapInfo} from '@/plugins/map_utils.js'
	
	export default {
		name: 'Trend',
		data() {
			return {
				chartInstance: null,
				//请求存储的数据
				allData: null,
				//缓存地图矢量数据
				mapData:{},
			}
		},
		mounted() {
			this.initChart()
			this.getData()
			window.addEventListener('resize', this.screenAdapter)
			this.screenAdapter()
		},
		destroyed() {
			window.removeEventListener('resize', this.screenAdapter)
		},
		methods: {
			initChart() {
				this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)

				this.$http.get('china.json').then(
					response => {
						//console.log('获取数据成功china', response.data)
						this.$echarts.registerMap('china', response.data)
						const initOption = {
							title: {
								text: "▎ 商家分布",
								left: 20,
								top: 20
							},
							geo: {
								type: 'map',
								map: 'china',
								top: '5%',
								bottom: '5%',
								itemStyle: {
									areaColor: '#2E72BF',
									borderColor: '#333'
								}
							},
							legend: {
								left: '5%',
								bottom: '5%',
								orient: 'vertical'

							}
						}
						this.chartInstance.setOption(initOption)
						
            this.chartInstance.on('click',async arg => {
							//arg.name 得到所点击的省份，这个省份是中文
							const provinceInfo = getProvinceMapInfo(arg.name)
							
							//console.log(provinceInfo)
							//判断当前所点击的这个省份的地图矢量数据在mapData中是否存在，存在后缓存数据不用再次渲染
							if(!this.mapData[provinceInfo.key]){
								const {data:ret} = await axios.get('http://localhost:8080' + provinceInfo.path)
								//console.log(ret)
								this.mapData[provinceInfo.key] = ret
								
								this.$echarts.registerMap(provinceInfo.key,ret)
							}
							
							const changeOption = {
								geo:{
									map:provinceInfo.key
								}
							}
							this.chartInstance.setOption(changeOption)
						})


					},
					error => {
						console.log('获取数据失败', error.message)
					}
				)


			},

			getData() {
				this.$http.get('map.json').then(
					response => {
						//console.log('获取数据成功map', response.data)
						//存储的储存数据
						this.allData = response.data

						this.updateChart()

					},
					error => {
						console.log('获取数据失败', error.message)

					}
				)
			},

			//更新图表
			updateChart () {
			  // 处理图表需要的数据
			  // 图例的数据
			  const legendArr = this.allData.map(item => {
			    return item.name
			  })
			  const seriesArr = this.allData.map(item => {
			    // return的这个对象就代表的是一个类别下的所有散点数据
			    // 如果想在地图中显示散点的数据, 我们需要给散点的图表增加一个配置, coordinateSystem:geo
			    return {
			      type: 'effectScatter',
			      rippleEffect: {
			        scale: 5,
			        brushType: 'stroke'
			      },
			      name: item.name,
			      data: item.children,
			      coordinateSystem: 'geo'
			    }
			  })
			  const dataOption = {
			    legend: {
			      data: legendArr
			    },
			    series: seriesArr
			  }
			  this.chartInstance.setOption(dataOption)
			},

			//当浏览器的窗口大小发生变化的时候，会调用的方法，来完成屏幕的适配
			screenAdapter () {
			  const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
			  const adapterOption = {
			    title: {
			      textStyle: {
			        fontSize: titleFontSize
			      }
			    },
			    legend: {
			      itemWidth: titleFontSize / 2,
			      itemHeight: titleFontSize / 2,
			      itemGap: titleFontSize / 2,
			      textStyle: {
			        fontSize: titleFontSize / 2
			      }
			    }
			  }
			  this.chartInstance.setOption(adapterOption)
			  this.chartInstance.resize()
			},
			
			//双击，返回中国地图
			revertMap(){
				const reverOption = {
					geo:{
						map:'china'
					}
				}
				this.chartInstance.setOption(reverOption)
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

</style>
