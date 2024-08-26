<template>
	<div class="sportCard">
		<div class="main">
			<div class="image-plan">
				<div class="image">
					<el-image :src="activeImg">
						<template #placeholder>
							<img :src="activeImg" alt="" />
						</template>
					</el-image>
				</div>
			</div>
			<div class="right-plan">
				<div class="text-area">
					<div class="textItem">
						<h3>崭新玩法 感受精彩</h3>
						<p>丰富的体育赛事一应俱全，项目玩法多元，下半场波胆、让球崭新玩法，感受不一样的精彩</p>
					</div>
					<div class="textItem">
						<h3>崭新玩法 感受精彩</h3>
						<p>创新功能提前兑现，无需等待即可提前结算，止损机制让您百无禁忌</p>
					</div>
				</div>
				<div class="menu-btn">
					<div class="btn-item" v-for="(item, index) in btnList" :class="item.active ? 'active' : ''" :key="index" @click="menuClick(item)">
						<div class="icon">
							<span>{{ item.icon }}</span>
						</div>
						<div class="text">{{ item.name }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

import imgOne from '/@/assets/zh/default/menu/lottery/Component1.png';
import imgTwo from '/@/assets/zh/default/menu/lottery/Component2.png';
import imgThree from '/@/assets/zh/default/menu/lottery/Component3.png';
import imgFour from '/@/assets/zh/default/menu/lottery/Component4.png';

const btnList = ref([
	{
		icon: 'L',
		name: '王牌彩票',
		tab: 1,
		active: true,
		imgUrl: imgOne,
	},
	{
		icon: 'L',
		name: 'DB彩票',
		tab: 2,
		active: false,
		imgUrl: imgTwo,
	},
	{
		icon: 'B',
		name: '场馆名称3',
		tab: 3,
		active: false,
		imgUrl: imgThree,
	},
]);

const activeImg = ref(imgOne);

const menuClick = (menu?: any) => {
	btnList.value.forEach((item) => {
		if (item.tab == menu.tab) {
			item.active = true;
			activeImg.value = item.imgUrl;
		} else {
			item.active = false;
		}
	});
};
</script>

<style lang="scss" scoped>
.sportCard {
	padding: 28px 0 60px 0px;
	.main {
		width: 1200px;
		height: 560px;
		flex-shrink: 0;
		border-radius: 20px;
		@include themeify {
			background-color: themed('Bg1');
		}
		display: flex;
		align-items: center;
		.image-plan {
			width: 570px;
			height: 100%;
			box-sizing: border-box;
			.image {
				width: 424px;
				height: 424px;
				flex-shrink: 0;
				margin-top: 60px;
				margin-left: 78px;
			}
		}
		.right-plan {
			height: 100%;
			padding: 154px 0;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;

			.text-area {
				flex: 1;
				width: 492px;
				.textItem {
					margin-bottom: 10px;
					h3 {
						text-align: left;
						font-family: 'PingFang SC';
						font-size: 16px;
						font-style: normal;
						font-weight: 500;
						line-height: normal;
						margin-bottom: 6px;
						@include themeify {
							color: themed('Text_s');
						}
					}
					p {
						color: var(--Text1-1, #98a7b5);
						font-family: 'PingFang SC';
						font-size: 14px;
						font-style: normal;
						font-weight: 400;
						@include themeify {
							color: themed('Text1');
						}
					}
				}
			}
			.menu-btn {
				padding-top: 52px;
				display: flex;

				.btn-item {
					display: inline-block;
					height: 44px;
					flex-shrink: 0;
					border-radius: 4px;
					display: flex;
					align-items: center;
					padding: 13px 15px;
					font-family: 'PingFang SC';
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
					margin-right: 12px;
					box-sizing: border-box;
					@include themeify {
						color: themed('Text1');
						background-color: themed('Bg3');
					}

					.icon {
						margin-right: 12px;
						span {
							display: block;
							width: 18px;
							height: 18px;
							border-radius: 50%;
							text-align: center;
							font-weight: 700;
							vertical-align: middle;

							@include themeify {
								background-color: themed('Text_a');
								color: themed('Bg3');
							}
						}
					}
					&.active {
						@include themeify {
							background-color: themed('Theme');
							color: themed('Text_a');
						}
						.icon {
							span {
								@include themeify {
									color: themed('Theme');
									background-color: themed('Text_a');
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
