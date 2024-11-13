<template>
	<div class="card">
		<div class="vipLevelBg">
			<div>
				<img v-lazy-load="getViplevelImg(vipInfo.vipRank)" alt="" class="vipLevelIcon" />
			</div>
			<div class="experience">
				<div class="fs_20 mb_5">{{ vipInfo.vipGradeName }}</div>
				<div class="flex-alignCenter">
					<span v-if="vipInfo.vipGradeUp !== vipInfo.vipGradeCode">升级所需经验:</span>
					<span v-if="vipInfo.vipGradeUp !== vipInfo.vipGradeCode"
						><span class="color_Theme">{{ vipInfo.currentExp }}</span
						>/{{ vipInfo.currentVipExp }}</span
					>
					<span v-else-if="vipInfo.vipGradeUp">您已到达最高等级</span>
				</div>
			</div>

			<div class="progress">
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
						<img src="../../vip/image/progressIcon.png" alt="" v-if="vipInfo.currentExp / vipInfo.currentVipExp > 0" />
					</div>
				</div>
				<div class="levelIcon">
					<img v-lazy-load="getVipRankImg(vipInfo.nextVipRank)" alt="" />
					<span class="levelvalue">{{ vipInfo.vipGradeUpName }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import ClickTooltip from "/@/components/ClickTooltip.vue";
import level1 from "../../vip/image/level1.png";
import level2 from "../../vip/image/level2.png";
import level3 from "../../vip/image/level3.png";
import level4 from "../../vip/image/level4.png";
import level5 from "../../vip/image/level5.png";
import rank1 from "../../vip/image/rank1.png";
import rank2 from "../../vip/image/rank2.png";
import rank3 from "../../vip/image/rank3.png";
import rank4 from "../../vip/image/rank4.png";
import rank5 from "../../vip/image/rank5.png";
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
</script>

<style lang="scss" scoped>
.card {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	gap: 16px;
	.vipLevelBg {
		width: 432px;
		height: 146px;
		position: relative;
		background: url("../image/vipLevelBg.png") no-repeat;
		background-size: 100% 100%;
		.currentLevelText {
			background: url("../../vip/image/levelText_bg.png") no-repeat;
			background-size: auto 100%;
			padding: 8px 21px;
			color: var(--Text-a);
			font-weight: 500;
		}
		.vipLevelIcon {
			position: absolute;
			right: 24px;
			top: -26px;
			width: 102px;
			height: 98px;
		}
		.experience {
			padding-left: 34px;
			margin: 22px 0 12px 0;
			color: var(--Text-a);
			.tooltipImg {
				width: 16px;
				height: 16px;
			}
		}
		.progress {
			display: flex;
			padding: 0 34px;
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
					color: var(--Text-s);
					font-size: 12px;
				}
			}
			.progressBg {
				flex: 1;
				background: url("../../vip/image/progressBg.png") center no-repeat;
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
					background: var(--Theme);
					max-width: 100%;
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
		background: var(--Bg-1);
		border-radius: 12px;
		overflow: hidden;
		position: relative;

		.kefuTagBg {
			font-size: 16px;
			color: var(--Text-a);
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
}
</style>
