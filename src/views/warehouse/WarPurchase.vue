<template>
    <div class="form-container">
        <el-card shadow="never">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="填写采购清单"></el-step>
                <el-step title="采购状态"></el-step>
                <el-step title="物品入库"></el-step>
            </el-steps>
            <purchase-component
                    v-show="showStatus[0]"
                    v-model="productParam"
                    :is-edit="isEdit"
                    @nextStep="nextStep">
            </purchase-component>
            <PurchaseFinishComponent
                    ref="purchaseFinish"
                    v-show="showStatus[1]"
                    v-model="productParam"
                    :is-edit="isEdit"
                    @prevStep="prevStep"
                    @nextStep="nextStep">
            </PurchaseFinishComponent>
            <StoreComponent
                    ref="storeIn"
                    v-show="showStatus[2]"
                    v-model="productParam"
                    :is-edit="isEdit"
                    @prevStep="prevStep"
                    @finishCommit="finishCommit">
            </StoreComponent>
        </el-card>
    </div>
</template>

<script>
    import PurchaseComponent from "./component/PurchaseComponent";
    import PurchaseFinishComponent from "./component/PurchaseFinishComponent";
    import StoreComponent from "./component/StoreComponent";

    export default {
        name: "WarPurchase",
        components: {StoreComponent, PurchaseFinishComponent, PurchaseComponent},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            },
        },
        data(){
            return {
                active:0,
                productParam: '',
                showStatus: [true, false, false],
                isEdit:true
            }
        },
        methods:{
            hideAll() {
                for (let i = 0; i < this.showStatus.length; i++) {
                    this.showStatus[i] = false;
                }
            },
            prevStep() {
                if (this.active > 0 && this.active < this.showStatus.length) {
                    this.active--;
                    this.hideAll();
                    this.showStatus[this.active] = true;

                }
            },
            nextStep() {
                if (this.active < this.showStatus.length - 1) {
                    this.$refs.purchaseFinish.initList();
                    if(this.active == 1) {
                        this.$refs.storeIn.initList();
                    }
                    this.active++;
                    this.hideAll();
                    this.showStatus[this.active] = true;
                }
            },
            // valueFromChild(childValue){ //父子组件传值无效，改用sessionStorage存数据
            //     alert("数据来到父组件");
            //     console.log(childValue);
            //     this.purchaseLists = childValue;
            // },
            finishCommit() {
                this.active = 0;
                this.hideAll();
                this.showStatus[this.active] = true;
            }
        }
    }
</script>

<style scoped>
    .form-container {
        width: 1000px;
        margin-top: 40px;
        margin-left: 120px;
        margin-right: 120px;
    }
</style>
