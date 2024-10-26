<template>
	<div class="max-width pl_10 pr_10">
		<div class="title mt_15 mb_15">
			<span class="fs_20 Texts"> 用户协议 </span>
		</div>
		<div class="content" v-ok-loading="loading">
			<div v-html="Agreement?.agreement"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loginApi } from "/@/api/login";
const Agreement: any = ref({});
const loading = ref(false);
onMounted(() => {
	loading.value = true;
	loginApi
		.getAgreement()
		.then((res) => {
			Agreement.value = res.data;
		})
		.finally(() => {
			loading.value = false;
		});
});
</script>

<style scoped>
.title {
	color: var(--Text_s);
	font-size: 20px;
}
.content {
	border-radius: 8px;
	background: var(--Bg1);
	min-height: 200px;
	padding: 39px;
	color: var(--Text1);
	font-size: 14px;
}
</style>
