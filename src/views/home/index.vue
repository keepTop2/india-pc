<template>
	<div>
		<div class="textMain max-width" v-for="item in 100">textMain{{ item }}</div>
	</div>
</template>

<script setup lang="ts">
import banner from "./components/banner.vue";
</script>

<style lang="scss" scoped>
.textMain {
	background-color: var(--Bg);
}
</style>
