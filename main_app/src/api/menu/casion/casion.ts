/*
 * @Author: WangMingxin
 * @Description: 游戏列表相关
 */
import useAxiosApi from "/@/utils/useAxiosApi";
import useAxiosS128Api from "/@/utils/useAxiosS128Api";
import qs from "qs";

export const CasionApi = {
	/**
	 * @description: 获取游戏大厅标签列表（动态路由获取）
	 */
	gameNavList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/game_lobby/api/queryLobbyLabelList`, {
			method: "POST",
			data,
			headers,
		});
	},

	/**
	 * @description:  根据游戏一级标签查询出游戏：该接口只针对赌场类型，当点击赌场或者赌场的大厅标签时渲染页面的接口；根据游戏一级标签查询二级标签与游戏
	 */
	gameHallList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/game_lobby/api/queryCaGameInfoByOneClassId`, {
			method: "POST",
			data,
			headers,
		});
	},

	/**
	 * @description: 赌场 Title 根据游戏二级标签查询游戏列表详情（游戏列表）
	 * @param {*} headers {showLoading: 是否显示加载过度动画 }
	 * @return {*}
	 */
	gamePageList: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app-foreign/game_lobby/api/queryCaGameInfoDetail`, {
			method: "POST",
			data,
			headers,
		});
	},

	/**
	 * @description: 查询游戏列表详情：根据二级分类 ID 查询（游戏列表）
	 * @param {*} headers {showLoading: 是否显示加载过度动画 }
	 * @return {*}
	 */
	gamePageListByID: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app-foreign/game_lobby/api/queryCaGameInfoByTwoIdDetail`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description: 获取游戏平台列表 (游戏供应商下拉选择及供应商列表)
	 * @param {*} data 查询所有的时候 pageNumber = -1
	 * @param {*} headers {showLoading: 是否显示加载过度动画 }
	 * @return {*}
	 */
	gameSupplierList: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app-foreign/game_lobby/api/queryVenueInfoPage`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description: 查询收藏游戏列表
	 */
	gameCollectionList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/game/api/queryCollection`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description: 收藏游戏
	 */
	gameCollection: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/game/api/collection`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description: 最近玩的
	 */
	gameRecently: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/game/api/queryRecentlyPlayer`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description: 打开游戏
	 */
	loginGame: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/third/api/loginGame`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description: 获取投注记录列表
	 * @param {object} data
	 * @return {*}
	 */
	getBettingRecordList: (data?: object) => {
		return useAxiosApi(`/app-foreign/order/api/client/orderRecord`, {
			method: "POST",
			data,
		});
	},
	/**
	 * @description: 获取游戏（游戏详细s128 使用api）
	 */
	getGameDetail: (data = {}, headers = {}) => {
		return useAxiosS128Api(`/api/auth_login.aspx`, {
			method: "POST",
			data,
			params: data,
			headers,
		});
	},
};
