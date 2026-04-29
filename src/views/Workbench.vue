<template>
  <div class="workbench">
    <div class="workbench-header">
      <h1>个人工作台</h1>
    </div>
    <div class="workbench-tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'logs' }" @click="activeTab = 'logs'">日志</button>
      <button class="tab-btn" :class="{ active: activeTab === 'kanban' }" @click="activeTab = 'kanban'">看板</button>
      <button class="tab-btn" :class="{ active: activeTab === 'pbc' }" @click="activeTab = 'pbc'">PBC</button>
    </div>
    <div class="workbench-content">
      <!-- 日志 Tab -->
      <div v-if="activeTab === 'logs'" class="logs-tab">
        <div class="logs-header">
          <button class="write-log-btn">写日志</button>
          <div class="log-filter">
            <select v-model="logFilter">
              <option value="all">全部日志</option>
              <option value="mine">我的日志</option>
              <option value="team">团队日志</option>
            </select>
          </div>
        </div>
        <div class="log-list">
          <div class="log-item" v-for="log in filteredLogs" :key="log.id">
            <div class="log-header">
              <div class="log-date-author">
                <h3>{{ log.date }}</h3>
                <span class="log-author">{{ log.author }}</span>
              </div>
              <div class="log-actions">
                <button class="like-btn" :class="{ liked: log.liked }" @click="toggleLike(log.id)">
                  👍 {{ log.likes }}
                </button>
                <button class="comment-btn" @click="toggleComments(log.id)">
                  💬 {{ log.comments.length }}
                </button>
              </div>
            </div>
            <div class="log-content">
              <div class="log-section">
                <h4>今日完成</h4>
                <p>{{ log.today }}</p>
              </div>
              <div class="log-section">
                <h4>明日计划</h4>
                <p>{{ log.tomorrow }}</p>
              </div>
              <div class="log-section">
                <h4>阻塞问题</h4>
                <p>{{ log.blockers }}</p>
              </div>
            </div>
            <div class="log-comments" v-if="expandedComments.includes(log.id)">
              <div class="comment-item" v-for="comment in log.comments" :key="comment.id">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
              </div>
              <div class="add-comment">
                <input type="text" placeholder="添加评论..." v-model="newComment" @keyup.enter="addComment(log.id)">
                <button class="comment-submit-btn">发送</button>
              </div>
            </div>
            <div class="log-footer">
              <button class="ai-generate-btn" @click="generateLogWithAI">AI 一键生成</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 看板 Tab -->
      <div v-if="activeTab === 'kanban'" class="kanban-tab">
        <div class="kanban-header">
          <h2>个人任务看板</h2>
          <div class="kanban-actions">
            <button class="add-task-btn">+ 新建任务</button>
            <select v-model="kanbanFilter">
              <option value="all">所有项目</option>
              <option value="AI项目管理系统">AI项目管理系统</option>
              <option value="智能客服系统">智能客服系统</option>
            </select>
          </div>
        </div>
        <div class="kanban-columns">
          <div class="kanban-column" v-for="column in kanbanColumns" :key="column.id">
            <div class="column-header">
              <h3>{{ column.name }}</h3>
              <span class="task-count">{{ getTasksByStatus(column.id).length }}</span>
            </div>
            <div class="task-list">
              <div class="task-card" v-for="task in getTasksByStatus(column.id)" :key="task.id">
                <div class="task-priority" :class="task.priority">{{ task.priority }}</div>
                <h4 class="task-title">{{ task.title }}</h4>
                <div class="task-meta">
                  <span class="task-project">{{ task.project }}</span>
                  <span class="task-deadline" :class="{ urgent: isUrgent(task.deadline) }">{{ task.deadline }}</span>
                </div>
                <div class="task-progress" v-if="task.progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ task.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- PBC Tab -->
      <div v-if="activeTab === 'pbc'" class="pbc-tab">
        <div class="pbc-header">
          <h2>个人绩效目标</h2>
          <button class="create-pbc-btn">创建 PBC 目标</button>
        </div>
        <div class="pbc-filters">
          <select v-model="pbcPeriodFilter">
            <option value="all">全部周期</option>
            <option value="2026年Q2">2026年Q2</option>
            <option value="2026年Q1">2026年Q1</option>
          </select>
        </div>
        <div class="pbc-list">
          <div class="pbc-item" v-for="pbc in filteredPBCGoals" :key="pbc.id">
            <div class="pbc-header">
              <h3>{{ pbc.title }}</h3>
              <div class="pbc-header-actions">
                <span class="pbc-progress">{{ pbc.progress }}%</span>
                <span class="pbc-status" :class="pbc.status">{{ pbc.statusText }}</span>
              </div>
            </div>
            <div class="pbc-progress-bar">
              <div class="progress-fill" :style="{ width: pbc.progress + '%', backgroundColor: getProgressColor(pbc.progress) }"></div>
            </div>
            <div class="pbc-meta">
              <span class="pbc-period">{{ pbc.period }}</span>
              <span class="pbc-type">{{ pbc.type }}</span>
            </div>
            <div class="pbc-actions">
              <button class="assess-btn" v-if="pbc.status === 'in_progress'">自评</button>
              <button class="feedback-btn" v-if="pbc.status === 'pending_feedback'">上级反馈</button>
              <button class="view-btn">查看详情</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { logs as mockLogs, tasks as mockTasks, pbcGoals as mockPbcGoals } from '../data/mockData.js'

