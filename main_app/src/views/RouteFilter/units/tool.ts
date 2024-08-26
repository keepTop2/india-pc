import router from '/@/router';
/**
 * @description: 查处原始路由；
 * @param {string} name
 * @return {*}
 */
function findRouter(name: string) {
  const arrRouter = router.getRoutes()
  let routerItem = {};
  for (const item of arrRouter) {
    if (item?.name == name) {
      routerItem = item;
      break;
    }
  }
  return routerItem;
}

/**
 * @description: 	静态路由名称
 * @return {*}
 */
const staticRouterName = ["favorites", "recentlyViewed", "recommendedYou"]
export {
  findRouter,
  staticRouterName,
}