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
            @click="handleOpenSetRightsDialog(scope.row)"
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
      <el-tree
        ref="tree"
        show-checkbox
        default-expand-all
        :data="treeData"
        node-key="id"
        :default-checked-keys="checkedList"
        :props="defaultProps">

      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible  = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
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
      setRightsDialogVisible: false,
      treeData: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 树默认选中的
      checkedList: [],
      // 角色 id
      currentRoleId: -1
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
    },
    async handleOpenSetRightsDialog (role) {
      this.currentRoleId = role.id;
      // 先清空数组不然上来默认都选中
      this.checkedList = [];
      // 点击弹出框
      this.setRightsDialogVisible = true;
      const response = await this.$http.get('rights/tree');
      this.treeData = response.data.data;
      role.children.forEach((level1) => {
        level1.children.forEach((level2) => {
          level2.children.forEach((level3) => {
            this.checkedList.push(level3.id);
          })
        })
      })
    },
    async handleSetRights () {
      // currentRoleId 角色id  -- 点击分配权限按钮记录
      // rids  权限id的列表
      // 全选的节点的id (3,5,6,7)
      const checkedList = this.$refs.tree.getCheckedKeys();
      // 半选的
      const halfCheckedList = this.$refs.tree.getHalfCheckedKeys();
      // 拼接数组
      const arr = [...checkedList, ...halfCheckedList];
      const response = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: arr.join(',')
      });
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        // 关闭弹框
        this.setRightsDialogVisible = false;
        this.loadData();
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
