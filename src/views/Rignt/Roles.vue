<template>
  <el-card class="card">
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-row>
      <el-button type="primary" plain class="anniu">添加角色</el-button>
    </el-row>
    <el-table
      :data="data"
      v-loading="loading"
      stripe
      border
      style="width: 100%">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
          class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id">
              <el-col :span="4">
                <!-- 显示一级权限的名称 -->
                <el-tag
                  closable>
                  {{ level1.authName }}
                </el-tag>
              </el-col>
              <el-col :span="20">
              <!-- 二级权限 -->
              <el-row
                v-for="level2 in level1.children"
                :key="level2.id">
                  <el-col :span="4">
                    <!-- 显示二级权限的名称 -->
                    <el-tag
                      type="success"
                      closable>
                      {{ level2.authName }}
                    </el-tag>
                  </el-col>
                  <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    class="level3"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    type="warning">
                    {{ level3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="220">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="220">
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
      data: [],
      loading: true
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const response = await this.$http.get('roles');
      this.loading = false;
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
 }
 .anniu {
  margin: 10px 0;
 }
 .level3 {
  margin-right: 15px;
  margin-bottom: 15px;
}
.level1 {
  margin-bottom: 10px;
}
</style>
