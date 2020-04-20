<template>
    <div>
        名称：一号仓库  位置：北京市海淀区西土城路  经度:120  纬度:130
        <div style="margin-top: 20px">
            <div>
                <el-input v-model="listQuery.id" placeholder="型号" style="width: 200px;" class="filter-item" />
                <el-select v-model="listQuery.type" placeholder="种类" clearable class="filter-item" style="width: 130px;margin-left: 8px">
                    <el-option v-for="item in type" :key="item" :label="item" :value="item" />
                </el-select>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchTable">搜索</el-button>
            </div>
            <el-table
                    :data="lightData"
                    fit
                    style="width: 1000px;margin-top: 20px">
                <el-table-column label="灯泡" align="center">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="型号">
                                    <span>{{ props.row.type }}</span>
                                </el-form-item>
                                <el-form-item label="名称">
                                    <span>{{ props.row.name }}</span>
                                </el-form-item>
                                <el-form-item label="库存数量">
                                    <span>{{ props.row.number }}个</span>
                                </el-form-item>
                                <el-form-item label="剩余容量">
                                    <span>{{ props.row.capacity }}个</span>
                                </el-form-item>
                                <el-form-item label="功率">
                                    <span>{{ props.row.power }}W</span>
                                </el-form-item>
                                <el-form-item label="电压">
                                    <span>{{ props.row.voltage }}V</span>
                                </el-form-item>
                                <el-form-item label="电流">
                                    <span>{{ props.row.current }}A</span>
                                </el-form-item>
                                <el-form-item label="生产日期">
                                    <span>{{ props.row.productionDate }}</span>
                                </el-form-item>
                                <el-form-item label="购买日期">
                                    <span>{{ props.row.purchaseDate }}</span>
                                </el-form-item>
<!--                                <el-form-item label="安装日期">-->
<!--                                    <span>{{ props.row.installDate }}</span>-->
<!--                                </el-form-item>-->
                                <el-form-item label="使用年限">
                                    <span>{{ props.row.lifeTime }}年</span>
                                </el-form-item>
                                <el-form-item label="生产厂商">
                                    <span>{{ props.row.manufacturer }}</span>
                                </el-form-item>
                                <el-form-item label="价格">
                                    <span>{{ props.row.price }}元</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="型号" prop="type"/>
                    <el-table-column label="名称" prop="name"/>
                    <el-table-column label="库存数量" prop="number"/>
                    <el-table-column label="剩余容量" prop="capacity"/>
                    <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="small" @click="handleShowEdit(scope.row)">
                                编辑
                            </el-button>
                            <el-button type="primary" size="small" @click="handleShowCheck(scope.row)">
                                出库
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table
                    :data="poleData"
                    fit
                    style="width: 1000px;margin-top: 20px">
                <el-table-column label="灯杆" align="center">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="型号">
                                    <span>{{ props.row.type }}</span>
                                </el-form-item>
                                <el-form-item label="名称">
                                    <span>{{ props.row.name }}</span>
                                </el-form-item>
                                <el-form-item label="库存数量">
                                    <span>{{ props.row.number }}个</span>
                                </el-form-item>
                                <el-form-item label="剩余容量">
                                    <span>{{ props.row.capacity }}个</span>
                                </el-form-item>
                                <el-form-item label="高度">
                                    <span>{{ props.row.height }}米</span>
                                </el-form-item>
                                <el-form-item label="承重">
                                    <span>{{ props.row.loadBearing }}kg</span>
                                </el-form-item>
                                <el-form-item label="生产日期">
                                    <span>{{ props.row.productionDate }}</span>
                                </el-form-item>
                                <el-form-item label="购买日期">
                                    <span>{{ props.row.purchaseDate }}</span>
                                </el-form-item>
