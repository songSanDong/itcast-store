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
          <div class="tuichu"><a href="#">退出</a></div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {

}
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
  }
</style>
