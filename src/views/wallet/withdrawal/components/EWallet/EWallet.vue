<template>
	<div class="form">
		<template v-for="field in inputFields">
			<div class="cell" v-if="!['userPhone'].includes(field.code) && isFieldVisible(field.code as keyof formParamsRootObject)">
				<input v-model="formParams[field.model  as keyof formParamsRootObject]" :type="field.type" :placeholder="$t(`wallet['${field.placeholder}']`)" name="" id="" />
			</div>
			<!-- 手机号 -->
			<template v-if="field.code == 'userPhone' && isFieldVisible(field.code as keyof formParamsRootObject)">
				<DropDown :options="areaCodeList" v-model="formParams['areaCode']" v-model:searchValue="searchInput" label="countryName" value="areaCode" @change="onChangeAreaCode">
					<template #toggle="{ toggleDropdown }">
						<div class="cell phone" :class="{ error: field.code === 'userPhone' && !isPhoneValid && formParams['userPhone'] }">
							<div class="area_code" @click="toggleDropdown">
								<span class="value">+{{ formParams["areaCode"] }}</span>
								<svg-icon class="icon" name="arrow_down" />
							</div>
							<input v-model="formParams[field.model as keyof formParamsRootObject]" :type="field.type" :placeholder="$t(`wallet['${field.placeholder}']`)" name="" id="" />
						</div>
						<div v-if="field.code === 'userPhone' && !isPhoneValid && formParams['userPhone']" class="error_input_text">
							{{ $t(`wallet['请输入位数字']`, { min: areaCodeInfo.minLength, max: areaCodeInfo.maxLength }) }}
						</div>
					</template>
					<template #option="{ option }">
						<div class="custom-option">
							<div class="icon">
								<img :src="option.icon" alt="" />
							</div>
							<span class="label">
								<span>{{ option.countryCode }}</span>
								<span>&nbsp;</span>
								<span>{{ option.countryName }}</span>
							</span>
							<div class="value">+{{ option.areaCode }}</div>
						</div>
					</template>
				</DropDown>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { CommonApi } from "/@/api/common";
import Common from "/@/utils/common";

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

interface areaCodeListRootObject {
	areaCode: string;
	countryName: string;
	countryCode: string;
	icon: string;
	maxLength: number;
	minLength: number;
}

interface formParamsRootObject {
	userAccount: string;
	userPhone: string;
	userName: string;
	surname: string;
	areaCode: string;
}

const searchInput = ref("");
const areaCodeList = ref([] as areaCodeListRootObject[]);
const areaCodeInfo = ref({} as areaCodeListRootObject);
const formParams = reactive(<formParamsRootObject>{
	userAccount: "",
	userPhone: "",
	userName: "",
	surname: "",
	areaCode: "",
});

// 输入字段的映射数组
const inputFields = [
	{ code: "userAccount", model: "userAccount", type: "text", placeholder: "请输入账号" },
	{ code: "userPhone", model: "userPhone", type: "text", placeholder: "请输入手机号" },
	{ code: "userName", model: "userName", type: "text", placeholder: "请输入取款人名" },
	{ code: "surname", model: "surname", type: "text", placeholder: "请输入取款人姓" },
];

onMounted(() => {
	getAreaCodeDownBox();
});

// 手机号正则验证
const isPhoneValid = computed(() => new RegExp(`^\\d{${areaCodeInfo.value.minLength},${areaCodeInfo.value.maxLength}}$`).test(formParams["userPhone"]));

// 检查字段是否可见的函数
const isFieldVisible = (code: keyof formParamsRootObject) => {
	return (
		props.withdrawWayConfig.collectInfoVOS &&
		Array.isArray(props.withdrawWayConfig.collectInfoVOS) &&
		props.withdrawWayConfig.collectInfoVOS.some((item) => item.filedCode === code)
	);
};

// 获取区号下拉框数据的函数
const getAreaCodeDownBox = () => {
	CommonApi.getAreaCodeDownBox().then((res: any) => {
		if (res.code == Common.ResCode.SUCCESS) {
			areaCodeList.value = res.data;
			areaCodeInfo.value = res.data[0];
			formParams["areaCode"] = areaCodeInfo.value.areaCode;
		}
	});
};

const onChangeAreaCode = (e: any) => {
	console.log("选择的手机区号信息", e);
};

// 清空表单参数
const clearParams = () => {
	Object.keys(formParams).forEach((key) => {
		formParams[key] = "";
	});
};

// 暴露变量和方法
defineExpose({
	formParams,
	isPhoneValid,
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
