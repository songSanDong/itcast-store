<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon>
    </el-alert>
    <el-steps
      :active="active = 0"
      style="width:1000px;margin:20px 0"
      align-center
      finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <el-form
      label-position="top"
      :model="form"
      label-width="100px">
      <el-tabs
        @click="handleTabClick"
        tab-position="left"
        style="margin-top:20px">
        <el-tab-pane label="基本信息">
          <!-- 基本信息 -->
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              placeholder="请选择商品分类"
              clearable
              expand-trigger="hover"
              :options="options"
              :props="{ label: 'cat_name', value: 'cat_id', children: 'children' }"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
            <!-- <el-input v-model="form.name"></el-input> -->
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form-item
            v-for="item in dynamicParams"
            :key="item.attr_id"
            :label="item.attr_name">
            <el-checkbox
              checked
              v-for="param in item.params"
              :key="param"
              border
              :label="param">
            </el-checkbox>
          </el-form-item>
        </el-tab-pane>
         <el-tab-pane label="商品属性">
          <el-form-item
            v-for="item in staticParams"
            :key="item.attr_id"
            :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
export default {
  created () {
    this.loadOptions();
  },
  data () {
    return {
       active: 0,
      // 表单数据
      form: {
        goods_name: '',
        // 商品分类id,  1,2,3
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      },
      selectedOptions: [],
      options: [],
      selectedOptions: [],
      // 动态参数
      dynamicParams: [],
      // 静态参数
      staticParams: []
    }
  },
  methods: {
    handleTabClick (tab,event) {
      console.log(tab);
      console.log(event);
      this.active = tab.index - 0;
      if (tab.index === '1' || tab.index === '2') {
        if(this.selectedOptions.length !== 3) {
          this.$message.warning('请选择商品分类')
        } else {
          // 加载商品分类的参数列表
          this.loadParams();
        }
      }
    },
    handleChange () {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择3级分类')
        // 清空多级下拉中的内容
        this.selectedOptions.length = 0;
      }
    },
    // 加载多级下拉的数据
    async loadOptions() {
      const response = await this.$http.get('categories?type=3');
      this.options = response.data.data;
    },
    async loadParams () {
      const response = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
      this.dynamicParams = response.data.data;
      console.log(dynamicParams);
      this.dynamicParams.map((item) => {
        // 给对象新加一个属性
      item.params = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
      });
    }
  }
};
</script>
<style>
  .card {
    height: 100%;
  }
  .el-breadcrumb {
    background-color: #D3DCE6;
    height: 45px;
    line-height: 45px;
  }
  .el-card__body {
    padding: 0;
  }
</style>
