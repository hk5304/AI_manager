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
      <button class="sidebar-primary-cta" @click="exportGlobalReport"><span class="material-symbols-outlined">download</span>导出全局报表</button>
      <nav class="sidebar-nav">
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/projects')"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/workbench')"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></a>
        <a class="nav-item notification-nav" href="#" @click.prevent="handleOpenNotifications"><span class="material-symbols-outlined">notifications</span><span>消息通知</span></a>
        <a class="nav-item active" href="#" @click.prevent="handleNavigate('/reports')"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/settings')"><span class="material-symbols-outlined">settings</span><span>系统设置</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/admin')"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></a>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <div>
          <h2 class="topbar-title">全局报表</h2>
          <div class="topbar-breadcrumb">
            <span>报表</span>
            <span>/</span>
            <span>全局汇总</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <div class="date-filter">
          <button class="btn-chip" :class="{ active: dateRange === 'week' }" @click="dateRange = 'week'">本周</button>
          <button class="btn-chip" :class="{ active: dateRange === 'month' }" @click="dateRange = 'month'">本月</button>
          <button class="btn-chip" :class="{ active: dateRange === 'quarter' }" @click="dateRange = 'quarter'">本季度</button>
        </div>
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索项目、成员、图表..." />
        </label>
        <a class="icon-btn notification-link" href="#" @click.prevent="handleOpenNotifications" aria-label="打开通知中心"><span class="material-symbols-outlined">notifications</span></a>
        <button class="icon-btn"><span class="material-symbols-outlined">apps</span></button>
        <button class="icon-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack">
        <div class="page-header">
          <div>
            <h1 class="page-title">全局报表</h1>
            <p class="page-subtitle">相比项目级报表，这里更偏跨项目对比、管理趋势和多项目 AI 洞察。</p>
          </div>
          <div class="page-actions">
            <button class="btn-secondary" @click="showProjectFilter = true">跨项目筛选</button>
            <button class="btn-primary" @click="showSubscriptionModal = true">定时订阅</button>
          </div>
        </div>

        <!-- AI 洞察卡片 -->
        <section class="summary-card glass-panel">
          <div class="summary-content">
            <span class="pill pill-ai"><span class="material-symbols-outlined">auto_awesome</span>管理视角 AI 洞察</span>
            <h2 class="section-title" style="font-size:32px; margin-top:18px;">{{ aiInsight.title }}</h2>
            <p class="page-subtitle" style="margin-top:14px;">{{ aiInsight.recommendation }}</p>
            <div class="ai-actions" style="margin-top:20px;">
              <button class="btn-primary" @click="generateWeeklyReport">生成{{ reportTypeLabel }}</button>
              <button class="btn-secondary" @click="exportCSV">导出 CSV</button>
            </div>
          </div>
        </section>

        <!-- 关键指标概览 -->
        <section class="kpi-grid">
          <div class="kpi-card glass-panel">
            <div class="kpi-icon" style="background: rgba(56, 197, 155, 0.15); color: var(--color-secondary-600);">
              <span class="material-symbols-outlined">check_circle</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">项目健康率</span>
              <strong class="kpi-value">{{ kpiMetrics.healthRate }}%</strong>
              <span class="kpi-trend positive">↑ {{ kpiMetrics.healthTrend }}%</span>
            </div>
          </div>
          <div class="kpi-card glass-panel">
            <div class="kpi-icon" style="background: rgba(79, 143, 246, 0.15); color: var(--color-primary-600);">
              <span class="material-symbols-outlined">clock</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">按时交付率</span>
              <strong class="kpi-value">{{ kpiMetrics.onTimeRate }}%</strong>
              <span class="kpi-trend positive">↑ {{ kpiMetrics.onTimeTrend }}%</span>
            </div>
          </div>
          <div class="kpi-card glass-panel">
            <div class="kpi-icon" style="background: rgba(247, 196, 85, 0.15); color: var(--color-warning-600);">
              <span class="material-symbols-outlined">users</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">资源利用率</span>
              <strong class="kpi-value">{{ kpiMetrics.resourceUtilization }}%</strong>
              <span class="kpi-trend warning">↓ {{ kpiMetrics.resourceTrend }}%</span>
            </div>
          </div>
          <div class="kpi-card glass-panel">
            <div class="kpi-icon" style="background: rgba(243, 107, 99, 0.15); color: var(--color-danger-600);">
              <span class="material-symbols-outlined">bug_report</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">缺陷密度</span>
              <strong class="kpi-value">{{ kpiMetrics.defectDensity }}</strong>
              <span class="kpi-trend positive">↓ {{ kpiMetrics.defectTrend }}%</span>
            </div>
          </div>
        </section>

        <!-- 项目健康度分布 & 成员负载分布 -->
        <section class="grid-2">
          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">项目健康度分布</h2>
              <span class="section-caption">按项目统计</span>
            </div>
            <div class="bar-chart">
              <div v-for="project in projectHealthData" :key="project.name" class="bar-item">
                <div class="bar-track"><div class="bar-fill" :style="{ height: project.health + '%', background: project.gradient }"></div></div>
                <span>{{ project.name }}</span>
              </div>
            </div>
            <div class="legend" style="margin-top:16px;">
              <span class="legend-dot" style="background:var(--color-secondary-600);">健康</span>
              <span class="legend-dot" style="background:var(--color-warning-600);">一般</span>
              <span class="legend-dot" style="background:var(--color-danger-600);">风险</span>
              <span class="legend-dot" style="background:var(--color-tertiary-600);">关注</span>
            </div>
          </div>

          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">成员负载分布</h2>
              <span class="section-caption">跨项目资源</span>
            </div>
            <div class="mini-bars">
              <div v-for="member in teamLoadData" :key="member.name" class="mini-bar-row">
                <span>{{ member.name }}</span>
                <div class="progress-track"><div class="progress-fill" :style="{ width: member.load + '%', background: member.gradient }"></div></div>
                <strong :class="member.statusClass">{{ member.load }}%</strong>
              </div>
            </div>
          </div>
        </section>

        <!-- 跨项目进度对比 & 资源利用率趋势 -->
        <section class="grid-2">
          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">跨项目进度对比</h2>
              <span class="section-caption">计划 vs 实际</span>
            </div>
            <div class="bar-chart double">
              <div v-for="project in crossProjectProgress" :key="project.name" class="bar-item">
                <div class="bar-track">
                  <div class="bar-fill" :style="{ height: project.plan + '%', background: 'var(--color-text-tertiary)', opacity: 0.4 }"></div>
                  <div class="bar-fill" :style="{ height: project.actual + '%', background: project.gradient, marginTop: (100 - project.actual) + '%' }"></div>
                </div>
                <span>{{ project.name }}</span>
              </div>
            </div>
            <div class="legend" style="margin-top:16px;">
              <span class="legend-dot" style="background:var(--color-text-tertiary); opacity:0.4;">计划</span>
              <span class="legend-dot" style="background:var(--color-primary-600);">实际</span>
            </div>
          </div>

          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">资源利用率趋势</h2>
              <span class="section-caption">近 8 周变化</span>
            </div>
            <div class="line-chart">
              <div class="chart-grid">
                <div v-for="(point, i) in resourceTrendData" :key="i" class="chart-point">
                  <div class="point-line" :style="{ height: point.value + '%' }">
                    <div class="point-dot"></div>
                  </div>
                  <span class="point-label">{{ point.week }}</span>
                </div>
              </div>
              <svg class="trend-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline :points="trendLinePoints" fill="none" stroke="var(--color-primary-600)" stroke-width="2" />
              </svg>
            </div>
          </div>
        </section>

        <!-- 风险汇总 & 里程碑达成率 -->
        <section class="grid-2">
          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">风险等级分布</h2>
              <span class="section-caption">跨项目风险汇总</span>
            </div>
            <div class="risk-pie">
              <div class="pie-chart">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-danger-600)" stroke-width="20" :stroke-dasharray="riskPieData.critical.dash" stroke-dashoffset="0" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-warning-600)" stroke-width="20" :stroke-dasharray="riskPieData.high.dash" :stroke-dashoffset="riskPieData.high.offset" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-primary-600)" stroke-width="20" :stroke-dasharray="riskPieData.medium.dash" :stroke-dashoffset="riskPieData.medium.offset" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-secondary-600)" stroke-width="20" :stroke-dasharray="riskPieData.low.dash" :stroke-dashoffset="riskPieData.low.offset" transform="rotate(-90 50 50)" />
                </svg>
                <div class="pie-center">
                  <span class="pie-value">{{ totalRisks }}</span>
                  <span class="pie-label">风险总数</span>
                </div>
              </div>
              <div class="pie-legend">
                <div class="legend-item"><span class="legend-color" style="background: var(--color-danger-600);"></span><span>严重: {{ riskPieData.critical.count }}</span></div>
                <div class="legend-item"><span class="legend-color" style="background: var(--color-warning-600);"></span><span>高: {{ riskPieData.high.count }}</span></div>
                <div class="legend-item"><span class="legend-color" style="background: var(--color-primary-600);"></span><span>中: {{ riskPieData.medium.count }}</span></div>
                <div class="legend-item"><span class="legend-color" style="background: var(--color-secondary-600);"></span><span>低: {{ riskPieData.low.count }}</span></div>
              </div>
            </div>
          </div>

          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">里程碑达成率</h2>
              <span class="section-caption">关键节点完成情况</span>
            </div>
            <div class="mini-bars">
              <div v-for="milestone in milestoneData" :key="milestone.name" class="mini-bar-row">
                <span>{{ milestone.name }}</span>
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: milestone.completion + '%', background: milestone.gradient }"></div>
                </div>
                <strong :class="milestone.statusClass">{{ milestone.status }}</strong>
              </div>
            </div>
          </div>
        </section>

        <!-- 成本趋势 & 团队效率对比 -->
        <section class="grid-2">
          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">项目成本趋势</h2>
              <span class="section-caption">预算 vs 实际支出</span>
            </div>
            <div class="mini-bars">
              <div v-for="item in costTrendData" :key="item.month" class="mini-bar-row">
                <span>{{ item.month }}</span>
                <div class="progress-track double">
                  <div class="progress-fill secondary" :style="{ width: item.budget + '%', background: 'var(--color-text-tertiary)', opacity: 0.4 }"></div>
                  <div class="progress-fill" :style="{ width: item.actual + '%', background: item.gradient }"></div>
                </div>
                <span class="cost-label">{{ item.actual }}%</span>
              </div>
            </div>
            <div class="legend" style="margin-top:16px;">
              <span class="legend-dot" style="background:var(--color-text-tertiary); opacity:0.4;">预算</span>
              <span class="legend-dot" style="background:var(--color-primary-600);">实际</span>
            </div>
          </div>

          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">团队效率对比</h2>
              <span class="section-caption">按团队统计</span>
            </div>
            <div class="efficiency-grid">
              <div v-for="team in efficiencyData" :key="team.name" class="efficiency-card">
                <div class="efficiency-header">
                  <span class="team-name">{{ team.name }}</span>
                  <span class="efficiency-score" :style="{ color: team.scoreColor }">{{ team.score }}</span>
                </div>
                <div class="efficiency-bars">
                  <div class="efficiency-bar">
                    <span class="bar-label">交付效率</span>
                    <div class="bar-track small"><div class="bar-fill" :style="{ width: team.metrics.delivery + '%', background: team.color }"></div></div>
                  </div>
                  <div class="efficiency-bar">
                    <span class="bar-label">代码质量</span>
                    <div class="bar-track small"><div class="bar-fill" :style="{ width: team.metrics.quality + '%', background: team.color }"></div></div>
                  </div>
                  <div class="efficiency-bar">
                    <span class="bar-label">协作效率</span>
                    <div class="bar-track small"><div class="bar-fill" :style="{ width: team.metrics.collaboration + '%', background: team.color }"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 项目优先级分布 & 问题解决时效 -->
        <section class="grid-2">
          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">项目优先级分布</h2>
              <span class="section-caption">按优先级统计</span>
            </div>
            <div class="priority-bars">
              <div v-for="priority in priorityData" :key="priority.level" class="priority-bar">
                <div class="priority-header">
                  <span class="priority-label">{{ priority.level }}</span>
                  <span class="priority-count">{{ priority.count }} 个项目</span>
                </div>
                <div class="priority-fill" :style="{ height: priority.percentage + '%', background: priority.color }"></div>
              </div>
            </div>
          </div>

          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">问题解决时效</h2>
              <span class="section-caption">平均处理时间</span>
            </div>
            <div class="mini-bars">
              <div v-for="item in issueResolutionData" :key="item.type" class="mini-bar-row">
                <span>{{ item.type }}</span>
                <div class="progress-track"><div class="progress-fill" :style="{ width: item.efficiency + '%', background: item.gradient }"></div></div>
                <strong>{{ item.avgTime }}</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 跨项目筛选弹窗 -->
    <div class="modal-shell" v-show="showProjectFilter">
      <div class="modal-backdrop" @click="showProjectFilter = false"></div>
      <section class="modal-panel glass-panel-strong">
        <div class="modal-header">
          <h2 class="section-title">跨项目筛选</h2>
          <button class="icon-btn" @click="showProjectFilter = false"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="filter-content">
          <div class="filter-group">
            <label>选择项目</label>
            <div class="filter-chips">
              <button v-for="project in availableProjects" :key="project.id" 
                class="filter-chip" :class="{ active: selectedProjects.includes(project.id) }"
                @click="toggleProject(project.id)">
                {{ project.name }}
              </button>
            </div>
          </div>
          <div class="filter-group">
            <label>项目状态</label>
            <div class="filter-chips">
              <button v-for="status in projectStatuses" :key="status.value" 
                class="filter-chip" :class="{ active: selectedStatuses.includes(status.value) }"
                @click="toggleStatus(status.value)">
                {{ status.label }}
              </button>
            </div>
          </div>
          <div class="filter-actions">
            <button class="btn-secondary" @click="resetFilters">重置</button>
            <button class="btn-primary" @click="applyFilters">应用筛选</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 定时订阅弹窗 -->
    <div class="modal-shell" v-show="showSubscriptionModal">
      <div class="modal-backdrop" @click="showSubscriptionModal = false"></div>
      <section class="modal-panel glass-panel-strong">
        <div class="modal-header">
          <h2 class="section-title">定时订阅</h2>
          <button class="icon-btn" @click="showSubscriptionModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="subscription-content">
          <div class="subscription-group">
            <label>订阅频率</label>
            <div class="subscription-options">
              <button v-for="freq in subscriptionFrequencies" :key="freq.value" 
                class="subscription-option" :class="{ active: subscriptionFrequency === freq.value }"
                @click="subscriptionFrequency = freq.value">
                <span class="material-symbols-outlined">{{ freq.icon }}</span>
                <span>{{ freq.label }}</span>
              </button>
            </div>
          </div>
          <div class="subscription-group">
            <label>接收方式</label>
            <div class="subscription-options">
              <button v-for="method in deliveryMethods" :key="method.value" 
                class="subscription-option" :class="{ active: deliveryMethod === method.value }"
                @click="deliveryMethod = method.value">
                <span class="material-symbols-outlined">{{ method.icon }}</span>
                <span>{{ method.label }}</span>
              </button>
            </div>
          </div>
          <div class="subscription-actions">
            <button class="btn-secondary" @click="showSubscriptionModal = false">取消</button>
            <button class="btn-primary" @click="saveSubscription">保存设置</button>
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
          <p class="section-caption">当前上下文：全局报表</p>
        </div>
        <button class="icon-btn" @click="closeAiDrawer"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="ai-card">
        <h4>全局建议</h4>
        <p>{{ aiInsight.suggestion }}</p>
        <div class="ai-actions">
          <button class="btn-primary" @click="generateManagementReport">生成管理周报</button>
        </div>
      </div>
      <div class="ai-chat">
        <div class="chat-input">
          <input type="text" v-model="aiQuestion" placeholder="询问 AI 关于全局报表的问题..." @keyup.enter="askAI" />
          <button class="icon-btn" @click="askAI"><span class="material-symbols-outlined">send</span></button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { pushAppPath, pushNotificationPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'

const router = useRouter()
const currentUser = {
  name: '张工',
  role: '研发总监',
  avatar: 'https://i.pravatar.cc/80?img=12'
}

const isAiDrawerOpen = ref(false)
const showProjectFilter = ref(false)
const showSubscriptionModal = ref(false)
const dateRange = ref('month')
const reportTypeLabel = computed(() => {
  const labels = {
    week: '周报',
    month: '月报',
    quarter: '季报'
  }
  return labels[dateRange.value] || '报表'
})
const aiQuestion = ref('')
const subscriptionFrequency = ref('weekly')
const deliveryMethod = ref('email')
const selectedProjects = ref([])
const selectedStatuses = ref([])

const aiInsight = ref({
  title: '本周团队整体效率提升 9%，但 3 个项目共享同一 QA 资源，存在下周资源冲突风险。',
  recommendation: '建议从全局层面优先平衡 QA 资源窗口，并提前对"联调验证""自动化巡检"和"协议升级"三条线做时间切分。',
  suggestion: '建议从下周一开始冻结 QA 的跨项目时段，避免 3 个高优先级项目在同一时间抢占验证资源。'
})

const kpiMetrics = ref({
  healthRate: 78,
  healthTrend: 5,
  onTimeRate: 85,
  onTimeTrend: 3,
  resourceUtilization: 72,
  resourceTrend: 2,
  defectDensity: '1.2/KLOC',
  defectTrend: 15
})

const projectHealthData = ref([
  { name: '核心实验室', health: 85, gradient: 'linear-gradient(180deg, #38c59b, var(--color-secondary-600))' },
  { name: '材料迭代', health: 44, gradient: 'linear-gradient(180deg, #f7c455, var(--color-warning-600))' },
  { name: '协议升级', health: 18, gradient: 'linear-gradient(180deg, #f36b63, var(--color-danger-600))' },
  { name: '自动化平台', health: 66, gradient: 'linear-gradient(180deg, #a871ff, var(--color-tertiary-600))' },
  { name: '数据中台', health: 72, gradient: 'linear-gradient(180deg, var(--color-primary-400), var(--color-primary-600))' },
  { name: '智能客服', health: 58, gradient: 'linear-gradient(180deg, #f7c455, var(--color-warning-600))' }
])

const teamLoadData = ref([
  { name: 'QA 资源', load: 89, gradient: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', statusClass: 'text-danger' },
  { name: '平台组', load: 78, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', statusClass: 'text-warning' },
  { name: '材料组', load: 62, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700))', statusClass: 'text-primary' },
  { name: '算法组', load: 55, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', statusClass: 'text-secondary' },
  { name: '前端组', load: 71, gradient: 'linear-gradient(90deg, #a871ff, var(--color-tertiary-600))', statusClass: 'text-tertiary' }
])

const crossProjectProgress = ref([
  { name: '核心实验室', plan: 80, actual: 85, gradient: 'linear-gradient(180deg, #38c59b, var(--color-secondary-600))' },
  { name: '材料迭代', plan: 60, actual: 45, gradient: 'linear-gradient(180deg, #f7c455, var(--color-warning-600))' },
  { name: '协议升级', plan: 30, actual: 20, gradient: 'linear-gradient(180deg, #f36b63, var(--color-danger-600))' },
  { name: '自动化平台', plan: 70, actual: 65, gradient: 'linear-gradient(180deg, #a871ff, var(--color-tertiary-600))' },
  { name: '数据中台', plan: 55, actual: 58, gradient: 'linear-gradient(180deg, var(--color-primary-400), var(--color-primary-600))' }
])

const resourceTrendData = ref([
  { week: 'W1', value: 68 }, { week: 'W2', value: 72 }, { week: 'W3', value: 75 }, { week: 'W4', value: 78 },
  { week: 'W5', value: 74 }, { week: 'W6', value: 70 }, { week: 'W7', value: 72 }, { week: 'W8', value: 71 }
])

const trendLinePoints = computed(() => {
  return resourceTrendData.value.map((p, i) => {
    const x = (i / (resourceTrendData.value.length - 1)) * 100
    const y = 100 - p.value
    return `${x},${y}`
  }).join(' ')
})

const riskPieData = ref({
  critical: { count: 3, dash: '75.4 251', offset: 0 },
  high: { count: 8, dash: '200.9 251', offset: -75.4 },
  medium: { count: 12, dash: '301.4 251', offset: -276.3 },
  low: { count: 17, dash: '427.3 251', offset: -577.7 }
})

const totalRisks = computed(() => {
  return riskPieData.value.critical.count + riskPieData.value.high.count + 
         riskPieData.value.medium.count + riskPieData.value.low.count
})

const milestoneData = ref([
  { name: 'Q2 目标达成', completion: 78, status: '进行中', gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', statusClass: 'text-primary' },
  { name: '技术架构升级', completion: 92, status: '即将完成', gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', statusClass: 'text-secondary' },
  { name: '安全合规审计', completion: 45, status: '进行中', gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', statusClass: 'text-warning' },
  { name: '性能优化', completion: 30, status: '进行中', gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', statusClass: 'text-warning' },
  { name: '文档完善', completion: 65, status: '进行中', gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', statusClass: 'text-primary' }
])

const costTrendData = ref([
  { month: '1月', budget: 100, actual: 85, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))' },
  { month: '2月', budget: 100, actual: 92, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))' },
  { month: '3月', budget: 100, actual: 105, gradient: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))' },
  { month: '4月', budget: 100, actual: 88, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))' },
  { month: '5月', budget: 100, actual: 95, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))' }
])

const efficiencyData = ref([
  { 
    name: '研发一组', score: 92, scoreColor: 'var(--color-secondary-600)', 
    color: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))',
    metrics: { delivery: 95, quality: 88, collaboration: 92 }
  },
  { 
    name: '研发二组', score: 85, scoreColor: 'var(--color-primary-600)', 
    color: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))',
    metrics: { delivery: 82, quality: 88, collaboration: 85 }
  },
  { 
    name: '研发三组', score: 78, scoreColor: 'var(--color-warning-600)', 
    color: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))',
    metrics: { delivery: 75, quality: 82, collaboration: 78 }
  }
])

