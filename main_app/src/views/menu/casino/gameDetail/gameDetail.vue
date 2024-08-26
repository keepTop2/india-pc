<!--
 * @Author: WangMingxin
 * @Description: 游戏详细页面;
-->
<template>
	<div class="base-body">
		<div class="base-container">
			<div class="header">
				<ToolHeader @toggleFullScreen="toggleFullScreen" @openPage="openPage"></ToolHeader>
			</div>
		</div>
		<div class="base-container videoPlan">
			<div ref="domeRef" class="container-main">
				<el-scrollbar ref="scrollbarRef" :class="[UserStore.token ? '' : 'no-login']">
					<iframe ref="videoFrame" :src="state.source" frameborder="0" scrolling="no" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
				</el-scrollbar>
				<NoneData v-if="UserStore.token && !state.source"></NoneData>
				<NeedLoginDialog v-if="!UserStore.token"></NeedLoginDialog>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed, onUnmounted, nextTick } from "vue";
import { ToolHeader, NeedLoginDialog } from "./components";
import Common from "/@/utils/common";
import { CasionApi } from "/@/api/menu/casion/casion";
import { useRouter, useRoute } from "vue-router";
import qs from "qs";
const router = useRouter();
const route = useRoute();
import { useMenuStore } from "/@/stores/modules/menu";
import { useThemesStore } from "/@/stores/modules/themes";
import { useUserStore } from "/@/stores/modules/user";
import { useLayoutStore } from "/@/stores/modules/layout";
const LayoutStore = useLayoutStore();
const MenuStore = useMenuStore();
const UserStore = useUserStore();

/** 打开游戏参数  */
export interface SendParams {
	/**用户账号 */
	userAccount?: string;
	/** 设备：0:后台 1:PC 2:IOS_H5 3:IOS_APP 4:Android_H5 5:Android_APP */
	device?: number;
	/** 场馆code */
	venueCode?: string;
	/** 游戏code */
	gameCode?: string;
	/** 游戏code */
	gameId?: string;
	/** 客户端ip */
	ip?: string;
}

/**后台响应数据类型 */
interface ServerData {
	/**来源数据 */
	source: string;
	/**账户 */
	userAccount: string;
	/**数据类型 */
	type: string;
}

// class GameCard {
//   id = '';
//   collect = false;
//   name = '游戏名称';
//   venueCode = "";
//   gameCode = "";
// }

interface CardItemType {
	/** id */
	id?: string | any;
	/** 是否收藏  */
	collect: boolean;
	name: string;
	/**场馆 */
	venueCode: string;
	/**游戏 code */
	gameCode: string;
}

const themesStore = useThemesStore();
const imgBanner = new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/banner.svg`, import.meta.url).href;
const GameCard = ref();

const state: ServerData = reactive({
	source: "",
	userAccount: "",
	type: "",
});

const FormDome = reactive({
	session_id: "",
	lang: "zh-CN",
	login_id: "",
	device_id: Date.now().toString(),
});

/**
 * @description: 获取路由参数；
 * @return {*}
 */
const getRouteId = () => {
	// const params: any = router.currentRoute.value.params;
	const params: any = router.currentRoute.value.query;
	GameCard.value = params;
	gamePlay();
};

/**
 * @description: 获取游戏实际内容(可玩游戏)
 * @return {*}
 */
const gamePlay = async () => {
	// //进入时就判断登陆状态；
	// await isHaveToken().catch((err) => err);
	// const params: SendParams = {
	//   device: 1,
	//   venueCode: "PG",
	//   gameCode: "65",
	// };
	// const params: SendParams = {
	//   device: 1,
	//   venueCode: "SH",
	//   gameCode: "193",
	// };
	const params: SendParams = {
		device: 1,
		venueCode: GameCard.value.venueCode,
		gameCode: GameCard.value.gameCode,
	};
	const res: any = await CasionApi.loginGame(params).catch((err: any) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		const { source, userAccount, type } = data;
		switch (type) {
			case "url": {
				state.source = source;
				state.userAccount = userAccount;
				state.type = type;
				break;
			}
			case "html": {
				// 将HTML编码的文本字符串转换为Blob对象
				const blob: any = new Blob([source], { type: "text/html" });
				// 将Blob对象作为iframe的源
				state.source = URL.createObjectURL(blob);
				state.userAccount = userAccount;
				state.type = type;
				break;
			}
			case "token": {
				getGameDetail(data);
				break;
			}
			default:
			// if (!state.source) {
			// 	router.go(-1);
			// }
			// break;
		}
	}
};

// 获取 config 配置请求 api
function getUrl() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return window["PLATFROM_CONFIG"]?.developS128Url;
		case "production":
			return window["PLATFROM_CONFIG"]?.productionS128Url;
		default:
			return "";
	}
}

/**
 * @description: 获取s128游戏详细
 * @return {*}
 */
const getGameDetail = async (loginData) => {
	console.info("获取s128游戏详细");
	const { source, userAccount, type } = loginData;
	const params = {
		session_id: source,
		lang: "zh-CN",
		login_id: userAccount,
		// device_id: Date.now().toString(),
	};
	const url = getUrl();
	state.source = url + "/api/auth_login.aspx" + "?" + qs.stringify(params);

	// console.log(url + "/api/auth_login.aspx" + "?" + qs.stringify(params), "看看呢");
	// const header = {
	// 	"Content-Type": "multipart/form-data",
	// 	// "Content-Type": "application/x-www-form-urlencoded",
	// };
	// console.info("获取s128游戏详2细");
	// const res: any = await CasionApi.getGameDetail(params, header).catch((err: any) => err);
	// // console.info("数据返回", res);
	// const { status, data } = res;

	// if (status == 200) {
	// 	// const s128Url = getUrl();
	// 	const s128Url = window["PLATFROM_CONFIG"]?.productionS128Url;
	// 	const newData = data.replace(/src="\//g, `src="${s128Url}/`);
	// 	const newData2 = newData.replace(/action="\//g, `action="${s128Url}/`);
	// 	// console.info(newData);
	// 	// 将HTML编码的文本字符串转换为Blob对象
	// 	const blob: any = new Blob([newData2], { type: "text/html" });
	// 	// 将Blob对象作为iframe的源
	// 	state.source = URL.createObjectURL(blob);
	// 	state.userAccount = userAccount;
	// 	state.type = "html";
	// }
};

