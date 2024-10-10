/*
 * @Author: WangMingxin
 * @Description: 菜单管理；
 */
import { defineStore } from "pinia";
import { activityApi } from "/@/api/activity";

export const useActivityStore = defineStore("Activity", {
	state: () => {
		return {
			currentActivityData: {} as any,
		};
	},
	getters: {
		/**
		 * @description: 左侧菜单是否是缩小
		 * @return {*}
		 */
		getCurrentActivityData(): any {
			return this.currentActivityData;
		},
	},

	actions: {
		setCurrentActivityData(data: any) {
			this.currentActivityData = data;
		},
		async updateCurrentActivityData(): Promise<any> {
			const params = {
				activityTemplate: this.currentActivityData.activityTemplate,
				id: this.currentActivityData.id,
			};
			await activityApi.getConfigDetail(params).then((res) => {
				this.setCurrentActivityData({ ...this.currentActivityData, ...res.data });
			});
		},
	},
});
