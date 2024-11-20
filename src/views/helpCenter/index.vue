<template>
	<div class="max-width pl_10 pr_10">
		<div class="title mt_15 mb_15">
			<span class="fs_20 Text_s fw_500"> {{ $t(`home['帮助中心']`) }} </span>
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
					<div v-for="(item, index) in subClassList" :class="activeTab == index ? 'active' : ''" class="curp" @click="setActiveTab(index)">
						<img v-lazy-load="item.icon" alt="" />{{ item.name }}
					</div>
				</div>
				<div class="line"></div>
				<div class="mt_16 valueBox" v-if="subClassList[0]?.id">
					<div class="card mb_32" v-for="item in subClassList[activeTab]?.subset">
						<div class="title">{{ item.name }}</div>
						<div class="value Text1">
							{{ item.value }}
						</div>
					</div>
				</div>
				<div class="mt_16 valueBox" v-else>
					<div class="card mb_32">
						<div class="value Text1" v-html="subClassList[0]?.value"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
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
		activeIndex.value = null;
		return;
	} else {
		activeIndex.value = index;
		if (classList.value[activeIndex.value].subset?.length) {
			subindex.value = 0;
		} else {
			subindex.value = null;
		}

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
	if (!classList.value[activeIndex.value].id) {
		subClassList.value = [classList.value[activeIndex.value]];
	}
	if (classList.value[activeIndex.value].subset?.length > 0) {
		contentLoading.value = true;
		helpCenterApi
			.showTutorialTurnLayer({
				categoryId: classList.value[activeIndex.value].id,
				classId: classList.value[activeIndex.value].subset[subindex.value]?.id,
				categoryName: classList.value[activeIndex.value]?.name,
				className: classList.value[activeIndex.value].subset[subindex.value]?.name,
			})
			.then((res) => {
				subClassList.value = res.data;
			})
			.finally(() => {
				contentLoading.value = false;
			});
	} else {
	}
};
</script>

<style scoped lang="scss">
.title {
	color: var(--Text-s);
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
	background: var(--Bg-1);
	border-radius: 12px;
	overflow: hidden;
	overflow-y: auto;
}
.tabs2 {
	display: flex;
	font-size: 24px;
	color: var(--Text-1);
	gap: 24px;
	.active {
		font-size: 24px;
		color: var(--Text-s);
		border-bottom: 2px solid var(--Theme);
	}
	> div {
		display: flex;
		align-items: center;
		img {
			width: 24px;
			height: 24px;
			margin-right: 8px;
		}
	}
}
.line {
	height: 1px;
	background: var(--Line-1);
	box-shadow: 0px 1px 0px 0px var(--lineBg);
}
.content {
	padding: 20px;
	width: calc(100% - 240px);
	border-radius: 12px;
	min-height: calc(100vh - 210px);
	background: var(--Bg-1);
	.valueBox {
		overflow-y: auto;
		height: calc(100vh - 210px);
		:deep(img) {
			max-width: 100%;
		}
	}
}
</style>
