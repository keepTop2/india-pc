import useAxiosApi from "/@/utils/useAxiosApi";

export const clubApi = {
    getUserVipInfo: (data = {}, headers = {}) => {
        return useAxiosApi(`/app-foreign/user-vip/api/getUserVipInfo`, {
            method: "POST",
            data,
            headers,
        });
    },
}