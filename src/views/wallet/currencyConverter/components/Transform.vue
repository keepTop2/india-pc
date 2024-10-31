<script setup lang="ts"></script>

<template>
	<div class="transform-container">
		<div class="wrapper">
			<div class="form card-style">
				<div class="balance">
					<div>From</div>
					<div>
						<svg-icon name="wallet" size="20px" />
						<span>100.BCD</span>
					</div>
				</div>
				<div class="type">
					<svg-icon name="BCD" size="36px" />
					<span>BCD</span>
				</div>
				<div class="number">
					<div>900</div>
					<div>MAX</div>
				</div>
				<div class="line"></div>
				<div class="rate none">1</div>
			</div>
			<!--			<div class="round">-->
			<svg-icon name="transform" size="50px" class="icon" />
			<!--			</div>-->
			<div class="to card-style">
				<div class="balance">
					<div>From</div>
					<div>
						<svg-icon name="wallet" size="20px" />
						<span>100.BCD</span>
					</div>
				</div>
				<div class="type">
					<svg-icon name="USD" size="36px" />
					<span>BCD</span>
				</div>
				<div class="number">
					<div>900</div>
					<div>MAX</div>
				</div>
				<div class="line"></div>
				<div class="rate">Exchange Rate：1.2</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.transform-container {
	width: 100%;
	overflow: hidden;

	.none {
		opacity: 0;
	}

	.wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.card-style {
		width: 100%; /* 确保元素宽度为100% */
		height: 100%;
		padding: 18px 32px;
		//padding-bottom: 0;
		overflow: hidden;

		.balance {
			display: flex;
			align-items: center;
			justify-content: space-between;

			& > div:first-child {
				font-family: "PingFang SC";
				font-size: 20px;
				color: var(--light-ok-Text-1-1, #98a7b5);
			}

			& > div:last-child {
				display: flex;
				align-items: center;
				gap: 14px;

				span {
					font-family: PingFang SC;
					font-size: 20px;
					color: var(--light-ok-text-s, #ffffff);
				}
			}
		}

		.type {
			display: flex;
			align-items: center;
			gap: 14px;
			margin-top: 18px;
			margin-bottom: 34px;

			span {
				font-family: PingFang SC;
				font-size: 24px;
				font-weight: 600;
				color: var(--light-ok-text-s, #ffffff);
			}
		}

		.number {
			display: flex;
			align-items: center;
			justify-content: space-between;

			& > div:first-child {
				color: var(--light-ok-text-s, #ffffff);
				font-family: DIN Alternate;
				font-size: 30px;
				font-weight: 700;
			}

			& > div:last-child {
				font-family: PingFang SC;
				font-size: 18px;
				font-weight: 400;
				color: var(--light-ok-Text-1-1, #98a7b5);
			}
		}

		.line {
			margin-top: 10px;
			//margin-bottom: 47px;
			background: var(--light-ok-Line-2-, #373a40);
			height: 1px;
			border-radius: 4.26px 0px 0px 0px;
		}

		.rate {
			margin-top: 10px;
			//margin-bottom: 20px;
			font-family: PingFang SC;
			font-size: 12px;
			font-weight: 400;
			color: var(--light-ok-Text-1-1, #98a7b5);
		}
	}

	.form {
		background: url("../images/form.png") no-repeat;
		background-size: 100% 100%;
	}

	.icon {
		//display: flex;
		//align-items: center;
		//justify-content: center;
		position: absolute;
		left: 50%;
		top: 50.6%;
		transform: translate(-50%, -50%);
	}

	.to {
		background: url("../images/to.png") no-repeat;
		background-size: 100% 100%;
		margin-top: 10px;
	}
}
</style>
