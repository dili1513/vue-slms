<template>
  <div class="homeBox">
    <el-container >
      <el-aside width="200px" style="height: 800px">
        <el-menu unique-opened router>
          <el-menu-item index="/home" >
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index" v-if="!item.hidden">
            <template slot="title">
              <i :class="item.iconCls"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="child.path" v-for="(child, indexJ) in item.children" :key="indexJ">
              <i :class="child.iconCls"></i>
              <span>{{child.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="homeHeader">
          <div @click="toHome" class="title">路灯管理系统</div>
          <div>
            <el-dropdown class="accountInfo" @command="commandHandler">
            <span class="el-dropdown-link">
              {{account.name}}<i><img :src="account.portrait"/></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <!--      command 唯一标记 上面 @command="commandHandler" 的参数      -->
                <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <div v-show="this.$router.currentRoute.path == '/home'">欢迎来到路灯管理系统</div>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        account: JSON.parse(window.sessionStorage.getItem('account'))
      }
    },
    computed: {
      routes() {
        let routes = this.$store.state.routes;
        return routes;
      }
    },
    methods: {
      toHome(){
        this.$router.push('/home')
      },
      commandHandler(cmd) {
        if (cmd == 'logout'){
          this.$confirm('你将注销登陆，是否继续？','提示',{
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.getRequest("/logout");
            window.sessionStorage.removeItem("user");
            this.$store.commit('initRoutes',[]);
            this.$router.replace("/")
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消注销'
            })
          })
        }
      }
    }
  }
</script>

<style>

  .homeHeader .title {
    font-size: 30px;
    font-family: 华文行楷;
    cursor: pointer;
  }

  .homeHeader {
    background-color: #eab5e9;
    display: flex;
    /*div对齐方式,顶部，底部，中间*/
    align-items: center;
    /*水平均匀分布*/
    justify-content: space-between;
    padding: 0px 15px;
    /*content-box 宽高=内容宽高+边框+内边距   border-box 宽高宽高=内容宽高*/
    box-sizing: border-box;
  }

  .accountInfo{
    cursor: pointer;
  }
  .el-dropdown-link img {
    height: 48px;
    width: 48px;
    border-radius: 24px;
    margin-left: 8px;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
    color: black;
  }
</style>
