<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="任务列表" name="CurrentTask"><CurrentTask/></el-tab-pane>
      <el-tab-pane label="历史任务" name="HistoryTask"><HistoryTask/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CurrentTask from "../../components/fau/CurrentTask";
  import HistoryTask from "../../components/fau/HistoryTask";

  export default {
    name: "FauTask",
    data() {
      return {
        activeName: 'CurrentTask'
      }
    },
    components: {
      CurrentTask,
      HistoryTask
    }
  }
</script>

<style scoped>

</style>
