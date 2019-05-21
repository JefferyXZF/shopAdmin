<template>
  <div class="ui-container">
    <h1>{{title}}</h1>
    <el-form
      :model="formData"
      :label-position="labelPosition"
      ref="forms"
      label-width="100px"
      class="demo-dynamic"
    >
      <el-form-item
        label="商品名称"
        prop="productName"
        :rules="[
          { required: true, message: '商品名称不能为空', trigger: 'blur'},
          { max: 100, message: '字符长度控制在100个之内', trigger: 'blur' }
        ]">
        <el-input v-model="formData.productName" class="ui-input" clearable></el-input>
      </el-form-item>

      <el-form-item label="商品描述">
        <el-input v-model="formData.subTitle" class="ui-input" clearable></el-input>
      </el-form-item>

      <el-form-item
        label="商品价格"
        prop="price"
        :rules="[
          { required: true, message: '商品价格不能为空', trigger: 'blur'}
        ]"
      >
        <el-input
          type="number"
          v-model="formData.price"
          class="ui-input"
          @blur="validatePrice('price')"
        >
          <el-button slot="append">$</el-button>
        </el-input>
        <span class="ui-tips">{{priceTips}}</span>
      </el-form-item>

      <el-form-item label="商品折扣">
        <el-input
          type="number"
          v-model="formData.discount"
          class="ui-input"
          @blur="validatePrice('discount')"
        ></el-input>
        <span class="ui-tips">{{discountTips}}</span>
      </el-form-item>

      <el-form-item label="商品折扣价格">
        <el-input
          type="number"
          v-model="formData.salePrice"
          class="ui-input"
          @blur="validatePrice('salePrice')"
        >
          <el-button slot="append">$</el-button>
        </el-input>
        <span class="ui-tips">{{salePriceTips}}</span>
      </el-form-item>

      <el-form-item label="限制购买数量">
        <el-input
          type="number"
          v-model="formData.limitNum"
          class="ui-input"
          @blur="validatePrice('limitNum')"
        ></el-input>
        <span class="ui-tips">{{limitNumTips}}</span>
      </el-form-item>

      <el-form-item label="商品库存">
        <el-input
          type="number"
          v-model="formData.inventory"
          class="ui-input"
          @blur="validatePrice('inventory')"
        ></el-input>
        <span class="ui-tips">{{inventoryTips}}</span>
      </el-form-item>

      <p>
        <span style="font-size: 14px; font-weight: 700; color: #606266;">商品颜色</span>
        <el-button
          :circle="true"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="addDomain('color')"
        ></el-button>
        <el-button
          :circle="true"
          icon="el-icon-minus"
          size="mini "
          type="danger"
          v-show="formData.color.length > 1"
          @click="delDomain('color')"
        ></el-button>
      </p>
      <span v-for="(domain, index) in formData.color" :key="index + 'llaafe2'">
        <el-input v-model="domain.value" style="width: 200px; margin: 0 20px 20px 0"></el-input>
      </span>

      <p>
        <span style="font-size: 14px; font-weight: 700; color: #606266;">商品尺码</span>
        <el-button
          :circle="true"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="addDomain('size')"
        ></el-button>
        <el-button
          :circle="true"
          icon="el-icon-minus"
          size="mini "
          type="danger"
          v-show="formData.size.length > 1"
          @click="delDomain('size')"
        ></el-button>
      </p>
      <span v-for="(data, index) in formData.size" :key="index + 'asafee1'">
        <el-input v-model="data.value" style="width: 200px; margin: 0 20px 20px 0"></el-input>
      </span>

      <el-form-item label="邮费">
        <el-input v-model="formData.postage" class="ui-input" @blur="validatePrice('postage')"></el-input>
      </el-form-item>

      <el-form-item label="所在地区">
        <el-input v-model="formData.address" class="ui-input" clearable></el-input>
      </el-form-item>

      <el-form-item label="商品类型">
        <el-select v-model="formData.type" placeholder="商品类型">
          <el-option label="首页商品" :value="1"></el-option>
          <el-option label="新品上架" :value="2"></el-option>
          <el-option label="热门商品" :value="3"></el-option>
          <el-option label="其他" value></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品分类">
        <el-select v-model="formData.categoryID" placeholder="商品分类">
          <el-option
            v-for="(item, index) in categoryList"
            v-show="item.categoryName"
            :key="index"
            :label="item.categoryName"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>

      <p>
        <span style="font-size: 14px; font-weight: 700; color: #606266;">商品参数</span>
        <el-button
          :circle="true"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="addDomain('parameter')"
        ></el-button>
        <el-button
          :circle="true"
          icon="el-icon-minus"
          size="mini "
          type="danger"
          v-show="formData.parameter.length > 1"
          @click="delDomain('parameter')"
        ></el-button>
      </p>
      <el-form-item v-for="(data, index) in formData.parameter" :key="index + 'afaf1242'">
        <el-input v-model="data.name" style="width: 200px; margin-right: 20px"></el-input>
        <el-input v-model="data.value" style="width: 200px;"></el-input>
      </el-form-item>

      <el-form-item label="商品小图">
        <el-upload
          action="/upload/img?type=small"
          :multiple="true"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemoveSmallImg"
          :on-success="handleSuccessSmallImg"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>
      </el-form-item>

      <el-form-item label="商品大图">
        <el-upload
          action="/upload/img?type=big"
          :multiple="true"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>
      </el-form-item>

      <el-form-item label="商品详情">
        <div>
          <tinymce :height="600" v-model="formData.productMsg" @successImg="getEditorImg"></tinymce>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('forms')" style="margin: 0 20px ">提交</el-button>
        <el-button @click="resetForm('forms')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deleteImg, delBatchImg } from "@/api/img";
