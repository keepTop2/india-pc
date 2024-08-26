<template>
	<div class="wallet-body">
		<header>{{ $t(`wallet['钱包']`) }}</header>
		<div class="wallet-main">
			<div class="wallet-menu">
				<div :class="route.path === item.path ? 'menu-item-active' : 'menu-item'" v-for="item in walletRoute" :key="item.path" @click="router.push(item.path)">
					<a>{{ item.meta.title }}</a>
				</div>
			</div>
			<div class="main">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import wallet from '/@/router/modules/wallet';
import { useRoute, useRouter } from 'vue-router';

const walletRoute = wallet.children[0].children;
const route = useRoute();
const router = useRouter();
</script>

<style scoped lang="scss">
.wallet-body {
	width: 1200px;
	padding-top: 30px;

	header {
		@include themeify {
			color: themed('Text_s');
		}
		font-family: 'PingFang SC';
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.wallet-main {
		display: flex;
		margin-top: 18px;

		.wallet-menu {
			min-width: 200px;
			height: 100%;
			padding: 13px;
			@include themeify {
				background-color: themed('Bg1');
			}
			border-radius: 8px;
			box-sizing: border-box;
			.menu-item {
				min-height: 36px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 8px;
				border-radius: 4px;
				cursor: pointer;

				a {
					@include themeify {
						color: themed('Text1');
					}
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
				}
			}
			.menu-item:hover {
				@include themeify {
					background-color: themed('Bg3');
				}
			}

			.menu-item-active {
				min-height: 36px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 8px;
				border-radius: 4px;
				@include themeify {
					background-color: themed('Bg3');
				}
				cursor: pointer;
				a {
					@include themeify {
						color: themed('Text_s');
					}
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
				}
			}

			.menu-item:first-child,
			.menu-item-active:first-child {
				margin-top: 0px;
			}
		}

		.main {
			flex: 1;
			margin-left: 12px;
		}
	}
}
</style>
