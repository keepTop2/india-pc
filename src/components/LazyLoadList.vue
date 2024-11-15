<template>
	<div class="lazy-load-container" ref="container">
		<slot></slot>
		<div ref="trigger" class="lazy-load-trigger fade-in">
			<div v-if="noData" class="noData">
				<noneData></noneData>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = defineProps({
	loadMore: {
		type: Function,
		required: true,
		validator: (value: any) => typeof value === "function",
	},

	noData: {
		type: Boolean,
		required: true,
	},
});

const container = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const isLoading = ref(false);
const initialLoadTriggered = ref(false); // Flag for initial load

// Initialize IntersectionObserver
const initObserver = () => {
	observer.value = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && !isLoading.value && !props.finished) {
				handleLoadMore(); // Trigger load more when the trigger comes into view
			}
		});
	});
	if (trigger.value) {
		observer.value.observe(trigger.value); // Observe the trigger element
	}
};

// Check if the last child is in view, especially useful after renders
const checkIfLastChildInView = async () => {
	if (props.finished || !container.value) return;

	const lastChild = container.value.lastElementChild;
	if (lastChild) {
		const lastChildRect = lastChild.getBoundingClientRect();
		const containerRect = container.value.getBoundingClientRect();

		// Check if the last child is within the visible area
		if (lastChildRect.top < containerRect.bottom && lastChildRect.bottom > containerRect.top) {
			await handleLoadMore(); // Trigger load more
		}
	}
};

// Load more handler
const handleLoadMore = async () => {
	if (props.finished || isLoading.value) return;

	isLoading.value = true;
	await props.loadMore(); // Call loadMore prop
	isLoading.value = false;
};

// Disconnect observer when the component unmounts
const disconnectObserver = () => {
	if (observer.value) {
		observer.value.disconnect(); // Clean up observer
	}
};

// Mounted lifecycle hook
onMounted(() => {
	initObserver(); // Initialize IntersectionObserver
	nextTick(() => {
		if (!container.value?.children.length && !initialLoadTriggered.value) {
			// Manually trigger load if no DOM children are present
			initialLoadTriggered.value = true;
			handleLoadMore();
		} else {
			checkIfLastChildInView(); // Check if the last child is visible
		}
	});
});

// Before unmount lifecycle hook
onBeforeUnmount(() => {
	disconnectObserver(); // Clean up observer before unmount
});
</script>

<style scoped lang="scss">
.lazy-load-trigger {
	font-size: 20px;
	text-align: center;
	color: var(--Text-1);
}
.noData {
	img {
		width: 142px;
		height: 120px;
	}
}
</style>
