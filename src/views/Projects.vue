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
      <button class="sidebar-primary-cta" @click="openModal">
        <span class="material-symbols-outlined">add_circle</span>
        新建项目
      </button>
      <nav class="sidebar-nav">
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></a>
        <a class="nav-item active" href="#" @click.prevent="handleNavigate('/projects')"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/workbench')"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/reports')"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/settings')"><span class="material-symbols-outlined">settings</span><span>系统设置</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/admin')"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></a>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <div>
          <h2 class="topbar-title">研发创新管理平台</h2>
          <div class="topbar-breadcrumb">
            <span>项目</span>
            <span>/</span>
            <span>项目矩阵</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索项目、负责人、标签..." />
        </label>
        <a class="icon-btn notification-link" href="#" @click.prevent="handleNavigate('/notifications')" aria-label="打开通知中心"><span class="material-symbols-outlined">notifications</span><span class="notification-badge">5</span></a>
        <button class="icon-btn"><span class="material-symbols-outlined">apps</span></button>
        <button class="icon-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack">
        <div class="page-header">
          <div>
            <h1 class="page-title">项目矩阵</h1>
            <p class="page-subtitle">展示所有有权限查看的项目，支持搜索、筛选、排序和快速新建。</p>
          </div>
          <div class="page-actions">
            <div class="glass-soft" style="padding: 10px 14px; border-radius: 20px; display: flex; align-items: center; gap: 14px;">
              <div class="avatar-stack">
                <img src="https://i.pravatar.cc/80?img=15" alt="成员1" />
                <img src="https://i.pravatar.cc/80?img=32" alt="成员2" />
                <img src="https://i.pravatar.cc/80?img=45" alt="成员3" />
              </div>
              <span class="muted" style="font-size: 14px;">12 位活跃成员</span>
            </div>
            <button class="btn-primary" @click="openModal"><span class="material-symbols-outlined">add</span>新建项目</button>
          </div>
        </div>

        <section class="glass-panel filter-bar">
          <label class="search-shell" style="margin-right: auto;">
            <span class="material-symbols-outlined">search</span>
            <input type="text" placeholder="按项目名称或负责人筛选..." v-model="searchKeyword" />
          </label>
          <button class="btn-chip active"><span class="material-symbols-outlined">tune</span>全部状态</button>
          <button class="btn-chip" :class="{ active: sortField === 'owner' }" @click="sortByOwner"><span class="material-symbols-outlined">person_search</span>负责人 <span v-if="sortField === 'owner'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></button>
          <button class="btn-chip" :class="{ active: sortField === 'health' }" @click="sortByHealth"><span class="material-symbols-outlined">sell</span>标签 <span v-if="sortField === 'health'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></button>
          <button class="btn-chip" :class="{ active: sortField === 'deadline' }" @click="sortByDeadline"><span class="material-symbols-outlined">calendar_today</span>截止日期 <span v-if="sortField === 'deadline'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></button>
          <button class="btn-chip" :class="{ active: sortField === 'priority' }" @click="sortByPriority"><span class="material-symbols-outlined">sort</span>权重排序 <span v-if="sortField === 'priority'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></button>
        </section>

        <section style="display: flex; flex-direction: column; gap: 16px;">
          <a v-for="project in sortedProjects" :key="project.id" class="glass-panel project-row" href="#" @click.prevent="handleNavigate(`/project/${project.id}`)">
            <div class="project-meta">
              <div class="project-title-line">
                <span style="width: 10px; height: 10px; border-radius: 50%; display: inline-block;" :style="{ background: project.color }"></span>
                <h3>{{ project.name }}</h3>
              </div>
              <p>{{ project.department }} · 项目编号：{{ project.code }} · 标签：{{ project.tags.join(' / ') }}</p>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span class="section-caption">完成度</span>
                <strong :style="{ color: project.color }">{{ project.progress }}%</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: project.progress + '%', background: `linear-gradient(90deg, ${project.color}, ${project.color})` }"></div>
              </div>
            </div>
            <div>
              <span class="status-tag" :class="getHealthClass(project.health)">健康度：{{ project.health }}</span>
              <p class="task-note" style="margin-top: 8px;">状态：{{ project.status }}</p>
            </div>
            <div class="member-chip">
              <img :src="project.owner.avatar" :alt="project.owner.name" />
              <div>
                <strong>{{ project.owner.name }}</strong>
                <span class="section-caption">负责人</span>
              </div>
            </div>
            <div>
              <strong>{{ project.deadline }}</strong>
              <p class="task-note" style="margin-top: 6px;">成员数：{{ project.memberCount }}</p>
            </div>
            <div class="priority-indicator" :class="project.priority">
              <span v-for="i in getPriorityCount(project.priority)" :key="i" class="priority-bar"></span>
            </div>
          </a>
        </section>

        <section class="grid-3">
          <div class="glass-panel metric-card">
            <h3>研发预算分配</h3>
            <div class="value" style="font-size: 38px; color: var(--color-primary-700);">¥ 12.4M</div>
            <div class="trend" style="color: var(--color-secondary-600);">+4.2% 较上周</div>
            <div class="progress-track" style="margin-top: 18px;"><div class="progress-fill" style="width: 60%; background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));"></div></div>
          </div>
          <div class="glass-panel metric-card" style="text-align: center;">
            <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-tertiary-600);">rocket_launch</span>
            <div class="value" style="font-size: 46px;">24</div>
            <p class="page-subtitle" style="font-size: 14px;">本月新启动实验</p>
          </div>
          <div class="glass-panel metric-card" style="text-align: center;">
            <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-secondary-600);">verified</span>
            <div class="value" style="font-size: 46px;">182</div>
            <p class="page-subtitle" style="font-size: 14px;">累计专利申请量</p>
          </div>
        </section>
      </div>
    </main>
  </div>

  <div class="modal-shell" :class="{ open: isModalOpen }">
    <div class="modal-backdrop" @click="closeModal"></div>
    <section class="modal-panel glass-panel-strong project-create-modal">
      <div class="modal-header">
        <div>
          <span class="pill pill-ai">新建项目</span>
          <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">创建项目草稿</h2>
          <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">参考当前项目矩阵页的展示维度，先完成名称、编号、负责人、标签、状态与截止时间等核心信息配置，创建后可继续进入详情页补充内容。</p>
        </div>
        <button class="icon-btn" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div class="project-create-layout">
        <div class="project-create-main">
          <article class="glass-panel project-create-card">
            <div class="project-create-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">基础信息</h3>
                <p class="section-caption" style="margin-top: 6px;">对齐项目矩阵页的核心字段展示</p>
              </div>
              <span class="pill pill-neutral">列表主字段</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">项目名称</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">title</span>
                  <input type="text" v-model="formData.name" placeholder="请输入项目名称" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">项目编号</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">tag</span>
                  <input type="text" v-model="formData.code" placeholder="请输入项目编号" />
                </div>
              </div>
            </div>

            <div class="field-inline" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">项目负责人</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">person</span>
                  <input type="text" v-model="formData.owner" placeholder="请输入项目负责人" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">预计成员数</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">group_add</span>
                  <input type="text" v-model="formData.memberCount" placeholder="请输入预计成员数" />
                </div>
              </div>
            </div>

          </article>

          <article class="glass-panel project-create-card">
            <div class="project-create-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">计划与状态</h3>
                <p class="section-caption" style="margin-top: 6px;">用于项目矩阵页的筛选、排序和状态展示</p>
              </div>
              <span class="pill pill-success">计划信息</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">开始日期</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">calendar_today</span>
                  <input type="date" v-model="formData.startDate" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">截止日期</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">event</span>
                  <input type="date" v-model="formData.deadline" />
                </div>
              </div>
            </div>

            <div class="field-stack" style="margin-top: 16px;">
              <label class="field-label">项目优先级</label>
              <div class="field-input">
                <span class="material-symbols-outlined">flag</span>
                <select v-model="formData.priority">
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                </select>
              </div>
            </div>

            <div class="field-stack project-create-textarea" style="margin-top: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label class="field-label">项目摘要</label>
                <button class="btn-ai-summary" @click="generateAiSummary">
                  <span class="material-symbols-outlined">auto_awesome</span>
                  AI 智能摘要
                </button>
              </div>
              <div class="field-input">
                <span class="material-symbols-outlined" style="margin-top: 16px;">article</span>
                <textarea v-model="formData.summary" placeholder="请输入项目摘要"></textarea>
              </div>
            </div>

          </article>

          <article class="glass-panel project-create-card">
            <div class="project-create-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">成员与同步配置</h3>
                <p class="section-caption" style="margin-top: 6px;">创建后默认影响成员字段、矩阵页筛选项和各详情页入口</p>
              </div>
              <span class="pill pill-warning">协作配置</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">核心成员</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">group</span>
                  <input type="text" placeholder="请输入核心成员" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">报告订阅人</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">forward_to_inbox</span>
                  <input type="text" placeholder="请输入报告订阅人" />
                </div>
              </div>
            </div>

            <div class="field-inline" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">风险提醒频率</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">warning</span>
                  <select>
                    <option>每日同步</option>
                    <option>每周同步</option>
                    <option>仅异常提醒</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">模板初始化</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">auto_fix_high</span>
                  <select>
                    <option>自动生成默认结构</option>
                    <option>仅创建空白项目</option>
                    <option>复制最近项目配置</option>
                  </select>
                </div>
              </div>
            </div>


          </article>
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-status">
          <span class="material-symbols-outlined">add_task</span>
          当前为样式参考弹窗，字段结构已按项目矩阵页的展示与筛选需求组织。
        </div>
        <div class="modal-footer-actions">
          <button class="btn-secondary" @click="closeModal"><span class="material-symbols-outlined">close</span>取消</button>
          <button class="btn-secondary" @click="showToast('项目草稿已保存', '新建项目弹窗中的当前内容已保存为创建草稿，可继续调整字段与布局。', 'draft')"><span class="material-symbols-outlined">draft</span>保存草稿</button>
          <button class="btn-primary" @click="createProject"><span class="material-symbols-outlined">rocket_launch</span>创建项目</button>
        </div>
      </div>
    </section>
  </div>

  <button class="floating-ai-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
  <div class="ai-overlay" :class="{ open: isAiDrawerOpen }" @click="closeAiDrawer"></div>
  <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }">
    <div class="ai-header">
      <div>
        <h3>AI 助手</h3>
        <p class="section-caption">当前上下文：项目矩阵</p>
      </div>
      <button class="icon-btn" @click="closeAiDrawer"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="ai-card">
      <h4>智能分组建议</h4>
      <p>建议将“量子纠缠通信协议 V2”提升至重点风险视图，并将“深度学习实验室自动化”的联调节点提前 3 天，以降低周四并发评审压力。</p>
      <div class="ai-actions">
        <button class="btn-primary">一键采纳</button>
        <button class="btn-secondary">查看项目</button>
      </div>
    </div>
    <div class="ai-list">
      <div class="ai-list-item">
        <h4>新建项目推荐模板</h4>
        <p>如果新项目属于需求迭代，建议优先使用“需求评审 → 开发 → 测试 → 上线 → 验收”模板。</p>
      </div>
      <div class="ai-list-item">
        <h4>负载提醒 · 89% 置信度</h4>
        <p>材料组与平台组在下周二至周四存在资源交叉峰值，建议在项目创建阶段提前锁定负责人。</p>
      </div>
    </div>
  </aside>

  <Transition name="toast">
    <div v-if="toast.show" class="toast-shell">
      <div class="toast">
        <span class="material-symbols-outlined">{{ toast.icon }}</span>
        <div>
          <h4>{{ toast.title }}</h4>
          <p>{{ toast.message }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'
import { useProjects } from '../composables/useProjects'

const router = useRouter()

const currentUser = {
  name: '张工',
  role: '研发总监',
  avatar: 'https://i.pravatar.cc/80?img=12'
}

const { projects, addProject } = useProjects()

const isModalOpen = ref(false)
const isAiDrawerOpen = ref(false)
const toast = ref({ show: false, title: '', message: '', icon: '' })

// 表单数据
const formData = ref({
  name: '',
  code: '',
  owner: '',
  memberCount: '',
  startDate: '',
  deadline: '',
  priority: 'P1',
  summary: ''
})

// 搜索关键词
const searchKeyword = ref('')

// 排序状态
const sortField = ref('')
const sortOrder = ref('asc') // 'asc' | 'desc'

// 健康度优先级映射（由高到低）
const healthPriority = {
  '完成': 4,
  '良好': 3,
  '风险': 2,
  '严重': 1
}

// 搜索并排序后的项目列表
const sortedProjects = computed(() => {
  let list = [...projects.value]
  
  // 先过滤：按项目名称和负责人名字搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    list = list.filter(project => {
      const projectName = project.name.toLowerCase()
      const ownerName = project.owner.name.toLowerCase()
      return projectName.includes(keyword) || ownerName.includes(keyword)
    })
  }
  
  // 再排序
  if (sortField.value === 'deadline') {
    list.sort((a, b) => {
      const dateA = new Date(a.deadline).getTime()
      const dateB = new Date(b.deadline).getTime()
      return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
    })
  } else if (sortField.value === 'health') {
    list.sort((a, b) => {
      const priorityA = healthPriority[a.health] || 0
      const priorityB = healthPriority[b.health] || 0
      return sortOrder.value === 'asc' ? priorityB - priorityA : priorityA - priorityB
    })
  } else if (sortField.value === 'owner') {
    list.sort((a, b) => {
      const nameA = a.owner.name
      const nameB = b.owner.name
      const compare = nameA.localeCompare(nameB, 'zh-CN')
      return sortOrder.value === 'asc' ? compare : -compare
    })
  } else if (sortField.value === 'priority') {
    // 优先级排序：P0 > P1 > P2
    const priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2 }
    list.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 2
      const priorityB = priorityOrder[b.priority] || 2
      return sortOrder.value === 'asc' ? priorityA - priorityB : priorityB - priorityA
    })
  }
  
  return list
})

