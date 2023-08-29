<template>
  <div>
    <!--    查询区域-->
    <el-card>
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入图书名称" clearable></el-input>
      <el-input v-model="params.author" style="width: 200px; margin-left: 5px" placeholder="请输入图书作者"
                clearable></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()" icon="el-icon-search">查询</el-button>
      <el-button @click="reset()" icon="el-icon-refresh">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()" icon="el-icon-plus">新增</el-button>
    </el-card>
    <!--    内容区域-->
    <el-card style="margin-top:20px;">
      <el-table :data="tableData" style="width: 100%; margin: 15px 0px" stripe>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="图书封面" width="100" align="center">
          <template v-slot="scope">
            <el-image
                style="width: 70px; height: 70px; border-radius: 50%"
                :src="'http://localhost:9528/api/files/' + scope.row.img"
                :preview-src-list="['http://localhost:9528/api/files/' + scope.row.img]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="图书名称" width="150" align="center"></el-table-column>
        <el-table-column prop="author" label="图书作者" width="120" align="center"></el-table-column>
        <el-table-column prop="price" label="图书价格" width="80" align="center"></el-table-column>
        <el-table-column prop="press" label="图书出版社" align="center"></el-table-column>
        <el-table-column prop="typeId" label="图书分类ID" align="center"></el-table-column>
        <el-table-column prop="typeName" label="图书分类" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)" icon="el-icon-edit" circle></el-button>
            <el-button type="primary" @click="down(scope.row.img)" icon="el-icon-download" circle></el-button>
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
          <el-form-item label="图书名称" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="图书封面" label-width="20%">
            <el-upload
                class="avatar-uploader"
                action="http://localhost:9528/api/files/upload" :on-success="successUpload"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!--            <el-upload action="http://localhost:9528/api/files/upload" :on-success="successUpload">-->
            <!--              <el-button size="small" type="primary">点击上传</el-button>-->
            <!--            </el-upload>-->
          </el-form-item>
          <el-form-item label="图书作者" label-width="20%">
            <el-input v-model="form.author" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="图书价格" label-width="20%">
            <el-input v-model="form.price" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="图书出版社" label-width="20%">
            <el-input v-model="form.press" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="图书分类" label-width="20%">
            <el-select v-model="form.typeId" placeholder="请选择" style="width: 90%">
              <el-option v-for="item in typeObjs" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
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
        author: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0, //总记录数
      dialogFormVisible: false, //新增弹出框的显示与隐藏
      form: {},
      tableData: [],
      loading: false,
      imageUrl: '',
      typeObjs: [] //分类下拉框的数据

    }
  },
  created() {
    //获取列表数据
    this.findBySearch()
    this.findTypes()
  },
  methods: {
    //0.获取所有的分类数据
    findTypes() {
      request.get("/type").then(res => {
        if (res.code === '0') {
          this.typeObjs = res.data;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //1.获取列表数据
    findBySearch() {
      this.loading = true
      request.get("/book/search", {
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
        author: ''
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
      this.imageUrl = '';
      this.form = {};
      this.dialogFormVisible = true;
    },
    // 6.编辑打开弹窗
    edit(obj) {
      obj = JSON.parse(JSON.stringify(obj)); //深拷贝
      this.imageUrl = 'http://localhost:9528/api/files/' + obj.img;
      this.form = obj
      this.dialogFormVisible = true;
    },
    //7.删除事件
    del(id) {
      request.delete("/book/" + id).then(res => {
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
      request.post("/book", this.form).then(res => {
        if (res.code === '0') {
          this.$message.success("操作成功");
          this.dialogFormVisible = false;
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //9.1上传图片之前的判断
    beforeAvatarUpload(file) {
      const allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']; // 添加允许的格式
      const isAllowedFormat = allowedFormats.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isAllowedFormat) {
        this.$message.error('上传图书封面只能是 JPG、PNG、WebP 或 GIF 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图书封面大小不能超过 5MB!');
      }
      return isAllowedFormat && isLt2M;
    },
    //9.2.图片上传成功的回调
    successUpload(res, file) {
      this.form.img = res.data;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //10.图片下载
    down(flag) {
      location.href = 'http://localhost:9528/api/files/' + flag
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