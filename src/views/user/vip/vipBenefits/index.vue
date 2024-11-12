<template>
	<div class="max-width pl_10 pr_10">
		<div class="banner">
			<img src="./image/banner.png" alt="" />
			<div class="bannerContent">
				<div class="bannberTitle">VIP专属福利</div>
				<div class="bannberLabel">立即加入我们的 VIP 俱乐部，准备好享受丰厚的礼品、赠品和超棒的功能！体验更高现金返还和独家奖励带来的快感，一定会让您惊喜不已。</div>
				<div class="bannberBottom">
					<div @click="router.push('/')">去玩游戏</div>
					<div @click="useModalStore().openModal('vipHierarchy')">查看详情</div>
				</div>
			</div>
		</div>
		<div class="cradList">
			<div v-for="(item, index) in cradList" :key="index" class="card">
				<div>
					<img :src="item.icon" alt="" />
				</div>
				<div>
					<div class="fs_22 Texta mb_10">{{ item.title }}</div>
					<div class="Text1">{{ item.label }}</div>
				</div>
			</div>
		</div>
		<div class="Text_s mb_16 mt_20">VIP奖励明细</div>
		<div class="table">
			<div class="row">
				<div class="cell">&nbsp;</div>
				<div v-for="(awarditem, awardIndex) in awardList" class="cell">
					<div class="Text_s">
						{{ awarditem.label }}
					</div>
				</div>
			</div>
			<div class="row" v-for="(item, index) in vipRankList">
				<!-- <div v-if="index == 0" class="cell">&nbsp;</div>
				<div v-for="(awarditem, awardIndex) in awardList" v-if="index == 0" class="cell">
					<div class="Text_s">
						{{ awarditem.label }}
					</div>
				</div> -->
				<div class="cell Text_s"><img :src="getVipRankImg(item.vipRankCode)" alt="" class="levelIcon" />{{ item.vipRankNameI18nCode }}</div>
				<div v-for="awarditem in awardList" class="cell">
					<div v-if="item[awarditem.flag]">
						<img :src="getVipStarImg(item.vipRankCode)" alt="" />
					</div>
					<div v-else class="Text1">-</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import card1Icon from "./image/card1Icon.png";
import card2Icon from "./image/card2Icon.png";
import card3Icon from "./image/card3Icon.png";
import card4Icon from "./image/card4Icon.png";
import star1Icon from "./image/star1.png";
import star2Icon from "./image/star2.png";
import star3Icon from "./image/star3.png";
import star4Icon from "./image/star4.png";
import star5Icon from "./image/star5.png";
import level1 from "../image/level1.png";
import level2 from "../image/level2.png";
import level3 from "../image/level3.png";
import level4 from "../image/level4.png";
import level5 from "../image/level5.png";
import { vipApi } from "/@/api/vip";
import { i18n } from "/@/i18n/index";
import router from "/@/router";
import { useModalStore } from "/@/stores/modules/modalStore";
const $: any = i18n.global;
const vipRankList: any = ref([]);
const cradList = ref([
	{
		icon: card1Icon,
		title: "加密货币免费提现",
		label: "解锁 VIP 38 的加密货币免费提款特权轻松提取您的奖金，无需支付额外费用。",
	},
	{
		icon: card2Icon,
		title: "奖励幸运旋转",
		label: "旋转轮盘，随着您等级的提高，通过我们激动人心的幸运旋转获得更大的奖品。",
	},
	{
		icon: card3Icon,
		title: "惊人的升级奖金",
		label: "惊喜的奖励正在等着你，随着你等级的提升，奖励会被多次解锁。",
	},
	{
		icon: card4Icon,
		title: "豪华赠品",
		label: "尊享赠送私人顶级奢华福利机会。",
	},
]);
const awardList: any = [
	{
		label: $.t(`vip['升级奖金']`),
		flag: "upgradeFlag",
		value: "upgrade",
	},
	{
		label: $.t(`vip['幸运转盘']`),
		flag: "luckFlag",
	},
	{
		label: $.t(`vip['每周流水礼金']`),
		flag: "weekAmountFlag",
	},
	{
		label: $.t(`vip['每月流水礼金']`),
		flag: "monthAmountFlag",
	},
	{
		label: $.t(`vip['周体育流水礼金']`),
		flag: "weekSportFlag",
	},

	{
		label: $.t(`vip['免加密货币提款手续费']`),
		flag: "encryCoinFee",
	},
	{
		label: $.t(`vip['SVIP专属福利']`),
		flag: "svipWelfareFlag",
	},
	{
		label: $.t(`vip['豪华赠品']`),
		flag: "luxuriousGiftsFlag",
	},
];
const getVipStarImg = (vipRankCode: number) => {
	return vipRankCode == 1 ? star1Icon : vipRankCode == 2 ? star2Icon : vipRankCode == 3 ? star3Icon : vipRankCode == 4 ? star4Icon : vipRankCode == 5 ? star4Icon : star5Icon;
};
const getVipRankImg = (vipRankCode: number) => {
	return vipRankCode == 1 ? level1 : vipRankCode == 2 ? level2 : vipRankCode == 3 ? level3 : vipRankCode == 4 ? level4 : vipRankCode == 5 ? level4 : level5;
};
const loading = ref(false);
onMounted(() => {
	vipApi.getUserVipInfo().then((res) => {
		vipRankList.value = res.data.vipBenefit;
	});
});
</script>

<style scoped lang="scss">
.banner {
	margin-top: 30px;
	width: 100%;
	position: relative;
	img {
		width: 100%;
	}
	.bannerContent {
		position: absolute;
		top: 56px;
		left: 60px;
		width: 535px;
		.bannberTitle {
			font-weight: 600;
			font-size: 36px;
			background: linear-gradient(180deg, #feeed5 25.6%, #e8c192 88.69%);
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
		.bannberLabel {
			font-size: 18px;
			color: var(--Text-a);
		}
		.bannberBottom {
			display: flex;
			margin-top: 38px;
			gap: 10px;
			div {
				border-radius: 4px;
				width: 192px;
				height: 46px;
				line-height: 46px;
				text-align: center;
				color: var(--Text-a);
				background: var(--Butter);
				cursor: pointer;
				font-size: 13.818px;
			}
			> div:first-child {
				background: var(--Theme);
			}
		}
	}
}
.cradList {
	display: flex;
	flex-wrap: wrap;
	gap: 14px;
	width: 100%;
	padding: 14px 0;
	.card {
		display: flex;
		width: calc(50% - 7px);
		height: 172px;
		align-items: center;
		padding: 21px 43px;
		gap: 38px;
		background: url("./image/cardBg.png") no-repeat;
		background-size: 100% 100%;
		img {
			width: 130px;
			height: 130px;
		}
	}
}
.table {
	display: flex;
	justify-content: space-around;
	border-left: 1px solid var(--Line-2);
	border-top: 1px solid var(--Line-2);
	border-radius: 12px;
	overflow: hidden;
	.row {
		flex: 1;
	}
	.cell {
		height: 58px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid var(--Line-2);
		border-bottom: 1px solid var(--Line-2);
		background: var(--Bg-3);
		padding: 16px;
		img {
			height: 30px;
		}
		.levelIcon {
			margin-right: 10px;
			width: 25.571px;
			height: 24.373px;
		}
	}
	.row:first-child {
		flex: 1.5;
		.cell {
			justify-content: start;
		}
	}
	.row {
		.cell:first-child {
			background: var(--Bg-2);
		}
	}
}
</style>
