<template>
    <div style="margin-top: 20px">
        <el-form :model="value" label-width="120px" style="width: 600px;margin-left: 100px" size="small">
            <el-form-item label="商品分类：" prop="goods">
                <el-input v-model="value.goods"></el-input>
            </el-form-item>
            <el-form-item label="物品型号：" prop="type">
                <el-select v-model="value.type" placeholder="请选择物品型号" @change="setTableValue">
                    <el-option
                            v-for="item in formType"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物品名称：" prop="name">
                <el-input v-model="value.type"></el-input>
            </el-form-item>
            <el-form-item label="物品数量：" prop="number">
                <el-input v-model="value.number"></el-input>
            </el-form-item>
            <el-form-item label="物品价格：" prop="price">
                <el-input v-model="value.price" style="width: 300px"></el-input>
                <span style="margin-left: 10px">元</span>
            </el-form-item>
            <el-form-item label="厂商：" prop="manufacturer">
                <el-input v-model="value.manufacturer"></el-input>
            </el-form-item>
            <el-form-item label="采购日期：" prop="purchaseDate">
                <el-col :span="11">
                    <el-date-picker type="purchaseDate" placeholder="选择日期" v-model="value.purchaseDate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="生产日期：" prop="productionDate">
                <el-col :span="11">
                    <el-date-picker type="productionDate" placeholder="选择日期" v-model="value.productionDate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="使用寿命：" prop="lifeTime">
                <el-input v-model="value.lifeTime" style="width: 300px"></el-input>
                <span style="margin-left: 10px">年</span>
            </el-form-item>
            <el-form-item label="其他参数："prop="param">
                <el-input
                        :autoSize="true"
                        v-model="value.param"
                        type="textarea"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="电流：" prop="current" v-show="formItemHide.current">
                <el-input v-model="value.current" style="width: 300px"></el-input>
                <span style="margin-left: 10px">A</span>
            </el-form-item>
            <el-form-item label="电压：" prop="voltage"v-show="formItemHide.voltage">
                <el-input v-model="value.voltage" style="width: 300px"></el-input>
                <span style="margin-left: 10px">V</span>
            </el-form-item>
            <el-form-item label="功率：" prop="power" v-show="formItemHide.power">
                <el-input v-model="value.power" style="width: 300px"></el-input>
                <span style="margin-left: 10px">W</span>
            </el-form-item>
            <el-form-item label="高度：" prop="height" v-show="formItemHide.height">
                <el-input v-model="value.height" style="width: 300px"></el-input>
                <span style="margin-left: 10px">米</span>
            </el-form-item>
            <el-form-item label="称重：" prop="loadBearing" v-show="formItemHide.loadbearing">
                <el-input v-model="value.loadBearing" style="width: 300px"></el-input>
                <span style="margin-left: 10px">kg</span>
            </el-form-item>
            <el-form-item style="text-align: center">
                <el-button size="medium" style="width: 200px" @click="handlePrev" >上一步，采购中</el-button>
                <el-button type="primary" size="medium" @click="handleAdd('storeComponent')" style="width: 200px">入库</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "StoreComponent",
        data(){
            return{
                value:{
                    goods:'',
                    type:'',
                    name:'',
                    number:'',
                    price:'',
                    manufacture:'',
                    purchaseDate:'',
                    productionDate:'',
                    lifeTime:'',
                    param:''
                },
                allFormData:{},
                formType:[],
                formItemHide:{
                    power:false,
                    voltage:false,
                    current:false,
                    height:false,
                    loadbearing:false
                },
            }
        },
        methods:{
            initForm(){
              this.value = {};
            },
            initList(){
              this.allFormData = JSON.parse(sessionStorage.getItem("purchaseLists"));
              this.formType = [];
              for (var i = 0; i < this.allFormData.length; i++) {
                  if (this.allFormData[i].isFinish == 1 && this.allFormData[i].isStore == 0) {
                      this.formType.push(this.allFormData[i].type);
                  }
              }
            },
            setTableValue(){
                for(var i=0;i<this.allFormData.length;i++){
                    if(this.allFormData[i].type == this.value.type){
                        this.value = this.allFormData[i];
                        if(this.value.goods == '灯泡'){
                            this.formItemHide.height = false;
                            this.formItemHide.loadbearing = false;
                            this.formItemHide.power = true;
                            this.formItemHide.voltage = true;
                            this.formItemHide.current = true;
                        }else if(this.value.goods == '灯杆'){
                            this.formItemHide.power = false;
                            this.formItemHide.voltage = false;
                            this.formItemHide.current = false;
                            this.formItemHide.height = true;
                            this.formItemHide.loadbearing = true;
                        }
                    }
                }
            },
            handlePrev() {
                // this.value = '';
                this.$emit('prevStep')
            },
            handleAdd(data){
                if(this.value.goods == '灯泡'){
                    this.$confirm('您即将入库采购物品, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest("/warehouse/purchase/light",this.value).then(resp=>{
                            if(resp){
                                this.$message({
                                    message: '入库成功',
                                    type: 'success'
                                });
                                this.value.isStore = 1;
                                this.putRequest("/warehouse/purchase/",this.value).then(resp=>{
                                    if(resp){
                                        this.$emit('finishCommit');
                                    }
                                })
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消入库'
                        });
                    });
                }else if(this.value.goods == '灯杆'){
                    this.$confirm('您即将入库采购物品, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest("/warehouse/purchase/pole",this.value).then(resp=>{
                            if(resp){
                                this.$message({
                                    message: '入库成功',
                                    type: 'success'
                                });
                                this.value.isStore = 1;
                                this.putRequest("/warehouse/purchase/",this.value).then(resp=>{
                                    if(resp){
                                        this.$emit('finishCommit');
                                    }
                                })
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消入库'
                        });
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
