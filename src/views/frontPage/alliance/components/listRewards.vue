<template>
	<!-- 联盟列表 -->
	<div class="content">
		<div class="content_one">
			<div class="title"><span>huiyuanzhanghao123</span></div>
			<div class="text">
				<div>总存款(近7天):</div>
				<div>$400.00</div>
			</div>
			<div class="text">
				<div>总投注额(近7天):</div>
				<div>$400.00</div>
			</div>
			<div class="text">
				<div>奖励类型:</div>
				<div>推荐奖励</div>
			</div>
			<div class="text">
				<div>奖励金额:</div>
				<div>$50.00</div>
			</div>
			<div class="text">
				<div>注册日期:</div>
				<div>2023-04-01 19:23</div>
			</div>
		</div>
		<div class="content_one">
			<div class="title"><span>huiyuanzhanghao123</span></div>
			<div class="text">
				<div>总存款(近7天):</div>
				<div>$400.00</div>
			</div>
			<div class="text">
				<div>总投注额(近7天):</div>
				<div>$400.00</div>
			</div>
			<div class="text">
				<div>奖励类型:</div>
				<div>推荐奖励</div>
			</div>
			<div class="text">
				<div>奖励金额:</div>
				<div>$50.00</div>
			</div>
			<div class="text">
				<div>注册日期:</div>
				<div>2023-04-01 19:23</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.content {
	padding: 24px;

	.content_one {
		margin-top: 24px;
		border-radius: 12px;

		@include themeify {
			background: themed('BG3');
		}

		padding-bottom: 24px;

		.title {
			padding: 18px 24px 18px 24px;
			border-radius: 12px 12px 0px 0px;

			@include themeify {
				background: themed('BG7');
			}

			display: flex;
			align-items: center;
			margin-bottom: 24px;

			img {
				width: 60px;
				height: 60px;
				margin-right: 12px;
			}

			span {
				@include themeify {
					color: themed('TB');
				}

				text-align: center;

				/* Text2-文本2 */
				font-family: 'PingFang SC';
				font-size: 26px;
				font-style: normal;
				font-weight: 400;
				line-height: 36px;
				/* 138.462% */
			}
		}

		.text {
			height: 54px;
			padding: 10px 24px;
			border-bottom: 1px solid #373a40;
			display: flex;
			justify-content: space-between;
			align-items: center;

			@include themeify {
				color: themed('T1');
			}

			font-family: 'PingFang SC';
			font-size: 24px;
			font-style: normal;
			font-weight: 500;
			line-height: 34px;
			/* 141.667% */
		}

		.text:nth-last-child(1) {
			border: none;
		}
	}
}
</style>
