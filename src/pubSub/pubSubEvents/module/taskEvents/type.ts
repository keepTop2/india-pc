import PubSubEventType from '/@/pubSub/pubSubEvents/pubSubEventType';

interface TaskDialogSwitch extends PubSubEventType {
  /**
   * @description 事件名称(主题名称)
   */
  eventName: EventName;
  /**
   * 参数 true | false
   */
  params: Params; // 直接使用布尔值表示显示或隐藏

}


interface Params {
  /**
   * 显示或隐藏
   */
  show: boolean;
  hide: boolean;
}

/**
 * @description 事件名称(主题名称)
 */
type EventName = 'TaskDialogSwitch';

/**
 * @description 显示隐藏弹框事件
 */
export const TaskDialogSwitch: TaskDialogSwitch = {
  /**
   * @description 事件名称(主题)
   */
  eventName: 'TaskDialogSwitch',
  /**
   * @description true | false
   */
  /**
   * @description true | false
   */
  params: {
    show: true, // 默认隐藏
    hide: false, // 默认隐藏
  },
};
