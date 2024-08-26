<template>
	<div class="header_nav_bar">
		<div class="layout1_right_header" :style="`width: calc( 100% - ${(MenuStore.getCollapse && '64') || '260'}px )`">
			<div class="layout1_right_header_main">
				<div class="top_header_left">
					<ul v-if="serverMenu.length > 0">
						<li v-for="(item, index) in serverMenu" :key="index">
							<template v-if="item.isServer">
								<router-link :to="{ name: item?.id, query: {} }" @click="setActive(item.name)" active-class="selected">
									<div class="icon">
										<SvgIcon :size="18" :iconName="item?.iconCode || `Casino`" class="iconSvg" />
									</div>
									<span class="ml_8">{{ item?.name }}</span>
								</router-link>
							</template>
							<template v-else>
								<router-link :to="{ name: item?.id, query: {} }" @click="setActive(item.name)" active-class="selected">
									<SvgIcon v-if="activeKey == item.name" :iconName="item.activeClass" :size="18" />
									<SvgIcon v-else :iconName="item.picClass" :size="18" />
									<span class="ml_8">{{ item.titleText }}</span>
								</router-link>
							</template>
						</li>
					</ul>
				</div>
				<div class="top_header_right">
					<div class="funds" v-if="UserStore.token">
						<div class="extral">
							<SvgIcon iconName="topUp" :size="16" />&nbsp;&nbsp;
							<span class="moneyText">0.00</span>
						</div>
						<div class="czBtn">{{ $t(`layout['layout1']['充值']`) }}</div>
					</div>
					<div v-else>
						<ul class="noLogin">
							<li class="color_Text1" @click="login">登录</li>
							<li class="bg_Theme" @click="register" style="color: #fff">注册</li>
						</ul>
					</div>
					<div class="rightNav">
						<el-dropdown v-if="UserStore.token" popper-class="userDropDown">
							<span style="outline: 0 none">
						    <Avatar :size="36" />
							</span>
							<template v-slot:dropdown>
								<el-dropdown-menu class="userDropDown_menu" style="width: 220px">
									<el-dropdown-item @click="goto('/wallet')"> <SvgIcon class="icon" iconName="header_qianbao" :size="18" />钱包 </el-dropdown-item>
									<el-dropdown-item> <SvgIcon class="icon" iconName="header_tiqu" :size="18" />提取 </el-dropdown-item>
									<el-dropdown-item> <SvgIcon class="icon" iconName="header_jiaoyi" :size="18" />交易 </el-dropdown-item>
									<el-dropdown-item @click="toGlobalConfig"> <SvgIcon class="icon" iconName="header_shezhi" :size="18" />全局设置 </el-dropdown-item>
									<el-dropdown-item> <SvgIcon class="icon" iconName="header_xgmm" :size="18" />修改密码 </el-dropdown-item>
									<el-dropdown-item @click="handleUserInfo"> <SvgIcon class="icon" iconName="header_userInfo" :size="18" />用户信息 </el-dropdown-item>
									<el-dropdown-item divided @click="() => (logoutVisible = true)"> <SvgIcon class="icon" iconName="header_logout" :size="18" />退出登录 </el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>

						<span class="btnPic">
							<SvgIcon iconName="group" @click="showDownloadApp = true" :size="44" />
						</span>
						<span class="btnPic">
							<SvgIcon iconName="message" @click="showNotification = true" :size="44" />
						</span>
						<span class="btnPic" @click="onChangeLang">
							<SvgIcon iconName="language" :size="44" />
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="position_placeholder"></div>
		<Dialog v-model="showLanguage" title="" width="890" :showFooter="false">
			<Language />
		</Dialog>
		<Dialog v-model="showUserInfo" title="用户信息" width="480" :showFooter="false">
			<UserInfo @close="handleUserInfo" />
		</Dialog>
		<Dialog v-model="showNotification" title="消息通知" width="480" :showFooter="false">
			<Notification />
		</Dialog>
		<Dialog v-model="showDownloadApp" title="APP下载" width="480" :showFooter="false">
			<DownloadApp />
		</Dialog>
		<Dialog v-model="logoutVisible" title="" width="380" :showFooter="true" :showClose="false" @confirm="logout">
			<div class="logout_text">确定要退出登录？</div>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { Avatar } from "/@/components/User";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Language, UserInfo, DownloadApp, Notification } from "./components";
import dialogSingleton from "/@/layout/layout1/login/dialogSingleton";
import Dialog from "/@/components/Dialog/Dialog.vue";
import router from "/@/router";
import { useMenuStore } from "/@/stores/modules/menu";
import { useUserStore } from "/@/stores/modules/user";
interface List {
	picClass: string;
	titleText: string;
}
const i18n = useI18n();
const activeKey = ref<string>("");
// const isLogin = ref(true);
const showLanguage = ref(false);
const showUserInfo = ref(false);
const showNotification = ref(false);
const showDownloadApp = ref(false);
const logoutVisible = ref(false);
const lsit = {
	id: "1782602758713729025",
	name: "老虎机",
	iconCode: "SlotMachines",
	sort: null,
	modelCode: "GAME",
};

const MenuStore = useMenuStore();
const UserStore = useUserStore();
// console.log('UserStore', UserStore.token);
console.log(MenuStore.getCollapse, "====MenuStore.getCollapse");

