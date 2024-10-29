<template>
	<div class="announcement">
		<div class="content">
			<img src="./image/megaphone.png" alt="megaphone" />
			<div class="text">
				<div class="marquee">
					<div v-if="currentMessage" class="marquee-item" :key="currentMessage.noticeTitleI18nCode" :style="{ animationDuration: animationDuration + 's' }">
						{{ currentMessage.noticeTitleI18nCode }}: {{ currentMessage.messageContentI18nCode }}
					</div>
				</div>
			</div>
		</div>
		<div class="shadow"></div>
	</div>
</template>

<script setup lang="ts">
import { HomeApi } from "/@/api/home";
import { ref, onMounted, nextTick } from "vue";

interface MessageList {
	noticeTitleI18nCode: string; // 标题
	messageContentI18nCode: string; // 内容
}

const messageList = ref<MessageList[]>([]);
const currentIndex = ref(0); // 当前显示的公告索引
const currentMessage = ref<MessageList | null>(null); // 当前显示的公告
const animationDuration = 8; // 每条公告滚动的时间 (秒)

// 获取公告列表
const getAnnouncementList = async () => {
	const res = await HomeApi.horseRaceLampList();
	// messageList.value = [
	// 	{
	// 		noticeTitleI18nCode: "公告1",
	// 		messageContentI18nCode: "欢迎来到HappyGames，请遵守游戏规则，玩得愉快！",
	// 	},
	// 	{
	// 		noticeTitleI18nCode: "公告2",
	// 		messageContentI18nCode: "HappyGames 2.0 正式上线啦！",
	// 	},
	// ];
	messageList.value = res.data.userNoticeList || [];
	if (messageList.value.length > 0) {
		currentMessage.value = messageList.value[0]; // 初始化第一条公告
		await startMarquee(); // 启动滚动效果
	}
};

// 控制消息逐条显示
const startMarquee = async () => {
	await nextTick();

	setTimeout(() => {
		currentIndex.value = (currentIndex.value + 1) % messageList.value.length;
		currentMessage.value = messageList.value[currentIndex.value]; // 更新当前消息

		startMarquee(); // 递归调用，显示下一条
	}, animationDuration * 1000);
};

onMounted(() => {
	getAnnouncementList();
});
</script>

<style scoped lang="scss">
.announcement {
	max-width: 1350px;
	margin: 20px auto 0;

	.content {
		width: 100%;
		height: 40px;
		background: url("./image/announcement_bg2.png") no-repeat;
		background-size: 100% 100%;
		color: var(--light-ok-text-s, #ffffff);
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 24px 0 20px;

		img {
			width: 40px;
			height: 46px;
			transform: translateY(-5px);
			user-select: none;
		}

		.text {
			flex: 1;
			overflow: hidden;
			position: relative;

			.marquee {
				width: 100%;
				position: relative;

				.marquee-item {
					display: inline-block;
					white-space: nowrap;
					animation: scroll linear infinite;
				}
			}
		}
	}

	.shadow {
		width: 100%;
		height: 40px;
		background: url("./image/announcement_bg1.png") no-repeat;
		background-size: 100% 100%;
	}
}

// 从右到左的滚动动画
@keyframes scroll {
	0% {
		transform: translateX(300%);
	}
	100% {
		transform: translateX(-100%);
	}
}
</style>
