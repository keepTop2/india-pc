import EventCard from "./eventCard/eventCard.vue"; // 购物车赛事列表
import SingleTicketFrom from "./singleTicketFrom/singleTicketFrom.vue"; // 单关表单
import ParlayTicketsFrom from "./parlayTicketsFrom/parlayTicketsFrom.vue"; // 串关表单
import SingleTicketFooter from "./singleTicketFooter/singleTicketFooter.vue";
import ParlayTicketsFooter from "./parlayTicketsFooter/parlayTicketsFooter.vue";
import CardStatus from "../../components/cardStatus/cardStatus.vue"; // 投注成功头部
import SingleTicketFinish from "./singleTicketFinish/singleTicketFinish.vue"; // 单关投注成功列表
import ParlayTicketsFinish from "./parlayTicketsFinish/parlayTicketsFinish.vue"; // 串关投注成功列表
import AuthHintDialog from "../../components/authHintDialog/authHintDialog.vue"; // 接受更优赔率弹窗

export { SingleTicketFrom, EventCard, ParlayTicketsFrom, SingleTicketFinish, SingleTicketFooter, ParlayTicketsFooter, ParlayTicketsFinish, CardStatus, AuthHintDialog };
