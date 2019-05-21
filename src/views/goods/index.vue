/**
  商品列表功能说明：
  1、获得商品分类，可以作为分类显示
  2、获得所有的商品信息列表
  3、可以根据商品名搜索商品
  4、可以选择商品分类搜索商品
  5、通过更改商品的状态控制商品的上架和下架
  6、编辑商品，通过传递商品id到编辑页面查询商品进行编辑保存
  7、删除商品，在删除前做提示，确定删除后调用后台接口删除
  8、切换当前页和页数，调用后台接口返回数据后显示
 */

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="searchGoodsName" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.productName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchGoodsName">搜索</el-button>
      <el-select v-model="categoryID" class="filter-item" placeholder="商品分类" @change="selelctCategory">
        <el-option label="全部" value="all"></el-option>
        <el-option
        v-for="(item, index) in categoryList"
        :key="index"
        :label="item.categoryName"
        :value="item._id"></el-option>
      </el-select>
    </div>

    <el-table
      :key='tableKey'
      :data="dataList"
      v-loading="listLoading"
      border fit highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="340px" align="center" label="商品图片">
        <template slot-scope="scope">
          <span>{{scope.row.categoryName}}</span>
          <img v-for="item in scope.row.smallImage"
               :key="item"
               style="margin:0 5px; width: 60px; height: 60px;"
               :src="item" alt="商品小图">
        </template>
      </el-table-column>

      <el-table-column
        width="200px"
        align="center"
        label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column
        width=""
        align="center"
        label="商品价格">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="144"
        align="center"
        label="创建时间"
        sortable
        prop="date">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="144"
        align="center"
        label="更新时间"
        sortable
        prop="date">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="" fixed="right">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter(1)">{{scope.row.status == '1' ? '上架' : '下架'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="250"
        class-name="small-padding fixed-width"
        fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button :type="scope.row.status | statusFilter" size="mini" @click="editGoodsState(scope.row)">
            {{scope.row.status == '1' ? '下架' : '上架'}}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.curPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getGoodsList, deleteGoods, updateGoodsState, getGoodsByCategory, getGoodsByName} from "@/api/goods";
import { getCategoryList } from '@/api/category';

export default {
  data() {
    return {
      dataList: null, // 数据列表
      tableKey: 0,
      total: null, //总页数
      listLoading: true,
      listQuery: {
        curPage: 1,
        pageSize: 10,
        productName: "",
      },
      categoryID: '',
      categoryList: [],
      total: null,
    }
  },
  filters: {
    statusFilter(status,type) {
      let result;
      if (type == 1) { //通过type传参来倒置过滤
        result = status == '1' ? 'success' : 'danger';
      } else {
        result = status == '1' ? 'info' : 'success';
      }
      return result;
    }
  },
  created() {
    // 获得商品分类列表
      getCategoryList({all: 'list'}).then(response => {
        if (response.data.code === '0') {
          this.categoryList = response.data.data
        }
      })
    this.getGoodsTable()
  },
  methods: {
    // 获取商品分类列表
    getGoodsTable() {
      this.listLoading = true
      getGoodsList(this.listQuery).then(response => {
        this.listLoading = false
        if (response.data.code === "0") {
          this.dataList = response.data.data.list;
          this.listQuery.pageSize = response.data.data.pageSize;
          this.listQuery.curPage = response.data.data.curPage;
          this.total = response.data.data.total;
        } else {
          this.$message.error(response.msg);

        }
      })
    },
    // 搜索商品名
    searchGoodsName() {
      this.categoryID = '';
      this.listQuery.curPage = 1;
      this.listQuery.pageSize = 10;
      this.getGoodsTable()
    },
    // 修改每页显示条数
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getGoodsTable()
    },
    // 选择当前页
    handleCurrentChange(val) {
      this.listQuery.curPage = val
      this.getGoodsTable()
    },
    // 修改商品状态 1 上架 0 下架
    editGoodsState(row) {
      let status = row.status == 1 ? 0 : 1;
      let params = {
        productId: row.productId,
        status: status,
      }
      row.status = status
      updateGoodsState(params).then(response => {
        if (response.data.code === '0') {
          if (status == 1) {
            this.$message({
            message: row.productName + "商品上架",
            type: "success"
          })
          } else {
            this.$message({
            message: row.productName + "商品下架",
            type: "success"
          })
          }

        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    handleDelete(row) {
      const h = this.$createElement;
      this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '确定删除 '),
            h('i', { style: 'color: red' }, "\"" + row.productName +"\"")
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          align: 'center',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              deleteGoods(row.productId).then(response => {
                if (response.data.code === '0') {
                  this.getGoodsTable();
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
    },
    handleUpdate(row) {
      let productId = row.productId;
      this.$router.push({name: 'updateGoods',query:{productID: productId}});
    },
    selelctCategory() {
      if (this.categoryID) {
        getGoodsList({categoryID: this.categoryID}).then( response => {
          if (response.data.code === '0') {
            this.dataList = response.data.data.list;
            this.listQuery.pageSize = response.data.data.pageSize;
            this.listQuery.curPage = response.data.data.curPage;
            this.total = response.data.data.total;
          } else {
            this.$message.error(response.msg);
          }
        })
      }
    }
  }
}
</script>

