/*
 * @Author: WangMingxin
 * @Description:全局通知弹窗
 */
import { createApp, createVNode, render, h, VNode } from 'vue';
import { ElNotification } from 'element-plus';
import './index.scss'
import NotificationCenter from './components/mian.vue'
// h 废弃，使用 createVNode 代替；
interface Option {
  /** 标题 */
  title?: string,
  /** 文本内容 */
  content?: string,
  /** 类型  'success' | 'warning' | 'info' | 'error' | ''*/
  type?: '',
  /** 显示时长  */
  duration?: number;

}
/**
 * @description:  通知组件
 * @param {Option} { title:标题，content:文本内容，duration:显示时长}
 * @return {*}
 */
const Notification = (Options?: Option) => {
  const domVNode: any = ElNotification({
    showClose: false,
    duration: 0,
    customClass: "Notification_Self",
    onClick: () => {
      domVNode.close()
    },
    message: createVNode(NotificationCenter, {
      title: Options?.title,
      type: Options?.type,
      content: Options?.content,
      duration: Options?.duration,
      onClose: () => {
        domVNode.close()
      }
    }),
  });
}

export { Notification }

