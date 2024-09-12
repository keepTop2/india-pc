<template>
	<div>
		<div class="textMain max-width" v-for="item in 50">textMain{{ item }}</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.textMain {
	background-color: var(--Bg);
}
</style>
