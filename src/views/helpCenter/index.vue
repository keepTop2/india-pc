<template>
	<div class="max-width pl_10 pr_10">
		<div class="title mt_15 mb_15">
			<span class="fs_20 Text_s"> 帮助中心 </span>
		</div>
		<div class="wrapper">
			<div class="tabs">
				<CollapsePanel
					v-for="(item, index) in classList"
					:key="index"
					:subindex="subindex"
					:isOpen="activeIndex === index"
					@toggle="setActivePanel(index)"
					:panel="item"
					@selectClass="selectClass"
				></CollapsePanel>
			</div>
			<div class="content" v-ok-loading="contentLoading">
				<div class="tabs2">
					<div v-for="(item, index) in subClassList" :class="activeTab == index ? 'active' : ''" class="curp" @click="setActiveTab(index)">{{ item.name }}</div>
				</div>
				<div class="line"></div>
				<div class="mt_16 valueBox">
					<div class="card mb_32" v-for="item in subClassList[activeTab]?.subset">
						<div class="title">{{ item.name }}</div>
						<div class="value Text1">
							<p v-for="item in 100">123123</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { i18n } from "/@/i18n/index";
import { useRoute } from "vue-router";
import { helpCenterApi } from "/@/api/helpCenter";
import CollapsePanel from "./CollapsePanel.vue";
const classList: any = ref([]);
const subClassList: any = ref([]);
const activeIndex: any = ref(0);
const subindex: any = ref(0);
const activeTab = ref(0);
const contentLoading = ref(false);
onMounted(() => {
	getClassOne();
});
const setActivePanel = (index: number) => {
	if (activeIndex.value === index) {
		return;
	} else {
		activeIndex.value = index;
		subindex.value = 0;
		getContent();
	}
};
const setActiveTab = (index: number) => {
	activeTab.value = index;
};
const selectClass = (index: number) => {
	subindex.value = index;
	getContent();
};
const getClassOne = () => {
	helpCenterApi.showTutorialPreLayer().then((res) => {
		classList.value = res.data;

		getContent();
	});
};
const getContent = () => {
	contentLoading.value = true;
	helpCenterApi
		.showTutorialTurnLayer({
			categoryId: classList.value[activeIndex.value].id,
			classId: classList.value[activeIndex.value].subset[subindex.value].id,
			categoryName: classList.value[activeIndex.value].name,
			className: classList.value[activeIndex.value].subset[subindex.value].name,
		})
		.then((res) => {
			subClassList.value = res.data;
		})
		.finally(() => {
			contentLoading.value = false;
		});
};
</script>

<style scoped lang="scss">
.title {
	color: var(--Text_s);
	font-size: 20px;
}
.wrapper {
	display: flex;
	gap: 18px;
	height: calc(100vh - 140px);
	overflow: hidden;
}
.tabs {
	padding: 12px;
	width: 240px;
	min-height: calc(100vh - 200px);
	background: var(--Bg1);
	border-radius: 12px;
	overflow: hidden;
	overflow-y: auto;
}
.tabs2 {
	display: flex;
	font-size: 24px;
	color: var(--Text1);
	gap: 24px;
	.active {
		font-size: 24px;
		color: var(--Text_s);
		border-bottom: 2px solid var(--Theme);
	}
}
.line {
	height: 1px;
	background: var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;
}
.content {
	padding: 20px;
	width: 100%;
	border-radius: 12px;
	min-height: calc(100vh - 210px);
	background: var(--Bg1);
	.valueBox {
		overflow-y: auto;
		height: calc(100vh - 210px);
	}
}
</style>
