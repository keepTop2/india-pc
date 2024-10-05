<template>
	<el-skeleton :loading="internalLoading" :animated="animated" :count="count" :rows="rows" :throttle="throttle">
		<template #template>
			<slot name="skeleton">
				<el-skeleton-item v-for="(item, index) in skeletonItems" :key="index" :variant="item.variant" :style="item.style" />
			</slot>
		</template>
		<template #default>
			<slot />
		</template>
	</el-skeleton>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from "vue";
import pubsub from "/@/pubSub/pubSub";

interface SkeletonItem {
	variant: "text" | "button" | "circle" | "image" | "rect";
	style?: Record<string, string>;
}

interface SkeletonProps {
	loading?: boolean;
	animated?: boolean;
	count?: number;
	rows?: number;
	throttle?: number;
	skeletonItems?: SkeletonItem[];
}

const props = withDefaults(defineProps<SkeletonProps>(), {
	loading: undefined,
	animated: true,
	count: 1,
	rows: 3,
	throttle: 0,
	skeletonItems: () => [
		{ variant: "text", style: { width: "100%" } },
		{ variant: "text", style: { width: "90%" } },
		{ variant: "text", style: { width: "80%" } },
	],
});

const pubsubLoading = ref(true);

onBeforeMount(() => {
	pubsub.subscribe("SkeletonLoading", (data) => {
		pubsubLoading.value = data;
	});
});

const internalLoading = computed(() => {
	return props.loading !== undefined ? props.loading : pubsubLoading.value;
});
</script>