const priorityData = ref([
  { level: 'P0 紧急', count: 2, percentage: 100, color: 'var(--color-danger-600)' },
  { level: 'P1 高', count: 5, percentage: 75, color: 'var(--color-warning-600)' },
  { level: 'P2 中', count: 8, percentage: 60, color: 'var(--color-primary-600)' },
  { level: 'P3 低', count: 5, percentage: 40, color: 'var(--color-text-tertiary)' }
])

const issueResolutionData = ref([
  { type: 'Bug 修复', efficiency: 85, avgTime: '2.1h', gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))' },
  { type: '需求变更', efficiency: 62, avgTime: '1.5d', gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))' },
  { type: '技术咨询', efficiency: 91, avgTime: '45m', gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))' },
  { type: '环境问题', efficiency: 75, avgTime: '3.2h', gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))' }
])

const availableProjects = ref([
  { id: 1, name: '核心实验室' }, { id: 2, name: '材料迭代' }, { id: 3, name: '协议升级' },
  { id: 4, name: '自动化平台' }, { id: 5, name: '数据中台' }, { id: 6, name: '智能客服' }
])

const projectStatuses = ref([
  { value: 'active', label: '进行中' }, { value: 'completed', label: '已完成' },
  { value: 'paused', label: '暂停' }, { value: 'planning', label: '规划中' }
])

