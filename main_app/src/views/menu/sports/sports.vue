<!-- 体育入口 -->
<template>
	<div class="Sports" id="sports"></div>
</template>

<script setup lang="ts" name="Sports">
import microApp from "@micro-zoe/micro-app";
import { useRouter } from "vue-router";
import { onMounted, onBeforeUnmount } from "vue";
import ChildrenAppNameEnum from "/@/childrenAppsManage/childrenAppEnums/childrenAppNameEnum";
import childrenAppsMap from "/@/childrenAppsManage/childrenAppMaps/childrenAppsMap";
import { RenderAppOptions, UnmountAppParams } from "/@/childrenAppsManage/childrenAppModels/childrenAppsManageModel";
import childrenAppsManage from "/@/childrenAppsManage/childrenAppsManage";
import pubsub from "/@/pubSub/pubSub";
import { useSportARouterStore } from "/@/stores/modules/sportAStore/sportARouterStore";
import { ChildrenToMainCommon, ChildrenToMainRouterPush } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import useSportARouterChangeHooks from "/@/hooks/sportAHooks/useSportARouterChangeHooks";
const sportARouterStore = useSportARouterStore();
const router = useRouter();
const { sportARouterChange } = useSportARouterChangeHooks();
const state = {
	//是否是去大容器
	isToSportAContainer: false,
};

onMounted(() => {
	pubsub.subscribe(pubsub.PubSubEvents.PreFetchViewEvents.preFetchViewMount.eventName, preFetchViewMountProcess);
	pubsub.subscribe(pubsub.PubSubEvents.SportAEvents.toSportAContainer.eventName, sportAContainer);
	renderSportA();
	console.log("main_app组件渲染 sports");
});

onBeforeUnmount(() => {
	//去大容器之前 设置一下当前路由到缓存

	if (!state.isToSportAContainer) {
		sportARouterStore.setSportALastRouter("");
		const unmountAppParams: UnmountAppParams = {
			destroy: false,
			clearAliveState: true,
		};
		console.log(1111122223333);
		childrenAppsManage.unmountApp(ChildrenAppNameEnum.sportA, unmountAppParams);
	}

	pubsub.unsubscribe(pubsub.PubSubEvents.SportAEvents.toSportAContainer.eventName, sportAContainer);
	// if (!state.isToSportAContainer) {
	// childrenAppsManage.unmountApp(ChildrenAppNameEnum.sportA);
	// }
});

function preFetchViewMountProcess() {
	console.log("这里走一下");
	sportARouterChange({ path: "/" });
}

//手动渲染子应用
const renderSportA = async () => {
	const sportAApp = childrenAppsMap.get(ChildrenAppNameEnum.sportA)?.renderAppOptions as RenderAppOptions;
	//  //如果缓存存在SportsA的路由 则将默认页设置为缓存的路由
	if (sportARouterStore.getLastRouter) {
		sportAApp["default-page"] = sportARouterStore.getLastRouter;
		sportARouterChange({ path: sportARouterStore.getLastRouter.replace("/#", "") });
	} else {
		sportAApp["default-page"] = "/";
		if (microApp.router.current.get(ChildrenAppNameEnum.sportA)?.fullPath.indexOf("preFetchSportAView") != -1) {
			sportARouterChange({ path: "/" });
			console.log("这里又走一下");
		}
	}
	// console.log(microApp.router.current.get(ChildrenAppNameEnum.sportA), "===================这边是什么情况");
	sportAApp.container = "#sports";
	childrenAppsManage.renderApp(sportAApp).then(() => {
		// microApp.router.current.get(ChildrenAppNameEnum.sportA);
		const routeData: ChildrenToMainCommon<ChildrenToMainRouterPush> = {
			name: ChildrenAppNameEnum.sportA,
			transactionName: "",
			data: {
				path: sportAApp["default-page"] as string,
			},
		};
		//主应用跳转子应用路由
		childrenAppsManage.childrenToMainRouter(routeData);
		// sportARouterChange({ path: "/" });
	});
};

