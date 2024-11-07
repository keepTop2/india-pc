<template>
	<div class="card">
		<div class="vipLevelBg" :class="vipInfo.vipGradeUp === vipInfo.vipGradeCode ? 'topLevelBg' : ''">
			<div class="currentLevelText">当前等级</div>
			<div>
				<img v-lazy-load="getViplevelImg(vipInfo.vipRank)" alt="" class="vipLevelIcon" />
			</div>
			<div class="experience" v-if="vipInfo.vipGradeUp !== vipInfo.vipGradeCode">
				<div class="fs_20 mb_5">{{ vipInfo.vipGradeName }}</div>
				<div class="flex-alignCenter">
					<span>升级所需经验:</span> <span>{{ vipInfo.currentExp }}/{{ vipInfo.currentVipExp }}</span>
					<ClickTooltip class="ml_5 curp" message="" width="270">
						<template v-slot:icon>
							<img src="../image/tooltip.png" alt="" class="tooltipImg" />
						</template>
						<template v-slot:message>
							体育/电竞场馆投注 1 {{ useUserStore().getUserInfo.platCurrencyName }} = {{ vipInfo.sportExe }} 积分，其他场馆投注 1
							{{ useUserStore().getUserInfo.platCurrencyName }}
							= 1 积分，所有投注 均按当前汇率兑换为{{ useUserStore().getUserInfo.platCurrencyName }}结算
						</template>
					</ClickTooltip>
				</div>
			</div>

			<div class="progress" v-if="vipInfo.vipGradeUp !== vipInfo.vipGradeCode">
				<div class="levelIcon">
					<img v-lazy-load="getVipRankImg(vipInfo.vipRank)" alt="" />
					<span class="levelvalue">{{ vipInfo.vipGradeName }}</span>
				</div>
				<div class="progressBg">
					<div
						class="value"
						:style="{
							width: (vipInfo.currentExp / vipInfo.currentVipExp) * 100 + '%',
							background: vipInfo.currentExp / vipInfo.currentVipExp == 0 ? 'rgba(0,0,0,0)' : 'var(--Theme)',
						}"
					>
						<div class="progressValue" v-if="(vipInfo.currentExp / vipInfo.currentVipExp) * 100 < 100">
							<div>{{ truncateToTwoDecimals((vipInfo.currentExp / vipInfo.currentVipExp) * 100 || 0) }}%</div>
							<img src="../image/jiantou.png" alt="" />
						</div>
						<img src="../image/progressIcon.png" alt="" v-if="vipInfo.currentExp / vipInfo.currentVipExp > 0" />
					</div>
				</div>
				<div class="levelIcon">
					<img v-lazy-load="getVipRankImg(vipInfo.nextVipRank)" alt="" />
					<span class="levelvalue">{{ vipInfo.vipGradeUpName }}</span>
				</div>
			</div>
			<div v-else class="topLevel">
				<div class="fs_20 mb_5">{{ vipInfo.vipGradeName }}</div>
				<div class="fs_20 mb_5">恭喜！您已达到最高等级</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import ClickTooltip from "/@/components/ClickTooltip.vue";
import level1 from "../image/level1.png";
import level2 from "../image/level2.png";
import level3 from "../image/level3.png";
import level4 from "../image/level4.png";
import level5 from "../image/level5.png";
import rank1 from "../image/rank1.png";
import rank2 from "../image/rank2.png";
import rank3 from "../image/rank3.png";
import rank4 from "../image/rank4.png";
import rank5 from "../image/rank5.png";
import { useUserStore } from "/@/stores/modules/user";
const getViplevelImg = (vipRankCode) => {
	return vipRankCode == 1 ? level1 : vipRankCode == 2 ? level2 : vipRankCode == 3 ? level3 : vipRankCode == 4 ? level4 : vipRankCode == 5 ? level4 : level5;
};
const getVipRankImg = (vipRankCode) => {
	return vipRankCode == 1 ? rank1 : vipRankCode == 2 ? rank2 : vipRankCode == 3 ? rank3 : vipRankCode == 4 ? rank4 : vipRankCode == 5 ? rank4 : rank5;
};
const props = defineProps({
	vipInfo: {},
});
const truncateToTwoDecimals = (num) => {
	const [integerPart, decimalPart] = String(num).split(".");
	// 如果没有小数部分，直接返回整数部分
	if (!decimalPart) return integerPart + ".00";
	// 截取小数点后两位
	return integerPart + "." + decimalPart.slice(0, 2);
};
</script>