const subscriptionFrequencies = ref([
  { value: 'daily', label: '每日', icon: 'calendar_today' },
  { value: 'weekly', label: '每周', icon: 'calendar_week' },
  { value: 'monthly', label: '每月', icon: 'calendar_month' }
])

const deliveryMethods = ref([
  { value: 'email', label: '邮件', icon: 'mail' },
  { value: 'wechat', label: '企业微信', icon: 'message' },
  { value: 'sms', label: '短信', icon: 'sms' }
])

const handleNavigate = (path) => {
  pushAppPath(router, path)
}

const handleOpenNotifications = () => {
  pushNotificationPath(router, router.currentRoute.value.fullPath)
}

const toggleAiDrawer = () => {
  isAiDrawerOpen.value = !isAiDrawerOpen.value
}

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false
}

const exportGlobalReport = () => {
  alert('全局报表导出功能已触发')
}

const exportCSV = () => {
  alert('CSV 导出功能已触发')
}

const generateWeeklyReport = () => {
  alert('周报生成功能已触发')
}

const generateManagementReport = () => {
  alert('管理周报生成功能已触发')
}

const askAI = () => {
  if (aiQuestion.value.trim()) {
    alert(`AI 正在处理您的问题: ${aiQuestion.value}`)
    aiQuestion.value = ''
  }
}

