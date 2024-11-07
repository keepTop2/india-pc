<template>
	<div class="form">
		<template v-for="field in inputFields">
			<div v-if="field.code === 'networkType' && isFieldVisible(field.code as keyof formParamsRootObject)" class="cell disabled_cell">
				<div class="disabled_label">{{ withdrawWayData.networkType }}</div>
			</div>
			<!-- <div  class="cell">
				<input v-model="formParams[field.model  as keyof formParamsRootObject]" :type="field.type" :placeholder="$t(`wallet['${field.placeholder}']`)" name="" id="" />
			</div> -->
			<!-- 网络地址 -->
			<template v-if="!['networkType'].includes(field.code) && isFieldVisible(field.code as keyof formParamsRootObject)">
				<DropDown
					:options="withdrawWayConfig.lastWithdrawInfoVO.addressNo && !formParams['addressNo'] ? [withdrawWayConfig.lastWithdrawInfoVO] : []"
					v-model="formParams['addressNo']"
					:searchInput="false"
					label="addressNo"
					value="addressNo"
					@change="onChangeLastInfo"
				>
					<template #toggle="{ toggleDropdown }">
						<div class="cell">
							<input v-model="formParams['addressNo']" :type="field.type" :placeholder="$t(`wallet['${field.placeholder}']`)" @focus="toggleDropdown" />
						</div>
					</template>
					<template #option="{ option }">
						<div class="custom-option">
							<svg-icon class="icon" name="wallet-last" />
							<span class="label"> {{ option.addressNo }} </span>
						</div>
					</template>
				</DropDown>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps({
	withdrawWayData: {
		type: Object,
		default: {},
	},
	withdrawWayConfig: {
		type: Object,
		default: {},
	},
});

interface formParamsRootObject {
	networkType: string;
	addressNo: string;
}

watch(
	() => props.withdrawWayData.networkType,
	(newValue) => {
		formParams.networkType = newValue;
	}
);

const formParams = reactive(<formParamsRootObject>{
	networkType: props.withdrawWayData.networkType, // 网络协议
	addressNo: "", // 加密货币收款地址
});

// 输入字段的映射数组
const inputFields = [
	{ code: "networkType", model: "networkType", type: "text", placeholder: "" },
	{ code: "addressNo", model: "addressNo", type: "text", placeholder: "请输入地址" },
];

// 检查字段是否可见的函数
const isFieldVisible = (code: keyof formParamsRootObject) => {
	return (
		props.withdrawWayConfig.collectInfoVOS &&
		Array.isArray(props.withdrawWayConfig.collectInfoVOS) &&
		props.withdrawWayConfig.collectInfoVOS.some((item) => item.filedCode === code)
	);
};

const onChangeLastInfo = (e: any) => {
	Object.assign(formParams, e);
};

// 清空表单参数
const clearParams = () => {
	Object.keys(formParams).forEach((key) => {
		if (!["networkType"].includes(key)) {
			formParams[key] = "";
		}
	});
};

// 暴露变量和方法
defineExpose({
	formParams,
	inputFields,
	clearParams,
});
</script>

<style scoped lang="scss">
@import url("../formScss.scss");

:deep(.custom-option) {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	gap: 10px;
	.icon {
		width: 14px;
		height: 14px;
		display: flex;
		img {
			width: 100%;
			height: 100%;
		}
	}

	.label,
	.value {
		color: var(--Text2_1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}

	.label {
		flex: 1;
	}

	&:hover {
		.label,
		.value {
			color: var(--Text_s);
		}
	}
}
</style>
