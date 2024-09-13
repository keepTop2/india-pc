<template>
	<div class="sport-team" :class="{ isLeft: isLeft }" v-show="teamName">
		<img v-if="isLeft" :src="teamIcon" alt="" />
		<span>{{ teamName }}</span>
		<img v-if="!isLeft" :src="teamIcon" alt="" />
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		teamName?: string;
		teamIcon?: string;
		isLeft?: boolean;
	}>(),
	{
		teamName: "",
		teamIcon: "",
		isLeft: true,
	}
);
</script>

<style lang="scss" scoped>
.sport-team {
	justify-content: flex-end;

	img {
		width: 20px;
		height: 20px;
		border-radius: 50%;
	}

	span {
		display: inline-block;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 100px;
		overflow: hidden;
	}

	&.isLeft {
		justify-content: flex-start;
	}
}
</style>