<!--                                <el-form-item label="安装日期">-->
<!--                                    <span>{{ props.row.installDate }}</span>-->
<!--                                </el-form-item>-->
                                <el-form-item label="使用年限">
                                    <span>{{ props.row.lifeTime }}年</span>
                                </el-form-item>
                                <el-form-item label="生产厂商">
                                    <span>{{ props.row.manufacturer }}</span>
                                </el-form-item>
                                <el-form-item label="价格">
                                    <span>{{ props.row.price }}元</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="型号" prop="type"/>
                    <el-table-column label="名称" prop="name"/>
                    <el-table-column label="库存数量" prop="number"/>
                    <el-table-column label="剩余容量" prop="capacity"/>
                    <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="small" @click="handleShowEdit(scope.row)">
                                编辑
                            </el-button>
                            <el-button type="primary" size="small" @click="handleShowCheck(scope.row)">
                                出库
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-dialog
                    title="出库"
                    :visible.sync="checkDialogFormVisible"
                    width="30%">
                <el-form :model="checkForm" label-width="80px">
                    <el-form-item label="型号">
                        <el-input v-model="checkForm.type"></el-input>
                    </el-form-item>
                    <el-form-item label="出库数量">
                        <el-input v-model="checkForm.number"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="checkDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleCheckout(checkForm)">出 库</el-button>
                </div>
            </el-dialog>
            <el-dialog
                    title="编辑"
                    :visible.sync="editDialogFormVisible"
                    width="30%">
                <el-form :model="editForm" label-width="80px">
                    <el-form-item label="型号">
                        <el-input v-model="editForm.type"></el-input>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="库存数量">
                        <el-input v-model="editForm.number"></el-input>
                    </el-form-item>
                    <el-form-item label="总容量">
                        <el-input v-model="editForm.capacity"></el-input>
                    </el-form-item>
                    <el-form-item label="购买日期">
                        <el-input v-model="editForm.purchaseDate"></el-input>
                    </el-form-item>
                    <el-form-item label="生产日期">
                        <el-input v-model="editForm.productionDate"></el-input>
                    </el-form-item>
                    <el-form-item label="使用年限">
                        <el-input v-model="editForm.lifeTime"></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂商">
                    <el-input v-model="editForm.manufacturer"></el-input>
                    </el-form-item>
                    <el-form-item label="价格">
                        <el-input v-model="editForm.price"></el-input>
                    </el-form-item>
                    <el-form-item label="功率" v-show="formItemHide.power">
                        <el-input v-model="editForm.power"></el-input>
                    </el-form-item>
                    <el-form-item label="电压" v-show="formItemHide.voltage">
                        <el-input v-model="editForm.voltage"></el-input>
                    </el-form-item>
                    <el-form-item label="电流" v-show="formItemHide.current">
                        <el-input v-model="editForm.current"></el-input>
                    </el-form-item>
                    <el-form-item label="高度" v-show="formItemHide.height">
                        <el-input v-model="editForm.height"></el-input>
                    </el-form-item>
                    <el-form-item label="承重" v-show="formItemHide.loadbearing">
                        <el-input v-model="editForm.loadBearing"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-left: 20px">
                        <el-button size="medium" @click="editDialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" size="medium" @click="handleCheckout">修 改</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "WarShowStore",
        data(){
            return{
                type: ['灯杆', '灯泡', '零件', '工具'],
                poleData: '',
                lightData: '',
                componentData: '', //零件
                checkDialogFormVisible: false,
                editDialogFormVisible:false,
                editForm:{},
                checkForm:{
                    type:'',
                    number:''
                },
                formItemHide:{
                    power:false,
                    voltage:false,
                    current:false,
                    height:false,
                    loadbearing:false
                },
                listLoading: true,
                total: 0,
                listQuery: {// 查询条件
                    page: 1,
                    limit: 20
                }
            }
        },
        created(){
            this.initList();
        },
        methods:{
            initList(){
                this.getRequest("/warehouse/show/").then(resp=>{
                    if(resp){
                        this.lightData = resp.lights;
                        this.poleData = resp.poles;
                    }
                })
            },
            handleShowEdit(data){
                this.editForm = data;
                if(data.power != null && data.voltage != null && data.current != null){
                    this.formItemHide.height = false;
                    this.formItemHide.loadbearing = false;
                    this.formItemHide.power = true;
                    this.formItemHide.voltage = true;
                    this.formItemHide.current = true;
                }else{
                    this.formItemHide.power = false;
                    this.formItemHide.voltage = false;
                    this.formItemHide.current = false;
                    this.formItemHide.height = true;
                    this.formItemHide.loadbearing = true;
                }
                this.editDialogFormVisible = true;
            },
            handleShowCheck(data){
                console.log(data);
                this.checkDialogFormVisible = true;
                this.checkForm.type = data.type;
            },
            handleCheckout(){

            }
        }
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
