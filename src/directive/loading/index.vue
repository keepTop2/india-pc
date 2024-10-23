<template>
	<div class="loading-mask">
		<div class="typing-indicator">
			<div class="typing-circle"></div>
			<div class="typing-circle"></div>
			<div class="typing-circle"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {} from "vue";
</script>

<style scoped lang="scss">
.loading-mask {
	width: 100%;
	min-height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10000001;

	.typing-indicator {
		width: 60px;
		height: 30px;
		position: relative;
		z-index: 4;
	}

	.typing-circle {
		width: 8px;
		height: 8px;
		position: absolute;
		border-radius: 50%;
		background-color: var(--Theme);
		left: 15%;
		transform-origin: 50%;
		animation: typing-circle7124 0.5s alternate infinite ease;
	}

	@keyframes typing-circle7124 {
		0% {
			top: 20px;
			height: 5px;
			border-radius: 50px 50px 25px 25px;
			transform: scaleX(1.7);
		}

		40% {
			height: 8px;
			border-radius: 50%;
			transform: scaleX(1);
		}

		100% {
			top: 0%;
		}
	}

	.typing-circle:nth-child(2) {
		left: 45%;
		animation-delay: 0.2s;
	}

	.typing-circle:nth-child(3) {
		left: auto;
		right: 15%;
		animation-delay: 0.3s;
	}
}
</style>
