<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <!-- 按钮 -->
    <el-row>
      <el-button type="success" plain>添加分类</el-button>
    </el-row>
    <el-table
      :data="data"
      border
      stripe
      v-loading="loading"
      style="width: 100%">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        width="400"
        treeKey="cat_id"
        levelKey="cat_level"
        childKey="children"
        parentKey="cat_pid">
      </el-table-tree-column>
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level=== 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
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
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[6, 8, 10, 12]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
import ElementTreegrid from 'element-tree-grid';

export default {
  components: {
    'el-table-tree-column': ElementTreegrid
  },
 data() {
    return {
      data: [],
      pagenum: 1,
      pagesize: 6,
      total: 0,
      loading: true
    };
  },
  created () {
    this.loadData();
  },
  methods: {
    async loadData () {
      this.loading = true;
      const response = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
       this.loading = false;
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.total = response.data.data.total;
        this.$message.success(msg);
        this.data = response.data.data.result;
        console.log(this.data);
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
