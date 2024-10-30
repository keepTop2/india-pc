<template>
	<div class="awardCardList" v-if="data">
		<div v-for="item in awardList.filter((item) => data[item.flag])" class="awardCard">
			<div class="imgBox">
				<img :src="item.icon" alt="" />
				<div class="lock" v-if="data[item.flag] == 1">
					<img src="../image/lock.png" alt="" />
				</div>
			</div>

			<div class="pr_10">
				<div class="Text_s fs_12">
					{{ item.label }}
					<ClickTooltip v-if="item.flag == 'weekSportFlag'" class="ml_5 curp">
						<template v-slot:icon>
							<img src="../image/tooltip.png" alt="" class="tooltipImg" />
						</template>
						<template v-slot:message>
							<div>
								<p>7天体育赌注：</p>
								<p v-for="i in data.vipWeekSportVOS">
									-投注{{ useUserStore().getUserInfo.platCurrencySymbol }} {{ i.weekSportMin }} 至
									{{ i.weekSportMax > 0 ? `${useUserStore().getUserInfo.platCurrencySymbol} ${i.weekSportMax}` : "以上" }} = {{ i.weekSportBonus }}
									{{ useUserStore().getUserInfo.platCurrencySymbol }}
								</p>
								<p>-流水统计时间：周六00:00时～周五 23:59时（7天） ﻿﻿礼金发放时间：每周六"</p>
							</div>
						</template>
					</ClickTooltip>
				</div>
				<div>
					<span class="Text1 fs_12" v-if="item.flag == 'weekAmountFlag'">
						<span
							v-html="$t(`vip['会员根据每周投注额度获得周流水的礼金奖励']`, { value1: `<span class='color_f1'>*${data.weekAmountProp1}%*${data.weekAmountProp2}%</span>` })"
						></span>
					</span>
					<span class="Text1 fs_12" v-if="item.flag == 'luckFlag'">
						<span v-html="$t(`vip['从VIP8开始，达到活动要求即可获得每日抽取幸运大奖得机会']`, { value: data.luckMinVipGradeName })"></span>
					</span>
					<span class="Text1 fs_12" v-else-if="item.flag == 'monthAmountFlag'">
						<span
							v-html="$t(`vip['会员根据每月投注额度获得月流水的礼金奖励']`, { value1: `<span class='color_f1'>*${data.monthAmountProp1}%*${data.monthAmountProp2}%</span>` })"
						></span>
					</span>
					<span class="Text1 fs_12" v-else
						>{{ item.text }}
						<span class="color_f1" v-if="item.value">{{ data[item.value] }} {{ useUserStore().getUserInfo.platCurrencyName }}</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import awardicon1 from "../image/awardicon1.png";
import awardicon2 from "../image/awardicon2.png";
import awardicon3 from "../image/awardicon3.png";
import awardicon4 from "../image/awardicon4.png";
import awardicon5 from "../image/awardicon5.png";
import awardicon6 from "../image/awardicon6.png";
import awardicon7 from "../image/awardicon7.png";
import awardicon8 from "../image/awardicon8.png";
const props = defineProps({
	data: {} as any,
	vipRankCode: Number,
});
import { i18n } from "/@/i18n/index";
import { useUserStore } from "/@/stores/modules/user";
const $: any = i18n.global;
const awardList: any = [
	{
		label: $.t(`vip['升级奖励']`),
		text: $.t(`vip['总奖金:']`),
		icon: awardicon1,
		flag: "upgradeFlag",
		value: "upgrade",
	},
	{
		label: $.t(`vip['每周流水礼金']`),
		text: $.t(`vip['会员根据每周投注额度获得周流水的礼金奖励']`),
		icon: awardicon2,
		flag: "weekAmountFlag",
	},
	{
		label: $.t(`vip['每月流水礼金']`),
		text: $.t(`vip['会员根据每月投注额度获得月流水的礼金奖励']`),
		icon: awardicon3,
		flag: "monthAmountFlag",
	},
	{
		label: $.t(`vip['周体育流水礼金']`),
		text: $.t(`vip['会员根据每周体育投注额度获得额外礼金奖励']`),
		icon: awardicon4,
		flag: "weekSportFlag",
	},
	{
		label: $.t(`vip['SVIP专属福利']`),
		text: $.t(`vip['成为钻石会员尊享更多私人专属福利惊喜']`),
		icon: awardicon5,
		flag: "svipWelfareFlag",
	},
	{
		label: $.t(`vip['豪华赠品']`),
		text: $.t(`vip['尊享赠送私人顶级奢华福利机会']`),
		icon: awardicon6,
		flag: "luxuriousGiftsFlag",
	},
	{
		label: $.t(`vip['幸运转盘']`),
		text: $.t(`vip['从VIP8开始，达到活动要求即可获得每日抽取幸运大奖得机会']`),
		icon: awardicon7,
		flag: "luckFlag",
	},
	{
		label: $.t(`vip['免加密货币提款手续费']`),
		text: $.t(`vip['免除加密货币提款手续费']`),
		icon: awardicon8,
		flag: "encryCoinFee",
	},
];
</script>

<style scoped lang="scss">
.awardCardList {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	gap: 24px;
	padding: 0 24px;
	.awardCard {
		width: 100%;
		height: 78px;
		background: url("../image/awardCardBg.png") no-repeat;
		background-size: 100% 100%;
		border-radius: 10px;
		display: flex;
		align-items: center;
		.imgBox {
			margin: 0 12px;
			width: 37px;
			height: 37px;
			opacity: 0.8;
			background: #000;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 9px;
			position: relative;
			img {
				width: 28.5px;
				height: 28.5px;
			}
			.lock {
				width: 100%;
				height: 100%;
				position: absolute;
				background: #000;
				opacity: 0.8;
				display: flex;
				align-items: center;
				border-radius: 9px;
				justify-content: center;
				img {
					width: 18px;
					height: 18px;
				}
			}
		}
	}
}
.tooltipImg {
	width: 12px;
	height: 12px;
}
</style>
