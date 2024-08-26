//首页
const walletRoute = {
	path: '/wallet',
	name: 'wallet',
	component: () => import('/@/layout/layout1/layout1.vue'),
	redirect: '/wallet/assets',
	children: [
		{
			path: '/wallet/assets',
			name: 'my',
			component: () => import('/@/views/wallet/layout/wallet.vue'),
			meta: { title: '钱包' },
			redirect: '/wallet/assets',
			children: [
				{
					path: '/wallet/assets',
					name: 'assets',
					component: () => import('/@/views/wallet/views/assets/assets.vue'),
					meta: { title: '资产' },
				},
				{
					path: '/wallet/deposit',
					name: 'deposit',
					component: () => import('/@/views/wallet/views/deposit/deposit.vue'),
					meta: { title: '充值' },
				},
				{
					path: '/wallet/withdraw',
					name: 'withdraw',
					component: () => import('/@/views/wallet/views/withdraw/withdraw.vue'),
					meta: { title: '提现' },
				},
				{
					path: '/wallet/transaction',
					name: 'transaction',
					component: () => import('/@/views/wallet/views/transaction/transaction.vue'),
					meta: { title: '交易记录' },
				},
				{
					path: '/wallet/bettingRecord',
					name: 'bettingRecord',
					component: () => import('/@/views/wallet/views/bettingRecord/index.vue'),
					meta: { title: '投注记录' },
				},
			],
		},
	],
};

export default walletRoute;
