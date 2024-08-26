import { computed, onBeforeMount, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import useSportARouterChangeHooks from "/@/hooks/sportAHooks/useSportARouterChangeHooks";
import pubsub from "/@/pubSub/pubSub";
function useMenuChangeHooks() {
	const router = useRouter();
	const route = useRoute();
	const { sportARouterChange } = useSportARouterChangeHooks();

	/**
	 * @description 路由上的最后一个模板
	 */
	const lastModelState = computed(() => {
		return route.meta.modelCode;
	});

	let menuValStateParamse = {
		val: {
			id: "",
			name: "",
		},
		query: {},
	};

	onBeforeMount(() => {
		pubsub.subscribe(pubsub.PubSubEvents.PreFetchViewEvents.preFetchViewMount.eventName, preFetchViewMountProcess);
	});

	/**
	 * @description 动态菜单切换
	 */
	const menuChange = (val: any, query = {}) => {
		console.log(val, lastModelState.value, "========");
		if (lastModelState.value == val.modelCode) {
			return;
		}
		console.log(lastModelState);
		//如果是体育模板 要发消息给sportA 子应用
		if (lastModelState.value == "PE") {
			sportARouterChange({ path: "/preFetchSportAView" });
			menuValStateParamse = {
				val,
				query,
			};
		} else {
			router.push({
				name: val.id ? val.id : val.name,
				query,
			});
		}
	};

	/**
	 * @description sportA 预加载空白页渲染完成 主应用跳转对应路由
	 */
	function preFetchViewMountProcess() {
		router.push({
			name: menuValStateParamse.val.id ? menuValStateParamse.val.id : menuValStateParamse.val.id,
			query: menuValStateParamse.query,
		});
	}

	return { menuChange };
}

export default useMenuChangeHooks;
