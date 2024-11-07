<template>
	<div class="max-width feedback_wrapper pr_10 pl_10 mt_14">
		<div class="left">
			<div class="title fs_24 pl_20 fw_500">
				<span class="Text2 curp" @click="router.push('/user/feedBack')">意见反馈</span>
				<span>
					<svg-icon name="arrow_right" size="16px" class="mr_10 ml_10 Text2"></svg-icon>
				</span>
				<span class="Text_s fs_18">我的反馈</span>
			</div>
			<div class="center" v-ok-loading="listLoading">
				<div class="card curp" v-for="item in FeedbackList" @click="goToDetails(item)">
					<div class="icon">
						<img v-lazy-load="imgObj['type' + item.type]" alt="" />
					</div>
					<div class="text ml_10">
						<div class="ellipsis fs_16 flex_space-between Text_s">
							{{ item.typeText || "意见反馈" }}
						</div>

						<div class="fs_12 Text1 content">
							{{ item.content }}
						</div>
					</div>
					<div class="images" v-if="item.picUrls">
						<img v-for="(img, index) in item.picUrls.split(',')" :src="img" @click.stop="showImagePreview(item.picUrls?.split(','), index)" />
					</div>
					<div>
						<span class="Text1 fs_14"> {{ dayjs(item.createdTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
					</div>
					<div class="line"></div>
				</div>
				<div class="flex-center Pagination" v-if="FeedbackList.length">
					<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="total" @sizeChange="sizeChange" @pageChange="getfeedbackList" />
				</div>
			</div>
		</div>
	</div>
	<ImagePreview v-if="isPreviewOpen" :images="previewList" :isOpen="isPreviewOpen" :initialIndex="previewIndex" @close="isPreviewOpen = false" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { feedbackApi } from "/@/api/feedback";
import router from "/@/router";
import dayjs from "dayjs";
import type1 from "./image/type1.png";
import type2 from "./image/type2.png";
import type3 from "./image/type3.png";
import type4 from "./image/type4.png";
import type5 from "./image/type5.png";
const isPreviewOpen = ref(false);
const previewList = ref([]);
const previewIndex = ref(0);
const imgObj: any = {
	type1,
	type2,
	type3,
	type4,
	type5,
};
const listLoading = ref(false);
const FeedbackList: any = ref([]);
onMounted(() => {
	getfeedbackList();
});
const showImagePreview = (list: [], index: number) => {
	previewList.value = list;
	previewIndex.value = index;
	isPreviewOpen.value = true;
};
const params = reactive({
	pageNumber: 1,
	pageSize: 10,
});
const total = ref(0);
const goToDetails = (item: any) => {
	router.push({
		path: "/user/feedback/feedbackDetails",
		query: {
			id: item.id,
		},
	});
};
const getfeedbackList = () => {
	listLoading.value = true;
	feedbackApi
		.FeedbackList(params)
		.then((res) => {
			FeedbackList.value = res.data.records;
			total.value = res.data.total;
		})
		.finally(() => {
			listLoading.value = false;
		});
};
const sizeChange = (pageSize: number) => {
	params.pageSize = pageSize;
	getfeedbackList();
};
</script>

<style scoped lang="scss">
.feedback_wrapper {
	display: flex;
	gap: 18px;
	min-height: calc(100vh - 100px);
	overflow: hidden;
	.left {
		flex: 1;
		.title {
			height: 74px;
			display: flex;
			align-items: center;
			background: var(--Bg1);
			position: relative;
			border-radius: 12px 12px 0 0;
		}
		.title::before {
			content: "";
			position: absolute;
			left: 0;
			top: 50%;
			width: 4px;
			height: 26px;
			transform: translateY(-50%);
			background: url("./image/image.png") no-repeat;
			background-size: 100% 100%;
		}
		.center {
			border-radius: 0 0 12px 12px;
			background: var(--Bg1);
			padding: 0 20px 20px;
			min-height: calc(100vh - 180px);
			display: flex;
			flex-direction: column;
			.text {
				flex: 1;
			}
		}
		.common_input {
			width: 360px;
			height: 34px;
			line-height: 34px;
			background: var(--Bg2);
			border-radius: 4px;
		}
	}
	.card {
		padding: 20px 14px 10px;
		display: flex;
		justify-content: space-between;
		max-width: 100%;
		overflow: hidden;
		flex-wrap: wrap;
		word-break: break-all;
		.images {
			margin-right: 35px;
			img {
				width: 46px;
				height: 46px;
				object-fit: cover;
				border-radius: 8px;
				border: 1px solid var(--Line_2);
				margin-right: 8px;
			}
		}
		.content {
			display: -webkit-box; /* 使用 Flexbox */
			-webkit-box-orient: vertical; /* 纵向排列 */
			-webkit-line-clamp: 1; /* 限制为两行 */
			overflow: hidden; /* 隐藏超出部分 */
			text-overflow: ellipsis; /* 显示省略号 */
			line-height: 1.5; /* 行高 */
			max-height: 3em; /* 限制最大高度 */
		}
		.icon {
			width: 32px;
			height: 32px;
			img {
				height: 100%;
				width: 100%;
				border-radius: 50%;
			}
		}
		.line {
			height: 1px;
			width: 100%;
			margin-top: 6px;
			background: var(--Line_1);
			box-shadow: 0px 1px 0px 0px #343d48;
		}
	}
}
.Pagination {
	margin-top: auto;
}
</style>
