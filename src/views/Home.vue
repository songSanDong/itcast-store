<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"><div>
          <img src="../assets/logo.png">
        </div></el-col>
        <el-col :span="19"><div>
          <div class="dianshang">电商后台管理系统</div>
        </div></el-col>
        <el-col :span="1">
          <div class="tuichu"><a href="#" @click.prevent="handleLogout">退出</a></div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-col :span="12" class="hellowYan">
          <!-- unique-opened 默认展开一项 -->
          <el-menu
            unique-opened
            router
            style="height: 100%">
            <el-submenu
              v-for="item in menus"
              :key="item.id"
              :index="item.id + ''">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="item1 in item.children"
                  :key="item1.id"
                  :index="'/' + item1.path">
                  <i class="el-icon-menu"></i>
                  {{ item1.authName }}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menus: []
    };
  },
  created () {
    this.loadMenus();
  },
  beforeCreate() {
    var token = sessionStorage.getItem('token');
    // 判断是否带有token
    if (!token) {
      this.$message.warning('请先登录');
      this.router.push('/login');
    }
  },
  methods: {
    handleLogout() {
      this.$message.success('退出成功');
      sessionStorage.clear();
      this.$router.push('/login');
    },
    async loadMenus () {
      const response = await this.$http.get('menus');
      this.menus = response.data.data;
    }
  }
};
</script>
<style>
  .container {
    height: 100%;
  }
  .header {
    background-color: #b3c0d1;
  }
  .header .dianshang {
    color: #fff;
    font-size: 24px;
    text-align: center;
    line-height: 60px;
  }
  .header .tuichu {
    line-height: 60px;
  }
  .header .tuichu a {
    color: orange;
    text-decoration: none;
  }
  .aside {
    background-color: #d3dce6;
  }
  .main {
    background-color: #e9eef3;
    padding: 0 20px;
  }
  .hellowYan {
    width: 100%;
    height: 100%;
  }
</style>
