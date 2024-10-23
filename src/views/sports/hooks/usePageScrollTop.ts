/**
 * .mainArea节点
 * 体育模块点击导航栏时，记录当前页面scrollTop到route.mate.scrollTop中，优化用户体验
 */
import { ref } from "vue";
import { onBeforeRouteLeave, RouteLocationNormalized } from "vue-router";

export default () => {
	const scrollTop = ref(0);

	const initScrollTop = () => {
		const scrollDom = document.querySelector(".mainArea") as HTMLElement;

		scrollTop.value = scrollDom.scrollTop;
	};

	const saveScrollTop = (route: RouteLocationNormalized) => {
		route.meta.scrollTop = scrollTop.value;
	};

	initScrollTop();

	onBeforeRouteLeave((to, from, next) => {
		// 离开路由时删除scrollTop记录
		if (from.meta.scrollTop) {
			console.log("离开路由时删除scrollTop记录");

			delete from.meta.scrollTop;
		}

		next();
	});

	return {
		pageScrollTop: scrollTop,
		saveScrollTop,
	};
};
