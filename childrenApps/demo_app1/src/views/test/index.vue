<template>
	<div class="test">
		<div>
			<button @click="current = 0">测试1</button>
			<button @click="current = 1" style="margin-left: 10px">测试2</button>
		</div>
		<div v-if="current === 0">
			<SvgIcon iconName="sport" class="test1" :size="50" :height="30" />
			<SvgIcon iconName="tv" class="test1" :size="50" />
			<SvgIcon iconName="arrow" class="test1" :size="50" />
		</div>
		<div v-if="current === 1">
			<SvgIcon iconName="sport" class="test1" current-color :size="50" />
			<SvgIcon iconName="tv" class="test1" current-color :size="50" />
			<SvgIcon iconName="tv111" class="test1" current-color :size="50" />
			<SvgIcon iconName="arrow" class="test1" current-color :size="50" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SvgIcon from "/@/components/svgIcon.vue";

const current = ref(0);
</script>

<style lang="scss" scoped>
.test1 {
	color: #fff;

	&:hover {
		color: #333;
	}
}
</style>
