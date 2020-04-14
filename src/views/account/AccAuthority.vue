<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="角色权限" name="AccAuth"><AccAuth/></el-tab-pane>
      <el-tab-pane label="资源权限" name="RoleAuth"><RoleAuth/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import AccAuth from "../../components/account/AccAuth";
  import RoleAuth from "../../components/account/RoleAuth";

  export default {
    name: "AccAuthority",
    data() {
      return {
        activeName: 'RoleAuth'
      }
    },
    components: {
      AccAuth,
      RoleAuth
    }
  }
</script>

<style scoped>

</style>
