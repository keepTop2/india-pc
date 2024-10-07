<template>
	<div class="champion-skeleton">
		<div class="selectCard">
			<el-skeleton-item variant="text" style="width: 30px" />
		</div>
		<div v-for="i in 10" :key="i" class="champion-skeleton-item">
			<div class="champion-skeleton-header">
				<div class="champion-skeleton-league">
					<el-skeleton-item variant="text" style="width: 500px; margin-left: 12px" />
				</div>
				<!-- <div class="champion-skeleton-arrow"></div> -->
			</div>
			<div class="champion-skeleton-content">
				<div v-for="j in 2" :key="j" class="champion-skeleton-market">
					<div class="champion-skeleton-team">
						<el-skeleton-item variant="text" style="width: 200px" />
						<el-skeleton-item variant="text" style="width: 40px" />
					</div>
					<!-- <div class="champion-skeleton-odds"></div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.champion-skeleton {
	margin-top: 4px;
	:deep(.el-skeleton__item) {
		// background: linear-gradient(90deg, #8c8c8c 25%, #737373 37%, #8a8a8a 63%);
		background: linear-gradient(90deg, var(--Bg3) 25%, var(--Bg1) 37%, var(--Bg3) 63%);

		background-size: 400% 100%;
	}
	.selectCard {
		width: 100%;
		height: 34px;
		background: var(--Bg1);
		border-radius: 4px;
		margin: 4px 0;
		padding: 0px 19px;
		line-height: 34px;
	}
	&-item {
		margin-bottom: 10px;
		background: var(--Bg1);
		border-radius: 8px;
	}

	&-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background: var(--Bg6);
		border-radius: 8px 8px 0 0;
		height: 34px;
	}

	&-league {
		width: 70%;
		height: 20px;
		background: var(--Bg3);
		border-radius: 4px;
	}

	&-arrow {
		width: 20px;
		height: 20px;
		background: var(--Bg3);
		border-radius: 50%;
	}

	&-content {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		padding: 10px;
	}

	&-market {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

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

	&-odds {
		width: 40%;
		height: 24px;
		background: var(--Bg3);
		border-radius: 4px;
	}
}
</style>
