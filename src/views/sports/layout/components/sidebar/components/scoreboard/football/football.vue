<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'">
			<div class="scoreboard-center">
				<div class="header cell">
					<div class="label"></div>
					<div class="value"></div>
				</div>
				<div class="row cell">
					<div class="label"></div>
					<div class="value"></div>
				</div>
				<div class="row cell">
					<div class="label"></div>
					<div class="value"></div>
				</div>
			</div>
		</div>
		<div class="scoreboard-footer"></div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.scoreboard-container {
	width: 100%;
	height: 208px;

	// 侧边栏小布局
	.small {
		width: 100%;
		height: 100%;
		background: url("/@/assets/zh-CN/sports/sidebar/football_s.png") center center / 100% 100% no-repeat;
		.scoreboard-center {
			width: 100%;
			height: 100%;
			padding: 35px 12px;
			.header {
			}
			.row {
			}
			.cell {
				.label {
				}
				.value {
				}
			}
		}
	}
}
</style>
1660px
