<template>
    <div class="app-container">
        <div class="filter-container">

            <el-select v-model="GoodsQuery.pid" class="filter-item" style="width:250px" placeholder="请选择项目名称" @change="getGoodsList()">
                <el-option v-if='item' v-for="item in projectList" :key="item.key" :value="item.id" :label="item.name" >{{ item.name }}
                </el-option>
            </el-select>
            <el-button v-waves class="filter-item" style="margin-left: 20px" type="primary" icon="el-icon-edit" @click="newGoods()">
                申请物资
            </el-button>

        </div>

        <el-table
                :key="tableKey"
                v-loading="listLoading"
                :data="GoodsList"
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
                    <span>{{ scope.row.time |formatDate }}</span>
                </template>
            </el-table-column>

            <el-table-column label="申请人编号" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.applyId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物资" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.detail }}</span>
                </template>
            </el-table-column>

            <el-table-column label="申请状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.applyStatus }}</span>
                </template>
            </el-table-column>
        </el-table>



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


    </div>
</template>



<script>
    import waves from '@/directive/waves' // waves directive
    import {formatDate} from '@/util/date'
    export default {
        name: "ConGoods",
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
        data(){
            return {
                tableKey: 0,
                list: null,
                projectList: [],
                projectList1: null,
                GoodsList: [],
                projectArr: [],
                project: undefined,
                total: 0,
                projectTotal: 0,
                listLoading: true,
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogFormVisible2: false,
                projectQuery: {
                    aid: 1
                },
                GoodsQuery: {
                    pid: undefined,
                    name: undefined
                },
                //物资申请单
                goods: {
                    proId: undefined,
                    applyId: undefined,
                    time: new Date(),
                    detail: undefined,
                    status: "待审核"
                },
                rules_goods: {
                    detail: [{required: true, message: '内容不能为空', trigger: 'blur'}]
                },
            }
            },
            created() {
                this.getProject()
            },
            methods: {
                // 根据项目名称返回物资申请表
                getGoodsList() {
                    let url = "/construction/getGoods?id="+this.GoodsQuery.pid;
                    this.getRequest(url).then(response => {
                        this.GoodsList = response
                        console.log(this.GoodsList)

                        // Just to simulate the time of the request
                        setTimeout(() => {
                            this.listLoading = false
                        }, 1.5 * 1000)
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
                        this.projectList = response

                        console.log(this.projectList)

                        // Just to simulate the time of the request
                        setTimeout(() => {
                            this.listLoading = false
                        }, 1.5 * 1000)
                    })
                },
                /*handleCreate() {
                    this.resetTemp()
                    this.dialogFormVisible = true
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                },*/

                newGoods() {
                    this.resetGoods()
                    this.goods.proId=this.GoodsQuery.pid
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
                resetGoods() {
                    this.goods = {
                        proId: undefined,
                        applyId: undefined,
                        time: new Date(),
                        detail: undefined,
                        status: "待审核"
                    }
                }



        }

    }
</script>

<style scoped>

</style>