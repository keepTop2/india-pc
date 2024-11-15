<template>
	<div class="wallet_container">
		<div class="Menu_Bar">
			<template v-for="item in walletLayout.children">
				<div v-if="!item.meta.secondaryPage" class="menu" :class="{ menu_active: item.path === route.path }" @click="toPath(item)">
					<div class="icon">
						<SvgIcon :name="`wallet-${item.meta.icon}`" v-hover-svg />
					</div>
					<div class="name">{{ item.meta.title }}</div>
				</div>
			</template>
		</div>
		<div class="main">
			<RouterView v-slot="{ Component }">
				<KeepAlive :include="keepAliveComps">
					<component :is="Component" />
				</KeepAlive>
			</RouterView>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import walletLayout from "/@/router/modules/wallet";
import { useRouterStore } from "/@/stores/modules/cacheRouter";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const { keepAliveComps } = storeToRefs(useRouterStore());

const toPath = (item) => {
	router.push(item.path);
};
</script>

<style scoped lang="scss">
// 针对大于 1100px 的屏幕
@media (min-width: 1100px) {
	.wallet_container {
		max-width: 1308px;
		// height: 100%;
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin: 0 auto;
		padding: 24px 20px;
		box-sizing: border-box;

		.Menu_Bar {
			width: 240px;
			height: 100%;
			display: grid;
			gap: 8px;
			padding: 12px;
			border-radius: 12px;
			background: var(--Bg-1);
			user-select: none;
			.menu {
				width: 100%;
				height: 44px;
				display: flex;
				align-items: center;
				gap: 18px;
				padding: 10px 24px;
				border-radius: 4px;
				cursor: pointer;
				transition: all 0.2s;
				.icon {
					width: 18px;
					height: 18px;
					svg {
						width: 100%;
						height: 100%;
						color: #67707b;
					}
				}
				.name {
					color: var(--Text-1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
			}
			.menu:hover,
			.menu_active {
				background: var(--Bg-3);
				.icon {
					svg {
						color: var(--Text-s);
					}
				}
				.name {
					color: var(--Text-s);
				}
			}
		}

		.main {
			flex: 1;
		}
	}
}

// 针对小于 1100px 的屏幕
@media (max-width: 1100px) {
	.wallet_container {
		width: 100%;
		margin: 0 auto;
		padding: 24px 20px;
		.Menu_Bar {
			display: flex;
			gap: 8px;
			padding: 4px 12px;
			border-radius: 12px;
			background: var(--Bg-1);
			user-select: none;
			overflow-x: auto;
			overflow-y: hidden;
			.menu {
				height: 36px;
				display: flex;
				gap: 18px;
				align-items: center;
				padding: 8px 24px 8px 24px;
				border-radius: 4px;
				cursor: pointer;
				transition: all 0.2s;
				.icon {
					width: 18px;
					height: 18px;
					svg {
						width: 100%;
						height: 100%;
						color: #67707b;
					}
				}
				.name {
					white-space: nowrap;
					color: var(--Text-1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
			}
			.menu:hover,
			.menu_active {
				background: var(--Bg-3);
				.icon {
					svg {
						color: var(--Text-s);
					}
				}
				.name {
					color: var(--Text-s);
				}
			}

			/* 隐藏滚动条 */
			&::-webkit-scrollbar {
				display: none; /* 对于 Chrome 和 Safari */
			}

			& {
				-ms-overflow-style: none; /* 对于 Internet Explorer 和 Edge */
				scrollbar-width: none; /* 对于 Firefox */
			}
		}

		.main {
			width: 100%;
			margin-top: 14px;
		}
	}
}
</style>
