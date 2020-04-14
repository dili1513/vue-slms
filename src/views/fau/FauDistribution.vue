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
      <div style="margin-right: 120px">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="queryFaults">
          搜索
        </el-button>
      </div>
      <div style="padding-top: 3px">
        <el-switch v-model="systemConfig.autoDistribution"
                   @change="updateAuto"
                   active-text="自动分配"
                   inactive-text="手动分配"></el-switch>
      </div>
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
        <el-table-column label="状态" prop="status" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <el-tag size="medium">
              {{ row.status | statusFilter}}
            </el-tag>
          </template>
        </el-table-column>
        <!--    操作    -->
        <el-table-column label="手动" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-if="row.status === 'unDistribution'" :disabled="systemConfig.autoDistribution" type="primary"
                       size="mini" @click="showAccountView(row)">
              分配
            </el-button>
            <el-button v-else="row.status === 'ready'" :disabled="systemConfig.autoDistribution" type="primary"
                       size="mini" @click="showAccountView(row)">
              重分配
            </el-button>
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
    <!--  点击分配或重新分配弹出分配对话框  -->
    <el-dialog :visible.sync="accountDialogVisible" title="分配任务">
      <!--   选中的维修人员信息   -->
      <el-form :model="temp">
        <el-row>
          <el-col :span="6">
            <el-form-item label="故障ID:">
              <span>{{temp.errorId}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="工号">
              <el-input v-model="temp.aId" style="width: 150px"/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="姓名">
              <el-input v-model="temp.aName" style="width: 150px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--   维修人员搜索框     -->
        <div class="filter-container">
          <!-- 工号 -->
          <el-input v-model="accountQuery.id" placeholder="工号" style="width: 120px;" class="filter-item"
                    @keyup.enter.native="queryAccount"/>
          <!-- 姓名 -->
          <el-input v-model="accountQuery.name" placeholder="姓名" style="width: 120px;" class="filter-item"
                    @keyup.enter.native="queryAccount"/>
          <!-- 地址 -->
          <el-input v-model="accountQuery.address" placeholder="地址" style="width: 300px;" class="filter-item"
                    @keyup.enter.native="queryAccount"/>
          <!-- 搜索按钮 -->
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="initAccount">
            搜索
          </el-button>
        </div>
      </el-form>
      <!--   维修人员列表   -->
      <el-table
        :data="accounts"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top: 20px"
      >
        <!-- 序号! -->
        <el-table-column label="工号" prop="id" align="center" min-width="20%">
        </el-table-column>

        <el-table-column label="姓名" prop="name" align="center" min-width="20%">
        </el-table-column>

        <el-table-column label="地址" prop="address" align="center" min-width="45%">
        </el-table-column>
        <!-- 操作! -->
        <el-table-column label="操作" align="center" min-width="15%" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="temp.aId = row.id;temp.aName = row.name">
              选择
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDistribution">
          取消
        </el-button>
        <el-button type="primary" @click="addAccount">
          确认
        </el-button>
      </div>
    </el-dialog>
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
  ]

  export default {
    name: 'ComplexTable',
    filters: {
      statusFilter: function (value) {
        const statusMap = {
          'ready': '分配中',
          'unDistribution': '未分配'
        };
        return statusMap[value];
      }
    },
    data() {
      return {
        //是否是自动分配 在mounted中加载 在el-switch上添加change当数据改变后更新数据库
        systemConfig: {},
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
        downloadLoading: false,
        // 分配维修人员对话框
        accountDialogVisible: false,
        // 分配维修人员的临时信息
        temp: {
          errorId: '',
          aId: '',
          aName: ''
        },
        // 分配维修人员的查询条件
        accountQuery: {
          id: '',
          name: '',
          address: ''
        },
        //  维修人员列表
        accounts: [],
      }
    },
    mounted() {
      this.initFaults();
      this.initAuto();
    },
    methods: {
      // 初始化autoDistribution
      initAuto() {
        this.getRequest('/fault/info/auto/').then(resp => {
          if (resp) {
            this.systemConfig = resp;
          }
        })
      },
      // 开关状态改变，更新数据库
      updateAuto() {
        this.putRequest('/fault/info/auto/', this.systemConfig);
      },
      // 跳页
      currentChange(currentPage) {
        this.page = currentPage;
        this.initFaults('query');
      },
      sizeChange(currentSize) {
        this.size = currentSize;
        this.initFaults('query');
      },
      // 点击搜索后从第一页开始显示
      queryFaults() {
        this.page = 1;
        this.initFaults('query');
      },
      initFaults(type) {
        // 该页面只需要未分配和分配中的故障信息，前端传一个part标记
        let url = "/fault/info/?part=1&page=" + this.page + "&size=" + this.size;
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
      // 点击显示分配窗口
      showAccountView(fault) {
        this.accountDialogVisible = true;
        this.temp.errorId = fault.id;
        this.initAccount();
      },
      //未分配给出消息提示
      handleNoWO() {
        this.$message.warning('故障未分配，还未生成工单')
      },
      //条件搜索维修人员
      queryAccount() {
        //  页码初始化为1 先不做分页
        //  查询
      },
      initAccountQuery() {
        this.accountQuery = {
          id: '',
          name: '',
          address: ''
        }
      },
      //初始化维修人员，在点击分配的时候调用
      initAccount() {
        let url = 'fault/info/account/?id=' + this.accountQuery.id + "&name=" + this.accountQuery.name + "&address=" + this.accountQuery.address;
        this.getRequest(url).then(resp => {
          this.accounts = resp;
        })
      },
      // 取消时关掉dialog，初始化查询维修人员的条件
      cancelDistribution(){
        this.accountDialogVisible = false
        this.initAccountQuery();
      },
      // 添加完成更新
      addAccount() {
        //之后添加表单验证
        this.getRequest('/fault/dis/manual?eId=' + this.temp.errorId + '&aId=' + this.temp.aId);
        this.initFaults();
        this.initAccountQuery();
      }
    }
  }
</script>

<style scoped>

  .filter-container {
    display: flex;
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

