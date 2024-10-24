<template>
	<div>
		<el-drawer v-model="messageCenterVisible" width="348" :with-header="false" :close-on-click-modal="false">
			<div class="header">
				<div class="title">消息中心</div>
				<div class="close" @click="messageCenterVisible = false">
					<svg-icon name="close" size="20px" />
				</div>
			</div>
			<div class="content">
				<div class="wrapper">
					<div class="tabs">
						<div v-for="item in tabs" @click="activeTab = item.id" :class="activeTab === item.id && 'active'">
							{{ item.name }}
						</div>
					</div>
					<div class="messageList">
						<Message v-for="item in messageList" :item="item" />
					</div>
				</div>
				<BottomHandle />
			</div>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Message from "./components/Message.vue";
import BottomHandle from "/@/views/messageCenter/components/BottomHandle.vue";

const messageCenterVisible = defineModel();
const tabs = [
	{ name: "通知", id: 1 },
	{ name: "活动", id: 2 },
];
const activeTab = ref(1);

// 消息列表
const messageList = reactive([
	{
		dateTime: "2024-9-6 12:12:12",
		content:
			"这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，这里是最大字符长度，",
		coverUrl: "",
	},
]);
</script>

<style lang="scss" scoped>
:deep(.el-drawer) {
	width: 348px !important;

	background: var(--Bg1);

	.el-drawer__body {
		padding: 0;
		display: grid;
		grid-template-rows: auto 1fr;

		.header {
			height: 64px;
			background-color: var(--Bg3);
			display: flex;
			align-items: center;
			justify-content: center;

			.title {
				color: var(--Text_s);
				font-size: 20px;
			}

			.close {
				width: 32px;
				height: 32px;
				border-radius: 6px;
				background-color: var(--Bg);
				position: absolute;
				right: 16px;
				top: 16px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		& > .content {
			display: grid;
			grid-template-rows: 1fr auto;

			.wrapper {
				padding: 9px 14px 0;
				display: grid;
				grid-template-rows: auto 1fr;
				gap: 12px;

				.tabs {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					background-color: var(--Bg);
					border-radius: 12px;

					div {
						text-align: center;
						height: 40px;
						line-height: 40px;
						border-radius: 12px;
						background-color: var(--Bg);
						transition: 0.2s;
						color: var(--Text2_1);
					}

					.active {
						background-color: var(--Bg3);
						color: var(--Text_s);
					}
				}

				.messageList {
					overflow: auto;
				}
			}
		}
	}
}
</style>
