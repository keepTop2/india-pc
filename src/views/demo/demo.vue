<template>
	<div class="demo_container">
		<el-radio-group v-model="size" value="size control" size="small">
			<el-radio-button value="large">large</el-radio-button>
			<el-radio-button value="default">default</el-radio-button>
			<el-radio-button value="small">small</el-radio-button>
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
			<el-button @click="changeTheme(ThemeEnum.light)">{{ $t("common.白天") }} light</el-button>
			<el-button @click="changeTheme(ThemeEnum.dark)">{{ $t("common.黑夜") }} dark</el-button>

			<!-- <el-select v-model="UserStore.lang" placeholder="Select" size="large" style="width: 240px" @change="chageLang">
				<el-option v-for="item in UserStore.LangList" :key="item.code" :label="item.name" :value="item.code" />
			</el-select> -->

			<div class="lang_btn">{{ $t(`common["你好世界"]`) }}</div>
			<div>
				<Img src="/demo/demo.png" />
				<span> img图片</span>
			</div>

			<div class="bg_img" :style="{ backgroundImage: `url(${bgImgs.demoBg})` }" :class="[i18n.global.locale.value]"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { i18n } from "/@/i18n/index";
import { useThemesStore } from "/@/stores/modules/themes";
import imgs, { bgImgs } from "./imgs";
import { ThemeEnum } from "/@/enum/appConfigEnum";
import { LangEnum } from "/@/enum/appConfigEnum";
import { useUserStore } from "/@/stores/modules/user";
import Img from "/@/components/Img/index.vue";
const size = ref<"default" | "large" | "small">("default");

const value1 = ref("");
const value2 = ref("");
const shortcuts = [
	{
		text: "Today",
		value: new Date(),
	},
	{
		text: "Yesterday",
		value: () => {
			const date = new Date();
			date.setTime(date.getTime() - 3600 * 1000 * 24);
			return date;
		},
	},
	{
		text: "A week ago",
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
const UserStore = useUserStore();
//切换主题
const changeTheme = (themeName: ThemeEnum) => {
	const themesStore = useThemesStore();
	if (themeName == themesStore.getTheme) return;
	themesStore.setTheme(themeName);
};

//切换语言
const chageLang = (value: LangEnum) => {
	UserStore.setLangs(value);
};
</script>

<style lang="scss" scoped>
.demo_container {
<<<<<<< HEAD
	background-color: var(--Bg);
	color: var(--Text1);
	.bg {
		background-color: var(--Bg);
	}
=======
>>>>>>> ebfb3004cf7eaac46309baa5ae03bd1d66a47a8d
	.bg_img {
		width: 300px;
		height: 100px;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-image: url();
	}
}
</style>
