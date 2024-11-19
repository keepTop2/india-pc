<template>
	<div class="max-width pl_10 pr_10">
		<div class="title mt_15 mb_15">
			<span class="fs_20 Texts"> {{ $t(`user['用户协议']`) }} </span>
		</div>
		<div class="content" v-ok-loading="loading">
			<div v-html="Agreement?.valueDetail"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { helpCenterApi } from "/@/api/helpCenter";
const Agreement: any = ref({});
const loading = ref(false);
onMounted(() => {
	loading.value = true;
	helpCenterApi
		.getHelpCenterConfigList()
		.then((res) => {
			Agreement.value = res.data.find((item: any) => item.code == 9);
		})
		.finally(() => {
			loading.value = false;
		});
});
</script>

<style scoped>
.title {
	color: var(--Text-s);
	font-size: 20px;
}
.content {
	border-radius: 8px;
	background: var(--Bg-1);
	min-height: 200px;
	padding: 39px;
	color: var(--Text-1);
	font-size: 14px;
}
</style>
