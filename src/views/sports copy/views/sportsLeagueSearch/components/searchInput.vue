<template>
	<div class="from-input">
		<slot name="left"></slot>
		<input @input="emit('update:modelValue', $event.target.value)" :value="props.modelValue" :type="props.type" :readonly="props.readonly" :placeholder="props.placeholder" />
		<slot name="right"></slot>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue?: string | number;
		type?: string;
		placeholder?: string;
		readonly?: boolean;
	}>(),
	{
		modelValue: "",
		type: "text",
		placeholder: "",
		readonly: false,
	}
);

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.from-input {
	position: relative;
	display: flex;
	align-items: center;
	height: 46px;
	padding: 13px 10px;
	border-radius: 4px;

	background: var(--Bg2);

	box-sizing: border-box;

	input {
		flex: 1;
		font-family: "PingFang SC";
		padding: 0;

		color: themed("Text1");
		background: themed("Bg1");

		font-size: 14px;
		font-weight: 400;
		border: 0;

		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	::-webkit-input-placeholder {
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		color: var(--Text2);
	}
}
</style>
