<template>
    <el-card class="card">
      <!-- 面包屑组件 -->
      <div class="mianbao">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 搜索 -->
      <el-row class="searchRow">
        <el-col :span="24">
          <el-input placeholder="请输入内容" class="searchInput">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" plain>添加用户</el-button>
        </el-col>
      </el-row>
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
          prop="username"
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
          prop="mg_state"
          label="用户状态"
          width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
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
      <!-- 分页 -->
      <!--
        current-page 当前页码
        page-size 每页显示多少条数据
        pager-count 最多产生的数字按钮个数,大于等于 5 且小于等于 21 的奇数
        total   总共多少条数据，发送请求获取
         @size-change  每页显示多少条改变的时候
        @current-change 当前页码改变的时候
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        :pager-count="9"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </el-card>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      // 分页相关数据
      // 页码
      pagenum: 1,
      // 每页显示多少条数据
      pagesize: 2,
      // 总共多少条数据
      count: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData () {
      var token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      var { meta: {status, msg} } = response.data;
      // Vue.prototype.$http = axios; 在main.js中
      // this.$http.get()
      console.log(response);
      if (status === 200) {
        this.count = response.data.data.total;
        this.data = response.data.data.users;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页的方法
    handleSizeChange (val) {
      // 每页条数发生变化
      this.pagesize = val;
      this.loadData();
      console.log(`每页${val}条`);
    },
    handleCurrentChange (val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页码是${val}`);
    }
  }
};
</script>
<style>
  .card {
    height: 100%;
  }
  .searchInput {
    width: 300px;
  }
  .searchRow {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
