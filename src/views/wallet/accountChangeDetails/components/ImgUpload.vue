<template>
	<div class="upload-container">
		<p class="mt_30 mb_20 Text_s">上传图片</p>
		<input type="file" id="fileInput" @change="handleFileChange" class="hidden-input" />
		<div class="preview-container">
			<div v-for="(file, index) in files" :key="index" class="preview-item">
				<img :src="file.preview" alt="Preview" class="preview-image" />
				<div class="deleteBtn" @click="deleteImg(index)">
					<img src="/@/assets/common/upload_delete_icon.png" alt="" />
				</div>
			</div>
			<label for="fileInput" class="custom-upload-button" v-if="files?.length < max"> </label>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
const props = defineProps({
	max: Number,
	files: {
		type: Array as () => Array<{ name: string; preview: string }>,
		required: true,
	},
	onUpload: {
		type: Function,
		require: true,
		default: () => {},
	},
});

const emit = defineEmits(["update:files"]);

const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files) {
		props.onUpload(target.files[0]);
		const newFiles = Array.from(target.files).map((file) => {
			const reader = new FileReader();
			const preview = new Promise<string>((resolve) => {
				reader.onload = (e) => resolve(e.target?.result as string);
			});
			reader.readAsDataURL(file);
			return preview.then((previewUrl) => ({
				name: file.name,
				preview: previewUrl,
			}));
		});
		Promise.all(newFiles).then((fileObjects) => {
			emit("update:files", [...props.files, ...fileObjects]);
		});
	}
};

const deleteImg = (index: number) => {
	props.files.splice(index, 1);
	emit("update:files", props.files);
};
</script>

<style scoped lang="scss">
.hidden-input {
	display: none;
}

.custom-upload-button {
	display: inline-block;
	width: 100px;
	height: 100px;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	background: url("./upload_bg.png") center center / 100% 100% no-repeat;
}

.preview-container {
	display: flex;
	flex-wrap: wrap;
}

.preview-item {
	text-align: center;
	width: 100px;
	height: 100px;
	position: relative;
	margin-right: 26px;
	.deleteBtn {
		position: absolute;
		top: -10px;
		right: -10px;
		cursor: pointer;
		img {
			width: 24px;
			height: 24px;
		}
	}
}

.preview-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 8px;
}
</style>
