<template>
	<div class="home">
		<!-- Banner Section -->
		<Banner />
		<!-- Main Content -->
		<div class="content">
			<HomeOptions />
			<!-- <HotGames :slidesPerView="6" :spaceBetween="30" />
			<BettingMatches :tabsActiveKey="tabsActiveKey" :betData="betData" @tabChange="handleTabChange" />
			<HomeFooter /> -->
			<h3 class="c_white fs_20 title">
				<!-- <SvgIcon iconName="medal" class="mr_10" /> -->
				{{ $t(`home['最近大奖游戏']`) }}
			</h3>
			<GameSwiper :gameList="gameList" :slidesPerView="6" :spaceBetween="30" />
			<!-- 
			<h3 class="c_white fs_20 title">{{ $t(`home['热门游戏']`) }}</h3>
			<HotGames :slidesPerView="6" :spaceBetween="30" /> -->
			<BettingMatches />
			<div class="home_footer bg_Bg1">
				<div>
					<h3 class="color_Text_s fs_20">加密赌场在线</h3>
					<p class="color_Text1 fs_16">
						在线赌场并不总是存在，但我们可以有把握地说，自从在线赌场出现以来，它 们已经被广泛使用。它的需求并不短缺，选择也并不短缺，现在到了2023年， 我们有成千上万种可供选择 -
						这只是您喜欢什么以及您希望在赌场看到什么支 付选项的问题。
					</p>
					<p class="color_Text1 fs_16">玩家总是在选招新的东西，这将有助于让游戏体验变得更好、更容易上手。让 玩家专注于赌场的绝对乐趣，没错，就是游戏本身。</p>
					<p class="Theme">
						显示更多&nbsp;
						<SvgIcon iconName="jt_lv" width="16" height="16" style="margin-top: -3px" />
					</p>
				</div>
				<div>
					<h3 class="color_Text_s fs_20">帮助我们改善您的体验</h3>
					<textarea name="" id="" cols="30" rows="6" placeholder="发现错误或有任何建议吗？请在此留言"></textarea>
					<div>
						<p>
							<button class="bg_Theme" style="color: #fff">留言</button>
							<span class="fs_14 color_Text1">注：也可以发电子邮件给我们 <span class="Theme">feedback@bcgame.com</span></span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import dialogSingleton from "/@/layout/layout1/login/dialogSingleton";
import { useThemesStore } from "/@/stores/modules/themes";
import Banner from "./components/Banner/Banner.vue";
import HomeOptions from "./components/HomeOptions/HomeOptions.vue";
import GameSwiper from "./components/GameSwiper/GameSwiper.vue";
import HotGames from "./components/HotGames/HotGames.vue";
import BettingMatches from "./components/BettingMatches/BettingMatches.vue";
import { gameList } from "./components/mock";

import { ref } from "vue";
</script>

<style lang="scss">
@import "./home.scss";
</style>
