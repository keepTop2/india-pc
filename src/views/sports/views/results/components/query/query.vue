<!--
 * @Description: 查询 toolbar
-->

<template>
	<div class="query">
		<!--条件-->
		<div class="condition">
			<!--球种-->
			<Select :options="ballOptions" v-model="queryForm.ballType" />
			<!--日期-->
			<el-date-picker :clearable="false" class="date-picker" v-model="queryForm.date" type="daterange" start-placeholder="Start Date" end-placeholder="End Date" />
			<!--联赛-->
			<el-input v-model="queryForm.league" :placeholder="$t(`results['搜索联赛']`)">
				<template #prefix>
					<SvgIcon iconName="search" :size="18" />
				</template>
			</el-input>
			<!--赛事-->
			<el-input v-model="queryForm.competition" :placeholder="$t(`results['搜索赛事']`)">
				<template #prefix>
					<SvgIcon iconName="search" :size="18" />
				</template>
			</el-input>
			<!--滚球-->
			<el-checkbox v-model="queryForm.isLive">{{ $t(`results['滚球']`) }}</el-checkbox>
		</div>
		<!--查询-->
		<el-button class="query-button" :icon="loading ? 'loading' : 'search'" @click="handleSearch" :disabled="loading">{{ $t(`results['搜索']`) }}</el-button>
	</div>
</template>

<script setup lang="ts">
import { Select } from "/@/components/Select";
import { QueryFormType, QueryOptionItemType } from "/@/models/sportResultModel";

type Props = {
	queryForm: QueryFormType;
	ballOptions: QueryOptionItemType[];
	loading: boolean;
};

const props = defineProps<Props>();

const emits = defineEmits(["search", "updateQueryForm"]);

const handleSearch = () => {
	emits("search");
};
</script>

<style scoped lang="scss">
.query {
	margin: 14px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.condition {
		display: flex;
		gap: 16px;
		align-items: center;

		& > * {
			flex-shrink: 0;
		}

		:deep {
			.el-input,
			.select-date {
				width: 240px;
				height: 44px;
			}

			.el-input__wrapper {
				box-shadow: none;
				@include themeify {
					background: themed("Bg1");
				}

				input {
					@include themeify {
						color: themed("Text2_1");
					}

					&::placeholder {
						@include themeify {
							color: themed("Text2_1");
						}
					}
				}
			}

			.el-checkbox__inner {
				@include themeify {
					background-color: themed("Bg");
					border-color: themed("Theme");
				}
			}

			.el-checkbox__label {
				@include themeify {
					color: themed("Text1");
				}
			}

			.el-checkbox__input.is-checked + .el-checkbox__label {
				@include themeify {
					color: themed("Theme");
				}
			}

			.date-picker {
				height: 44px;
				width: 240px;
				box-sizing: border-box;
			}
		}
	}

	.query-button {
		width: 78px;
		height: 32px;

		&.is-disabled {
			:deep(.el-icon) {
				animation: rotate 1.5s linear infinite;
			}
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}

		25% {
			transform: rotate(90deg);
		}

		50% {
			transform: rotate(180deg);
		}

		75% {
			transform: rotate(270deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
}
</style>