import Tinymce from "@/components/Tinymce";
import { getCategoryList } from "@/api/category";
import { addGoods } from "@/api/goods";

export default {
  components: { Tinymce },
  data() {
    return {
      title: "添加商品",
      labelPosition: "top", // 表单对齐方式
      dialogImageUrl: "",
      dialogVisible: false,
      categoryList: [],
      priceTips: "",
      discountTips: "",
      salePriceTips: "",
      limitNumTips: "",
      inventoryTips: '',
      postageTips: "",
      editorImgUrl: [] // 存放文本编辑器图片数组
    };
  },
  created() {
    // 获得商品分类列表
    getCategoryList({ all: "list" }).then(response => {
      if (response.data.code === "0") {
        this.categoryList = response.data.data;
      } else {
        console.err(response.data.msg);
      }
    });
  },
  watch: {
    "formData.price": function() {
      if (this.formData.discount === 0) {
        this.formData.salePrice = this.formData.price;
      } else {
        this.formData.salePrice =
          (this.formData.price * this.formData.discount) / 10;
      }
    },
    "formData.discount": function() {
      if (this.formData.discount === 0) {
        this.formData.salePrice = this.formData.price;
      } else {
        this.formData.salePrice =
          (this.formData.price * this.formData.discount) / 10;
      }
    }
  },
  computed: {
    ...mapState({ formData: state => state.goods.addGoods })
  },
  methods: {
    submitForm(formName) {
      if (!this.formData.productImage[0]) {
        this.$message.error("需要上传大图片");
        return;
      } else if (!this.formData.categoryID) {
        this.$message.error("请选择商品分类");
        return;
      }
      // 对编辑器中的图片做处理，如果上传成功后在编辑器中删除了图片，需要删除本地上传的图片
      // 提取编辑器文本中图片数组
      let arrImg = this.matchImagePath(this.formData.productMsg) || [];
      if (this.editorImgUrl[0]) {
        let deleteImg = [];
        this.editorImgUrl.forEach(item => {
          if (!arrImg.includes(item)) {
            deleteImg.push(item);
          }
        });
        if (deleteImg[0]) {
          // 从后台删除编辑中已经删除的图片
          delBatchImg({detailUrl: deleteImg});
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          addGoods(this.formData).then(response => {
            if (response.data.code === "0") {
              this.$store.commit("resetGoods"); // 清空添加内容
              this.$router.push({ name: "goodsList" }); // 跳转到商品列表页面
            } else {
              this.$message(response.data.msg);
            }
          });
        } else {
          this.$message.error("输入不合法");
          return false;
        }
      });
    },
    resetForm(formName) {
      //删除小图片, 大图片，富文本图片
      if (this.editorImgUrl[0] || this.formData.smallImage[0] || this.formData.productImage[0]) {
        delBatchImg({
          detailUrl: this.editorImgUrl,
          smallUrl: this.formData.smallImage,
          bigUrl: this.formData.productImage
        })
      }
      window.location.reload(true);
    },
    // 编辑器上传成功后的图片路径
    getEditorImg(url) {
      let img = url.map(item => item.url);
      this.editorImgUrl.push(...img);
    },
    //动态添加域
    addDomain(value) {
      if (value == "color") {
        this.formData.color.push({ value: "" });
      } else if (value == "size") {
        this.formData.size.push({ value: "" });
      } else if (value == "parameter") {
        this.formData.parameter.push({
          name: "",
          value: ""
        });
      }
    },
    //动态删减域
    delDomain(value) {
      if (value == "color") {
        this.formData.color.pop();
      } else if (value == "size") {
        this.formData.size.pop();
      } else if (value == "parameter") {
        this.formData.parameter.pop();
      }
    },
    // 移除小图片
    handleRemoveSmallImg(file, fileList) {
      let url = file.response.imgPath;
      deleteImg(url).then(response => {
        if (response.data.code === "0") {
          //删除数组中的地址
          this.formData.smallImage.splice(
            this.formData.smallImage.indexOf(url),
            1
          );
        } else {
          this.$message.err(response.msg);
        }
      });
    },
    // 移除大图
    handleRemove(file, fileList) {
      let url = file.response.imgPath;
      deleteImg(url).then(response => {
        if (response.data.code === "0") {
          //删除数组中的地址
          this.formData.productImage.splice(
            this.formData.productImage.indexOf(url),
            1
          );
        } else {
          this.$message.err(response.msg);
        }
      });
    },
    // 预览单张图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 小图上传成功
    handleSuccessSmallImg(response, file, fileList) {
      if (response.code === "0") {
        this.formData.smallImage.push(response.imgPath);
        this.$message({
          type: "success",
          message: "小图上传成功"
        });
      }
    },
    // 大图上传成功
    handleSuccess(response, file, fileList) {
      if (response.code === "0") {
        this.formData.productImage.push(response.imgPath);
        this.$message({
          type: "success",
          message: "大图上传图成功"
        });
      }
    },
    // 价格校验
    validatePrice(value) {
      switch (value) {
        case "price":
          if (this.formData.price < 0) {
            this.priceTips = "价格不能为负数";
            this.formData.price = 0;
          } else {
            this.resetTips();
          }
          break;
        case "discount":
          if (this.formData.discount < 0 || this.formData.discount > 10) {
            this.discountTips = "输入不合法，折扣要在 0 ~ 10 之间";
            this.formData.discount = 0;
          } else {
            this.resetTips();
          }
          break;
        case "salePrice":
          if (this.formData.salePrice < 0) {
            this.salePriceTips = "折扣价格要大于0";
            this.formData.salePrice = 0;
          } else {
            this.resetTips();
          }
          break;
        case "limitNum":
          if (this.formData.limitNum < 0) {
            this.limitNumTips = "输入不合法，限制购买数量不能小于0";
            this.formData.limitNum = 0;
          } else {
            this.resetTips();
          }
          break;
        case "inventory":
          if (this.formData.inventory < 0) {
            this.inventoryTips = "输入不合法，商品库存数量不能小于0";
            this.formData.inventory = 0;
          } else {
            this.resetTips();
          }
          break;
        case "postage":
          if (this.formData.postage < 0) {
            this.postageTips = "输入不合法，邮费不能小于0";
            this.formData.limitNum = 0;
          } else {
            this.resetTips();
          }
          break;
        default:
          this.resetTips();
      }
    },
    resetTips() {
      this.priceTips = "";
      this.discountTips = "";
      this.salePriceTips = "";
      this.limitNumTips = "";
      this.inventoryTips = "";
      this.postageTips = "";
    },
    // 匹配文本编辑器中字符串的图片路径
    matchImagePath(str) {
      if (str) {
        // 匹配img标签
        let imgArr = str.match(/<img.*?src="(.*?)".*?\/?>/gi);
        let srcArr = [];
        // 匹配src值
        if (Array.isArray(imgArr) && imgArr[0]) {
          srcArr = imgArr.map(
            item => item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
          );
        }
        return srcArr;
      }
    }
  }
};
</script>

<style  scoped>
.ui-container {
  margin: 20px 20px 60px 20px;
}
.ui-input {
  width: 600px;
}
.ui-tips {
  color: #f56c6c;
}
</style>


