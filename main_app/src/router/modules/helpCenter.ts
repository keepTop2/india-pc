//1号页头页脚布局
import layout1 from '/@/layout/layout1/layout1.vue';
// import { helpCenterImg } from '/@/views/helpCenter/layout1/image';

//我的布局
import helpCenterlayout1 from '/@/views/frontPage/helpCenter/layout1/index.vue';

const helpCenter = {
	path: '/helpCenter',
	name: 'helpCenter',
	component: layout1,
	redirect: '/helpCenter/layout1',
	meta: { title: '1号布局' },
	children: [
		{
			path: '/helpCenter/layout1',
			name: 'helpCenter',
			component: helpCenterlayout1,
			meta: { title: '我的布局' },
			redirect: '/frontPage/helpCenter',
			children: [
				{
					path: '/helpCenter/registerLogin',
					name: 'registerLogin',
					component: () => import('/@/views/frontPage/helpCenter/views/content/registerLogin/registerLogin.vue'),
					meta: { title: '注册登录' },
				},
				{
					path: '/frontPage/helpCenter',
					name: 'userAgreement',
					component: () => import('/@/views/frontPage/helpCenter/views/content/userAgreement/userAgreement.vue'),
					meta: { title: '用户协议' },
				},
				{
					path: '/helpCenter/contactUs',
					name: 'contactUs',
					component: () => import('/@/views/frontPage/helpCenter/views/content/contactUs/contactUs.vue'),
					meta: { title: '联系我们' },
				},
			],
		},
	],
};

export default helpCenter;
