<template>
	<div></div>
</template>

<script setup lang="ts">
type formType = "input" | "select";
interface formList {
	label: string;
	type: formType;
}

const props = defineProps({
	formList: {
		type: Array<formList>,
		require: true,
	},
	formData: {
		type: String,
		require: true,
	},
});
</script>

<style scoped></style>
