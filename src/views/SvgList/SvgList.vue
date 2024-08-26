<template>
	<div class="svg_list">
		<!-- 遍历svg文件列表，每个文件生成一个带有SVG图标的div项，点击可复制文件名到剪贴板 -->
		<div v-for="svg in svgFiles" :key="svg" @click="copyFileName(svg)" class="svg-item">
			<SvgIcon :iconName="svg" width="30" height="30" alt="" />
			<span>{{ svg }}</span>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue';

// 用于存储SVG文件名的列表
const svgFiles = ref([]);

// 通过meta.glob动态导入所有符合路径条件的SVG文件，并整理文件名
const svgContext = import.meta.glob('/src/assets/zh/default/svg/**/*.svg');
console.log(svgContext, '====svgContext');
for (const path in svgContext) {
	// 提取文件名，并按路径分割为类别和文件名
	const fileName = path.replace('/src/assets/zh/default/svg/', '');
	const segments = fileName.split('/');
	const category = segments[1].split('.');
	// 将类别名添加到svgFiles列表中
	svgFiles.value.push(category[0]);
}

/**
 * 复制文件名到剪贴板
 * @param {string} fileName - 要复制的文件名
 */
function copyFileName(fileName) {
	navigator.clipboard.writeText(`<SvgIcon iconName="${fileName}" width="20" height="20" alt="" />`);
}
</script>
<style scoped lang="scss">
.svg_list {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	padding: 20px;
	background-color: #333738;
	svg {
		color: #67707b;
	}
}
.svg-item {
	cursor: pointer; /* 设置鼠标指针样式为手型，表示可点击 */
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	flex-direction: column;
	color: #fff;
}
</style>
