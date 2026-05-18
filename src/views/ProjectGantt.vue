<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-box">
        <div class="brand-icon"><span class="material-symbols-outlined">science</span></div>
        <div><h1 class="brand-title">R&D 系统</h1><p class="brand-subtitle">AI 驱动型协作平台</p></div>
      </div>
      <button class="sidebar-primary-cta" type="button"><span class="material-symbols-outlined">edit_square</span>编辑项目</button>
      <nav class="sidebar-nav">
        <router-link class="nav-item" to="/dashboard"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></router-link>
        <router-link class="nav-item active" to="/projects"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></router-link>
        <router-link class="nav-item" to="/workbench"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></router-link>
        <router-link class="nav-item" to="/reports"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></router-link>
        <router-link class="nav-item" to="/settings"><span class="material-symbols-outlined">settings</span><span>系统设置</span></router-link>
        <router-link class="nav-item" to="/admin"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></router-link>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <button class="topbar-back-btn" type="button" @click="goBack"><span class="material-symbols-outlined">arrow_back_ios_new</span><span class="topbar-back-label">返回</span></button>
        <div>
          <h2 class="topbar-title">项目详情</h2>
          <div class="topbar-breadcrumb"><span>项目</span><span>/</span><span>{{ project.name }}</span><span>/</span><span>{{ tabLabelMap[currentTab] }}</span></div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell"><span class="material-symbols-outlined">search</span><input type="text" placeholder="搜索任务、里程碑或成员..." /></label>
        <button class="icon-btn notification-link" type="button" @click="handleOpenNotifications"><span class="material-symbols-outlined">notifications</span><span class="notification-badge">5</span></button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack">
        <div class="page-header">
          <div>
            <h1 class="page-title">项目详情</h1>
            <p class="page-subtitle">聚合项目状态、成员协作、任务流转、排期风险与报表数据，作为项目总工作区入口。</p>
          </div>
          <div class="page-actions">
            <button class="btn-secondary"><span class="material-symbols-outlined">archive</span>归档项目</button>
            <button class="btn-primary"><span class="material-symbols-outlined">track_changes</span>设置基线</button>
          </div>
        </div>

        <section class="summary-card glass-panel">
          <div class="summary-content">
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <span class="pill pill-success">进行中</span>
              <span class="pill pill-ai">需求迭代模板</span>
            </div>
            <h2 class="page-title" style="margin-top:18px;">{{ project.name }}</h2>
            <p class="page-subtitle" style="max-width:880px;">{{ project.desc }}</p>
            <div class="summary-kpis">
              <div class="summary-kpi"><span>项目负责人</span><strong>{{ project.owner }}</strong></div>
              <div class="summary-kpi"><span>时间范围</span><strong>{{ project.range }}</strong></div>
              <div class="summary-kpi"><span>项目进度</span><strong>{{ project.progress }}%</strong></div>
              <div class="summary-kpi"><span>健康度</span><strong style="color:var(--color-secondary-600);">{{ project.health }}</strong></div>
              <div class="summary-kpi"><span>成员数</span><strong>{{ project.members }} 人</strong></div>
            </div>
            <!-- TODO(API): 项目基础信息需接项目详情查询接口 -->
          </div>
        </section>

        <nav class="subnav-bar glass-panel">
          <router-link class="subnav-link" :class="{ active: currentTab === 'overview' }" :to="tabRoute('overview')">概览</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'members' }" :to="tabRoute('members')">成员</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'kanban' }" :to="tabRoute('kanban')">项目看板</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'gantt' }" :to="tabRoute('gantt')">项目甘特图</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'risk' }" :to="tabRoute('risk')">风险看板</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'reports' }" :to="tabRoute('reports')">报表</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'docs' }" :to="tabRoute('docs')">文档</router-link>
        </nav>

        <section v-if="currentTab === 'overview'" class="grid-2-1">
          <div class="glass-panel" style="padding:24px;border-radius:24px;">
            <h2 class="section-title">里程碑与进展摘要</h2>
            <div class="timeline" style="margin-top:18px;">
              <div class="timeline-item" v-for="item in milestones" :key="item.id"><span class="timeline-dot" :style="{ background: item.color }"></span><div class="timeline-body"><h4>{{ item.title }}</h4><p>{{ item.desc }}</p></div></div>
            </div>
            <!-- TODO(API): 概览里程碑与偏差预警需接项目分析接口 -->
          </div>
          <div style="display:flex;flex-direction:column;gap:24px;">
            <div class="glass-panel" style="padding:24px;border-radius:24px;"><h2 class="section-title">基线偏差预警</h2><p class="page-subtitle" style="font-size:15px;margin-top:14px;">当前实际进度较最新基线落后 6%，里程碑“联调验证”偏差 2 天。</p></div>
            <div class="glass-panel" style="padding:24px;border-radius:24px;background:linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42));"><h2 class="section-title">AI 项目建议</h2><p class="page-subtitle" style="font-size:15px;margin-top:14px;">建议将“数据回灌校验”拆分为独立子任务，并从平台组借调 1 名 QA 参与联调。</p></div>
          </div>
        </section>

        <section v-else-if="currentTab === 'members'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <h2 class="section-title">成员列表</h2>
          <div class="member-table" style="margin-top:16px;">
            <div class="member-row" v-for="member in memberRows" :key="member.id"><div class="member-ident"><img :src="member.avatar" :alt="member.name" /><div><strong>{{ member.name }}</strong><p class="muted">{{ member.role }}</p></div></div><div>{{ member.load }}</div><div>{{ member.dept }}</div><div>{{ member.focus }}</div><div>{{ member.status }}</div><span class="icon-btn"><span class="material-symbols-outlined">more_vert</span></span></div>
          </div>
          <!-- TODO(API): 成员邀请、角色调整、组织树检索、负载热力图需接成员与组织接口 -->
        </section>

        <section v-else-if="currentTab === 'kanban'" class="kanban">
          <article class="kanban-column glass-panel" v-for="col in kanbanColumns" :key="col.id">
            <div class="kanban-column-header"><h3>{{ col.name }}</h3><span class="section-caption">{{ col.tasks.length }}</span></div>
            <div class="kanban-card" v-for="task in col.tasks" :key="task.id"><h4>{{ task.title }}</h4><p class="task-note">{{ task.owner }} · {{ task.deadline }}</p></div>
          </article>
          <!-- TODO(API): 看板列、任务卡片、拖拽状态流转需接任务看板接口 -->
        </section>

        <section v-else-if="currentTab === 'gantt'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 class="section-title">项目甘特图</h2>
            <div v-if="isProjectLeader" class="gantt-actions">
              <button class="btn-secondary" @click="openTaskModal('add')"><span class="material-symbols-outlined">add</span>添加任务</button>
              <button class="btn-secondary" @click="showImportModal = true"><span class="material-symbols-outlined">upload</span>批量导入</button>
              <button class="btn-primary" @click="setBaseline"><span class="material-symbols-outlined">track_changes</span>设置基线</button>
            </div>
          </div>

          <!-- 时间轴视图切换 -->
          <div class="gantt-toolbar">
            <div class="view-toggle">
              <button :class="{ active: viewMode === 'week' }" @click="viewMode = 'week'">按周</button>
              <button :class="{ active: viewMode === 'day' }" @click="viewMode = 'day'">按日</button>
              <button :class="{ active: viewMode === 'month' }" @click="viewMode = 'month'">按月</button>
            </div>
            <div class="gantt-controls">
              <button class="icon-btn" @click="toggleBaseline"><span class="material-symbols-outlined">{{ showBaseline ? 'visibility' : 'visibility_off' }}</span>{{ showBaseline ? '隐藏基线' : '显示基线' }}</button>
              <button class="icon-btn" @click="toggleDependencies"><span class="material-symbols-outlined">link</span>依赖关系</button>
              <button class="icon-btn" @click="zoomIn"><span class="material-symbols-outlined">zoom_in</span></button>
              <button class="icon-btn" @click="zoomOut"><span class="material-symbols-outlined">zoom_out</span></button>
            </div>
          </div>

          <!-- 关键路径信息 -->
          <div class="gantt-summary">
            <div class="summary-item"><span class="material-symbols-outlined">timeline</span><strong>关键路径</strong><span>{{ criticalPathCount }} 段</span></div>
            <div class="summary-item"><span class="material-symbols-outlined">version</span><strong>基线版本</strong><span>V{{ baselineVersion }}</span></div>
            <div class="summary-item warning"><span class="material-symbols-outlined">alert_triangle</span><strong>超期节点</strong><span>{{ overdueCount }} 个</span></div>
          </div>

          <!-- 甘特图表格 -->
          <div class="gantt-container">
            <div class="gantt-table">
              <div class="gantt-header">
                <div class="gantt-col task-col"><strong>里程碑/任务</strong></div>
                <div class="gantt-col owner-col"><strong>负责人</strong></div>
                <div class="gantt-col progress-col"><strong>进度</strong></div>
                <div class="gantt-col timeline-col">
                  <div class="timeline-header" v-for="period in timelinePeriods" :key="period.key">{{ period.label }}</div>
                </div>
              </div>
              <div class="gantt-body">
                <div v-for="task in ganttTasks" :key="task.id" class="gantt-row" :class="{ 'critical': task.isCritical, 'milestone': task.isMilestone }">
                  <div class="gantt-col task-col">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span v-if="task.isMilestone" class="milestone-icon">⭐</span>
                      <span v-if="task.isCritical" class="critical-icon">🔴</span>
                      <span>{{ task.name }}</span>
                      <button v-if="isProjectLeader" class="icon-btn xs" @click="openTaskModal('edit', task)"><span class="material-symbols-outlined">more_vert</span></button>
                    </div>
                    <div v-if="task.subtasks && task.subtasks.length" class="subtasks">
                      <div v-for="sub in task.subtasks" :key="sub.id" class="subtask">
                        <span>{{ sub.name }}</span>
                        <span class="subtask-progress">{{ sub.progress }}%</span>
                      </div>
                    </div>
                  </div>
                  <div class="gantt-col owner-col">{{ task.owner }}</div>
                  <div class="gantt-col progress-col">
                    <div class="mini-progress">
                      <div class="mini-progress-fill" :style="{ width: `${task.progress}%`, background: task.color }"></div>
                    </div>
                    <span>{{ task.progress }}%</span>
                  </div>
                  <div class="gantt-col timeline-col">
                    <div 
                      class="gantt-bar" 
                      :style="{ 
                        left: `${task.startOffset}%`, 
                        width: `${task.width}%`,
                        background: task.color,
                        borderColor: task.isCritical ? '#ef4444' : 'transparent'
                      }"
                      :class="{ 'has-baseline': showBaseline && task.baselineProgress }"
                    >
                      <div v-if="showBaseline && task.baselineProgress" class="gantt-bar-baseline" :style="{ width: `${task.baselineProgress}%` }"></div>
                    </div>
                    <div v-if="task.dependencies" class="dependency-line" :style="{ left: `${task.dependencyStart}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- TODO(API): 甘特任务排期、基线对比、关键路径需接排期接口 -->
        </section>

        <section v-else-if="currentTab === 'risk'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <h2 class="section-title">风险看板</h2>
          <div class="admin-list" style="margin-top:16px;"><div class="admin-list-item" v-for="risk in risks" :key="risk.id"><div><strong>{{ risk.title }}</strong><span>{{ risk.owner }}</span></div><span class="status-tag" :class="risk.class">{{ risk.status }}</span></div></div>
          <!-- TODO(API): 风险新增、状态流转、责任人分配、AI 根因分析需接风险管理接口 -->
        </section>

        <section v-else-if="currentTab === 'reports'" class="grid-2">
          <article class="chart-card glass-panel"><h3>进度报表</h3><p class="page-subtitle" style="font-size:15px;margin-top:10px;">当前阶段完成率：72%，较上周 +5%。</p></article>
          <article class="chart-card glass-panel"><h3>质量报表</h3><p class="page-subtitle" style="font-size:15px;margin-top:10px;">关键缺陷 3 个，已关闭 2 个。</p></article>
          <!-- TODO(API): 报表筛选、趋势图、导出、订阅下发需接报表统计接口 -->
        </section>

        <section v-else class="doc-grid">
          <article class="doc-card glass-panel" v-for="doc in docs" :key="doc.id"><h3 style="font-size:20px;">{{ doc.title }}</h3><p>{{ doc.desc }}</p></article>
          <!-- TODO(API): 文档列表、版本记录、AI 摘要、新建与编辑动作需接文档中心接口 -->
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pushNotificationPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'

