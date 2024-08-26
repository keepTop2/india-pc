import PubSubEventType from '/@/pubSub/pubSubEvents/pubSubEventType'



interface ShowOrHiddenLoginDialog extends PubSubEventType {
  /**
   * @description 事件名称(主题名称)
   */
  eventName: EventName
  /**
   * 参数
   */
  params: Params
}


interface Params {
  /**
   * 注册
   */
  0: number,
  /**
   * 登录
   */
  1: number,
  /**
   * 验证码
   */
  2: number,
  /**
   * 未收到验证码
   */
  3: number,
  /**
   * 忘记密码
   */
  4: number
}

/**
 * @description 事件名称(主题名称)
 */
type EventName = 'showOrHiddenLoginDialog'


/**
 * @description 显示隐藏登录注册弹框事件
 */
export const showOrHiddenLoginDialog = {
  /**
   * @description 事件名称(主题)
   */
  eventName: 'showOrHiddenLoginDialog',
  /**
   * @description 参数 0注册 ｜ 1登录 ｜ 2验证码 ｜ 3 未收到验证码 ｜ 4忘记密码
   */
  params: {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4
  }
} as ShowOrHiddenLoginDialog