const toggleProject = (projectId) => {
  const index = selectedProjects.value.indexOf(projectId)
  if (index > -1) {
    selectedProjects.value.splice(index, 1)
  } else {
    selectedProjects.value.push(projectId)
  }
}

const toggleStatus = (status) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  } else {
    selectedStatuses.value.push(status)
  }
}

const resetFilters = () => {
  selectedProjects.value = []
  selectedStatuses.value = []
}

const applyFilters = () => {
  alert(`已选择 ${selectedProjects.value.length} 个项目, ${selectedStatuses.value.length} 个状态`)
  showProjectFilter.value = false
}

const saveSubscription = () => {
  alert(`订阅设置已保存: ${subscriptionFrequency.value} / ${deliveryMethod.value}`)
  showSubscriptionModal.value = false
}
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-info {
  flex: 1;
}

.kpi-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: block;
}

.kpi-trend {
  font-size: 12px;
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
}

.kpi-trend.positive {
  color: var(--color-secondary-600);
}

.kpi-trend.warning {
  color: var(--color-warning-600);
}

.date-filter {
  display: flex;
  gap: 8px;
  margin-right: 16px;
}

.btn-chip.active {
  background: var(--color-primary-600);
  color: white;
}

.bar-chart.double .bar-track {
  position: relative;
}

