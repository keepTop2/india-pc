<template>
	<div class="layout1" ref="domeRef">
		<left :is-collapse="state.isCollapse" />
		<right />
		<login />
		<Lottery />
		<Task />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import left from './components/left/left.vue';
import right from './components/right/right.vue';
import login from './login/index.vue';
import Lottery from './lottery/lottery.vue';
import Task from './Task/index.vue';
import { useMenuStore } from '/@/stores/modules/menu';
const MenuStore = useMenuStore();
const state = reactive({
	//是否折叠
	isCollapse: false,
});
const domeRef = ref(null);
//监听div大小改变；
const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		const domWidth = (entry.target as any)?.offsetWidth;
		if (domWidth < 1460) {
			MenuStore.setCollapse(true);
		} else {
			MenuStore.setCollapse(false);
		}
	}
});

onMounted(() => {
	resizeObserver.observe(domeRef.value as any);
});

onUnmounted(() => {
	resizeObserver.unobserve(domeRef.value as any);
});

// const changeCollpase = (val: boolean) => {
// 	state.isCollapse = val;
// };
</script>

<style lang="scss" scoped>
.layout1 {
	display: flex;
}
</style>
