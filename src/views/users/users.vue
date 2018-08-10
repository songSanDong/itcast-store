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
          <el-input
            clearable
            v-model="searchValue"
            placeholder="请输入内容"
            class="searchInput">
            <el-button
              slot="append"
              @click="handleSearch"
              icon="el-icon-search"></el-button>
          </el-input>
          <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
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
              @change="handleChange(scope.row)"
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
      <!-- 添加功能对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialogFormVisible">
        <el-form
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :model="form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户 -->
      <el-dialog
        @close="handleEditDialogClose"
        title="编辑用户"
        :visible.sync="editUserDialogFormVisible">
        <el-form
          ref="addForm"
          label-width="80px"
          :model="form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" readonly  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogFormVisible  = false">取 消</el-button>
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </div>
      </el-dialog>
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
      count: 0,
      // 绑定文本输入框
      searchValue: '',
      addUserDialogFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ]
      },
      // 控制编辑用户的对话框的显示隐藏
      editUserDialogFormVisible: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData () {
      var token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
      var { meta: {status, msg} } = response.data;
      // Vue.prototype.$http = axios; 在main.js中
      // this.$http.get()
      // console.log(response);
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
    },
    handleSearch () {
      this.loadData();
    },
    // 添加用户
    async handleAdd () {
      this.$refs.addForm.validate(async (valid) => {
        // valid 是否验证成功
        if (valid) {
          const response = await this.$http.post('users', this.form);
          // 判断添加是否成功
          const { data: { meta: { status, msg } } } = response;
          if (status === 201) {
            // 添加成功
            // 提示
            this.$message.success(msg);
            // 关闭对话框
            this.addUserDialogFormVisible = false;
            // 重新加载页面
            this.loadData();
            // 还原表达的默认值,就是可以清空表单, element 表单提供的方法
            this.$refs.addForm.resetFields();
          } else {
            // 添加失败
            this.$message.warning('表单验证失败');
          }
        }
      })
    },
    // 对话框提示信息
    openEditDialog (user) {
      this.editUserDialogFormVisible = true;
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile  = user.mobile ;
      this.form.id = user.id;
    },
    // 点击编辑窗口的确定按钮
    async handleEdit () {
      const response = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        this.editUserDialogFormVisible = false;
        this.loadData();
        // 清空表单
        for (var key in this.form) {
          this.form[key] = '';
        }
      } else {
        this.$message.error(msg);
      }
    },
    // close 事件处理
    handleEditDialogClose () {
      console.log(123);
      for (var key in this.form) {
        this.form[key] = '';
      }
    },
    // 删除操作
    async handleDelete (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const response = await this.$http.delete(`users/${id}`);
        const { meta: { status, msg } } = response.data;
        if(status === 200) {
          // 判断当前页是否只有一条数据 并且当前页码是否是第一页
          if (this.data.length === 1 && this.pagenum !== 1) {
              this.pagenum--;
              // 重新加载数据
              this.loadData();
            }
          this.$message.success(msg)
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async handleChange (user) {
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        console.log(1)
      } else {
        this.$message.error(msg);
        console.log(2)
      }
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
