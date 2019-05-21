<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.categoryName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table
      :key='tableKey'
      :data="dataList"
      v-loading="listLoading"
      border fit highlight-current-row
      style="width: 100%;height:100%;">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
      <el-table-column width="" align="center" label="分类名称">
        <template slot-scope="scope">
          <span>{{scope.row.categoryName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width=""
        align="center"
        label="分类描述">
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width=""
        align="center"
        label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.sorting}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="144"
        align="center"
        label="创建时间"
        prop="date">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="144"
        align="center"
        label="更新时间"
        prop="date">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter(1)">{{scope.row.status == '1' ? '发布' : '草稿'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button :type="scope.row.status | statusFilter" size="mini" @click="handleModifyStatus(scope.row)">
            {{scope.row.status == '1' ? '草稿' : '发布'}}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.curPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="categoryItem"
        :model="categoryItem"
        label-position="left"
        label-width="110px"
        style='width: 400px;'>
        <el-form-item
          label="商品分类名称"
          label-width="110px"
          style='width: 500px;'
          prop="categoryName"
          :rules="[
            { required: true, message: '商品分类名不能为空', trigger: 'blur'},
            { min:2, max: 10, message: '字符长度在2 ~ 10个之间', trigger: 'blur' }
          ]"
          >
          <el-input v-model="categoryItem.categoryName" autofocus="true"></el-input>
        </el-form-item>
        <el-form-item label="商品排序" style='width: 500px;'>
          <el-input type="number" placeholder="值越小商品分类越靠前" v-model="categoryItem.sorting"></el-input>
        </el-form-item>
        <el-form-item label="商品分类描述" style='width: 500px;'>
          <el-input type="textarea" v-model="categoryItem.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('categoryItem')">确定</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getCategoryList, addCategory, delCategory, getCategoryById, updateCategory } from "@/api/category";

export default {
  data() {
    return {
      dataList: null, // 数据列表
      categoryItem: { // 商品对象
        categoryId: '',
        categoryName: '',
        sorting: 0, // 排序 越低越靠前
        desc: ''
      },
      tableKey: 0,
      total: null, //总页数
      listLoading: true,
      listQuery: {
        curPage: 1,
        pageSize: 10,
        categoryName: "",
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改商品分类',
        create: '添加商品分类'
      },
      dialogPvVisible: false,
      num: 1
    }
  },
  filters: {
    statusFilter(status,type) {
      let result;
      if (type == 1) { //通过type传参来倒置过滤
        result = status == '1' ? 'success' : 'info';
      } else {
        result = status == '1' ? 'info' : 'success';
      }
      return result;
    }
  },
  created() {
    this.getCategoryTable()
  },
  methods: {
    //获取商品分类列表
    getCategoryTable() {
      this.listLoading = true
      getCategoryList(this.listQuery).then(response => {
        this.listLoading = false
        if (response.data.code === "0") {
          this.dataList = response.data.data.list;
          this.listQuery.pageSize = response.data.data.pageSize;
          this.listQuery.curPage = response.data.data.curPage;
          this.total = response.data.data.total;
        } else {
          this.$message.error(response.data.msg);

        }
      })
    },
    //搜索
    handleFilter() {
      this.listQuery.curPage = 1;
      this.listQuery.pageSize = 10;
      this.getCategoryTable()
    },
    //修改当前页
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getCategoryTable()
    },
    handleCurrentChange(val) {
      this.listQuery.curPage = val
      this.getCategoryTable()
    },
    // 修改商品分类状态 1 发布 0 草稿
    handleModifyStatus(row) {
      let status = row.status == 1 ? 0 : 1;
      let params = {
        categoryId: row.categoryId,
        status: status,
        categoryName: row.categoryName,
        desc: row.desc
      }
      row.status = status
      updateCategory(params).then(response => {
        let data = response.data;
        if (data.code === '0') {
          if (status === 1) {
            this.$message({
            message: "发布成功",
            type: "success"
          })
          } else {
            this.$message({
            message: "更改草稿成功",
            type: "success"
          })
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    resetTemp() {
      this.categoryItem = {
        categoryId: '',
        categoryName: '',
        sorting: 0,
        desc: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['categoryItem'].clearValidate()
      })
    },
    // 添加商品类别
    createData(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var params = {
            categoryName: this.categoryItem.categoryName,
            sorting: this.categoryItem.sorting,
            desc: this.categoryItem.desc
          }
          addCategory(params).then((response) => {
            if (response.data.code === '0') {
              this.dialogFormVisible = false
              this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getCategoryTable()
            }else {
              this.$message.error(response.data.msg);
            }
          })
        } else {
          return false;
        }
      })
    },
    handleUpdate(row) {
      this.categoryItem = Object.assign({}, row) // 复制对象
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['categoryItem'].clearValidate()
      })
    },
    // 更新商品类别
    updateData() {
      this.$refs['categoryItem'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.categoryItem)
          updateCategory(tempData).then((response) => {
            if (response.data.code === '0') {
              this.dialogFormVisible = false
              this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getCategoryTable();
            }else {
              this.$message.error(response.data.msg);
            }
          })
        }
      })
    },
    handleDelete(row) {
      const h = this.$createElement;
      this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '确定删除 '),
            h('i', { style: 'color: red' }, row.categoryName)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          align: 'center',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              delCategory(row.categoryId,row._id).then(response => {
                if (response.data.code === '0') {
                  this.getCategoryTable();
                  done();
                } else {
                  this.$message({
                    type: 'error',
                    message: response.data.msg
                  });
                }
              })

            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container /deep/ .el-dialog__body {
padding-bottom: 5px;
}
</style>
