<template>
  <div>
    <!--    查询区域-->
    <el-card>
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入请假原有" clearable></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()" icon="el-icon-search">查询</el-button>
      <el-button @click="reset()" icon="el-icon-refresh">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()" icon="el-icon-plus">新增</el-button>
    </el-card>
    <!--    内容区域-->
    <el-card style="margin-top:20px;">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="请假原由"></el-table-column>
        <el-table-column prop="time" label="请假日期"></el-table-column>
        <el-table-column prop="day" label="请假天数"></el-table-column>
        <el-table-column prop="userName" label="请假用户"></el-table-column>
        <el-table-column prop="status" label="审核状态"></el-table-column>
        <el-table-column prop="reason" label="审核意见"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)" v-if="user.role === 'ROLE_STUDENT'">编辑</el-button>
            <el-button type="success" @click="audit(scope.row)" v-if="user.role !== 'ROLE_STUDENT'">审核</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.id)">
              <el-button slot="reference" type="danger" style="margin-left: 5px">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>


    </el-card>
    <!--新增或者编辑的弹窗-->
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="请假原由" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="请假日期" label-width="20%">
            <el-date-picker v-model="form.time" type="date" style="width: 90%" placeholder="选择日期"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="请假天数" label-width="20%">
            <el-input v-model="form.day" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--    审核弹窗-->
    <div>
      <el-dialog title="请审核" :visible.sync="auditVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="审核状态" label-width="20%">
            <el-radio v-model="form.status" label="审核通过"></el-radio>
            <el-radio v-model="form.status" label="审核不通过"></el-radio>
          </el-form-item>
          <el-form-item label="审核意见" label-width="20%">
            <el-input v-model="form.reason" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="auditVisible = false">取 消</el-button>
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
  name: 'audit',
  data() {
    return {
      //查询参数
      params: {
        name: '',
        phone: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0, //总记录数
      dialogFormVisible: false, //新增弹出框的显示与隐藏
      form: {},
      tableData: [],
      loading: false,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      auditVisible: false

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
      request.get("/audit/search", {
        params: this.params
      }).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.loading = false
        } else {
          this.$message.error(res.msg);
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
      this.form.userId = this.user.id; //新增传入用户ID
      this.dialogFormVisible = true;
    },
    // 6.编辑打开弹窗
    edit(obj) {
      this.form = JSON.parse(JSON.stringify(obj)); //深拷贝
      this.dialogFormVisible = true;
    },
    //7.删除事件
    del(id) {
      request.delete("/audit/" + id).then(res => {
        if (res.code === '0') {
          this.$message.success("删除成功");
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //8.新增或修改的确定按钮
    submit() {
      request.post("/audit", this.form).then(res => {
        if (res.code === '0') {
          this.$message.success("操作成功");
          this.dialogFormVisible = false;
          this.auditVisible = false; //关闭审核弹窗
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
  //  点击审核按钮打开审核弹窗
    audit(obj) {
      this.form = obj;
      this.auditVisible = true;
    },
  }
}
</script>

<style scoped>

</style>