// 赛果
import useAxiosSabaApi from "/@/utils/useAxiosSabaApi";
import qs from "qs";

class BetRecordApi {
    /**
     *@description 此 API 用于获取指定时间区间内运动的赛果信息。
     */
    static GetEventResults = (params?: object) => {
        const requireParams = { language: "zhcn" };
        const requestParams = Object.assign({}, requireParams, params);
        return useAxiosSabaApi(`/sports/V1/GetEventResults?${qs.stringify(requestParams)}`, {
            method: "GET",
        });
    };

    /**
     *@description 此 API 用于获取指定时间区间内运动的赛果和优胜冠军赛果数量。
     */
    static GetSportResults = (params?: object) => {
        const requireParams = { language: "zhcn" };
        const requestParams = Object.assign({}, requireParams, params);
        return useAxiosSabaApi(`/sports/V1/GetSportResults?${qs.stringify(requestParams)}`, {
            method: "GET",
        });
    };
}

export default BetRecordApi;
