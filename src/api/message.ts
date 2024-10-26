import useAxiosApi from "/@/utils/useAxiosApi";

export const MessageApi = {
  // 首页分类热门游戏
  messageList: (data = {}, headers = { showLoading: false }) => {
    return useAxiosApi(`/app/client/user/notice/getUserNoticeHeadList`, {
      method: "POST",
      data,
      headers,
    });
  },
};
