<template>
  <div class="admin-roles">
    <div class="admin-header">
      <h1>角色管理</h1>
      <button class="create-btn">新建角色</button>
    </div>
    <div class="roles-table">
      <table>
        <thead>
          <tr>
            <th>角色名称</th>
            <th>描述</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>{{ role.createTime }}</td>
            <td>
              <button class="edit-btn">编辑</button>
              <button class="delete-btn">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const roles = ref([
  {
    id: 1,
    name: '超级管理员',
    description: '系统最高权限，可访问后台管理所有功能',
    createTime: '2026-04-01'
  },
  {
    id: 2,
    name: '系统管理员',
    description: '管理用户、角色模板、项目模板、审计日志',
    createTime: '2026-04-01'
  },
  {
    id: 3,
    name: '项目经理',
    description: '负责单个项目的全生命周期管理',
    createTime: '2026-04-01'
  },
  {
    id: 4,
    name: '开发工程师',
    description: '开发任务，提交代码，更新任务状态',
    createTime: '2026-04-01'
  },
  {
    id: 5,
    name: '测试人员',
    description: '测试任务，提交Bug，验证修复',
    createTime: '2026-04-01'
  },
  {
    id: 6,
    name: '产品经理',
    description: '提出需求，参与评审，跟踪进度',
    createTime: '2026-04-01'
  },
  {
    id: 7,
    name: '协作者',
    description: '只读权限，可查看项目信息但不可操作',
    createTime: '2026-04-01'
  }
])
</script>

<style scoped>
.admin-roles {
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

.roles-table {
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

.edit-btn, .delete-btn {
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

.delete-btn {
  background-color: #fef0f0;
  color: #f56c6c;
  border-color: #fbc4c4;
}

.delete-btn:hover {
  background-color: #fde2e2;
}
</style>