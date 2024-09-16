<!-- src/components/Modal.vue -->
<template>
	<Transition name="slide-fade">
		<div class="modal-overlay" @click="handleOverlayClick">
			<div class="modal-content" @click.stop>
				<!-- <button class="close-btn" @click="close">×</button> -->
				<slot></slot>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);
const handleOverlayClick = () => {
	emit("close");
};
</script>

<style scoped lang="scss">
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	height: 100vh;
	width: 100vw;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow-y: auto;
}
.modal-overlay::-webkit-scrollbar {
	display: none;
}
.modal-content {
	border-radius: 8px;
	top: 0;
	margin: auto;
	width: 1150px;
	position: relative;
	background: var(--Bg2);
}

.close-btn {
	position: absolute;
	top: 10px;
	right: 10px;
	border: none;
	color: var(--Icon_1);
	background: transparent;
	font-size: 30px;
	cursor: pointer;
}
.slide-fade-enter-active {
	transition: all 0.2s ease-in;
}

.slide-fade-leave-active {
	transition: all 0.2s ease-out;
}
</style>
