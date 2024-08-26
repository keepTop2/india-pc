<template>
	<div class="demo2_a" @click="to">
		这是demo2的路由cccccccccc
		<div>
			<button @click="toMain">跳转主营用路由</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const to = () => {
	router.push({
		path: "/demo2d",
	});
};

const toMain = () => {
	const baseRouter = window.microApp.router.getBaseAppRouter();
	baseRouter.push({
		path: "/frontPage/home/gambling/house",
	});
};
</script>

<style lang="scss" scoped>
.demo2_a {
	width: 100%;
	height: 100px;
	box-sizing: border-box;
	border: 2px solid red;
}
</style>
