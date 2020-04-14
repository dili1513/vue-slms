<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- ID -->
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 100px;" class="filter-item"
                @keyup.enter.native="queryFaults"/>
      <!-- 重要性 -->
      <el-select v-model="listQuery.importance" placeholder="故障程度" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <!-- aid -->
      <el-input v-model="listQuery.aid" placeholder="维修人员ID" style="width: 105px;" class="filter-item"
                @keyup.enter.native="queryFaults"/>
      <!-- 类型框 -->
      <el-select v-model="listQuery.type" placeholder="故障类型" clearable class="filter-item" style="width: 135px">
        <el-option v-for="item in eventOptions" :key="item.key" :label="item.key" :value="item.key"/>
      </el-select>
      <!-- 状态框 -->
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.key" :value="item.value"/>
      </el-select>
      <!-- 时间范围 -->
      <!--      入职日期：-->
      <el-date-picker v-model="listQuery.dateScope"
                      type="daterange"
                      sizi="mini"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      unlink-panels
                      class="filter-item"
                      value-format="yyyy-MM-dd"/>

      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="queryFaults">
        搜索
      </el-button>
    </div>


    <div style="margin-top: 10px">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="faultDate"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- 序号! -->
        <el-table-column label="ID" prop="id" align="center" width="80">
          <!--获得该行的数据-->
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <!-- 时间! -->
        <el-table-column label="故障时间" prop="datetime" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date}}</span>
          </template>
        </el-table-column>
        <!-- 类型！ -->
        <el-table-column label="故障类型" prop="type" min-width="150" align="center">
          <!--<template slot-scope="{row}">
            <span v-if="row.status !== 'unDistribution' " class="link-type"">{{ row.type }}</span>
            <span v-else @click="handleNoWO">{{ row.type }}</span>
          </template>-->
        </el-table-column>
        <!-- 位置! -->
        <el-table-column label="位置" prop="address" width="300" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <!-- 时限! -->
        <el-table-column label="时限" prop="limitTime" width="110" align="center">
          <template slot-scope="scope">
            <span>{{4-scope.row.importance}} 天</span>
          </template>
        </el-table-column>

        <el-table-column label="故障程度" prop="importance" width="80px">
        </el-table-column>
        <!-- 维修人员！ -->
        <el-table-column label="维修人员" prop="account.name" align="center" width="200">
          <template slot-scope="{row}">
            <span v-if="row.status !== 'unDistribution'" class="link-type" @click="handleFetchRM(row.account)">{{ row.account.name }}</span>
            <span v-else style="color: red">{{row.status | statusFilter}}</span>
          </template>
        </el-table-column>
        <!-- 状态! -->
        <el-table-column label="状态" prop="status" class-name="status-col" width="200">
          <template slot-scope="{row}">
            <el-tag size="medium">
              {{ row.status | statusFilter}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--     分页管理-->
    <div style="display: flex;justify-content: flex-end;margin-top: 10px">
      <el-pagination background
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     layout="total,sizes,prev,pager,next,jumper,->,slot"
                     :page-sizes="[5,10,20,50,100]"
                     :total="total">
      </el-pagination>
    </div>

    <!--    点击维修人员，弹出维修人员信息对话框-->
    <el-dialog :visible.sync="dialogMTVisible" title="维修人员详细信息">
      <table>
        <tr>
          <td class="td_left">账号</td>
          <td class="td_right">{{MTData.id}}</td>
        </tr>
        <tr>
          <td class="td_left">姓名</td>
          <td class="td_right">{{MTData.name}}</td>
        </tr>
        <tr>
          <td class="td_left">手机号</td>
          <td class="td_right">{{MTData.phone}}</td>
        </tr>
        <tr>
          <td class="td_left">性别</td>
          <td class="td_right">{{MTData.gender}}</td>
        </tr>
        <tr>
          <td class="td_left">年龄</td>
          <td class="td_right">{{MTData.age}}</td>
        </tr>
        <tr>
          <td class="td_left">身份证</td>
          <td class="td_right">{{MTData.idCard}}</td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogMTVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <!--        点击故障类型，弹出该故障对应的工单 先不写工单-->
    <!--<el-dialog :visible.sync="dialogWOVisible" title="工单">
      <table>
        <tr>
          <td class="td_left">工单编号</td>
          <td class="td_right">{{workOrder.id}}</td>
        </tr>
        <tr>
          <td class="td_left">故障时间</td>
          <td class="td_right">{{workOrder.eDate}}</td>
        </tr>
        <tr>
          <td class="td_left">维修期限</td>
          <td class="td_right">{{workOrder.eLimitTime}}</td>
        </tr>
        <tr>
          <td class="td_left">故障类型</td>
          <td class="td_right">{{workOrder.eType}}</td>
        </tr>
        <tr>
          <td class="td_left">故障地点</td>
          <td class="td_right">{{workOrder.eAddress}}</td>
        </tr>
        <tr>
          <td class="td_left">维修人员工号</td>
          <td class="td_right">{{workOrder.uid}}</td>
        </tr>
        <tr>
          <td class="td_left">维修人员</td>
          <td class="td_right">{{workOrder.uName}}</td>
        </tr>
        <tr>
          <td class="td_left">维修人员手机号</td>
          <td class="td_right">{{workOrder.uPhoneNumber}}</td>
        </tr>
        <tr>
          <td class="td_left">维修完成时间</td>
          <td class="td_right">{{workOrder.eDate}}</td>
        </tr>
        <tr v-if="workOrder.status === '已完成'">
          <td class="td_left">维修情况</td>
          <td class="td_right">{{workOrder.remarks}}</td>
        </tr>
        <tr v-if="workOrder.status === '已完成'">
          <td class="td_left">物资消耗</td>
          <td class="td_right">{{workOrder.goods}}</td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogWOVisible = false">确定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>

  const eventOptions = [
    {key: '正常寿终'},
    {key: '外玻璃壳破损'},
    {key: '启动装置失灵'},
    {key: '引线故障'},
    {key: '灯泡损坏'},
    {key: '电路异常'},
    {key: '间歇自熄'}
  ]

  const stateOptions = [
    {value: 'unDistribution', key: '未分配'},
    {value: 'ready', key: '分配中'},
    {value: 'fixing', key: '维修中'},
    {value: 'finished', key: '已完成'}
  ]

  export default {
    name: 'ComplexTable',
    filters: {
      statusFilter: function (value) {
        const statusMap = {
          'fixing': '已分配',
          'finished': '已完成',
          'ready': '分配中',
          'unDistribution': '未分配'
        };
        return statusMap[value];
      }
    },
    data() {
      return {
        tableKey: 0,
        faultDate: [],
        dialogMTVisible: false,
        dialogWOVisible: false,
        //maintainer 数据
        MTData: {},
        workOrder: {
          id: '',
          eDate: '',
          eAddress: '',
          uid: '',
          uName: '',
          uPhoneNumber: '',
          eType: '',
          eLimitTime: '',
          remarks: '',
          goods: '',
          status: ''
        },
        // 分页信息
        total: 0,
        page: 1,
        size: 10,
        listLoading: false,
        listQuery: {
          id: undefined,
          type: undefined,
          dateScope: undefined,
          aId: undefined,
          importance: undefined,
          status: undefined
        },
        importanceOptions: [1, 2, 3],
        eventOptions,
        stateOptions,
        dialogFormVisible: false,
        dialogStatus: '',
        downloadLoading: false
      }
    },
    mounted() {
      this.initFaults();
    },
    methods: {
      // 跳页
      currentChange(currentPage) {
        this.page = currentPage;
        this.initFaults('query');
      },
      sizeChange(currentSize) {
        this.size = currentSize;
        this.initFaults('query');
      },
      // 点击搜索时从第一页显示
      queryFaults(){
        this.page = 1;
        this.initFaults('query');
      },
      initFaults(type) {
        console.log(this.listQuery);
        let url = "/fault/info/?page=" + this.page + "&size=" + this.size;
        if (type && type == 'query') {
          if (this.listQuery.id) {
            url += "&id=" + this.listQuery.id;
          }
          if (this.listQuery.type) {
            url += "&type=" + this.listQuery.type;
          }
          if (this.listQuery.aId) {
            url += "&aId=" + this.listQuery.aId;
          }
          if (this.listQuery.importance) {
            url += "&importance=" + this.listQuery.importance;
          }
          if (this.listQuery.status) {
            url += "&status=" + this.listQuery.status;
          }
          if (this.listQuery.dateScope) {
            url += "&dateScope=" + this.listQuery.dateScope;
          }
        }
        this.getRequest(url).then(resp => {
          if (resp) {
            this.total = resp.total;
            this.faultDate = resp.data;
            console.log(this.faultDate);
          }
        })
      },
      //维修人员详细信息---------------------------------------------------------
      handleFetchRM(account) {
        this.dialogMTVisible = true
        // 有错误后 再一一赋值
        this.MTData = account
      },
      //获取工单----------------------------
      /*handleFetchWO(row) {
        fetchRepairman(row.uid).then(
          response => {
            this.MTData = response.data[0]
          }
        )
        this.dialogWOVisible = true
        this.workOrder.id = row.id
        this.workOrder.eType = row.type
        this.workOrder.eLimitTime = row.limitTime
        this.workOrder.eDate = row.datetime
        this.workOrder.eAddress = row.address
        this.workOrder.status = row.status
        this.workOrder.uid = row.uid
        this.workOrder.uName = this.MTData.name
        this.workOrder.uPhoneNumber = this.MTData.phoneNumber
        this.workOrder.remarks = '维修顺利完成，可以正常使用。'
        this.workOrder.goods = 'xxxx路灯：1 个'
      },*/
      //未分配给出消息提示
      handleNoWO() {
        this.$message.warning('故障未分配，还未生成工单')
      }
    }
  }
</script>

<style scoped>

  .filter-container {
    display: flex;
    justify-items: center;
  }

  .filter-item {
    margin-right: 2px;
  }

  .td_left {
    width: 150px;
    text-align: right;
    height: 45px;
    font-weight: bold;
    font-size: 17px;
  }

  .td_right {
    padding-left: 50px;
    font-size: 17px;
  }

  .link-type,
  .link-type:focus {
    color: #337ab7;
    cursor: pointer;

  &
  :hover {
    color: rgb(32, 160, 255);
  }

  }
</style>

