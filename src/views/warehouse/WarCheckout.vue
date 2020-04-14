<template>
    <div>
        <div>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-mouse" @click="searchTable">批量审核</el-button>
            <el-table
                    v-loading="listLoading"
                    :data="applies"
                    border
                    fit
                    highlight-current-row
                    style="width: 70%"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column label="物资申请列表" align="center">
                    <el-table-column type="selection" width="40" />
                    <el-table-column prop="applyId" label="申请人工号" width="100" />
                    <el-table-column prop="applyType" label="申请人员类型" width="120" />
                    <el-table-column prop="applyName" label="申请人姓名" width="120" />
                    <el-table-column prop="applyTelephone" label="申请人手机号" width="120" />
                    <el-table-column prop="applyStatus" label="状态" width="100">
<!--                        <template slot-scope="{row}">-->
<!--                            <el-tag :type="row.status | statusFilter">-->
<!--                                {{ row.status }}-->
<!--                            </el-tag>-->
<!--                        </template>-->
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="small" @click="showDetail(scope.row)">
                                查看详情
                            </el-button>
                            <el-button type="primary" size="small" @click="showCheck(scope.row)">
                                审核出库
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
<!--            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />,-->
        </div>
        <el-dialog
                title="物资申请详情"
                :visible.sync="detailDialog"
                width="30%">
                <el-input v-model="contents.detail" :disabled="true" style="font-weight:bold"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="detailDialog = false">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="审核"
                :visible.sync="checkDialog"
                width="30%">
<!--            <span>这是一段信息</span>-->
            <el-input v-model="contents.detail" :disabled="true" style="font-weight:bold"></el-input>
            <el-form :model="checkForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="请输入型号" prop="type">
                    <el-input type="password" v-model="checkForm.type" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="请输入数量" prop="number">
                    <el-input type="password" v-model="checkForm.number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="checkout(contents,checkForm)">出库</el-button>
                    <el-button @click="resetForm('checkForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


<!--        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
<!--            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">-->
<!--                <el-form-item label="类型" prop="type">-->
<!--                    <el-select v-model="temp.type" class="filter-item" placeholder="Please select">-->
<!--                        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="名称" prop="name">-->
<!--                    <el-input v-model="temp.title" />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="生产日期" prop="timestamp">-->
<!--                    <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="购买日期" prop="timestamp">-->
<!--                    <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="安装日期" prop="timestamp">-->
<!--                    <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="Status">-->
<!--                    <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
<!--                        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="Imp">-->
<!--                    <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="Remark">-->
<!--                    <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <div slot="footer" class="dialog-footer">-->
<!--                <el-button @click="dialogFormVisible = false">-->
<!--                    取消-->
<!--                </el-button>-->
<!--                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
<!--                    确定-->
<!--                </el-button>-->
<!--            </div>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    export default {
        name: "WarCheckout",
        filters: {
            statusFilter(applyStatus) {
                console.log(applyStatus);
                const statusMap = {
                    待审核: 'info',
                    申请通过: 'success',
                    驳回: 'danger'
                }
                return statusMap[applyStatus]
            }
        },
        data() {
            return {
                applies: [],
                listLoading: true,
                detailDialog:false,
                checkDialog:false,
                contents:{
                    detail:''
                },
                checkForm:[],
                total: 0,
                listQuery: {// 查询条件
                    page: 1,
                    limit: 20
                },
                // temp: {
                //     id: undefined,
                //     importance: 1,
                //     remark: '',
                //     timestamp: new Date(),
                //     title: '',
                //     type: '',
                //     status: 'published'
                // },
                // dialogFormVisible: false,
                // dialogStatus: '',
                // textMap: {
                //     update: '详情',
                //     create: 'Create'
                // }
            }
        },
        created() { // 这里是页面初始时显示所有的数据
            this.initList();
        },
        methods: {
            initList() {
                this.listLoading = true
                this.getRequest("/warehouse/checkout/").then(resp => {
                    // console.log(resp);
                    if(resp){
                        this.applies = resp;
                        this.listLoading = false
                    }
                })
            },
            showDetail(data){
                Object.assign(this.contents,data);//变量拷贝
                // console.log(this.contents);
                this.detailDialog = true;
            },
            showCheck(data) {
                Object.assign(this.contents,data);
                this.checkDialog = true;
            },
            checkout(data1,data2){
                console.log(data1);
                data1.applyStatus = "审核通过";
                this.putRequest("/warehouse/checkout/",data1).then(resp=>{
                    if(resp){
                        alert("更新成功！");
                        this.checkDialog = false;
                        this.initList();
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
