<template>
	<div class="header">
		<div class="breadcrumb-plan">
			<el-breadcrumb :separator-icon="ArrowRight">
				<template v-for="(item, index) in breadcrumbData" :key="index">
					<el-breadcrumb-item v-if="index == breadcrumbData.length - 1">
						<template v-if="item?.meta?.isServer">
							{{ item.meta.title }}
						</template>
						<template v-else> {{ $t(item.meta.title) }} </template>
					</el-breadcrumb-item>
					<el-breadcrumb-item v-else :to="item">
						<template v-if="item?.meta?.isServer">
							{{ item.meta.title }}
						</template>
						<template v-else> {{ $t(item.meta.title) }} </template>
					</el-breadcrumb-item>
				</template>
			</el-breadcrumb>
		</div>
		<div class="seach-plan">
			<el-form :inline="true" :model="formInline">
				<el-form-item :label="$t(`gameList['排序方式']`)" v-if="isSort">
					<Select v-model="formInline.sortFile" :options="listOptions" :placeholder="$t(`gameList['你可能喜欢']`)" clearable>
						<template #default="{ item }">
							<div :class="formInline.region == item.value ? 'active' : ''" class="select-radio">
								<p>{{ item.label }}</p>
							</div>
						</template>
					</Select>
				</el-form-item>
				<el-form-item :label="$t(`gameList['提供者']`)" v-if="isSupplier">
					<Select
						v-model="formInline.venueIds"
						value-key="id"
						label-field="name"
						value-field="id"
						:options="supplierList"
						:placeholder="$t(`gameList['游戏供应商']`)"
						multiple
						collapseTags
						selectOptionClass="select-checked-option"
					>
						<template #default="{ item }">
							<div :class="formInline.venueIds.indexOf(item?.id) != -1 ? 'active' : ''" class="select-checked">
								<div class="label">
									<span class="icon">
										<SvgIcon v-if="formInline.venueIds.indexOf(item.id) != -1" iconName="checkbox_icon" class="iconSvg" />
									</span>
									<span class="text">{{ item.name || "-" }}</span>
								</div>
								<div class="tag">
									<span>{{ item.gameSize }}</span>
								</div>
							</div>
						</template>
					</Select>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { Select } from "./components";

import Common from "/@/utils/common";
import { CasionApi } from "/@/api/menu/casion/casion";
import { useRoute, useRouter } from "vue-router";
// import { useI18n } from 'vue-i18n';

import { i18n } from "/@/i18n/index";

const $: any = i18n.global;

// const i18n = useI18n();
const route = useRoute();
const router = useRouter();

const emits = defineEmits(["onFormChange"]);

interface HeaderData {
	isSort?: boolean; //是否有排序
	isSupplier?: boolean; //是否有供应商
}

const props = withDefaults(defineProps<HeaderData>(), {
	isSort: true,
	isSupplier: true,
});

const formInline = reactive({
	sortFile: "", //排序字段
	venueIds: [], //游戏供应商人
});

// 生成数组数据
const breadcrumbData: any = ref([]);
const getBreadcrumbData = () => {
	const arr = route.matched.filter((item) => {
		return item?.meta && item.meta?.title;
	});
	breadcrumbData.value = arr;
};
// 监听路由发生改变时触发
watch(
	route,
	() => {
		getBreadcrumbData();
	},
	{
		immediate: true,
	}
);

watch(
	() => formInline,
	(newValue, oldValue) => {
		emits("onFormChange", newValue);
	},
	{
		deep: true,
		// immediate: true,
	}
);

const listOptions = [
	{ label: $.t('gameList["最受欢迎的"]'), value: "2" },
	{ label: $.t('gameList["最新的"]'), value: `3` },
	{ label: "A-Z", value: `4` },
	{ label: "Z-A", value: `5` },
];

const supplierList = ref([]);

