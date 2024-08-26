<template>
	<div class="container">
		<div class="head">
			<div class="top">
				<div class="pool">
					<div class="img-box">
						<img :src="pool1" alt="" />
						<img :src="pool2" alt="" />
					</div>
					<div class="content">
						<p>{{ $t(`competition['今日奖池']`) }}</p>
						<p>$ 12313123</p>
					</div>
				</div>

				<div class="time" v-if="UserStore.token">
					<p>{{ $t(`competition['剩余时间']`) }}</p>
					<div>
						<p>
							<span>{{ hours }}</span>
							<span>{{ $t(`competition['小时']`) }}</span>
						</p>
						<p>
							<span>{{ minutes }}</span>
							<span>{{ $t(`competition['分钟']`) }}</span>
						</p>
						<p>
							<span>{{ seconds }}</span>
							<span>{{ $t(`competition['秒']`) }}</span>
						</p>
					</div>
				</div>

				<div class="part" v-else>
					<div class="top">
						<img :src="ljcy_img" alt="" class="left" />
						<p>谁能成为巅峰赛的冠军，让我们看看你有多厉害？</p>
						<img :src="ljcy_img" alt="" class="right" />
					</div>
					<div class="bottom">
						<el-button type="primary">立即参与</el-button>
					</div>
				</div>

				<div class="champion">
					<div class="title">
						<span>{{ $t(`competition['上届冠军']`) }}</span>
						<span class="tip" @click="ruleVisible = true">?</span>
					</div>
					<div class="content">
						<Avatar :size="48" />
						<div>
							<p class="name">{{ $t(`competition['玩家昵称']`) }}</p>
							<p class="num">{{ $t(`competition['奖金']`) }}：<span>$123123</span></p>
						</div>
					</div>
				</div>
			</div>

			<div class="user-info" v-if="UserStore.token">
				<div class="col1">
					<Avatar :size="48" />
					<div class="name">{{ $t(`competition['玩家昵称']`) }}</div>
				</div>
				<div class="col2">
					<p>{{ $t(`competition['我的位置']`) }}</p>
					<span>50+</span>
				</div>
				<div class="col3">
					<p>{{ $t(`competition['赌注']`) }}</p>
					<span>50.00 $</span>
				</div>
				<div class="col4">
					<p>{{ $t(`competition['投注']`) }}</p>
					<p>
						<span>12313123 $</span>
						<span>{{ $t(`competition['达到']`) }}</span>
						<span>前10名</span>
					</p>
				</div>
			</div>
		</div>

		<div class="data">
			<div class="history">
				<div class="time">2024/01/05 ~ 2024/01/05</div>
				<el-button @click="historyVisible = true">{{ $t(`competition['历史']`) }}</el-button>
			</div>
			<HistoryTable :rankingList="rankingList" />
		</div>
	</div>

	<!--  <Dialog v-model="historyVisible" :title="$t(`competition['历史']`)" width="770" :showFooter="false"-->
	<!--          class="history-dialog">-->
	<!--    <HistoryTable :rankingList="rankingList"/>-->
	<!--  </Dialog>-->

	<el-dialog
		:model-value="historyVisible"
		:show-close="false"
		:align-center="true"
		width="770"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		style="background-color: transparent !important"
	>
		<div class="deposit-dialog">
			<div class="head">
				<div class="label">
					<span>{{ $t(`competition['历史']`) }}</span>
					<span class="time">2024/01/05 ～ 2024/01/06</span>
				</div>
				<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="historyVisible = false" />
			</div>
			<div class="line"></div>

			<HistoryTable :rankingList="rankingList" />
		</div>
	</el-dialog>

	<Dialog v-model="ruleVisible" :title="$t(`competition['规则']`)" top="1%" width="480" :showFooter="false">
		<div class="rule-dialog">
			<div>
				<p class="title">
					<span>{{ $t(`competition['规则']`) }}-{{ $t(`competition['每日投注大赛']`) }}</span>
					<span>2024/01/05 ～ 2024/01/06</span>
				</p>
				<div class="rule-list">
					<p>1.{{ $t(`competition['今日奖池与资金密切相关，玩家下注越多，奖池越大。当前奖池将显示在竞赛页面上。']`) }}</p>
					<p>2. {{ $t(`competition['10名下注最多的玩家瓜分奖池。']`) }}</p>
					<p>
						3.{{ $t(`competition['本次比赛支持投注币种']`) }}：XEN, MATIC, COP, APT, UAH, IOTX, SHIB, KES, XOF, NEAR, WLD, HNT, FLOOR, IDR, RUNE, DOG, DGB, VNDC, BCD, BSV, NBX,
						BCH、SUI、CAKE、DOT、BCL、JST、BANANO、SUNOLD、BTCB、GMT、BTC、TWT、ARB、AVAX、TON、GMX、BTG、AMPL、XAF、UZS、FTM、BTTOLD、ONE、JPEG、SUSHI、
						ALGO、KRW、ATOM、BIGTIME、WBTC、SAMO、GODS、SNX、KUMA、KGS、MANA、EUR、ROSE、WAXP、SATS、ARS、VTHO、DAI、MXN、USD、SOL、ETC、ICP、BNB、USTC、
						BLUR、ETH、CELO、KLAY、TOMO、ADA、ICX、PAR、VET、MMK、DOGE、GBP、USDC.e、USDT、HBAR、RVN、DASH、NANO、TZS、WAVES、VND、XRP、WBNB、SNACK、卢布、FLOKI、EGP、TRX、NFT、AZN、日元、马币、SUNNEW、GHS、JOE、KAVA、SAND、AMP、澳元、巴西雷亚尔、BDT、AVC、UGX、泰铢、DCR、PEN、KZT、TUSD、NZD、
						USDT.e、EGLD、LTC、USDC、KAS、KHR、THETA、VSYS、ENJ、CRO、AED、CRV、CLP、NEXO、TFUEL、LUNA、NEWBTT、AAVE、EURS、NGN、UNI、MDL、NOK、MAGIC、
						CAD、XLM、PHP、LINK、YFI、QTUM、XTZ、OP、KSM、ELON、GM、INR、TAMA、EOS、FIL、GST、WETH、BIT、AXE、GALA、BAT、APE、YGG、HEX、PEOPLE、 AXS、ZIL、XMR、WCK、PKR
					</p>
					<p>4.{{ $t(`competition['您可以使用以上任意币种下注，所有币种均会按照当前汇率兑换为USDT。']`) }}</p>
					<p>5.{{ $t(`competition['所有奖品均以BCD形式发送。']`) }}</p>
					<p>6.{{ $t(`competition['奖品将在比赛结束时在通知页面发送。']`) }}</p>
					<p>7. BC.GAME {{ $t(`competition['保留在比赛任何阶段排除违反我们规则的玩家的权利。']`) }}</p>
					<p>8. BC.GAME {{ $t(`competition['保留自行决定更改任何规则和条件的权利，恕不另行通知。']`) }}</p>
					<p>🌟🌟{{ $t(`competition['祝你好运，玩得开心！']`) }}🌟🌟</p>
				</div>
				<div class="formula">
					<p class="title">{{ $t(`competition['奖金计算公式']`) }}</p>
					<p>第一名–每日竞赛奖金池的50%</p>
					<p>第一名–每日竞赛奖金池的50%</p>
					<p>第一名–每日竞赛奖金池的50%</p>
					<p>第一名–每日竞赛奖金池的50%</p>
					<p>第一名–每日竞赛奖金池的50%</p>
					<p>第一名–每日竞赛奖金池的50%</p>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import useCountdown from "./hooks/useCountdown";