// 按截止日期排序
const sortByDeadline = () => {
  if (sortField.value === 'deadline') {
    // 切换排序方向
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 设置为按截止日期升序（从近到远）
    sortField.value = 'deadline'
    sortOrder.value = 'asc'
  }
}

// 按健康度排序（由高到低）
const sortByHealth = () => {
  if (sortField.value === 'health') {
    // 切换排序方向
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 设置为按健康度升序（由高到低）
    sortField.value = 'health'
    sortOrder.value = 'asc'
  }
}

// 按负责人名字首字母排序
const sortByOwner = () => {
  if (sortField.value === 'owner') {
    // 切换排序方向
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 设置为按负责人升序（首字母从小到大）
    sortField.value = 'owner'
    sortOrder.value = 'asc'
  }
}

// 按优先级排序（P0 > P1 > P2）
const sortByPriority = () => {
  if (sortField.value === 'priority') {
    // 切换排序方向
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 设置为按优先级升序（P0优先）
    sortField.value = 'priority'
    sortOrder.value = 'asc'
  }
}

// 根据优先级获取竖杠数量
const getPriorityCount = (priority) => {
  const countMap = { 'P0': 3, 'P1': 2, 'P2': 1 }
  return countMap[priority] || 1
}

// 获取健康度对应的标签类名
const getHealthClass = (health) => {
  const classMap = {
    '良好': 'success',
    '风险': 'warning',
    '严重': 'danger',
    '完成': 'success'
  }
  return classMap[health] || 'neutral'
}

