<template>
	<div>
		<el-dialog v-model="visible" :show-close="false" width="480">
			<template #header>
				公告
				<svg-icon name="close" size="30px" class="close" @click="visible = false"/>
			</template>
			<div class="announcement">
				<div class="title">
					<div v-html="item.noticeTitleI18nCode"></div>
				</div>
				<div class="line"></div>
				<div class="content">
					<div v-html="item.messageContentI18nCode"></div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Notice {
	noticeTitleI18nCode: string; // 标题
	messageContentI18nCode: string; // 内容
}

interface Props {
	item: Notice;
}

const props = defineProps<Props>();
const visible = ref(true);
</script>

<style scoped lang="scss">
:deep(.el-dialog) {
	background: var(--light-ok-Bg-, #1d1f23);
	padding: 16px;
	position: relative;
	border-radius: 12px;

	.el-dialog__header {
		font-family: PingFang SC;
		font-size: 20px;
		color: var(--light-ok-text-s, #ffffff);
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		padding-bottom: 28px;

		.close {
			position: absolute;
			right: 24px;
			cursor: pointer;
		}
	}

	.announcement {
		background: var(--light-ok-Bg-1-1, #24262b);
		border-radius: 8px;

		.title {
			padding: 12px 0;
			text-align: center;
			font-family: PingFang SC;
			font-size: 16px;
			line-height: 22.4px;
			color: var(--light-ok-text-s, #ffffff);
		}

		.line {
			background: var(--light-ok-Line-1-, #111214);
			box-shadow: 0px 1px 0px 0px var(--lightok-Line-2-);
			height: 1px;
		}

		.content {
			padding: 12px;
			color: var(--light-ok-Text-1-1, #98a7b5);
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 400;
			line-height: 19.6px;
			text-align: left;
		}
	}
}
</style>
