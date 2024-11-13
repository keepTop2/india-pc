<template>
	<div class="skeleton-menu" v-for="item in 8" :key="item" :class="collapse ? 'collapse' : ''">
		<div class="skeleton-icon"></div>
		<div class="skeleton-content">
			<div class="skeleton-name"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	collapse?: Boolean;
}>();
</script>

<style scoped lang="scss">
.skeleton-menu {
	height: 46px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	box-sizing: border-box;
	background: var(--Bg-3);
	border-radius: 4px;
	margin: 4px 0;
	position: relative; /* Added for pseudo-element positioning */
	overflow: hidden; /* Ensure shimmer effect doesn't overflow */

	.skeleton-icon {
		width: 18px;
		height: 18px;
		background: var(--Bg-1);
		margin-right: 16px;
		border-radius: 50%; /* Added for circular icon */
	}

	.skeleton-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.skeleton-name {
			width: 100px;
			height: 18px;
			background: var(--Bg-1);
			border-radius: 4px;
			margin-bottom: 4px;
		}
	}

	/* Shimmer animation effect */
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
		animation: shimmer 1.5s infinite;
	}
}
.collapse.skeleton-menu {
	height: 46px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	box-sizing: border-box;
	border-radius: 4px;
	position: relative; /* Added for pseudo-element positioning */
	overflow: hidden; /* Ensure shimmer effect doesn't overflow */

	.skeleton-icon {
		width: 18px;
		height: 18px;
		background: var(--Bg-1);
		margin-right: 0;
		border-radius: 4px; /* Added for circular icon */
	}

	.skeleton-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		display: none;
		.skeleton-name {
			width: 100px;
			height: 18px;
			background: var(--Bg-1);
			border-radius: 4px;
			margin-bottom: 4px;
		}
	}

	/* Shimmer animation effect */
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
		animation: shimmer 1.5s infinite;
	}
}
/* Shimmer animation */
@keyframes shimmer {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(100%);
	}
}
</style>
