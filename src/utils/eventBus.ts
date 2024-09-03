// src/eventBus.ts
import mitt, { Emitter } from "mitt";

// 定义事件类型接口
type Events = Record<string, any>;

// 创建 EventBus 实例
const eventBus: Emitter<Events> = mitt<Events>();

export default eventBus;
