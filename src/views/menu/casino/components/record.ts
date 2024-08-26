export const gameMenu = [
	{
		icon: 'dat_icon',
		name: '大厅',
		tab: '',
		active: true,
		// params: {}
	},
	{
		icon: 'rm_mr_icon',
		name: '热门游戏',
		tab: 'hot',
		active: false,
	},
	{
		icon: 'xsyx_mr_icon',
		name: '最新游戏',
		tab: 'new',
		active: false,
	},

	{
		icon: 'dzyx_icon',
		name: '电子游戏',
		tab: 'electronic',
		active: false,
	},
	{
		icon: 'slot_machine',
		name: '老虎机',
		tab: 'slots',
		active: false,
	},
	{
		icon: 'live_casino',
		name: '真人娱乐场',
		tab: 'live',
		active: false,
	},
	{
		icon: 'zs_mr_icon',
		name: '桌上游戏',
		tab: 'table-game',
		active: false,
	},
];

export const gameGroupCardList: any = [
	{
		id: '',
		collect: false, //是否收藏
		status: 1, //是否维护 //1:开启中,2:维护中,3:已禁用
		remark: '',
		name: '游戏名称',
		maintenanceStartTime: '10.30 00:00',
		sort: null,
		maintenanceEndTime: '10.31 23:59',
		pcIcon: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
	},

];
