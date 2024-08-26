<template>
	<div class="demoApp">
		<div id="demo_container"></div>
		<div id="demo_container2"></div>
		<div class="main_app">
			<div><button @click="onClick">主应用加载子应用1按钮</button></div>
			<div><button @click="unApp1">主应用卸载子应用1按钮</button></div>
			<div><button @click="onClick2">主应用加载子应用2按钮</button></div>
			<div><button @click="onSendApp1">发送数据给子应用1</button></div>
			<div><button @click="toChildrenA">主应用直接跳子应用路由</button></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import microApp from "@micro-zoe/micro-app";
function getdemo1Url() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return "http://localhost:5002";
		case "production":
			return window["PLATFROM_CONFIG"].demoApp1Url;
		default:
			return "";
	}
}
function getdemo2Url() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return "http://localhost:5003";
		case "production":
			return window["PLATFROM_CONFIG"].demoApp2Url;
		default:
			return "";
	}
}
microApp.addDataListener("demo_app1", demo_app1Fn);
const onClick = () => {
	microApp.renderApp({
		name: "demo_app1",
		url: getdemo1Url(),
		container: "#demo_container",
		iframe: true,
	});
};
const unApp1 = () => {
	microApp.unmountApp("demo_app1");
};
const onClick2 = () => {
	microApp.renderApp({
		name: "demo_app2",
		url: getdemo2Url(),
		container: "#demo_container2",
		iframe: true,
	});
};

const onSendApp1 = () => {
	microApp.forceSetData("demo_app1", { aaaa: "数据过来了吗" });
};

function demo_app1Fn(e) {
	alert(e);
	console.log(e, "收到子数据=========");
}

const toChildrenA = () => {
	microApp.router.push({
		name: "demo_app1",
		path: "#/demo1BBB",
	});
};
</script>

<style lang="scss" scoped>
.demoApp {
}
</style>
