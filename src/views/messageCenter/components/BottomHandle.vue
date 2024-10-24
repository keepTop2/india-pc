<template>
	<div class="bottom-handle">
		<el-button color="#FF284B" class="read" plain>一键已读</el-button>
		<el-button color="#FF284B">全部删除</el-button>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.bottom-handle {
	height: 70px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 16px 30px 0 30px;
	border-radius: 24px 24px 0px 0px;
	gap: 16px;
	box-shadow: 0px 0px 15px 0px #0e101366;
	background-color: #24262b;

	.el-button {
		margin: 0;
	}

	.read {
		--el-button-bg-color: transparent !important;
		border: 1px solid var(--light-ok-Bg-5-, #ff284b);
	}
}
</style>
