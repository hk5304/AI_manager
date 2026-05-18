<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-box">
        <div class="brand-icon"><span class="material-symbols-outlined">science</span></div>
        <div>
          <h1 class="brand-title">R&D 系统</h1>
          <p class="brand-subtitle">AI 驱动型协作平台</p>
        </div>
      </div>
      <button class="sidebar-primary-cta" @click="handleCreateTask">
        <span class="material-symbols-outlined">add_task</span>新建任务
      </button>
      <nav class="sidebar-nav">
        <router-link class="nav-item" to="/dashboard"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></router-link>
        <router-link class="nav-item" to="/projects"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></router-link>
        <router-link class="nav-item" to="/workbench"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></router-link>
        <a class="nav-item notification-nav" href="#" @click.prevent="handleOpenNotifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-badge">{{ unreadCount }}</span>
        </a>
        <router-link class="nav-item" to="/reports"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></router-link>
        <router-link class="nav-item" to="/settings"><span class="material-symbols-outlined">settings</span><span>系统设置</span></router-link>
        <router-link class="nav-item" to="/admin"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></router-link>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <button class="topbar-back-btn" type="button" @click="goBack">
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
          <span class="topbar-back-label">返回</span>
        </button>
        <div>
          <h2 class="topbar-title">任务详情</h2>
          <div class="topbar-breadcrumb">
            <span>项目</span><span>/</span><span>{{ task?.projectName || '任务详情' }}</span><span>/</span><span>任务详情</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索任务..." v-model="searchKeyword" @input="handleSearch" />
        </label>
        <button class="icon-btn notification-link" type="button" @click="handleOpenNotifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-badge">{{ unreadCount }}</span>
        </button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack" v-if="task">
        <div class="page-header">
          <div class="task-header-info">
            <span class="priority-badge" :class="task.priority.toLowerCase()">{{ task.priority }}</span>
            <span class="status-tag" :class="getStatusClass(task.status)">{{ task.status }}</span>
            <span v-if="task.reviewStatus === 'approved'" class="review-badge approved">
              <span class="material-symbols-outlined">check_circle</span>已通过审核
            </span>
            <span v-if="task.reviewStatus === 'rejected'" class="review-badge rejected">
              <span class="material-symbols-outlined">close</span>已驳回
            </span>
          </div>
          <div class="page-actions">
            <button class="btn-secondary" @click="handleDeleteTask" v-if="canDelete">
              <span class="material-symbols-outlined">delete</span>删除任务
            </button>
            <button class="btn-secondary" @click="handleEditTask">
              <span class="material-symbols-outlined">edit</span>编辑
            </button>
            <button class="btn-primary" @click="handleSubmitForReview" v-if="canSubmitReview">
              <span class="material-symbols-outlined">send</span>提交审核
            </button>
          </div>
        </div>

        <div class="task-detail-grid">
          <div class="task-main-content">
            <section class="glass-panel task-title-section">
              <h1 class="task-title">{{ task.title }}</h1>
              <p class="task-description">{{ task.description || '暂无描述' }}</p>
            </section>

            <section class="glass-panel task-info-section">
              <h2 class="section-title">任务信息</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>负责人</label>
                  <div class="assignee-info">
                    <div class="avatar-sm" :style="{ backgroundColor: getAvatarColor(task.assigneeId) }">
                      {{ task.assignee?.charAt(0) || '?' }}
                    </div>
                    <span>{{ task.assignee || '未分配' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <label>审核人</label>
                  <div class="assignee-info">
                    <div class="avatar-sm" :style="{ backgroundColor: getAvatarColor(task.reviewerId) }">
                      {{ task.reviewer?.charAt(0) || '?' }}
                    </div>
                    <span>{{ task.reviewer || '未指定' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <label>截止日期</label>
                  <span class="due-date" :class="{ overdue: isOverdue(task.dueDate) }">
                    <span class="material-symbols-outlined">calendar_today</span>
                    {{ task.dueDate || '未设置' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>预估工时</label>
                  <span>{{ task.estimatedHours || 0 }} 小时</span>
                </div>
                <div class="info-item">
                  <label>实际工时</label>
                  <span>{{ task.actualHours || 0 }} 小时</span>
                </div>
                <div class="info-item">
                  <label>所属项目</label>
                  <span>{{ task.projectName || '未指定项目' }}</span>
                </div>
              </div>
            </section>

            <section class="glass-panel task-status-section">
              <h2 class="section-title">任务状态</h2>
              <div class="status-flow">
                <div v-for="(status, index) in statusFlow" :key="status.value" 
                     class="status-step" :class="{ active: isStatusActive(status.value), completed: isStatusCompleted(status.value) }">
                  <div class="status-step-dot"></div>
                  <span class="status-step-label">{{ status.label }}</span>
                </div>
              </div>
              <div class="status-actions" v-if="canChangeStatus">
                <label>更新状态：</label>
                <select v-model="newStatus" class="status-select">
                  <option v-for="s in availableStatuses" :key="s" :value="s">{{ s }}</option>
                </select>
                <button class="btn-chip active" @click="handleChangeStatus">
                  <span class="material-symbols-outlined">check</span>确认
                </button>
              </div>
            </section>

            <section class="glass-panel task-attachments-section">
              <div class="section-header">
                <h2 class="section-title">附件</h2>
                <button class="btn-chip" @click="triggerFileUpload">
                  <span class="material-symbols-outlined">add</span>添加附件
                </button>
                <input type="file" id="task-file-upload" multiple hidden @change="handleAddAttachment" />
              </div>
              <div class="attachment-list" v-if="task.attachments && task.attachments.length > 0">
                <div v-for="(file, index) in task.attachments" :key="index" class="attachment-item">
                  <span class="material-symbols-outlined">attach_file</span>
                  <span>{{ file }}</span>
                  <button class="icon-btn-small" @click="handleRemoveAttachment(index)">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <div v-else class="empty-state">
                <span class="material-symbols-outlined">folder_open</span>
                <p>暂无附件</p>
              </div>
            </section>

            <section class="glass-panel task-comments-section">
              <div class="section-header">
                <h2 class="section-title">评论 ({{ task.comments?.length || 0 }})</h2>
              </div>
              <div class="comment-list" v-if="task.comments && task.comments.length > 0">
                <div v-for="comment in task.comments" :key="comment.id" class="comment-item">
                  <div class="comment-avatar" :style="{ backgroundColor: getAvatarColor(comment.userId) }">
                    {{ comment.userName?.charAt(0) || '?' }}
                  </div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-author">{{ comment.userName }}</span>
                      <span class="comment-time">{{ comment.time }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <span class="material-symbols-outlined">message</span>
                <p>暂无评论</p>
              </div>
              <div class="comment-input-area">
                <input v-model="newComment" type="text" placeholder="添加评论..." class="comment-input" @keyup.enter="handleAddComment" />
                <button class="btn-primary" @click="handleAddComment">
                  <span class="material-symbols-outlined">send</span>发送
                </button>
              </div>
            </section>

            <section class="glass-panel task-review-section" v-if="task.reviewStatus">
              <h2 class="section-title">审核结果</h2>
              <div class="review-result" :class="task.reviewStatus">
                <div class="review-result-header">
                  <span class="material-symbols-outlined">{{ task.reviewStatus === 'approved' ? 'check_circle' : 'close' }}</span>
                  <span>{{ task.reviewStatus === 'approved' ? '审核通过' : '审核驳回' }}</span>
                </div>
                <div class="review-result-info">
                  <p><strong>审核时间：</strong>{{ task.reviewTime || '未知' }}</p>
                  <p><strong>审核意见：</strong>{{ task.reviewComment || '无' }}</p>
                </div>
              </div>
            </section>
          </div>

          <div class="task-sidebar">
            <section class="glass-panel">
              <h2 class="section-title">AI 助手</h2>
              <div class="ai-suggestions">
                <div class="ai-card">
                  <h4>任务拆解建议</h4>
                  <p>{{ aiSuggestions.breakdown }}</p>
                </div>
                <div class="ai-card">
                  <h4>排期建议</h4>
                  <p>{{ aiSuggestions.scheduling }}</p>
                </div>
                <button class="btn-chip active" @click="handleAiDecompose">
                  <span class="material-symbols-outlined">auto_awesome</span>AI 任务拆解
                </button>
              </div>
            </section>

            <section class="glass-panel" style="margin-top: 20px;">
              <h2 class="section-title">操作日志</h2>
              <div class="activity-list">
                <div class="activity-item">
                  <span class="material-symbols-outlined">schedule</span>
                  <div>
                    <p>创建时间</p>
                    <span>{{ task.createdAt }}</span>
                  </div>
                </div>
                <div class="activity-item">
                  <span class="material-symbols-outlined">update</span>
                  <div>
                    <p>更新时间</p>
                    <span>{{ task.updatedAt }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div v-else class="empty-task">
        <span class="material-symbols-outlined">task_alt</span>
        <h2>任务不存在</h2>
        <p>该任务可能已被删除或您没有访问权限</p>
        <button class="btn-primary" @click="goBack">返回上一页</button>
      </div>
    </main>

    <div class="modal-shell" :class="{ open: showEditModal }">
      <div class="modal-backdrop" @click="closeEditModal"></div>
      <section class="modal-panel glass-panel-strong edit-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-primary">编辑任务</span>
            <h2 class="section-title">编辑任务详情</h2>
          </div>
          <button class="modal-close" @click="closeEditModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form class="task-form" @submit.prevent="handleSaveTask">
          <div class="form-section">
            <label>任务标题</label>
            <input type="text" v-model="taskForm.title" placeholder="请输入任务标题" required />
          </div>
          
          <div class="form-section">
            <label>任务描述</label>
            <textarea v-model="taskForm.description" placeholder="请输入任务描述" rows="4"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-section">
              <label>优先级</label>
              <select v-model="taskForm.priority">
                <option value="P0">P0 - 紧急</option>
                <option value="P1">P1 - 高</option>
                <option value="P2">P2 - 中</option>
                <option value="P3">P3 - 低</option>
              </select>
            </div>
            <div class="form-section">
              <label>截止日期</label>
              <input type="date" v-model="taskForm.dueDate" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-section">
              <label>指派人</label>
              <select v-model="taskForm.assigneeId">
                <option value="">请选择指派人</option>
                <option v-for="user in assignableUsers" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ getRoleLabel(user.role) }})
                </option>
              </select>
            </div>
            <div class="form-section">
              <label>审核人</label>
              <select v-model="taskForm.reviewerId">
                <option value="">请选择审核人</option>
                <option v-for="user in reviewers" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ getRoleLabel(user.role) }})
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-section">
              <label>预估工时</label>
              <input type="number" v-model="taskForm.estimatedHours" placeholder="预估工时（小时）" min="1" />
            </div>
            <div class="form-section">
              <label>实际工时</label>
              <input type="number" v-model="taskForm.actualHours" placeholder="实际工时（小时）" min="0" />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeEditModal">取消</button>
            <button type="submit" class="btn-primary">保存修改</button>
          </div>
        </form>
      </section>
    </div>

    <div class="modal-shell" :class="{ open: showAiDecomposeModal }">
      <div class="modal-backdrop" @click="closeAiDecomposeModal"></div>
      <section class="modal-panel glass-panel-strong ai-decompose-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai">AI 任务拆解</span>
            <h2 class="section-title">智能任务拆解</h2>
          </div>
          <button class="modal-close" @click="closeAiDecomposeModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="ai-decompose-content">
          <div class="ai-loading" v-if="isAiDecomposing">
            <div class="ai-spinner"></div>
            <p>AI 正在分析任务并生成拆解方案...</p>
          </div>
          <div v-else-if="aiDecomposedTasks.length > 0" class="decompose-result">
            <h3>建议拆解为以下子任务：</h3>
            <div v-for="(subtask, index) in aiDecomposedTasks" :key="index" class="decompose-task-item">
              <div class="decompose-task-header">
                <span class="decompose-task-number">{{ index + 1 }}</span>
                <span class="decompose-task-title">{{ subtask.title }}</span>
                <span class="priority-badge" :class="subtask.priority.toLowerCase()">{{ subtask.priority }}</span>
              </div>
              <p class="decompose-task-desc">{{ subtask.description }}</p>
              <div class="decompose-task-meta">
                <span>预计工时：{{ subtask.hours }}小时</span>
                <span>截止：{{ subtask.dueDate }}</span>
              </div>
            </div>
            <div class="decompose-actions">
              <button class="btn-secondary" @click="closeAiDecomposeModal">关闭</button>
              <button class="btn-primary" @click="handleCreateSubtasks">
                <span class="material-symbols-outlined">add_task</span>创建这些子任务
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pushNotificationPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'
import { taskStore, notificationStore } from '../store/taskStore.js'
import { users } from '../data/mockData.js'

const route = useRoute()
const router = useRouter()

const currentUser = {
  name: computed(() => taskStore.state.currentUserName),
  role: computed(() => taskStore.state.currentRole),
  avatar: 'https://i.pravatar.cc/80?img=47'
}

const unreadCount = computed(() => notificationStore.getUnreadCount())

const taskId = computed(() => route.params.id ? parseInt(route.params.id) : null)

const task = computed(() => {
  if (!taskId.value) return null
  return taskStore.state.tasks.find(t => t.id === taskId.value) || null
})

const searchKeyword = ref('')

const showEditModal = ref(false)
const showAiDecomposeModal = ref(false)
const isAiDecomposing = ref(false)

const taskForm = reactive({
  title: '',
  description: '',
  priority: 'P1',
  dueDate: '',
  assigneeId: '',
  reviewerId: '',
  estimatedHours: 8,
  actualHours: 0
})

const newComment = ref('')
const newStatus = ref('')
const aiDecomposedTasks = ref([])

const statusFlow = [
  { value: '待开始', label: '待开始' },
  { value: '进行中', label: '进行中' },
  { value: '待审核', label: '待审核' },
  { value: '已完成', label: '已完成' }
]

const availableStatuses = computed(() => {
  if (!task.value) return []
  return ['待开始', '进行中', '待审核', '已完成']
})

const canChangeStatus = computed(() => {
  return task.value && (taskStore.state.currentRole === 'super_admin' || 
         taskStore.state.currentRole === 'admin' || 
         taskStore.state.currentRole === 'pm' ||
         task.value.assigneeId === taskStore.state.currentUserId)
})

const canDelete = computed(() => {
  return task.value && (taskStore.state.currentRole === 'super_admin' || 
         taskStore.state.currentRole === 'admin' || 
         task.value.assigneeId === taskStore.state.currentUserId)
})

const canSubmitReview = computed(() => {
  return task.value && 
         task.value.status === '进行中' && 
         task.value.assigneeId === taskStore.state.currentUserId
})

const assignableUsers = computed(() => taskStore.getAssignableUsers())
const reviewers = computed(() => taskStore.getReviewers())

const aiSuggestions = computed(() => {
  if (!task.value) {
    return {
      breakdown: '选择一个任务查看AI建议',
      scheduling: '选择一个任务查看排期建议'
    }
  }
  const priority = task.value.priority || 'P2'
  const hours = task.value.estimatedHours || 8
  return {
    breakdown: `建议将「${task.value.title}」拆分为：需求分析（${Math.ceil(hours * 0.2)}h）、方案设计（${Math.ceil(hours * 0.3)}h）、编码实现（${Math.ceil(hours * 0.4)}h）、测试验证（${Math.ceil(hours * 0.1)}h）等阶段。`,
    scheduling: `基于优先级${priority}和预估工时${hours}h，建议截止日期设置为${task.value.dueDate || '待设置'}，并留出${Math.ceil(hours * 0.2)}h缓冲时间应对变更。`
  }
})

watch(task, (newTask) => {
  if (newTask) {
    newStatus.value = newTask.status
  }
})

onMounted(() => {
  if (taskId.value) {
    const foundTask = taskStore.state.tasks.find(t => t.id === taskId.value)
    if (foundTask) {
      taskStore.openTaskModal(foundTask)
    }
  }
})

const goBack = () => {
  router.back()
}

const handleNavigate = (path) => {
  router.push(path)
}

const handleOpenNotifications = () => {
  pushNotificationPath(router, route.fullPath)
}

const handleSearch = () => {
  taskStore.setSearchKeyword(searchKeyword.value)
}

const getAvatarColor = (userId) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#1989fa', '#67c23a', '#ff9800']
  return colors[(userId || 1) % colors.length]
}

const getStatusClass = (status) => {
  const classes = {
    '待开始': 'info',
    '进行中': 'primary',
    '待审核': 'warning',
    '已通过': 'success',
    '已驳回': 'danger',
    '已完成': 'success'
  }
  return classes[status] || 'default'
}

const isOverdue = (dateStr) => {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

const isStatusActive = (status) => {
  if (!task.value) return false
  const currentIndex = statusFlow.findIndex(s => s.value === task.value.status)
  const targetIndex = statusFlow.findIndex(s => s.value === status)
  return currentIndex === targetIndex
}

const isStatusCompleted = (status) => {
  if (!task.value) return false
  const currentIndex = statusFlow.findIndex(s => s.value === task.value.status)
  const targetIndex = statusFlow.findIndex(s => s.value === status)
  return currentIndex > targetIndex
}

const getRoleLabel = (role) => {
  const labels = {
    super_admin: '超级管理员',
    admin: '管理员',
    pm: '项目组长',
    developer: '开发',
    qa: '测试',
    product: '产品',
    collaborator: '协作方'
  }
  return labels[role] || role
}

const handleCreateTask = () => {
  router.push('/projects')
}

const handleEditTask = () => {
  if (task.value) {
    Object.assign(taskForm, {
      title: task.value.title,
      description: task.value.description,
      priority: task.value.priority,
      dueDate: task.value.dueDate,
      assigneeId: task.value.assigneeId,
      reviewerId: task.value.reviewerId,
      estimatedHours: task.value.estimatedHours,
      actualHours: task.value.actualHours
    })
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleSaveTask = () => {
  const assignee = users.find(u => u.id === parseInt(taskForm.assigneeId))
  const reviewer = users.find(u => u.id === parseInt(taskForm.reviewerId))
  
  taskStore.updateTask(task.value.id, {
    ...taskForm,
    assignee: assignee?.name || task.value.assignee,
    reviewer: reviewer?.name || task.value.reviewer
  })
  
  closeEditModal()
}

const handleDeleteTask = () => {
  if (confirm('确定要删除这个任务吗？此操作不可撤销。')) {
    taskStore.deleteTask(task.value.id)
    router.push('/projects')
  }
}

const handleChangeStatus = () => {
  if (newStatus.value && newStatus.value !== task.value.status) {
    taskStore.changeTaskStatus(task.value.id, newStatus.value)
  }
}

const handleSubmitForReview = () => {
  if (task.value) {
    taskStore.submitForReview(task.value.id)
  }
}

const handleAddComment = () => {
  if (newComment.value.trim() && task.value) {
    taskStore.addComment(task.value.id, newComment.value.trim())
    newComment.value = ''
  }
}

const handleAddAttachment = (event) => {
  const files = event.target.files
  if (files && task.value) {
    for (let i = 0; i < files.length; i++) {
      taskStore.addAttachment(task.value.id, files[i].name)
    }
  }
  event.target.value = ''
}

const handleRemoveAttachment = (index) => {
  if (task.value && task.value.attachments) {
    task.value.attachments.splice(index, 1)
  }
}

const triggerFileUpload = () => {
  document.getElementById('task-file-upload')?.click()
}

const handleAiDecompose = () => {
  showAiDecomposeModal.value = true
  isAiDecomposing.value = true
  aiDecomposedTasks.value = []
  
  setTimeout(() => {
    isAiDecomposing.value = false
    if (task.value) {
      const hours = task.value.estimatedHours || 8
      const baseDate = new Date(task.value.dueDate || new Date())
      
      aiDecomposedTasks.value = [
        {
          title: `需求分析与规划（${task.value.title}）`,
          description: '完成需求调研、功能拆解和技术方案设计',
          priority: 'P1',
          hours: Math.ceil(hours * 0.2),
          dueDate: formatDate(addDays(baseDate, -Math.ceil(hours * 0.3)))
        },
        {
          title: `编码实现（${task.value.title}）`,
          description: '按照设计方案完成功能开发和单元测试',
          priority: 'P1',
          hours: Math.ceil(hours * 0.5),
          dueDate: formatDate(addDays(baseDate, -Math.ceil(hours * 0.15)))
        },
        {
          title: `集成测试与优化（${task.value.title}）`,
          description: '完成系统集成测试、性能优化和问题修复',
          priority: 'P2',
          hours: Math.ceil(hours * 0.2),
          dueDate: formatDate(addDays(baseDate, -Math.ceil(hours * 0.05)))
        },
        {
          title: `验收与文档（${task.value.title}）`,
          description: '完成功能验收、用户文档编写和上线准备',
          priority: 'P2',
          hours: Math.ceil(hours * 0.1),
          dueDate: formatDate(baseDate)
        }
      ]
    }
  }, 1500)
}

const closeAiDecomposeModal = () => {
  showAiDecomposeModal.value = false
}

const handleCreateSubtasks = () => {
  aiDecomposedTasks.value.forEach(subtask => {
    taskStore.createTask({
      title: subtask.title,
      description: subtask.description,
      priority: subtask.priority,
      dueDate: subtask.dueDate,
      estimatedHours: subtask.hours,
      actualHours: 0,
      assigneeId: task.value.assigneeId,
      reviewerId: task.value.reviewerId,
      projectId: task.value.projectId,
      projectName: task.value.projectName,
      status: '待开始'
    })
  })
  closeAiDecomposeModal()
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600&display=swap');
@import '../styles/shared.css';

.task-detail-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.task-main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-title-section {
  padding: 28px;
  border-radius: 24px;
}

.task-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-primary-900);
  margin-bottom: 12px;
}

.task-description {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.task-info-section {
  padding: 24px;
  border-radius: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.info-item span {
  font-size: 14px;
  color: var(--color-primary-900);
  font-weight: 500;
}

.assignee-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 6px;
}

.due-date.overdue {
  color: var(--color-danger-600);
}

.task-status-section {
  padding: 24px;
  border-radius: 20px;
}

.status-flow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  position: relative;
}

.status-flow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-border);
  transform: translateY(-50%);
  z-index: 0;
}

.status-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.status-step-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--color-border);
  transition: all 0.3s;
}

