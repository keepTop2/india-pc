// 优惠详情
import layout1 from "/@/layout/layout1/layout1.vue";


const discounts = {
  component:layout1,

  children: [
    {
      path: '/specialOffer/activityParticulars',
      name: 'activityParticulars',
      component: () => import('/@/views/menu/specialOffer/components/activityParticulars.vue'),
      meta: { title: '优惠详情' },
    },
  ],
};

export default discounts;