const textPicList = reactive<any[]>([
	{
		id: "club",
		name: "vip",
		picClass: "vip",
		activeClass: "vip_active",
		titleText: i18n.t(`layout['layout1']['VIP']`),
	},
	{
		id: "alliance",
		name: "union",
		picClass: "union",
		activeClass: "union_active",
		titleText: i18n.t(`layout['layout1']['联盟']`),
	},
]);
//获取前后端菜单数据并处理；
const serverMenu = computed(() => {
	const menu = MenuStore.getServerData;
	let arrAy = [];
	for (const key in menu) {
		const obj = {
			id: menu[key]?.id || menu[key]?.gameOneClassId,
			name: menu[key]?.name || menu[key]?.gameOneClassName,
			iconCode: menu[key]?.iconCode || menu[key]?.iconCode,
			sort: menu[key]?.id || menu[key]?.sort,
			modelCode: menu[key]?.modelCode || menu[key]?.modelCode,
			isServer: true,
		};
		arrAy.push(obj);
	}
	const newMenu = arrAy.concat(textPicList);
	return newMenu;
});

const setActive = (val: string) => {
	console.log(val, "===val");
	activeKey.value = val;
};

const handleUserInfo = () => {
	showUserInfo.value = !showUserInfo.value;
};

const onChangeLang = () => {
	showLanguage.value = true;
};

const login = () => {
	dialogSingleton.showDialog({ componentActive: 1 });
};

const register = () => {
	dialogSingleton.showDialog({});
};

const logout = () => {
	UserStore.clearInfo();
};

const goto = (url: string) => {
	router.push({ path: url });
};

const toGlobalConfig = () => {
	router.push({ name: "globalConfig" });
};
</script>

<style lang="scss">
.userDropDown {
	border: 0 !important;
}

.userDropDown_menu {
	border: 0 !important;
	border-radius: 8px;

	@include themeify {
		background: themed("Bg2") !important;

		.el-dropdown__popper {
			border: 0;
		}

		.el-dropdown-menu__item--divided {
			border-color: themed("Line");
		}

		.icon {
			margin-right: 10px;
			fill: themed("icon");
		}

		.el-dropdown-menu__item {
			color: themed("Text1");
			height: 44px;
			line-height: 44px;
			box-sizing: border-box;
		}

		.el-dropdown-menu__item:hover {
			color: themed("Text_s");
			background-color: themed("Bg3");

			.icon {
				color: themed("Text_s");
				fill: themed("Text_s");
			}
		}
	}
}

.header_nav_bar {
	// display: flex;
	// justify-content: center;

	@include themeify {
		background: themed("Bg1");

		.logout_text {
			color: themed("Text1");
			text-align: center;
			font-size: 16px;
			font-weight: 400;
			height: 150px;
			line-height: 170px;
		}

		.bg_Theme {
			background: themed("Theme");
		}

		.Text1 {
			color: themed("Text1");
		}

		.position_placeholder {
			height: 64px;
			background: themed("Bg1");
			box-shadow: themed("rightTopBoxShadow");
		}

		.layout1_right_header {
			position: fixed;
			// width: 100%;
			@include flex_center;
			background: themed("Bg1");
			z-index: 11;

			.layout1_right_header_main {
				width: 1200px;
				height: 64px;
				box-sizing: border-box;
				background: themed("Bg1");
				// border-right: 1px solid red;
				// border-left: 1px solid red;
				display: flex;
				align-items: center;
				padding: 10px 0;
				justify-content: space-between;

				.top_header_left {
					margin-left: 0px;

					ul {
						display: flex;
						align-items: center;
						justify-content: center;
						padding-left: 0;
						margin-left: 0;

						li {
							width: 98px;
							height: 44px;
							display: flex;
							align-items: center;
							justify-content: center;
							cursor: pointer;

							a {
								display: flex;
								align-items: center;
								justify-content: center;
								color: themed("Text1");
								text-decoration: none;

								.icon {
									display: flex;
									align-items: center;
									justify-content: center;
								}

								&.selected {
									background: themed("Bg3");
									width: 98px;
									height: 44px;
									border-radius: 5px;

									.svg-icon {
										color: themed("Theme");
									}

									.icon {
										color: themed("Theme");
									}
								}
							}
						}
					}
				}

				.top_header_right {
					display: flex;
					align-items: center;
					justify-content: center;

					.funds {
						width: 180px;
						height: 44px;
						margin-right: 20px;
						border-radius: 5px;
						background: themed("Bg2");
						display: flex;
						justify-content: space-between;

						.extral {
							width: 65px;
							height: 44px;
							display: flex;
							align-items: center;
							justify-content: center;
							padding: 0 10px;

							.moneyText {
								font-family: "PingFang SC";
								color: themed("Text_s");
								font-size: 14px;
								font-style: normal;
								font-weight: 400;
								line-height: normal;
							}
						}

						.czBtn {
							width: 84px;
							height: 44px;
							text-align: center;
							line-height: 44px;
							border-radius: 5px;
							background: themed("f2");
							color: themed("Text_a");
							cursor: pointer;
						}
					}
				}

				.rightNav {
					display: flex;
					align-items: center;
					justify-content: flex-start;

					.btnPic {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-left: 20px;
					}

					.btnPic:hover {
						background: themed("Bg3");
					}
				}

				.btnAhong {
					width: 100px;
					height: 50px;
					background: green;
					color: aqua;
				}
			}

			.noLogin {
				overflow: hidden;

				li {
					list-style: none;
					border-radius: 4px;
					cursor: pointer;
					float: left;
					width: 112px;
					height: 44px;
					text-align: center;
					line-height: 44px;
					text-align: center;
				}
			}
		}
	}
}
</style>
