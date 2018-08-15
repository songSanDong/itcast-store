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
                  @close="handleClose(scope.row, level1.id)"
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
                      @close="handleClose(scope.row, level2.id)"
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
                    @close="handleClose(scope.row, level3.id)"
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
            @click="setRightsDialogVisible = true"
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="权限设置"
      :visible.sync="setRightsDialogVisible">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible  = false">取 消</el-button>
        <el-button type="primary" @click="setRightsDialogVisible  = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      loading: true,
      setRightsDialogVisible: false
    };
  },
  created () {
    this.loadData();
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
    },
    // 点击 tag的删除按钮，删除当前角色对应的权限
    async handleClose(role, rightId) {
      // role 角色对象
      // roleId 角色id
      // rightId 权限id
      const response = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      console.log(response);
      console.log(response.data);
      // 判断是否成功
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        // 重新加载数据
        role.children = response.data.data;
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
  overflow: auto;
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