.line-chart {
  position: relative;
  height: 180px;
  padding: 20px 0;
}

.chart-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  padding: 0 10px;
}

.chart-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex: 1;
}

.point-line {
  width: 2px;
  background: rgba(79, 143, 246, 0.1);
  position: relative;
}

.point-dot {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: var(--color-primary-600);
  border-radius: 50%;
}

.point-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-top: 8px;
}

.trend-line {
  position: absolute;
  top: 20px;
  left: 10px;
  right: 10px;
  height: calc(100% - 40px);
}

.risk-pie {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px;
}

.pie-chart {
  position: relative;
  width: 160px;
  height: 160px;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.pie-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.efficiency-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.efficiency-card {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 16px;
}

.efficiency-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.team-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.efficiency-score {
  font-size: 20px;
  font-weight: 700;
}

.efficiency-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.efficiency-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  width: 60px;
}

.bar-track.small {
  flex: 1;
  height: 6px;
}

.priority-bars {
  display: flex;
  gap: 16px;
  padding: 20px;
}

.priority-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.priority-header {
  text-align: center;
  margin-bottom: 8px;
}

.priority-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.priority-count {
  font-size: 10px;
  color: var(--color-text-tertiary);
}

.priority-fill {
  width: 32px;
  border-radius: 8px;
  transition: height 0.3s ease;
}

.progress-track.double {
  position: relative;
  height: 8px;
}

.progress-fill.secondary {
  position: absolute;
  top: 0;
  left: 0;
}

.cost-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.filter-content {
  padding: 24px;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: rgba(79, 143, 246, 0.1);
}

.filter-chip.active {
  background: var(--color-primary-600);
  color: white;
  border-color: var(--color-primary-600);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.subscription-content {
  padding: 24px;
}

.subscription-group {
  margin-bottom: 24px;
}

.subscription-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
}

.subscription-options {
  display: flex;
  gap: 12px;
}

.subscription-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.subscription-option:hover {
  background: rgba(79, 143, 246, 0.1);
}

.subscription-option.active {
  background: rgba(79, 143, 246, 0.1);
  border-color: var(--color-primary-600);
}

.subscription-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.ai-chat {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.chat-input {
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
}
</style>