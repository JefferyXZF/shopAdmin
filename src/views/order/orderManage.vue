
/*
功能逻辑说明：
  1、首先请求后台订单接口，获得所有的订单列表数据 mapData
  2、监听mapData数据，将数据保存到filterData中，filterData数据是一个中间变量，在订单状态切换时，将过滤的数据保存到其中，配合dataList做分页显示
  3、监听filterData数据，获得页面的total订单总条数
  4、分页逻辑：显示 dataList = filterData.slice((curPage当前页 - 1) * pageSize页数, curPage当前页 * pageSize页数)
  5、监听 curPage 当前页和 pageSize 页数的变化，调用第四步的分页逻辑显示当前页面
 */

<template>
  <div class="ui-order-main">
    <div class="ui-order-status">
      <div class="ui-order-search">
        <span class="mr15">搜索订单ID</span>
        <el-input
          @keyup.enter.native="searchOrderByID"
          style="width: 200px;"
          class="filter-item"
          placeholder="订单ID"
          v-model.trim="orderID">
        </el-input>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="searchOrderByID">搜索</el-button>
      </div>
      <span class="mr15">订单状态</span>
      <el-select v-model="curStatus" class="filter-item" placeholder="商品分类" @change="filterOrder">
        <el-option
        v-for="(item, index) in statusChoose"
        :key="index"
        :label="item.name"
        :value="item.status"></el-option>
      </el-select>
    </div>
    <div class="ui-order-list">
      <el-table
        :key='tableKey'
        :data="dataList"
        v-loading="listLoading"
        border fit highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">

        <el-table-column
          align="center"
          label="序号"
          width="65"
          type="index">
        </el-table-column>

        <el-table-column
          width="200px"
          align="center"
          label="订单ID">
          <template slot-scope="scope">
            <span>{{scope.row.orderId}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="100px"
          align="center"
          label="订单账号">
          <template slot-scope="scope">
            <span>{{scope.row.address.userName}}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px" align="center" label="商品图片">
          <template slot-scope="scope">
            <img class="ui-order-img" :src="scope.row.goods.bigImage" alt="商品图片">
          </template>
        </el-table-column>

        <el-table-column
          width="200px"
          align="center"
          label="联系方式">
          <template slot-scope="scope">
            <span>{{scope.row.address.tel}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="200px"
          align="center"
          label="商品名称">
          <template slot-scope="scope">
            <span class="ui-goods-name">{{scope.row.goods.productName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width=""
          align="center"
          label="商品价格">
          <template slot-scope="scope">
            <span>{{scope.row.goods.salePrice}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="144"
          align="center"
          label="下单时间"
          sortable
          prop="date">
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="144"
          align="center"
          label="支付时间">
          <template slot-scope="scope">
            <span>{{scope.row.payDate}}</span>
          </template>
        </el-table-column>

        <el-table-column
          class-name="status-col"
          label="订单状态"
          width="150"
          fixed="right">
          <template slot-scope="scope">
            <el-tag :type="scope.row.orderStatus | statusFilter(1)">{{ status[scope.row.orderStatus] }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          width="200"
          class-name="small-padding fixed-width"
          fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.orderStatus == 0"
              type="primary"
              size="small"
              @click="handleRefund(scope.row)">退货退款</el-button>

            <el-button
              v-if="scope.row.orderStatus == 1"
              type="danger"
              size="small"
              @click="handleDelete(scope.row)">取消订单</el-button>

            <el-button
              v-if="scope.row.orderStatus == 2"
              type="primary"
              size="small"
              @click="handleDeliver(scope.row)">订单发货</el-button>

            <el-button
              v-if="scope.row.orderStatus == 3"
              size="small"
              type="info"
              disabled>等待收货</el-button>

            <el-button
              v-if="scope.row.orderStatus == 4"
              size="small"
              type="info"
              disabled>交易完成</el-button>

            <el-button
              v-if="scope.row.orderStatus == 5"
              size="small"
              type="info"
              disabled>已评价</el-button>

              <el-button
              v-if="scope.row.orderStatus == 6"
              size="small"
              type="info"
              disabled>已退货退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.curPage" :page-sizes="[4,8,10, 20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { orderList, updateOrderStatus, deleteOrder, findOrderByID } from '@/api/order';
export default {
  name: 'OrderList',
  data () {
    return {
      dataList: [], // 要显示的数据列表
      mapData: [], // 存放请求的数据列表
      filterData: [], // 过滤的数据列表
      tableKey: 0,
      total: 0, //总页数
      listLoading: false,
      listQuery: {
        curPage: 1,
        pageSize: 4,
      },
      params: {},
      status: ['顾客申请退款', '未支付', '已支付', '已发货', '交易完成', '已评价', '已退货退款'], // 0'已退款', 1'未支付', 2'已支付', 3'已发货', 4'交易完成，5'评价' 6'已退货退款'
      statusChoose: [
        {name: '全部', status: 'all'},
        {name: '顾客申请退款', status: 0},
        {name: '未支付', status: 1},
        {name: '已支付', status: 2},
        {name: '已发货', status: 3},
        {name: '交易完成', status: 4},
        {name: '已评价', status: 5},
        {name: '已退货退款', status: 6},
      ],
      curStatus: 'all',
      orderID: ''
    }
  },
  filters: {
    statusFilter(status) {
      return status == 1 ? 'danger' : 'info';
    }
  },
  watch: {
    'listQuery.curPage': function (value) { // 监听当前页变化
      this.handlePage()
    },
    'listQuery.pageSize': function (value) { // 监听页数变化
      this.handlePage()
    },
    mapData (value) {
      this.filterData = value || []
    },
    filterData (value) {
      this.total = value.length // 符合条件的总订单数
      this.handlePage() // 页面显示的数据
    }
  },
  created () {
    this.getOrderTable()
  },
  methods: {
    handlePage () { // 分页显示
      if (this.filterData && Array.isArray(this.filterData)) {
        this.dataList = this.filterData.slice((this.listQuery.curPage - 1) * this.listQuery.pageSize, this.listQuery.curPage * this.listQuery.pageSize) // 显示的数据
      }
    },
    // 获取订单列表
    getOrderTable() {
      this.curStatus = 'all'
      this.listLoading = true
      orderList().then(response => {
        this.listLoading = false
        if (response.data.code === "0") {
          this.mapData = response.data.data || [];
        } else {
          this.$message.error(response.data.msg);
        }
      })
    },
    handleDeliver (value) { // 发货
      this.params = {
        userName: value.address.userName,
        orderId: value.orderId,
        status: 3
      }
      this.handleCallBack('确定发货吗?', done => {
        updateOrderStatus(this.params).then(result => {
          if (result.data.code === '0') {
            this.getOrderTable()
            done()
          } else {
            this.$message.error(result.data.msg);
          }
        })
      })
    },
    handleDelete (value) { // 取消订单
      this.params = {
        orderId: value.orderId,
      }
      this.handleCallBack('确定删除订单吗?', done => {
        deleteOrder(this.params).then(result => {
          if (result.data.code === '0') {
            this.getOrderTable()
            done()
          } else {
            this.$message.error(result.data.msg);
          }
        })
      })
    },
    handleRefund (value) { // 退货退款
      this.params = {
        userName: value.address.userName,
        orderId: value.orderId,
        status: 6
      }
      this.handleCallBack('确定退货退款吗?', done => {
        updateOrderStatus(this.params).then(result => {
          if (result.data.code === '0') {
            this.getOrderTable()
            done()
          } else {
            this.$message.error(result.data.msg);
          }
        })
      })
    },
    /**
     * msg显示的文本
     * callback回调函数
     */
    handleCallBack (msg, callback) { // 操作回调
      const h = this.$createElement;
      this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, msg)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          align: 'center',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              callback(done) // 调用回调函数，并把done函数传入作为回调，可以控制关闭弹窗
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'success',
            message: 'success'
          });
        }).catch(function () {
          return false
        });
    },
    filterOrder () { // 订单下拉
      this.listQuery.curPage = 1
      this.listQuery.pageSize = 4
      if (this.curStatus === 'all') {
        this.filterData = this.mapData
      } else {
        this.filterData = this.mapData.filter(item => item.orderStatus == this.curStatus) // 过滤指定的订单状态
      }
    },
    //修改当前页
    handleSizeChange(val) {
      this.listQuery.pageSize = val || 2
    },
    // 选择当前页数
    handleCurrentChange(val) {
      this.listQuery.curPage = val || 1
    },
    // 根据订单ID搜索订单
    searchOrderByID () {
      this.listLoading = true
      findOrderByID({orderId: this.orderID}).then(response => {
        this.listLoading = false
        if (response.data.code === "0") {
          this.mapData = response.data.data || [];
        } else {
          this.$message.error(response.data.msg);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-order-status {
    display: flex;
    padding: 20px 50px;
    line-height: 36px;
    .ui-order-search {
      margin-right: 100px;
    }
    .mr15 {
      margin-right: 20px;
    }
  }
.ui-order-list {
  .ui-order-img {
    width: 100px;
    height: 100px;
  }
  .ui-goods-name {
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow : hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
.pagination-container {
  padding: 10px 0 40px 20px;
}

</style>
