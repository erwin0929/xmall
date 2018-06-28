<template>
  <div class="goods">
    <div class="nav">
      <div class="w">
        <a @click="sortByPrice('')" :class="{active:sort===''}" >综合排序</a>
        <a @click="sortByPrice(1)"  :class="{active:sort===1}">价格从低到高</a>
        <a @click="sortByPrice(-1)" :class="{active:sort===-1}">价格从高到低</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="价格" v-model="min">
          <span style="margin: 0 5px"> - </span>
          <input type="number" placeholder="价格" v-model="max">
          <y-button text="确定" classStyle="main-btn" @btnClick="sortByPrice(1)" style="margin-left: 10px;"></y-button>
        </div>
      </div>
    </div>

    <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
      <div class="img-item" v-if="!noResult">
        <!--商品-->
        <div class="goods-box w">
          <mall-goods v-for="(item, index) in goods" :key="index" :msg="item"></mall-goods>
        </div>

        <el-pagination
          v-if="!noResult&&!error"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[4, 8, 12, 16]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div class="no-info" v-if="noResult">
        <div class="no-data">
          <img src="/static/images/no-search.png">
          <br> 抱歉！暂时还没有商品
        </div>
        <section class="section">
          <y-shelf :title="recommendPanel.name">
            <div slot="content" class="recommend">
              <mall-goods :msg="item" v-for="(item,i) in recommendPanel.panelContents" :key="i"></mall-goods>
            </div>
          </y-shelf>
        </section>
      </div>
      <div class="no-info" v-if="error">
        <div class="no-data">
          <img src="/static/images/error.png">
          <br> 抱歉！出错了...
        </div>
        <section class="section">
          <y-shelf :title="recommendPanel.name">
            <div slot="content" class="recommend">
              <mall-goods :msg="item" v-for="(item,i) in recommendPanel.panelContents" :key="i"></mall-goods>
            </div>
          </y-shelf>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import data from '../../mock/index'
  import mallGoods from '../../components/mallGoods'
  import YButton from '../../components/YButton'
  import YShelf from '/components/shelf'
  export default {
    data () {
      return {
        // 商品列表
        goods: [],
        noResult: false,
        error: false,
        min: '',
        max: '',
        loading: true,
        timer: null,
        windowHeight: null,
        windowWidth: null,
        recommendPanel: [],
        sort: '',
        currentPage: 1,
        total: 0,
        pageSize: 8
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.loading = true
      this._getAllGoods(to.params.cid)
      next()
    },
    methods: {
      // 处理pageSize变动
      handleSizeChange (val) {
        this.pageSize = val
        this._getAllGoods()
        this.loading = true
      },
      // 处理当前页变动
      handleCurrentChange (val) {
        this.currentPage = val
        this._getAllGoods()
        this.loading = true
      },
      // 数据请求方法,参数发生改变就会调用(高频率调用)
      _getAllGoods (id) {
        let cid = this.$route.params.cid
        id ? cid = id : 1
        if (this.max !== '') {
          this.min = Math.floor(this.min)
        }
        if (this.max !== '') {
          this.max = Math.floor(this.max)
        }
        let params = {
          params: {
            page: this.currentPage,
            size: this.pageSize,
            sort: this.sort,
            priceGt: this.min,
            priceLte: this.max,
            cid: cid
          }
        }
        data.getData()
        // 读取数据
        axios.post('/goods/allGoods', params.params)
          .then((response) => {
            const { status, data: {total, list} } = response
            if (status === 200) {
              this.noResult = false
              this.total = total
              this.goods = list
              this.total === 0 && (this.noResult = true)
            }
            this.loading = false
          })
      },
      // 默认排序 sortType=1
      // 价格从低到高 sortType=2
      // 从高到低 sortType=3
      sortByPrice (v) {
        this.sort = v
        this.loading = true
        this._getAllGoods()
      }
    },
    created () {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
      this._getAllGoods()
      // recommend().then(res => {
      //   let data = res.result
      //   this.recommendPanel = data[0]
      // })
      this.recommendPanel = {}
    },
    components: {
      mallGoods,
      YButton,
      YShelf
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/style/mixin";
  @import "../../assets/style/theme";

  .nav {
    height: 60px;
    line-height: 60px;
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #5683EA;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }

  .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }

  .no-info {
    padding: 100px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    .no-data{
      align-self: center;
    }
  }

  .img-item{
    display: flex;
    flex-direction: column;
  }

  .el-pagination{
    align-self: flex-end;
    margin: 3vw 10vw 2vw;
  }

  .section {
    padding-top: 8vw;
    margin-bottom: -5vw;
    width: 1218px;
    align-self: center;
  }

  .recommend {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }



</style>
