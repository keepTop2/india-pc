<template>
	<div>
		<div class="header">
			<div class="title fs_24 Text_s mb_3">投注记录</div>
			<div class="line"></div>
			<div class="form flex_space-between mt_20 fs_12">
				<div class="flex-center">
					<div class="time formItem pl_14 pr_14" @click="showDatePicker = true" style="position: relative">
						<div class="flex_space-between curp">
							<span>{{ dayjs(range.start).format("YYYY/MM/DD") }} - {{ dayjs(range.end).format("YYYY/MM/DD") }}</span>
							<svg-icon name="arrow_down" width="12px" height="8px"></svg-icon>
						</div>
						<DatePicker :range="range" v-model="showDatePicker" :minDate="minDate" :maxDate="maxDate" @updateRange="updateRange" />
					</div>
					<div class="formItem"><Dropdown :options="welfareCenterRewardTypeOptions" v-model="params.welfareCenterRewardType"></Dropdown></div>
					<div class="formItem"><Dropdown :options="activityReceiveStatusOptions" v-model="params.receiveStatus"></Dropdown></div>
				</div>
				<div class="flex-center">
					<div class="btn curp" @click="handleQuery"><svg-icon name="search_on" size="14px"></svg-icon> 查询</div>
				</div>
			</div>
		</div>
		<div class="content">
			<div>
				<div class="flex_space-between Text_s fs_14 mb_12">
					<div>
						<span>
							<span>共计: </span>
							{{ pageData.waitReceiveTotal || 0 }}
						</span>
						<span class="ml_20">
							<span>投注金额：</span>
							{{ pageData.mainCurrencyTotal || 0 }} {{ pageData.mainCurrency }}
						</span>
						<span class="ml_20">
							<span>输赢金额：</span>
							<span class="loseOrWin_color">{{ pageData.platCurrencyTotal || 0 }} {{ pageData.platCurrencyCode }}</span>
						</span>
					</div>
					<div class="flex-center">
						<img src="./image/fudai.png" alt="" width="20px" />
						您有4个待领取福利
					</div>
				</div>


				<el-table class="table-style-expand" :data="tableData"  style="width: 100%" border>

					<template  v-for="(item,index) in tableColumns"  :key="index" >
						<el-table-column type="expand" :label="item.label" width="164px" :prop="item.props" v-if="item.type == 'select'">
								<template #default="props">
									<div class="dropDown_line">
										<div class="firLine">
										<div style="width:50%" class="fir_item">{{ props.row.eventInfo }}</div>
										<div style="width:25%" class="fir_item">投注内容</div>
										<div style="width:25%" class="fir_item">赔率</div>
										<div style="width:50%;" class="fir_item">{{  props.row.teamInfo}}</div>
										<div style="width:25%" class="fir_item">{{  props.row.betContent}}</div>
										<div style="width:25%" class="fir_item">{{  props.row.odds}}</div>
									</div>
									<div class="winlogo">
										<img :src="props.row.orderClassify == '1'?winlogo:loselogo" alt="">
									</div>
									</div>
								</template>
						</el-table-column>
						<el-table-column v-else :label="item.label" :prop="item.props" />
					</template>
				</el-table>
			</div>
			<div class="flex-center Pagination" v-if="tableData.length">
				<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="pageData.totalSize" @sizeChange="sizeChange" @pageChange="pageQuery" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref ,watch} from "vue";
import { welfareCenterApi } from "/@/api/welfareCenter";
import dayjs from "dayjs";
import showToast from "/@/hooks/useToast";
import colmuns, { columnsType, columnType } from './bettingRecordsColumns';
import loselogo from '/@/assets/zh-CN/wallet/loselogo.png';
import winlogo from '/@/assets/zh-CN/wallet/winlogo.png';

const showDatePicker = ref(false);
const tableColumns = ref<columnType[]>([])
const colmunsrow = ref<columnsType>(colmuns)
const params = reactive({
	betStartTime: new Date("2024-09-08 00:00:00").getTime(),
	betEndTime: new Date("2024-12-08 00:00:00").getTime(),
	pageNumber: 1,
	pageSize: 10,
	receiveStatus: "-1",
	welfareCenterRewardType: "1",
	venueType:'1'
});
const today = dayjs();
const range = reactive({
	start: new Date(today.subtract(90, "day").format("YYYY/MM/DD")),
	end: new Date(today.add(0, "day").format("YYYY/MM/DD")),
});
const minDate = today.subtract(180, "day").format("YYYY/MM/DD");
const maxDate = today.add(0, "day").format("YYYY/MM/DD");

const activityReceiveStatusOptions: any = ref([]);
const welfareCenterRewardTypeOptions = ref<{text:string,value:string}[]>([]);
const tableData: any = ref([]);
const pageData = reactive({
	totalSize: "",
	waitReceiveTotal: "",
	platCurrencyTotal: "",
	platCurrencyCode: "",
	mainCurrency: "",
	mainCurrencyTotal: "",
});
const total = ref(0);
const updateRange = (value:any) => {
	range.start = value[0];
	range.end = value[1];
};

