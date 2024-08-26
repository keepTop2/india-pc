<template>
	<div class="demo1_a" @click="to">这是demo1的路由BBBBBBBBBBBBBBBBBBBBBBB</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const to = () => {
	router.push({
		path: "/demo1AAA",
	});
};
</script>

<style lang="scss" scoped>
.demo1_a {
	width: 100%;
	height: 100px;
	box-sizing: border-box;
	border: 2px solid red;
}
</style>
