<template>
  <div class="admin-users">
    <div class="admin-header">
      <h1>用户管理</h1>
      <button class="create-btn">新建用户</button>
    </div>
    <div class="users-toolbar">
      <div class="search-box">
        <input type="text" placeholder="搜索用户" v-model="searchKeyword">
      </div>
      <div class="filter-box">
        <select v-model="roleFilter">
          <option value="">全部角色</option>
          <option value="super_admin">超级管理员</option>
          <option value="admin">系统管理员</option>
          <option value="pm">项目经理</option>
          <option value="developer">开发工程师</option>
          <option value="qa">测试人员</option>
          <option value="product">产品经理</option>
          <option value="collaborator">协作者</option>
        </select>
      </div>
    </div>
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span class="status-tag" :class="user.status">{{ user.status }}</span>
            </td>
            <td>{{ user.createTime }}</td>
            <td>
              <button class="edit-btn">编辑</button>
              <button class="disable-btn" v-if="user.status === 'active'">禁用</button>
              <button class="enable-btn" v-else>启用</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const roleFilter = ref('')

const users = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'super_admin',
    status: 'active',
    createTime: '2026-04-01'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: 'admin',
    status: 'active',
    createTime: '2026-04-02'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: 'pm',
    status: 'active',
    createTime: '2026-04-03'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'developer',
    status: 'active',
    createTime: '2026-04-04'
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    role: 'qa',
    status: 'active',
    createTime: '2026-04-05'
  },
  {
    id: 6,
    name: '周八',
    email: 'zhouba@example.com',
    role: 'product',
    status: 'inactive',
    createTime: '2026-04-06'
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})
</script>

<style scoped>
.admin-users {
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 24px;
  color: #333;
}

.create-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.create-btn:hover {
  background-color: #66b1ff;
}

.users-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-box input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
}

.filter-box select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.users-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

td {
  font-size: 14px;
  color: #666;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.active {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status-tag.inactive {
  background-color: #f5f7fa;
  color: #909399;
}

.edit-btn, .disable-btn, .enable-btn {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-btn {
  background-color: #f5f7fa;
  color: #409eff;
}

.edit-btn:hover {
  background-color: #ecf5ff;
}

.disable-btn {
  background-color: #fef0f0;
  color: #f56c6c;
  border-color: #fbc4c4;
}

.disable-btn:hover {
  background-color: #fde2e2;
}

.enable-btn {
  background-color: #f0f9eb;
  color: #67c23a;
  border-color: #c2e7b0;
}

.enable-btn:hover {
  background-color: #e6f7ee;
}
</style>