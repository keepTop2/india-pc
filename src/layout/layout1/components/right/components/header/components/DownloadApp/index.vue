<template>
	<div class="Task pl_20 pr_20 pb_30">
		<div class="card bg_Bg3 p_16 br_8 mb_30">
			<img :src="activity" alt="" width="408" height="300" />
		</div>
		<div class="erweima flex-center">
			<img :src="erweima" alt="" width="138" height="170" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import activity from './activity.png';
import erweima from './erweima.png';
import pubsub from '/@/pubSub/pubSub';
import Tabs from '/@/components/Tabs/Tabs.vue';
import Dialog from '/@/components/Dialog/Dialog.vue';
import Table from './Table/Table.vue';
const activeKey = ref(1);
const detailVisible = ref(false);
const taskShow = ref(false);
</script>

<style lang="scss" scoped>
.card {
}
</style>
