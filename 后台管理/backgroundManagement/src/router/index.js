import Login from '@/components/login/login'
//import Main from '@/components/main/main'
import Screen from '@/components/screen/screen'
import Main from '@/components/main/main'
import MainTable from '@/components/mainTable/mainTable'
import Detail from '@/components/detail/detail'

export default [
		{
	      path: '/',
	      component: Main,
	      children:[
	      	 { path: '/', component:MainTable,name:'MainTable'},
	      	 { path:'/screen',component:Screen,name:'screen'},
	      	 { path:'/detail',component:Detail,name:'detail'}
	      ]
	    },
	    {
	    	path:'/login',
	    	component:Login,
	    	name:'login'
	    }
]
