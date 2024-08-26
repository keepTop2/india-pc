<!--
 * @Author: Relax
 * @Description: 促销活动-活动详情
-->
<template>
	<div class="discount_container">
		<img :src="activityParticulars12" alt="" />
		<div class="title_container">圣诞老人的礼物喜悦</div>
		<div class="img_container">
			<div class="text_container">
				<SvgIcon class="svgicon" iconName="particulars_left" />
				<div class="title">{{ $t(`menu.specialOffer.activityParticulars['活动内容']`) }}</div>
				<SvgIcon class="svgicon" iconName="particulars_right" />
			</div>
			<div class="date">
				<div class="deadline">{{ $t(`menu.specialOffer.activityParticulars['活动时间']`) }}<span>2023-12-12
						00:00:00～2023-12-31 23:59:59</span></div>
				<div class="activity_name">{{ $t(`menu.specialOffer.activityParticulars['活动对象']`) }}<span>全体会员</span></div>
			</div>
		</div>
		<div class="img_container">
			<div class="text_container">
				<SvgIcon class="svgicon" iconName="particulars_left" />
				<div class="title">{{ $t(`menu.specialOffer.activityParticulars['活动详情']`) }}</div>
				<SvgIcon class="svgicon" iconName="particulars_right" />
			</div>
			<div class="date">
				<div class="deadline">{{ $t(`menu.specialOffer.activityParticulars['活动时间']`) }}<span>2023-12-12
						00:00:00～2023-12-31 23:59:59</span></div>
				<div class="activity_name">{{ $t(`menu.specialOffer.activityParticulars['活动对象']`) }}<span>全体会员</span></div>
			</div>
			<img :src="activityParticulars13" alt="" />
			<div class="copyWriter">
				<p>
					活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活
					活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案。活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活
					活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案。
				</p>
			</div>
			<img :src="activityParticulars13" alt="" />
			<div class="copyWriter">
				<p>
					活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活
					活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案。活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活
					活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案活动详情文案。
				</p>
			</div>
		</div>

		<div class="img_container">
			<div class="text_container">
				<SvgIcon class="svgicon" iconName="particulars_left" />
				<div class="title">{{ $t(`menu.specialOffer.activityParticulars['活动规则']`) }}</div>
				<SvgIcon class="svgicon" iconName="particulars_right" />
			</div>
			<div class="date">
				<div class="deadline">{{ $t(`menu.specialOffer.activityParticulars['活动时间']`) }}<span>2023-12-12
						00:00:00～2023-12-31 23:59:59</span></div>
				<div class="activity_name">{{ $t(`menu.specialOffer.activityParticulars['活动对象']`) }}<span>全体会员</span></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import activityParticulars12 from '/@/assets/zh/default/menu/specialOffer/activityParticulars12.png';
import activityParticulars13 from '/@/assets/zh/default/menu/specialOffer/activityParticulars13.png';
</script>

<style lang="scss" scoped>
.discount_container {
	margin-top: 30px;
	width: 1200px;
	border-radius: 20px;

	@include themeify {
		background: themed('Bg1');
	}

	.title_container {
		margin: 32px 0;

		@include themeify {
			color: themed('Text_s');
		}

		font-family: 'PingFang SC';
		font-size: 30px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		text-transform: uppercase;
		text-align: center;
	}

	.img_container {
		padding: 28px;
		margin: 0 40px 20px 40px;
		border-radius: 10px;

		@include themeify {
			background: themed('Bg2');
		}

		.text_container {
			display: flex;
			justify-content: center;
			align-items: center;

			.title {
				@include themeify {
					color: themed('Text_s');
				}

				font-family: 'PingFang SC';
				font-size: 26px;
				font-style: normal;
				font-weight: 600;
				line-height: normal;
				text-transform: uppercase;
				margin: 0 30px;
			}
		}

		.date {
			margin: 17px 0 8px 0;

			@include themeify {
				color: themed('Text1');
			}

			font-family: 'PingFang SC';
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			text-transform: uppercase;

			span {
				@include themeify {
					color: themed('Text_s');
				}

				font-family: 'PingFang SC';
				font-size: 16px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				text-transform: uppercase;
			}

			.activity_name {
				margin-top: 6px;
			}
		}

		.copyWriter {
			margin: 17px 0;

			@include themeify {
				color: themed('Text_s');
			}

			font-family: 'PingFang SC';
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			text-transform: uppercase;
		}
	}

	img {
		-webkit-user-drag: none;
	}
}

.svgicon {
	width: 234px;
	height: 10px;
}
</style>
