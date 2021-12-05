import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const ScreenPage = () => import('views/ScreenPage')

const routes = [
  {
   	path:'',
   	redirect:'/screenPage'//页面默认路径,也可用于重定向
  },
	{
		path:'/screenPage',
		component:ScreenPage,
	}
	
]

const router = new VueRouter({
	base:process.env.BASE_URL,
  routes
})

export default router
