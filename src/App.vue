<template>
  <div id="app" style="height: 100%">
    <router-view></router-view>
  </div>
</template>

<style>
  /* 解决element-ui的table表格控件表头与内容列不对齐问题 */
  .el-table th.gutter{
    display: table-cell!important;
  }
</style>
