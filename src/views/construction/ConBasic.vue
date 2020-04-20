<style>
    .el-form {
        white-space: pre-line;
    }
</style>

<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="planQuery.pid" class="filter-item" style="width:250px" placeholder="请选择项目名称" @change="getPlanList()">
        <el-option v-if='item' v-for="item in projectList" :key="item.key" :value="item.id" :label="item.name" >{{ item.name }}
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="downloadAccont">
        下载工单
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="downloadBook">
        下载规划书
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="newGoods">
        申请物资
      </el-button>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加进度
      </el-button>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="finishProject">
        提交该项目
      </el-button>
    </div>

    <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="planList"
            border
            fit
            highlight-current-row
            style="width: 100%;margin-top: 10px"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="进度内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.detail }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加进度" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="日期" prop="timestamp">
          <el-date-picker v-model="temp.date" type="datetime" placeholder="请选择一个日期" />
        </el-form-item>
        <el-form-item label="进度内容" prop="detail">
          <el-input v-model="temp.detail" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="createData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>


    <el-dialog title="物资申请单" :visible.sync="dialogFormVisible1">
      <el-form ref="goodsForm" :rules="rules_goods" :model="goods" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="项目编号" prop="proId">
          {{ goods.proId}}
        </el-form-item>
        <el-form-item label="申请日期" prop="time">
          {{goods.time | formatDate}}
        </el-form-item>
        <el-form-item label="维修人员编号" prop="applyId">
          {{ goods.applyId }}
        </el-form-item>
        <el-form-item label="申请物资">
          <el-input v-model="goods.detail" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">
          取消
        </el-button>
        <el-button type="primary" @click="goodsList()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="回单" :visible.sync="dialogFormVisible2">
      <el-form ref="ReceiptForm" :rules="rules_receipt" :model="form2" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item label="项目编号" prop="billid">
          {{ form2.billid}}
        </el-form-item>
        <el-form-item label="开始时间" prop="starttime">
          {{form2.starttime | formatDate}}
        </el-form-item>
        <el-form-item label="完工时间" prop="endtime">
          {{form2.endtime | formatDate}}
        </el-form-item>
        <el-form-item label="维修人员编号" prop="accountId">
          {{ form2.accountId }}
        </el-form-item>
        <el-form-item label="维修人员姓名" prop="accountName">
          {{ form2.accountName }}
        </el-form-item>
        <el-form-item label="物资" prop="goods">
          {{form2.goods}}
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form2.else1" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          取消
        </el-button>
        <el-button type="primary" @click="UploadReceipt()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import {formatDate} from '@/util/date'

  export default {
    name: 'ConBasic',
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          finished: 'success',
          ready: 'info',
          fixing: 'danger'
        }
        return statusMap[status]
      },
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        projectList: [],
        projectList1: null,
        planList: [],
        projectArr: [],
        form3:{
          starttime: "ttt",
          endtime: "sss",
          else1: "111",
          billid: 6,
          name:"qqq",
          goods: '555',
          accountId:1,
          accountName:"qqqq"
        },
        project: undefined,
        total: 0,
        projectTotal: 0,
        planTotal: 0,
        listLoading: true,
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        projectQuery: {
          aid:1
        },
        planQuery: {
          pid: undefined,
          name: undefined
        },
        // 工单

        form: {
          id: 1,
          accountId: 1, // 施工队id
          account_name: undefined,
          phone: '138xxxxxxxx', // 联系方式
          name: '北京邮电大学', // 项目名称
          timeLimit: '1个月', // 项目时间
          time: new Date(), // 时间
          detail: undefined,
          location: undefined,
          status: undefined
        },
        //回单
        form2:{
          starttime: undefined,
          endtime: undefined,
          else1: undefined,
          billid: undefined,
          name:undefined,
          goods: '555',
          accountId:undefined,
          accountName:undefined
        },
        // 新建一个进度
        temp: {
          projectId: undefined,
          date: new Date(),
          detail: undefined
        },
        //物资申请单
        goods: {
          proId: undefined,
          applyId: undefined,
          time: new Date(),
          detail: undefined,
          status:"待审核"
        },
        rules: {
          detail: [{ required: true, message: '进度内容不能为空', trigger: 'blur' }]
        },
        rules_goods: {
          detail: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
        },
        rules_receipt: {
          else: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getProject()
    },
    methods: {
      // 根据项目名称返回进度表
      getPlanList() {
        let url = "/construction/getPlanList?id="+this.planQuery.pid;
        this.getRequest(url).then(response => {
          this.planList = response
          console.log(this.planList)

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })


        //根据项目名称返回项目属性
        let url1 = "/construction/getBill?id="+this.planQuery.pid;
        this.getRequest(url1).then(response => {
          console.log(response)

          this.form.id = response.id
          this.form.accountId = response.accountid
          this.form.account_name = response.accountName
          this.form.time = response.time
          this.form.detail = response.detail
          this.form.timeLimit = response.timelimit
          this.form.location = response.location
          this.form.name = response.name

        })

        //根据项目id查询物资申请表
        let url3 = "/construction/getGoods?id="+this.planQuery.pid;
        var temp = ' '
        this.getRequest(url3).then(response1 => {
          console.log(response1)
          for (var p in response1) {//遍历json数组时，这么写p为索引，0,1
            temp+="  编号："+response1[p].id + " 申请人：" + response1[p].applyId+" 物资："+response1[p].detail
          }

          this.form2.goods = temp
          console.log(this.form2.goods)

        })


      },

      // 根据公司名称返回相应的项目工程
      getProject() {
        //window.sessionStorage.setItem('account',JSON.stringify(resp.obj))
        let account = JSON.parse(window.sessionStorage.getItem('account'))
        console.log(account)
        this.projectQuery.aid = account.id
        this.listLoading = true
        let url = "/construction/getProject?id="+this.projectQuery.aid;
        this.getRequest(url).then(response => {
          console.log(response)
          this.projectList = response

          console.log(this.projectList)

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleCreate() {
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 添加进度内容
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.projectId = this.planQuery.pid

            this.postRequest("/construction/addPlan/",this.temp).then(resp=>{
              if(resp) {
                this.dialogFormVisible = false
                this.getPlanList();
              }
              this.$notify({
                title: 'Success',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      newGoods() {
        this.resetGoods()
        this.goods.proId=this.planQuery.pid
        this.goods.applyId = this.projectQuery.aid
        this.goods.time = new Date()
        this.dialogFormVisible1 = true
        this.$nextTick(() => {
          this.$refs['goodsForm'].clearValidate()
        })
      },
      goodsList() {

        this.$refs['goodsForm'].validate((valid) => {
          if (valid) {
            this.postRequest("/construction/addGoodsList/",this.goods).then(resp=>{
              if(resp) {
                this.dialogFormVisible = false
              }
              this.$notify({
                title: 'Success',
                message: resp,
                type: 'success',
                duration: 2000
              })
            })
            this.dialogFormVisible1 = false
          }
        })
      },
      resetTemp() {
        this.temp = {
          project: undefined,
          id: undefined,
          timestamp: new Date(),
          detail: ''
        }
      },
      resetGoods() {
        this.goods = {
          proId: undefined,
          applyId: undefined,
          time: new Date(),
          detail: undefined,
          status: "待审核"
        }
      },
      resetReceipt() {
        this.form2 = {
          starttime: undefined,
          endtime: undefined,
          else1: undefined,
          billid: undefined,
          name:undefined,
          goods: '555',
          accountId:undefined,
          accountName:undefined
        }
      },
      // 下载工单
      downloadAccont() {
          let _this = this

          let url = "/construction/getBill?id="+this.planQuery.pid;
          _this.getRequest(url).then(response => {
              console.log(response)

              _this.form.id = response.id
              _this.form.accountId = _this.projectQuery.accountid
              _this.form.time = response.time
              _this.form.detail = response.detail
              _this.form.timeLimit = response.timelimit
              _this.form.location = response.location
              _this.form.name = response.name

              // Just to simulate the time of the request
              setTimeout(() => {
                  _this.listLoading = false
              }, 1.5 * 1000)
          })
          //console.log(this.form.name+"////////")
        // 读取并获得模板文件的二进制内容
        // eslint-disable-next-line no-undef
        JSZipUtils.getBinaryContent('input3.docx', function(error, content) {
          // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
          // 抛出异常
          if (error) {
            throw error
          }

          // 创建一个JSZip实例，内容为模板的内容
          // eslint-disable-next-line no-undef
          const zip = new JSZip(content)
          // 创建并加载docxtemplater实例对象
          // eslint-disable-next-line new-cap
          const doc = new window.docxtemplater().loadZip(zip)
          // 设置模板变量的值
          doc.setData({
            ..._this.form
          })

          try {
            // 用模板变量的值替换所有模板变量
            doc.render()
          } catch (error) {
            // 抛出异常
            const e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties
            }
            console.log(JSON.stringify({ error: e }))
            throw error
          }

          // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
          const out = doc.getZip().generate({
            type: 'blob',
            mimeType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
          // 将目标文件对象保存为目标类型的文件，并命名
          // eslint-disable-next-line no-undef
          saveAs(out, '施工工单' + _this.form.id + '.docx')
        })

        // //////////////////////////////////////////
        this.$message({
          title: 'Success',
          message: '下载工单',
          type: 'success',
          duration: 2000
        })
      },
      // 下载数据库里的文件
      downloadBook() {
        var url1 = ' ';
        let url = "/construction/downloadWord?id="+this.planQuery.pid;
        this.getRequest(url).then(response => {
          console.log(response)
          url1 = response
          // Just to simulate the time of the request
          setTimeout(() => {
            _this.listLoading = false
          }, 1.5 * 1000)
        })
        console.log(url1)
        window.open(url1);
        this.$notify({
          title: 'Success',
          message: '下载规划书',
          type: 'success',
          duration: 2000
        })
      },
      finishProject() {
        // 提交成功以后重新加载列表
        //this.resetReceipt()
        this.form2.billid = this.planQuery.pid
        this.form2.endtime = new Date()
        this.form2.starttime = this.form.time
        this.form2.accountId = this.form.accountId
        this.form2.accountName = this.form.account_name
        this.form2.name = this.form.name


        this.dialogFormVisible2 = true
        this.$nextTick(() => {
          this.$refs['ReceiptForm'].clearValidate()
        })
      },
      UploadReceipt() {

        this.$refs['ReceiptForm'].validate((valid) => {
          if (valid) {
            this.postRequest("/construction/finish/",this.form2).then(resp=>{
              if(resp) {
                this.dialogFormVisible = false
              }

              let _this = this
              //下载回单
              JSZipUtils.getBinaryContent('input4.docx', function(error, content) {
                // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
                // 抛出异常
                if (error) {
                  throw error
                }
                _this.form3.billid = _this.form2.billid
                _this.form3.accountId = _this.form2.accountId
                _this.form3.accountName = _this.form2.accountName
                _this.form3.else1 = _this.form2.else1
                _this.form3.name = _this.form2.name
                _this.form3.starttime = _this.form2.starttime
                _this.form3.endtime = _this.form2.endtime
                _this.form3.goods = _this.form2.goods

                // 创建一个JSZip实例，内容为模板的内容
                // eslint-disable-next-line no-undef
                const zip = new JSZip(content)
                // 创建并加载docxtemplater实例对象
                // eslint-disable-next-line new-cap
                const doc = new window.docxtemplater().loadZip(zip)
                // 设置模板变量的值
                doc.setData({
                  ..._this.form3
                })

                try {
                  // 用模板变量的值替换所有模板变量
                  doc.render()
                } catch (error) {
                  // 抛出异常
                  const e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties
                  }
                  console.log(JSON.stringify({ error: e }))
                  throw error
                }

                // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
                const out = doc.getZip().generate({
                  type: 'blob',
                  mimeType:
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                })
                // 将目标文件对象保存为目标类型的文件，并命名
                // eslint-disable-next-line no-undef
                saveAs(out, '施工回单' + _this.form2.billid + '.docx')
              })








              this.$notify({
                title: 'Success',
                message: resp,
                type: 'success',
                duration: 2000
              })
            })
            this.dialogFormVisible2 = false
            this.getProject()
          }
        })

      },
    }
  }
</script>

