<template>
	<div class="from-input">
		<slot name="left" class="left"></slot>
		<input
			class="common_input"
			@input="emit('update:modelValue', $event.target.value)"
			:value="props.modelValue"
			:type="props.type"
			:readonly="props.readonly"
			:placeholder="props.placeholder"
			:maxlength="props.maxlength"
		/>
		<div class="flex-center pr_10 curp" style="gap: 5px">
			<svg-icon name="common-close" size="20px" v-if="props.modelValue" @click="emit('update:modelValue', '')" />
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
	}>(),
	{
		modelValue: "",
		type: "text",
		placeholder: "",
		readonly: false,
		maxlength: "",
	}
);

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.from-input {
	position: relative;
	display: flex;
	align-items: center;

	margin-top: 8px;
	border-radius: 4px;
	background: var(--Bg-1);
	box-sizing: border-box;
	padding-left: 13px;
	input {
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
		padding-left: 10px;
		color: var(--Text-s);
	}

	::-webkit-input-placeholder {
		color: var(--Text-2);
	}
}
</style>
