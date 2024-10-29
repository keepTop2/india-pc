<template>
	<Dialog v-for="item in noticeList" :item="item" />
</template>

<script setup lang="ts">
import { HomeApi } from "/@/api/home";
import { ref } from "vue";
import Dialog from "./Dialog.vue";

interface Notice {
	noticeTitleI18nCode: string; // 标题
	messageContentI18nCode: string; // 内容
}

const noticeList = ref<Notice[]>([]);
const getNoticeList = async () => {
	const res = await HomeApi.noticeList();
	noticeList.value = res.data;
};
getNoticeList();
</script>

<style scoped lang="scss"></style>