const handleNavigate = (path) => {
  router.push(path)
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const toggleAiDrawer = () => {
  isAiDrawerOpen.value = !isAiDrawerOpen.value
}

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false
}

const showToast = (title, message, icon) => {
  toast.value = { show: true, title, message, icon }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// AI 智能摘要生成
const generateAiSummary = () => {
  const aiSummaries = [
    '基于项目目标与资源配置，本项目将系统性地推进核心技术攻关，通过多轮迭代验证确保交付质量。预期在既定时间窗口内完成关键里程碑，并为后续规模化推广奠定基础。',
    '聚焦核心业务痛点，本项目旨在通过技术创新实现效率提升与成本优化。项目团队将采用敏捷迭代方式，快速响应需求变化，确保交付物满足预期目标。',
    '本项目致力于突破关键技术瓶颈，通过跨团队协作与资源整合，推动技术方案落地实施。项目周期内将完成从需求分析到成果交付的全流程闭环。',
    '围绕业务战略目标，本项目将分阶段推进各项任务，重点关注核心指标达成。通过建立有效的沟通机制与风险管控体系，确保项目按计划顺利推进。',
    '本项目聚焦于技术能力建设与业务流程优化，通过引入先进方法论与工具链，提升整体交付能力。预期在项目周期内实现既定的技术目标与业务价值。'
  ]
  const randomIndex = Math.floor(Math.random() * aiSummaries.length)
  formData.value.summary = aiSummaries[randomIndex]
  showToast('AI 摘要已生成', '已为您生成智能项目摘要。', 'auto_awesome')
}

const createProject = () => {
  addProject({
    name: formData.value.name || '新项目',
    code: formData.value.code,
    owner: formData.value.owner || '未指定',
    memberCount: formData.value.memberCount,
    deadline: formData.value.deadline
  })
  showToast('项目已创建', '新项目已成功添加到项目矩阵中。', 'task_alt')
  closeModal()
  // 重置表单
  formData.value = {
    name: '',
    code: '',
    owner: '',
    memberCount: '',
    startDate: '',
    deadline: '',
    priority: 'P1',
    summary: ''
  }
}
</script>

<style scoped>
.project-create-modal {
  width: min(1200px, calc(100vw - 48px));
}

.project-create-layout {
  display: flex;
  justify-content: center;
}

.project-create-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 720px;
}

