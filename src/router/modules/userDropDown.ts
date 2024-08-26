import layout1 from "/@/layout/layout1/layout1.vue";


const userDropDownRouter = {
    component:layout1,
    children: [
        {
            path: '/userDropDown',
            name: 'userDropDown',
            component: () => import('/@/views/userDropDown/index.vue'),
            children: [
                {
                    path: '/userDropDown/accountInfo',
                    name: 'accountInfo',
                    component: () => import('/@/views/userDropDown/AccountInfo.vue'),
                },
                {
                    path: '/userDropDown/globalConfig',
                    name: 'globalConfig',
                    component: () => import('/@/views/userDropDown/GlobalConfig.vue'),
                },
            ]
        },
    ]
};
export  default userDropDownRouter;

