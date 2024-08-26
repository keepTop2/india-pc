<template>
	<Tabs class="" v-model="activeKey" :list="tabList" :height="60" />
	<div class="content">
		<template v-if="activeKey === 1">
			<div class="languageContaner">
				<div class="list lang-list" :class="{ activeList: activeLanguage === item.code }" @click="clickHandle(item)" v-for="(item, index) in language" :key="index">
					<span class="name">{{ item.title }}</span>
				</div>
			</div>
		</template>
		<template v-if="activeKey === 2">
			<CurrenciesList :data="currencies" />
		</template>
		<template v-if="activeKey === 3">
			<CurrenciesList :data="currencies" />
		</template>
	</div>
</template>
<script setup lang="ts">
import { reactive, ref, defineEmits } from 'vue';
// import { setLang } from '/@/i18n/index';
// import { useI18n } from 'vue-i18n';
import { useUserStore } from '/@/stores/modules/user';
import { tabList, language, currencies } from '../mock';
import Tabs from '/@/components/Tabs/Tabs.vue';
import CurrenciesList from '../CurrenciesList/CurrenciesList.vue';

const emit = defineEmits(['close']);

const UserStore = useUserStore();

const activeKey = ref(1);

const activeLanguage = ref(UserStore.getLang);

const clickHandle = (item: { title: string; code: any }) => {
	if (activeLanguage.value !== item.title) {
		UserStore.setLang(item.code);
		activeLanguage.value = item.code;
		setTimeout(() => {
			window.location.reload();
		}, 500);
	}
};
const props = defineProps({
	visible: {
		type: Boolean,
	},
});
</script>
<style lang="scss" scoped>
// .el-dialog {
// 	@include themeify {
// 		border-radius: 15px;
// 		background-color: themed('Bg1');
// 		padding: 0;
// 		overflow: hidden !important;
// 		.el-dialog__header.show-close {
// 			position: absolute;
// 			right: 0;
// 			top: 6px;
// 		}
// 		.el-dialog__body {
// 		}
// 	}
// }
.content {
	height: 515px;
}
.languageContaner {
	@include themeify {
		padding: 0px 20px;
		display: flex;
		flex-wrap: wrap;
		// overflow: scroll;
	}
	.list {
		@include themeify {
			width: 184px;
			height: 48px;
			display: flex;
			align-items: center;
			margin-right: 10px;
			margin-bottom: 12px;
			padding: 0 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			border-radius: 2px;
			color: themed('Text1');

			&:nth-child(4n) {
				margin-right: 0;
			}

			.coin {
				width: 24px;
				height: 24px;
				margin-right: 10px;
			}

			.name {
				font-size: 14px;
				color: themed('Text1');
				span {
					color: themed('Text2_1');
				}
			}

			.alias {
				margin-left: 5px;
				font-size: 14px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			&:not(.none) {
				cursor: pointer;

				&.activeList {
					background: themed('Bg3');

					.name {
						color: themed('Text_s');
					}
				}
			}

			&.lang-list:hover {
				background: themed('Bg3');
				.name {
					color: themed('Text_s');
				}
			}
		}
	}
}
</style>
