<template>
	<div class="loader_mask"><div class="loader"></div></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.loader_mask {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	min-height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: inherit;
	transition: all 0.2s;
}

.loader {
	width: 36px;
	height: 36px;
	border: 4px solid #ff284b;
	border-left-color: transparent;
	border-radius: 50%;
	animation: spin89345 1s linear infinite;
}

@keyframes spin89345 {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
