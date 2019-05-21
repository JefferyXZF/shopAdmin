//商品分类管理接口
import axios from 'axios'

// 获得商品分类列表
export function getCategoryList(params) {
  return axios.get('/category/list', {
    params
  })
}
// 添加商品分类
export function addCategory(params) {
  return axios.get('/category/add', {
    params
  })
}
// 删除商品分类
export function delCategory(categoryId, id) {
  return axios.get('/category/delete', {
    params: {
      categoryId,
      _id: id
    }
  })
}
// 根据ID查询商品分类
export function getCategoryById(categoryId) {
  return axios.get('/category/find', {
    params: {
      categoryId
    }
  })
}
// 更改商品分类
export function updateCategory(params) {
  return axios.get('/category/update', {
    params
  })
}
