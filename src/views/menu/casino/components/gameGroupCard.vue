<template>
	<div class="container gameGroupCard">
		<div class="header">
			<div class="title">
				<h3>{{ groupCard.name }}</h3>
			</div>
			<div class="more">
				<span @click="linkPage"> {{ $t(`gameList['查看全部']`) }}</span>
				<div class="turnPage">
					<div class="btn-icon" @click="prev()">
						<div class="icon leftIcon">
							<SvgIcon iconName="arrowLeft" class="iconSvg" />
						</div>
					</div>
					<div class="btn-icon" @click="next()">
						<div class="icon rightIcon">
							<SvgIcon iconName="arrowRight" class="iconSvg" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="gameList">
			<Swiper @swiper="setBigwinsSwiper" :slidesPerView="6" :spaceBetween="12" :slidesPerGroup="6" :loop="true" :noSwiping="true" :modules="modules">
				<SwiperSlide v-for="(item, index) in groupCard.gameInfoList" :key="index">
					<GameCard :CardItem="item" @clickCollect="clickCollect" :lazy="true"> </GameCard>
				</SwiperSlide>
			</Swiper>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GameCard } from "./components";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter, useRoute } from "vue-router";
import { gameGroupCardList } from "./record";
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["clickCollect"]);
interface GroupCard {
	id: null;
	name: null;
	chePcIcon: null;
	unChePcIcon: null;
	type: "POPULAR";
	gameInfoList: [];
}

const props = withDefaults(defineProps<{ groupCard?: any }>(), {
	groupCard: {
		id: null,
		name: "热门游戏",
		chePcIcon: null,
		unChePcIcon: null,
		type: "POPULAR",
		gameInfoList: gameGroupCardList,
	},
});

const modules = ref([Autoplay, Pagination, Navigation]);
const bigwinsRef = ref(null);
const setBigwinsSwiper = (swiper: any) => {
	bigwinsRef.value = swiper;
};

const next = () => {
	bigwinsRef.value && (bigwinsRef.value as any).slideNext();
};
const prev = () => {
	bigwinsRef.value && (bigwinsRef.value as any).slidePrev();
};
//链接页面
const linkPage = () => {
	const id = props.groupCard.id;
	router.push({ name: id as any });
};

const clickCollect = (gameCardData: any) => {
	emit("clickCollect", gameCardData);
};
</script>

<style lang="scss" scoped>
.gameGroupCard {
	padding-bottom: 34px;

	// min-height: 786px;
	// box-sizing: border-box;
	.header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
		background: transparent;

		.title {
			// color: var(--text-s, #fff);
			font-family: "PingFang SC";
			font-size: 20px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;

			@include themeify {
				color: themed("Text_s");
			}
		}

		.more {
			display: flex;

			span {
				// color: var(--Theme-, #3bc116);
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 36px;
				cursor: pointer;

				@include themeify {
					color: themed("Theme");
				}
			}

			.turnPage {
				display: flex;
				height: 36px;
				width: 80px;
				margin-left: 12px;

				.btn-icon {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 36px;
					height: 36px;
					// background-color: #24262b;
					margin: 0px 2px;
					border-radius: 4px;

					@include themeify {
						background-color: themed("Bg1");
					}
				}

				.icon {
					.iconSvg {
						height: 12px;
						width: 12px;
						display: flex;
						align-content: center;
						justify-content: center;
					}
				}
			}
		}
	}

	.turnPage {
	}
}

.gameList {
	// display: grid;
	// grid-template-columns: repeat(6, 190px);
	// justify-self: center;
	// grid-column: 1/-1;
	// // justify-items: center;
	// grid-column-gap: 12px;
	// grid-row-gap: 12px;
}
</style>
