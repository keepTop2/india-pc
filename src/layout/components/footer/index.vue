<template>
	<div
		class="footer1"
		:style="{
			backgroundImage: `url(${Common.getCommonImgPath('footer1.png')})`,
		}"
	>
		<div class="max-width">
			<div class="footer1Item">
				<p class="mb_19">合作商</p>
				<div class="partnersIcon">
					<img src="../../../assets/common/partnersIcon/image1.png" alt="" />
					<img src="../../../assets/common/partnersIcon/image2.png" alt="" />
				</div>
			</div>
			<div class="line"></div>
			<div class="footer1Item">
				<p class="mb_19">支付方式</p>
				<div class="paymentMethodIcon">
					<img src="../../../assets/common/paymentMethodIcon/image1.png" alt="" />
					<img src="../../../assets/common/paymentMethodIcon/image2.png" alt="" />
				</div>
			</div>
			<div class="line"></div>
			<div class="footer1Item">
				<p class="mb_19">负责任的游戏</p>
				<div class="responsibleGameIcon">
					<img src="../../../assets/common/responsibleGameIcon/image1.png" alt="" />
					<img src="../../../assets/common/responsibleGameIcon/image2.png" alt="" />
				</div>
			</div>
		</div>
	</div>
	<div
		class="footer2"
		:style="{
			backgroundImage: `url(${Common.getCommonImgPath('footer2.png')})`,
		}"
	>
		<div class="max-width">
			<div class="footer2_1">
				<div class="aboutUs footer2_1_item">
					<div>
						<img :src="Common.getCommonImgPath('logo2.png')" alt="" />
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
					<div class="fs_16 Text1">
						<span>IOS下载</span>
						<span>Andiriod下载</span>
					</div>
				</div>
			</div>
			<div class="Text1 fs_14 footer2_2">
				OKSPORT 由 Medium Rare N.V. 所属和经营，注册编号： 145353，注册地址： Korporaalweg 10, Willemstad, Curaçao。请通过 support@stake.com 与我们联系。 支付代理公司是 Medium Rare
				Limited，地址于 7-9 Riga Feraiou, LIZANTIA COURT, Office 310, Agioi Omologites, 1087 Nicosia, Cyprus 以及注册号：HE 410775
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
</script>

<style scoped lang="scss">
.footer1 {
	height: 544px;
	background: var(--Bg2) 0% 0% / 15px 15px repeat;
	filter: drop-shadow(0px 1px 0px var(--Bg2));
	color: var(--Text_s);
	padding: 18px 10px;
	.footer1Item {
		padding: 20px 0 20px;
	}
	.partnersIcon {
		display: flex;
		gap: 40px;
		height: 82px;
		img {
			height: 72px;
		}
	}
	.paymentMethodIcon {
		display: flex;
		gap: 40px;
		height: 82px;
		align-items: center;
		img {
			height: 44px;
		}
	}
	.responsibleGameIcon {
		display: flex;
		gap: 40px;
		height: 82px;
		align-items: center;
		img {
			height: 56px;
		}
	}
}
.footer2 {
	height: 237px;
	background: #21232a 0% 0% / 15px 15px repeat;
	filter: drop-shadow(0px 1px 0px var(--Bg2));
	color: var(--Text_s);
	padding: 35px 10px;
	.footer2_1 {
		display: flex;
		.footer2_1_item {
			width: 50%;
			> div {
				display: flex;
			}
		}
		.aboutUs_2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 20px;
			margin-left: 50px;
			span {
				margin-right: 15px;
			}
		}
	}
	.footer2_2 {
		padding: 35px 0;
	}
	.aboutUs {
		display: flex;
		img {
			height: 98px;
		}
	}
}
.line {
	height: 1px;
	width: 100%;
	background: var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;
}
</style>