const route = useRoute()
const router = useRouter()
const currentTab = 'gantt'

const currentUser = computed(() => {
  const userStr = localStorage.getItem('currentUser')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return {
    name: '王志强',
    role: '项目负责人',
    avatar: 'https://i.pravatar.cc/80?img=47'
  }
})

const isProjectLeader = computed(() => {
  return currentUser.value.name === project.value.owner
})

const project = ref({
  name: '纳米晶体结构优化',
  owner: '王志强',
  desc: '聚焦晶体结构稳定性与模型预测精度提升，当前处于“联调验证”阶段。项目已建立最新计划基线，整体健康可控。',
  range: '04/14 - 05/16',
  progress: 72,
  health: '良好',
  members: 12
})

const tabLabelMap = {
  overview: '概览',
  members: '成员',
  kanban: '项目看板',
  gantt: '项目甘特图',
  risk: '风险看板',
  reports: '报表',
  docs: '文档'
}

// TODO(API): 项目详情、成员、任务、风险、文档等应由后端聚合接口返回；当前为前端静态占位数据。
const milestones = ref([
  { id: 1, title: '需求评审', desc: '已完成。需求评审结论与实验约束已沉淀到项目文档。', color: 'var(--color-secondary-600)' },
  { id: 2, title: '开发实现', desc: '已完成 90%，剩余性能对齐与异常样本校验。', color: 'var(--color-secondary-600)' },
  { id: 3, title: '联调验证', desc: '相对基线延后 2 天。', color: 'var(--color-warning-600)' }
])

