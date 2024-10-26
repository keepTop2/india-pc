<template>
	<div class="max-width feedback_wrapper pr_10 pl_10 mt_14 mb_20">
		<div class="title fs_24 pl_20 fw_500">
			<span class="Text2 curp" @click="router.push('/user/feedBack')">意见反馈</span>
			<span>
				<svg-icon name="arrow_right" size="16px" class="mr_10 ml_10 Text2"></svg-icon>
			</span>
			<span class="fs_18 Text2 fw_500 curp" @click="router.push('/user/feedBack/feedbackList')">我的反馈</span>
			<span>
				<svg-icon name="arrow_right" size="16px" class="mr_10 ml_10 Text2"></svg-icon>
			</span>
			<span class="Text_s fs_18">反馈详情</span>
		</div>
		<div class="scrollBox" ref="feedback_wrapper">
			<div class="center">
				<div class="flex_space-between detailsTitle">
					<div class="flex_space-between Text_s">
						<img v-if="FeedbackDetail" v-lazy-load="imgObj['type' + FeedbackDetail[0]?.type]" alt="" /> <span>{{ FeedbackDetail[0]?.typeText }}</span>
					</div>
					<div class="flex_space-between">
						<span class="Theme_text mr_20 curp" style="border-bottom: 1px solid" @click="handleShowForm">再次反馈</span>
						<svg-icon name="delete_theme" size="24px" class="curp" @click="deleteOrder"></svg-icon>
					</div>
				</div>
				<div class="line"></div>
				<div class="card curp pt_20" v-for="(item, index) in FeedbackDetail" :key="index">
					<div class="icon">
						<img class="icon" v-lazy-load="imgObj['type' + FeedbackDetail[0]?.type]" alt="" />
						<span class="fs_14 Text_s">{{ item.userAccount }}</span>
					</div>
					<div class="text ml_42">
						<div class="fs_14 Text1">{{ item.content }}</div>
					</div>
					<div class="ml_42"></div>

					<div class="ml_42 mt_10 mb_10" v-if="item.picUrls">
						<img v-lazy-load="img" alt="" v-for="(img, index) in item.picUrls?.split(',')" class="picUrls" @click="showImagePreview(item.picUrls?.split(','), index)" />
					</div>
					<div class="ml_42">
						<span class="Text1 fs_14"> {{ dayjs(item.createdTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
					</div>
					<div class="line"></div>
					<div class="card curp pt_20" v-if="item.backAccount" :key="index">
						<div class="icon">
							<img class="icon" src="./image/kefuIcon.png" alt="" />
							<span class="fs_14 Text_s">{{ item.backAccount }}</span>
						</div>
						<div class="text ml_42">
							<div class="fs_14 Text1">{{ item.backContent }}</div>
						</div>
						<div class="ml_42"></div>

						<div class="ml_42 mt_10 mb_10" v-if="item.picUrls">
							<img v-lazy-load="img" alt="" v-for="(img, index) in item.picUrls?.split(',')" class="picUrls" @click="showImagePreview(item.picUrls?.split(','), index)" />
						</div>
						<div class="ml_42">
							<span class="Text1 fs_14"> {{ dayjs(item.backTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
						</div>
						<div class="line"></div>
					</div>
				</div>

				<div class="mt_20" v-if="showForm">
					<div class="cell Text_s mb_16"><span class="Theme_text">*</span>问题描述 <span class="fs_12 Text2">内容介于10~500字</span></div>
					<div>
						<textarea
							v-model="state.content"
							class="textarea fs_14"
							placeholder="请详细描述您的问题或建议，我们会在最快速度给您及时的反馈，我们非常重视您的反馈！"
							maxlength="500"
						></textarea>
					</div>
					<div class="cell Text_s mb_16 mt_20"><span class="Theme_text">*</span>问题截图 <span class="fs_12 Text2">最大不超过5 M，最多3张， 支持格式：jpg.png.jpeg</span></div>
					<div>
						<ImgUpload :files="state.files" :max="3" @update:files="updateFiles" />
					</div>
					<div class="Text2_1 mt_10 mb_40">最大不超过5 M，最多3张， 支持格式：jpg.png.jpeg</div>
					<div class="common_btn" @click="onSubmit">提交</div>
				</div>
			</div>
		</div>
		<ImagePreview v-if="isPreviewOpen" :images="previewList" :isOpen="isPreviewOpen" :initialIndex="previewIndex" @close="isPreviewOpen = false" />
	</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { feedbackApi } from "/@/api/feedback";
import showToast from "/@/hooks/useToast";
import router from "/@/router";
import dayjs from "dayjs";
import type1 from "./image/type1.png";
import type2 from "./image/type2.png";
import type3 from "./image/type3.png";
import type4 from "./image/type4.png";
import type5 from "./image/type5.png";
import { useTipsDialog } from "/@/hooks/useTipsDialog";
import { bottom } from "@popperjs/core";
const feedback_wrapper: any = ref(null);
const previewList = ref([]);
const previewIndex = ref(0);
const imgObj: any = {
	type1,
	type2,
	type3,
	type4,
	type5,
};
const state: any = reactive({
	feedbackType: "", // 反馈类型
	content: "", // 反馈内容
	type: "", //问题类型
	files: [],
});
const showForm = ref(false);
const FeedbackDetail: any = ref([]);
const isPreviewOpen = ref(false);
const updateFiles = (newFiles: []) => {
	state.files = newFiles;
};
const handleShowForm = () => {
	showForm.value = true;
	console.log(feedback_wrapper.value.scrollHeight);

	nextTick(() => {
		feedback_wrapper.value.scrollTo({
			top: feedback_wrapper.value.scrollHeight,
			behavior: "smooth", // 平滑滚动效果
		});
	});
};
const handleScroll = () => {
	console.log(123123);
};
const showImagePreview = (list: [], index: number) => {
	previewList.value = list;
	previewIndex.value = index;
	isPreviewOpen.value = true;
};
const deleteOrder = () => {
	useTipsDialog({
		title: "确认操作",
		text: "删除后无法恢复，确认要删除吗？",
		onConfirm: () => {
			feedbackApi.delFeedback({ id: router.currentRoute.value.query.id }).then((res) => {
				router.back();
			});
		},
		onClose: () => {
			console.log("对话框已关闭");
		},
	});
	return;
};
onMounted(() => {
	getFeedbackDetail();
	feedback_wrapper.value;
});
const getFeedbackDetail = () => {
	feedbackApi
		.FeedbackDetail({
			id: router.currentRoute.value.query.id,
		})
		.then((res) => {
			FeedbackDetail.value = res.data || [];
		});
};
const onSubmit = () => {
	if (state.content.length < 10) return showToast("内容长度不能小于10个字");
	const prams = {
		type: state.type,
		content: state.content,
		orderId: "",
		feedTopId: router.currentRoute.value.query.id,
		picUrls: state.files.map((item: any) => item.fileKey).join(","),
	};
	feedbackApi.submitFeedback(prams).then((res: any) => {
		if (res.code === 10000) {
			showToast("感谢您的反馈！");
			Object.assign(state, {});
			state.content = "";
			state.type = "";
			state.files = [];
			showForm.value = false;
			getFeedbackDetail();
		}
	});
};
</script>

<style scoped lang="scss">
.feedback_wrapper {
	overflow: hidden;
	height: calc(100vh - 100px);

	.title {
		height: 74px;
		display: flex;
		align-items: center;
		background: var(--Bg1);
		position: relative;
		border-radius: 12px 12px 0 0;
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
	.scrollBox {
		height: calc(100vh - 180px);
		overflow: auto;
	}
	.center {
		border-radius: 0 0 12px 12px;
		background: var(--Bg1);
		padding: 0 20px 20px;

		img.icon {
			border-radius: 50%;
		}
		.detailsTitle {
			img {
				width: 32px;
				height: 32px;
			}
		}
		.picUrls {
			border-radius: 5.12px;
			width: 64px;
			height: 64px;
			object-fit: cover;
			margin-right: 16px;
		}
	}
	.card {
		word-break: break-all;
		.icon {
			line-height: 24px;
			img {
				width: 24px;
				height: 24px;
				margin-right: 6px;
				border-radius: 50%;
			}
		}
	}
}
.textarea {
	width: 100%;
	min-height: 220px;
	background: var(--Bg1);
	border-radius: 8px;
	border: none;
	outline: none;
	resize: none;
	padding: 14px;
	color: var(--Text_s);
	border: 1px solid var(--Bg3);
}
.common_btn {
	width: 384px;
	height: 48px;
	line-height: 48px;
	text-align: center;
}
.line {
	height: 1px;
	width: 100%;
	margin-top: 6px;
	background: var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;
}
</style>
