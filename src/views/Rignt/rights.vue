<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 表格 -->
    <el-table
      :data="data"
      stripe
      border
      style="width: 100%;margin: 10px 0;">
      <el-table-column
        label="#"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      data: [],
      loading: true
    };
  },
  created () {
  // 组件创建完毕，发送请求获取数据
    this.loadData();
  },
  methods: {
    async loadData () {
      var token = sessionStorage.getItem('token');
      this.loading = false;
      this.$http.defaults.headers.common['Authorization'] = token;
      const response = await this.$http.get('rights/list');
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.data = response.data.data;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>
<style>
  .card {
    height: 100%;
    padding: 0;
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
