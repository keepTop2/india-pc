<template>
	<header class="header">tabbar1</header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header {
	position: fixed;
	height: 64px;
	top: 0;
	left: 0;
	width: 100%;

	@include themeify {
		$line-color: themed("Line");
		background: themed("Bg4");
		box-shadow: 0px -1px 0px 0px $line-color inset;
		color: themed("Text1");
	}
}
</style>
