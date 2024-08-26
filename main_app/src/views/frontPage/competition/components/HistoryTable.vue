<template>
	<div class="table">
		<el-table :data="props.rankingList" max-height="712px">
			<el-table-column :label="$t(`competition['排名']`)" align="left">
				<template #default="{ row, $index }">
					<img v-if="$index + 1 === 1" :src="jinpai_bs_icon" alt="" />
					<img v-else-if="$index + 1 === 2" :src="yinpai_bs_icon" alt="" />
					<img v-else-if="$index + 1 === 3" :src="tongpai_bs_icon" alt="" />
					<span v-else class="rank">{{ $index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t(`competition['玩家']`)" prop="name" align="center">
				<template #default="{ row }">
					<div class="player">
						<Avatar :size="18" />
						<span>$ {{ row.name }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column :label="$t(`competition['赌注']`)" prop="wager" align="center">
				<template #default="{ row }">
					<span class="theme">$ {{ row.wager }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t(`competition['奖金']`)" prop="bonus" align="right">
				<template #default="{ row }">
					<span class="theme">$ {{ row.bonus }}</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { Avatar } from "/@/components/User";
import jinpai_bs_icon from "/@/assets/zh/default/competition/jinpai_bs_icon.png";
import yinpai_bs_icon from "/@/assets/zh/default/competition/yinpai_bs_icon.png";
import tongpai_bs_icon from "/@/assets/zh/default/competition/tongpai_bs_icon.png";

const props = defineProps<{
	rankingList: { name: string; wager: string; bonus: string }[];
}>();
</script>

<style scoped lang="scss">
.table {
	:deep() {
		.el-table td.el-table__cell,
		.el-table th.el-table__cell.is-leaf {
			border: none;
		}

		.el-table tr {
			@include themeify {
				background: themed("Bg1");

				&:hover {
					.el-table__cell {
						background: themed("Bg3");
					}
				}
			}
		}

		.el-table thead {
			@include themeify {
				color: themed("Text1");
			}
		}

		.el-table .cell {
			font-weight: normal;
		}

		.el-table th.el-table__cell {
			@include themeify {
				background: themed("Bg1");
			}
		}

		.el-table__inner-wrapper {
			&::before {
				display: none;
			}
		}

		td .cell {
			@include themeify {
				color: themed("Text1");
			}
		}
	}

	.theme {
		@include themeify {
			color: themed("Theme") !important;
		}
	}
}

.rank {
	display: inline-block;
	width: 30px;
	text-align: center;
}

.player {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
}
</style>
