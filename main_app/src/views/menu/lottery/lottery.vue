<template>
	<div class="base-body">
		<div class="base-container">
			<div class="header">
				<Carousel :gameList="gameList" :spaceBetween="12" />
			</div>
		</div>
		<div class="base-container back-container">
			<div class="container-main">
				<sportCard></sportCard>
			</div>
		</div>
		<div class="base-container">
			<div class="footer"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Carousel } from '/@/components/Carousel';
import { sportCard } from './components';
const router = useRouter();

const listItem = ref({});
//gamelist 标签值
const menuTab = computed(() => {});
const gameList = [
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
];
onMounted(() => {});
</script>

<style lang="scss" scoped>
.base-body {
	display: block;
	position: relative;
	flex: 1;
	flex-shrink: 0;
	width: 100%;
}
.base-container {
	display: flex;
	justify-content: center;
	.header {
		width: 1200px;
		height: 232px;
		flex-shrink: 0;
		padding-top: 36px;
		box-sizing: border-box;
		background-color: transparent;
	}
	.container-main {
		width: 1200px;
		background: none;
	}

	&.back-container {
		@include themeify {
			background-color: themed('Bg');
		}
	}
}
</style>
