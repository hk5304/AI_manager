<template>
  <div class="project-kanban">
    <div class="kanban-header">
      <h1>项目看板</h1>
      <div class="kanban-toolbar">
        <select v-model="filterPriority">
          <option value="">全部优先级</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
        <select v-model="filterAssignee">
          <option value="">全部负责人</option>
          <option value="1">张三</option>
          <option value="2">李四</option>
          <option value="3">王五</option>
        </select>
      </div>
    </div>
    <div class="kanban-columns">
      <div class="kanban-column" v-for="column in columns" :key="column.id">
        <div class="column-header">
          <h2>{{ column.name }}</h2>
          <button class="add-task-btn">+</button>
        </div>
        <div class="task-list">
          <div class="task-card" v-for="task in getTasksByStatus(column.id)" :key="task.id">
            <div class="task-header">
              <span class="priority-tag" :class="task.priority">
                {{ task.priority }}
              </span>
            </div>
            <h3 class="task-title">{{ task.title }}</h3>
            <div class="task-footer">
              <div class="assignee">
                <div class="avatar" :style="{ backgroundColor: task.avatarColor }"></div>
                <span>{{ task.assignee }}</span>
              </div>
              <span class="deadline">{{ task.deadline }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterPriority = ref('')
const filterAssignee = ref('')

const columns = ref([
  { id: 'todo', name: '待开始' },
  { id: 'in_progress', name: '进行中' },
  { id: 'review', name: '待评审' },
  { id: 'done', name: '已完成' },
  { id: 'blocked', name: '已阻塞' }
])

const tasks = ref([
  {
    id: 1,
    title: '完成登录页面开发',
    status: 'todo',
    priority: 'high',
    assignee: '张三',
    avatarColor: '#409eff',
    deadline: '2026-04-26'
  },
  {
    id: 2,
    title: '实现权限控制',
    status: 'in_progress',
    priority: 'medium',
    assignee: '李四',
    avatarColor: '#67c23a',
    deadline: '2026-04-28'
  },
  {
    id: 3,
    title: '测试甘特图功能',
    status: 'review',
    priority: 'low',
    assignee: '王五',
    avatarColor: '#e6a23c',
    deadline: '2026-04-30'
  },
  {
    id: 4,
    title: '优化首页性能',
    status: 'done',
    priority: 'medium',
    assignee: '张三',
    avatarColor: '#409eff',
    deadline: '2026-04-24'
  },
  {
    id: 5,
    title: '修复登录Bug',
    status: 'blocked',
    priority: 'high',
    assignee: '李四',
    avatarColor: '#67c23a',
    deadline: '2026-04-25'
  }
])

const getTasksByStatus = (status) => {
  return tasks.value.filter(task => {
    const matchesStatus = task.status === status
    const matchesPriority = !filterPriority.value || task.priority === filterPriority.value
    const matchesAssignee = !filterAssignee.value || task.assignee === filterAssignee.value
    return matchesStatus && matchesPriority && matchesAssignee
  })
}
</script>

<style scoped>
.project-kanban {
  padding: 20px;
}

.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.kanban-header h1 {
  font-size: 24px;
  color: #333;
}

.kanban-toolbar {
  display: flex;
  gap: 10px;
}

.kanban-toolbar select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.kanban-columns {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.kanban-column {
  flex: 0 0 300px;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  min-height: 500px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.column-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.add-task-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-task-btn:hover {
  background-color: #66b1ff;
}

.task-list {
  space-y: 10px;
}

.task-card {
  background-color: white;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-header {
  margin-bottom: 10px;
}

.priority-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.priority-tag.high {
  background-color: #fef0f0;
  color: #f56c6c;
}

.priority-tag.medium {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.priority-tag.low {
  background-color: #f0f9eb;
  color: #67c23a;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 5px;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
}

.deadline {
  white-space: nowrap;
}
</style>