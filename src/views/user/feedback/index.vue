<template>
	<div class="max-width feedback_wrapper pt_30 pr_10 pl_10">
		<div class="tabs mb_30 curp">
			<div :class="currentTab === 0 ? 'activeTab' : ''" @click="currentTab = 0">立即反馈</div>
			<div :class="currentTab === 1 ? 'activeTab' : ''" @click="currentTab = 1">反馈记录</div>
		</div>
		<div v-if="currentTab === 0" class="fade-in">
			<p class="mb_20 fs_16 Text_s fw_200">帮助我们改善你的体验</p>
			<div>
				<textarea class="textarea fs_14"></textarea>
			</div>
			<div class="mt_30 mb_20" v-if="selectedFiles.length">上传图片</div>
			<div>
				<ImgUpload :files="files" :max="3" @update:files="updateFiles" :onUpload="uploadImg" />
			</div>
			<div class="Text2_1 mt_10 mb_40">最大不超过5 M，最多3张， 支持格式：jpg.png.jpeg</div>
			<div class="common_btn" @click="onSubmit">提交</div>
		</div>
		<div v-else class="fade-in">
			<div v-for="(item, index) in userFeedbackList" :key="index">
				<div class="title">
					<span>存款优惠没2020-05-04 10:10:10</span>
					<span>
						<span>ID：9357349833013 </span>
						<span @click="Common.copy(str)"> <svg-icon name="copy" size="16px" v-hover-svg class="curp" /> </span
					></span>
				</div>
				<div class="content">反馈内容文案，反馈内容文案，反馈内容文案，顶顶顶顶 详情</div>
				<div class="imgList"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const selectedFiles = ref<Array<File>>([]);
const currentTab = ref(0);
import { uploadApi } from "/@/api/upload";
const handleFilesSelected = (files: File) => {
	selectedFiles.value.push(files);
};
const userFeedbackList = ref([{}]);
const handleUploadComplete = (uploadedFiles: File[]) => {
	console.log("文件上传完成: ", uploadedFiles);
};
const files = ref<Array<{ name: string; preview: string }>>([]);
// 上传文件

const updateFiles = (newFiles: Array<{ name: string; preview: string }>) => {
	files.value = newFiles;
};
// 通过 axios 上传文件到 API
const uploadToApi = async (formData: FormData, index: number) => {};
const onSubmit = () => {
	console.log(files.value);
};
const uploadImg = (file: any) => {
	const formData = new FormData();
	formData.append("file", file);
	uploadApi.upload(formData);
};
</script>

<style scoped lang="scss">
.tabs {
	display: flex;
	gap: 60px;
	color: var(--Text2_1);
	> div {
		position: relative;
	}
	.activeTab {
		color: var(--Theme);
	}
	.activeTab::after {
		display: block;
		content: "";
		position: absolute;
		width: 60%;
		height: 2px;
		left: 50%;
		bottom: -5px;
		border-radius: 2px;
		transform: translateX(-50%);
		background-color: var(--Theme);
	}
}
.textarea {
	width: 100%;
	min-height: 320px;
	background: var(--Bg1);
	border-radius: 8px;
	border: none;
	outline: none;
	resize: none;
	padding: 14px;
	color: var(--Text_s);
}
.common_btn {
	width: 384px;
	height: 48px;
	line-height: 48px;
	text-align: center;
}
</style>