.status-step.active .status-step-dot {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px rgba(79, 143, 246, 0.2);
}

.status-step.completed .status-step-dot {
  background: var(--color-secondary-500);
  border-color: var(--color-secondary-500);
}

.status-step-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.status-step.active .status-step-label {
  color: var(--color-primary-600);
  font-weight: 600;
}

.status-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.status-actions label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.status-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.task-attachments-section,
.task-comments-section,
.task-review-section {
  padding: 24px;
  border-radius: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(0,0,0,0.02);
  border-radius: 10px;
  font-size: 14px;
}

.attachment-item .material-symbols-outlined {
  color: var(--color-primary-500);
}

.icon-btn-small {
  margin-left: auto;
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.icon-btn-small:hover {
  opacity: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: var(--color-text-secondary);
  gap: 8px;
}

.empty-state .material-symbols-outlined {
  font-size: 48px;
  opacity: 0.5;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-900);
}

.comment-time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.comment-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.comment-input-area {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.comment-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
}

.comment-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.review-result {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
}

.review-result.approved {
  background: rgba(156, 239, 219, 0.3);
}

.review-result.rejected {
  background: rgba(255, 218, 214, 0.3);
}

.review-result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 12px;
}

.review-result.approved .review-result-header {
  color: var(--color-secondary-600);
}