const memberRows = ref([
  { id: 1, name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47', role: '项目负责人', load: '86%', dept: '平台组', focus: '联调推进', status: '在岗' },
  { id: 2, name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22', role: '平台工程师', load: '74%', dept: '平台组', focus: '回灌链路', status: '在岗' },
  { id: 3, name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33', role: 'QA', load: '58%', dept: 'QA组', focus: '回归校验', status: '在岗' }
])

const kanbanColumns = ref([
  { id: 'todo', name: '待开始', tasks: [{ id: 1, title: '联调环境参数回灌', owner: '王雅婷', deadline: '05-08' }] },
  { id: 'doing', name: '进行中', tasks: [{ id: 2, title: '回归样本误差校验', owner: '陈思远', deadline: '05-09' }] },
  { id: 'review', name: '待评审', tasks: [{ id: 3, title: '开发任务复盘', owner: '王志强', deadline: '05-10' }] },
  { id: 'done', name: '已完成', tasks: [{ id: 4, title: '需求评审文档沉淀', owner: '王志强', deadline: '04-18' }] }
])

const ganttItems = ref([
  { id: 1, name: '需求评审', progress: 100 },
  { id: 2, name: '开发实现', progress: 90 },
  { id: 3, name: '联调验证', progress: 66 }
])

// 甘特图状态
const viewMode = ref('week')
const showBaseline = ref(true)
const showDependencies = ref(false)
const showImportModal = ref(false)
const criticalPathCount = ref(3)
const baselineVersion = ref(2)
const overdueCount = ref(1)

// 时间轴周期
const timelinePeriods = computed(() => {
  const periods = []
  const startDate = new Date('2026-04-14')
  const endDate = new Date('2026-06-15')
  
  if (viewMode.value === 'week') {
    let current = new Date(startDate)
    while (current <= endDate) {
      const weekNum = Math.ceil((current - new Date('2026-01-01')) / (7 * 24 * 60 * 60 * 1000))
      periods.push({ key: `W${weekNum}`, label: `W${weekNum}` })
      current.setDate(current.getDate() + 7)
    }
  } else if (viewMode.value === 'month') {
    periods.push({ key: 'Apr', label: '四月' })
    periods.push({ key: 'May', label: '五月' })
    periods.push({ key: 'Jun', label: '六月' })
  } else {
    let current = new Date(startDate)
    while (current <= endDate) {
      const day = current.getDate()
      periods.push({ key: `D${day}`, label: `${day}` })
      current.setDate(current.getDate() + 1)
    }
  }
  return periods
})

// 甘特图任务数据
const ganttTasks = ref([
  { 
    id: 1, 
    name: '需求评审', 
    owner: '王志强', 
    progress: 100, 
    startOffset: 5, 
    width: 25, 
    color: 'var(--color-secondary-500)',
    isMilestone: true,
    isCritical: false,
    baselineProgress: 100,
    startDate: '2026-04-14',
    endDate: '2026-04-25',
    duration: 10,
    dependencies: null
  },
  { 
    id: 2, 
    name: '开发实现', 
    owner: '韩诚', 
    progress: 75, 
    startOffset: 30, 
    width: 30, 
    color: 'var(--color-purple-500)',
    isMilestone: false,
    isCritical: true,
    baselineProgress: 85,
    startDate: '2026-04-28',
    endDate: '2026-05-17',
    duration: 14,
    dependencies: [1],
    dependencyStart: 25,
    subtasks: [
      { id: 21, name: '模块A开发', progress: 100 },
      { id: 22, name: '模块B开发', progress: 70 },
      { id: 23, name: '接口联调', progress: 60 }
    ]
  },
  { 
    id: 3, 
    name: '联调验证', 
    owner: '陈思远', 
    progress: 45, 
    startOffset: 35, 
    width: 30, 
    color: 'var(--color-danger-400)',
    isMilestone: false,
    isCritical: true,
    baselineProgress: 60,
    startDate: '2026-05-02',
    endDate: '2026-05-21',
    duration: 14,
    dependencies: [2],
    dependencyStart: 30
  },
  { 
    id: 4, 
    name: '上线验收', 
    owner: '周雅楠', 
    progress: 15, 
    startOffset: 75, 
    width: 20, 
    color: 'var(--color-green-500)',
    isMilestone: true,
    isCritical: true,
    baselineProgress: 20,
    startDate: '2026-05-22',
    endDate: '2026-06-05',
    duration: 10,
    dependencies: [3],
    dependencyStart: 65
  }
])

// 甘特图方法
const openTaskModal = (mode, task = null) => {
  console.log('Open task modal:', mode, task)
}

const setBaseline = () => {
  baselineVersion.value++
}

const toggleBaseline = () => {
  showBaseline.value = !showBaseline.value
}

const toggleDependencies = () => {
  showDependencies.value = !showDependencies.value
}

const zoomIn = () => {
  console.log('Zoom in')
}

const zoomOut = () => {
  console.log('Zoom out')
}

const risks = ref([
  { id: 1, title: '联调窗口冲突', owner: '王志强', status: '处理中', class: 'warning' },
  { id: 2, title: '测试环境冻结延迟', owner: '王雅婷', status: '待处理', class: 'danger' },
  { id: 3, title: '回灌链路波动', owner: '陈思远', status: '已缓解', class: 'success' }
])

const docs = ref([
  { id: 1, title: '需求评审纪要', desc: '记录需求边界、时间计划和依赖说明，供 PM、研发与 QA 对齐使用。' },
  { id: 2, title: '联调验证说明', desc: '包含当前联调阶段的前置条件、关键风险和任务引用。' },
  { id: 3, title: '回归样本池说明', desc: '当前文档为样式占位，可继续补充样本来源与版本关系。' }
])

const projectId = computed(() => route.params.id || 1)
const tabRoute = (tab) => {
  const id = projectId.value
  if (tab === 'overview') return `/project/${id}`
  return `/project/${id}/${tab}`
}
const handleOpenNotifications = () => pushNotificationPath(router, route.fullPath)
const goBack = () => router.push('/projects')

// TODO(API): 甘特图任务排期、基线对比、依赖关系与关键路径计算需接排期接口。
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600&display=swap');
@import '../styles/shared.css';

.status-tag.warning { color: #a36b00; background: rgba(252,230,176,0.8); }
.status-tag.danger { color: var(--color-danger-600); background: rgba(255,218,214,0.8); }
.status-tag.success { color: var(--color-secondary-600); background: rgba(156,239,219,0.8); }

/* 甘特图样式 */
.gantt-actions {
  display: flex;
  gap: 12px;
}

.gantt-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(0,0,0,0.03);
  border-radius: 16px;
  margin-bottom: 16px;
}

.view-toggle {
  display: flex;
  background: rgba(0,0,0,0.04);
  border-radius: 12px;
  padding: 4px;
}

.view-toggle button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle button.active {
  background: white;
  color: var(--color-text-primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.gantt-controls {
  display: flex;
  gap: 8px;
}

.gantt-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0,0,0,0.03);
  border-radius: 12px;
  font-size: 13px;
}

.summary-item.warning {
  background: rgba(251,191,36,0.1);
  color: var(--color-warning-600);
}

.summary-item strong {
  margin-right: 8px;
}

.gantt-container {
  overflow-x: auto;
}

.gantt-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 800px;
}

.gantt-header {
  display: flex;
  background: rgba(0,0,0,0.03);
  border-radius: 12px 12px 0 0;
}

.gantt-body {
  background: white;
  border-radius: 0 0 12px 12px;
}

.gantt-row {
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  transition: background 0.2s;
}

.gantt-row:hover {
  background: rgba(0,0,0,0.02);
}

.gantt-row.critical {
  background: rgba(239,68,68,0.03);
}

.gantt-row.milestone {
  font-weight: 600;
}

.gantt-col {
  padding: 12px;
}

.gantt-col.task-col {
  width: 200px;
  flex-shrink: 0;
}

.gantt-col.owner-col {
  width: 100px;
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.gantt-col.progress-col {
  width: 120px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.gantt-col.timeline-col {
  flex: 1;
  position: relative;
  min-width: 400px;
}

.timeline-header {
  display: inline-flex;
  justify-content: center;
  width: 12.5%;
  font-size: 12px;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.mini-progress {
  flex: 1;
  height: 6px;
  background: rgba(0,0,0,0.06);
  border-radius: 3px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.gantt-bar {
  position: absolute;
  top: 8px;
  height: 24px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.gantt-bar:hover {
  transform: scaleY(1.2);
}

.gantt-bar-baseline {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.dependency-line {
  position: absolute;
  top: 20px;
  width: 2px;
  height: 8px;
  background: var(--color-border);
}

.subtasks {
  margin-left: 24px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(0,0,0,0.06);
}

.subtask {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.subtask-progress {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.milestone-icon {
  font-size: 14px;
}

.critical-icon {
  font-size: 12px;
}
</style>