// 去大容器路由事件处理
const sportAContainer = (data) => {
	state.isToSportAContainer = true;
	const lastSportARouter = microApp.router.current.get(ChildrenAppNameEnum.sportA);
	sportARouterStore.setSportALastRouter(JSON.parse(JSON.stringify(lastSportARouter)).fullPath);
	router.push({
		path: "/childrenAppContainers/sportAContainer",
		query: {
			data: encodeURI(JSON.stringify(data)),
		},
	});
};
</script>

<style lang="scss" scoped>
.Sports {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	.operation {
		display: flex;
		justify-content: space-between;
		padding: 17px 24px;
	}
	.sport_switch {
		width: 18px;
		height: 16px;
	}
	.sport_filter {
		margin-right: 40px;
	}
	.sport_filter,
	.sport_fold {
		width: 26px;
		height: 26px;
	}
	.tabs {
		width: 100%;
		height: 52px;
		display: flex;
		padding: 0px 24px;
		margin-bottom: 15px;
		overflow-x: auto; /* 允许横向滚动 */
		white-space: nowrap; /* 禁止内容换行折行 */
		box-sizing: border-box;
		-ms-overflow-style: none; /* IE 和 Edge */
		&::-webkit-scrollbar {
			/* WebKit 浏览器，如 Chrome、Safari */
			width: 0; /* 隐藏垂直滚动条 */
			height: 0; /* 隐藏水平滚动条 */
		}
		// scrollbar-width: none; /* 隐藏滚动条宽度 */

		.tab {
			min-width: 108px;
			height: 52px;
			margin-left: 11px;
			padding: 8px 15px;
			border-radius: 26px;
			@include themeify {
				background-color: themed("Tag1");
				color: themed("T1");
			}
			text-align: center;
			font-family: "PingFang SC";
			font-size: 24px;
			font-weight: 400;
			line-height: 36px;
			box-sizing: border-box;

			&:first-child {
				margin-left: 0px;
			}
		}
		.tab-active {
			@include themeify {
				background-color: themed("Theme-P");
				color: themed("TB-P");
			}
		}
	}

	.type-list {
		display: flex;
		align-items: center;
		height: 118px;
		padding: 0px 24px;
		@include themeify {
			background-color: themed("BG3");
		}
		overflow-x: auto; /* 允许横向滚动 */
		white-space: nowrap; /* 禁止内容换行折行 */
		// box-sizing: border-box;
		-ms-overflow-style: none; /* IE 和 Edge */
		&::-webkit-scrollbar {
			/* WebKit 浏览器，如 Chrome、Safari */
			width: 0; /* 隐藏垂直滚动条 */
			height: 0; /* 隐藏水平滚动条 */
		}
		scrollbar-width: none; /* 隐藏滚动条宽度 */

		.type-item {
			margin-right: 53px;
			&:last-child {
				margin-right: 0px;
			}
			.icon {
				position: relative;
				width: 40px;
				height: 40px;
				margin: 0 auto;
				margin-top: 20px;
				@include themeify {
					color: themed("Tag2-P");
				}
				.value {
					position: absolute;
					top: -20px;
					left: calc(100% + 4px);
					font-family: "PingFang SC";
					@include themeify {
						color: themed("T1");
					}
					font-size: 20px;
					font-weight: 400;
				}
			}
			.icon-active {
				@include themeify {
					color: themed("Tag2-P");
				}
				.value {
					@include themeify {
						color: themed("Theme-P");
					}
				}
			}
			.label {
				margin-top: 8px;
				@include themeify {
					color: themed("T1");
				}
				font-family: "PingFang SC";
				font-size: 24px;
				font-weight: 400;
				line-height: 36px;
			}

			.label-active {
				@include themeify {
					color: themed("Theme-P");
				}
			}
		}
	}
}
.card {
	padding: 0px 24px;
	text-align: center;
}
.attention {
	width: 312px;
	height: 52px;
	border-radius: 25px;
	line-height: 52px;
	span {
		width: 96px;
		padding: 0 30px;
		display: inline-block;
		@include themeify {
			color: themed("T1");
		}
	}
	.active {
		@include themeify {
			color: themed("TB-P");
			background-color: themed("Theme-P");
			border-radius: 25px;
		}
	}
}
</style>
