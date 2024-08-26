<template>
	<!-- 全场独赢/全场波胆可用 -->
	<div class="field-gallbladder">
		<!-- 副标题 -->
		<div class="title-sub" @click="handleShowItem">
			{{ title }}
		</div>
		<div :class="[itemExpand ? 'showToggle' : 'hideToggle']">
			<div class="grid-box" :style="{ 'grid-template-columns': `repeat(${part}, 1fr)` }" v-if="marketInfo.selections.length">
				<div class="item" v-for="(item, index) in marketInfo.selections" :key="index">
					<oddItem :oddInfo="item" :marketInfo="marketInfo" :eventInfo="eventInfo" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import oddItem from "../oddItem/oddItem.vue";
import { Market, SportsRootObject } from "/@/models/interface";

const emit = defineEmits(["updateCollapse"]);

const props = withDefaults(
	defineProps<{
		title: string;
		marketInfo: Market;
		eventInfo: SportsRootObject;
		part?: number;
		expandAndCollapse?: boolean;
	}>(),
	{
		part: 3,
		expandAndCollapse: false,
	}
);

const itemExpand = ref(false);

watch(
	() => props.expandAndCollapse,
	(newVal) => {
		itemExpand.value = newVal;
	},
	{
		immediate: true,
	}
);

onMounted(() => {
	itemExpand.value = props.expandAndCollapse;
});

const handleShowItem = () => {
	itemExpand.value = !itemExpand.value;

	emit("updateCollapse", {
		itemExpand: itemExpand.value,
		betType: props.marketInfo.betType,
	});
};
</script>

<style scoped lang="scss">
.field-gallbladder {
	@include themeify {
		background: themed("Bg4");
	}

	.grid-box {
		padding: 2px;
		display: grid;
		gap: 2px;
	}

	.hideToggle {
		transition: height 0.5s ease;
		height: 0;
		overflow: hidden;
	}

	.showToggle {
		transition: height 0.5s ease;
		height: auto;
	}
}

.title-sub {
	font-size: 16px;
	display: flex;
	align-items: center;
	gap: 8px;
	padding-top: 9px;
	margin-bottom: 7px;

	@include themeify {
		color: themed("Text_s");
	}

	&::before {
		content: "";
		display: inline-block;
		border-radius: 0px 4px 4px 0px;
		width: 4px;
		height: 22px;

		@include themeify {
			background-color: themed("Theme");
		}
	}
}
</style>
