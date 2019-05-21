<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload class="editor-slide-upload"
        action="/upload/img"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="cancelUpload">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { deleteImg, delBatchImg } from '@/api/img';

export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      // const objKeyArr = Object.keys(this.listObj)
      if (response.code === '0') {
          this.listObj[uid].url = file.response.imgPath
          this.listObj[uid].hasSuccess = true
        }
        // for (let i = 0, len = objKeyArr.length; i < len; i++) {
        // if (this.listObj[objKeyArr[i]].uid === uid) {
        //   this.listObj[objKeyArr[i]].url = file.response.imgPath
        //   this.listObj[objKeyArr[i]].hasSuccess = true
        //   }
        // }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          deleteImg(this.listObj[objKeyArr[i]].url).then(response => {
            if (response.data.code === '0') {
              delete this.listObj[objKeyArr[i]]
            }else {
              this.$message("删除图片失败")
            }
          })
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
      // return new Promise((resolve, reject) => {
      //   const img = new Image()
      //   img.src = _URL.createObjectURL(file)
      //   img.onload = function() {
      //     _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
      //   }
      //   resolve(true)
      // })
    },
    cancelUpload() {
      this.dialogVisible = false
      const objKeyArr = Object.keys(this.listObj)
      if (objKeyArr.length > 0) {
        let urlArr = objKeyArr.map(item => this.listObj[item].url);
        if (Array.isArray(urlArr) && urlArr[0]) {
          delBatchImg({detailUrl: urlArr});
        }
        // objKeyArr.forEach(item => {
        //   if (this.listObj[item].url) {
        //     deleteImg(this.listObj[item].url)
        //   }
        // })
      }
      this.listObj = {}
      this.fileList = []
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
