<template>
	<div class="max-width feedback_wrapper pt_30">
		<div class="tabs mb_30 curp">
			<div :class="currentTab === 0 ? 'activeTab' : ''" @click="currentTab = 0">立即反馈</div>
			<div :class="currentTab === 1 ? 'activeTab' : ''" @click="currentTab = 1">反馈记录</div>
		</div>
		<div v-if="currentTab === 0">
			<p class="mb_20 fs_16 Text_s">帮助我们改善你的体验</p>
			<div>
				<textarea class="textarea fs_14"></textarea>
			</div>

			<div class="mt_30 mb_20">上传图片</div>
			<div>
				<ImgUpload @filesSelected="handleFilesSelected" />
			</div>
			<div>最大不超过5 M，最多3张， 支持格式：jpg.png.jpeg</div>
			<div class="common_btn" @click="uploadFiles">提交</div>
		</div>
		<div v-else></div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const selectedFiles = ref<Array<File>>([]);
const currentTab = ref(0);
const handleFilesSelected = (files: File) => {
	selectedFiles.value.push(files);
};
const handleUploadComplete = (uploadedFiles: File[]) => {
	console.log("文件上传完成: ", uploadedFiles);
};
// 上传文件
const uploadFiles = async () => {
	if (selectedFiles.value.length === 0) return;

	for (let i = 0; i < selectedFiles.value.length; i++) {
		const formData = new FormData();
		formData.append("file", selectedFiles.value[i]);

		try {
			await uploadToApi(formData, i);
		} catch (error) {
			console.error("上传失败:", error);
		}
	}
};
// 通过 axios 上传文件到 API
const uploadToApi = async (formData: FormData, index: number) => {};
</script>

<style scoped lang="scss">
.tabs {
	display: flex;
	gap: 60px;
	.activeTab {
		color: var(--Theme);
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
