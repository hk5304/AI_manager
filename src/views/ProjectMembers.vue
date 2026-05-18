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
          <div class="member-section-header">
            <h2 class="section-title">成员列表</h2>
            <button class="btn-chip" @click="handleInviteMember">
              <span class="material-symbols-outlined">person_add</span>邀请成员
            </button>
          </div>
          <div class="member-table" style="margin-top:16px;">
            <div class="member-row" v-for="member in memberRows" :key="member.id">
              <div class="member-ident">
                <img :src="member.avatar" :alt="member.name" />
                <div>
                  <strong>{{ member.name }}</strong>
                  <p class="muted">{{ member.role }}</p>
                </div>
              </div>
              <div>{{ member.load }}</div>
              <div>{{ member.dept }}</div>
              <div>{{ member.focus }}</div>
              <div>
                <span class="status-tag" :class="getStatusClass(member.status)">{{ member.status }}</span>
              </div>
              <div class="member-actions">
                <button class="icon-btn" @click="handleEditMember(member)">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="icon-btn" @click="handleRemoveMember(member)">
                  <span class="material-symbols-outlined">remove</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section v-else-if="currentTab === 'kanban'" class="kanban">
          <article class="kanban-column glass-panel" v-for="col in kanbanColumns" :key="col.id">
            <div class="kanban-column-header"><h3>{{ col.name }}</h3><span class="section-caption">{{ col.tasks.length }}</span></div>
            <div class="kanban-card" v-for="task in col.tasks" :key="task.id"><h4>{{ task.title }}</h4><p class="task-note">{{ task.owner }} · {{ task.deadline }}</p></div>
          </article>
          <!-- TODO(API): 看板列、任务卡片、拖拽状态流转需接任务看板接口 -->
        </section>

        <section v-else-if="currentTab === 'gantt'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <h2 class="section-title">项目甘特图</h2>
          <div style="margin-top:16px;display:flex;flex-direction:column;gap:12px;">
            <div v-for="item in ganttItems" :key="item.id" class="mini-bar-row"><span>{{ item.name }}</span><div class="progress-track"><div class="progress-fill" :style="{ width: `${item.progress}%` }"></div></div><strong>{{ item.progress }}%</strong></div>
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

    <!-- 邀请成员弹窗 -->
    <div class="modal-shell" :class="{ open: showInviteModal }">
      <div class="modal-backdrop" @click="closeInviteModal"></div>
      <section class="modal-panel glass-panel-strong invite-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-primary">邀请成员</span>
            <h2 class="section-title">邀请成员加入项目</h2>
          </div>
          <button class="modal-close" @click="closeInviteModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="invite-content">
          <div class="invite-search">
            <label class="search-shell">
              <span class="material-symbols-outlined">search</span>
              <input type="text" v-model="inviteSearchKeyword" placeholder="搜索成员姓名或邮箱..." />
            </label>
          </div>
          <div class="org-tree">
            <div v-for="dept in filteredOrgTree" :key="dept.id" class="dept-node">
              <div class="dept-header" @click="toggleDept(dept)">
                <span class="material-symbols-outlined">{{ dept.expanded ? 'expand_more' : 'chevron_right' }}</span>
                <span>{{ dept.name }}</span>
                <span class="dept-count">{{ dept.members.length }}</span>
              </div>
              <div v-if="dept.expanded" class="dept-members">
                <div v-for="member in dept.members" :key="member.id" class="member-checkbox">
                  <input type="checkbox" :id="'member-' + member.id" v-model="selectedMembers" :value="member.id" />
                  <label :for="'member-' + member.id">
                    <div class="avatar-sm" :style="{ backgroundColor: getRandomColor() }">{{ member.name.charAt(0) }}</div>
                    <div class="member-info">
                      <span class="member-name">{{ member.name }}</span>
                      <span class="member-email">{{ member.email }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="invite-summary" v-if="selectedMembers.length > 0">
            <span class="material-symbols-outlined">people</span>
            已选择 {{ selectedMembers.length }} 位成员
          </div>
          
          <div class="invite-actions">
            <button class="btn-secondary" @click="closeInviteModal">取消</button>
            <button class="btn-primary" @click="handleSendInvitation" :disabled="selectedMembers.length === 0">
              <span class="material-symbols-outlined">send</span>发送邀请
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- 编辑成员弹窗 -->
    <div class="modal-shell" :class="{ open: showEditMemberModal }">
      <div class="modal-backdrop" @click="closeEditMemberModal"></div>
      <section class="modal-panel glass-panel-strong edit-member-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-warning">编辑成员</span>
            <h2 class="section-title">编辑项目成员</h2>
          </div>
          <button class="modal-close" @click="closeEditMemberModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="edit-member-content" v-if="editingMember">
          <div class="member-preview">
            <div class="avatar-lg" :style="{ backgroundColor: getAvatarColor(editingMember.id) }">
              {{ editingMember.name.charAt(0) }}
            </div>
            <div class="member-preview-info">
              <h3>{{ editingMember.name }}</h3>
              <p>{{ editingMember.dept }}</p>
            </div>
          </div>
          
          <form class="member-form">
            <div class="form-section">
              <label class="field-label">项目角色</label>
              <select v-model="memberForm.projectRole" class="field-select">
                <option value="pm">项目经理</option>
                <option value="developer">开发</option>
                <option value="qa">测试</option>
              </select>
            </div>
            
            <div class="form-section">
              <label class="field-label">工作负载</label>
              <div class="load-slider-container">
                <input type="range" v-model="memberForm.load" min="0" max="100" class="load-slider" />
                <span class="load-value">{{ memberForm.load }}%</span>
              </div>
            </div>
            
            <div class="form-section">
              <label class="field-label">专注领域</label>
              <input type="text" v-model="memberForm.focus" class="field-input" placeholder="如：后端开发、性能优化、接口联调等" />
            </div>
            
            <div class="form-section">
              <label class="field-label">状态</label>
              <select v-model="memberForm.status" class="field-select">
                <option value="在岗">在岗</option>
                <option value="请假">请假</option>
                <option value="兼职">兼职</option>
              </select>
            </div>
          </form>
          
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeEditMemberModal">取消</button>
            <button class="btn-danger" @click="handleRemoveMember(editingMember)">
              <span class="material-symbols-outlined">person_remove</span>移出项目
            </button>
            <button class="btn-primary" @click="handleSaveMember">
              <span class="material-symbols-outlined">save</span>保存修改
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pushNotificationPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'
import { notificationStore } from '../store/taskStore'

const route = useRoute()
const router = useRouter()
const currentTab = 'members'

const currentUser = {
  name: '王志强',
  role: '项目负责人',
  avatar: 'https://i.pravatar.cc/80?img=47'
}

const project = ref({
  name: '纳米晶体结构优化',
  owner: '王志强',
  desc: '聚焦晶体结构稳定性与模型预测精度提升，当前处于"联调验证"阶段。项目已建立最新计划基线，整体健康可控。',
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

const orgTree = ref([
  {
    id: 1,
    name: '平台组',
    expanded: true,
    members: [
      { id: 10, name: '张伟', email: 'zhangwei@company.com' },
      { id: 11, name: '李娜', email: 'lina@company.com' },
      { id: 12, name: '王强', email: 'wangqiang@company.com' }
    ]
  },
  {
    id: 2,
    name: 'QA组',
    expanded: true,
    members: [
      { id: 20, name: '赵丽', email: 'zhaoli@company.com' },
      { id: 21, name: '孙明', email: 'sunming@company.com' }
    ]
  },
  {
    id: 3,
    name: '产品组',
    expanded: true,
    members: [
      { id: 30, name: '周杰', email: 'zhoujie@company.com' }
    ]
  }
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

const showInviteModal = ref(false)
const showEditMemberModal = ref(false)
const inviteSearchKeyword = ref('')
const selectedMembers = ref([])
const editingMember = ref(null)
const memberForm = ref({
  projectRole: 'developer',
  load: 50,
  focus: '',
  status: '在岗'
})

const filteredOrgTree = computed(() => {
  const keyword = inviteSearchKeyword.value.toLowerCase()
  return orgTree.value.map(dept => ({
    ...dept,
    members: dept.members.filter(member =>
      member.name.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword)
    )
  })).filter(dept => dept.members.length > 0)
})

const handleInviteMember = () => {
  selectedMembers.value = []
  inviteSearchKeyword.value = ''
  showInviteModal.value = true
}

const closeInviteModal = () => {
  showInviteModal.value = false
}

const handleSendInvitation = () => {
  if (selectedMembers.value.length === 0) return
  
  const invitedUsers = []
  selectedMembers.value.forEach(memberId => {
    orgTree.value.forEach(dept => {
      const member = dept.members.find(m => m.id === memberId)
      if (member) {
        invitedUsers.push(member)
        
        notificationStore.addNotification({
          id: Date.now() + Math.random(),
          type: 'invitation',
          title: '项目邀请',
          content: `您被邀请加入项目"${project.value.name}"`,
          targetUserId: member.id,
          read: false,
          createdAt: new Date().toLocaleString('zh-CN')
        })
      }
    })
  })
  
  invitedUsers.forEach(user => {
    const existingIndex = memberRows.value.findIndex(m => m.id === user.id)
    if (existingIndex === -1) {
      memberRows.value.push({
        id: user.id,
        name: user.name,
        avatar: `https://i.pravatar.cc/80?img=${user.id % 70}`,
        role: '成员',
        load: '20%',
        dept: orgTree.value.find(d => d.members.some(m => m.id === user.id))?.name || '未分配',
        focus: '待定',
        status: '在岗'
      })
    }
  })
  
  closeInviteModal()
}

const handleEditMember = (member) => {
  editingMember.value = { ...member }
  memberForm.value.projectRole = getProjectRoleValue(member.role)
  memberForm.value.load = parseInt(member.load) || 50
  memberForm.value.focus = member.focus || ''
  memberForm.value.status = member.status || '在岗'
  showEditMemberModal.value = true
}

const closeEditMemberModal = () => {
  showEditMemberModal.value = false
  editingMember.value = null
}

const handleSaveMember = () => {
  if (!editingMember.value) return
  
  const memberIndex = memberRows.value.findIndex(m => m.id === editingMember.value.id)
  if (memberIndex !== -1) {
    const roleLabel = getRoleLabel(memberForm.value.projectRole)
    memberRows.value[memberIndex] = {
      ...memberRows.value[memberIndex],
      role: roleLabel,
      load: `${memberForm.value.load}%`,
      focus: memberForm.value.focus,
      status: memberForm.value.status
    }
  }
  
  closeEditMemberModal()
}

const handleRemoveMember = (member) => {
  const memberIndex = memberRows.value.findIndex(m => m.id === member.id)
  if (memberIndex !== -1) {
    memberRows.value.splice(memberIndex, 1)
    
    notificationStore.addNotification({
      id: Date.now(),
      type: 'member_remove',
      title: '移出项目',
      content: `您已被从项目"${project.value.name}"中移出`,
      targetUserId: member.id,
      read: false,
      createdAt: new Date().toLocaleString('zh-CN')
    })
  }
  
  closeEditMemberModal()
}

const toggleDept = (dept) => {
  dept.expanded = !dept.expanded
}

const getStatusClass = (status) => {
  const statusMap = {
    '在岗': 'success',
    '请假': 'warning',
    '兼职': 'default'
  }
  return statusMap[status] || 'default'
}

const getProjectRoleValue = (roleLabel) => {
  const roleMap = {
    '项目经理': 'pm',
    '开发': 'developer',
    '测试': 'qa',
    '产品': 'product',
    '成员': 'developer'
  }
  return roleMap[roleLabel] || 'developer'
}

const getRoleLabel = (roleValue) => {
  const labelMap = {
    'pm': '项目经理',
    'developer': '开发',
    'qa': '测试',
    'product': '产品'
  }
  return labelMap[roleValue] || '成员'
}

const getRandomColor = () => {
  const colors = ['#FFB5A7', '#FCD5CE', '#FEC89A', '#FFDAB9', '#C1D3FE', '#BDE0FE', '#A2D2FF', '#9BF6FF', '#CAFFBF', '#FDFFB6']
  return colors[Math.floor(Math.random() * colors.length)]
}

const getAvatarColor = (id) => {
  const colors = ['#667eea', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#330867', '#a8edea']
  return colors[id % colors.length]
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600&display=swap');
@import '../styles/shared.css';

.status-tag.warning { color: #a36b00; background: rgba(252,230,176,0.8); }
.status-tag.danger { color: var(--color-danger-600); background: rgba(255,218,214,0.8); }
.status-tag.success { color: var(--color-secondary-600); background: rgba(156,239,219,0.8); }
.status-tag.default { color: var(--color-gray-600); background: var(--color-gray-100); }

.member-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.member-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255,255,255,0.6);
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.04);
}

.member-ident {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.member-ident img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.member-ident strong {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-900);
}

.member-ident .muted {
  margin: 0;
  font-size: 13px;
  color: var(--color-gray-500);
}

.member-row > div:nth-child(2),
.member-row > div:nth-child(3),
.member-row > div:nth-child(4) {
  min-width: 100px;
  font-size: 14px;
  color: var(--color-gray-700);
}

.member-row > div:nth-child(5) {
  min-width: 80px;
}

.member-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.modal-shell {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.modal-shell.open {
  pointer-events: auto;
  opacity: 1;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
}

.modal-panel {
  position: relative;
  width: 90%;
  max-width: 520px;
  max-height: 85vh;
  border-radius: 24px;
  overflow: hidden;
  transform: scale(0.95) translateY(10px);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}

.modal-shell.open .modal-panel {
  transform: scale(1) translateY(0);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 8px;
}

.modal-header h2 {
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 700;
}

.modal-close {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(0,0,0,0.05);
  color: var(--color-gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.modal-close:hover {
  background: rgba(0,0,0,0.1);
  color: var(--color-gray-900);
}

.invite-content {
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 60vh;
  overflow: hidden;
}

.invite-search {
  position: sticky;
  top: 0;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.8));
  padding: 4px 0;
}

.invite-search .search-shell {
  width: 100%;
}

.org-tree {
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
}

.dept-node {
  margin-bottom: 8px;
}

.dept-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease;
  font-weight: 600;
  color: var(--color-gray-700);
}

.dept-header:hover {
  background: rgba(0,0,0,0.04);
}

.dept-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--color-gray-400);
  font-weight: 500;
}

.dept-members {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0 4px 16px;
}

.member-checkbox {
  padding: 10px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.member-checkbox:hover {
  background: rgba(102,126,234,0.08);
}

.member-checkbox input {
  width: 20px;
  height: 20px;
  accent-color: #667eea;
  cursor: pointer;
}

.member-checkbox label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.avatar-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 16px;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-gray-900);
}

.member-email {
  font-size: 13px;
  color: var(--color-gray-500);
}

.invite-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
  border-radius: 12px;
  font-weight: 600;
  color: #5a67d8;
}

.invite-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.invite-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-member-content {
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.member-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(102,126,234,0.08);
  border-radius: 16px;
}

.avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 24px;
}

.member-preview-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-gray-900);
}

.member-preview-info p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--color-gray-500);
}

.member-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-section .field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gray-600);
}

.field-select, .field-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  outline: none;
  transition: all 0.2s ease;
}

.field-select:focus, .field-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.15);
}

.load-slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.load-slider {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  accent-color: #667eea;
}

.load-value {
  min-width: 50px;
  text-align: right;
  font-weight: 700;
  color: #667eea;
  font-size: 16px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 8px;
}
</style>
