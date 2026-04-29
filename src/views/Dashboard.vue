<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>全局工作台</h1>
    </div>
    <div class="dashboard-content">
      <div class="card">
        <h2>待办任务</h2>
        <div class="task-list">
          <div class="task-item" v-for="task in tasks" :key="task.id" @click="goToTask(task.id)">
            <div class="task-info">
              <h3>{{ task.title }}</h3>
              <p @click.stop="goToProject(task.projectId)">{{ task.project }}</p>
              <p class="deadline">截止日期：{{ task.deadline }}</p>
            </div>
            <div class="task-priority" :class="task.priority">
              {{ task.priorityText }}
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>今日日志</h2>
        <button class="log-btn" @click="goToWorkbench">写日志</button>
        <div class="log-preview" v-if="latestLog">
          <p>{{ latestLog.content }}</p>
          <p class="log-time">{{ latestLog.time }}</p>
        </div>
      </div>
      <div class="card">
        <h2>个人进度概览</h2>
        <div class="progress-item" v-for="project in projects" :key="project.id">
          <div class="progress-header">
            <span class="project-link" @click="goToProject(project.id)">{{ project.name }}</span>
            <span>{{ project.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
          </div>
        </div>
      </div>
      <div class="card ai-card">
        <h2>AI 日报建议</h2>
        <div class="ai-suggestion">
          <p>{{ aiSuggestion }}</p>
          <button class="adopt-btn">一键采纳</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tasks = ref([
  { id: 1, title: '完成登录页面开发', project: 'AI项目管理系统', projectId: 1, deadline: '2026-04-26', priority: 'high', priorityText: '高' },
  { id: 2, title: '实现权限控制', project: 'AI项目管理系统', projectId: 1, deadline: '2026-04-28', priority: 'medium', priorityText: '中' },
  { id: 3, title: '测试甘特图功能', project: 'AI项目管理系统', projectId: 1, deadline: '2026-04-30', priority: 'low', priorityText: '低' }
])

const latestLog = ref({
  content: '今日完成了登录页面的开发和测试...',
  time: '2026-04-25 18:00'
})

const projects = ref([
  { id: 1, name: 'AI项目管理系统', progress: 60 },
  { id: 2, name: '智能客服系统', progress: 30 },
  { id: 3, name: '数据可视化平台', progress: 80 }
])

const aiSuggestion = ref('根据您今天的任务完成情况，建议您在日志中记录：1. 完成了登录页面的开发和测试；2. 解决了权限控制的关键问题；3. 明日计划实现甘特图功能。')

const goToTask = (taskId) => {
  router.push(`/task/${taskId}`)
}

const goToProject = (projectId) => {
  router.push(`/project/${projectId}`)
}

const goToWorkbench = () => {
  router.push('/workbench')
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 24px;
  color: #333;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.task-list {
  space-y: 10px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.task-info h3 {
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
}

.task-info p {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.deadline {
  color: #999 !important;
}

.task-priority {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.task-priority.high {
  background-color: #fef0f0;
  color: #f56c6c;
}

.task-priority.medium {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.task-priority.low {
  background-color: #f0f9eb;
  color: #67c23a;
}

.log-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 15px;
}

.log-btn:hover {
  background-color: #66b1ff;
}

.log-preview {
  border: 1px solid #f0f0f0;
  padding: 10px;
  border-radius: 4px;
}

.log-preview p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.log-time {
  font-size: 12px;
  color: #999 !important;
}

.progress-item {
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #409eff;
  border-radius: 4px;
}

.ai-card {
  grid-column: 1 / -1;
}

.ai-suggestion {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.ai-suggestion p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.adopt-btn {
  background-color: #67c23a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.adopt-btn:hover {
  background-color: #85ce61;
}
</style>