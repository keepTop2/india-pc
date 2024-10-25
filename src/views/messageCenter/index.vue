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
					<div v-if="messageList.length" class="messageList">
						<Message v-for="item in messageList" :item="item" />
					</div>
          <NoData v-else/>
				</div>
				<div class="bottom-handle">
					<el-button color="#FF284B" class="read" plain :disabled="!hasUnread">一键已读</el-button>
					<el-button color="#FF284B" class="delete" :disabled="!hasDelete">全部删除</el-button>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Message from "./components/Message.vue";
import { MessageApi } from "/@/api/message";
import { ElMessage } from "element-plus";
import NoData from "/@/views/messageCenter/components/NoData.vue";

const messageCenterVisible = defineModel();
const tabs = [
	{ name: "通知", id: 1 },
	{ name: "活动", id: 2 },
];
const activeTab = ref(1);

// 消息列表
interface MessageList {
	targetId: string;
	noticeType: 1 | 2;
	noticeTitleI18nCode: string; //通知标题
	messageContentI18nCode: string; //通知消息内容
	targetType: 1 | 2 | 3 | 4 | 5; //1=全部会员、2=特定会员、3=终端 4=全部代理，5特定代理
	readState: 0 | 1; //阅读状态: 0=未读、1=已读
	createdTime: string; //创建时间
}

const messageList = ref<MessageList[]>([]);
const getMessageList = async () => {
	const res = await MessageApi.messageList();
	if (res.code !== 10000) return ElMessage.warning(res.message);
	messageList.value = res.data.userNoticeList;
};
getMessageList();

// 底部操作
// 是否还有未读的信息
const hasUnread = computed(() => {
	return messageList.value.some((item) => item.readState === 0);
});
// 是否还有可删除的信息
const hasDelete = computed(() => {
	return messageList.value.length > 0;
});
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
        font-size: 12px;
			}

			.read {
				--el-button-bg-color: transparent !important;
				--el-button-disabled-bg-color: transparent !important;
				--el-button-disabled-text-color: var(--Theme) !important;
				border: 1px solid var(--light-ok-Bg-5-, #ff284b);
			}

			.delete {
				--el-button-disabled-bg-color: var(--Theme) !important;
				--el-button-disabled-border-color: var(--Theme) !important;
			}

			.is-disabled {
				opacity: 0.5;
			}
		}
	}
}
</style>
