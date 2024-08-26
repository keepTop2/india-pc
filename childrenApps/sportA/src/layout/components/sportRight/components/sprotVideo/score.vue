<template>
	<div class="score">
		<div class="score-line"></div>
		<div class="score-item">
			<span>{{ computedScore.home }}</span>
			<span>:</span>
			<span>{{ computedScore.away }}</span>
		</div>
		<div class="score-line"></div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSportEventDetailTool } from "./useSportEventDetailTool";

const { getSportEventScore } = useSportEventDetailTool();

const props = withDefaults(
	defineProps<{
		/** 体育Event对象 */
		eventDetail: any;
	}>(),
	{
		eventDetail: () => {
			return {};
		},
	}
);

const computedScore = computed(() => {
	return getSportEventScore(props.eventDetail);
});
</script>
<style lang="scss" scoped>
.score {
	display: inline-block;
	height: 16px;
	border-radius: 2px;
	position: relative;

	&-item {
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		padding: 0 4px;
		color: var(--Bg3-3, #2e3035);
		font-weight: 700;

		span:nth-child(2) {
			padding: 0 1px;
			position: relative;
			top: -1px;
		}
	}

	&-line {
		position: absolute;
		display: block;
		height: 3px;
		width: 2px;
		top: 50%;
		left: 0;
		transform: translateY(-50%);

		@include themeify {
			background: themed("Bg3");
		}

		&:last-child {
			right: 0 !important;
			left: auto;
		}
	}
}
</style>
