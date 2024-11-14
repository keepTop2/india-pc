export const DEFAULT_LANG = "zh"; // 默认语言
export const langMaps = { "zh-CN": "zh" }; // 做个映射
export const isSmp = 1; // 1 双面盘 | 0 标准盘。目前只接双面盘，因此写死 1

export const BEGIN_PAGE_DATA_INTERVAL = 10 * 1000; // 倒计时结束，ws 没回来，10 秒去拉一遍 beginPageData 接口。或者说，ws 挂了，轮询，也是 10 秒去拉一遍 beginPageData

export const SELECT_BALL = "selectBall"; // 考虑到好几个地方都用了，抽出来
