<template>
	<div class="medals" v-show="modelValue">
		<Dialog title="大师勋章" width="480" v-model="visible">
			<!-- <div class="medal-item" v-for="item in modelValue" :key="item">
				<img :src="item" alt="" />
			</div> -->
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from '/@/components/Dialog/Dialog.vue';
const props = withDefaults(
	defineProps<{
		modelValue?: string | number;
	}>(),
	{}
);
const visible = ref(true);
console.log(props.modelValue, '=====value');
</script>

<style lang="scss" scoped>
@import './style.scss';
/* Your styles here */
</style>
