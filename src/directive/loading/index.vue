<template>
	<div class="loader_mask">
		<!-- <div class="loader"></div> -->
		<div class="typing-indicator">
			<div class="dot1"></div>
			<div class="dot2"></div>
			<div class="dot3"></div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.loader_mask {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	min-height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: inherit;
	transition: all 0.2s;
	.typing-indicator {
    display: flex;
    .dot1,
    .dot2,
    .dot3 {
       width: 8px;
       height: 8px;
       border-radius: 50%;
       margin-left: 6px;
     }

    .dot1 {
       animation: jump 1.2s -0.4s linear infinite;
       background: #ff0008;
     }

    .dot2 {
       animation: jump 1.2s -0.2s linear infinite;
       background: #ff0008;
     }

    .dot3 {
       animation: jump 1.2s linear infinite;
       background: #ff0008;
     }

    @keyframes jump {
      0%,
      80%,
      100% {
        transform: scale(0.8);
        opacity: 1.0;
      }

      40% {
        transform: scale(2);
        opacity: 0.8;
      }
    }
	}
}

// .loader {
// 	width: 36px;
// 	height: 36px;
// 	border: 4px solid #ff284b;
// 	border-left-color: transparent;
// 	border-radius: 50%;
// 	animation: spin89345 1s linear infinite;
// }

// @keyframes spin89345 {
// 	0% {
// 		transform: rotate(0deg);
// 	}

// 	100% {
// 		transform: rotate(360deg);
// 	}
// }
</style>
