<template>
	<div></div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { ChildrenToMainCommon } from "/@/ChildrenAppportAManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import childrenAppportAManage from "/@/ChildrenAppportAManage/ChildrenAppportAManage";

// setInterval(() => {
// 	console.log("SportA------------------");
// }, 1000);
onMounted(() => {
	console.log("preFetchSportAView 渲染完成------------------");
	const childrenToMainCommonData: ChildrenToMainCommon = {
		transactionName: "SportAPreFetchSportAViewController",
		apiName: "sportAPreFetchSportAViewMount",
		data: {},
	};
	childrenAppportAManage.forceDispatch(childrenToMainCommonData);
});
</script>

<style scoped lang="scss"></style>
