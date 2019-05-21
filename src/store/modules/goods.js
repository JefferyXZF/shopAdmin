// 存储商品状态

const goods = {
  state: {
    addGoods: {
      productName: "", //商品名称
      subTitle: "", //商品副标题
      salePrice: 0, //折扣价格
      price: 0, //销售价格
      discount: 0, //折扣
      color: [{value: ''}], //商品颜色
      size: [{value: ''}], //商品尺码
      salesVolume: 0, //销量
      postage: 0, //邮费
      address: "广州", // 商品销售地址
      smallImage: [], // 商品小图
      productImage: [], //商品图片
      limitNum: 0, //限制购买数量
      inventory: 100, //商品库存
      productMsg: "", //商品详情
      content: [], //评论
      status: 1, //商品状态  1 上架  0 下架
      parameter: [{name: '', value: ''}], //商品参数
      categoryID: "", //关联商品分类表
      type: ""  // 商品类型 1 首页轮播商品 2 新品 3 热门商品
    }
  },
  mutations: {
    resetGoods(state) {
      state.addGoods = Object.assign({}, {
        productName: "", //商品名称
        subTitle: "", //商品副标题
        salePrice: 0, //折扣价格
        price: 0, //销售价格
        discount: 0, //折扣
        color: [{
          value: ''
        }], //商品颜色
        size: [{
          value: ''
        }], //商品尺码
        salesVolume: 0, //销量
        postage: 0, //邮费
        address: "", //商品销售地址
        smallImage: [], // 商品小图
        productImage: [], //商品图片
        limitNum: 0, //限制购买数量
        inventory: 0, // 商品库存
        productMsg: "", //商品详情
        content: [], //评论
        status: 1, //商品状态  1 上架  0 下架
        parameter: [{
          name: '',
          value: ''
        }], //商品参数
        categoryID: "" //关联商品分类表
      })
    }
  }
}

export default goods;
