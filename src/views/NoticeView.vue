<template>
  <div>
    <!--    查询区域-->
    <el-card>
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入公告标题" clearable></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()" icon="el-icon-search">查询</el-button>
      <el-button @click="reset()" icon="el-icon-refresh">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()" icon="el-icon-plus">新增</el-button>
    </el-card>
    <!--    内容区域-->
    <el-card style="margin-top:20px;">
            <el-table :data="tableData" style="width: 100%; margin: 15px 0px" stripe>
              <el-table-column type="index" label="序号" width="180" align="center"></el-table-column>
              <el-table-column prop="name" label="公告标题" width="180" align="center"></el-table-column>
              <el-table-column prop="content" label="公告内容" width="180" align="center"></el-table-column>
              <el-table-column prop="time" label="更新时间" width="180" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="edit(scope.row)" icon="el-icon-edit" circle></el-button>
                  <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.id)">
                    <el-button slot="reference" type="danger" style="margin-left: 5px" icon="el-icon-delete"
                               circle></el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>



    </el-card>
    <!--新增或者编辑的弹窗-->
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="公告标题" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" label-width="20%">
            <el-input v-model="form.content" autocomplete="off" type="textarea" style="width: 90%"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--    分页器-->
    <div style="margin-top: 10px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pageNum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'admin',
  data() {
    return {
      //查询参数
      params: {
        name: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0, //总记录数
      dialogFormVisible: false, //新增弹出框的显示与隐藏
      form: {},
      tableData: [],
      loading: false

    }
  },
  created() {
    //获取列表数据
    this.findBySearch()
  },
  methods: {
    //1.获取列表数据
    findBySearch() {
      this.loading = true
      request.get("/notice/search", {
        params: this.params
      }).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.loading = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      })
    },
    //2.重置功能
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 5,
        name: '',
        phone: ''
      }
      this.findBySearch();
    },
    //3.每页显示条数变化事件（5,10,15页切换时触发）
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.findBySearch();
    },
    //4.当前页改变事件（点击去第几页，就会触发）
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.findBySearch();
    },
    //5.新增打开弹窗
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    // 6.编辑打开弹窗
    edit(obj) {
      this.form = JSON.parse(JSON.stringify(obj)); //深拷贝
      this.dialogFormVisible = true;
    },
    //7.删除事件
    del(id) {
      request.delete("/notice/" + id).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.findBySearch();
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      })
    },
    //8.新增或修改的确定按钮
    submit() {
      request.post("/notice", this.form).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.findBySearch();
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      })
    }
  }
}
</script>

<style scoped>

</style>