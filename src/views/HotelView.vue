<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入酒店名称"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()" v-if="user.role === 'ROLE_ADMIN'">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="酒店图片">
          <template v-slot="scope">
            <el-image
                style="width: 70px; height: 70px; border-radius: 50%"
                :src="'http://localhost:9528/api/files/' + scope.row.img"
                :preview-src-list="['http://localhost:9528/api/files/' + scope.row.img]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="酒店名称"></el-table-column>
        <el-table-column prop="price" label="酒店价格"></el-table-column>
        <el-table-column prop="num" label="剩余间数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)" v-if="user.role === 'ROLE_ADMIN'">编辑</el-button>
            <el-button type="primary" @click="reserve(scope.row)" v-if="user.role !== 'ROLE_ADMIN'">预订</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.id)">
              <el-button slot="reference" type="danger" style="margin-left: 5px" v-if="user.role === 'ROLE_ADMIN'">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="酒店名称" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="酒店图片" label-width="20%">
            <el-upload action="http://localhost:9528/api/files/upload" :on-success="successUpload">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="酒店价格" label-width="20%">
            <el-input v-model="form.price" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="剩余间数" label-width="20%">
            <el-input v-model="form.num" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      params: {
        name: '',
        author: '',
        pageNum: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.findBySearch();
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    findBySearch() {
      request.get("/hotel/search", {
        params: this.params
      }).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    edit(obj) {
      this.form = obj;
      this.dialogFormVisible = true;
    },
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 5,
        name: '',
        phone: ''
      }
      this.findBySearch();
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.findBySearch();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.findBySearch();
    },
    submit() {
      request.post("/hotel", this.form).then(res => {
        if (res.code === '0') {
          this.$message.success("操作成功");
          this.dialogFormVisible = false;
          this.findBySearch();
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    del(id) {
      request.delete("/hotel/" + id).then(res => {
        if (res.code === '0') {
          this.$message.success("删除成功");
          this.findBySearch();
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    successUpload(res) {
      this.form.img = res.data;
    },
    down(flag) {
      location.href = 'http://localhost:9528/api/files/' + flag
    },
    reserve(row) {
      let param = {hotelId: row.id, userId: this.user.id}
      request.post("/reserve", param).then(res => {
        if (res.code === '0') {
          this.$message.success("预订成功")
          this.findBySearch()
        } else {
          this.$message.error(res.msg)
        }
      })
    }

  }
}
</script>
