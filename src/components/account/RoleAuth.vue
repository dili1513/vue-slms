<template>
  <div
    v-loading="loading"
    element-loading-text="正在加载..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0,0,0,0.8)"
  >
    <div class="permissManaTool">
      <el-input v-model="role.name" size="small" placeholder="角色英文名...">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input v-model="role.nameZh" size="small" placeholder="角色中文名..." @keydown.enter.native="addRole"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加</el-button>
    </div>
    <div class="permissManaMain">
      <!--   @change折叠面板展开关闭事件,传递所有展开name属性,关闭时不传参   -->
      <el-collapse
        accordion
        v-model="activeName"
        @change="collapseChange">
        <el-collapse-item :name="r.id" :title="r.nameZh" v-for="(r,index) in roles" :key="index">
          <el-card>
            <div slot="header">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0; color: red"
                         type="text" icon="el-icon-delete" @click="deleteRole(r)"></el-button>
            </div>
            <div>
              <!-- key 是为了区分不同的tree 因为上面是循环,所以tree是一个数组,可以通过index获取特定的tree -->
              <el-tree
                show-checkbox
                :data="allMenus"
                ref="tree"
                :key="index"
                node-key="id"
                :default-checked-keys="selectedMenus"
                :props="defaultProps"></el-tree>
            </div>
            <div style="display: flex;justify-content: flex-end;margin-top: 8px">
              <el-button @click="cancelUpdate">取消修改</el-button>
              <el-button type="primary" @click="doUpdate(r.id,index)">确定修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AccAuth",
    data() {
      return {
        loading: false,
        role: {
          name: '',
          nameZh: ''
        },
        roles: [],
        allMenus: [],
        selectedMenus: [],
        activeName: -1,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    mounted() {
      this.initRoles();
    },
    methods: {
      addRole() {
        if (this.role.name && this.role.nameZh) {
          this.loading = true;
          this.postRequest('/account/auth/role', this.role).then(resp => {
            this.loading = false;
            if (resp) {
              this.role.name = '';
              this.role.nameZh = '';
              this.initRoles();
            }
          })
        } else {
          this.$message.error("数据不可以为空");
        }
      },
      deleteRole(role) {
        this.$confirm('此操作将永久删除【' + role.nameZh + '】角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/account/auth/role/" + role.id).then(resp => {
            if (resp) {
              this.initRoles();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      cancelUpdate() {
        this.activeName = -1;
      },
      doUpdate(rid, index) {
        let tree = this.$refs.tree[index];
        let checkedKeys = tree.getCheckedKeys(true);
        //注意url拼接格式
        let url = "/account/auth/?rid=" + rid;
        checkedKeys.forEach(key => {
          url += '&mids=' + key;
        })
        this.putRequest(url).then(resp => {
          if (resp) {
            this.activeName = -1;
          }
        })
      },
      collapseChange(rid) {
        if (rid) {
          this.initAllMenus();
          this.initSelectedMenus(rid);
        }
      },
      initSelectedMenus(rid) {
        this.getRequest("/account/auth/mids/" + rid).then(resp => {
          if (resp) {
            this.selectedMenus = resp;
          }
        })
      },
      initAllMenus() {
        this.getRequest("/account/auth/menus").then(resp => {
          if (resp) {
            this.allMenus = resp;
          }
        })
      },
      initRoles() {
        this.getRequest("/account/auth/").then(resp => {
          if (resp) {
            this.roles = resp;
          }
        })
      }
    }
  }
</script>

<style>
  .permissManaTool .el-input {
    width: 300px;
    margin-right: 5px;
  }

  .permissManaMain {
    margin-top: 10px;
    width: 680px;
  }
</style>