import { reactive, ref } from "vue";
import HistoryTable from "/@/views/frontPage/competition/components/HistoryTable.vue";
import Dialog from "/@/components/Dialog/Dialog.vue";
import { Avatar } from "/@/components/User";
import fiatCurrencySelfOperated from "/@/views/wallet/views/transaction/components/dialog/deposit/fiatCurrencySelfOperated/fiatCurrencySelfOperated.vue";
import { useUserStore } from "/@/stores/modules/user";
import pool1 from "/@/assets/zh/default/competition/pool1.png";
import pool2 from "/@/assets/zh/default/competition/pool2.png";
import ljcy_img from "/@/assets/zh/default/competition/ljcy_img.png";

const UserStore = useUserStore();

console.log("UserStore.token", UserStore.token);

const { hours, minutes, seconds } = useCountdown(3600); // 假设倒计时初始时间为1小时

const rankingList = reactive([
	// 排行榜数据
	{ name: "玩家昵称1", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称2", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称3", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称4", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称5", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
	{ name: "玩家昵称6", wager: "$123123", bonus: "$123123" },
]);

// 历史
const historyVisible = ref(false);

// 规则
const ruleVisible = ref(false);
</script>

<style scoped lang="scss">
.container {
	//padding: 40px;
	width: 1200px;

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

	.head {
		padding: 15px;
		border-radius: 5px;

		@include themeify {
			background: themed("Bg2");
			margin-top: 15px;
		}

		.top {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 15px;

			& > div {
				@include themeify {
					background: themed("Bg1");
				}

				padding: 20px;
				border-radius: 5px;
			}

			.pool {
				display: flex;
				align-items: center;
				gap: 20px;

				.img-box {
					position: relative;

					img {
						width: 100px;
					}

					& > img:last-child {
						position: absolute;
						bottom: -20px;
					}
				}

				.content {
					& > p {
						margin: 12px 0;
					}

					& > p:first-child {
						@include themeify {
							color: themed("Text_s");
						}
					}

					& > p:last-child {
						font-weight: 700;
						border-radius: 3px;
						padding: 5px 10px;
						font-size: 24px;
						width: 200px;

						@include themeify {
							color: themed("f1");
							background: themed("Bg3");
						}
					}
				}
			}

			.time {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 15px;

				& > p {
					@include themeify {
						color: themed("Text1");
					}
				}

				& > div {
					display: flex;
					gap: 15px;

					& > p {
						display: flex;
						flex-direction: column;
						align-items: center;
						padding: 0 15px;
						border-radius: 5px;

						@include themeify {
							background: themed("Bg2");
						}

						& > span:first-child {
							font-size: 24px;

							@include themeify {
								color: themed("Text_s");
							}
						}

						& > span:last-child {
							font-size: 12px;
							padding-bottom: 5px;

							@include themeify {
								color: themed("Text1");
							}
						}
					}
				}
			}

			.part {
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 12px;

				.top {
					display: flex;
					color: #fff;
					justify-content: center;
					align-items: center;
					width: 91%;
					font-size: 14px;

					.right {
						transform: scaleX(-1);
					}
				}

				.bottom {
					.el-button {
						width: 140px;
						height: 40px;
					}
				}
			}

			.champion {
				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;

					& > span {
						@include themeify {
							color: themed("Text_s");
						}
					}
				}

				.content {
					display: flex;
					align-items: center;
					gap: 5px;
					margin-top: 10px;

					& > div {
						p {
							margin: 5px 0;
						}

						.name {
							@include themeify {
								color: themed("Text_s");
							}
						}

						.num {
							@include themeify {
								color: themed("Text1");
							}

							& > span {
								@include themeify {
									color: themed("f1");
									font-weight: 700;
								}
							}
						}
					}
				}
			}
		}

		.user-info {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			margin-top: 15px;
			border-radius: 5px;
			padding: 20px 120px 20px 20px;

			@include themeify {
				background: themed("Bg1");
			}

			.col1 {
				display: flex;
				align-items: center;
				gap: 10px;

				.avatar {
					width: 48px;
					height: 48px;
					border-radius: 50%;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.name {
					@include themeify {
						color: themed("Text_s");
					}
				}
			}

			.col2,
			.col3 {
				display: grid;
				align-items: center;

				& > p {
					@include themeify {
						color: themed("Text1");
					}
				}

				& > span {
					@include themeify {
						color: themed("f1");
					}
				}
			}

			.col4 {
				display: grid;
				align-items: center;

				& > p:first-child {
					@include themeify {
						color: themed("Text1");
					}
				}

				& > p:last-child {
					display: flex;
					gap: 10px;

					& > span:first-child {
						@include themeify {
							color: themed("Text_s");
						}
					}

					& > span:nth-of-type(2) {
						@include themeify {
							color: themed("Text1");
						}
					}

					& > span:last-child {
						background: rgba(243, 172, 60, 0.2);
						border-radius: 3px;
						padding: 1px 8px;

						@include themeify {
							color: themed("f1");
						}
					}
				}
			}
		}
	}

	.data {
		padding: 15px;
		border-radius: 5px;

		@include themeify {
			background: themed("Bg2");
		}

		margin-top: 15px;

		.history {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 15px;
			margin-bottom: 15px;

			@include themeify {
				border-bottom: 1px solid themed("Line");
			}

			.time {
				font-size: 14px;

				@include themeify {
					color: themed("Text2_1");
				}
			}

			button {
				border: none;
				width: 72px;
				height: 28px;

				@include themeify {
					background: themed("icon");
					color: themed("Text_s");
				}
			}
		}
	}
}

.rule-dialog {
	margin: 0 10px 15px 10px;
	padding: 0 10px;
	height: 700px;
	overflow: auto;

	&::-webkit-scrollbar {
		width: 5px;
	}

	&::-webkit-scrollbar-thumb {
		border-radius: 5px;

		@include themeify {
			background: themed("Text2");
		}
	}

	& > div {
		padding: 10px;
		border-radius: 5px;
		overflow: hidden;

		@include themeify {
			background: themed("Bg3");
			color: themed("Text1");
		}

		.title {
			display: flex;
			flex-direction: column;
			gap: 5px;

			& > span:first-child {
				@include themeify {
					color: themed("Text1");
				}
			}

			& > span:last-child {
				font-size: 14px;

				@include themeify {
					color: themed("Text2_1");
				}
			}
		}

		.rule-list {
			margin: 10px 0;

			p {
				margin: 5px 0;
			}
		}

		.formula {
			.title {
				font-size: 16px;
				margin: 20px 0 10px;
			}

			p {
				margin: 5px 0;
			}
		}
	}
}

.deposit-dialog {
	height: 100%;
	height: 780px;
	border-radius: 24px;
	overflow: hidden;
	box-sizing: border-box;
	padding-bottom: 30px;

	@include themeify {
		background: themed("Bg1");
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 25px;

		.label {
			display: flex;
			align-items: center;
			gap: 10px;

			@include themeify {
				color: themed("Text_s");
			}

			font-family: "PingFang SC";
			font-size: 20px;
			font-weight: 500;

			.time {
				font-size: 14px;

				@include themeify {
					color: themed("Text2_1");
				}
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

	.line {
		width: 100%;
		height: 1px;
		background: #373a40;
		margin: 0 25px 10px 25px;
		box-shadow: 0px 1px 0px 0px #1a1c20;
	}
}

:deep(.el-dialog) {
	background-color: unset;
	box-shadow: unset;
	overflow: hidden;
	// max-height: calc(100% - 220px);
}

:deep(.el-dialog.is-align-center) {
	margin: 110px auto;
}

:deep(.el-dialog__body) {
	height: 100%;
}

:deep(.el-dialog__header),
:deep(.el-dialog__body) {
	margin: 0;
	padding: 0;
}
</style>
