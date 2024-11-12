<template>
	<div class="skeleton-loader mb_10">
		<div class="skeleton-image"></div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.skeleton-loader {
	max-width: 1308px;
	margin: 0 auto;
	height: 345.19px; /* Adjust based on your image size */
	background: var(--Bg-3);
	border-radius: 12px;
	overflow: hidden;
	position: relative;
}

.skeleton-image::before {
	content: "";
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
	animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(100%);
	}
}
</style>
