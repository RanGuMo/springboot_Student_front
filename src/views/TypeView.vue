<template>
  <div>
    <!--    查询区域-->
    <el-card>
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入分类名称" clearable></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()" icon="el-icon-search">查询</el-button>
      <el-button @click="reset()" icon="el-icon-refresh">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()" icon="el-icon-plus">新增</el-button>
      <el-popconfirm title="确定删除这些数据吗？" @confirm="delBatch()">
        <el-button slot="reference" type="danger" style="margin-left: 5px" :disabled="multipleSelection.length==0">
          批量删除
        </el-button>
      </el-popconfirm>
      <el-button type="success" style="margin-left: 10px" @click="exp()">批量导出</el-button>
      <el-upload action="http://localhost:9528/api/type/upload" style="display: inline-block; margin-left: 10px"
                 :show-file-list="false" :on-success="successUpload">
        <el-button size="small" type="primary">批量导入</el-button>
      </el-upload>
    </el-card>
    <!--    内容区域-->
    <el-card style="margin-top:20px;">
      <el-table :data="tableData" style="width: 100%; margin: 15px 0px" stripe v-loading="loading" :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>

        <el-table-column prop="name" label="分类名称" width="150" align="center"></el-table-column>
        <el-table-column prop="description" label="分类描述" align="center"></el-table-column>
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
          <el-form-item label="分类名称" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="分类描述" label-width="20%">
            <el-input v-model="form.description" autocomplete="off" style="width: 90%"></el-input>
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
      loading: false,
      multipleSelection: [], //批量删除


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
      request.get("/type/search", {
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
      obj = JSON.parse(JSON.stringify(obj)); //深拷贝
      this.form = obj
      this.dialogFormVisible = true;
    },
    //7.删除事件
    del(id) {
      request.delete("/type/" + id).then(res => {
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
      request.post("/type", this.form).then(res => {
        if (res.code === '0') {
          this.$message.success("操作成功");
          this.dialogFormVisible = false;
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //9.1.批量删除选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //9.2.批量删除事件
    delBatch() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请勾选您要删除的项")
        return
      }
      request.put("/type/delBatch", this.multipleSelection).then(res => {
        if (res.code === '0') {
          this.$message.success("批量删除成功")
          this.findBySearch()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //9.3.支持跨页批量删除(reserve-selection 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）)
    getRowKeys(row) {
      return row.id;
    },
    // 10.批量导出功能
    exp() {
      let user = localStorage.getItem("user");
      location.href = 'http://localhost:9528/api/type/export?token=' + JSON.parse(user).token
    },
    //11.批量导入之后成功的回调
    successUpload(res) {
      if (res.code === '0') {
        this.$message.success("批量导入成功")
        this.findBySearch()
      } else {
        this.$message.error(res.msg)
      }
    }


  }
}
</script>

<style scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  width: 98px;
  height: 98px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 98px;
  height: 98px;
  line-height: 98px;
  text-align: center;
}

.avatar {
  width: 98px;
  height: 98px;
  display: block;
}

</style>