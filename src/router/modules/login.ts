// // 1号布局
// import layout1 from '/@/layout/layout1/index.vue';
//首页
const login = {
	path: '/',
	name: 'login',
	// component: layout1,
	redirect: '/login/register',
	children: [
		{
			path: '/login/register',
			name: 'register',
			component: () => import('/@/layout/login/index.vue'),
			meta: { title: '注册登录' },
		},
	],
};

export default login;
