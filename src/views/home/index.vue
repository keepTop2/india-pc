<template>
<<<<<<< HEAD
	<div>
		<div class="textMain max-width" v-for="item in 50">textMain{{ item }}</div>
=======
	<div class="home-wrapper">
		<!-- banner -->
		<bannerSkeleton v-if="isLoading" />
		<banner v-else></banner>
		<div class="max-width">
			<!-- 热门推荐 -->
			<hotGameSkeleton :skeletonCount="5" v-if="isLoading" />
			<hotGame :hotGameList="hotGameList" v-else />

			<!-- b -->
			<template v-if="isLoading">
				<lobbyGameSkeleton :skeletonCount="6" />
				<lobbyGameSkeleton :skeletonCount="3" />
				<lobbyGameSkeleton :skeletonCount="6" />
				<lobbyGameSkeleton :skeletonCount="1" />
				<lobbyGameSkeleton :skeletonCount="5" />
			</template>
			<lobbyGameCard v-for="item in lobbyGameList" :gameList="item" />
		</div>
>>>>>>> 828ee03 (feat:修改登陆验证)
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.home-wrapper {
	padding-bottom: 40px;
}
</style>
