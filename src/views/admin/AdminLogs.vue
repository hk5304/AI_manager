<template>
  <div class="admin-logs">
    <div class="admin-header">
      <h1>审计日志</h1>
      <button class="export-btn">导出日志</button>
    </div>
    <div class="logs-toolbar">
      <div class="filter-box">
        <input type="date" v-model="startDate">
        <input type="date" v-model="endDate">
        <select v-model="userFilter">
          <option value="">全部用户</option>
          <option value="1">张三</option>
          <option value="2">李四</option>
          <option value="3">王五</option>
        </select>
        <select v-model="actionFilter">
          <option value="">全部操作</option>
          <option value="create">创建</option>
          <option value="update">更新</option>
          <option value="delete">删除</option>
          <option value="login">登录</option>
        </select>
      </div>
    </div>
    <div class="logs-table">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>操作</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ log.time }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const startDate = ref('2026-04-01')
const endDate = ref('2026-04-25')
const userFilter = ref('')
const actionFilter = ref('')

const logs = ref([
  {
    id: 1,
    time: '2026-04-25 10:00:00',
    user: '张三',
    action: '登录',
    detail: '用户张三登录系统'
  },
  {
    id: 2,
    time: '2026-04-25 09:30:00',
    user: '李四',
    action: '创建',
    detail: '创建项目 "智能客服系统"'
  },
  {
    id: 3,
    time: '2026-04-24 16:00:00',
    user: '王五',
    action: '更新',
    detail: '更新任务 "完成登录页面开发" 状态为已完成'
  },
  {
    id: 4,
    time: '2026-04-24 14:30:00',
    user: '张三',
    action: '删除',
    detail: '删除用户 "周八"'
  },
  {
    id: 5,
    time: '2026-04-24 10:00:00',
    user: '李四',
    action: '登录',
    detail: '用户李四登录系统'
  }
])
</script>

<style scoped>
.admin-logs {
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

.export-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.export-btn:hover {
  background-color: #66b1ff;
}

.logs-toolbar {
  margin-bottom: 20px;
}

.filter-box {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-box input,
.filter-box select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.logs-table {
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
</style>