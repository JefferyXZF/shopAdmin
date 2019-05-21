//商品管理
import axios from 'axios'

// 添加商品
export function addGoods(data) {
   return axios({
     url: '/goods/add',
     method: 'POST',
     data
   })
}
// 查询所有商品
export function getGoodsList(data) {
  return axios({
    url: '/goods/list',
    method: 'POST',
    data
  })
}
// 根据id查询商品
export function getGoodsById(id) {
  return axios({
    url: '/goods/find',
    method: 'POST',
    data: {
      productId: id
    }
  })
}
// 更新商品状态
export function updateGoods(data) {
  return axios({
    url: '/goods/update',
    method: 'POST',
    data
  })
}
// 删除商品
export function deleteGoods(id) {
  return axios({
    url: '/goods/delete',
    method: 'POST',
    data: {
      productId: id
    }
  })
}
// 更改商品状态  上架  下架
export function updateGoodsState(data) {
  return axios({
    url: '/goods/updateState',
    method: 'POST',
    data
  })
}
// 根据商品分类查询商品列表
export function getGoodsByCategory(data) {
  return axios({
    url: '/goods/categoryGoodsList',
    method: 'POST',
    data
  })
}
// 根据商品名字查询商品列表
export function getGoodsByName(data) {
  return axios({
    url: '/goods/getGoods',
    method: 'POST',
    data
  })
}
