<template>
	<!-- 冠军赛事骨架屏组件 -->
	<div class="champion-skeleton">
		<!-- 选择卡片骨架 -->
		<div class="selectCard">
			<el-skeleton-item variant="text" style="width: 30px" />
		</div>
		<!-- 循环渲染10个骨架项 -->
		<div v-for="i in 10" :key="i" class="champion-skeleton-item">
			<!-- 骨架项头部 -->
			<div class="champion-skeleton-header">
				<!-- 联赛信息骨架 -->
				<div class="champion-skeleton-league">
					<el-skeleton-item variant="text" style="width: 500px; margin-left: 12px" />
				</div>
				<!-- 箭头骨架（已注释） -->
				<!-- <div class="champion-skeleton-arrow"></div> -->
			</div>
			<!-- 骨架项内容 -->
			<div class="champion-skeleton-content">
				<!-- 循环渲染2个市场骨架 -->
				<div v-for="j in 2" :key="j" class="champion-skeleton-market">
					<!-- 队伍信息骨架 -->
					<div class="champion-skeleton-team">
						<el-skeleton-item variant="text" style="width: 200px" />
						<el-skeleton-item variant="text" style="width: 40px" />
					</div>
					<!-- 赔率骨架（已注释） -->
					<!-- <div class="champion-skeleton-odds"></div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// 无需额外的脚本逻辑
</script>

<style scoped lang="scss">
// 冠军骨架屏样式
.champion-skeleton {
	margin-top: 4px;
	// 深度选择器，修改 Element Plus 骨架屏项的背景
	:deep(.el-skeleton__item) {
		// 注释掉的是原始颜色
		// background: linear-gradient(90deg, #8c8c8c 25%, #737373 37%, #8a8a8a 63%);
		// 使用CSS变量实现动态颜色
		background: linear-gradient(90deg, var(--Bg3) 25%, var(--Bg1) 37%, var(--Bg3) 63%);
		background-size: 400% 100%;
	}
	// 选择卡片样式
	.selectCard {
		width: 100%;
		height: 34px;
		background: var(--Bg1);
		border-radius: 4px;
		margin: 4px 0;
		padding: 0px 19px;
		line-height: 34px;
	}
	// 骨架项样式
	&-item {
		margin-bottom: 10px;
		background: var(--Bg1);
		border-radius: 8px;
	}
	// 骨架项头部样式
	&-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background: var(--Bg6);
		border-radius: 8px 8px 0 0;
		height: 34px;
	}
	// 联赛信息骨架样式
	&-league {
		width: 70%;
		height: 20px;
		background: var(--Bg3);
		border-radius: 4px;
	}
	// 箭头骨架样式（未使用）
	&-arrow {
		width: 20px;
		height: 20px;
		background: var(--Bg3);
		border-radius: 50%;
	}
	// 骨架项内容样式
	&-content {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		padding: 10px;
	}
	// 市场骨架样式
	&-market {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	// 队伍信息骨架样式
	&-team {
		width: 100%;
		height: 34px;
		background: var(--Bg3);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
	}
	// 赔率骨架样式（未使用）
	&-odds {
		width: 40%;
		height: 24px;
		background: var(--Bg3);
		border-radius: 4px;
	}
}
</style>
