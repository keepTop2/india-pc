<template>
	<div class="card">
		<div class="vipLevelBg">
			<div class="currentLevelText">当前等级</div>
			<div>
				<img src="../image/level0.png" alt="" class="vipLevelIcon" />
			</div>
			<div class="experience">
				<div class="fs_20 mb_5">VIP0</div>
				<div class="flex-alignCenter">
					<span>升级所需经验:</span> <span>{{ vipInfo.currentVipExp }}/{{ vipInfo.upgradeVipExp }}</span>
					<ClickTooltip class="ml_5 curp" message="">
						<template v-slot:icon>
							<img src="../image/tooltip.png" alt="" class="tooltipImg" />
						</template>
						<template v-slot:message> 体育/电竞场馆投注1 $ = 2积分，其他场馆投注 1$=1积分，所有投注 均按当前汇率兑换为美元结算 </template>
					</ClickTooltip>
				</div>
			</div>

			<div class="progress">
				<div class="levelIcon">
					<img src="../image/rank0.png" alt="" />
					<span class="levelvalue">LV{{ vipInfo.vipGradeCode }}</span>
				</div>
				<div class="progressBg">
					<div
						class="value"
						:style="{
							width: (vipInfo.currentVipExp / vipInfo.upgradeVipExp) * 100 + '%',
							background: vipInfo.currentVipExp / vipInfo.upgradeVipExp == 0 ? 'rgba(0,0,0,0)' : 'var(--Theme)',
						}"
					>
						<div class="progressValue">
							<div>{{ ((vipInfo.currentVipExp / vipInfo.upgradeVipExp) * 100 || 0).toFixed(2) }}%</div>
							<img src="../image/jiantou.png" alt="" />
						</div>
						<img src="../image/progressIcon.png" alt="" v-if="vipInfo.currentVipExp / vipInfo.upgradeVipExp > 0" />
					</div>
				</div>
				<div class="levelIcon">
					<img src="../image/rank0.png" alt="" />
					<span class="levelvalue">LV{{ vipInfo.vipGradeUp }}</span>
				</div>
			</div>
		</div>
		<div class="kefu">
			<div class="kefuTagBg">专属客服</div>
			<div class="tooltip">
				<ClickTooltip class="curp" message="">
					<template v-slot:icon>
						<img src="../image/tooltip.png" alt="" class="tooltipImg" />
					</template>
					<template v-slot:message> 体育/电竞场馆投注1 $ = 2积分，其他场馆投注 1$=1积分，所有投注 均按当前汇率兑换为美元结算 </template>
				</ClickTooltip>
			</div>
			<div class="kefuText">
				<div class="kefuIcon">
					<img src="../image/kefuIcon.png" alt="" />
				</div>
				<div class="fs_10 Text1">通过VIP升级获得专属定制化服务 超过换行超过换行超过换行超过</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import ClickTooltip from "/@/components/ClickTooltip.vue";

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
		padding-top: 20px;
		width: 540px;
		height: 260px;
		position: relative;
		background: url("../image/vipLevelBg.png") no-repeat;
		background-size: 100% 100%;
		.currentLevelText {
			background: url("../image/levelText_bg.png") no-repeat;
			background-size: auto 100%;
			padding: 8px 21px;
			color: var(--Text_a);
			font-weight: 500;
		}
		.vipLevelIcon {
			position: absolute;
			right: 0;
			top: 0px;
			width: 158px;
			height: 152px;
		}
		.experience {
			height: 100px;
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
}
</style>
