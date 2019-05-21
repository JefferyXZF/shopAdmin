//管理员接口
import axios from 'axios'

// 管理员登录
export function loginByUsername(username, password) {
  // const data = {
  //   username,
  //   password
  // }
  // return axios.get('/admin/login', { params: data })
  return axios({
    url: '/admin/login',
    method: 'POST',
    data: {
      username: username,
      password: password
    }
  }) 
}

export function logout(token) {
  return axios.get('/admin/logout', {
    params: { adminId: token }
  })
}

export function getUserInfo(token) {
  return axios.get('/admin/info', {
    params: { adminId: token }
  })
}

