<template>
	<div class="collapse-panel">
		<div class="header pr_24" @click="handleClick" :class="isOpen ? 'isOpen' : ''">
			<div>
				<img :src="getRankTextIcon(panel?.vipRankCode)" alt="" />
				<span>{{ title }} {{ panel?.minVipGradeName }} - {{ panel?.maxVipGradeName }}</span>
			</div>
			<svg-icon :name="!isOpen ? 'common-arrow_down' : 'common-arrow_up'" size="20px" />
		</div>
		<div v-show="isOpen" class="collapse-content">
			<div>
				<div>等级</div>
				<div>所需经验</div>
				<div>升级奖金（{{ useUserStore().getUserInfo.platCurrencyName }}）</div>
			</div>
			<div v-for="item in panel?.siteVIPGradeVOList" class="cell">
				<div class="flex-center fs_16">
					<img :src="getVipRankImg(panel?.vipRankCode)" alt="" class="mr_5" />
					{{ item?.vipGradeName }}
				</div>
				<div>
					{{ item?.upgradeXp }}
				</div>
				<div>{{ item?.upgradeBonus }} {{ useUserStore().getUserInfo.platCurrencyName }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	title: string; // 面板的标题
	isOpen: boolean; // 是否展开，由父组件控制
	panel: {};
}>();
import rankTextIcon1 from "../image/rankTextIcon1.png";
import rankTextIcon2 from "../image/rankTextIcon2.png";
import rankTextIcon3 from "../image/rankTextIcon3.png";
import rankTextIcon4 from "../image/rankTextIcon4.png";
import rankTextIcon5 from "../image/rankTextIcon5.png";
import level1 from "../image/level1.png";
import level2 from "../image/level2.png";
import level3 from "../image/level3.png";
import level4 from "../image/level4.png";
import level5 from "../image/level5.png";
import { useUserStore } from "/@/stores/modules/user";
const getRankTextIcon = (vipRankCode: number) => {
	return vipRankCode == 1
		? rankTextIcon1
		: vipRankCode == 2
		? rankTextIcon2
		: vipRankCode == 3
		? rankTextIcon3
		: vipRankCode == 4
		? rankTextIcon4
		: vipRankCode == 5
		? rankTextIcon4
		: rankTextIcon5;
};
const getVipRankImg = (vipRankCode: number) => {
	return vipRankCode == 1 ? level1 : vipRankCode == 2 ? level2 : vipRankCode == 3 ? level3 : vipRankCode == 4 ? level4 : vipRankCode == 5 ? level4 : level5;
};
const emit = defineEmits(["toggle"]); // 发送 toggle 事件

const handleClick = () => {
	emit("toggle"); // 点击时触发 toggle 事件
};
</script>

<style scoped lang="scss">
.collapse-panel {
	border-radius: 4px;
	margin-bottom: 16px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	font-weight: bold;
	height: 46px;
	font-size: 14px;
	color: var(--Text-s);
	line-height: 46px;
	border-radius: 12px;
	background: linear-gradient(90deg, #353a3e 0%, #2c2d2e 100%);
	img {
		margin-right: 10px;
		width: 4px;
		height: 26px;
	}
}
.header.isOpen {
	border-radius: 12px 12px 0 0;
}

.arrow {
	transition: transform 0.3s ease;
}

.arrow.open {
	transform: rotate(180deg); /* 展开时箭头向上 */
}

.collapse-content {
	background: var(--Bg-3);
	padding: 16px;
	> div {
		display: flex;
		justify-content: space-around;
		text-align: center;
		height: 46px;
		line-height: 46px;
		border-radius: 8px;
		color: var(--Text-1);
		> div {
			flex: 1;
		}
		img {
			width: 22.261px;
			height: 21.217px;
		}
		.flex-center {
			gap: 3px;
		}
	}
	.cell:nth-child(odd) {
		background: var(--Bg-2);
	}
}
</style>