.project-create-card {
  padding: 20px;
  border-radius: 24px;
}

.project-create-card h3,
.project-create-card p {
  margin: 0;
}

.project-create-kpis {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.project-create-kpi {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.project-create-kpi span,
.project-create-kpi strong {
  display: block;
}

.project-create-kpi span {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.project-create-kpi strong {
  margin-top: 8px;
  font-size: 18px;
}

.project-create-step-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.project-create-step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.project-create-step-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--color-primary-700);
  background: rgba(20, 104, 199, 0.12);
  border: 1px solid rgba(20, 104, 199, 0.16);
  font-size: 13px;
  font-weight: 700;
}

.project-create-step h4,
.project-create-step p {
  margin: 0;
}

.project-create-step p {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.project-create-owner-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.project-create-owner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px 0 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(216, 221, 232, 0.88);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.project-create-owner img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.82);
}

.project-create-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.project-create-card-head h3,
.project-create-card-head p {
  margin: 0;
}

.project-create-field-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.project-create-template-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.project-create-template {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.58);
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.project-create-template.active {
  background: rgba(20, 104, 199, 0.1);
  border-color: rgba(20, 104, 199, 0.18);
}

.project-create-template:hover {
  transform: translateY(-1px);
}

.project-create-template h4,
.project-create-template p {
  margin: 0;
}

