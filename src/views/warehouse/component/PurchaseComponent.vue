<template>
    <div style="margin-top: 20px">
        <el-form :model="value" :rules="rules" ref="purchaseComponent" label-width="120px" style="width: 600px;margin-left: 100px" size="small">
            <el-form-item label="商品分类：" prop="goods">
                <el-select v-model="value.goods" placeholder="请选择物品种类">
                    <el-option label="灯泡" value="灯泡"></el-option>
                    <el-option label="灯杆" value="灯杆"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物品类型：" prop="type">
                <el-input v-model="value.type"></el-input>
            </el-form-item>
            <el-form-item label="物品名称：" prop="name">
                <el-input v-model="value.name"></el-input>
            </el-form-item>
            <el-form-item label="物品数量：" prop="number">
                <el-input v-model="value.number"></el-input>
            </el-form-item>
            <el-form-item label="物品价格：" prop="price">
                <el-input v-model="value.price" style="width: 300px"></el-input>
                <span style="margin-left: 20px">元</span>
            </el-form-item>
            <el-form-item label="厂商：" prop="manufacturer">
                <el-input v-model="value.manufacturer"></el-input>
            </el-form-item>
            <el-form-item label="采购日期：" prop="purchaseDate">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="value.purchaseDate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="生产日期：" prop="productionDate">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="value.productionDate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="使用寿命：" prop="lifeTime">
                <el-input v-model="value.lifeTime" style="width: 300px"></el-input>
                <span style="margin-left: 20px">年</span>
            </el-form-item>
            <el-form-item label="其他参数："prop="param">
                <el-input
                        :autoSize="true"
                        v-model="value.param"
                        type="textarea"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
                <el-button type="primary" size="medium" @click="toPurchaseFinish">下一步，查看待采购列表</el-button>
                <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，等待采购</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "PurchaseComponent",
        data(){
            return{
                value:{}
            }
        },
        methods:{
            toPurchaseFinish(){
                this.$emit('nextStep');
            },
            handleNext(){
                this.postRequest("/warehouse/purchase/",this.value).then(resp=>{
                    if(resp){
                        this.$emit('nextStep');
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
