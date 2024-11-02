<template>
	<div class="max-width feedback_wrapper pr_10 pl_10 mt_14">
		<div class="left">
			<div class="title mb_14 fs_24 Text_s pl_20 fw_500">意见反馈</div>
			<div class="fade-in center">
				<div class="cell Text_s"><span class="color_Theme">*</span>问题类型</div>
				<div class="cell mt_14 mb_20">
					<Dropdown :options="typeList" v-model="state.type"></Dropdown>
				</div>
				<div class="cell mb_20" v-if="state.type == '1'">
					<div class="Text_s mb_16">相关订单</div>
					<input type="text " class="common_input" placeholder="请输入相关订单号" />
				</div>
				<div class="cell Text_s mb_16"><span class="color_Theme">*</span>问题描述 <span class="fs_12 Text2">内容介于10~500字</span></div>
				<div class="textareaBox">
					<textarea
						v-model="state.content"
						class="textarea fs_14"
						placeholder="请详细描述您的问题或建议，我们会以最快速度给您及时的反馈，我们非常重视您的反馈！"
						maxlength="500"
					></textarea>
					<div class="textLength">100/500</div>
				</div>
				<div class="cell Text_s mb_16 mt_20"><span class="color_Theme">*</span>问题截图 <span class="fs_12 Text2">最大不超过5 M，最多3张， 支持格式：jpg.png.jpeg</span></div>
				<div>
					<ImgUpload :files="files" :max="3" @update:files="updateFiles" />
				</div>
				<div class="Text2_1 mt_10 mb_40">最大不超过5 M，最多3张， 支持格式：jpg.png.jpeg</div>
				<Button class="common_btn" @click="onSubmit" :disabled="disabledBtn">提交</Button>
			</div>
		</div>
		<div class="right p_12 Text_s">
			<div class="flex_space-between mb_12">
				<span>我的反馈</span>
				<span @click="router.push('/user/feedback/feedbackList')" class="flex_space-between fs_14 Text1 curp"
					>查看更多 <svg-icon name="arrow_right" size="14px" class="mr_10 Text2"></svg-icon
				></span>
			</div>
			<div class="rightScroll" v-ok-loading="listLoading">
				<div v-if="FeedbackList.length < 1" class="noMoreData">暂时没有新的反馈</div>
				<div class="card curp" v-for="item in FeedbackList.slice(0, 7)" @click="goToDetails(item)" v-else>
					<div class="ellipsis fs_16">{{ item.typeText }}</div>
					<div class="line"></div>
					<div class="fs_12 Text1 ellipsis">{{ item.content }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { feedbackApi } from "/@/api/feedback";
import showToast from "/@/hooks/useToast";
import router from "/@/router";
const listLoading = ref(false);
const disabledBtn = computed(() => !state.type || !state.content);
const state = reactive({
	feedbackType: "", // 反馈类型
	content: "", // 反馈内容
	type: "", //问题类型
});
const FeedbackList: any = ref([]);
const typeList: any = ref([
	{ text: "财务问题", value: "1" },
	{ text: "账号问题", value: "2" },
	{ text: "游戏问题", value: "3" },
	{ text: "活动问题", value: "4" },
	{ text: "其他问题", value: "5" },
]);
const files: any = ref([]);

const updateFiles = (newFiles: []) => {
	files.value = newFiles;
};
// 通过 axios 上传文件到 API
const onSubmit = () => {
	if (state.content.length < 10) return showToast("内容长度不能小于10个字");
	const prams = {
		type: state.type,
		content: state.content,
		orderId: "",
		picUrls: files.value.map((item: any) => item.fileKey).join(","),
	};
	feedbackApi.submitFeedback(prams).then((res: any) => {
		if (res.code === 10000) {
			showToast("感谢您的反馈！");
			Object.assign(state, {});
			state.content = "";
			state.type = "";
			files.value = [];
			getfeedbackList();
		}
	});
};
onMounted(() => {
	getfeedbackList();
});
const goToDetails = (item: any) => {
	router.push({
		path: "/user/feedback/feedbackDetails",
		query: {
			id: item.id,
		},
	});
};
const getfeedbackList = () => {
	listLoading.value = true;
	feedbackApi
		.FeedbackList()
		.then((res) => {
			FeedbackList.value = res.data.records;
		})
		.finally(() => {
			listLoading.value = false;
		});
};
</script>

<style scoped lang="scss">
.feedback_wrapper {
	display: flex;
	gap: 18px;
	height: calc(100vh - 100px);
	overflow: hidden;
	.left {
		flex: 1;
		.title {
			height: 74px;
			line-height: 74px;
			background: var(--Bg1);
			position: relative;
			border-radius: 12px;
		}
		.title::before {
			content: "";
			position: absolute;
			left: 0;
			top: 50%;
			width: 4px;
			height: 26px;
			transform: translateY(-50%);
			background: url("./image/image.png") no-repeat;
			background-size: 100% 100%;
		}
		.center {
			border-radius: 12px;
			background: var(--Bg1);
			padding: 20px;
			height: 100%;
			min-height: calc(100vh - 190px);
			overflow-y: auto;
		}
		.common_input {
			width: 360px;
			height: 34px;
			line-height: 34px;
			background: var(--Bg2);
			border-radius: 4px;
		}
	}
	.right {
		border-radius: 12px;
		width: 240px;
		background: var(--Bg1);
		.card {
			background: var(--Bg3);
			border-radius: 14px;
			margin: 12px 0;
			padding: 10px 14px;
			word-break: break-all;
			.line {
				height: 1px;

				margin: 8px 0 10px;
				background: var(--Line_1);
				box-shadow: 0px 1px 0px 0px #343d48;
			}
		}
		.rightScroll {
			overflow-x: auto;
			height: 100%;
			.noMoreData {
				min-height: 300px;
				color: var(--Text2);
				font-size: 12px;
				line-height: 300px;
				text-align: center;
			}
		}
	}
}
.textarea {
	width: 100%;
	min-height: 242px;
	height: auto;
	background: var(--Bg1);
	border-radius: 8px;
	border: none;
	outline: none;
	resize: none;
	padding: 14px;
	color: var(--Text_s);
	border: 1px solid var(--Bg3);
}
.textareaBox {
	position: relative;
}
.textLength {
	position: absolute;
	right: 10px;
	bottom: 10px;
	font-size: 12px;
	color: var(--Text2);
}
.common_btn {
	width: 384px;
	height: 48px;
	line-height: 48px;
	text-align: center;
}
</style>