.project-create-template p {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.project-create-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.project-create-textarea .field-input {
  align-items: flex-start;
  min-height: 136px;
}

.project-create-textarea textarea {
  min-height: 108px;
}

.project-create-status-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.project-create-status-card {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.project-create-status-card span,
.project-create-status-card strong {
  display: block;
}

.project-create-status-card span {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.project-create-status-card strong {
  margin-top: 8px;
  font-size: 16px;
}

@media (max-width: 1279px) {
  .project-create-layout,
  .project-create-field-grid,
  .project-create-template-grid,
  .project-create-status-grid {
    grid-template-columns: 1fr;
  }
}

/* Toast 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 优先级指示器 */
.priority-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.06);
  min-width: 48px;
  justify-content: center;
}

.priority-bar {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: #9ca3af;
}

.priority-indicator.P0 .priority-bar {
  background: #ef4444;
}

.priority-indicator.P1 .priority-bar {
  background: #f59e0b;
}

.priority-indicator.P2 .priority-bar {
  background: #9ca3af;
}

/* AI 智能摘要按钮 */
.btn-ai-summary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(168, 113, 255, 0.14), rgba(113, 145, 255, 0.14));
  border: 1px solid rgba(168, 113, 255, 0.28);
  color: var(--color-tertiary-600);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ai-summary:hover {
  background: linear-gradient(135deg, rgba(168, 113, 255, 0.22), rgba(113, 145, 255, 0.22));
  border-color: rgba(168, 113, 255, 0.4);
  transform: translateY(-1px);
}

.btn-ai-summary .material-symbols-outlined {
  font-size: 16px;
}

</style>
