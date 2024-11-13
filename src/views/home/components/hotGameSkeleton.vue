<template>
	<div class="skeleton-container" aria-busy="true">
		<!-- 骨架屏的标题部分 -->
		<div class="skeleton-cardHeader">
			<div class="skeleton-header-left"></div>
			<div class="skeleton-header-right"></div>
		</div>
		<!-- 骨架屏的游戏卡片 -->
		<div class="skeleton-lobbyGameList">
			<div v-for="n in skeletonCount" :key="n" class="skeleton-lobbyGameItem">
				<div class="skeleton-image"></div>
				<div class="skeleton-info"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	skeletonCount: {
		type: Number,
	},
});
</script>

<style scoped lang="scss">
/* 骨架屏整体的通用样式 */
.skeleton-container {
	position: relative;
	overflow: hidden;

	.skeleton-cardHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		position: relative;

		.skeleton-header-left,
		.skeleton-header-right {
			background: var(--Bg-3);
			border-radius: 4px;
			position: relative;
			overflow: hidden;
		}

		.skeleton-header-left {
			width: 120px;
			height: 24px;
		}

		.skeleton-header-right {
			width: 60px;
			height: 18px;
		}

		/* Shimmer effect for header */
		.skeleton-header-left::before,
		.skeleton-header-right::before {
			content: "";
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
			animation: shimmer-header 1.5s ease-in-out infinite;
		}
	}

	.skeleton-lobbyGameList {
		display: flex;
		flex-wrap: nowrap;
		gap: 15px;
		.skeleton-lobbyGameItem {
			width: 258px;
			position: relative;

			.skeleton-image,
			.skeleton-info {
				background: var(--Bg-3);
				position: relative; /* Ensure the shimmer effect is positioned correctly */
				overflow: hidden;
			}

			.skeleton-image {
				width: 100%;
				height: 206px;
				border-radius: 12px 12px 0 0;
			}

			.skeleton-info {
				width: 100%;
				height: 52px;
				background: var(--Bg-1);
				border-radius: 0 0 12px 12px;
			}

			/* Shimmer effect for each game item */
			.skeleton-image::before,
			.skeleton-info::before {
				content: "";
				position: absolute;
				top: 0;
				left: -100%;
				width: 100%;
				height: 100%;
				background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
				animation: shimmer-item 1.5s linear infinite;
			}
		}
	}
}

/* Shimmer animation for header */
@keyframes shimmer-header {
	0% {
		transform: translateX(-100%);
	}
	50% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(100%);
	}
}

/* Shimmer animation for each game item */
@keyframes shimmer-item {
	0% {
		transform: translateX(-100%);
	}
	50% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(100%);
	}
}
</style>
