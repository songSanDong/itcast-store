<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      :closable="false"
      type="warning"
      show-icon>
    </el-alert>
    <el-row>
      <el-col :span="24">
        请选择商品分类：
        <el-cascader
          placeholder="请选择商品分类"
          expand-trigger="hover"
          :options="options"
          :props="{ label: 'cat_name', value: 'cat_id' }"
          v-model="selectedOptions"
          @change="handleChange">
        </el-cascader>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="this.selectedOptions.length !== 3">添加动态参数</el-button>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" :disabled="this.selectedOptions.length !== 3">静态参数</el-button>
      </el-tab-pane>
    </el-tabs>
    <!-- 表格 -->
    <el-table
      border
      stripe
      :data="data"
      style="width:100">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="cat_name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="时间"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM--DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
         <template slot-scope="scope">
          <!-- scope.row 是当前行绑定的数据对象 -->
           <!-- {{ scope.$index }} -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain>
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain>
          </el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 多级下拉，绑定的数据
      options: [],
      selectedOptions: [],
      // tab绑定的数据
      activeName: 'many',
      data: []
    };
  },
   created() {
    this.loadOptions();
  },
  methods: {
    // 多级下拉，选中内容改变之后
    handleChange() {
    },
    async loadOptions () {
      const response = await this.$http.get('categories?type=3');
      this.data = response.data.data;
      console.log(response);
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
