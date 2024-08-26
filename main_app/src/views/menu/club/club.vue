<template>
	<div class="container">
		<div class="banner bg">
			<div>
				<p class="title">Exclusive <span>VIP</span> benefits</p>
				<p>Join our VIP club now and you will receive a large number of gifts and giveaways!</p>
				<p>Experience higher cash returns and exclusive privileges</p>
				<div class="btn-group">
					<el-button size="large">start playing</el-button>
					<el-button size="large" @click="descVisible = true">See details</el-button>
				</div>
			</div>
			<img :src="banner01" alt="" />
		</div>
		<div class="user-info bg">
			<div class="info">
				<div class="top">
					<Avatar :size="70" />
					<div>
						<p>
							佩奇的一家
							<span>ID: {{ userVipInfo.userAccount }}</span>
						</p>
						<p>
							{{ $t(`club['当前等级:']`) }}<span>VIP{{ userVipInfo.vipRankCode }}</span>
						</p>
					</div>
				</div>
				<div class="bottom">
					<p>
						{{ $t(`club['升级所需经验：']`) }}{{ userVipInfo.currentVipExp }} / {{ userVipInfo.upgradeVipExp }}
						<el-icon>
							<Warning />
						</el-icon>
					</p>
					<div>
						<span>VIP{{ userVipInfo.vipRankCode }}</span>
						<el-progress :stroke-width="16" :percentage="percentage" :show-text="false" />
						<span>VIP{{ userVipInfo.vipRankUp }}</span>
					</div>
				</div>
			</div>
			<div class="weal">
				<p class="title">{{ $t(`club['我的福利']`) }}</p>
				<div class="list">
					<div class="item" v-for="item in wealList">
						<img :src="item.icon" alt="" />
						<div>
							<span>{{ item.name }}</span>
							<span>{{ item.weal }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="serve-list">
			<div class="item" v-for="item in serveList">
				<img :src="item.imgUrl" alt="" />
				<p class="title">{{ item.title }}</p>
				<p class="desc">{{ item.desc }}</p>
			</div>
		</div>
		<div class="problem">
			<p class="title">{{ $t(`club['常见问题']`) }}</p>
			<div class="demo-collapse">
				<el-collapse v-model="activeNames" @change="handleChange">
					<el-collapse-item :title="item.title" :name="item.id" v-for="item in problemList">
						{{ item.desc }}
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
	</div>

	<Dialog v-model="descVisible" title="" width="780" top="1%" :showFooter="false" :show-close="false">
		<template #header>
			<div class="head">
				<span></span>
				<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="descVisible = false" />
			</div>
		</template>
		<div class="dialog-desc">
			<p class="title">
				<img :src="vipjlb_bg" alt="" />
				<span>{{ $t(`club['VIP俱乐部']`) }}</span>
			</p>
			<p class="remark">{{ $t(`club['升级VIP，尊享丰厚奖励、更高现金返还和独家特权！']`) }}</p>
			<div class="vip">
				<div>
					<img :src="medal" alt="" />
					<div>
						<p class="lv">{{ $t(`club['当前等级:']`) }}123123</p>
						<div class="progress">
							<span>VIP3</span>
							<el-progress :percentage="30" :show-text="false" />
							<span>VIP4</span>
						</div>
						<p>{{ $t(`club['升级所需经验：']`) }} 200 / 500</p>
					</div>
				</div>
				<div>
					<div class="top">
						<p>{{ $t(`club['专属客服']`) }}</p>
						<span class="tip">?</span>
					</div>
					<div class="avatar-list">
						<div class="list">
							<img :src="item" alt="" v-for="(item, index) in avatarList" :style="{ transform: index === 0 ? '' : `translateX(${-12 * index}px)` }" />
						</div>
						<div class="circle">
							<img :src="avatar4" alt="" />
						</div>
					</div>
					<p>在<span>VIP6</span>{{ $t(`club['解锁您的专属VIP客服']`) }}</p>
				</div>
			</div>

			<div class="tabs">
				<div class="tab">
					<el-button v-for="item in tabList" @click="activeTab = item.id" :class="item.id === activeTab && 'tabActive'" size="large">
						{{ item.name }}
					</el-button>
				</div>
				<div class="content">
					<div class="title">VIP1福利</div>

					<div class="list">
						<div v-for="item in authList" class="item">
							<div class="left"><img :src="lock" alt="" /></div>
							<div class="right">
								<p>{{ item.name }}</p>
								<p>{{ item.desc }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Avatar } from "/@/components/User";
import Dialog from "/@/components/Dialog/Dialog.vue";
import banner01 from "/@/assets/zh/default/club/banner01.png";
import vipjlb_bg from "/@/assets/zh/default/club/vipjlb_bg.png";
import medal from "/@/assets/zh/default/club/medal.png";
import avatar4 from "/@/assets/zh/default/club/avatar4.png";
import lock from "/@/assets/zh/default/club/lock.png";
import weal1 from "/@/assets/zh/default/club/weal1.png";
import weal2 from "/@/assets/zh/default/club/weal2.png";
import weal3 from "/@/assets/zh/default/club/weal3.png";
import weal4 from "/@/assets/zh/default/club/weal4.png";
import weal5 from "/@/assets/zh/default/club/weal5.png";
import weal6 from "/@/assets/zh/default/club/weal6.png";
import serve1 from "/@/assets/zh/default/club/serve1.png";
import serve2 from "/@/assets/zh/default/club/serve2.png";
import serve3 from "/@/assets/zh/default/club/serve3.png";
import serve4 from "/@/assets/zh/default/club/serve4.png";
import avatar1 from "/@/assets/zh/default/club/avatar1.png";
import avatar2 from "/@/assets/zh/default/club/avatar2.png";
import avatar3 from "/@/assets/zh/default/club/avatar3.png";
import { clubApi } from "/@/api/menu/club/club";

const userVipInfo = ref({});

const wealList = reactive([
	//福利列表
	{ icon: weal1, name: "升级奖励", weal: "$5.00" },
	{ icon: weal2, name: "专属客服", weal: "$5.00" },
	{ icon: weal3, name: "专属客服", weal: "$5.00" },
	{ icon: weal4, name: "专属客服", weal: "$5.00" },
	{ icon: weal5, name: "专属客服", weal: "$5.00" },
	{ icon: weal6, name: "专属客服", weal: "$5.00" },
	{ icon: weal6, name: "专属客服", weal: "$5.00" },
	{ icon: weal6, name: "专属客服", weal: "$5.00" },
	{ icon: weal6, name: "专属客服", weal: "$5.00" },
]);

const serveList = reactive([
	//服务列表
	{ imgUrl: serve1, title: "免费提现", desc: "VIP6解锁免费提现福利，轻松提取您的奖金，无额外费用" },
	{ imgUrl: serve2, title: "返还奖金", desc: "随着升级，每周、每月高额的奖金返还" },
	{ imgUrl: serve3, title: "专属客服", desc: "VIP4结算专属客服，享受VIP主人的个性化关注和服务" },
	{ imgUrl: serve4, title: "惊人的升级奖励", desc: "升级时，更多升级奖励等待您的开启" },
]);

const problemList = reactive([
	{
		id: 0,
		title: "什么是“升级奖励”？",
		desc: "为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。",
	},
	{
		id: 2,
		title: "什么是“下雨”？",
		desc: "为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。",
	},
	{
		id: 3,
		title: "什么是“投币”？",
		desc: "为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。",
	},
	{
		id: 4,
		title: "什么是“提示”？",
		desc: "为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。",
	},
	{
		id: 5,
		title: "什么是“充值”？",
		desc: "为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。",
	},
	{
		id: 6,
		title: "什么是“每周现金返还”？",
		desc: "为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。",
	},
	{
		id: 7,
		title: "什么是“体育周奖金”？",
		desc: "为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。",
	},
]);
const activeNames = ref([0]);
const handleChange = (val: string[]) => {
	console.log(val);
};

// VIP详情
const descVisible = ref(false);
const avatarList = reactive([avatar1, avatar2, avatar3]);
const activeTab = ref(0);
const tabList = reactive([
	{ id: 0, name: "VIP1" },
	{ id: 1, name: "VIP2" },
	{ id: 2, name: "VIP3" },
	{ id: 3, name: "VIP4" },
	{ id: 4, name: "VIP5" },
	{ id: 5, name: "VIP6" },
	{ id: 6, name: "VIP7" },
]);
const authList = reactive([
	{ is: false, name: "升级奖励", desc: "奖金随着VIP等级的提升增加" },
	{ is: false, name: "专属客服", desc: "24小时在线,提供个性化服务" },
	{ is: false, name: "每周返还奖金", desc: "根据您的投注额,您将获得每周投注*1%*5%的奖金" },
	{ is: false, name: "每月返还奖金", desc: "根据您的投注额,您将获得每月投注*1%*3%的奖金" },
	{ is: false, name: "提现次数", desc: "升级VIP获得免费的提现次数" },
	{ is: false, name: "提现额度", desc: "升级VIP提高提现额度" },
	{ is: false, name: "贵宾旋转", desc: "从VIP3开始,每次升级您将获得一次免费的幸运转盘抽奖" },
]);

// 经验百分比
const percentage = computed(() => {
	if (Object.keys(userVipInfo.value).length) {
		return (userVipInfo.value.currentVipExp / userVipInfo.value.upgradeVipExp) * 100;
	} else {
		return 0;
	}
});

async function getUserVipInfo() {
	let res = await clubApi.getUserVipInfo();
	console.clear();
	console.log(res.data);
	userVipInfo.value = res.data;
}

getUserVipInfo();
</script>

<style scoped lang="scss">
.container {
	width: 1200px;

	& > * {
		margin: 20px 0;
	}

	.bg {
		@include themeify {
			background-color: themed("Bg1");
		}
		border-radius: 5px;
		margin: 15px 0;
	}

	.banner {
		padding: 30px 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		& > div {
			& > p:not(.title) {
				font-size: 18px;
				@include themeify {
					color: themed("Text_s");
				}
			}

			.title {
				font-size: 36px;
				font-weight: 700;
				@include themeify {
					color: themed("Text_s");
				}

				span {
					@include themeify {
						color: themed("f1");
					}
				}
			}

			.btn-group {
				display: flex;
				margin-top: 20px;

				button {
					width: 190px;
				}

				& > button:first-child {
					border: 1.4px solid var(--text-s, #ffffff);
					@include themeify {
						background-color: themed("Bg1");
						color: themed("Text_s");
					}
				}

				& > button:last-child {
					border: none;
					@include themeify {
						background-color: themed("Theme");
						color: themed("Text_a");
					}
				}
			}
		}

		img {
			width: 150px;
			transform: scale(1.8) translateX(-100px);
		}
	}

	.user-info {
		padding: 20px;
		display: grid;
		grid-template-columns: 35% 65%;

		.info {
			padding-right: 20px;
			margin-right: 20px;
			@include themeify {
				border-right: 1px solid themed("Line");
			}
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.top {
				display: flex;
				align-items: center;
				gap: 10px;

				div {
					& > p {
						margin: 8px 0;
					}

					& > p:first-child {
						font-size: 20px;
						@include themeify {
							color: themed("Text_s");
						}

						span {
							margin-left: 10px;
							font-size: 16px;
							@include themeify {
								color: themed("Text2_1");
							}
						}
					}

					& > p:last-child {
						font-size: 18px;
						@include themeify {
							color: themed("Text2_1");
						}

						span {
							@include themeify {
								color: themed("Text1");
							}
						}
					}
				}
			}

			.bottom {
				& > p {
					margin-bottom: 10px;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 10px;
					@include themeify {
						color: themed("Text2_1");
					}
				}

				& > div {
					display: grid;
					grid-template-columns: auto 1fr auto;
					gap: 5px;
					@include themeify {
						color: themed("Text1");
					}

					:deep {
						.el-progress-bar__outer {
							@include themeify {
								background: themed("Bg3");
							}
						}

						.el-progress-bar__inner {
							@include themeify {
								background: themed("Theme");
							}
						}
					}
				}
			}
		}

		.weal {
			.title {
				font-size: 20px;
				@include themeify {
					color: themed("Text_s");
				}
			}

			.list {
				width: 100%;
				overflow-x: auto;
				display: flex;
				gap: 80px;
				margin-top: 10px;
				padding-bottom: 5px;

				&::-webkit-scrollbar {
					height: 8px;
				}

				&::-webkit-scrollbar-thumb {
					border-radius: 5px;
					@include themeify {
						background: themed("Bg3");
					}
				}

				.item {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					gap: 10px;
					flex-shrink: 0;

					img {
						width: 50px;
						height: 50px;
					}

					div {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 3px;

						& > span:first-child {
							@include themeify {
								color: themed("Text1");
							}
						}

						& > span:last-child {
							@include themeify {
								color: themed("Text_s");
							}
						}
					}
				}
			}
		}
	}

	.serve-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;

		.item {
			padding: 20px;
			display: grid;
			align-items: center;
			border-right: 5px;
			@include themeify {
				background: themed("Bg1");
			}

			img {
				width: 150px;
				margin: auto auto 20px;
			}

			.title {
				@include themeify {
					color: themed("Text_s");
				}
			}

			.desc {
				@include themeify {
					color: themed("Text1");
				}
			}
		}
	}

	.problem {
		padding: 20px 20px 50px;
		border-right: 5px;
		@include themeify {
			background: themed("Bg1");
		}

		& > .title {
			margin-bottom: 20px;
			@include themeify {
				color: themed("Text_s");
			}
		}
	}

	:deep {
		.el-collapse {
			--el-collapse-border-color: #373a40;
		}

		.el-collapse-item__header,
		.el-collapse-item__wrap {
			@include themeify {
				background: themed("Bg1");
			}
		}

		.el-collapse-item__header {
			@include themeify {
				color: themed("Text_s");
			}
		}

		.el-collapse-item__content {
			@include themeify {
				color: themed("Text1");
			}
		}
	}
}

.dialog-desc {
	padding: 20px;
	max-height: 88vh;
	overflow: auto;
	margin-top: -100px;

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-thumb {
		border-radius: 5px;
		@include themeify {
			background: themed("Bg3");
		}
	}

	& > * {
		margin: 20px 0;
	}

	& > .title {
		margin-bottom: 60px;
	}

	.title {
		font-size: 24px;
		text-align: center;
		position: relative;
		z-index: 1;

		@include themeify {
			color: themed("Text_s");
		}

		span {
			display: inline-block;
			margin-top: 15px;
			@include themeify {
				color: themed("Text_s");
			}
		}

		img {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			z-index: -1;
		}
	}

	.remark {
		padding: 10px 20px;
		border-radius: 10px;
		@include themeify {
			color: themed("Text2_1");
			background: themed("Bg2");
		}
	}

	.vip {
		display: grid;
		grid-template-columns: calc(60% - 7px) calc(40% - 7px);
		gap: 14px;

		& > div:first-child {
			height: 170px;
			background: linear-gradient(90deg, #495867 0%, #6d7e90 100%);
			border-radius: 15px;
			display: grid;
			grid-template-columns: auto 1fr;
			padding: 0 20px;
			gap: 20px;
			align-items: center;

			img {
				width: 130px;
				align-self: start;
			}

			& > div {
				& > * {
					margin: 15px 0;
				}

				.lv {
					font-size: 18px;
					@include themeify {
						color: themed("Text_a");
					}
				}

				.progress {
					display: grid;
					grid-template-columns: auto 1fr auto;
					gap: 5px;
					@include themeify {
						color: themed("Text_a");
					}

					:deep {
						.el-progress-bar__outer {
							@include themeify {
								background: themed("Text_a");
							}
						}

						.el-progress-bar__inner {
							@include themeify {
								background: themed("Theme");
							}
						}
					}
				}

				& > p:last-child {
					@include themeify {
						color: themed("Text_a");
					}
				}
			}
		}

		& > div:last-child {
			border-radius: 15px;
			padding: 10px 0;
			@include themeify {
				background: themed("Bg2");
			}

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-right: 15px;
				margin-top: 10px;

				& > p {
					width: 83px;
					height: 26px;
					line-height: 26px;
					position: relative;
					background: linear-gradient(90deg, #495867 0%, #69798b 100%);
					padding-left: 10px;
					@include themeify {
						color: themed("Text_a");
					}

					&::after {
						content: "";
						position: absolute;
						display: inline-block;
						top: 0;
						right: 0;
						height: 0;
						width: 0;
						@include themeify {
							background: themed("Bg2");
						}
						border-width: 13px;
						border-style: solid;
						border-color: #626e7e;
						border-right-color: transparent;
					}
				}

				.tip {
					display: inline-block;
					cursor: pointer;
					border-radius: 50%;
					width: 22px;
					height: 22px;
					text-align: center;
					line-height: 22px;
					font-weight: 700;
					font-size: 18px;
					@include themeify {
						background: themed("icon");
						color: themed("Bg2");
					}
				}
			}

			.avatar-list {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 20px;

				.list {
					display: flex;
					transform: translateX(22px);

					img {
						width: 40px;
						height: 40px;
						border-radius: 50%;
						border: 1.4px solid var(--Bg2-2, #1a1c20);
					}
				}

				.circle {
					position: relative;
					width: 41px;
					height: 41px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 6px;
					@include themeify {
						background: themed("Bg3");
					}

					&::after {
						content: "";
						width: 10px;
						height: 10px;
						position: absolute;
						border-radius: 50%;
						top: 0;
						right: 0;
						@include themeify {
							background: themed("Theme");
						}
					}
				}
			}

			& > p {
				margin-top: 20px;
				text-align: center;

				span {
					@include themeify {
						color: themed("Text_s");
					}
				}

				@include themeify {
					color: themed("Text1");
				}
			}
		}
	}

	.tabs {
		.tab {
			display: flex;

			.tabActive {
				@include themeify {
					background: themed("Theme");
					color: themed("Text_a");
				}
			}

			button {
				border: none;
				@include themeify {
					background: themed("Bg2");
					color: themed("Text1");
				}
			}
		}

		.content {
			margin: 20px 0;
			border-radius: 10px;
			@include themeify {
				background: themed("Bg2");
			}
			text-align: center;

			.title {
				padding: 10px 60px;
				display: inline-block;
				border-radius: 0 0 15px 15px;
				@include themeify {
					color: themed("Text_s");
					background: themed("Bg3");
				}
			}

			.list {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 20px;
				padding: 20px;

				.item {
					display: flex;
					align-items: center;
					gap: 15px;
					border: 1px solid var(--Bg3-3, #2e3035);
					border-radius: 10px;
					padding: 20px;

					.left {
						border: 1px solid var(--Bg3-3, #2e3035);
						width: 70px;
						height: 70px;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-shrink: 0;
						@include themeify {
							background: themed("Bg1");
						}
					}

					.right {
						text-align: left;

						p {
							margin: 5px 0;
						}

						& > p:first-child {
							font-size: 16px;
							@include themeify {
								color: themed("Text_s");
							}
						}

						& > p:last-child {
							@include themeify {
								color: themed("Text1");
							}
						}
					}
				}
			}
		}
	}
}

.head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28px 32px;
	z-index: 999;
	position: sticky;

	.label {
		@include themeify {
			color: themed("Text_s");
		}
		font-family: "PingFang SC";
		font-size: 20px;
		font-weight: 500;
	}

	.dialog_close {
		@include themeify {
			color: themed("icon");
		}
	}

	.dialog_close:hover {
		@include themeify {
			color: themed("Text_s");
		}
		transform: rotate(-90deg) scale(1.05);
		transition: all 0.3s;
	}
}
</style>
