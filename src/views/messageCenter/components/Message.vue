<template>
	<div class="message">
		<div class="time">{{ item.createdTime }}</div>
		<div class="title" :class="!isUnfold && 'hidden-title'" v-html="item.noticeTitleI18nCode"></div>
		<div class="content" :class="!isUnfold && 'hidden-content'" v-html="item.messageContentI18nCode"></div>
		<div class="handle">
			<svg-icon name="delete2" size="18px"></svg-icon>
			<div class="unfold" @click="isUnfold = !isUnfold">
				{{ isUnfold ? "收起" : "展开" }}
				<svg-icon name="arrow_down_on" size="14px" class="icon" :class="isUnfold && 'fold'" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
	item: {
		[key: string]: any;
	};
}

const props = defineProps<Props>();

const isUnfold = ref(false);
</script>

<style scoped lang="scss">
.message {
	font-size: 14px;
	color: var(--Text2_1);
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 8px;
	background-color: var(--Bg3);
	border-radius: 8px;

	.content {
	}

	.hidden-content {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		text-overflow: ellipsis;
	}

  .hidden-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

	.handle {
		width: 100%;
		display: flex;
		align-self: center;
		justify-content: space-between;

		.unfold {
			display: flex;
			align-items: center;
			gap: 5px;
			color: var(--Theme);
			text-transform: uppercase;
			text-decoration: underline;
			text-underline-offset: 3px;
			font-size: 14px;
			user-select: none;

			.icon {
				transition: 0.2s;
				fill: var(--Bg5);
			}

			.fold {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
