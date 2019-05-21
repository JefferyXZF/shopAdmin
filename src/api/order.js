// 订单管理
import axios from 'axios'

// 订单列表
export function orderList (data) {
  return axios({
    url: '/order/manageOrder',
    method: 'POST',
    data
  })
}
// 修改订单状态
export function updateOrderStatus(data) {
  return axios({
    url: '/order/managerUpdateOrder',
    method: 'POST',
    data
  })
}
// 删除订单
export function deleteOrder(data) {
  return axios({
    url: '/order/managerDeleteOrder',
    method: 'POST',
    data
  })
}
// 查询订单ID
export function findOrderByID(data) {
  return axios({
    url: '/order/searchOrderByID',
    method: 'POST',
    data
  })
}