<style lang="scss" scoped>
.card {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	gap: 16px;

	.vipLevelBg {
		padding-top: 16px;
		width: 486px;
		height: 209px;
		position: relative;
		background: url("../image/vipLevelBg.png") no-repeat;
		background-size: 100% 100%;
		.currentLevelText {
			width: 106px;
			background: url("../image/levelText_bg.png") no-repeat;
			background-size: 100% 100%;
			padding: 5px 21px;
			color: var(--Text_a);
			font-weight: 500;
		}
		.vipLevelIcon {
			position: absolute;
			right: 30px;
			top: 0px;
			width: 131px;
			height: 124px;
		}
		.experience {
			height: 70px;
			padding-left: 38px;
			margin-top: 22px;
			color: var(--Text_a);
			.tooltipImg {
				width: 16px;
				height: 16px;
			}
		}
		.progress {
			display: flex;
			padding: 0 42px;
			gap: 10px;

			.levelIcon {
				position: relative;
				img {
					width: 74px;
					height: 32px;
				}
				.levelvalue {
					position: absolute;
					left: 0;
					padding-left: 32px;
					width: 100%;
					text-align: center;
					line-height: 38px;
					color: var(--Text_s);
					font-size: 12px;
				}
			}
			.progressBg {
				flex: 1;
				background: url("../image/progressBg.png") center no-repeat;
				background-size: 100% auto;
				position: relative;
				height: 16px;
				margin-top: 15px;
				.value {
					position: absolute;
					left: 1px;
					top: 2.3px;
					width: 0px;
					height: 11px;
					padding-left: 20px;
					border-radius: 15.36px;
					max-width: 100%;
					background: var(--Theme);
					> img {
						position: absolute;
						right: 0;
						top: -3px;
						height: 16px;
					}
					.progressValue {
						position: absolute;
						right: 0;
						top: -35px;
						text-align: center;
						transform: translateX(37%);
						background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
						-webkit-background-clip: text; /* 为文本裁剪背景 */
						color: transparent; /* 设置字体颜色透明 */
						font-weight: bold; /* 可选：使文本加粗 */
						img {
							height: 5px;
							margin-top: -20px;
						}
					}
				}
			}
		}
	}
	.kefu {
		width: 176px;
		height: 195px;
		background: var(--Bg1);
		border-radius: 12px;
		overflow: hidden;
		position: relative;

		.kefuTagBg {
			font-size: 16px;
			color: var(--Text_a);
			padding-left: 5px;
			background: url("../image/kefuTagBg.png") no-repeat;
			background-size: auto 100%;
		}
		img {
			width: 100%;
		}
		.tooltip {
			position: absolute;
			right: 6px;
			top: 6px;
			width: 20px;
			height: 20px;
		}
		.kefuText {
			.kefuIcon {
				height: 110px;
				line-height: 110px;
			}
			padding: 0 20px;
		}
	}
	.topLevelBg {
		height: 159px;
		padding-top: 18px;
		background: url("../image/vipLevelBg2.png") no-repeat;
		background-size: 100% 100%;
	}
}
.topLevel {
	background: linear-gradient(250deg, #fdfdfd 6.39%, #bebebe 35.7%, #fdfdfd 66.76%, #979797 93.89%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-left: 22px;
	margin-top: 25px;
	font-weight: 500;
	font-size: 20px;
}
</style>
