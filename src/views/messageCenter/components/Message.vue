<template>
	<div class="message" @click="readMessage">
		<div class="time">{{ item.createdTime }}</div>
		<div class="title" :class="!isUnfold && 'hidden-title'" v-html="item.noticeTitleI18nCode"></div>
		<div class="content" :class="!isUnfold && 'hidden-content'" v-html="item.messageContentI18nCode"></div>
		<div class="handle">
			<svg-icon name="delete2" size="18px" @click.stop="handleDelete"></svg-icon>
			<div class="unfold" @click="isUnfold = !isUnfold">
				{{ isUnfold ? "收起" : "展开" }}
				<svg-icon name="common-common-common-arrow_down_on" size="14px" class="icon" :class="isUnfold && 'fold'" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MessageApi } from "/@/api/message";
import { ElMessage, ElMessageBox } from "element-plus";

interface Props {
	item: {
		[key: string]: any;
	};
	index: number;
}

const props = defineProps<Props>();
const emits = defineEmits(["deleteSuccess"]);

const isUnfold = ref(false);

// 读消息
const readMessage = async () => {
	if (props.item.readState === 1) return;
	const res = await MessageApi.setReadOrDel({
		targetId: props.item.targetId,
		status: 1,
	});
	if (res.code !== 10000) return ElMessage.warning(res.message);
};

// 删除
const handleDelete = async () => {
	console.log(props.item);
	ElMessageBox.confirm("确认删除吗?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		const res = await MessageApi.setReadOrDel({
			targetId: props.item.targetId,
			status: 2,
		});
		if (res.code !== 10000) return ElMessage.warning(res.message);
		emits("deleteSuccess", props.index);
		ElMessage.success("删除成功");
	});
};
</script>

<style scoped lang="scss">
.message {
	font-size: 14px;
	color: var(--Text-2-1);
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 8px;
	background-color: var(--Bg-3);
	border-radius: 8px;

	.content {
	}

	.hidden-content {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.hidden-title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.handle {
		width: 100%;
		display: flex;
		align-self: center;
		justify-content: space-between;

		.unfold {
			display: flex;
			align-items: center;
			gap: 5px;
			color: var(--Theme);
			text-transform: uppercase;
			text-decoration: underline;
			text-underline-offset: 3px;
			font-size: 14px;
			user-select: none;

			.icon {
				transition: 0.2s;
				fill: var(--Bg-5);
			}

			.fold {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
