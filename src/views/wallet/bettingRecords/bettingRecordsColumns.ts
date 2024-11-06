export interface columnsType {
  [key: string]: columnType[]
}
export interface columnType{
  label: string
  props: string
  type:string
}

export default {
  '体育': [
    { label: '订单号', props: 'orderId' },
    { label: '投注时间', props: 'betTime' },
    { label: '投注金额', props: 'betAmount' },
    { label: '输赢金额', props: 'winLossAmount' },
    {label:'注单状态',props:'orderClassifyText',type:'select'}
  ]
}