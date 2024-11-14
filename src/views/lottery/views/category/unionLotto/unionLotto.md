graph TD
    UnionLotto --> BayLottery
    UnionLotto --> Result
    BayLottery --> Accordion
    BayLottery --> BetForm
    Accordion --> AccordionItem
    AccordionItem --> Ball
    Ball --> SelectBallGroup

## 双色球数据处理
  
  ### 玩法配置说明
  -- playsConfig.ts定义玩法配置
  1. 红球玩法配置
  - 包含双面玩法(大小单双)和红球选号
  - gamePlayCodes: ["smp_hq_sm_dxd", "smp_hq_sm_dsd", "smp_hq_rx1"] 
  - 双面玩法选项:大、小、和、单、双、和
  - 红球选号:选择1-33个红球号码

  2. 蓝球玩法配置  
  - 包含双面玩法和蓝球选号
  - gamePlayCodes: ["smp_lq_sm", "smp_lq_lqxh"]
  - 双面玩法选项:大、小、单、双
  - 蓝球选号:选择1-16个蓝球号码

  ### 组件说明

  1. UnionLotto组件
  - 主组件,包含标签栏和内容区域
  - 标签栏:投注和开奖
  - 内容区域:动态加载BayLottery和Result组件

  2. BayLottery组件 
  - 投注页面组件
  - 使用Accordion组件展示玩法
  - 使用BetForm组件处理投注表单

  3. Result组件
  - 开奖页面组件
  - 展示开奖结果和历史记录

  4. Ball组件
  - 球号选择组件
  - 支持红球和蓝球两种类型
  - 可配置球号范围和选择模式

  ### 数据流转

  1. 玩法数据流转
  - playsConfig定义静态玩法配置
  - BayLottery组件读取配置生成玩法列表
  - 用户选择玩法触发投注操作

  2. 投注数据流转
  - 用户选择玩法和号码
  - BetForm组件收集投注信息
  - 提交投注请求到服务端

  3. 开奖数据流转  
  - Result组件请求开奖数据
  - 展示最新开奖结果
  - 定时轮询更新开奖信息