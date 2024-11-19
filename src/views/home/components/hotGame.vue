<template>
	<div class="mt_10" v-if="hotGameList?.length">
		<div class="cardHeader">
			<div>
				<span class="flex-center" style="gap: 12px">
					<img v-lazy-load="hotGameIcon" alt="" />
					<span class="Text_s fs_20">{{ $t(`home['热门推荐']`) }}</span>
				</span>
			</div>
			<div class="more Text1 fs_18 curp" v-if="hotGameList?.length !== 1">
				<span class="arrow" @click="goToPrevSlide"> <svg-icon :name="isBeginning ? 'common-arrow_left' : 'common-arrow_left_on'" width="8" height="12" /></span>
				<span class="arrow" @click="goToNextSlide"> <svg-icon :name="isEnd ? 'common-arrow_right' : 'common-arrow_right_on'" width="8" height="12" /></span>
			</div>
		</div>
		<div class="hotGameList">
			<Swiper :slidesPerView="4" :spaceBetween="15" :modules="modules" class="swiper-container curp" @swiper="onSwiper">
				<SwiperSlide v-for="(item, index) in hotGameList" :key="index" class="hotGameItem">
					<img v-lazy-load="item.iconFileUrl ? item.iconFileUrl : ''" alt="" />

					<div class="gameInfo Texta">
						<div class="fs_19">
							<img v-lazy-load="item.iconFileUrl" alt="" class="mr_6" /><span>{{ item.venueCode }}</span>
						</div>
						<div class="fs_13 mt_9">
							{{ item.name }}
						</div>
						<div class="gotoGameBtn mt_9">
							<button class="common_btn" @click="Common.goToGame(item)">{{ $t(`home['进入游戏']`) }}</button>
						</div>
					</div>
					<!-- <div class="collect" @click="collectGame(item)">
						<svg-icon :name="collectGamesStore.getCollectGamesList.some((game:any) => game.id === item.id) ? 'collect_on' : 'collect'" size="19.5px"></svg-icon>
					</div> -->
				</SwiperSlide>
			</Swiper>
		</div>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
import { Swiper, SwiperSlide } from "swiper/vue";
import hotGameIcon from "./image/hotGameIcon.png";
import { HomeApi } from "/@/api/home";
import showToast from "/@/hooks/useToast";
import { useModalStore } from "/@/stores/modules/modalStore";
import { useUserStore } from "/@/stores/modules/user";
import { useCollectGamesStore } from "/@/stores/modules/collectGames";
import { Autoplay, Navigation } from "swiper/modules";
import { computed, ref } from "vue";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
const modules = ref([Autoplay, Navigation]);
const swiperRef: any = ref(null);
interface gameInfo {
	id: string;
	name: string;
	icon: string;
	status: number;
	remark: string;
	sort: number;
	venueCode: string;
	gameCode: string;
	label: string;
	cornerLabels: string;
	maintenanceStartTime: string;
	maintenanceEndTime: string;
	collect: boolean;
}
const isEnd = ref(false);
const isBeginning = ref(true);
const props = defineProps({
	hotGameList: {
		type: Array<any>,
	},
});

const collectGamesStore = useCollectGamesStore();
const collectGame = (game: gameInfo) => {
	if (useUserStore().getLogin) {
		const params = {
			gameId: game.id,
			type: !game.collect,
		};
		game.collect = !game.collect;
		HomeApi.collection(params).then((res) => {
			if (res.code === Common.ResCode.SUCCESS) {
				showToast(!game.collect ? $.t(`home['取消收藏成功']`) : $.t(`home['收藏成功']`));
			}
			collectGamesStore.setCollectGamesList();
		});
	} else {
		useModalStore().openModal("LoginModal");
	}
};

const onSwiper = (swiper: any) => {
	swiperRef.value = swiper;
};
const goToNextSlide = () => {
	if (isEnd.value) return;
	isEnd.value = swiperRef.value.isEnd;
	isBeginning.value = swiperRef.value.isBeginning;
	swiperRef.value.slideNext();
};
const goToPrevSlide = () => {
	if (isBeginning.value) return;
	isEnd.value = swiperRef.value.isEnd;
	isBeginning.value = swiperRef.value.isBeginning;
	swiperRef.value.slidePrev();
};
</script>

<style scoped lang="scss">
.cardHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
	img {
		height: 24px;
		width: 24px;
	}
	.arrow {
		background-color: var(--Butter);
		width: 28px;
		height: 28px;
		display: inline-block;
		text-align: center;
		margin: 0 4px;
		line-height: 28px;
		border-radius: 4px;
	}
}

.hotGameList {
	.hotGameItem {
		margin-right: 15px;
		position: relative;

		.collect {
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 20;
			cursor: pointer;
		}
		img {
			width: 100%;
			height: 315px;
			border-radius: 12px;
			object-fit: cover;
			pointer-events: none;
		}
		.gameInfo {
			bottom: 0;
			left: 0;
			width: 100%;
			position: absolute;
			background: rgba(0, 0, 0, 0.05);
			backdrop-filter: blur(13.298970222473145px);
			padding: 12px 14px;
			border-radius: 0 0 12px 12px;
			overflow: hidden;
			img {
				height: 20px;
				width: 20px;
			}
			.gotoGameBtn {
				display: none;
			}
		}
	}
	.hotGameItem:hover {
		.gameInfo {
			.gotoGameBtn {
				display: block;
			}
		}
	}
}
</style>
