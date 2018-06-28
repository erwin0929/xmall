<!-- 收货地址 -->
<template>
  <div>
    <!-- 根据slot显示标题栏和是否有数据读取 -->
    <y-shelf title="收货地址">
      <!-- 右侧按钮 -->
      <span slot="right">
        <el-button type="primary" @click="addFormVisible = true">添加收货地址</el-button>
      </span>
      <div slot="content">
        <!-- 收货地址列表 start -->
        <el-table :data="addList" v-loading="loading">
          <el-table-column prop="addressId" label="id" width="180" align="center">
          </el-table-column>
          <el-table-column prop="userName" label="姓名" width="180" align="center">
          </el-table-column>
          <el-table-column prop="streetName" label="详细地址" align="center">
          </el-table-column>
          <el-table-column prop="tel" label="电话" width="180" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="update(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </y-shelf>
    <!-- 新增弹窗 -->
    <el-dialog title="添加收货地址" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="收货人姓名" :label-width="formLabelWidth">
          <el-input v-model="addForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.tel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <el-input v-model="addForm.streetName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAddress">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title="管理收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="editForm">
        <el-form-item label="收货人姓名" :label-width="formLabelWidth">
          <el-input v-model="editForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" :label-width="formLabelWidth">
          <el-input v-model="editForm.tel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <el-input v-model="editForm.streetName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import YButton from '/components/YButton'
  import YShelf from '/components/shelf'
  import axios from 'axios'
  import data from '../../../mock/index'
  export default {
    data () {
      return {
        // 收货人信息,通过mapState获取
        addList: [],
        // 是否编辑显示弹窗
        dialogFormVisible: false,
        // 新增弹窗
        addFormVisible: false,
        // 加载提示
        loading: false,
        // 编辑表单
        editForm: {
          userName: '',
          streetName: '',
          tel: ''
        },
        // 新增表单
        addForm: {
          userName: '',
          streetName: '',
          tel: ''
        },
        // 表单宽度
        formLabelWidth: '120px',
        popupOpen: false,
        popupTitle: '管理收货地址',
        msg: {
          addressId: '',
          userName: '',
          tel: '',
          streetName: '',
          isDefault: false
        },
        userId: ''
      }
    },
    computed: {
      btnHighlight () {
        let msg = this.msg
        return msg.userName && msg.tel && msg.streetName
      }
    },
    methods: {
      // 获取收货地址列表
      getAddress () {
        this.loading = true
        let userId = localStorage.getItem('userId')
        data.getData()
        axios.post('/member/getUserById', {userId})
          .then((response) => {
            let { data } = response
            if (data) {
              this.addList = data.address
              this.loading = false
            }
          })
      },
      message (m) {
        this.$message.error({
          message: m
        })
      },
      changeDef (item) {
        if (!item.isDefault) {
          item.isDefault = true
          this._addressUpdate(item)
        }
        return false
      },
      // 添加新地址
      addAddress () {
        axios.post('/addAdress', {addForm: this.addForm})
          .then((response) => {
            let {add} = response.data
            if (add) {
              this.addFormVisible = false
              this.addForm.userName = ''
              this.addForm.streetName = ''
              this.addForm.tel = ''
              this.getAddress()
            }
          })
      },
      // 保存
      save (p) {
        this.popupOpen = false
        if (p.addressId) {
          this._addressUpdate(p)
        } else {
          delete p.addressId
          this._addressAdd(p)
        }
      },
      // 删除地址
      del (index, row) {
        let {addressId} = row
        axios.post('/deleteAddress', {addressId, index})
          .then((response) => {
            let { isDelete } = response.data
            if (isDelete) {
              this.getAddress()
            }
          })
      },
      // 修改一条收货人信息
      update (index, row) {
        this.dialogFormVisible = true
        this.editForm = row
      }
    },
    mounted () {
      this.getAddress()
    },
    components: {
      YButton,
      YShelf
    }
  }
</script>
<style scoped lang="scss">
  .table-title {
    position: relative;
    z-index: 1;
    line-height: 38px;
    height: 38px;
    padding: 0 0 0 38px;
    font-size: 12px;
    background: #eee;
    border-bottom: 1px solid #dbdbdb;
    border-bottom-color: rgba(0, 0, 0, .08);
    .name {
      float: left;
      text-align: left;
    }
    span {
      width: 137px;
      float: left;
      text-align: center;
      color: #838383;
    }
    .address {
      margin-left: 115px;
    }
    .tel {
      margin-left: 195px;
    }
  }

  .address-item {
    display: flex;
    align-items: center;
    height: 115px;
    text-align: center;
    .name {
      width: 106px;
    }
    .address-msg {
      flex: 1;
    }
    .telephone {
      width: 160px;
    }
    .defalut {
      width: 80px;
      > a {
        text-align: center;
        /*display: none;*/
      }
    }
    .operation {
      width: 135px;
      a {
        padding: 10px 5px;
      }
    }
    &:hover {
      .defalut > a {
        display: block;
      }
    }
  }

  .address-item + .address-item {
    border-top: 1px solid #CFCFCF;
  }

  .defalut-address {
    color: #626262;
    display: block;
    pointer-events: none;
    cursor: default;
  }

  .md {
    > div {
      text-align: left;
      margin-bottom: 15px;
      > input {
        width: 100%;
        height: 50px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
        line-height: 46px;
      }
    }
  }

  .btn {
    margin: 0;
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 48px
  }
</style>