const gameSupplier = async () => {
	const params = {
		pageNumber: -1,
		// pageSize:10,
	};
	//请求顶部控制项
	const header = {
		showLoading: true,
	};
	const res: any = await CasionApi.gameSupplierList(params, header).catch((err: any) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		const { total, records } = data;
		supplierList.value = records;
	}
};
onMounted(() => {
	if (props.isSupplier) {
		gameSupplier();
	}
});
</script>

<style lang="scss" scoped>
$el-breadcrumb: "el-breadcrumb";

.header {
	width: 1200px;
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	padding-top: 52px;
	padding-bottom: 20px;
	background: transparent;

	.breadcrumb-plan {
		border-radius: 4px;

		// background: var(--Bg1-1, #24262b);
		@include themeify {
			background-color: themed("Bg1");
		}

		padding: 10px 17px;

		:deep() {
			.el-breadcrumb {
				.el-breadcrumb__item {
					.el-breadcrumb__inner {
						// color: var(--Text1-1, #98a7b5);
						text-align: right;
						font-family: "PingFang SC";
						font-size: 14px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						cursor: pointer;

						@include themeify {
							color: themed("Text1");
						}
					}

					&:last-child {
						.el-breadcrumb__inner {
							// color: var(--text-s, #fff);
							font-family: "PingFang SC";
							font-size: 14px;
							font-style: normal;
							font-weight: 500;
							line-height: normal;
							cursor: default;

							@include themeify {
								color: themed("Text_s");
							}

							&a,
							&a:hover,
							&:hover {
								font-family: "PingFang SC";
								font-size: 14px;
								font-style: normal;
								font-weight: 500;
								line-height: normal;

								@include themeify {
									color: themed("Text_s");
								}
							}
						}
					}
				}
			}
		}
	}

	.seach-plan {
		:deep() {
			.el-form {
				.el-form-item__label {
					display: inline-flex;
					justify-content: flex-end;
					align-items: flex-start;
					flex: 0 0 auto;
					// font-size: var(--el-form-label-font-size);
					// color: var(--el-text-color-regular);
					height: 40px;
					padding: 0 12px 0 0;
					box-sizing: border-box;
					text-align: right;
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					line-height: 40px;

					@include themeify {
						color: themed("Text1");
					}
				}

				.el-form-item {
					margin-bottom: 0px;

					&:last-child {
						margin-right: 0px;
					}
				}
			}
		}
	}
}

.select-radio {
	display: flex;
	height: 100%;
	position: relative;
	padding: 0 13px;
	z-index: 0;
	height: 40px;
	line-height: 40px;
	font-size: 14px;
	font-weight: 400;

	@include themeify {
		color: themed("Text1");
	}

	&.active {
		border-color: #3bc11766;

		@include themeify {
			color: themed("Text_s");
			// background-color: themed('Theme');
		}

		::after {
			content: "";
			position: absolute;
			width: 0.5rem;
			height: 0.5rem;
			border-radius: 50%;
			top: 50%;
			margin-top: -0.25rem;
			right: 0.625rem;
			// background-color: var(--Theme-, #3bc116);
			box-shadow: 0 0 0 0.3125rem #3bc11726;

			@include themeify {
				background-color: themed("Theme");
			}
		}
	}
}

.select-checked {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 12px;

	.label {
		display: flex;
		align-items: center;

		.icon {
			width: 18px;
			height: 18px;
			flex-shrink: 0;
			border: 1px solid;
			// background-color: #2e3035;
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;

			@include themeify {
				border-color: themed("Bg1");
				background-color: themed("Bg3");
			}

			.iconSvg {
				width: 14px;
				height: 14px;
			}
		}

		.text {
			margin: 0 5px;
			max-width: 170px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.tag {
		// color: var(--Theme-, #3bc116);
		text-align: right;
		font-family: "PingFang SC";
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		@include themeify {
			color: themed("Theme");
		}
	}

	&.active {
		.label {
			display: flex;
			align-items: center;

			.icon {
				@include themeify {
					border-color: themed("Theme");
				}

				.iconSvg {
					width: 14px;
					height: 14px;

					@include themeify {
						color: themed("Theme");
					}
				}
			}
		}
	}
}
</style>
