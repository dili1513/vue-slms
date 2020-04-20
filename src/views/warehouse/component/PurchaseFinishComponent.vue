<template>
    <div style="margin-top: 50px">
        <el-table
                v-if=""
                :data="purchaseList"
                border
                style="width: 100%">
            <el-table-column
                    prop="purchaseDate"
                    label="采购日期"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="物品类型"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="物品名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="物品数量"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="商品价格"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="manufacture"
                    label="厂商"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="productionDate"
                    label="生产日期"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="lifeTime"
                    label="使用寿命"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="param"
                    label="其他参数"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="isFinish"
                    fixed="right"
                    label="采购状态"
                    width="120">
                <template slot-scope="{row}">
                    <el-tag :type="row.isFinish == 0? 'info':'success'">
                        {{ row.isFinish == 0? '采购中':'采购完成' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="handlePurchaseFinish(scope.row)" type="primary" size="small">采购完成</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 40px;margin-left: 150px">
            <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
            <el-button type="primary" size="medium" @click="handleNext" style="margin-left: 100px">下一步，采购完成物品入库</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PurchaseFinishComponet",
        created(){
            this.initList();
        },
        data(){
            return{
                purchaseList:[]
            }
        },
        methods:{
            initList(){
                this.getRequest("/warehouse/purchase/").then(resp=>{
                    if(resp){
                        this.purchaseList = resp;
                    }
                })
            },
            handlePurchaseFinish(data){
                if(data.isFinish === 0) {
                    this.$confirm('此操作将状态改为采购完成, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        data.isFinish = 1;
                        this.putRequest("/warehouse/purchase/", data).then(resp => {
                            if (resp) {
                                this.initList();
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                            } else {
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });
                    });
                }else if(data.isFinish === 1){
                    this.$alert('当前采购任务已经完成', '提示', {
                        confirmButtonText: '确定',
                        // callback: action => {
                        //     this.$message({
                        //         type: 'info',
                        //         message: `action: ${ action }`
                        //     });
                        // }
                    });
                }
            },
            handlePrev() {
                this.$emit('prevStep')
            },
            handleNext(){
                // this.$emit('valueFromChild', this.purchaseList);
                sessionStorage.setItem("purchaseLists", JSON.stringify(this.purchaseList));
                this.$emit('nextStep');
            }
        }
    }
</script>

<style scoped>

</style>
