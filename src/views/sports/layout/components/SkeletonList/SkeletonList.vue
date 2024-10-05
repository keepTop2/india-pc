<template>
	<div class="skeleton-card" v-for="i in 3" :key="i">
		<!-- 模拟 card-header -->
		<div class="skeleton-header">
			<div class="skeleton-league-info">
				<el-skeleton-item variant="circle" style="width: 20px; height: 20px" />
				<el-skeleton-item variant="text" style="width: 200px; margin-left: 12px" />
			</div>
			<div class="skeleton-market-info">
				<el-skeleton-item v-for="j in 6" :key="j" variant="text" :style="getMarketItemStyle(j)" />
			</div>
			<div class="skeleton-header-icon"></div>
		</div>
		<!-- 模拟 eventItem -->
		<div class="skeleton-event" v-for="j in 2" :key="j">
			<div class="skeleton-event-content">
				<div class="skeleton-event-left">
					<div class="skeleton-team-info">
						<div class="skeleton-team" v-for="k in 2" :key="k">
							<el-skeleton-item variant="circle" style="width: 20px; height: 20px" />
							<el-skeleton-item variant="text" style="width: 150px; margin-left: 6px" />
							<el-skeleton-item variant="text" style="width: 20px; margin-left: auto; margin-right: 8px" />
						</div>
					</div>
					<div class="skeleton-market-column">
						<div class="skeleton-market-row" v-for="k in 2" :key="k">
							<div class="skeleton-market-card" v-for="l in 6" :key="l" :style="getMarketItemStyle(l)">
								<div class="skeleton-market-content">
									<div class="skeleton-market-item">
										<el-skeleton-item variant="text" style="width: 60%; height: 12px" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="skeleton-other-info">
					<el-skeleton-item variant="text" style="width: 80px; margin-right: 100px" />
					<div class="skeleton-info-list">
						<el-skeleton-item variant="text" style="width: 80px" />
					</div>
				</div>
			</div>
			<div class="skeleton-tools"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
const getMarketItemStyle = (index: number) => {
	if (index === 1 || index === 4) return { width: "78px" };
	if (index === 2 || index === 5) return { width: "92px" };
	if (index === 3 || index === 6) return { width: "118px" };
	return { width: "78px" };
};
</script>

<style lang="scss" scoped>
.skeleton-card {
	margin-bottom: 5px;
	background-color: var(--Bg1);
	border-radius: 8px;
	overflow: hidden;
	:deep(.el-skeleton__item) {
		// background: linear-gradient(90deg, #8c8c8c 25%, #737373 37%, #8a8a8a 63%);
		background: linear-gradient(90deg, var(--Bg3) 25%, var(--Bg1) 37%, var(--Bg3) 63%);

		background-size: 400% 100%;
	}
}

.skeleton-header {
	display: flex;
	align-items: center;
	padding: 8px;
	background: var(--Bg6);
	height: 34px;
}

.skeleton-league-info {
	display: flex;
	align-items: center;
	min-width: 284px;
}

.skeleton-market-info {
	display: flex;
	margin-left: auto;
	gap: 4px;
}

.skeleton-header-icon {
	width: 46px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.skeleton-event {
	display: flex;
	padding: 8px;
	height: 120px;
	background: var(--Bg1);
	border-bottom: 1px solid var(--Line_2);
	.skeleton-event-content {
		// display: flex;
		.skeleton-event-left {
			display: flex;
			height: 68px;
		}
	}
}

.skeleton-team-info {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 284px;
	height: 100%;
}

.skeleton-team {
	display: flex;
	align-items: center;
}

@keyframes el-skeleton-loading {
	0% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0 50%;
	}
}

.skeleton-other-info {
	display: flex;
	// justify-content: space-between;
	align-items: center;
	background: var(--Bg3);
	height: 30px;
	margin-top: 8px;
	margin-right: 4px;
	padding-left: 9px;
	// animation: el-skeleton-loading 1.4s ease infinite;
	// background: linear-gradient(90deg, var(--Bg3) 25%, var(--Bg1) 37%, var(--Bg3) 63%);
	// background-size: 300% 100%;
}

.skeleton-info-list {
	display: flex;
	align-items: center;
	gap: 10px;
}

.skeleton-market-column {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 600px;
	// margin-left: 4px;
}

.skeleton-market-row {
	display: flex;
	gap: 4px;
}

.skeleton-market-card {
	width: 78px;
	height: 32px;
	background-color: var(--Bg3);
	border-radius: 4px;
	padding: 6px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.skeleton-market-content {
	width: 100%;
	height: 100%;
}

.skeleton-market-item {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 6px;
	border-radius: 4px;
	background: var(--Bg3);
	box-sizing: border-box;
}

.skeleton-label {
	max-width: 60%;
}

.skeleton-value {
	max-width: 40%;
	display: flex;
	justify-content: flex-end;
}

.skeleton-tools {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 46px;
	margin-left: auto;
	gap: 16px;
}
</style>
