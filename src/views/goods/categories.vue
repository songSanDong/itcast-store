<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <!-- 按钮 -->
    <el-row>
      <el-button type="success" plain @click="handleOpenAddDialog">添加分类</el-button>
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
            @click="handleOpenEditDialog(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain>
          </el-button>
          <el-button
            @click="handleDelete(scope.row.cat_id)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSize"
      @current-change="handleCurrent"
      :current-page="pagenum"
      :page-sizes="[6, 8, 10, 12]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
     <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogFormVisible">
      <el-form
        :model="form"
        label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类列表">
          <!--
            expand-trigger="hover"  鼠标悬停的时候触发
            options 绑定的数据
            v-model 双向绑定
            change-on-select  运行用户选择任意一级选项
            props 设置下拉框中显示数据源中的哪个属性的值
           -->
          <el-cascader
            placeholder="默认添加一级分类"
            clearable
            change-on-select
            expand-trigger="hover"
            :options="options"
            :props="defaultProps"
            v-model="catIds">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑按钮 -->
    <el-dialog
      title="修改商品分类"
      :visible.sync="editDialogFormVisible">
       <el-form
        :model="form"
        label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </span>
    </el-dialog>
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
      loading: true,
      addDialogFormVisible: false,
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: 0
      },
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      catIds: [],
      editDialogFormVisible: false,
      // 编辑的时候记录分类的id
      currentCatId: -1
    };
  },
  created () {
    this.loadData();
  },
  methods: {
    // 点击添加分类按钮的时候，显示添加分类对话框
    async handleOpenAddDialog() {
      this.addDialogFormVisible = true;
      const response = await this.$http.get('categories?type=3');
      this.options = response.data.data;
    },
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
    },
     // 分页的方法
    handleSize (val) {
      // 每页条数发生变化
      this.pagesize = val;
      this.loadData();
      console.log(`每页${val}条`);
    },
    handleCurrent (val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页码是${val}`);
    },
    // cat_name 绑定的文本框
    // cat_level  级别
    // 一级分类  0
    // 二级分类  1
    // 三级分类  2
    // cat_pid  添加的分类的，父节点的id
    // 父id   当是一级分类   0
    // 父id   当是二级分类
    // this.catIds 绑定的多级选择器的值，是一个数组
    // this.catIds.length === 0  要添加的分类是一级分类
    // this.catIds.length === 1  要添加的分类是二级分类
    // this.catIds.length === 2  要添加的分类是三级分类
    // 设置级别
    async handleAdd () {
      this.form.cat_level = this.catIds.length;
      // 设置父id
      if (this.catIds.length === 0) {
        this.form.cat_pid = 0;
      } else if (this.catIds.length === 1) {
        this.form.cat_pid = this.catIds[0];
      } else if (this.catIds.length === 2) {
        this.form.cat_pid = this.catIds[1];
      }
      const response = await this.$http.post('categories', this.form);
      // 判断是否添加成功
      const { meta: { status, msg } } = response.data;
      if (status === 201) {
        this.addDialogFormVisible = false;
        this.loadData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 删除分类
    handleDelete (id) {
      this.$confirm('是否要删除该分类?','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const response = await this.$http.delete(`categories/${id}`);
        const { meta: { status, msg } } = response.data;
        if(status === 200) {
          this.$message.success(msg);
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 编辑分类
    // 点击编辑按钮的时候，弹出编辑对话框
    // 存储 分类的id，分类的名称
    handleOpenEditDialog (cat) {
      // cat 当前分类的对象
      // console.log(cat.cat_name);
      // console.log(this.form.cat_name);
      this.form.cat_name = cat.cat_name;
      // console.log(this.form.cat_name);
      this.currentCatId = cat.cat_id;
      this.editDialogFormVisible = true;
    },
    // 编辑对话框中的确定按钮
    async handleEdit() {
      const response = await this.$http.put(`categories/${this.currentCatId}`, {
        cat_name: this.form.cat_name
      });
       // 判断修改是否成功
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        this.editDialogFormVisible = false;
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