const activeTab = ref('logs')
const logFilter = ref('all')
const kanbanFilter = ref('all')
const pbcPeriodFilter = ref('all')
const expandedComments = ref([])
const newComment = ref('')

const logs = ref(mockLogs.map(log => ({
  ...log,
  author: log.userName,
  today: log.completed,
  tomorrow: log.plan,
  blockers: log.issues,
  liked: false
})))

const kanbanColumns = ref([
  { id: 'todo', name: '待开始' },
  { id: 'in_progress', name: '进行中' },
  { id: 'review', name: '待评审' },
  { id: 'done', name: '已完成' }
])

const tasks = ref(mockTasks.map(task => ({
  ...task,
  status: task.status === '待开始' ? 'todo' : 
          task.status === '进行中' ? 'in_progress' : 
          task.status === '待评审' ? 'review' : 'done',
  project: '智能办公系统',
  progress: task.actualHours / task.estimatedHours * 100 || 0
})))

const pbcGoals = ref(mockPbcGoals.map(goal => ({
  ...goal,
  period: '2026年Q2',
  status: goal.status === '进行中' ? 'in_progress' : 'completed',
  statusText: goal.status
})))

const filteredLogs = computed(() => {
  if (logFilter.value === 'mine') {
    return logs.value.filter(log => log.author === '张三')
  } else if (logFilter.value === 'team') {
    return logs.value.filter(log => log.author !== '张三')
  }
  return logs.value
})

const filteredPBCGoals = computed(() => {
  if (pbcPeriodFilter.value === 'all') {
    return pbcGoals.value
  }
  return pbcGoals.value.filter(pbc => pbc.period === pbcPeriodFilter.value)
})

const getTasksByStatus = (status) => {
  let filtered = tasks.value.filter(task => task.status === status)
  if (kanbanFilter.value !== 'all') {
    filtered = filtered.filter(task => task.project === kanbanFilter.value)
  }
  return filtered
}

const toggleLike = (logId) => {
  const log = logs.value.find(log => log.id === logId)
  if (log) {
    log.liked = !log.liked
    log.likes += log.liked ? 1 : -1
  }
}

const toggleComments = (logId) => {
  const index = expandedComments.value.indexOf(logId)
  if (index > -1) {
    expandedComments.value.splice(index, 1)
  } else {
    expandedComments.value.push(logId)
  }
}

