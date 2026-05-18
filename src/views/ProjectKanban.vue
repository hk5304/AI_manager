﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-box">
        <div class="brand-icon"><span class="material-symbols-outlined">science</span></div>
        <div><h1 class="brand-title">R&D 系统</h1><p class="brand-subtitle">AI 驱动型协作平台</p></div>
      </div>
      <button class="sidebar-primary-cta" type="button" @click="handleCreateTask">
        <span class="material-symbols-outlined">add_task</span>新建任务
      </button>
      <nav class="sidebar-nav">
        <router-link class="nav-item" to="/dashboard"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></router-link>
        <router-link class="nav-item active" to="/projects"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></router-link>
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
          <h2 class="topbar-title">项目详情</h2>
          <div class="topbar-breadcrumb">
            <span>项目</span><span>/</span><span>{{ project.name }}</span><span>/</span><span>{{ tabLabelMap[currentTab] }}</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索任务、里程碑或成员..." v-model="searchKeyword" />
        </label>
        <button class="icon-btn notification-link" type="button" @click="handleOpenNotifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-badge">{{ unreadCount }}</span>
        </button>
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
            <button class="btn-secondary" @click="showArchiveModal = true">
              <span class="material-symbols-outlined">archive</span>归档项目
            </button>
            <button class="btn-primary" @click="showBaselineModal = true">
              <span class="material-symbols-outlined">track_changes</span>设置基线
            </button>
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

        <!-- 看板视图 -->
        <section v-if="currentTab === 'kanban'" class="kanban-container">
          <div class="kanban-header">
            <h2 class="section-title">任务看板</h2>
            <div class="kanban-actions">
              <button class="btn-chip" @click="handleCreateTask">
                <span class="material-symbols-outlined">add</span>新建任务
              </button>
              <span class="section-caption">共 {{ allTasks.length }} 个任务</span>
            </div>
          </div>
          
          <div class="kanban">
            <article class="kanban-column glass-panel" v-for="col in kanbanColumns" :key="col.id">
              <div class="kanban-column-header">
                <h3>{{ col.name }}</h3>
                <span class="section-caption">{{ getColumnTasks(col.id).length }}</span>
              </div>
              <div class="kanban-tasks">
                <div 
                  class="kanban-card" 
                  v-for="task in getColumnTasks(col.id)" 
                  :key="task.id"
                  @click="handleTaskClick(task)"
                  :class="{ 'is-mine': task.assigneeId === currentUserId }"
                >
                  <div class="kanban-card-header">
                    <span class="priority-badge" :class="task.priority.toLowerCase()">{{ task.priority }}</span>
                    <span class="material-symbols-outlined card-menu" @click.stop="handleTaskMenu(task)">more_vert</span>
                  </div>
                  <h4>{{ task.title }}</h4>
                  <p class="task-note">{{ task.description }}</p>
                  <div class="kanban-card-footer">
                    <div class="assignee-info">
                      <div class="avatar-sm" :style="{ backgroundColor: getAvatarColor(task.assigneeId) }">
                        {{ task.assignee.charAt(0) }}
                      </div>
                      <span>{{ task.assignee }}</span>
                    </div>
                    <span class="due-date" :class="{ overdue: isOverdue(task.dueDate) }">
                      <span class="material-symbols-outlined">calendar_today</span>
                      {{ formatDate(task.dueDate) }}
                    </span>
                  </div>
                  <div v-if="task.reviewStatus === 'approved'" class="review-badge approved">
                    <span class="material-symbols-outlined">check_circle</span>已通过
                  </div>
                  <div v-if="task.reviewStatus === 'rejected'" class="review-badge rejected">
                    <span class="material-symbols-outlined">close</span>已驳回
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section v-else-if="currentTab === 'overview'" class="grid-2-1">
          <div class="glass-panel" style="padding:24px;border-radius:24px;">
            <h2 class="section-title">里程碑与进展摘要</h2>
            <div class="timeline" style="margin-top:18px;">
              <div class="timeline-item" v-for="item in milestones" :key="item.id">
                <span class="timeline-dot" :style="{ background: item.color }"></span>
                <div class="timeline-body">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:24px;">
            <div class="glass-panel" style="padding:24px;border-radius:24px;">
              <h2 class="section-title">基线偏差预警</h2>
              <p class="page-subtitle" style="font-size:15px;margin-top:14px;">
                当前实际进度较最新基线落后 6%，里程碑"联调验证"偏差 2 天。
              </p>
            </div>
            <div class="glass-panel" style="padding:24px;border-radius:24px;background:linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42));">
              <h2 class="section-title">AI 项目建议</h2>
              <p class="page-subtitle" style="font-size:15px;margin-top:14px;">
                建议将"数据回灌校验"拆分为独立子任务，并从平台组借调 1 名 QA 参与联调。
              </p>
            </div>
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

        <section v-else-if="currentTab === 'gantt'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <h2 class="section-title">项目甘特图</h2>
          <div style="margin-top:16px;display:flex;flex-direction:column;gap:12px;">
            <div v-for="item in ganttItems" :key="item.id" class="mini-bar-row">
              <span>{{ item.name }}</span>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${item.progress}%` }"></div>
              </div>
              <strong>{{ item.progress }}%</strong>
            </div>
          </div>
        </section>

        <section v-else-if="currentTab === 'risk'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <div class="risk-section-header">
            <h2 class="section-title">风险看板</h2>
            <button class="btn-chip" @click="handleAddRisk">
              <span class="material-symbols-outlined">add_alert</span>新增风险
            </button>
          </div>
          <div class="risk-grid">
            <div class="risk-card glass-panel" v-for="risk in risks" :key="risk.id">
              <div class="risk-header">
                <span class="risk-priority" :class="risk.priority">{{ risk.priority }}</span>
                <span class="material-symbols-outlined">more_vert</span>
              </div>
              <h3>{{ risk.title }}</h3>
              <p>{{ risk.desc }}</p>
              <div class="risk-footer">
                <span>{{ risk.owner }}</span>
                <span class="status-tag" :class="risk.class">{{ risk.status }}</span>
              </div>
            </div>
          </div>
        </section>

        <section v-else-if="currentTab === 'reports'" class="grid-2">
          <article class="chart-card glass-panel">
            <h3>进度报表</h3>
            <p class="page-subtitle" style="font-size:15px;margin-top:10px;">当前阶段完成率：72%，较上周 +5%。</p>
            <div class="progress-track" style="margin-top:16px;">
              <div class="progress-fill" style="width:72%;"></div>
            </div>
          </article>
          <article class="chart-card glass-panel">
            <h3>质量报表</h3>
            <p class="page-subtitle" style="font-size:15px;margin-top:10px;">关键缺陷 3 个，已关闭 2 个。</p>
            <div class="quality-stats">
              <span class="quality-item">
                <strong>3</strong>
                <span>关键缺陷</span>
              </span>
              <span class="quality-item">
                <strong>2</strong>
                <span>已关闭</span>
              </span>
            </div>
          </article>
        </section>

        <section v-else class="doc-grid">
          <article class="doc-card glass-panel" v-for="doc in docs" :key="doc.id">
            <div class="doc-header">
              <span class="material-symbols-outlined">description</span>
              <span class="doc-type">{{ doc.type }}</span>
            </div>
            <h3 style="font-size:20px;">{{ doc.title }}</h3>
            <p>{{ doc.desc }}</p>
            <div class="doc-footer">
              <span>{{ doc.author }}</span>
              <span>{{ doc.date }}</span>
            </div>
          </article>
        </section>
      </div>
    </main>

    <!-- 任务详情弹窗 -->
    <div class="modal-shell" :class="{ open: showTaskModal }">
      <div class="modal-backdrop" @click="closeTaskModal"></div>
      <section class="modal-panel glass-panel-strong task-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai">{{ isEditing ? '编辑任务' : '新建任务' }}</span>
            <h2 class="section-title">{{ isEditing ? '编辑任务详情' : '创建新任务' }}</h2>
          </div>
          <button class="modal-close" @click="closeTaskModal">
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
              <label>项目</label>
              <select v-model="taskForm.projectId">
                <option :value="projectId">{{ project.name }}</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeTaskModal">取消</button>
            <button type="submit" class="btn-primary">
              {{ isEditing ? '保存修改' : '创建任务' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- 审核弹窗 -->
    <div class="modal-shell" :class="{ open: showReviewModal }">
      <div class="modal-backdrop" @click="closeReviewModal"></div>
      <section class="modal-panel glass-panel-strong review-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-warning">任务审核</span>
            <h2 class="section-title">审核任务：{{ selectedTask?.title }}</h2>
          </div>
          <button class="modal-close" @click="closeReviewModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="review-content" v-if="selectedTask">
          <div class="review-task-info">
            <div class="info-row">
              <span class="info-label">任务标题</span>
              <span>{{ selectedTask.title }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">负责人</span>
              <span>{{ selectedTask.assignee }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">截止日期</span>
              <span>{{ selectedTask.dueDate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">实际工时</span>
              <span>{{ selectedTask.actualHours }} 小时</span>
            </div>
          </div>
          
          <div class="review-attachments" v-if="selectedTask.attachments.length > 0">
            <h3>附件列表</h3>
            <div class="attachment-list">
              <div v-for="(file, index) in selectedTask.attachments" :key="index" class="attachment-item">
                <span class="material-symbols-outlined">attach_file</span>
                <span>{{ file }}</span>
              </div>
            </div>
          </div>
          
          <div class="review-comments" v-if="selectedTask.comments.length > 0">
            <h3>任务评论</h3>
            <div class="comment-list">
              <div v-for="comment in selectedTask.comments" :key="comment.id" class="comment-item">
                <div class="comment-avatar" :style="{ backgroundColor: getAvatarColor(comment.userId) }">
                  {{ comment.userName.charAt(0) }}
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span>{{ comment.userName }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <p>{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="review-decision">
            <label>审核意见</label>
            <textarea v-model="reviewComment" placeholder="请输入审核意见（选填）" rows="3"></textarea>
            <div class="review-actions">
              <button class="btn-danger" @click="handleReject">
                <span class="material-symbols-outlined">close</span>驳回
              </button>
              <button class="btn-primary" @click="handleApprove">
                <span class="material-symbols-outlined">check_circle</span>通过
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

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
              <label>项目角色</label>
              <select v-model="memberForm.projectRole">
                <option value="owner">项目负责人</option>
                <option value="pm">项目经理</option>
                <option value="developer">开发</option>
                <option value="qa">测试</option>
                <option value="designer">设计</option>
                <option value="collaborator">协作方</option>
              </select>
            </div>
            
            <div class="form-section">
              <label>工作负载分配</label>
              <div class="load-slider">
                <input type="range" v-model="memberForm.load" min="0" max="100" step="10" />
                <span class="load-value">{{ memberForm.load }}%</span>
              </div>
            </div>
            
            <div class="form-section">
              <label>专注领域</label>
              <input type="text" v-model="memberForm.focus" placeholder="请输入专注领域" />
            </div>
            
            <div class="form-section">
              <label>状态</label>
              <select v-model="memberForm.status">
                <option value="在岗">在岗</option>
                <option value="请假">请假</option>
                <option value="兼职">兼职</option>
              </select>
            </div>
          </form>
          
          <div class="edit-member-actions">
            <button class="btn-danger" @click="handleConfirmRemoveMember">
              <span class="material-symbols-outlined">person_remove</span>移出项目
            </button>
            <div class="edit-member-actions-right">
              <button class="btn-secondary" @click="closeEditMemberModal">取消</button>
              <button class="btn-primary" @click="handleSaveMember">
                <span class="material-symbols-outlined">check</span>保存修改
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pushNotificationPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'
import { taskStore, notificationStore } from '../store/taskStore.js'
import { orgTree as orgData, users } from '../data/mockData.js'

const route = useRoute()
const router = useRouter()
const currentTab = 'kanban'

// 当前用户
const currentUser = {
  name: '王志强',
  role: '项目负责人',
  avatar: 'https://i.pravatar.cc/80?img=47'
}

// 当前用户ID（从store获取）
const currentUserId = computed(() => taskStore.state.currentUserId)

// 未读通知数
const unreadCount = computed(() => notificationStore.getUnreadCount())

// 项目数据
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

const projectId = computed(() => route.params.id || 1)

// 看板列配置
const kanbanColumns = [
  { id: 'todo', name: '待开始', status: '待开始' },
  { id: 'doing', name: '进行中', status: '进行中' },
  { id: 'review', name: '待审核', status: '待审核' },
  { id: 'done', name: '已完成', status: '已完成' }
]

// 获取所有任务
const allTasks = computed(() => taskStore.state.tasks)

// 根据列ID获取任务
const getColumnTasks = (columnId) => {
  const statusMap = {
    todo: '待开始',
    doing: '进行中',
    review: '待审核',
    done: '已完成'
  }
  return taskStore.filteredTasks.value.filter(t => t.status === statusMap[columnId])
}

// 里程碑数据
const milestones = ref([
  { id: 1, title: '需求评审', desc: '已完成。需求评审结论与实验约束已沉淀到项目文档。', color: 'var(--color-secondary-600)' },
  { id: 2, title: '开发实现', desc: '已完成 90%，剩余性能对齐与异常样本校验。', color: 'var(--color-secondary-600)' },
  { id: 3, title: '联调验证', desc: '相对基线延后 2 天。', color: 'var(--color-warning-600)' }
])

// 成员数据
const memberRows = ref([
  { id: 1, name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47', role: '项目负责人', load: '86%', dept: '平台组', focus: '联调推进', status: '在岗' },
  { id: 2, name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22', role: '平台工程师', load: '74%', dept: '平台组', focus: '回灌链路', status: '在岗' },
  { id: 3, name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33', role: 'QA', load: '58%', dept: 'QA组', focus: '回归校验', status: '在岗' }
])

// 甘特图数据
const ganttItems = ref([
  { id: 1, name: '需求评审', progress: 100 },
  { id: 2, name: '开发实现', progress: 90 },
  { id: 3, name: '联调验证', progress: 66 }
])

// 风险数据
const risks = ref([
  { id: 1, title: '联调窗口冲突', desc: '多个项目同时需要使用联调环境，可能导致资源冲突', owner: '王志强', status: '处理中', class: 'warning', priority: '高' },
  { id: 2, title: '测试环境冻结延迟', desc: '测试环境冻结时间推迟，影响测试进度', owner: '王雅婷', status: '待处理', class: 'danger', priority: '紧急' },
  { id: 3, title: '回灌链路波动', desc: '数据回灌链路偶尔出现波动，已增加监控', owner: '陈思远', status: '已缓解', class: 'success', priority: '中' }
])

// 文档数据
const docs = ref([
  { id: 1, title: '需求评审纪要', desc: '记录需求边界、时间计划和依赖说明，供 PM、研发与 QA 对齐使用。', type: '文档', author: '王志强', date: '2026-04-15' },
  { id: 2, title: '联调验证说明', desc: '包含当前联调阶段的前置条件、关键风险和任务引用。', type: '文档', author: '陈思远', date: '2026-04-20' },
  { id: 3, title: '回归样本池说明', desc: '当前文档为样式占位，可继续补充样本来源与版本关系。', type: '文档', author: '王雅婷', date: '2026-04-22' }
])

// 搜索关键词
const searchKeyword = ref('')

// 弹窗状态
const showTaskModal = ref(false)
const showReviewModal = ref(false)
const showInviteModal = ref(false)
const showArchiveModal = ref(false)
const showBaselineModal = ref(false)
const showEditMemberModal = ref(false)

// 选中的任务
const selectedTask = ref(null)

// 审核意见
const reviewComment = ref('')

// 邀请搜索关键词
const inviteSearchKeyword = ref('')

// 编辑中的成员
const editingMember = ref(null)

// 成员表单
const memberForm = reactive({
  projectRole: 'developer',
  load: 50,
  focus: '',
  status: '在岗'
})

// 任务表单
const taskForm = reactive({
  title: '',
  description: '',
  priority: 'P1',
  dueDate: '',
  assigneeId: '',
  reviewerId: '',
  estimatedHours: 8,
  projectId: projectId.value
})

// 是否正在编辑
const isEditing = computed(() => !!selectedTask.value)

// 可选的指派人
const assignableUsers = computed(() => taskStore.getAssignableUsers())

// 可选的审核人
const reviewers = computed(() => taskStore.getReviewers())

// 组织架构（可展开）
const orgTree = ref(orgData.map(d => ({ ...d })))

// 选中的成员（邀请用）
const selectedMembers = ref([])

// 过滤后的组织架构
const filteredOrgTree = computed(() => {
  if (!inviteSearchKeyword.value.trim()) {
    return orgTree.value
  }
  const keyword = inviteSearchKeyword.value.toLowerCase()
  return orgTree.value.map(dept => ({
    ...dept,
    members: dept.members.filter(m => 
      m.name.toLowerCase().includes(keyword) || 
      m.email.toLowerCase().includes(keyword)
    )
  })).filter(dept => dept.members.length > 0)
})

// 方法
const tabRoute = (tab) => {
  const id = projectId.value
  if (tab === 'overview') return `/project/${id}`
  return `/project/${id}/${tab}`
}

const handleNavigate = (path) => {
  router.push(path)
}

const handleOpenNotifications = () => {
  pushNotificationPath(router, route.fullPath)
}

const goBack = () => {
  router.push('/projects')
}

const handleCreateTask = () => {
  selectedTask.value = null
  Object.assign(taskForm, {
    title: '',
    description: '',
    priority: 'P1',
    dueDate: '',
    assigneeId: '',
    reviewerId: '',
    estimatedHours: 8,
    projectId: projectId.value
  })
  showTaskModal.value = true
}

const handleTaskClick = (task) => {
  selectedTask.value = task
  Object.assign(taskForm, {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    assigneeId: task.assigneeId,
    reviewerId: task.reviewerId,
    estimatedHours: task.estimatedHours,
    projectId: task.projectId
  })
  showTaskModal.value = true
}

const handleTaskMenu = (task) => {
  // 可以在这里添加更多操作
  console.log('Task menu:', task)
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedTask.value = null
  reviewComment.value = ''
}

const handleSaveTask = () => {
  const assignee = users.find(u => u.id === parseInt(taskForm.assigneeId))
  const reviewer = users.find(u => u.id === parseInt(taskForm.reviewerId))
  
  if (isEditing.value) {
    taskStore.updateTask(selectedTask.value.id, {
      ...taskForm,
      assignee: assignee?.name || '',
      reviewer: reviewer?.name || ''
    })
  } else {
    taskStore.createTask({
      ...taskForm,
      assignee: assignee?.name || '',
      reviewer: reviewer?.name || '',
      projectName: project.value.name,
      status: '待开始',
      actualHours: 0
    })
  }
  
  closeTaskModal()
}

const handleSubmitForReview = () => {
  if (selectedTask.value) {
    taskStore.submitForReview(selectedTask.value.id)
    closeTaskModal()
  }
}

const handleApprove = () => {
  if (selectedTask.value) {
    taskStore.approveTask(selectedTask.value.id, reviewComment.value)
    closeReviewModal()
  }
}

const handleReject = () => {
  if (selectedTask.value) {
    taskStore.rejectTask(selectedTask.value.id, reviewComment.value)
    closeReviewModal()
  }
}

const handleInviteMember = () => {
  selectedMembers.value = []
  inviteSearchKeyword.value = ''
  showInviteModal.value = true
}

const closeInviteModal = () => {
  showInviteModal.value = false
  selectedMembers.value = []
  inviteSearchKeyword.value = ''
}

const toggleDept = (dept) => {
  dept.expanded = !dept.expanded
}

const handleSendInvitation = () => {
  if (selectedMembers.value.length === 0) return
  
  const invitedUsers = []
  selectedMembers.value.forEach(memberId => {
    orgTree.value.forEach(dept => {
      const member = dept.members.find(m => m.id === memberId)
      if (member) {
        invitedUsers.push(member)
        
        notificationsStore.addNotification({
          id: Date.now() + Math.random(),
          type: 'invitation',
          title: '项目邀请',
          content: `您被邀请加入项目「${project.value.name}」`,
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
  memberForm.projectRole = getProjectRoleValue(member.role)
  memberForm.load = parseInt(member.load) || 50
  memberForm.focus = member.focus || ''
  memberForm.status = member.status || '在岗'
  showEditMemberModal.value = true
}

const closeEditMemberModal = () => {
  showEditMemberModal.value = false
  editingMember.value = null
}

const getProjectRoleValue = (roleLabel) => {
  const roleMap = {
    '项目负责人': 'owner',
    '项目经理': 'pm',
    '开发': 'developer',
    '测试': 'qa',
    '设计': 'designer',
    '协作方': 'collaborator',
    '成员': 'developer'
  }
  return roleMap[roleLabel] || 'developer'
}

const getProjectRoleLabel = (roleValue) => {
  const roleMap = {
    'owner': '项目负责人',
    'pm': '项目经理',
    'developer': '开发',
    'qa': '测试',
    'designer': '设计',
    'collaborator': '协作方'
  }
  return roleMap[roleValue] || '成员'
}

const handleSaveMember = () => {
  if (!editingMember.value) return
  
  const memberIndex = memberRows.value.findIndex(m => m.id === editingMember.value.id)
  if (memberIndex !== -1) {
    memberRows.value[memberIndex] = {
      ...memberRows.value[memberIndex],
      role: getProjectRoleLabel(memberForm.projectRole),
      load: `${memberForm.load}%`,
      focus: memberForm.focus,
      status: memberForm.status
    }
  }
  
  notificationsStore.addNotification({
    id: Date.now(),
    type: 'member_update',
    title: '成员信息更新',
    content: `项目成员「${editingMember.value.name}」的信息已更新`,
    targetUserId: editingMember.value.id,
    read: false,
    createdAt: new Date().toLocaleString('zh-CN')
  })
  
  closeEditMemberModal()
}

const handleConfirmRemoveMember = () => {
  if (!editingMember.value) return
  
  if (confirm(`确定要将「${editingMember.value.name}」从项目中移出吗？`)) {
    handleRemoveMember(editingMember.value)
    closeEditMemberModal()
  }
}

const handleRemoveMember = (member) => {
  const memberIndex = memberRows.value.findIndex(m => m.id === member.id)
  if (memberIndex !== -1) {
    memberRows.value.splice(memberIndex, 1)
    
    notificationsStore.addNotification({
      id: Date.now(),
      type: 'member_remove',
      title: '移出项目',
      content: `您已被从项目「${project.value.name}」中移出`,
      targetUserId: member.id,
      read: false,
      createdAt: new Date().toLocaleString('zh-CN')
    })
  }
}

const handleAddRisk = () => {
  console.log('新增风险')
}

const getAvatarColor = (userId) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#1989fa', '#67c23a', '#ff9800']
  return colors[(userId || 1) % colors.length]
}

const getRandomColor = () => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
  return colors[Math.floor(Math.random() * colors.length)]
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}-${date.getDate()}`
}

