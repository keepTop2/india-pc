<template>
	<div class="upload-container">
		<input type="file" id="fileInput" multiple @change="handleFileChange" class="hidden-input" />
		<label for="fileInput" class="custom-upload-button">点击上传文件</label>
		<div class="preview-container">
			<div v-for="(file, index) in files" :key="index" class="preview-item">
				<img :src="file.preview" alt="Preview" class="preview-image" />
				<p>{{ file.name }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "FileUpload",
	setup() {
		const files = ref<Array<{ name: string; preview: string }>>([]);

		const handleFileChange = (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target.files) {
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
					files.value = [...files.value, ...fileObjects];
				});
			}
			console.log(files, 33333);
		};

		return { files, handleFileChange };
	},
});
</script>

<style scoped>
.upload-container {
	padding: 1rem;
}

.hidden-input {
	display: none;
}

.custom-upload-button {
	display: inline-block;
	padding: 0.5rem 1rem;
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	text-align: center;
}

.custom-upload-button:hover {
	background-color: #0056b3;
}

.preview-container {
	display: flex;
	flex-wrap: wrap;
	margin-top: 1rem;
}

.preview-item {
	margin-right: 1rem;
	margin-bottom: 1rem;
	text-align: center;
}

.preview-image {
	width: 100px;
	height: 100px;
	object-fit: cover;
	border: 1px solid #ddd;
}
</style>
