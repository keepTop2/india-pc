<template>
	<div class="from-input">
		<div class="left ml_13" v-if="!hideLeftIcon">
			<slot name="left"></slot>
		</div>
		<input
			class="common_input"
			@input="emit('update:modelValue', $event.target.value)"
			:value="props.modelValue"
			:type="props.type"
			:readonly="props.readonly"
			:placeholder="props.placeholder"
			:maxlength="props.maxlength"
			:style="{ paddingLeft: hideLeftIcon ? '16px' : '8px' }"
		/>
		<div class="flex-center pr_10 curp" style="gap: 5px">
			<svg-icon name="common-close" size="24px" v-if="props.modelValue && !props.noColse" @click="emit('update:modelValue', '')" />
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue?: string | number;
		type?: string;
		placeholder?: string;
		readonly?: boolean;
		maxlength?: string | number;
		hideLeftIcon?: boolean;
		noColse?: boolean;
	}>(),
	{
		modelValue: "",
		type: "text",
		placeholder: "",
		readonly: false,
		maxlength: "",
		hideLeftIcon: false,
		noColse: false,
	}
);

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.from-input {
	position: relative;
	display: flex;
	align-items: center;
	border-radius: 4px;
	background: var(--Bg-1);
	box-sizing: border-box;

	input {
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
		color: var(--Text-s);
	}
}
</style>
