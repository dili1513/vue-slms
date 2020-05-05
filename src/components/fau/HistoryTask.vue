<template>
  <div>
    <div style="margin-top: 10px">
      <el-table
        :data="tasks"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- 序号! -->
        <el-table-column label="ID" prop="id" align="center" width="50">
          <!--获得该行的数据-->
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <!-- 任务类型 -->
        <el-table-column label="任务类型" prop="status" align="center" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <el-tag size="medium" type="info" effect="dark">
              {{ row.status | taskTypeFilter}}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 时间! -->
        <el-table-column label="故障时间" prop="datetime" width="170" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date}}</span>
          </template>
        </el-table-column>
        <!-- 类型！ -->
        <el-table-column label="故障类型" prop="type" width="100" align="center">
        </el-table-column>
        <!-- 具体描述 -->
        <el-table-column label="详细信息" prop="des" width="150" align="center">
        </el-table-column>
        <!-- 位置! -->
        <el-table-column label="位置" prop="address" align="center">
        </el-table-column>
        <!-- 时限! -->
        <el-table-column label="时限" prop="limitTime" width="50" align="center">
          <template slot-scope="scope">
            <span>{{4-scope.row.importance}} 天</span>
          </template>
        </el-table-column>
        <el-table-column label="故障程度" prop="importance" width="70px" align="center">
        </el-table-column>
        <!-- 物资申请! -->
        <el-table-column label="物资" prop="goodsApply" width="100" align="center">
          <template slot-scope="scope">
            <!--            <span v-for="(item,index) in scope.row.goodsApply" :key="index">1</span>-->
            <el-tag v-if="scope.row.goodsApply[0] == null">未申请</el-tag>
            <el-tag type="info"
                    @click="showGoodsDetail(scope.row.id)"
                    v-if="scope.row.goodsApply[0] != null && scope.row.goodsApply[scope.row.goodsApply.length-1].applyStatus === '待审核'">
              申请中
            </el-tag>
            <el-tag type="success"
                    @click="showGoodsDetail(scope.row.id)"
                    v-if="scope.row.goodsApply[0] != null && scope.row.goodsApply[scope.row.goodsApply.length-1].applyStatus === '申请通过'">
              申请成功
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!--   申请物资对话框   -->
      <el-dialog
        title="申请物资"
        :visible.sync="dialogGoodsApply"
        width="30%">
        <span>任务ID：</span> {{addGoodsApply.errorId}}
        <div style="display: flex;align-items: center">
          <span>物资：</span>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入所需的物资..."
            style="margin-left: 12px; margin-top: 10px; width: 380px"
            v-model="addGoodsApply.detail">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelGoodsApply">取 消</el-button>
          <el-button type="primary" @click="doGoodsApply">确 定</el-button>
        </span>
      </el-dialog>
      <!--  物资详情对话框    -->
      <el-dialog
        title="物资详情"
        :visible.sync="dialogGoodsDetail"
        width="50%">
        <el-table :data="goodsApplies"
                  border
                  stripe
                  style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="任务编号" prop="errorId" width="50"></el-table-column>
          <el-table-column label="创建时间" prop="time" width="200"></el-table-column>
          <el-table-column label="申请物资" prop="detail"></el-table-column>
          <el-table-column label="状态" prop="applyStatus" width="200"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogGoodsDetail = false">取 消</el-button>
          <el-button type="primary" @click="dialogGoodsDetail = false">确 定</el-button>
        </span>
      </el-dialog>
      <!--  完成提交回单对话框    -->
      <el-dialog
        title="提交回单"
        :visible.sync="dialogFinish"
        width="30%">
        <el-input
          type="textarea"
          autosize
          placeholder="请输入故障原因"
          v-model="receipt.reason">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFinish">取 消</el-button>
          <el-button type="primary" @click="doFinish">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HistoryTask",
    data() {
      return {
        tasks: [],
        goodsApplies: [],
        dialogGoodsApply: false,
        dialogGoodsDetail: false,
        dialogFinish: false,
        receipt: {
          errorId: '',
          reason: '',
        },
        addGoodsApply: {
          errorId: '',
          detail: '',
        }
      }
    },
    filters: {
      taskTypeFilter: function (value) {
        const taskMap = {
          'fixing': '接受任务',
          'ready': '维修任务',
          'finished': '已完成',
        }
        return taskMap[value];
      }
    },
    mounted() {
      this.initTask();
    },
    methods: {
      initTask() {
        this.getRequest("/fault/task/history").then(resp => {
          this.tasks = resp;
        })
      },
      showGoodsApplyVisible(task) {
        this.dialogGoodsApply = true;
        this.addGoodsApply.errorId = task.id;
      },
      cancelGoodsApply() {
        this.dialogGoodsApply = false;
        this.initGoodsApply();
      },
      doGoodsApply() {
        // 发送请求
        this.postRequest("/fault/task/goods", this.addGoodsApply).then(resp => {
          if (resp) {
            this.initGoodsApply();
            this.dialogGoodsApply = false;
          }
        })
      },
      initGoodsApply() {
        this.addGoodsApply = {
          errorId: '',
          detail: '',
        }
      },
      // 物资申请详情
      showGoodsDetail(eId) {
        this.getRequest('/fault/task/goods?eId=' + eId).then(resp => {
          this.goodsApplies = resp;
          this.dialogGoodsDetail = true;
        })
      },
      // 接受 拒绝任务
      acceptTask(eId) {
        this.doAccept(eId, true);
      },
      rejectTask(eId) {
        this.doAccept(eId, false);
      },
      doAccept(eId, accept) {
        let url = '/fault/task/accept?eId=' + eId + '&accept=' + accept;
        this.getRequest(url).then(resp => {
          if (resp) {
            this.initTask();
          }
        })
      },
      // 完成任务提交回单
      showFinishVisible(eId) {
        this.dialogFinish = true;
        this.receipt.errorId = eId;
      },
      cancelFinish() {
        this.dialogFinish = false;
        // 初始化receipt
        this.initReceipt();
      },
      doFinish() {
        this.postRequest('/fault/task/finish/',this.receipt).then(resp=>{
          if (resp) {
            this.dialogFinish = false;
            // 初始化receipt
            this.initReceipt();
          }
        })
      },
      initReceipt() {
        this.receipt = {
          errorId: '',
          reason: '',
        };
      }
    }
  }
</script>

<style scoped>

</style>