const type = ref("1");
onMounted(() => {
	getDownBox();
	pageQuery();
});
const pageQuery = () => {
	params.betStartTime = new Date(range.start).getTime();
	params.betEndTime = new Date(range.end).getTime();
	welfareCenterApi.tzPageQuery(params).then((res) => {
		if(!res.data) return 
		tableData.value =res.data.sabOrderList
		pageData.totalSize = res.data.totalSize;
		pageData.waitReceiveTotal = res.data.waitReceiveTotal;
		pageData.platCurrencyTotal = res.data.platCurrencyTotal;
		pageData.platCurrencyCode = res.data.platCurrencyCode;
		pageData.mainCurrency = res.data.mainCurrency;
		pageData.mainCurrencyTotal = res.data.mainCurrencyTotal;
	});
};
// 获取 查询目录
const getDownBox = () => {
	const params = ["order_status_client","order_date_num","venue_type"]
	welfareCenterApi.requestGetTypeList(params).then((res) => {

		welfareCenterRewardTypeOptions.value = res.data.venue_type.map((item:any) => {
			return { text: item.value, value: item.code };
		});

		activityReceiveStatusOptions.value = res.data.order_status_client.map((item:any) => {
			return { text: item.value, value: item.code };
		});
		activityReceiveStatusOptions.value.unshift({
			text: "全部状态",
			value: "-1",
		});
		
	});
};

watch([()=> params.welfareCenterRewardType,()=>welfareCenterRewardTypeOptions.value], (val) => {
	let selectCurrent = welfareCenterRewardTypeOptions.value.find((item: any) => item.value == val[0])
	
	if (!selectCurrent || !selectCurrent.text) return 
	console.log(val,selectCurrent,'selectCurrent')

	tableColumns.value = colmunsrow.value[selectCurrent.text]
	
})

const sizeChange = (pageSize: number) => {
	params.pageNumber = 1;
	params.pageSize = pageSize;
	pageQuery();
};
const handleReceive = (item: any) => {
	const params = {
		id: item.id,
		welfareCenterRewardType: item.welfareCenterRewardType,
	};
	welfareCenterApi.clickReceive(params).then((res) => {
		if (res.code === 10000) {
			pageQuery();
		}
	});
};

const headerStyle = ({ row, column, rowIndex, columnIndex }:any)=>{
	if (rowIndex == 0) {
		row[0].colSpan = 2;
		row[3].rowSpan = 2;
	}
}
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: any) => {
  if (columnIndex === 0) {
    if (rowIndex  === 0) {
      return {
        rowspan: 1,
        colspan: 2,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}
const handleQuery = () => {
	params.pageNumber = 1;
	pageQuery();
};
</script>

<style scoped lang="scss">
.header {
	background: var(--Bg1);
	border-radius: 12px;
	padding: 20px;
	.title {
		position: relative;
	}
	.title::before {
		content: "";
		position: absolute;
		top: 50%;
		left: -20px;
		width: 4px;
		height: 26px;
		transform: translateY(-50%);
		background: var(--Theme);
		border-radius: 0 12px 12px 0;
	}
	.line {
		height: 1px;
		background: var(--Line_1);
		box-shadow: 0px 1px 0px 0px #343d48;
	}
	.btn {
		background: var(--Theme);
		padding: 6px 20px;
		border-radius: 6px;
		color: var(--Text_a);
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.formItem {
		height: 34px;
		background: var(--Bg2);
		color: var(--Text_s);
		line-height: 34px;
		min-width: 140px;
	}
	.time {
		width: 268px;
	}
}
.content {
	min-height: calc(100vh - 260px);
	margin-top: 20px;
	background: var(--Bg1);
	border-radius: 12px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.loseOrWin_color{
		color: var(--light-ok-success--, #3BC116);
	}
	.table {
		border: 1px solid var(--Line_2);
		border-radius: 8px;
	}
	.tr {
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid var(--Line_2);
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		.td {
			text-align: center;
			width: 100%;
			border-right: 1px solid var(--Line_2);
		}
		.td:last-child {
			border-right: none;
		}
		.btn {
			border-radius: 4px;
			padding: 6px 17px;
			font-size: 12px;
		}
		.status0 {
			background: var(--Theme);
			color: var(--Text_a);
		}
		.status1 {
			background: var(--Line_2);
			color: var(--Success);
		}
		.status2 {
			color: var(--Text2);
		}
	}
	.tr:last-child {
		border-bottom: none;
	}
	.theader {
		height: 42px;
		background: var(--Bg2);
		border-radius: 8px 8px 0 0;
		line-height: 42px;
		color: var(--Text_s);
	}
	.Pagination {
		margin-top: 12px;
	}
}
.dropdown_row{
	display: flex;
	align-items: center;
}
.dropDown_line{
	display: flex;
	align-items: center;
	.firLine{
		width: 80%;
		display: flex;
		flex-wrap: wrap;
		.fir_item{
			padding: 6px 12px 8px;
		}
	}
	.winlogo{
		width:20%
	}

}
</style>
