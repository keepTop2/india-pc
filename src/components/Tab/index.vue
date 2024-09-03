<template>
	<div v-if="isActive" class="tab-content">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";

const props = defineProps<{
	name: string;
	activeTab: string;
}>();

const isActive = computed(() => props.name === props.activeTab);
</script>

<style scoped>
.tab-content {
	padding: 10px;
}
</style>
