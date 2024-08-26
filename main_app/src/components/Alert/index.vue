<template>
	<div class="alert" :class="type">
		<p>{{ description }}</p>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		type?: 'success' | 'error';
		description?: string;
	}>(),
	{
		type: 'error',
		description: '',
	}
);

console.log('description', props.description);
</script>

<style scoped lang="scss">
.alert {
	padding: 4px 10px;
	border-radius: 4px;
	border: 1px solid;
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 500;
	line-height: 20px;
	text-align: center;
}

.success {
	color: #3bc116;
	border-color: #3bc116;
	background: #f5fff2;
}
.error {
	color: #f00;
	border-color: #f66;
	background: #ffdbdb;
}
</style>
