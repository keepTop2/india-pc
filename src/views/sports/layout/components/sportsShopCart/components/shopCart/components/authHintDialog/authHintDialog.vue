<template>
	<Dialog append-to-body v-model="hintVisible" width="380" class="hint-dialog">
		<template #header>
			<div class="dialog-header">温馨提示</div>
		</template>

		<div class="dialog-body">取消后您将“自动接受任何赔率”即无论下注时的赔率如何变化，系统都将默认您可以接受，页面会出现赔率变化提示，但不会中断您的下注行为。</div>

		<div class="know">
			<el-button @click="hintVisible = false">我知道了</el-button>
		</div>
	</Dialog>
</template>
<script setup lang="ts">
import { ElButton } from "element-plus";
import Dialog from "/@/components/Dialog/Dialog.vue";

const hintVisible: any = defineModel();
</script>

<style scoped lang="scss">
.hint-dialog {
	:deep() {
		.el-dialog__body {
			padding: 20px;
		}
	}
}

.dialog-header {
	font-size: 20px;
	padding: 20px;
	text-align: center;
	@include themeify {
		color: themed("Text_s");
	}
}

.dialog-body {
	font-size: 16px;
	line-height: 26px;
	padding: 16px 40px;
	@include themeify {
		color: themed("Text1");
	}
}
.know {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px 0;

	:deep(.el-button) {
		margin: 5px 0;
		border-radius: 4px;
		width: 130px;
		height: 48px;
		@include themeify {
			border: 1px solid themed("Theme");
			background: themed("Theme");
			color: themed("Text_a");
		}
	}
}
</style>
