<template>
  <el-card>
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
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
        prop="order_number"
        label="订单编号"
        width="400">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否罚款"
        width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.order_pay === 1">付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间"
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
            @click="openEditDialog(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain>
          </el-button>
          <el-button
            @click="handleDelete(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain>
          </el-button>
          <el-button
            @click="handleOpenSetRoleDialog(scope.row)"
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      data: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  created () {
    this.loadData();
  },
  methods: {
    async loadData () {
      const response = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(response);

      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.total = response.data.data.total;
        this.data = response.data.data.goods;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
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
