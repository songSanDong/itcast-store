<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <el-input placeholder="请输入内容" class="input-with-select" style="width:300px">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 按钮 -->
    <el-button type="success" plain>添加分类</el-button>
    <el-table
      :data="data"
      height="500px"
      table
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(￥)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
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
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[6, 20, 30, 40]"
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
      pagesize: 6,
      total: 0
    }
  },
  created () {
    this.loadData();
  },
  methods: {
    // 获取商品列表
    async loadData() {
      const response = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      // 获取数据是否成功
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.data = response.data.data.goods;
        this.total = response.data.data.total;
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
