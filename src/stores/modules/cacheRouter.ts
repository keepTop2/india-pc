import { RouteLocationNormalized } from "vue-router";
import { defineStore } from "pinia";

export const useRouterStore = defineStore("router", {
	state: () => ({
		cacheComps: new Set<string>(),
	}),
	actions: {
		cacheRouter(from: RouteLocationNormalized, to: RouteLocationNormalized) {
			// 判断进入的路由元信息是否包含leaveCaches 并且 要进入的路由信息leaveCaches有包含此路径
			if (Array.isArray(from.meta.leaveCaches) && from.meta.leaveCaches.includes(to.name) && typeof from.name === "string") {
				this.cacheComps.add(from.name);
			}
			// 判断要去的路由原信息 并且 要去的路由信息没有要去的路径
			if (Array.isArray(to.meta.leaveCaches) && !to.meta.leaveCaches.includes(from.name) && typeof to.name === "string") {
				this.cacheComps.delete(to.name);
			}
		},
	},
	getters: {
		keepAliveComps(state) {
			return [...state.cacheComps];
		},
	},
});
