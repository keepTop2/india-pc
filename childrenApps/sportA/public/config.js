/*
 * @Author: wangmingxin
 * @Description: 请填写简介
 */
window.PLATFROM_CONFIG = {
	//打包编译后的http请求地址(运维专用)
	productionBaseURL: "http://192.168.30.72:7900",
	// 打包编译后的文件上传地址(运维专用)
	productionFileUrl: "http://192.168.26.30:9700",
	//体育打包编译后地址(运维专用)
	productionSportUrl: "https://apistaging.wx7777.com",
	/** s128 打包编译后地址(运维专用) */
	productionS128Url: "https://kss.cfb2.net",

	//运维专用访问子应用1dist包
	demoApp1Url: "/demo_app1",
	//运维专用访问子应用2dist包
	demoApp2Url: "/demo_app2",

	developmentBaseURL: "https://gw.playesoversea.pro", //临时使用测试环境
	// developmentBaseURL: "https://gw.playesoversea.store", // 开发环境
	developmentFileUrl: "http://192.168.30.72:7900", // 本地开发传文件

	//体育本地开发地址
	developSportUrl: "https://apistaging.wx7777.com",
	/***  s128 代理前缀 */
	developS128Url: "/S128",

	// 加密密钥
	encryptedCiphertext: {
		key: "6XGTv3TWSQEMcRs2/zitwkoImRCH6JmUi4372d7ZDfs=",
		iv: "WlrgxCborZYymTHBlRlirPRrUhjISG39WGwBBfb1mpk=",
	},
};
