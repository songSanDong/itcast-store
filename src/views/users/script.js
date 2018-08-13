export default {
  data() {
    return {
      data: [],
      // 分页相关数据
      // 页码
      pagenum: 1,
      // 每页显示多少条数据
      pagesize: 10,
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
      editUserDialogFormVisible: false,
      // 控制分配角色的对话框的显示隐藏
      setRoleDialogFormVisible: false,
      // 分配角色需要的数据
      currentName: '',
      // 绑定下拉框
      // 用户 id
      currentRoleId: -1,
      // 角色 id
      currentUserId: -1,
      // 角色列表
      roles: []
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
      });
    },
    // 对话框提示信息
    openEditDialog (user) {
      this.editUserDialogFormVisible = true;
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile = user.mobile;
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const response = await this.$http.delete(`users/${id}`);
        const { meta: { status, msg } } = response.data;
        if (status === 200) {
          // 判断当前页是否只有一条数据 并且当前页码是否是第一页
          if (this.data.length === 1 && this.pagenum !== 1) {
            this.pagenum--;
          };
          this.loadData();
          this.$message.success(msg);
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
      } else {
        this.$message.error(msg);
      }
    },
    async handleOpenSetRoleDialog (user) {
      // 弹框显示
      this.setRoleDialogFormVisible = true;
      this.currentName = user.username;
      this.currentUserId = user.id;
      const response = await this.$http.get('roles');
      this.roles = response.data.data;
      console.log(response);
    },
    async handleSetRole () {
      const response = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });
      const { meta: { status, msg } } = response.data;
      if(status === 200) {
        this.$message.success(msg);
        // 控制弹框消失
        this.setRoleDialogFormVisible = false;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
