<template>
	<div class="tabs_content">
		<div v-for="(key, index) in ['on', 'off']" :key="index" :disable="true" :class="['tab', { tab_active: switchObj[key].active, disabled: disabled }]" @click="handleSwitch(key)">
			{{ switchObj[key].label }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface SwitchItem {
	label: string;
	type: string;
	active: boolean;
}

interface SwitchObject {
	[key: string]: { active: boolean; label: string };
	on: SwitchItem;
	off: SwitchItem;
}

const props = defineProps<{
	switchObj: SwitchObject;
	disabled?: boolean;
}>();

const emit = defineEmits(["selected"]);

const handleSwitch = (key: string) => {
	if (props.disabled) return;
	emit("selected", key);
};
</script>

<style scoped lang="scss">
.tabs_content {
	width: 141px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 3px;
	padding: 3px;
	background: var(--Bg2);

	.tab {
		min-width: 66px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 3px;
		background: var(--butter);
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
		cursor: pointer;

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.tab_active {
		background: var(--Theme);
		color: var(--Text_a);
	}
	.disabled {
		cursor: not-allowed;
	}
}
</style>
