<template>
	<div class="vipWrapper" v-ok-loading="loading">
		<div class="Header">
			<div class="title">
				{{ $t(`user['VIP等级制度']`) }}
			</div>
			<span class="closeIcon curp" @click="useModalStore().closeModal()"><img src="./image/close_icon.png" alt="" /></span>
		</div>
		<div class="content">
			<CollapsePanel
				v-for="(panel, index) in vipInfo.siteVIPSystemRankVOList?.filter((item:any) => item.vipRankCode !== 0)"
				:key="index"
				:title="panel.vipRankNameI18nCode"
				:isOpen="activePanelIndex === index"
				@toggle="setActivePanel(index)"
				:panel="panel"
			>
			</CollapsePanel>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useModalStore } from "/@/stores/modules/modalStore";
import CollapsePanel from "./components/CollapsePanel.vue";
import { onMounted, ref } from "vue";
import { vipApi } from "/@/api/vip";
const loading = ref(false);
const vipInfo: any = ref({});
const activePanelIndex = ref<number | null>(null);
// 设置当前展开的面板，点击时控制唯一展开
const setActivePanel = (index: number) => {
	activePanelIndex.value = activePanelIndex.value === index ? null : index;
};

onMounted(() => {
	loading.value = true;
	vipApi
		.getUserVipBenefitDetail()
		.then((res) => {
			vipInfo.value = res.data;
			activePanelIndex.value = res.data.currentVIPRankCode - 1;
		})
		.finally(() => {
			loading.value = false;
		});
});
</script>

<style scoped lang="scss">
.vipWrapper {
	width: 534px;
	max-height: 80vh;
	height: 80vh;
	background-size: 100% 100%;
	padding: 24px;

	.Header {
		position: relative;
		margin-bottom: 22px;
		.title {
			padding-top: 10px;
			padding-bottom: 20px;
			width: 100%;
			text-align: center;
			color: var(--Text-s);
			font-size: 20px;
		}
		.closeIcon {
			position: absolute;
			right: 22px;
			top: 10px;

			img {
				width: 30px;
				height: 30px;
			}
		}
	}
	.content {
		height: 100%;
		overflow: auto;
		max-height: calc(80vh - 120px);
		padding-bottom: 20px;
	}
	.content::-webkit-scrollbar {
		display: none;
	}
}
</style>