const videoFrame = ref();
const scrollbarRef = ref();

const toggleFullScreen = () => {
	if (videoFrame.value) {
		if (videoFrame.value.requestFullscreen) {
			videoFrame.value.requestFullscreen();
		} else if (videoFrame.value.requestFullscreen) {
			videoFrame.value.requestFullscreen();
		} else if (videoFrame.value.requestFullscreen) {
			videoFrame.value.requestFullscreen();
		}
	}
};
/**
 * @description: 新窗口打开页面
 * @return {*}
 */
const openPage = () => {
	if (state.source) {
		window.open(state.source, "_blank");
	}
};

// 导航离开页面时触发
import { onBeforeRouteLeave } from "vue-router";

onBeforeRouteLeave((to, from, next) => {
	MenuStore.setCollapse(false);
	next(); // 一定要调用 next()，否则导航不会继续
});

const domeRef = ref(null);
//防抖;
const timeout: any = ref(null);
//监听div大小改变；
const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		if (timeout.value !== null) clearTimeout(timeout.value);
		try {
			scrollbarRef.value.$el.style.width = 0 + "px";
			scrollbarRef.value.$el.style.height = 0 + "px";
			videoFrame.value.style.width = 0 + "px";
			videoFrame.value.style.height = 0 + "px";
			timeout.value = setTimeout(() => {
				const domWidth = (entry.target as any)?.offsetWidth;
				const domHeight = (entry.target as any)?.offsetHeight;
				scrollbarRef.value.$el.style.width = domWidth + "px";
				scrollbarRef.value.$el.style.height = domHeight + "px";

				if (domWidth <= domHeight) {
					videoFrame.value.style.width = domWidth - 10 + "px";
					videoFrame.value.style.height = "auto";
				} else if (domWidth > domHeight) {
					videoFrame.value.style.width = "auto";
					videoFrame.value.style.height = domHeight - 10 + "px";
				}
			}, 300);
		} catch (error) {}
	}
});

onMounted(() => {
	if (!UserStore.token) {
	} else {
		getRouteId();
	}
	nextTick(() => {
		resizeObserver.observe(domeRef.value as any);
		LayoutStore.setBigScreen(true);
	});
});
onUnmounted(() => {
	LayoutStore.setBigScreen(false);
	try {
		resizeObserver.unobserve(domeRef.value as any);
	} catch (error) {}
});

watch(
	() => UserStore.token,
	(newValue, oldValue) => {
		if (newValue) {
			getRouteId();
		} else {
			state.source = "";
			state.userAccount = "";
			state.type = "";
		}
	}
);
</script>

<style scoped lang="scss">
.base-body {
	display: block;
	position: relative;
	flex: 1;
	flex-shrink: 0;
	width: 100%;
	height: calc(100vh - 64px);
	display: flex;
	flex-direction: column;
	padding: 0px 32px;
	padding-bottom: 26px;
	box-sizing: border-box;

	.el-button {
		height: 48px;
		width: 134px;
	}
}

.header {
	width: 100%;
}

.base-container {
	display: flex;
	justify-content: center;

	&.videoPlan {
		flex: 1;
		// background: #353333;
	}

	.container-main {
		height: 100%;
		width: 100%;
		overflow: hidden;
		position: relative;

		:deep() {
			.el-scrollbar {
				.el-scrollbar__view {
					display: flex;
					align-items: start;
					justify-content: center;
					position: relative;
				}
			}
		}

		iframe {
			// width: 100%;
			// height: 100%;
			aspect-ratio: 16/9;
			display: flex;
			align-items: center;
			justify-content: left;
			// background: red;
		}

		.hall-plan {
			padding-top: 34px;
		}
	}

	.no-login {
		background: url("../../../../assets/zh/default/home/no_login_game_bg.png") 100% 100%;
		width: 100%;
		height: calc(100vh - 130px);
	}
}
</style>
