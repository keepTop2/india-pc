<template>
	<div class="demo_container">
		<el-radio-group v-model="size" label="size control" size="small">
			<el-radio-button label="large">large</el-radio-button>
			<el-radio-button label="default">default</el-radio-button>
			<el-radio-button label="small">small</el-radio-button>
		</el-radio-group>
		<el-button type="primary">Primary</el-button>

		<div class="demo-date-picker">
			<div class="block">
				<span class="demonstration">Default</span>
				<el-date-picker v-model="value1" type="date" placeholder="Pick a day" :size="size" />
			</div>
			<div class="block">
				<span class="demonstration">Picker with quick options</span>
				<el-date-picker v-model="value2" type="date" placeholder="Pick a day" :disabled-date="disabledDate" :shortcuts="shortcuts" :size="size" />
			</div>
		</div>

		<div class="demo_container">
			<div @click="changeTheme">点击切换主题</div>

			<el-button @click="chageLang">切换语言</el-button>

			<div class="lang_btn">{{ $t(`common["你好世界"]`) }}</div>
			<div>
				<img :src="imgs.demoImgUrl" />
				<span> img图片</span>
			</div>

			<div class="bg_img" :style="{ backgroundImage: `url(${bgImgs.demoBg})` }" :class="[i18n.global.locale.value]"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const size = ref<'default' | 'large' | 'small'>('default');

const value1 = ref('');
const value2 = ref('');

const shortcuts = [
	{
		text: 'Today',
		value: new Date(),
	},
	{
		text: 'Yesterday',
		value: () => {
			const date = new Date();
			date.setTime(date.getTime() - 3600 * 1000 * 24);
			return date;
		},
	},
	{
		text: 'A week ago',
		value: () => {
			const date = new Date();
			date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
			return date;
		},
	},
];

const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};

import { i18n } from '/@/i18n/index';
import { useThemesStore } from '/@/stores/modules/themes';
import { setLang } from '/@/i18n/index';
import imgs, { bgImgs } from './imgs';

//切换主题
const changeTheme = () => {
	const themesStore = useThemesStore();
	if (themesStore.themeName == 'default') {
		themesStore.setTheme('dark');
	} else {
		themesStore.setTheme('default');
	}
};

//切换语言
const chageLang = () => {
	// const;
	if (localStorage.getItem('lang') == 'en') {
		setLang('zh');
	} else {
		setLang('en');
	}
	window.location.reload();
};
</script>

<style lang="scss" scoped>
.demo_container {
	@include themeify {
		background-color: themed('Theme');
		color: themed('Warn');
	}
	.bg {
		@include themeify {
			background: themed('Text1');
		}
	}
	.bg_img {
		width: 300px;
		height: 100px;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-image: url();
	}
}
</style>
