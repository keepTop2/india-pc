<!--
 * @Author: Relax
 * @Description: 帮助中心-左侧导航
-->
<template>
	<div>
		<div class="bg">
			<span>{{ $t(`helpCenter['帮助中心']`) }}</span>
		</div>
		<div class="profile">
			<div class="left-navigation">
				<!-- 左侧导航菜单 -->
				<el-menu class="el-menu-vertical-demo" :default-active="$route.path">
					<el-menu-item v-for="childRoute in menuList" :key="childRoute.path" :index="childRoute.path"
						:class="{ 'is-active': $route.path === childRoute.path }" @click="$router.push(childRoute.path)">
						<!-- 菜单项图标 -->
						<!-- <img style="margin-right: 16px" :src="$route.path === childRoute.path ? childRoute.meta.icona : childRoute.meta.icon" alt="" /> -->
						<span>{{ childRoute.meta.title }}</span>
					</el-menu-item>
				</el-menu>
			</div>

			<div class="right-navigation">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menuList = computed(() => {
  console.log(route, 'route')
	const list = route.matched[0].children[0].children || [];
	const noShow = ['transfer', 'recharge', 'tutorialContent']; // 不需要显示在菜单里
	return list.filter((item: any) => !noShow.includes(item.name));
});

// 处理浏览器返回键事件
const handleBackButton = (event: PopStateEvent) => {
	event.preventDefault();
	router.replace({ name: 'home' });
};

// 在页面组件挂载后添加事件监听器
onMounted(() => {
	window.addEventListener('popstate', handleBackButton);
	window.scrollTo(0, 0);
});

// 在页面组件卸载前移除事件监听器
onBeforeUnmount(() => {
	window.removeEventListener('popstate', handleBackButton);
});
</script>

<style lang="scss" scoped>
* {
	padding: 0;
	margin: 0;
}

.bg {
	width: 1200px;
	margin: 0 auto;

	span {
		display: block;
		margin: 30px 0 18px 0;

		@include themeify {
			color: themed('Text_s');
		}

		font-family: 'PingFang SC';
		font-size: 20px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
	}
}

.profile {
	width: 1200px;
	margin: 0 auto;
	display: flex;
}

.left-navigation {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	margin-right: 16px;
	width: 200px;

	.el-menu-vertical-demo {
		border-radius: 8px;

		@include themeify {
			background: themed('Bg1');
		}
	}
}

.right-navigation {
	flex: 1;
}

.el-menu {
	border-radius: 8px;

	@include themeify {
		background: themed('Bg1');
	}

	padding: 13px;
}

.el-menu-item:hover {
	background: themed('Bg3');
}

.el-menu-item {
	height: 36px;
	flex-shrink: 0;
	border-radius: 4px;
	display: flex;
	justify-content: center;
	align-items: center;

	@include themeify {
		color: themed('Text1');
	}

	font-family: 'PingFang SC';
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	margin-bottom: 8px;
}

.el-menu {
	border: none;
}

.el-menu-item.is-active {
	@include themeify {
		color: themed('Text_s');
	}

	font-family: 'PingFang SC';
	font-size: 14px;
	font-style: normal;
	font-weight: 600;
	line-height: normal;

	@include themeify {
		background: themed('Bg3');
	}
}
</style>
