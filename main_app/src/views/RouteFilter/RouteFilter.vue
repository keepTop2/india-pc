<!--
 * @Author: WangMingxin
 * @Description: 动态路由过滤
-->
<template></template>
<script lang="ts">
import { defineComponent } from "vue";
import { useDynamicRouter } from "./hooks/dynamicRouter";
import Common from "/@/utils/common";
import { CasionApi } from "/@/api/menu/casion/casion";
import { useMenuStore } from "/@/stores/modules/menu";
const MenuStore = useMenuStore();
const { runCreatSetMenu } = useDynamicRouter();

/**
 * @description: 获取动态后台路由列表
 * @param {any} _to
 * @param {any} _from
 * @param {any} next
 * @return {*}
 */
const gameList = async (_to: any, _from: any, next: any) => {
	const serverData = MenuStore.getServerData;
	if (serverData && serverData.length) {
		const ServeMenu = MenuStore.getServerMenu;
		//防止频繁创建路由
		if (!ServeMenu.length) {
			runCreatSetMenu(_to, _from, next, serverData);
			console.info("防止频繁创建路由", ServeMenu);
		} else {
			next({ path: "/" });
		}
	} else {
		//后端口数据获取
		const params = {};
		const res = await CasionApi.gameNavList(params).catch((err) => err);
		const { code, data } = res;
		if (res.code == Common.ResCode.SUCCESS) {
			MenuStore.setServeData(JSON.parse(JSON.stringify(data)));
			runCreatSetMenu(_to, _from, next, data);
		}
	}
};

export default defineComponent({
	name: "RouteFilter",
	async beforeRouteEnter(_to, _from, next) {
		try {
			console.info("防止频繁创建路由", _to);
			await gameList(_to, _from, next);
		} catch (error) {
			console.info(error);
			next();
		}
	},
});
</script>

<style scoped lang="scss"></style>
