<template>
	<div class="footer1 mt_40">
		<div class="max-width">
			<div class="footer1Item">
				<p class="mb_19">合作商</p>
				<div class="partnersIcon">
					<slide>
						<img v-lazy-load="item.iconFileUrl" alt="" v-for="(item, index) in partnerList" :key="index" />
					</slide>
				</div>
			</div>
			<div class="line"></div>
			<div class="footer1Item">
				<p class="mb_19">支付方式</p>
				<slide class="paymentMethodIcon">
					<img v-lazy-load="item.iconFileUrl" alt="" v-for="(item, index) in vendorList" :key="index" />
				</slide>
			</div>
			<div class="line"></div>
			<div class="footer1Item">
				<p class="mb_19">负责任的游戏</p>
				<div class="responsibleGameIcon">
					<img src="../../../assets/common/responsibleGameIcon/image1.png" alt="" />
					<img src="../../../assets/common/responsibleGameIcon/image2.png" alt="" />
					<img src="../../../assets/common/responsibleGameIcon/image3.png" alt="" />
				</div>
			</div>
		</div>
	</div>

	<div class="footer2">
		<div class="line"></div>
		<div class="max-width">
			<div class="footer2_1">
				<div class="aboutUs footer2_1_item">
					<div>
						<img v-lazy-load="Common.getThemeImgPath('logo2.png')" alt="" style="height: 126px" />
					</div>
					<div class="aboutUs_2">
						<div class="fs_20">关于我们</div>
						<div class="fs_16 Text1">
							<span>关于我们</span>
							<span>帮助中心</span>
							<span>隐私政策</span>
							<span>规则与条款</span>
							<span>联系我们</span>
						</div>
					</div>
				</div>
				<div class="aboutUs_2">
					<div>app下载</div>
					<div class="fs_16 Text1 flex-center">
						<span class="flex-center mr_0" style="gap: 8px">
							<svg-icon name="common-ios" size="18px"></svg-icon>
							IOS下载</span
						>
						<span class="flex-center" style="gap: 8px">
							<svg-icon name="common-andiriod" size="18px"></svg-icon>
							Andiriod下载</span
						>
					</div>
				</div>
			</div>
			<div class="Text1 fs_14 footer2_2">
				<div v-html="helpValue.find((item:any) => item.code == 8)?.valueDetail"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CommonApi } from "/@/api/common";
import Common from "/@/utils/common";
import { helpCenterApi } from "/@/api/helpCenter";
const partnerList: any = ref([]);
const vendorList: any = ref([]);
const helpValue: any = ref([]);
onMounted(() => {
	getlist();
});

const getlist = () => {
	CommonApi.queryPartnerList().then((res) => {
		partnerList.value = res.data || [];
	});
	CommonApi.queryPaymentVendorList().then((res) => {
		vendorList.value = res.data || [];
	});
	helpCenterApi.getHelpCenterConfigList().then((res) => {
		helpValue.value = res.data || [];
	});
};
</script>

<style scoped lang="scss">
.footer1 {
	height: 539px;
	background: var(--Bg);
	color: var(--Text-s);
	padding: 18px 10px;
	background: var(--Bg-1, rgba(228, 235, 242, 1));

	.footer1Item {
		padding: 20px 0 20px;
	}
	.partnersIcon {
		height: 82px;

		:deep(.slider-content) {
			justify-content: space-between;
		}
		img {
			height: 72px;
			pointer-events: none;
			margin-right: 30px;
		}
	}
	.paymentMethodIcon {
		height: 82px;
		img {
			height: 44px;
			width: 44px;
			object-fit: cover;
			border-radius: 50%;
			pointer-events: none;
			margin-right: 69px;
		}
	}
	.responsibleGameIcon {
		display: flex;
		gap: 60px;
		height: 82px;
		align-items: center;
		img {
			height: 56px;
		}
	}
}
.footer2 {
	color: var(--Text-s);
	background: var(--Bg-3, rgba(223, 229, 236, 1));
	height: 237px;
	.footer2_1 {
		display: flex;
		padding: 20px 0 0;
		.footer2_1_item {
			width: 50%;
			> div {
				display: flex;
			}
		}
		.aboutUs_2 {
			display: flex;
			flex-direction: column;
			margin-top: 10px;
			gap: 20px;
			margin-left: 10px;
			span {
				margin-right: 15px;
			}
		}
	}
	.footer2_2 {
		padding: 5px 0 35px 0;
	}
	.aboutUs {
		display: flex;
		img {
			height: 98px;
		}
	}
}
.line {
	background: var(--Line-1);
	height: 1px;
	flex-shrink: 0;
	box-shadow: 0px 1px 0px 0px var(--lineBg);
}
</style>
