//图片接口
import axios from 'axios'

// 删除图片
export function deleteImg(url) {
  return axios({
    url: '/upload/delImg',
    method: 'POST',
    data: {
      imgUrl: url
    }
  })
}
// 批量删除图片
// 删除图片
export function delBatchImg(data) {
  return axios({
    url: '/upload/batchDelImg',
    method: 'POST',
    data
  })
}
