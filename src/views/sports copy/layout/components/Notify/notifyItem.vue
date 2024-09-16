<template>
	<div class="notifyItem pt_20">
		<p class="Text_s mb_8">{{ notifyTitle }}</p>
		<p class="mb_4 fs_14">{{ data.message }}</p>
		<p class="mb_16 fs_14 Text2">{{ Common.formatDate(data.postTime) }}</p>
		<div class="line"></div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Common from "/@/views/sports/utils/common";
interface notifyType {
	messageId: number;
	postTime: string;
	isSticky: Boolean;
	message: string;
}
const props = defineProps<{
	data: notifyType;
}>();

const notifyTitle = computed(() => {
	return props.data.message.slice(props.data.message.indexOf("["), props.data.message.indexOf("]") + 1);
});
</script>

<style scoped lang="scss">
.notifyItem {
	.line {
		width: 100%;
		height: 1px;
		background: var(--Line_2);
	}
}
</style>
