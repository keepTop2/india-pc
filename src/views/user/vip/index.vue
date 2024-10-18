<template>
	<div class="vipWrapper" v-ok-loading="loading">
		<div class="Header">
			<div class="title">
				{{ "VIP俱乐部" }}
			</div>
			<span class="closeIcon curp" @click="useModalStore().closeModal"><img src="./image/close_icon.png" alt="" /></span>
		</div>

		<div class="content">
			<div class="card1">
				<div>通过升级获得丰厚礼金和专属福利！加入我们精英俱乐部， 享受OKsport提供的最佳游戏体验。</div>
				<span class="goToVipRule curp" @click="useModalStore().openModal('vipHierarchy')">查看VIP等级制度</span>
			</div>
			<vipCard :vipInfo="vipInfo"></vipCard>
			<div class="title mt_30">
				<img src="./image/titleLeft.png" alt="" />
				VIP福利
				<img src="./image/titleRight.png" alt="" />
			</div>
			<div class="vipRank">
				<div v-for="(item, index) in vipRankList" :key="index">
					<div @click="changeVip(item, index)" :class="index == currentVipIndex ? 'active' : ''" class="vipRankItem curp">
						<img :src="getVipRankImg(item.vipRankCode)" alt="" />
					</div>
					<div class="vipRankItemLabel">{{ item.vipRankNameI18nCode }}</div>
				</div>
			</div>
			<div class="vipLevelText">
				<img :src="getRankTextIcon(vipRankList[currentVipIndex]?.vipRankCode)" alt="" />
				{{ vipRankList[currentVipIndex]?.vipRankNameI18nCode }} {{ vipRankList[currentVipIndex]?.minVipGrade }}-{{ vipRankList[currentVipIndex]?.maxVipGrade }}
			</div>
			<awardCardList :data="vipRankList[currentVipIndex]" :vipRankCode="vipRankList[currentVipIndex]?.vipRankCode"></awardCardList>
			<div class="card1 mt_30">
				<span class="goToVipRule curp" @click="goToVipBenefits">详细了解 OKsport的VIP福利系统</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useModalStore } from "/@/stores/modules/modalStore";
import vipCard from "./components/vipCard.vue";
import awardCardList from "./components/awardCardList.vue";
import { onMounted, ref } from "vue";
import { vipApi } from "/@/api/vip";
import level1 from "./image/level1.png";
import level2 from "./image/level2.png";
import level3 from "./image/level3.png";
import level4 from "./image/level4.png";
import level5 from "./image/level5.png";
import rankTextIcon1 from "./image/rankTextIcon1.png";
import rankTextIcon2 from "./image/rankTextIcon2.png";
import rankTextIcon3 from "./image/rankTextIcon3.png";
import rankTextIcon4 from "./image/rankTextIcon4.png";
import rankTextIcon5 from "./image/rankTextIcon5.png";
import { useRouter } from "vue-router";
const router = useRouter();
const vipInfo: any = ref({});
const vipRankList: any = ref([]);
const loading = ref(false);
const getVipRankImg = (vipRankCode: number) => {
	return vipRankCode == 1 ? level1 : vipRankCode == 2 ? level2 : vipRankCode == 3 ? level3 : vipRankCode == 4 ? level4 : vipRankCode == 5 ? level4 : level5;
};
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
const currentVipIndex = ref(0);
const changeVip = (item: any, index: any) => {
	currentVipIndex.value = index;
};
const goToVipBenefits = () => {
	useModalStore().closeModal();
	router.push("/user/vipBenefits");
};
onMounted(() => {
	loading.value = true;
	vipApi
		.getUserVipInfo()
		.then((res) => {
			vipInfo.value = res.data;
			vipRankList.value = res.data.vipBenefit.filter((item: any) => item.vipRankCode > 0);
			currentVipIndex.value =
				vipRankList.value.findIndex((item: any) => item.vipRankCode == res.data.vipRank) == -1
					? 0
					: vipRankList.value.findIndex((item: any) => item.vipRankCode == res.data.vipRank);
		})
		.finally(() => {
			loading.value = false;
		});
});
</script>

<style scoped lang="scss">
.vipWrapper {
	width: 780px;
	max-height: 80vh;
	background: url("./image/bg.png") no-repeat;
	background-size: 100% 100%;
	padding-bottom: 20px;
	.Header {
		position: relative;
		margin-bottom: 22px;
		.title {
			padding-top: 30px;
			padding-bottom: 20px;
			width: 100%;
			text-align: center;
			color: var(--Text_s);
			font-size: 20px;
		}
		.closeIcon {
			position: absolute;
			right: 22px;
			top: 28px;

			img {
				width: 30px;
				height: 30px;
			}
		}
	}
	.card1 {
		width: 548px;
		color: var(--Text1);
		margin: 0 auto 30px;
		text-align: center;
		.goToVipRule {
			display: inline-block;
			margin-top: 16px;
			padding: 0 30px;
			height: 44px;
			margin: 20px auto 0;
			line-height: 44px;
			text-align: center;
			border: 1px solid var(--Theme);
			border-radius: 12px;
			font-size: 14px;
			color: var(--Theme);
		}
	}

	.content {
		height: 100%;
		overflow: auto;
		max-height: calc(80vh - 100px);
		padding-bottom: 20px;
		.title {
			text-align: center;
			margin: 0 auto;
			color: var(--Theme);
			font-size: 20px;
			img {
				height: 12px;
				margin: 0 12px;
			}
		}
		.vipRank {
			padding: 0 83px;
			justify-content: space-between;
			display: flex;
			margin-top: 24px;
			.vipRankItem {
				width: 64px;
				height: 64px;
				border-radius: 12px;
				background: linear-gradient(90deg, #353a3e 0%, #2c2d2e 100%);
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}
			img {
				width: 38.4px;
				height: 36.6px;
			}
			.vipRankItem.active {
				border: 1px solid var(--Theme);
			}
			.vipRankItemLabel {
				text-align: center;
				margin-top: 10px;
				color: var(--Text1);
				font-size: 14px;
			}
		}
		.vipLevelText {
			height: 46px;
			margin: 16px 24px;
			font-size: 14px;
			color: var(--Text_s);

			line-height: 46px;
			border-radius: 12px;
			background: linear-gradient(90deg, #353a3e 0%, #2c2d2e 100%);
			img {
				margin-right: 10px;
				width: 4px;
				height: 26px;
			}
		}
	}
	.content::-webkit-scrollbar {
		display: none;
	}
}
</style>