const addComment = (logId) => {
  if (newComment.value.trim()) {
    const log = logs.value.find(log => log.id === logId)
    if (log) {
      log.comments.push({
        id: log.comments.length + 1,
        author: '张三',
        content: newComment.value,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
      newComment.value = ''
    }
  }
}

const generateLogWithAI = () => {
  // 模拟AI生成日志
  alert('AI正在生成日志...')
  setTimeout(() => {
    alert('日志生成完成，请修改后提交')
  }, 1000)
}

const isUrgent = (deadline) => {
  const today = new Date()
  const taskDate = new Date(deadline)
  const diffTime = taskDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 1
}

const getProgressColor = (progress) => {
  if (progress >= 80) {
    return '#52C41A'
  } else if (progress >= 50) {
    return '#1890FF'
  } else {
    return '#FAAD14'
  }
}
</script>

<style scoped>
.workbench {
  padding: 20px;
}

.workbench-header {
  margin-bottom: 30px;
}

.workbench-header h1 {
  font-size: 24px;
  color: #333;
}

.workbench-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #f0f2f5;
}

.tab-btn {
  padding: 10px 0;
  border: none;
  background: none;
  font-size: 16px;
  color: #606266;
  cursor: pointer;
  position: relative;
}

.tab-btn.active {
  color: #1890FF;
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1890FF;
}

.workbench-content {
  min-height: 500px;
}

/* 日志 Tab */
.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.write-log-btn {
  background-color: #1890FF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.write-log-btn:hover {
  background-color: #40a9ff;
}

.log-filter select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.log-item {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.log-date-author {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.log-date-author h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.log-author {
  font-size: 14px;
  color: #909399;
}

.log-actions {
  display: flex;
  gap: 15px;
}

.like-btn, .comment-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.like-btn:hover, .comment-btn:hover {
  background-color: #f0f2f5;
}

.like-btn.liked {
  color: #FF4D4F;
}

.log-content {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.log-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.log-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.log-section p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.log-comments {
  border-top: 1px solid #f0f2f5;
  padding-top: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.comment-content {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.add-comment {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-comment input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.comment-submit-btn {
  background-color: #1890FF;
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.comment-submit-btn:hover {
  background-color: #40a9ff;
}

.log-footer {
  display: flex;
  justify-content: flex-end;
}

.ai-generate-btn {
  background-color: #f5f7fa;
  color: #1890FF;
  border: 1px solid #dcdfe6;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.ai-generate-btn:hover {
  background-color: #ecf5ff;
}

/* 看板 Tab */
.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.kanban-header h2 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.kanban-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.kanban-actions .add-task-btn {
  background-color: #1890FF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.kanban-actions .add-task-btn:hover {
  background-color: #40a9ff;
}

.kanban-actions select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.kanban-tab {
  overflow-x: auto;
}

.kanban-columns {
  display: flex;
  gap: 20px;
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

.column-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.task-count {
  background-color: #dcdfe6;
  color: #606266;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-card {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-priority {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

.task-priority.P0 {
  background-color: #fef0f0;
  color: #FF4D4F;
}

.task-priority.P1 {
  background-color: #fdf6ec;
  color: #FAAD14;
}

.task-priority.P2 {
  background-color: #ecf5ff;
  color: #1890FF;
}

.task-priority.P3 {
  background-color: #f5f7fa;
  color: #909399;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
  padding-right: 60px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}

.task-deadline.urgent {
  color: #FF4D4F;
  font-weight: 500;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.task-progress .progress-bar {
  flex: 1;
  height: 6px;
  background-color: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
}

.task-progress .progress-fill {
  height: 100%;
  background-color: #1890FF;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

/* PBC Tab */
.pbc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pbc-header h2 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.create-pbc-btn {
  background-color: #1890FF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.create-pbc-btn:hover {
  background-color: #40a9ff;
}

.pbc-filters {
  margin-bottom: 20px;
}

.pbc-filters select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.pbc-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pbc-item {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pbc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.pbc-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.pbc-header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pbc-progress {
  font-size: 14px;
  font-weight: 500;
  color: #1890FF;
}

.pbc-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.pbc-status.进行中 {
  background-color: #ecf5ff;
  color: #1890FF;
}

.pbc-status.已完成 {
  background-color: #f0f9eb;
  color: #52C41A;
}

.pbc-status.待反馈 {
  background-color: #fdf6ec;
  color: #FAAD14;
}

.pbc-progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.pbc-progress-bar .progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.pbc-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.pbc-type {
  background-color: #f5f7fa;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: #666;
}

.pbc-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.assess-btn, .feedback-btn, .view-btn {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.assess-btn {
  background-color: #f5f7fa;
  color: #1890FF;
}

.feedback-btn {
  background-color: #f5f7fa;
  color: #52C41A;
}

.view-btn {
  background-color: #f5f7fa;
  color: #606266;
}

.assess-btn:hover, .feedback-btn:hover, .view-btn:hover {
  background-color: #ecf5ff;
}
</style>