const isOverdue = (dateStr) => {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

const getStatusClass = (status) => {
  const classes = {
    '在岗': 'success',
    '请假': 'warning',
    '离职': 'danger'
  }
  return classes[status] || 'default'
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

// 监听搜索关键词
searchKeyword.value = taskStore.state.searchKeyword
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600&display=swap');
@import '../styles/shared.css';

/* 看板样式 */
.kanban-container {
  margin-top: 24px;
}

.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.kanban-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.kanban {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.kanban-column {
  padding: 20px;
  border-radius: 20px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.kanban-column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.kanban-column-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-900);
}

.kanban-tasks {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.kanban-card {
  background: white;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0,0,0,0.06);
  position: relative;
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.kanban-card.is-mine {
  border-left: 3px solid var(--color-primary-500);
}

.kanban-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.priority-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.priority-badge.p0 {
  background: rgba(245, 108, 108, 0.15);
  color: var(--color-danger-600);
}

.priority-badge.p1 {
  background: rgba(247, 196, 85, 0.15);
  color: var(--color-warning-600);
}

.priority-badge.p2 {
  background: rgba(79, 143, 246, 0.15);
  color: var(--color-primary-600);
}

.priority-badge.p3 {
  background: rgba(144, 147, 153, 0.15);
  color: var(--color-text-secondary);
}

.card-menu {
  opacity: 0;
  transition: opacity 0.2s;
}

.kanban-card:hover .card-menu {
  opacity: 1;
}

.kanban-card h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-primary-900);
}

.task-note {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.kanban-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assignee-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-sm {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.assignee-info span {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.due-date.overdue {
  color: var(--color-danger-600);
}

.review-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.review-badge.approved {
  background: rgba(156, 239, 219, 0.8);
  color: var(--color-secondary-600);
}

.review-badge.rejected {
  background: rgba(255, 218, 214, 0.8);
  color: var(--color-danger-600);
}

/* 成员管理 */
.member-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.member-row {
  display: grid;
  grid-template-columns: 200px 80px 100px 120px 100px 80px;
  padding: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.member-row:hover {
  background: rgba(0,0,0,0.02);
}

.member-ident {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-ident img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.member-actions {
  display: flex;
  gap: 8px;
}

/* 风险卡片 */
.risk-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.risk-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.risk-card {
  padding: 20px;
  border-radius: 16px;
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.risk-priority {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.risk-priority.紧急 {
  background: rgba(245, 108, 108, 0.15);
  color: var(--color-danger-600);
}

.risk-priority.高 {
  background: rgba(247, 196, 85, 0.15);
  color: var(--color-warning-600);
}

.risk-priority.中 {
  background: rgba(79, 143, 246, 0.15);
  color: var(--color-primary-600);
}

.risk-card h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.risk-card p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.risk-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文档卡片 */
.doc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.doc-card {
  padding: 20px;
  border-radius: 16px;
}

.doc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.doc-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(79, 143, 246, 0.15);
  color: var(--color-primary-600);
}

.doc-card h3 {
  margin-bottom: 8px;
}

.doc-card p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.doc-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 报表卡片 */
.chart-card {
  padding: 24px;
  border-radius: 16px;
}

.chart-card h3 {
  margin-bottom: 10px;
}

.quality-stats {
  display: flex;
  gap: 32px;
  margin-top: 16px;
}

.quality-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quality-item strong {
  font-size: 28px;
  color: var(--color-primary-700);
}

.quality-item span {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* 弹窗样式 */
.task-modal, .review-modal, .invite-modal {
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

/* 审核弹窗 */
.review-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-task-info {
  background: rgba(0,0,0,0.02);
  padding: 16px;
  border-radius: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.review-attachments, .review-comments {
  padding: 16px;
  background: rgba(0,0,0,0.02);
  border-radius: 12px;
}

.review-attachments h3, .review-comments h3 {
  font-size: 14px;
  margin-bottom: 12px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
  gap: 10px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.comment-header span:first-child {
  font-weight: 500;
  font-size: 13px;
}

.comment-time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.comment-content p {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.review-decision {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-decision label {
  font-size: 14px;
  font-weight: 500;
}

.review-decision textarea {
  padding: 12px 14px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  font-size: 14px;
}

.review-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.btn-danger {
  background: rgba(245, 108, 108, 0.1);
  color: var(--color-danger-600);
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: rgba(245, 108, 108, 0.2);
}

/* 邀请弹窗 */
.invite-modal {
  width: 600px;
}

.org-tree {
  max-height: 400px;
  overflow-y: auto;
}

.dept-node {
  margin-bottom: 8px;
}

.dept-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.02);
  border-radius: 10px;
  cursor: pointer;
}

.dept-header:hover {
  background: rgba(0,0,0,0.04);
}

.dept-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-text-secondary);
  background: rgba(0,0,0,0.06);
  padding: 2px 8px;
  border-radius: 10px;
}

.dept-members {
  padding-left: 24px;
  margin-top: 4px;
}

.member-checkbox {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
}

.member-checkbox:hover {
  background: rgba(0,0,0,0.02);
}

.member-checkbox input {
  margin-right: 10px;
}

.member-checkbox label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.member-email {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.invite-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.invite-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 状态标签 */
.status-tag.success { color: var(--color-secondary-600); background: rgba(156,239,219,0.8); }
.status-tag.warning { color: #a36b00; background: rgba(252,230,176,0.8); }
.status-tag.danger { color: var(--color-danger-600); background: rgba(255,218,214,0.8); }
.status-tag.default { color: var(--color-text-secondary); background: rgba(144,147,153,0.15); }

/* 邀请弹窗增强 */
.invite-search {
  margin-bottom: 12px;
}

.invite-search .search-shell {
  width: 100%;
  padding: 10px 14px;
  background: rgba(0,0,0,0.02);
  border-radius: 12px;
}

.invite-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(79, 143, 246, 0.1);
  border-radius: 10px;
  font-size: 14px;
  color: var(--color-primary-600);
}

.invite-summary .material-symbols-outlined {
  font-size: 20px;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 500;
  font-size: 14px;
}

/* 编辑成员弹窗 */
.edit-member-modal {
  width: 480px;
}

.member-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(0,0,0,0.02);
  border-radius: 12px;
  margin-bottom: 20px;
}

.avatar-lg {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  font-weight: 600;
}

.member-preview-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.member-preview-info p {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.member-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.load-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.load-slider input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
}

.load-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary-500);
  cursor: pointer;
}

.load-value {
  min-width: 48px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-600);
}

.edit-member-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.edit-member-actions-right {
  display: flex;
  gap: 12px;
}
</style>
