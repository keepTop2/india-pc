<template>
	<div class="upload-container">
		<input type="file" id="fileInput" @change="handleFileChange" class="hidden-input" accept=".jpg, .jpeg, .png, image/jpeg, image/png" />
		<div class="preview-container">
			<div v-for="(file, index) in files" :key="index" class="preview-item">
				<img :src="file.url" alt="Preview" class="preview-image" />
				<div class="deleteBtn" @click="deleteImg(index)">
					<img src="../assets/common/upload_delete_icon.svg" alt="" />
				</div>
			</div>
			<label for="fileInput" class="custom-upload-button" v-if="files?.length < max">
				<img src="../assets/common/upload_img.png" alt="" />
			</label>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { uploadApi } from "../api/upload";
import showToast from "../hooks/useToast";
const props = defineProps({
	max: {
		type: Number,
		required: true,
	},
	files: {
		type: Array as any,
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
		if (target.files[0].size > 1024 * 5) {
			return showToast("最大不超过5 M");
		}
		uploadImg(target.files[0]);
	}
};
const uploadImg = async (file: any) => {
	const formData = new FormData();
	formData.append("file", file);
	uploadApi.upload(formData).then((res) => {
		emit("update:files", [...props.files, res.data]);
	});
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
	width: 64px;
	height: 64px;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px dashed var(--Line_2);
	img {
		width: 34px;
		height: 34px;
	}
}

.preview-container {
	display: flex;
	flex-wrap: wrap;
}

.preview-item {
	text-align: center;
	width: 64px;
	height: 64px;
	position: relative;
	margin-right: 20px;
	.deleteBtn {
		position: absolute;
		top: -8px;
		right: -8px;
		cursor: pointer;
		img {
			width: 18px;
			height: 18px;
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