.review-result.rejected .review-result-header {
  color: var(--color-danger-600);
}

.review-result-info p {
  font-size: 14px;
  margin-bottom: 6px;
}

.review-result-info strong {
  color: var(--color-primary-900);
}

.ai-suggestions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-card {
  background: rgba(0,0,0,0.02);
  padding: 16px;
  border-radius: 12px;
}

.ai-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-900);
  margin-bottom: 8px;
}

.ai-card p {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-item .material-symbols-outlined {
  color: var(--color-primary-500);
}

.activity-item p {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 0;
}

.activity-item span {
  font-size: 13px;
  color: var(--color-primary-900);
}

.empty-task {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
}

.empty-task .material-symbols-outlined {
  font-size: 80px;
  color: var(--color-text-secondary);
  opacity: 0.3;
  margin-bottom: 20px;
}

.empty-task h2 {
  font-size: 24px;
  color: var(--color-primary-900);
  margin-bottom: 8px;
}

.empty-task p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.edit-modal,
.ai-decompose-modal {
  width: 560px;
  max-height: 90vh;
  overflow-y: auto;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-section label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-900);
}

.form-section input,
.form-section select,
.form-section textarea {
  padding: 12px 14px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  font-size: 14px;
  background: white;
}

.form-section textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.ai-decompose-content {
  padding: 20px 0;
}

.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  gap: 16px;
}

.ai-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.decompose-result h3 {
  font-size: 16px;
  color: var(--color-primary-900);
  margin-bottom: 16px;
}

.decompose-task-item {
  background: rgba(0,0,0,0.02);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.decompose-task-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.decompose-task-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.decompose-task-title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-900);
}

.decompose-task-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  padding-left: 34px;
}

.decompose-task-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-text-secondary);
  padding-left: 34px;
}

.decompose-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}
</style>