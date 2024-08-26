<template>
	<div class="demo1_a">
		<div class="text_demo1" @click="to">这是demo1的路由AAA</div>
		<div><button @click="senMain">发送数据给主应用</button></div>
		<button @click="showDialog">子应用弹窗试试</button>
		<button @click="onSendHttp">发http请求</button>
		<van-dialog v-model:show="state.show" title="标题" show-cancel-button>
			<div>132132132</div>
		</van-dialog>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import loginApi from "/@/api/demo1AAA";
import { onBeforeUnmount, onMounted, reactive } from "vue";
const router = useRouter();
const state = reactive({
	show: false,
});
const to = () => {
	router.push({
		path: "/demo1BBB",
	});
};

onMounted(() => {
	window.microApp.addDataListener(subData);
	console.log("看看有没有");
});
onBeforeUnmount(() => {
	console.log("销毁");
});

function subData(e) {
	alert(e);
	console.error(e);
}

const senMain = () => {
	window.microApp.forceDispatch({ name: "demo1AAA" }, () => {
		console.log("数据已经发送完成");
	});
};

const showDialog = () => {
	state.show = true;
};

const onSendHttp = async () => {
	const res = await loginApi.userLogin();
};
</script>

<style lang="scss" scoped>
.demo1_a {
	width: 100%;
	// height: 100px;
	box-sizing: border-box;
	border: 2px solid red;
}
.text_demo1 {
	color: red;
	font-size: 58px;
}
</style>
