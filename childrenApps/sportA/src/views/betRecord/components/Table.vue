<template>
	<div class="container">
		<el-table :data="props.data" border :cell-class-name="'table-cell'" :header-cell-class-name="'table-header-cell'" style="width: 100%">
			<el-table-column type="index" :label="$t(`betRecord['编号']`)" width="80" align="center" :resizable="false"> </el-table-column>

			<el-table-column :label="$t(`betRecord['投注详情']`)" width="258" align="center" :resizable="false">
				<template #default="{ row, column }">
					<template v-if="loading">
						<el-skeleton animated>
							<template #template>
								<el-skeleton-item variant="p" style="width: 50%" />
								<el-skeleton-item variant="p" style="width: 80%" />
							</template>
						</el-skeleton>
					</template>
					<div class="date" v-else>
						<div>{{ formatDateTime(row.transTime) }}</div>
						<div>{{ row.transId }} <img :src="copyImg" alt="" @click="copyText(row.order)" /></div>
					</div>
				</template>
			</el-table-column>

			<el-table-column :label="$t(`betRecord['投注玩法']`)" width="188" align="center" :resizable="false">
				<template #default="{ row, column }">
					<template v-if="loading">
						<el-skeleton animated>
							<template #template>
								<el-skeleton-item variant="p" style="width: 50%" />
								<el-skeleton-item variant="p" style="width: 80%" />
							</template>
						</el-skeleton>
					</template>
					<div class="playingMethod" v-else>
						<div v-if="row.betTypeName">{{ row.betTypeName }}</div>
						<div v-if="row.comboType">{{ row.comboType }}</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column :label="$t(`betRecord['选项']`)" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div class="option">
						<div>[{{ row.sportName }}] 埃及超级联赛</div>
						<div>小1 <span>@1.32</span></div>
						<div>滚球 全场大小 [欧洲盘]</div>
						<div>达克尔野 VS 古纳 (0-0) 05/15 21:00</div>
						<div>下半场 67:02 (0:0)</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column :label="$t(`betRecord['投注额']`)" width="168" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div class="betAmount">
						<span>{{ row.stake }}</span>
						<span v-if="isReturnStake(row.status)">本金已退还</span>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="cashoutPrice" :label="$t(`betRecord['派彩金额']`)" width="168" align="center" :resizable="false"></el-table-column>

			<el-table-column :label="$t(`betRecord['状态']`)" width="188" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div :class="getStatusTextClass(row.status)">{{ computedStatusLabel[row.status] }}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import copyImg from "/@/assets/zh/default/wallet/copy.png";
import { SportStatusEnum } from "/@/enum/sportEnum/sportEnum";
import sportsMap from "/@/utils/sports/sportsMap/sportsMap";

const props = withDefaults(
	defineProps<{
		data: [];
		loading: boolean;
	}>(),
	{}
);

const i18n = useI18n();

const computedStatusLabel = computed(() => {
	return {
		[SportStatusEnum.HalfWon]: "半赢",
		[SportStatusEnum.HalfLose]: "半输",
		[SportStatusEnum.Won]: "赢",
		[SportStatusEnum.Lose]: "输",
		[SportStatusEnum.Void]: "作废",
		[SportStatusEnum.Running]: "进行中",
		[SportStatusEnum.Draw]: "和局",
		[SportStatusEnum.Reject]: "已取消",
		[SportStatusEnum.Refund]: "退款",
		[SportStatusEnum.Waiting]: "等待中",
	};
});

/**
 * 跟进状态判断文本颜色
 * @param status
 */
const getStatusTextClass = (status: SportStatusEnum) => {
	if ([SportStatusEnum.HalfWon, SportStatusEnum.Won, SportStatusEnum.Running].includes(status)) {
		return "success";
	}
	if ([SportStatusEnum.HalfLose, SportStatusEnum.Lose].includes(status)) {
		return "fail";
	}

	if (isReturnStake(status)) {
		return "cancel";
	}

	return "";
};

/**
 * 判断是否显示退还本金
 */
const isReturnStake = (status: SportStatusEnum) => {
	const returnStakeList = [SportStatusEnum.Void, SportStatusEnum.Reject, SportStatusEnum.Refund];
	return returnStakeList.includes(status);
};

/**
 * @description 拷贝 text 到剪切板
 * @param text 要拷贝的文本
 */
async function copyText(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		console.log("Text copied to clipboard");
	} catch (err) {
		console.error("Failed to copy: ", err);
	}
}

/**
 * @description 格式化日期时间
 * @param dateTimeStr 要格式化的日期字符串或日期对象
 */
function formatDateTime(dateTimeStr: Date | string): string {
	// 将传入的日期字符串转换为 Date 对象
	const date = new Date(dateTimeStr);

	// 获取年份、月份、日期、小时、分钟和秒数
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	// 构建目标格式的日期时间字符串
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped lang="scss">
.success {
	@include themeify {
		color: themed("Theme");
	}
}

.fail {
	@include themeify {
		color: themed("Warn");
	}
}

.cancel {
	@include themeify {
		color: themed("Text1");
	}
}

.betAmount {
	display: flex;
	flex-direction: column;
	gap: 5px;

	& > span:last-child {
		@include themeify {
			color: themed("Warn");
		}
	}
}

.option {
	padding: 20px;
	display: flex;
	align-items: start;
	flex-direction: column;
	gap: 4px;

	& > div:first-child {
		@include themeify {
			color: themed("Text_s");
		}
	}

	& > div:nth-of-type(2) {
		@include themeify {
			color: themed("Text_s");
		}

		span {
			@include themeify {
				color: themed("Theme");
			}
		}
	}
}

.date {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 10px;

	div {
		display: flex;
		align-items: center;
		gap: 7px;

		img {
			cursor: pointer;
		}
	}
}

.playingMethod {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 10px;
}

.container {
	:deep(.el-table) {
		border-radius: 4px 4px 0px 0px;
		background-color: transparent;

		.table-header-cell {
			height: 44px;
			min-height: 44px;
			@include themeify {
				border-right-color: themed("Bg4");
				border-bottom-color: themed("Bg3");
				color: themed("Text1");
			}
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}

		.table-cell {
			height: 44px;
			min-height: 44px;
			@include themeify {
				border-color: themed("Bg3");
				color: themed("Text1");
			}
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}

		th.el-table__cell {
			@include themeify {
				background-color: themed("Bg3");
			}
		}

		tr {
			background-color: transparent;
		}

		.el-table__row:hover {
			.el-table__cell {
				background-color: transparent;
			}
		}

		.el-table__inner-wrapper::after,
		.el-table__inner-wrapper::before,
		.el-table__border-left-patch {
			@include themeify {
				background-color: themed("Bg3");
			}
		}
	}

	:deep(.el-table--border::after),
	:deep(.el-table--border::before) {
		@include themeify {
			background-color: themed("Bg3");
		}
	}
}

.Success {
	@include themeify {
		color: themed("Theme");
	}
}

.Warning {
	@include themeify {
		color: themed("f1");
	}
}

.Danger {
	@include themeify {
		color: themed("Warn");
	}
}
</style>
