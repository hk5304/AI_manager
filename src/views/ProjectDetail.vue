<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-box">
        <div class="brand-icon"><span class="material-symbols-outlined">science</span></div>
        <div><h1 class="brand-title">R&D 系统</h1><p class="brand-subtitle">AI 驱动型协作平台</p></div>
      </div>
      <button class="sidebar-primary-cta" type="button" @click="isEditModalOpen = true">
        <span class="material-symbols-outlined">edit_square</span>编辑项目
      </button>
      <nav class="sidebar-nav">
        <router-link class="nav-item" to="/dashboard"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></router-link>
        <router-link class="nav-item active" to="/projects"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></router-link>
        <router-link class="nav-item" to="/workbench"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></router-link>
        <a class="nav-item notification-nav" href="#" @click.prevent="handleOpenNotifications"><span class="material-symbols-outlined">notifications</span><span>消息通知</span></a>
        <router-link class="nav-item" to="/reports"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></router-link>
        <router-link class="nav-item" to="/settings"><span class="material-symbols-outlined">settings</span><span>系统设置</span></router-link>
        <router-link class="nav-item" to="/admin"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></router-link>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <button class="topbar-back-icon" type="button" @click="goBack">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 class="topbar-title">项目详情</h2>
          <div class="topbar-breadcrumb">
            <span>项目</span><span>/</span><span>{{ project.name }}</span><span>/</span><span>{{ tabLabel }}</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell"><span class="material-symbols-outlined">search</span><input type="text" placeholder="搜索任务、里程碑或成员..." /></label>
        <button class="icon-btn notification-link" type="button" aria-label="打开通知中心" @click="handleOpenNotifications">
          <span class="material-symbols-outlined">notifications</span>
        </button>
        <button class="icon-btn"><span class="material-symbols-outlined">apps</span></button>
        <button class="icon-btn" @click="isAiDrawerOpen = true"><span class="material-symbols-outlined">auto_awesome</span></button>
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
            <button class="btn-secondary" @click="showArchiveModal = true"><span class="material-symbols-outlined">archive</span>归档项目</button>
            <button class="btn-primary" @click="showBaselineModal = true"><span class="material-symbols-outlined">track_changes</span>设置基线</button>
          </div>
        </div>

        <section class="summary-card glass-panel">
          <div class="summary-content">
            <div class="summary-head">
              <div>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                  <span class="pill pill-success">进行中</span>
                  <span class="pill pill-ai">需求迭代模板</span>
                </div>
                <h2 class="page-title" style="margin-top:18px;">{{ project.name }}</h2>
                <p class="page-subtitle" style="max-width:880px;">{{ project.desc }}</p>
              </div>
            </div>
            <div class="summary-kpis">
              <div class="summary-kpi"><span>项目负责人</span><strong>{{ project.owner }}</strong></div>
              <div class="summary-kpi"><span>时间范围</span><strong>{{ project.range }}</strong></div>
              <div class="summary-kpi"><span>项目进度</span><strong>{{ project.progress }}%</strong></div>
              <div class="summary-kpi"><span>健康度</span><strong style="color:var(--color-secondary-600);">{{ project.health }}</strong></div>
              <div class="summary-kpi"><span>优先级</span><strong :class="getPriorityClass(project.priority)">{{ project.priority }}</strong></div>
              <div class="summary-kpi"><span>成员数</span><strong>{{ project.members }} 人</strong></div>
            </div>
          </div>
        </section>

        <nav class="subnav-bar glass-panel">
          <router-link v-for="t in tabs" :key="t.key" class="subnav-link" :class="{ active: currentTab === t.key }" :to="tabRoute(t.key)">{{ t.label }}</router-link>
        </nav>

        <!-- Overview -->
        <div v-show="currentTab === 'overview'" class="tab-panel">
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="panel-head">
                <h2 class="section-title">里程碑与进展摘要</h2>
                <button class="btn-chip active">查看全部</button>
              </div>
              <div class="timeline" style="margin-top:18px;">
                <div class="timeline-item" v-for="m in milestones" :key="m.id">
                  <span class="timeline-dot" :style="{ background: m.color }"></span>
                  <div class="timeline-body">
                    <h4>{{ m.title }}</h4>
                    <p>{{ m.desc }}</p>
                    <span>{{ m.meta }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad">
                <div class="panel-head">
                  <h2 class="section-title" style="font-size:24px;">基线偏差预警</h2>
                  <span class="pill pill-danger">需关注</span>
                </div>
                <p class="page-subtitle" style="font-size:15px;margin-top:14px;">当前实际进度较最新基线落后 6%，里程碑“联调验证”偏差 2 天；若周三前完成环境修复，整体交付仍可控制在基线范围内。</p>
                <div class="summary-kpis" style="margin-top:16px;">
                  <div class="summary-kpi"><span>偏差里程碑</span><strong style="color:var(--color-danger-600);">1 个</strong></div>
                  <div class="summary-kpi"><span>预计追回</span><strong>0.8 天</strong></div>
                </div>
              </div>
              <div class="glass-panel panel-pad ai-gradient">
                <div style="display:flex;align-items:center;gap:10px;">
                  <span class="material-symbols-outlined" style="color:var(--color-tertiary-600);">psychology</span>
                  <h2 class="section-title" style="font-size:24px;">AI 项目建议</h2>
                </div>
                <p class="page-subtitle" style="font-size:15px;margin-top:14px;">建议将“数据回灌校验”拆分为独立子任务，并从平台组借调 1 名 QA 参与联调，预计可将偏差从 2 天压缩至 1.2 天。</p>
                <div class="ai-actions">
                  <button class="btn-primary" @click="showAiSuggestionModal = true">一键采纳</button>
                  <button class="btn-secondary" @click="showTaskBreakdownModal = true">查看任务拆解</button>
                </div>
              </div>
            </div>
          </section>
          <section class="grid-3-2">
            <div class="glass-panel panel-pad">
              <div class="panel-head">
                <h2 class="section-title">本周任务进展</h2>
                <span class="section-caption">42 个任务 · 3 个阻塞</span>
              </div>
              <div class="task-list">
                <div class="task-row" v-for="t in weekTasks" :key="t.id">
                  <div class="task-icon" :class="t.iconClass"><span class="material-symbols-outlined">{{ t.icon }}</span></div>
                  <div style="flex:1;">
                    <p class="task-title">{{ t.title }}</p>
                    <p class="task-note">{{ t.note }}</p>
                  </div>
                  <span class="pill" :class="t.pillClass">{{ t.status }}</span>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad">
                <h2 class="section-title">成员负载概览</h2>
                <div class="load-list">
                  <div v-for="l in loads" :key="l.name">
                    <div class="load-head"><strong>{{ l.name }}</strong><span>{{ l.value }}%</span></div>
                    <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" :style="{ width: l.value + '%', background: l.gradient }"></div></div>
                  </div>
                </div>
              </div>
              <div class="glass-panel panel-pad">
                <h2 class="section-title">风险摘要</h2>
                <div class="risk-tags">
                  <span class="status-tag warning">资源调度冲突</span>
                  <span class="status-tag danger">联调节点延后 2 天</span>
                  <span class="status-tag success">需求评审与开发实现稳定</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Members -->
        <div v-show="currentTab === 'members'" class="tab-panel">
          <section class="grid-3">
            <div class="glass-panel metric-card"><h3>项目成员</h3><div class="value">12</div><div class="trend" style="color:var(--color-primary-700);">2 位待接受</div></div>
            <div class="glass-panel metric-card"><h3>超阈值负载</h3><div class="value">3</div><div class="trend" style="color:var(--color-warning-600);">>80% 需调度</div></div>
            <div class="glass-panel metric-card"><h3>AI 推荐采纳率</h3><div class="value">67%</div><div class="trend" style="color:var(--color-secondary-600);">本周 6 次采纳</div></div>
          </section>
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="chart-header">
                <h2 class="section-title">成员列表</h2>
                <div class="report-chip-group">
                  <span class="pill pill-neutral">全部成员</span>
                  <span class="pill pill-warning">待接受 2</span>
                </div>
              </div>
              <div class="member-table">
                <div class="member-row" v-for="m in memberList" :key="m.id">
                  <div class="member-ident"><img :src="m.avatar" :alt="m.name" /><div><strong>{{ m.name }}</strong><p class="task-note">{{ m.dept }} · {{ m.role }}</p></div></div>
                  <div><span class="role-badge" :class="m.badge">{{ m.badgeLabel }}</span></div>
                  <div><span class="pill" :class="m.joinClass">{{ m.joinStatus }}</span></div>
                  <div><strong>当前任务 {{ m.tasks }}</strong><p class="task-note">预估 {{ m.estimate }}</p></div>
                  <div><span class="status-tag" :class="m.loadClass">{{ m.load }}%</span></div>
                  <button class="icon-btn"><span class="material-symbols-outlined">more_vert</span></button>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad ai-gradient">
                <h2 class="section-title">AI 智能分配建议</h2>
                <p class="page-subtitle" style="font-size:14px;margin-top:14px;">建议将“联调回灌日志补录”分配给 QA 成员王雅婷，置信度 91%；并将“测试环境参数冻结”交由赵扬处理，置信度 86%。</p>
                <div class="ai-actions">
                  <button class="btn-primary" @click="showAiAllocationModal = true">一键采纳</button>
                  <button class="btn-secondary" @click="showManualAdjustModal = true">手动调整</button>
                </div>
              </div>
              <div class="glass-panel panel-pad">
                <h2 class="section-title">邀请流程</h2>
                <div class="timeline" style="margin-top:18px;">
                  <div class="timeline-item" v-for="s in inviteSteps" :key="s.title">
                    <span class="timeline-dot" :style="{ background: s.color }"></span>
                    <div class="timeline-body"><h4>{{ s.title }}</h4><p>{{ s.desc }}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="glass-panel panel-pad">
            <div class="chart-header">
              <h2 class="section-title">未来一周负载热力图</h2>
              <span class="section-caption">颜色越深负载越高，超过 80% 显示预警。</span>
            </div>
            <div class="calendar-grid">
              <div></div>
              <div v-for="d in weekDays" :key="d" class="calendar-head">{{ d }}</div>
              <template v-for="r in heatmap" :key="r.name">
                <div class="calendar-name">{{ r.name }}</div>
                <div v-for="(c, i) in r.cells" :key="i" :class="'load-' + c"></div>
              </template>
            </div>
          </section>
        </div>

        <!-- Kanban -->
        <div v-show="currentTab === 'kanban'" class="tab-panel">
          <section class="glass-panel filter-bar">
            <button class="btn-chip" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">全部状态</button>
            <button class="btn-chip" :class="{ active: activeFilter === 'priority' }" @click="togglePriorityFilter">重要程度 {{ activeFilter === 'priority' ? currentPriority : '' }}</button>
            <button class="btn-chip" :class="{ active: activeFilter === 'week' }" @click="setFilter('week')">本周截止</button>
            <button class="btn-chip" :class="{ active: activeFilter === 'milestone' }" @click="setFilter('milestone')">关联里程碑</button>
            <div class="report-chip-group" style="margin-left:auto;">
              <span class="pill pill-neutral">任务总数 {{ totalTasks }}</span>
              <span class="pill pill-warning">阻塞 {{ blockedTasks }}</span>
            </div>
          </section>
          <section class="kanban-5">
            <div v-for="col in kanbanCols" :key="col.name" class="kanban-column glass-panel" :style="col.style">
              <div class="kanban-column-header"><h3>{{ col.name }}</h3><span class="pill" :class="col.pillClass">{{ col.count }}</span></div>
              <div class="kanban-card" v-for="card in col.cards" :key="card.title">
                <h4>{{ card.title }}</h4>
                <div class="kanban-meta">
                  <span v-for="tag in card.tags" :key="tag.text" class="micro-tag" :class="tag.class" :style="tag.style">{{ tag.text }}</span>
                </div>
                <p class="task-note">{{ card.note }}</p>
              </div>
            </div>
          </section>
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="chart-header">
                <h2 class="section-title">状态流转规则</h2>
                <span class="section-caption">待开始 → 进行中 → 待评审 → 已完成 / 已阻塞</span>
              </div>
              <table class="data-table">
                <thead><tr><th>规则</th><th>说明</th><th>通知</th></tr></thead>
                <tbody>
                  <tr v-for="r in flowRules" :key="r.rule"><td>{{ r.rule }}</td><td>{{ r.desc }}</td><td>{{ r.notify }}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="glass-panel panel-pad ai-gradient">
              <h2 class="section-title">AI 看板分析</h2>
              <p class="page-subtitle" style="font-size:14px;margin-top:14px;">AI 已分析当前看板状态，发现潜在瓶颈和优化机会，点击查看详细分析报告。</p>
              <div class="ai-actions">
                <button class="btn-primary" @click="showKanbanAnalysisModal = true">一键分析</button>
              </div>
            </div>
          </section>
        </div>

        <!-- Gantt -->
        <div v-show="currentTab === 'gantt'" class="tab-panel">
          <section class="glass-panel" style="padding:20px 24px;border-radius:24px;">
            <div class="gantt-info-head">
              <div>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                  <span class="pill pill-success">进行中</span>
                  <span class="pill pill-warning">联调偏差 +2 天</span>
                </div>
                <h2 class="section-title" style="margin-top:14px;">{{ project.name }}</h2>
                <p class="page-subtitle" style="font-size:15px;margin-top:8px;">负责人：{{ project.owner }} · 时间范围：{{ project.range }} · 当前进度：{{ project.progress }}%</p>
              </div>
              <div class="summary-kpis" style="margin-top:0;">
                <div class="summary-kpi"><span>关键路径</span><strong>3 段</strong></div>
                <div class="summary-kpi"><span>基线版本</span><strong>V2</strong></div>
                <div class="summary-kpi"><span>超期节点</span><strong style="color:var(--color-danger-600);">1 个</strong></div>
              </div>
            </div>
          </section>
          <section class="grid-3-2">
            <div class="gantt-shell glass-panel">
              <div class="gantt-toolbar">
                <div class="chip-group">
                  <button class="btn-chip" :class="{ active: ganttViewMode === 'week' }" @click="setGanttView('week')">按周</button>
                  <button class="btn-chip" :class="{ active: ganttViewMode === 'day' }" @click="setGanttView('day')">按日</button>
                  <button class="btn-chip" :class="{ active: ganttViewMode === 'month' }" @click="setGanttView('month')">按月</button>
                </div>
                <div class="chip-group">
                  <button class="btn-chip" :class="{ active: showBaseline }" @click="toggleBaseline"><span class="material-symbols-outlined">layers</span>{{ showBaseline ? '隐藏基线' : '显示基线' }}</button>
                  <button class="btn-chip" :class="{ active: showDependencies }" @click="toggleDependencies"><span class="material-symbols-outlined">share</span>依赖关系</button>
                  <button class="btn-chip" @click="zoomIn"><span class="material-symbols-outlined">zoom_in</span>放大</button>
                  <button class="btn-chip" @click="zoomOut"><span class="material-symbols-outlined">zoom_out</span>缩小</button>
                </div>
              </div>
              <div class="gantt-scroll-container">
                <div ref="layoutWrapperRef" class="gantt-layout-wrapper" @scroll="syncScrollPosition">
                  <div class="gantt-layout" :style="{ transform: `scaleX(${ganttZoom})`, transformOrigin: 'left center' }">
                    <div class="gantt-side">
                      <div class="gantt-head-row"><div>里程碑 / 任务</div><div>负责人</div><div style="text-align:right;">进度</div></div>
                      <div class="gantt-item-row" v-for="g in ganttData" :key="g.name">
                        <div><strong>{{ g.name }}</strong></div>
                        <div class="section-caption">{{ g.owner }}</div>
                        <div style="text-align:right;">
                          <span class="progress-badge" :class="getProgressClass(g.progress)">{{ g.progress }}%</span>
                        </div>
                      </div>
                    </div>
                    <div class="gantt-stage">
                      <div class="gantt-head-row"><div v-for="d in ganttDates" :key="d">{{ d }}</div></div>
                      <div class="gantt-item-row" v-for="g in ganttData" :key="g.name">
                        <div v-for="d in ganttDates" :key="d"></div>
                        <div class="gantt-bar-layer">
                          <div v-if="showBaseline" class="gantt-baseline" :style="{ left: g.baseLeft, width: g.baseWidth }"></div>
                          <div class="gantt-bar" :class="g.barClass" :style="{ left: g.barLeft, width: g.barWidth }">
                            <div class="gantt-bar-progress" :style="{ width: g.progress + '%' }"></div>
                            <span class="gantt-bar-label">{{ g.progress }}%</span>
                          </div>
                          <!-- 依赖关系连接线 -->
                          <div v-if="showDependencies" class="gantt-connector" v-for="(conn, idx) in getConnectors(g.name)" :key="idx" :style="conn.style"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 滑动条 -->
                <div class="gantt-scrollbar">
                  <div class="gantt-scroll-track" @click="jumpToPosition">
                    <div class="gantt-scroll-thumb" :style="{ left: scrollPosition + '%', width: viewportWidth + '%' }" @mousedown.stop="startDrag"></div>
                  </div>
                  <div class="gantt-scroll-labels">
                    <span v-for="(label, idx) in ganttDates" :key="idx">{{ label }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad">
                <h2 class="section-title">排期摘要</h2>
                <div class="summary-kpis" style="margin-top:16px;">
                  <div class="summary-kpi"><span>关键路径</span><strong>开发 → 联调 → 验收</strong></div>
                  <div class="summary-kpi"><span>偏差</span><strong style="color:var(--color-danger-600);">+2 天</strong></div>
                </div>
                <p class="page-subtitle" style="font-size:14px;margin-top:16px;">当前实际计划主要偏差集中在“联调验证”，其余里程碑仍在可控范围内。</p>
              </div>
              <div class="glass-panel panel-pad ai-gradient">
                <h2 class="section-title">AI 排期建议</h2>
                <p class="page-subtitle" style="font-size:14px;margin-top:14px;">若将 QA 提前一周介入联调准备，并拆分“回灌验证”与“异常样本校正”两项任务，可追回 0.8 天，并降低关键路径波动。</p>
                <div class="ai-actions">
                  <button class="btn-primary">采纳建议</button>
                  <button class="btn-secondary">生成任务</button>
                </div>
              </div>
              <div class="glass-panel panel-pad">
                <h2 class="section-title">图例</h2>
                <div class="legend-list">
                  <div class="gantt-flag"><span class="material-symbols-outlined" style="color:var(--color-primary-700);">timeline</span>当前计划</div>
                  <div class="gantt-flag"><span class="material-symbols-outlined" style="color:var(--color-text-tertiary);">layers</span>基线计划</div>
                  <div class="gantt-flag"><span class="material-symbols-outlined" style="color:var(--color-danger-600);">warning</span>偏差节点</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Risk -->
        <div v-show="currentTab === 'risk'" class="tab-panel">
          <section class="grid-3">
            <div class="glass-panel metric-card">
              <span class="material-symbols-outlined watermark" style="color:var(--color-danger-600);">report</span>
              <h3>高危任务</h3><div class="value">6</div>
              <div class="trend" style="color:var(--color-danger-600);"><span class="material-symbols-outlined" style="font-size:18px;">trending_up</span>+2 较上周</div>
            </div>
            <div class="glass-panel metric-card">
              <span class="material-symbols-outlined watermark" style="color:var(--color-warning-600);">notification_important</span>
              <h3>中度预警</h3><div class="value">11</div>
              <div class="trend" style="color:var(--color-warning-600);"><span class="material-symbols-outlined" style="font-size:18px;">trending_flat</span>持平</div>
            </div>
            <div class="glass-panel metric-card">
              <span class="material-symbols-outlined watermark" style="color:var(--color-secondary-600);">verified</span>
              <h3>整体稳定度</h3><div class="value">81%</div>
              <div class="trend" style="color:var(--color-secondary-600);"><span class="material-symbols-outlined" style="font-size:18px;">verified</span>仍可控</div>
            </div>
          </section>
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="chart-header">
                <h2 class="section-title">资源冲突预警热力图</h2>
                <div class="legend">
                  <span>低负载</span>
                  <div class="legend-scale">
                    <span style="background:rgba(173,198,255,0.24);"></span>
                    <span style="background:rgba(79,143,246,0.38);"></span>
                    <span style="background:rgba(20,104,199,0.58);"></span>
                    <span style="background:rgba(20,104,199,0.78);"></span>
                    <span style="background:rgba(10,48,124,0.88);"></span>
                  </div>
                  <span>冲突高发</span>
                </div>
              </div>
              <div class="heatmap-grid" style="margin-bottom:12px;">
                <div v-for="d in weekDays" :key="d" class="calendar-head">{{ d }}</div>
              </div>
              <div class="heatmap-grid">
                <div v-for="(c, i) in heatmapBlocks" :key="i" class="heat-block" :style="{ background: c.bg, boxShadow: c.shadow }"></div>
              </div>
            </div>
            <div class="glass-panel panel-pad ai-gradient">
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="material-symbols-outlined" style="color:var(--color-tertiary-600);">psychology</span>
                <h2 class="section-title">AI 深度洞察</h2>
              </div>
              <div class="ai-list" style="margin-top:18px;">
                <div class="ai-list-item" v-for="insight in riskInsights" :key="insight.title">
                  <h4>{{ insight.title }}</h4>
                  <p>{{ insight.desc }}</p>
                </div>
              </div>
              <div class="ai-actions">
                <button class="btn-primary" @click="showRiskReportModal = true">生成完整风险报告</button>
              </div>
            </div>
          </section>
          <section class="glass-panel panel-pad">
            <div class="chart-header">
              <h2 class="section-title">核心风险任务列表</h2>
              <div class="page-actions">
                <button class="btn-secondary">导出清单</button>
                <button class="btn-primary">一键处理</button>
              </div>
            </div>
            <table class="data-table">
              <thead>
                <tr><th>任务名称</th><th>风险等级</th><th>风险因子</th><th>进度阻碍</th><th>负责人</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr v-for="r in riskTasks" :key="r.name">
                  <td><strong>{{ r.name }}</strong></td>
                  <td><span class="pill" :class="r.levelClass">{{ r.level }}</span></td>
                  <td>{{ r.factor }}</td>
                  <td><div class="progress-track"><div class="progress-fill" :style="{ width: r.block + '%', background: r.barColor }"></div></div></td>
                  <td>{{ r.owner }}</td>
                  <td><span class="material-symbols-outlined" style="color:var(--color-text-tertiary);">more_horiz</span></td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <!-- Reports -->
        <div v-show="currentTab === 'reports'" class="tab-panel">
          <section class="glass-panel filter-bar">
            <button class="btn-chip" :class="{ active: reportTimeFilter === '30days' }" @click="setReportTimeFilter('30days')">最近 30 天</button>
            <button class="btn-chip" :class="{ active: reportTimeFilter === 'week' }" @click="setReportTimeFilter('week')">本周</button>
            <div class="filter-divider"></div>
            <button class="btn-chip" :class="{ active: reportType === 'progress' }" @click="setReportType('progress')">进度报表</button>
            <button class="btn-chip" :class="{ active: reportType === 'hours' }" @click="setReportType('hours')">工时报表</button>
            <button class="btn-chip" :class="{ active: reportType === 'quality' }" @click="setReportType('quality')">质量报表</button>
          </section>
          <section class="summary-card glass-panel">
            <div class="summary-content">
              <span class="pill pill-ai"><span class="material-symbols-outlined">auto_awesome</span>AI 洞察卡片</span>
              <h2 class="section-title" style="font-size:32px;margin-top:18px;">{{ aiSummaryTitle }}</h2>
              <p class="page-subtitle" style="margin-top:14px;max-width:980px;">{{ aiSummaryContent }}</p>
              <div class="ai-actions" style="margin-top:20px;">
                <button class="btn-primary" @click="exportMarkdown">一键导出 Markdown</button>
                <button class="btn-secondary feedback-btn" :class="{ 'liked': feedbackType === 'like' }" @click="submitFeedback('like')">
                  <span class="material-symbols-outlined">thumb_up</span>点赞反馈 {{ feedbackCount.like > 0 ? feedbackCount.like : '' }}
                </button>
                <button class="btn-secondary feedback-btn" :class="{ 'disliked': feedbackType === 'dislike' }" @click="submitFeedback('dislike')">
                  <span class="material-symbols-outlined">thumb_down</span>点踩反馈 {{ feedbackCount.dislike > 0 ? feedbackCount.dislike : '' }}
                </button>
                <button class="btn-secondary" @click="showAddSuggestionModal = true"><span class="material-symbols-outlined">lightbulb</span>项目建议</button>
                <button class="btn-secondary" @click="showSuggestionsModal = true"><span class="material-symbols-outlined">message_list</span>查看建议</button>
              </div>
            </div>
          </section>
          <!-- 进度报表 -->
          <section v-show="reportType === 'progress'" class="grid-2">
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">燃尽图</h2><span class="section-caption">剩余工作量趋势</span></div>
              <div class="dual-line">
                <div v-for="(p, i) in burnPoints" :key="i" class="point-col">
                  <div class="track"></div><span class="dot-a" :style="{ bottom: p.a + '%' }"></span><span class="dot-b" :style="{ bottom: p.b + '%' }"></span>
                </div>
              </div>
              <div class="legend" style="margin-top:16px;">
                <span class="legend-dot" style="background:var(--color-primary-700);">实际剩余</span>
                <span class="legend-dot" style="background:var(--color-secondary-600);">目标燃尽</span>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">任务完成进度</h2><span class="section-caption">按状态分布</span></div>
              <div class="bar-chart">
                <div v-for="b in progressBarData" :key="b.name" class="bar-item">
                  <div class="bar-track"><div class="bar-fill" :style="{ height: b.h + '%', background: b.gradient }"></div></div><span>{{ b.name }}</span>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">里程碑达成率</h2><span class="section-caption">关键节点完成情况</span></div>
              <div class="mini-bars">
                <div v-for="m in milestoneData" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong>{{ m.status }}</strong>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">进度偏差分析</h2><span class="section-caption">计划 vs 实际完成率</span></div>
              <div class="bar-chart">
                <div v-for="b in deviationData" :key="b.name" class="bar-item">
                  <div class="bar-track">
                    <div class="bar-fill" :style="{ height: b.plan + '%', background: 'var(--color-text-tertiary)', opacity: 0.5 }"></div>
                    <div class="bar-fill" :style="{ height: b.actual + '%', background: b.gradient, marginTop: (100 - b.actual) + '%' }"></div>
                  </div><span>{{ b.name }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 工时报表 -->
          <section v-show="reportType === 'hours'" class="grid-2">
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">计划 vs 实际工时</h2><span class="section-caption">按成员对比</span></div>
              <div class="bar-chart">
                <div v-for="b in barChartData" :key="b.name" class="bar-item">
                  <div class="bar-track"><div class="bar-fill" :style="{ height: b.h + '%', background: b.gradient }"></div></div><span>{{ b.name }}</span>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">工时分布</h2><span class="section-caption">每日工时统计</span></div>
              <div class="mini-bars">
                <div v-for="m in hoursDistribution" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong>{{ m.val }}</strong>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">资源利用率</h2><span class="section-caption">团队负载情况</span></div>
              <div class="mini-bars">
                <div v-for="m in resourceUtilization" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong :class="m.statusClass">{{ m.status }}</strong>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">预算执行情况</h2><span class="section-caption">成本控制分析</span></div>
              <div class="mini-bars">
                <div v-for="m in budgetData" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong>{{ m.val }}</strong>
                </div>
              </div>
            </div>
          </section>

          <!-- 质量报表 -->
          <section v-show="reportType === 'quality'" class="grid-2">
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">Bug 趋势</h2><span class="section-caption">新增 / 关闭</span></div>
              <div class="dual-line">
                <div v-for="(p, i) in bugPoints" :key="i" class="point-col">
                  <div class="track"></div><span class="dot-a" :style="{ bottom: p.a + '%', background: 'var(--color-danger-600)' }"></span><span class="dot-b" :style="{ bottom: p.b + '%', background: 'var(--color-secondary-600)' }"></span>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">阻塞时长与负载分布</h2><span class="section-caption">小时 / 人员</span></div>
              <div class="mini-bars">
                <div v-for="m in miniBars" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong>{{ m.val }}</strong>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">风险登记册</h2><span class="section-caption">风险等级分布</span></div>
              <div class="mini-bars">
                <div v-for="m in riskData" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong :class="m.levelClass">{{ m.level }}</strong>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">缺陷密度分析</h2><span class="section-caption">代码质量评估</span></div>
              <div class="mini-bars">
                <div v-for="m in defectDensity" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong>{{ m.val }}</strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Docs -->
        <div v-show="currentTab === 'docs'" class="tab-panel">
          <section class="doc-grid">
            <article class="doc-card glass-panel" v-for="doc in docList" :key="doc.title">
              <span class="pill" :class="doc.pillClass">{{ doc.pill }}</span>
              <h3 style="margin-top:14px;font-size:20px;">{{ doc.title }}</h3>
              <p>{{ doc.desc }}</p>
              <div class="summary-kpis"><div class="summary-kpi"><span>{{ doc.metaLabel }}</span><strong>{{ doc.metaValue }}</strong></div></div>
            </article>
          </section>
          <section class="empty-card glass-panel">
            <span class="material-symbols-outlined" style="font-size:56px;color:var(--color-primary-700);">folder_open</span>
            <h3 style="margin-top:18px;font-size:26px;">文档页首版以风格基线为主</h3>
            <p>当前已保留列表卡、版本、AI 摘要和空状态表达，后续可继续扩展为真实文档中心。</p>
          </section>
        </div>
      </div>
    </main>

    <!-- Edit Project Modal -->
    <div class="modal-shell" v-show="isEditModalOpen">
      <div class="modal-backdrop" @click="isEditModalOpen = false"></div>
      <section class="modal-panel glass-panel-strong project-edit-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai">项目编辑</span>
            <h2 class="section-title" style="font-size:28px;margin-top:14px;">编辑项目基础信息</h2>
            <p class="page-subtitle" style="font-size:15px;margin-top:10px;">延续当前项目详情页的玻璃拟态风格，左侧显示项目快照与编辑提示，右侧承载可编辑表单，作为后续真实化前的弹窗参考。</p>
          </div>
          <button class="icon-btn" @click="isEditModalOpen = false"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="project-edit-layout">
          <aside class="project-edit-side">
            <article class="glass-panel project-edit-card">
              <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                <span class="pill pill-success">进行中</span>
                <span class="pill pill-ai">需求迭代模板</span>
              </div>
              <h3 class="section-title" style="font-size:26px;margin-top:16px;">{{ project.name }}</h3>
              <p class="page-subtitle" style="font-size:14px;margin-top:12px;">聚焦晶体结构稳定性与模型预测精度提升，当前处于联调验证阶段，后续将继续围绕基线偏差与资源窗口做细化调整。</p>
              <div class="project-edit-progress">
                <div class="progress-track"><div class="progress-fill" style="width:72%;background:linear-gradient(90deg,var(--color-primary-400),var(--color-primary-700));"></div></div>
                <strong>72%</strong>
              </div>
              <div class="project-edit-kpis">
                <div class="project-edit-kpi"><span>项目负责人</span><strong>{{ project.owner }}</strong></div>
                <div class="project-edit-kpi"><span>成员数</span><strong>{{ project.members }} 人</strong></div>
                <div class="project-edit-kpi"><span>基线版本</span><strong>V2</strong></div>
                <div class="project-edit-kpi"><span>健康度</span><strong style="color:var(--color-secondary-600);">{{ project.health }}</strong></div>
              </div>
              <div class="project-edit-meta">
                <div class="project-edit-meta-row">
                  <div><span>时间范围</span><strong>2026-04-14 至 2026-05-16</strong></div>
                  <span class="status-tag warning">联调偏差 +2 天</span>
                </div>
                <div class="project-edit-meta-row">
                  <div><span>当前阶段</span><strong>联调验证</strong></div>
                  <span class="status-tag success">整体可控</span>
                </div>
              </div>
            </article>
            <article class="glass-panel project-edit-card ai-gradient">
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="material-symbols-outlined" style="color:var(--color-tertiary-600);">psychology</span>
                <h3 class="section-title" style="font-size:22px;">本次编辑建议</h3>
              </div>
              <div class="project-edit-note-list">
                <div class="project-edit-note" v-for="n in editNotes" :key="n.title">
                  <h4>{{ n.title }}</h4>
                  <p>{{ n.desc }}</p>
                </div>
              </div>
              <div class="project-edit-member-grid">
                <span class="project-edit-member" v-for="m in editMembers" :key="m"><img :src="m.avatar" :alt="m.name" />{{ m.name }}</span>
              </div>
            </article>
          </aside>
          <div class="project-edit-main">
            <article class="glass-panel project-edit-card">
              <div class="project-edit-card-head">
                <div><h3 class="section-title" style="font-size:22px;">基础信息</h3><p class="section-caption" style="margin-top:6px;">项目名称、编号、负责人和模板等基础字段</p></div>
                <span class="pill pill-neutral">基础字段</span>
              </div>
              <div class="field-inline">
                <div class="field-stack"><label class="field-label">项目名称</label><div class="field-input"><span class="material-symbols-outlined">title</span><input type="text" v-model="editForm.name" /></div></div>
                <div class="field-stack"><label class="field-label">项目编号</label><div class="field-input"><span class="material-symbols-outlined">tag</span><input type="text" v-model="editForm.code" /></div></div>
              </div>
              <div class="project-edit-field-grid" style="margin-top:16px;">
                <div class="field-stack"><label class="field-label">项目模板</label><div class="field-input"><span class="material-symbols-outlined">dashboard_customize</span><select v-model="editForm.template"><option>需求迭代模板</option><option>平台交付模板</option><option>联合实验模板</option></select></div></div>
                <div class="field-stack"><label class="field-label">项目负责人</label><div class="field-input"><span class="material-symbols-outlined">person</span><select v-model="editForm.owner"><option>王志强</option><option>陈思远</option><option>王雅婷</option></select></div></div>
                <div class="field-stack"><label class="field-label">归属团队</label><div class="field-input"><span class="material-symbols-outlined">groups</span><select v-model="editForm.team"><option>材料科学部</option><option>平台组</option><option>联合项目组</option></select></div></div>
              </div>
            </article>
            <article class="glass-panel project-edit-card">
              <div class="project-edit-card-head">
                <div><h3 class="section-title" style="font-size:22px;">计划与状态</h3><p class="section-caption" style="margin-top:6px;">统一维护时间、阶段、健康度和可见标签</p></div>
                <span class="pill pill-warning">需要同步</span>
              </div>
              <div class="field-inline">
                <div class="field-stack"><label class="field-label">开始日期</label><div class="field-input"><span class="material-symbols-outlined">calendar_today</span><input type="text" v-model="editForm.start" /></div></div>
                <div class="field-stack"><label class="field-label">结束日期</label><div class="field-input"><span class="material-symbols-outlined">event</span><input type="text" v-model="editForm.end" /></div></div>
              </div>
              <div class="project-edit-field-grid" style="margin-top:16px;">
                <div class="field-stack"><label class="field-label">当前阶段</label><div class="field-input"><span class="material-symbols-outlined">conversion_path</span><select v-model="editForm.stage"><option>联调验证</option><option>开发实现</option><option>上线验收</option></select></div></div>
                <div class="field-stack"><label class="field-label">健康度</label><div class="field-input"><span class="material-symbols-outlined">favorite</span><select v-model="editForm.health"><option>良好</option><option>需关注</option><option>高风险</option></select></div></div>
                <div class="field-stack"><label class="field-label">进度百分比</label><div class="field-input"><span class="material-symbols-outlined">progress_activity</span><input type="text" v-model="editForm.progress" /></div></div>
              </div>
              <div class="field-stack project-edit-textarea" style="margin-top:16px;">
                <label class="field-label">阶段说明</label>
                <div class="field-input"><span class="material-symbols-outlined" style="margin-top:16px;">notes</span><textarea v-model="editForm.note"></textarea></div>
              </div>
              <div class="project-edit-chip-row">
                <button v-for="chip in editChips1" :key="chip" class="permission-chip" :class="{ on: chip.on }" type="button">{{ chip.label }}</button>
              </div>
            </article>
            <article class="glass-panel project-edit-card">
              <div class="project-edit-card-head">
                <div><h3 class="section-title" style="font-size:22px;">成员与项目说明</h3><p class="section-caption" style="margin-top:6px;">补齐参与成员、协作角色和项目简介区块</p></div>
                <span class="pill pill-success">协作信息</span>
              </div>
              <div class="field-inline">
                <div class="field-stack"><label class="field-label">核心成员</label><div class="field-input"><span class="material-symbols-outlined">group</span><input type="text" v-model="editForm.members" /></div></div>
                <div class="field-stack"><label class="field-label">报告订阅人</label><div class="field-input"><span class="material-symbols-outlined">forward_to_inbox</span><input type="text" v-model="editForm.subscribers" /></div></div>
              </div>
              <div class="field-stack project-edit-textarea" style="margin-top:16px;">
                <label class="field-label">项目简介</label>
                <div class="field-input"><span class="material-symbols-outlined" style="margin-top:16px;">article</span><textarea v-model="editForm.bio"></textarea></div>
              </div>
              <div class="project-edit-chip-row">
                <button v-for="chip in editChips2" :key="chip" class="permission-chip" :class="{ on: chip.on }" type="button">{{ chip.label }}</button>
              </div>
            </article>
          </div>
        </div>
        <div class="modal-footer">
          <div class="modal-status"><span class="material-symbols-outlined">edit_note</span>当前为样式参考弹窗，字段与交互可在后续真实化时接入。</div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="isEditModalOpen = false"><span class="material-symbols-outlined">close</span>取消</button>
            <button class="btn-secondary" @click="showToast('项目草稿已保存', '编辑项目弹窗中的当前内容已保存为样式草稿，可继续调整布局与字段。', 'draft')"><span class="material-symbols-outlined">draft</span>保存草稿</button>
            <button class="btn-primary" @click="showToast('项目配置已更新', '项目基础信息、阶段说明和成员配置已同步为当前参考版本。', 'task_alt')"><span class="material-symbols-outlined">save</span>保存变更</button>
          </div>
        </div>
      </section>
    </div>

    <!-- AI Drawer -->
    <button class="floating-ai-btn" @click="isAiDrawerOpen = true"><span class="material-symbols-outlined">auto_awesome</span></button>
    <div class="ai-overlay" v-show="isAiDrawerOpen" @click="isAiDrawerOpen = false"></div>
    <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }">
      <div class="ai-header">
        <div><h3>AI 助手</h3><p class="section-caption">{{ aiContext }}</p></div>
        <button class="icon-btn" @click="isAiDrawerOpen = false"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="ai-card">
        <h4>{{ aiCard.title }}</h4>
        <p>{{ aiCard.desc }}</p>
        <div class="ai-actions">
          <button class="btn-primary">{{ aiCard.primary }}</button>
          <button class="btn-secondary">{{ aiCard.secondary }}</button>
        </div>
      </div>
      <div class="ai-list">
        <div class="ai-list-item" v-for="item in aiList" :key="item.title">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </aside>

    <!-- AI项目建议弹窗 -->
    <div class="modal-shell" :class="{ open: showAiSuggestionModal }">
      <div class="modal-backdrop" @click="showAiSuggestionModal = false"></div>
      <section class="modal-panel glass-panel-strong ai-suggestion-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai"><span class="material-symbols-outlined">psychology</span>AI 项目建议</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ aiSuggestions.projectName }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">{{ aiSuggestions.summary }}</p>
          </div>
          <button class="icon-btn" @click="showAiSuggestionModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
          <div class="suggestion-list">
            <div 
              v-for="(suggestion, index) in aiSuggestions.suggestions" 
              :key="suggestion.id" 
              class="suggestion-item glass-panel"
            >
              <div class="suggestion-header">
                <span class="suggestion-number">{{ index + 1 }}</span>
                <h3>{{ suggestion.title }}</h3>
                <span class="confidence-badge">{{ suggestion.confidence }}</span>
              </div>
              <p>{{ suggestion.content }}</p>
              <div class="suggestion-impact">
                <span class="material-symbols-outlined">trending_up</span>
                <span>{{ suggestion.impact }}</span>
              </div>
            </div>
          </div>

          <div class="conclusion-box">
            <span class="material-symbols-outlined">lightbulb</span>
            <p>{{ aiSuggestions.conclusion }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">robot_2</span>
            AI 分析基于项目历史数据与当前状态生成建议
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showAiSuggestionModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
            <button class="btn-primary" @click="adoptSuggestion"><span class="material-symbols-outlined">check_circle</span>一键采纳</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 任务拆解弹窗 -->
    <div class="modal-shell" :class="{ open: showTaskBreakdownModal }">
      <div class="modal-backdrop" @click="showTaskBreakdownModal = false"></div>
      <section class="modal-panel glass-panel-strong task-breakdown-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-primary"><span class="material-symbols-outlined">splitscreen</span>任务拆解</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ taskBreakdown.projectName }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">共 {{ taskBreakdown.totalTasks }} 个任务，按阶段拆解展示</p>
          </div>
          <button class="icon-btn" @click="showTaskBreakdownModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
          <div class="breakdown-list">
            <div 
              v-for="(phase, phaseIndex) in taskBreakdown.breakdown" 
              :key="phaseIndex" 
              class="phase-section"
            >
              <div class="phase-header">
                <span class="phase-icon"><span class="material-symbols-outlined">folder</span></span>
                <h3>{{ phase.phase }}</h3>
                <span class="task-count">{{ phase.tasks.length }} 个任务</span>
              </div>
              <div class="task-grid">
                <div 
                  v-for="task in phase.tasks" 
                  :key="task.name" 
                  class="task-card glass-panel"
                >
                  <div class="task-header">
                    <span :class="`priority-tag priority-${task.priority.toLowerCase()}`">{{ task.priority }}</span>
                    <span :class="`status-tag status-${task.status === '已完成' ? 'success' : task.status === '进行中' ? 'warning' : 'neutral'}`">{{ task.status }}</span>
                  </div>
                  <h4>{{ task.name }}</h4>
                  <div class="task-progress">
                    <div class="progress-track"><div class="progress-fill" :style="{ width: task.progress + '%' }"></div></div>
                    <span>{{ task.progress }}%</span>
                  </div>
                  <div class="task-assignee">
                    <span class="material-symbols-outlined">person</span>
                    <span>{{ task.assignee }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">bar_chart</span>
            任务拆解便于分析项目结构和资源分配
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showTaskBreakdownModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
            <button class="btn-primary"><span class="material-symbols-outlined">download</span>导出拆解报告</button>
          </div>
        </div>
      </section>
    </div>

    <!-- AI智能分配建议弹窗 -->
    <div class="modal-shell" :class="{ open: showAiAllocationModal }">
      <div class="modal-backdrop" @click="showAiAllocationModal = false"></div>
      <section class="modal-panel glass-panel-strong ai-allocation-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai"><span class="material-symbols-outlined">psychology</span>AI 智能分配建议</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ aiAllocationData.projectName }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">{{ aiAllocationData.summary }}</p>
          </div>
          <button class="icon-btn" @click="showAiAllocationModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
          <div class="allocation-list">
            <div 
              v-for="(suggestion, index) in aiAllocationData.suggestions" 
              :key="suggestion.id" 
              class="allocation-item glass-panel"
            >
              <div class="allocation-header">
                <span class="suggestion-number">{{ index + 1 }}</span>
                <h3>{{ suggestion.taskName }}</h3>
                <span class="confidence-badge">置信度 {{ suggestion.confidence }}</span>
              </div>
              <div class="allocation-transfer">
                <div class="transfer-item">
                  <span class="transfer-label">当前负责人</span>
                  <div class="transfer-info">
                    <span class="material-symbols-outlined">person</span>
                    <span>{{ suggestion.fromMember }}</span>
                    <span class="dept-tag">{{ suggestion.fromDept }}</span>
                  </div>
                </div>
                <span class="transfer-arrow"><span class="material-symbols-outlined">arrow_right_alt</span></span>
                <div class="transfer-item">
                  <span class="transfer-label">建议负责人</span>
                  <div class="transfer-info">
                    <span class="material-symbols-outlined">person</span>
                    <span>{{ suggestion.toMember }}</span>
                    <span class="dept-tag">{{ suggestion.toDept }}</span>
                  </div>
                </div>
              </div>
              <p class="allocation-reason">{{ suggestion.reason }}</p>
              <div class="suggestion-impact">
                <span class="material-symbols-outlined">trending_up</span>
                <span>{{ suggestion.impact }}</span>
              </div>
            </div>
          </div>

          <div class="conclusion-box">
            <span class="material-symbols-outlined">lightbulb</span>
            <p><strong>综合评估：</strong>{{ aiAllocationData.overallImpact }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">swap_horiz</span>
            AI 基于成员负载和任务特性智能分析生成分配建议
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showAiAllocationModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
            <button class="btn-primary" @click="adoptAllocation"><span class="material-symbols-outlined">check_circle</span>一键采纳</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 手动调整弹窗 -->
    <div class="modal-shell" :class="{ open: showManualAdjustModal }">
      <div class="modal-backdrop" @click="showManualAdjustModal = false"></div>
      <section class="modal-panel glass-panel-strong manual-adjust-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-secondary"><span class="material-symbols-outlined">settings</span>手动调整分配</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ project.name }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">手动调整任务分配和负责人</p>
          </div>
          <button class="icon-btn" @click="showManualAdjustModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
          <div class="adjust-list">
            <div 
              v-for="(member, index) in memberList" 
              :key="member.id" 
              class="adjust-item glass-panel"
            >
              <div class="member-info">
                <img :src="member.avatar" :alt="member.name" class="member-avatar" />
                <div class="member-details">
                  <h3>{{ member.name }}</h3>
                  <div class="member-meta">
                    <span class="role-badge" :class="member.badge.toLowerCase()">{{ member.badgeLabel }}</span>
                    <span>{{ member.dept }} · {{ member.role }}</span>
                  </div>
                </div>
              </div>
              <div class="member-stats">
                <div class="stat-item">
                  <span class="stat-label">任务数</span>
                  <span class="stat-value">{{ member.tasks }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">预估工时</span>
                  <span class="stat-value">{{ member.estimate }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">负载</span>
                  <span :class="`stat-value load-${member.loadClass}`">{{ member.load }}%</span>
                </div>
              </div>
              <button class="btn-secondary btn-sm" @click="showToast('调整功能', '任务分配调整功能已准备就绪，可在此修改任务负责人。', 'settings')">
                <span class="material-symbols-outlined">edit</span>调整
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">users</span>
            当前共 {{ memberList.length }} 位成员，其中 {{ memberList.filter(m => m.joinStatus === '已加入').length }} 位已加入
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showManualAdjustModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
            <button class="btn-primary"><span class="material-symbols-outlined">save</span>保存调整</button>
          </div>
        </div>
      </section>
    </div>

    <!-- AI看板分析弹窗 -->
    <div class="modal-shell" :class="{ open: showKanbanAnalysisModal }">
      <div class="modal-backdrop" @click="showKanbanAnalysisModal = false"></div>
      <section class="modal-panel glass-panel-strong kanban-analysis-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai"><span class="material-symbols-outlined">bar_chart</span>AI 看板分析</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ kanbanAnalysisData.projectName }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">{{ kanbanAnalysisData.summary }}</p>
          </div>
          <button class="icon-btn" @click="showKanbanAnalysisModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <!-- 概览统计 -->
        <div class="analysis-overview">
          <div class="overview-card">
            <span class="overview-icon total"><span class="material-symbols-outlined">list</span></span>
            <div>
              <span class="overview-value">{{ kanbanAnalysisData.overview.totalTasks }}</span>
              <span class="overview-label">总任务数</span>
            </div>
          </div>
          <div class="overview-card">
            <span class="overview-icon completed"><span class="material-symbols-outlined">check_circle</span></span>
            <div>
              <span class="overview-value">{{ kanbanAnalysisData.overview.completedTasks }}</span>
              <span class="overview-label">已完成</span>
            </div>
          </div>
          <div class="overview-card">
            <span class="overview-icon progress"><span class="material-symbols-outlined">clock</span></span>
            <div>
              <span class="overview-value">{{ kanbanAnalysisData.overview.inProgressTasks }}</span>
              <span class="overview-label">进行中</span>
            </div>
          </div>
          <div class="overview-card">
            <span class="overview-icon blocked"><span class="material-symbols-outlined">alert</span></span>
            <div>
              <span class="overview-value">{{ kanbanAnalysisData.overview.blockedTasks }}</span>
              <span class="overview-label">已阻塞</span>
            </div>
          </div>
        </div>

        <!-- 分析洞察 -->
        <div style="max-height: 45vh; overflow-y: auto; padding-right: 8px;">
          <h3 style="margin-bottom: 16px; font-size: 16px; font-weight: 600; color: var(--color-text-primary);">分析洞察</h3>
          <div class="insight-list">
            <div 
              v-for="insight in kanbanAnalysisData.insights" 
              :key="insight.id" 
              class="insight-item glass-panel"
              :class="`insight-${insight.type}`"
            >
              <div class="insight-header">
                <span class="insight-icon">
                  <span v-if="insight.type === 'warning'" class="material-symbols-outlined">warning</span>
                  <span v-else-if="insight.type === 'success'" class="material-symbols-outlined">check_circle</span>
                  <span v-else class="material-symbols-outlined">info</span>
                </span>
                <h4>{{ insight.title }}</h4>
              </div>
              <p>{{ insight.content }}</p>
              <div class="insight-impact">
                <span class="material-symbols-outlined">trending_up</span>
                <span>{{ insight.impact }}</span>
              </div>
            </div>
          </div>

          <!-- 建议 -->
          <h3 style="margin-top: 24px; margin-bottom: 16px; font-size: 16px; font-weight: 600; color: var(--color-text-primary);">优化建议</h3>
          <div class="recommendation-list">
            <div 
              v-for="rec in kanbanAnalysisData.recommendations" 
              :key="rec.id" 
              class="recommendation-item"
            >
              <span class="rec-number">{{ rec.id }}</span>
              <div class="rec-content">
                <strong>{{ rec.title }}</strong>
                <span>{{ rec.action }}</span>
              </div>
            </div>
          </div>

          <!-- 结论 -->
          <div class="conclusion-box" style="margin-top: 20px;">
            <span class="material-symbols-outlined">lightbulb</span>
            <p>{{ kanbanAnalysisData.conclusion }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">brain</span>
            AI 基于看板数据实时分析生成报告
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showKanbanAnalysisModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
            <button class="btn-primary"><span class="material-symbols-outlined">download</span>导出分析报告</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 风险报告弹窗 -->
    <div class="modal-shell" :class="{ open: showRiskReportModal }">
      <div class="modal-backdrop" @click="showRiskReportModal = false"></div>
      <section class="modal-panel glass-panel-strong risk-report-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-warning"><span class="material-symbols-outlined">security</span>AI 风险分析报告</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ riskReportData.projectName }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">报告生成日期：{{ riskReportData.reportDate }}</p>
          </div>
          <button class="icon-btn" @click="showRiskReportModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <!-- 概览卡片 -->
        <div class="risk-overview">
          <div class="risk-card">
            <div class="risk-card-icon high-risk">
              <span class="material-symbols-outlined">alert</span>
            </div>
            <div>
              <span class="risk-value">{{ riskReportData.overview.highRisk }}</span>
              <span class="risk-label">高危任务</span>
              <span class="risk-trend up">+2 较上周</span>
            </div>
          </div>
          <div class="risk-card">
            <div class="risk-card-icon medium-risk">
              <span class="material-symbols-outlined">notification_important</span>
            </div>
            <div>
              <span class="risk-value">{{ riskReportData.overview.mediumRisk }}</span>
              <span class="risk-label">中度预警</span>
              <span class="risk-trend stable">持平</span>
            </div>
          </div>
          <div class="risk-card">
            <div class="risk-card-icon stability">
              <span class="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <span class="risk-value">{{ riskReportData.overview.stability }}%</span>
              <span class="risk-label">整体稳定度</span>
              <span class="risk-status">{{ riskReportData.overview.status }}</span>
            </div>
          </div>
        </div>

        <!-- 执行摘要 -->
        <div class="executive-summary">
          <h3><span class="material-symbols-outlined">file_text</span>执行摘要</h3>
          <p>{{ riskReportData.executiveSummary }}</p>
        </div>

        <!-- 风险分类 -->
        <div style="max-height: 50vh; overflow-y: auto; padding-right: 8px;">
          <h3 style="margin-bottom: 16px; font-size: 16px; font-weight: 600; color: var(--color-text-primary);">风险分类</h3>
          <div class="risk-breakdown">
            <div 
              v-for="risk in riskReportData.riskBreakdown" 
              :key="risk.level" 
              class="risk-category"
              :class="risk.level === '高危' ? 'high' : 'medium'"
            >
              <div class="risk-category-header">
                <span class="risk-badge">{{ risk.level }}</span>
                <span class="risk-count">{{ risk.count }} 项</span>
                <span :class="`risk-trend-badge ${risk.trendType}`">{{ risk.trend }}</span>
              </div>
              <div class="risk-item-list">
                <span v-for="(item, idx) in risk.items" :key="idx" class="risk-item">{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- 关键发现 -->
          <h3 style="margin-top: 24px; margin-bottom: 16px; font-size: 16px; font-weight: 600; color: var(--color-text-primary);">关键发现</h3>
          <div class="findings-list">
            <div 
              v-for="finding in riskReportData.keyFindings" 
              :key="finding.id" 
              class="finding-item glass-panel"
            >
              <div class="finding-header">
                <span :class="`severity-badge ${finding.severity}`">
                  {{ finding.severity === 'high' ? '高危' : '中度' }}
                </span>
                <h4>{{ finding.title }}</h4>
              </div>
              <p class="finding-content">{{ finding.content }}</p>
              <div class="finding-recommendation">
                <span class="material-symbols-outlined">lightbulb</span>
                <span>{{ finding.recommendation }}</span>
              </div>
            </div>
          </div>

          <!-- 资源冲突预警 -->
          <div class="heatmap-summary">
            <h3><span class="material-symbols-outlined">calendar</span>资源冲突预警</h3>
            <div class="conflict-days">
              <span 
                v-for="day in riskReportData.heatmapSummary.highConflictDays" 
                :key="day" 
                class="conflict-day"
              >
                {{ day }}
              </span>
            </div>
            <p>{{ riskReportData.heatmapSummary.warning }}</p>
          </div>

          <!-- 建议措施 -->
          <h3 style="margin-top: 24px; margin-bottom: 16px; font-size: 16px; font-weight: 600; color: var(--color-text-primary);">建议措施</h3>
          <div class="recommendation-list">
            <div 
              v-for="rec in riskReportData.recommendations" 
              :key="rec.id" 
              class="recommendation-item"
            >
              <span class="rec-number">{{ rec.id }}</span>
              <span>{{ rec.action }}</span>
            </div>
          </div>

          <!-- 结论 -->
          <div class="conclusion-box" style="margin-top: 20px;">
            <span class="material-symbols-outlined">flag</span>
            <p><strong>综合结论：</strong>{{ riskReportData.conclusion }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">shield</span>
            AI 基于风险数据智能分析生成完整报告
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showRiskReportModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
            <button class="btn-primary"><span class="material-symbols-outlined">download</span>导出报告</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 归档项目弹窗 -->
    <div class="modal-shell" :class="{ open: showArchiveModal }">
      <div class="modal-backdrop" @click="showArchiveModal = false"></div>
      <section class="modal-panel glass-panel-strong archive-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-danger"><span class="material-symbols-outlined">archive</span>归档项目</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ project.name }}</h2>
          </div>
        </div>

        <div class="archive-content">
          <div class="warning-box">
            <div class="warning-icon-wrap">
              <span class="material-symbols-outlined warning-icon">warning</span>
            </div>
            <h3>归档后将影响以下内容：</h3>
            <ul>
              <li>项目将从项目列表中移除，不再参与日常统计</li>
              <li>所有任务状态将被冻结，不再接收新任务</li>
              <li>成员将收到项目归档通知</li>
              <li>项目数据仍可在归档库中查询</li>
            </ul>
          </div>

          <div class="confirm-check">
            <label class="checkbox-label">
              <input type="checkbox" v-model="archiveConfirm" />
              <span class="checkmark"></span>
              <span>我确认要归档此项目</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">info</span>
            归档操作不可逆，请谨慎操作
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showArchiveModal = false"><span class="material-symbols-outlined">close</span>取消</button>
            <button class="btn-danger" @click="archiveProject"><span class="material-symbols-outlined">archive</span>确认归档</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 设置基线弹窗 -->
    <div class="modal-shell" :class="{ open: showBaselineModal }">
      <div class="modal-backdrop" @click="showBaselineModal = false"></div>
      <section class="modal-panel glass-panel-strong baseline-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-primary"><span class="material-symbols-outlined">track_changes</span>设置基线</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ project.name }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">创建新的项目基线，用于后续进度对比</p>
          </div>
          <button class="icon-btn" @click="showBaselineModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
          <div class="baseline-form">
            <label>基线名称</label>
            <input 
              v-model="baselineName" 
              type="text" 
              placeholder="请输入基线名称，如：V1.0 正式版本" 
            />
          </div>

          <div class="baseline-preview">
            <h3>当前项目状态摘要</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="material-symbols-outlined">checklist</span>
                <div>
                  <span class="value">38</span>
                  <span class="label">总任务数</span>
                </div>
              </div>
              <div class="summary-item">
                <span class="material-symbols-outlined">check_circle</span>
                <div>
                  <span class="value">72%</span>
                  <span class="label">完成进度</span>
                </div>
              </div>
              <div class="summary-item">
                <span class="material-symbols-outlined">users</span>
                <div>
                  <span class="value">12</span>
                  <span class="label">团队成员</span>
                </div>
              </div>
              <div class="summary-item">
                <span class="material-symbols-outlined">flag</span>
                <div>
                  <span class="value">4</span>
                  <span class="label">里程碑</span>
                </div>
              </div>
            </div>
          </div>

          <div class="baseline-history">
            <h3>历史基线记录</h3>
            <div class="history-list">
              <div 
                v-for="baseline in baselineHistory" 
                :key="baseline.id" 
                class="history-item"
              >
                <div class="history-info">
                  <div class="history-name">
                    {{ baseline.name }}
                    <span v-if="baseline.status === '已激活'" class="status-tag active">{{ baseline.status }}</span>
                    <span v-else class="status-tag">{{ baseline.status }}</span>
                  </div>
                  <div class="history-meta">
                    <span>{{ baseline.creator }} · {{ baseline.date }}</span>
                    <span>{{ baseline.tasks }} 个任务</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">info</span>
            新基线将作为后续进度对比的基准参照
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showBaselineModal = false"><span class="material-symbols-outlined">close</span>取消</button>
            <button class="btn-primary" @click="createBaseline"><span class="material-symbols-outlined">add</span>创建基线</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 添加项目建议弹窗 -->
    <div class="modal-shell" :class="{ open: showAddSuggestionModal }">
      <div class="modal-backdrop" @click="showAddSuggestionModal = false"></div>
      <section class="modal-panel glass-panel-strong add-suggestion-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-tertiary"><span class="material-symbols-outlined">lightbulb</span>提交项目建议</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ project.name }}</h2>
          </div>
          <button class="icon-btn" @click="showAddSuggestionModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div class="suggestion-form">
          <label>您的建议</label>
          <textarea 
            v-model="newSuggestion" 
            placeholder="请输入您对项目的建议或改进意见..." 
            rows="6"
          ></textarea>
          <div class="form-footer">
            <span class="form-hint">您的建议将匿名提交给项目负责人</span>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">message</span>
            提交您的宝贵建议，帮助项目更好地推进
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showAddSuggestionModal = false"><span class="material-symbols-outlined">close</span>取消</button>
            <button class="btn-primary" @click="addSuggestion"><span class="material-symbols-outlined">send</span>提交建议</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 查看项目建议弹窗 -->
    <div class="modal-shell" :class="{ open: showSuggestionsModal }">
      <div class="modal-backdrop" @click="showSuggestionsModal = false"></div>
      <section class="modal-panel glass-panel-strong view-suggestions-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-primary"><span class="material-symbols-outlined">message_list</span>项目建议列表</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ project.name }}</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">共 {{ projectSuggestions.length }} 条建议</p>
          </div>
          <button class="icon-btn" @click="showSuggestionsModal = false"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
          <div class="suggestions-list">
            <div 
              v-for="suggestion in projectSuggestions" 
              :key="suggestion.id" 
              class="suggestion-item glass-panel"
            >
              <div class="suggestion-content">
                <p>{{ suggestion.content }}</p>
              </div>
              <div class="suggestion-footer">
                <div class="suggestion-meta">
                  <span class="suggestion-author">{{ suggestion.author }}</span>
                  <span class="suggestion-time">{{ suggestion.time }}</span>
                </div>
                <button class="like-btn" @click="likeSuggestion(suggestion)">
                  <span class="material-symbols-outlined">thumb_up</span>
                  <span>{{ suggestion.likes }}</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="projectSuggestions.length === 0" class="empty-state">
            <span class="material-symbols-outlined">inbox</span>
            <p>暂无项目建议，快来提交第一条吧！</p>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">users</span>
            团队成员共同贡献的项目改进建议
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="showSuggestionsModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
            <button class="btn-primary" @click="showSuggestionsModal = false; showAddSuggestionModal = true"><span class="material-symbols-outlined">add</span>提交建议</button>
          </div>
        </div>
      </section>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast">
        <span class="material-symbols-outlined">{{ toast.icon }}</span>
        <div><strong>{{ toast.title }}</strong><p>{{ toast.message }}</p></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pushNotificationPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'
import { useProjects } from '../composables/useProjects'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'members', label: '成员' },
  { key: 'kanban', label: '项目看板' },
  { key: 'gantt', label: '项目甘特图' },
  { key: 'risk', label: '风险看板' },
  { key: 'reports', label: '报表' },
  { key: 'docs', label: '文档' }
]

const currentTab = computed(() => {
  const tab = route.params.tab
  const valid = tabs.map(t => t.key)
  return valid.includes(tab) ? tab : 'overview'
})

const tabLabel = computed(() => tabs.find(t => t.key === currentTab.value)?.label || '概览')

const projectId = computed(() => route.params.id || 1)
const tabRoute = (tab) => {
  const id = projectId.value
  if (tab === 'overview') return `/project/${id}`
  return `/project/${id}/${tab}`
}

const goBack = () => {
  router.push('/projects')
}

const handleOpenNotifications = () => {
  pushNotificationPath(router, route.fullPath)
}

const currentUser = {
  name: '王志强',
  role: '项目负责人',
  avatar: 'https://i.pravatar.cc/80?img=47'
}

// AI项目建议弹窗
const showAiSuggestionModal = ref(false)
const showTaskBreakdownModal = ref(false)

// AI智能分配建议弹窗（已废弃，改用看板分析）
const showAiAllocationModal = ref(false)
const showManualAdjustModal = ref(false)

// AI看板分析弹窗
const showKanbanAnalysisModal = ref(false)

// 风险报告弹窗
const showRiskReportModal = ref(false)

// 风险报告数据
const riskReportData = computed(() => {
  return {
    projectName: project.value.name,
    reportDate: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
    overview: {
      totalRisks: 17,
      highRisk: 6,
      mediumRisk: 11,
      stability: 81,
      status: '仍可控'
    },
    executiveSummary: '当前项目整体稳定度为 81%，处于「仍可控」状态。本周新增高危任务 2 项，与上周持平。资源冲突预警显示周三和周五存在潜在资源冲突风险，建议提前协调。',
    riskBreakdown: [
      { level: '高危', count: 6, trend: '+2', trendType: 'up', items: ['联调环境参数回灌阻塞', '样本误差回归验证超时风险', '测试环境配置未完成', '日志补录任务延迟', '基线对比视图同步', '性能指标未达标'] },
      { level: '中度预警', count: 11, trend: '持平', trendType: 'stable', items: ['文档更新滞后', '接口联调等待', '数据准备延迟', '测试用例编写中', '环境准备中', '评审待安排'] }
    ],
    keyFindings: [
      {
        id: 1,
        title: '资源冲突预警',
        severity: 'high',
        content: '周三存在「联调环境参数回灌」与「样本误差回归验证」共享同一测试窗口的资源冲突，预测概率 92%，可能造成 0.8 天额外延迟。',
        recommendation: '建议将「日志补录」任务临时调配给 QA 协作成员，并提前冻结周三的联调资源窗口。'
      },
      {
        id: 2,
        title: '阻塞任务堆积',
        severity: 'medium',
        content: '当前有 2 个任务处于阻塞状态超过 24 小时，阻塞原因主要是测试环境配置未完成。',
        recommendation: '协调平台组优先完成测试环境配置，确保阻塞任务尽快解除。'
      },
      {
        id: 3,
        title: '临近截止任务',
        severity: 'medium',
        content: '「样本误差回归验证」任务预计今天完成，但当前进度仅 48%，存在超时风险。',
        recommendation: '增加资源投入或协调调整截止时间。'
      }
    ],
    heatmapSummary: {
      highConflictDays: ['周三', '周五'],
      warning: '周三和周五存在较高资源冲突风险，建议重点关注'
    },
    recommendations: [
      { id: 1, action: '优先解决测试环境配置问题，解除阻塞任务' },
      { id: 2, action: '协调 QA 资源支持联调任务' },
      { id: 3, action: '重新评估「样本误差回归验证」任务的截止时间' },
      { id: 4, action: '提前冻结周三联调资源窗口' },
      { id: 5, action: '设置每日风险同步例会，跟踪阻塞问题' }
    ],
    conclusion: '综合评估：项目当前处于可控状态，但存在资源分配和任务阻塞问题。建议立即协调解决测试环境配置，优先处理阻塞任务，并进行适当的资源调配。整体风险等级：中等。'
  }
})

// 看板分析数据
const kanbanAnalysisData = computed(() => {
  return {
    projectName: project.value.name,
    summary: '基于当前看板状态的AI分析报告',
    overview: {
      totalTasks: 12,
      completedTasks: 3,
      inProgressTasks: 4,
      blockedTasks: 2,
      pendingTasks: 3,
      completionRate: '25%',
      blockedRate: '17%'
    },
    insights: [
      {
        id: 1,
        type: 'warning',
        title: '阻塞任务预警',
        content: '「联调环境参数回灌」任务已阻塞超过 24 小时，阻塞原因是测试环境配置未完成。建议优先协调平台组完成环境准备。',
        impact: '可能导致联调验证阶段延迟 0.6 天'
      },
      {
        id: 2,
        type: 'info',
        title: '任务分布不均',
        content: '陈思远当前负载高达 91%，负责 7 个任务；而赵扬仅负责 2 个任务，负载仅 35%。建议考虑任务再分配。',
        impact: '负载均衡后预计可提升整体效率 15%'
      },
      {
        id: 3,
        type: 'success',
        title: '良好进展',
        content: '「晶格样本归一化策略更新」已提前完成并同步至基线对比视图，为后续联调打下良好基础。',
        impact: '提前完成可释放部分测试资源'
      },
      {
        id: 4,
        type: 'warning',
        title: '临近截止任务',
        content: '「样本误差回归验证」任务预计今天完成，但当前进度仅 48%，存在超时风险。',
        impact: '建议增加资源投入或调整截止时间'
      }
    ],
    recommendations: [
      { id: 1, title: '优先处理阻塞任务', action: '协调平台组优先完成测试环境配置' },
      { id: 2, title: '任务再分配', action: '将部分任务从陈思远调整至赵扬' },
      { id: 3, title: '增加回归验证资源', action: '安排额外 QA 资源支持样本验证' },
      { id: 4, title: '设置每日阻塞例会', action: '每天同步阻塞问题解决进展' }
    ],
    conclusion: '综合评估：当前项目整体可控，但存在资源分配不均和阻塞任务问题。建议优先解决阻塞任务，并进行适当的任务再分配以平衡负载。'
  }
})

// AI智能分配建议数据
const aiAllocationData = computed(() => {
  return {
    projectName: project.value.name,
    summary: 'AI 基于成员负载和任务特性分析，建议如下人员调配方案：',
    suggestions: [
      {
        id: 1,
        taskName: '联调回灌日志补录',
        fromMember: '陈思远',
        toMember: '王雅婷',
        fromDept: '平台组',
        toDept: 'QA',
        confidence: '91%',
        reason: '王雅婷当前负载较低（58%），且具备回归验证经验，适合接手日志补录工作。',
        impact: '预计可减少 0.4 天等待时间'
      },
      {
        id: 2,
        taskName: '测试环境参数冻结',
        fromMember: '陈思远',
        toMember: '赵扬',
        fromDept: '平台组',
        toDept: '平台组',
        confidence: '86%',
        reason: '赵扬负责配置维护，对测试环境更熟悉，且当前任务量较少（2个任务）。',
        impact: '预计可提前 0.3 天完成'
      }
    ],
    overallImpact: '综合调整后，预计可将联调验证阶段的偏差从 2 天压缩至 1.3 天。'
  }
})

// 采纳分配建议
const adoptAllocation = () => {
  showToast('分配建议已采纳', 'AI 智能分配建议已应用，相关任务负责人已更新。', 'check_circle')
  showAiAllocationModal.value = false
}

// AI项目建议数据（根据当前项目信息生成）
const aiSuggestions = computed(() => {
  return {
    projectName: project.value.name,
    summary: `基于项目「${project.value.name}」的当前状态（进度${project.value.progress}%），AI 分析后提供以下优化建议：`,
    suggestions: [
      {
        id: 1,
        title: '任务拆分优化',
        content: '建议将「数据回灌校验」拆分为独立子任务，便于并行执行和进度追踪。',
        confidence: '置信度 94%',
        impact: '预计可缩短 0.8 天'
      },
      {
        id: 2,
        title: '资源调配建议',
        content: '从平台组借调 1 名 QA 参与联调，提升测试覆盖度和问题发现效率。',
        confidence: '置信度 89%',
        impact: '预计可将偏差从 2 天压缩至 1.2 天'
      },
      {
        id: 3,
        title: '风险预警',
        content: '联调环境参数回灌与样本误差回归验证共用测试窗口，周三将出现资源冲突。',
        confidence: '置信度 92%',
        impact: '可能造成 0.6 天额外延迟'
      },
      {
        id: 4,
        title: '进度优化',
        content: '提前释放算力资源，压缩联调窗口，可追回 0.8 天进度。',
        confidence: '置信度 87%',
        impact: '将偏差控制在 1.2 天内'
      }
    ],
    conclusion: '综合评估：当前项目整体可控，建议优先处理联调资源冲突问题。'
  }
})

// 任务拆解数据
const taskBreakdown = computed(() => {
  return {
    projectName: project.value.name,
    totalTasks: 12,
    breakdown: [
      {
        phase: '数据回灌校验',
        tasks: [
          { name: '联调环境参数回灌', status: '进行中', progress: 62, assignee: '陈思远', priority: 'P0' },
          { name: '样本误差回归验证', status: '进行中', progress: 48, assignee: '王雅婷', priority: 'P1' },
          { name: '测试环境配置冻结', status: '待开始', progress: 0, assignee: '赵扬', priority: 'P1' }
        ]
      },
      {
        phase: '开发实现',
        tasks: [
          { name: '回归样本对齐', status: '进行中', progress: 85, assignee: '韩诚', priority: 'P1' },
          { name: '异常样本校验', status: '待开始', progress: 0, assignee: '韩诚', priority: 'P2' },
          { name: '晶格样本归一化', status: '已完成', progress: 100, assignee: '韩诚', priority: 'P2' }
        ]
      },
      {
        phase: '联调验证',
        tasks: [
          { name: '联调验证清单整理', status: '待开始', progress: 0, assignee: '赵扬', priority: 'P2' },
          { name: '联调回灌日志补录', status: '待开始', progress: 0, assignee: '王雅婷', priority: 'P1' },
          { name: '测试环境参数冻结', status: '待开始', progress: 0, assignee: '赵扬', priority: 'P1' }
        ]
      },
      {
        phase: '上线验收',
        tasks: [
          { name: '上线部署', status: '待开始', progress: 0, assignee: '周雅楠', priority: 'P0' },
          { name: '验收测试', status: '待开始', progress: 0, assignee: '王雅婷', priority: 'P1' },
          { name: '文档归档', status: '待开始', progress: 0, assignee: '陈思远', priority: 'P3' }
        ]
      }
    ]
  }
})

// 一键采纳AI建议
const adoptSuggestion = () => {
  showToast('建议已采纳', 'AI 项目建议已应用到项目计划中，相关任务已自动更新。', 'check_circle')
  showAiSuggestionModal.value = false
}

// 使用共享的项目数据
const { projects } = useProjects()

// 根据项目ID获取项目详情
const project = computed(() => {
  const id = parseInt(projectId.value)
  const found = projects.value.find(p => p.id === id)
  if (found) {
    return {
      name: found.name,
      owner: found.owner.name,
      desc: `聚焦晶体结构稳定性与模型预测精度提升，当前处于“联调验证”阶段。项目已建立最新计划基线，AI 判断存在轻度进度偏差，但整体健康可控。`,
      range: '04/14 - 05/16',
      progress: found.progress,
      health: found.health,
      priority: found.priority,
      members: found.memberCount
    }
  }
  return {
    name: '项目不存在',
    owner: '-',
    desc: '',
    range: '-',
    progress: 0,
    health: '未知',
    priority: 'P2',
    members: 0
  }
})

// 获取优先级对应的样式类
const getPriorityClass = (priority) => {
  const classMap = {
    'P0': 'priority-p0',
    'P1': 'priority-p1',
    'P2': 'priority-p2'
  }
  return classMap[priority] || 'priority-p2'
}

const milestones = ref([
  { id: 1, title: '需求评审', desc: '已完成。需求评审结论与实验约束已沉淀到项目文档，关联任务已自动拆解。', color: 'var(--color-secondary-600)', meta: '完成日期：04-18' },
  { id: 2, title: '开发实现', desc: '已完成 90%，剩余为性能对齐与异常样本校验，开发任务总体提前半天收敛。', color: 'var(--color-secondary-600)', meta: '最新更新时间：昨天 21:18' },
  { id: 3, title: '联调验证', desc: '相对基线延后 2 天。主要原因是数据回灌链路与测试环境准备时间重叠。', color: 'var(--color-warning-600)', meta: '偏差：+2 天' },
  { id: 4, title: '上线验收', desc: '待开始。当前仍可通过提前释放算力与压缩联调窗口追回 0.8 天。', color: 'rgba(114,119,133,0.7)', meta: '计划开始：05-12' }
])

const weekTasks = ref([
  { id: 1, title: '完成回归样本对齐与误差校验', note: '负责人：韩诚 · 预计今天完成', icon: 'lab_profile', iconClass: '', pillClass: 'pill-warning', status: '进行中' },
  { id: 2, title: '联调环境参数回灌', note: '阻塞原因：测试环境配置未完成', icon: 'block', iconClass: 'pending', pillClass: 'pill-danger', status: '已阻塞' },
  { id: 3, title: '完成晶格样本归一化策略更新', note: '已同步至基线对比视图', icon: 'check', iconClass: 'done', pillClass: 'pill-success', status: '已完成' }
])

const loads = ref([
  { name: '平台组', value: 86, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))' },
  { name: '材料组', value: 72, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700))' },
  { name: 'QA', value: 54, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))' }
])

const memberList = ref([
  { id: 1, name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47', dept: '材料科学部', role: '负责人', badge: 'pm', badgeLabel: 'PM', joinClass: 'pill-success', joinStatus: '已加入', tasks: 6, estimate: '5.5d', load: 82, loadClass: 'warning' },
  { id: 2, name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22', dept: '平台组', role: '联调负责人', badge: 'dev', badgeLabel: '研发', joinClass: 'pill-success', joinStatus: '已加入', tasks: 7, estimate: '6.0d', load: 91, loadClass: 'danger' },
  { id: 3, name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33', dept: 'QA', role: '回归验证', badge: 'qa', badgeLabel: 'QA', joinClass: 'pill-success', joinStatus: '已加入', tasks: 4, estimate: '3.5d', load: 58, loadClass: 'success' },
  { id: 4, name: '赵扬', avatar: 'https://i.pravatar.cc/80?img=12', dept: '平台组', role: '配置维护', badge: 'dev', badgeLabel: '研发', joinClass: 'pill-warning', joinStatus: '待接受', tasks: 2, estimate: '1.5d', load: 35, loadClass: 'neutral' }
])

const inviteSteps = ref([
  { title: '选择成员', desc: '通过组织架构树或搜索选择要加入项目的成员。', color: 'var(--color-primary-600)' },
  { title: '发送邀请', desc: '系统会同步站内消息与企微/钉钉通知。', color: 'var(--color-warning-600)' },
  { title: '接受并加入', desc: '成员接受邀请后自动加入项目权限组。', color: 'var(--color-secondary-600)' }
])

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const heatmap = ref([
  { name: '王志强', cells: [2, 4, 5, 4, 3, 1, 0] },
  { name: '陈思远', cells: [3, 5, 5, 4, 3, 1, 0] },
  { name: '王雅婷', cells: [1, 2, 3, 2, 2, 1, 0] },
  { name: '赵扬', cells: [0, 1, 2, 2, 1, 0, 0] }
])

// 筛选状态
const activeFilter = ref('all')

// 当前优先级筛选值（P0/P1/P2循环）
const currentPriority = ref('')

// 原始看板数据
const kanbanData = ref([
  { name: '待开始', pillClass: 'pill-neutral', cards: [
    { title: '整理联调验证清单', tags: [{ text: 'P2', class: 'p2' }, { text: '里程碑' }], note: '负责人：赵扬 · 预估工时 1.5d' },
    { title: '补充异常样本说明', tags: [{ text: 'P3', class: 'p3' }], note: '负责人：韩诚 · 截止：周四' }
  ]},
  { name: '进行中', pillClass: 'pill-neutral', cards: [
    { title: '联调环境参数回灌', tags: [{ text: 'P0', class: 'p0' }, { text: '依赖平台组' }], note: '负责人：陈思远 · 进度 62%' },
    { title: '样本误差回归验证', tags: [{ text: 'P1', class: 'p1' }, { text: 'PBC' }], note: '负责人：王雅婷 · 进度 48%' }
  ]},
  { name: '待评审', pillClass: 'pill-neutral', cards: [
    { title: '晶格归一化策略更新', tags: [{ text: 'P1', class: 'p1' }, { text: '需 QA 确认' }], note: '负责人：林初夏 · 截止 今天 18:00' },
    { title: '模型输出字段映射表', tags: [{ text: 'P2', class: 'p2' }], note: '负责人：韩诚 · 进度 90%' }
  ]},
  { name: '已完成', pillClass: 'pill-neutral', cards: [
    { title: '需求评审结论归档', tags: [{ text: 'P2', class: 'p2' }, { text: '完成' }], note: '负责人：王志强 · 已自动同步日报' },
    { title: '开发任务拆解确认', tags: [{ text: 'P3', class: 'p3' }], note: '负责人：陈思远 · 已绑定基线' }
  ]},
  { name: '已阻塞', pillClass: 'pill-danger', style: 'background:rgba(255,235,233,0.34);border-color:rgba(216,58,52,0.18);', cards: [
    { title: '测试环境参数冻结', tags: [{ text: 'P0', class: 'p0' }, { text: '阻塞', style: 'color:var(--color-danger-600);background:rgba(255,218,214,0.82);' }], note: '阻塞原因：环境配置窗口未确认' },
    { title: '联调回灌日志补录', tags: [{ text: 'P1', class: 'p1' }], note: '阻塞依赖：测试环境参数冻结' }
  ]}
])

// 设置筛选
const setFilter = (filter) => {
  activeFilter.value = filter
}

// 优先级循环切换
const priorityOrder = ['P0', 'P1', 'P2']
const togglePriorityFilter = () => {
  if (activeFilter.value !== 'priority') {
    // 第一次点击，显示P0
    activeFilter.value = 'priority'
    currentPriority.value = 'P0'
  } else {
    // 循环切换：P0 -> P1 -> P2 -> P0...
    const currentIndex = priorityOrder.indexOf(currentPriority.value)
    const nextIndex = (currentIndex + 1) % priorityOrder.length
    currentPriority.value = priorityOrder[nextIndex]
  }
}

// 报表时间筛选
const reportTimeFilter = ref('30days')
const setReportTimeFilter = (filter) => {
  reportTimeFilter.value = filter
  updateSummary()
}

// 报表类型
const reportType = ref('progress')
const setReportType = (type) => {
  reportType.value = type
  updateSummary()
}

// AI摘要内容
const aiSummaryTitle = ref('本周团队效率提升 12%，但联调节点仍是唯一主风险源。')
const aiSummaryContent = ref('AI 综合燃尽图、成员负载与 Bug 趋势后判断：当前项目整体可控，主要问题集中在联调准备时间与测试环境冻结。建议下周优先协调平台组与 QA 的时间窗口，并提前生成周报草稿给相关成员确认。')

// 反馈相关
const feedbackType = ref('')
const feedbackCount = ref({ like: 12, dislike: 3 })
const submitFeedback = (type) => {
  if (feedbackType.value === type) {
    // 再次点击取消反馈
    feedbackType.value = ''
    feedbackCount.value[type]--
  } else {
    // 切换反馈类型
    if (feedbackType.value) {
      feedbackCount.value[feedbackType.value]--
    }
    feedbackType.value = type
    feedbackCount.value[type]++
  }
}

// 归档项目相关
const showArchiveModal = ref(false)
const archiveConfirm = ref(false)

const archiveProject = () => {
  if (!archiveConfirm.value) {
    showToast('提示', '请先确认归档操作', 'info')
    return
  }
  
  showToast('成功', '项目已归档', 'check_circle')
  showArchiveModal.value = false
  archiveConfirm.value = false
}

// 设置基线相关
const showBaselineModal = ref(false)
const baselineName = ref('')

// 历史基线列表
const baselineHistory = ref([
  {
    id: 1,
    name: 'V1.0 初始基线',
    date: '2024-04-14 10:00',
    creator: '王志强',
    tasks: 28,
    status: '已激活'
  },
  {
    id: 2,
    name: 'V1.1 需求评审后',
    date: '2024-04-18 16:30',
    creator: '陈思远',
    tasks: 32,
    status: '已过期'
  },
  {
    id: 3,
    name: 'V1.2 开发完成',
    date: '2024-05-05 09:00',
    creator: '王志强',
    tasks: 35,
    status: '已过期'
  }
])

const createBaseline = () => {
  if (!baselineName.value.trim()) {
    showToast('提示', '请输入基线名称', 'info')
    return
  }
  
  baselineHistory.value.unshift({
    id: Date.now(),
    name: baselineName.value,
    date: new Date().toLocaleString('zh-CN'),
    creator: '张工',
    tasks: 38,
    status: '已激活'
  })
  
  // 将之前的激活状态改为过期
  baselineHistory.value.forEach((item, index) => {
    if (index > 0 && item.status === '已激活') {
      item.status = '已过期'
    }
  })
  
  baselineName.value = ''
  showBaselineModal.value = false
  showToast('成功', '基线已创建', 'check_circle')
}

// 项目建议相关
const showAddSuggestionModal = ref(false)
const showSuggestionsModal = ref(false)
const newSuggestion = ref('')

// 项目建议列表数据
const projectSuggestions = ref([
  {
    id: 1,
    content: '建议增加每日站会，同步阻塞问题进展，提高团队协作效率。',
    author: '陈思远',
    time: '2024-01-15 10:30',
    likes: 5
  },
  {
    id: 2,
    content: '测试环境配置经常成为瓶颈，建议提前准备备用环境。',
    author: '王雅婷',
    time: '2024-01-14 14:20',
    likes: 8
  },
  {
    id: 3,
    content: '联调阶段任务分配不均，建议根据成员负载动态调整。',
    author: '王志强',
    time: '2024-01-13 09:15',
    likes: 12
  },
  {
    id: 4,
    content: '建议每周五下午进行项目复盘，总结本周问题和改进点。',
    author: '赵扬',
    time: '2024-01-12 16:45',
    likes: 3
  }
])

// 添加新建议
const addSuggestion = () => {
  if (!newSuggestion.value.trim()) {
    showToast('提示', '请输入建议内容', 'info')
    return
  }
  
  projectSuggestions.value.unshift({
    id: Date.now(),
    content: newSuggestion.value,
    author: '张工',
    time: new Date().toLocaleString('zh-CN'),
    likes: 0
  })
  
  newSuggestion.value = ''
  showAddSuggestionModal.value = false
  showToast('成功', '建议已提交', 'check_circle')
}

// 点赞建议
const likeSuggestion = (suggestion) => {
  suggestion.likes++
}

// 导出Markdown
const exportMarkdown = () => {
  const markdown = `# 项目周报：${projectName.value}

## AI 洞察摘要
${aiSummaryTitle.value}

${aiSummaryContent.value}

## 燃尽图趋势
- 实际剩余工作量持续下降，整体符合预期

## 工时分布
${barChartData.value.map(item => `- ${item.name}: ${item.h}%`).join('\n')}

## Bug 趋势
- 新增 Bug 数量呈下降趋势
- 关闭率持续提升

---
*生成时间：${new Date().toLocaleDateString('zh-CN')}*`

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName.value}_周报.md`
  a.click()
  URL.revokeObjectURL(url)
}

// 更新摘要内容
const updateSummary = () => {
  const summaries = {
    '30days': {
      title: '近30天团队效率提升 8%，项目整体健康度维持良好。',
      content: 'AI 综合分析近30天数据：燃尽曲线正常下降，成员负载合理，Bug 收敛趋势良好。建议继续保持当前节奏，重点关注联调节点的资源协调。'
    },
    'week': {
      title: '本周团队效率提升 12%，但联调节点仍是唯一主风险源。',
      content: 'AI 综合燃尽图、成员负载与 Bug 趋势后判断：当前项目整体可控，主要问题集中在联调准备时间与测试环境冻结。建议下周优先协调平台组与 QA 的时间窗口。'
    }
  }
  const summary = summaries[reportTimeFilter.value] || summaries['30days']
  aiSummaryTitle.value = summary.title
  aiSummaryContent.value = summary.content
}

// 检查卡片是否符合筛选条件
const filterCard = (card) => {
  const priorityTags = card.tags.map(t => t.text)
  const hasMilestone = priorityTags.includes('里程碑')
  const hasBlocked = priorityTags.includes('阻塞')
  const hasWeekDeadline = card.note.includes('今天') || card.note.includes('本周') || card.note.includes('周三') || card.note.includes('周五') || card.note.includes('周四')

  switch (activeFilter.value) {
    case 'priority':
      return priorityTags.includes(currentPriority.value)
    case 'week':
      return hasWeekDeadline
    case 'blocked':
      return hasBlocked
    case 'milestone':
      return hasMilestone
    default:
      return true
  }
}

// 筛选后的看板数据
const kanbanCols = computed(() => {
  return kanbanData.value.map(col => {
    const filteredCards = col.cards.filter(filterCard)
    return {
      ...col,
      count: filteredCards.length,
      cards: filteredCards
    }
  })
})

// 统计数据
const totalTasks = computed(() => {
  return kanbanCols.value.reduce((sum, col) => sum + col.count, 0)
})

const blockedTasks = computed(() => {
  const blockedCol = kanbanCols.value.find(col => col.name === '已阻塞')
  return blockedCol ? blockedCol.count : 0
})

const flowRules = ref([
  { rule: '待开始不可直接完成', desc: '必须先进入进行中或待评审', notify: '无' },
  { rule: '标记阻塞需填写原因', desc: '必须补充阻塞文本，并可关联阻塞依赖任务', notify: '通知创建者与 PM' },
  { rule: '任务完成通知', desc: '任务变更为已完成时自动触发', notify: '通知创建者' }
])

// 甘特图视图模式
const ganttViewMode = ref('week')

// 甘特图显示选项
const showBaseline = ref(true)
const showDependencies = ref(false)
const ganttZoom = ref(1)

// 滑动条状态
const scrollPosition = ref(0)
const viewportWidth = ref(60) // 可视区域占总宽度的百分比
const isDragging = ref(false)
const layoutWrapperRef = ref(null)

// 视图模式切换
const setGanttView = (mode) => {
  ganttViewMode.value = mode
  // 按周和按日显示详细时间点，按月只显示三个月三等分
  switch (mode) {
    case 'day':
      ganttDates.value = ['04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '04/21', '04/22', '04/23']
      break
    case 'week':
      ganttDates.value = ['04/14', '04/21', '04/28', '05/05']
      break
    case 'month':
      ganttDates.value = ['四月', '五月', '六月']
      break
  }
}

// 基线显示切换
const toggleBaseline = () => {
  showBaseline.value = !showBaseline.value
}

// 依赖关系显示切换
const toggleDependencies = () => {
  showDependencies.value = !showDependencies.value
}

// 放大
const zoomIn = () => {
  if (ganttZoom.value < 2) {
    ganttZoom.value += 0.25
  }
}

// 缩小
const zoomOut = () => {
  if (ganttZoom.value > 0.5) {
    ganttZoom.value -= 0.25
  }
}

// 同步滚动位置到滑动条
const syncScrollPosition = () => {
  if (!layoutWrapperRef.value) return
  const wrapper = layoutWrapperRef.value
  const maxScroll = wrapper.scrollWidth - wrapper.clientWidth
  if (maxScroll > 0) {
    scrollPosition.value = (wrapper.scrollLeft / maxScroll) * (100 - viewportWidth.value)
  }
}

// 滑动条拖拽开始
const startDrag = (e) => {
  isDragging.value = true
  const track = e.target.parentElement
  const trackRect = track.getBoundingClientRect()
  const startX = e.clientX
  const startLeft = parseFloat(e.target.style.left)
  
  const onMouseMove = (e) => {
    if (!isDragging.value) return
    const deltaX = e.clientX - startX
    const deltaPercent = (deltaX / trackRect.width) * 100
    let newPosition = startLeft + deltaPercent
    newPosition = Math.max(0, Math.min(100 - viewportWidth.value, newPosition))
    scrollPosition.value = newPosition
    
    // 更新甘特图滚动
    if (layoutWrapperRef.value) {
      const wrapper = layoutWrapperRef.value
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth
      wrapper.scrollLeft = (scrollPosition.value / (100 - viewportWidth.value)) * maxScroll
    }
  }
  
  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 点击滑动条跳转
const jumpToPosition = (e) => {
  if (isDragging.value) return
  const track = e.currentTarget
  const trackRect = track.getBoundingClientRect()
  const clickX = e.clientX - trackRect.left
  const clickPercent = (clickX / trackRect.width) * 100
  let newPosition = clickPercent - viewportWidth.value / 2
  newPosition = Math.max(0, Math.min(100 - viewportWidth.value, newPosition))
  scrollPosition.value = newPosition
  
  // 更新甘特图滚动
  if (layoutWrapperRef.value) {
    const wrapper = layoutWrapperRef.value
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth
    wrapper.scrollLeft = (scrollPosition.value / (100 - viewportWidth.value)) * maxScroll
  }
}

// 甘特图日期（响应式）- 三个月三等分
const ganttDates = ref(['四月', '五月', '六月'])

// 甘特图数据（三个月三等分排布）
// baseLeft/baseWidth 表示原始计划（基线），barLeft/barWidth 表示实际进度
const ganttData = ref([
  { name: '需求评审', owner: '王志强', baseLeft: '5%', baseWidth: '25%', barLeft: '5%', barWidth: '28%', barClass: 'blue', progress: 100 },
  { name: '开发实现', owner: '韩诚', baseLeft: '35%', baseWidth: '30%', barLeft: '38%', barWidth: '28%', barClass: 'purple', progress: 75 },
  { name: '联调验证', owner: '陈思远', baseLeft: '40%', baseWidth: '30%', barLeft: '45%', barWidth: '25%', barClass: 'red', progress: 45 },
  { name: '上线验收', owner: '周雅楠', baseLeft: '75%', baseWidth: '20%', barLeft: '80%', barWidth: '15%', barClass: 'green', progress: 15 }
])

// 获取进度样式类
const getProgressClass = (progress) => {
  if (progress >= 90) return 'progress-done'
  if (progress >= 50) return 'progress-active'
  if (progress > 0) return 'progress-started'
  return 'progress-pending'
}

// 获取依赖关系连接线（简化实现）
const getConnectors = (taskName) => {
  const connections = {
    '开发实现': [{ style: { left: '2%', top: '-20px', width: '18%', borderTop: '2px dashed #9ca3af' } }],
    '联调验证': [{ style: { left: '20%', top: '-20px', width: '30%', borderTop: '2px dashed #9ca3af' } }],
    '上线验收': [{ style: { left: '53%', top: '-20px', width: '21%', borderTop: '2px dashed #9ca3af' } }]
  }
  return connections[taskName] || []
}

const heatmapBlocks = ref([
  { bg: 'rgba(173,198,255,0.18)' }, { bg: 'rgba(173,198,255,0.34)' }, { bg: 'rgba(79,143,246,0.86)', shadow: '0 14px 28px rgba(79,143,246,0.28)' },
  { bg: 'rgba(173,198,255,0.30)' }, { bg: 'rgba(10,48,124,0.86)', shadow: '0 14px 28px rgba(10,48,124,0.24)' }, { bg: 'rgba(173,198,255,0.20)' }, { bg: 'rgba(173,198,255,0.18)' },
  { bg: 'rgba(79,143,246,0.36)' }, { bg: 'rgba(10,48,124,0.86)', shadow: '0 14px 28px rgba(10,48,124,0.24)' }, { bg: 'rgba(79,143,246,0.42)' },
  { bg: 'rgba(173,198,255,0.26)' }, { bg: 'rgba(79,143,246,0.34)' }, { bg: 'rgba(173,198,255,0.16)' }, { bg: 'rgba(173,198,255,0.18)' },
  { bg: 'rgba(173,198,255,0.30)' }, { bg: 'rgba(79,143,246,0.46)' }, { bg: 'rgba(35,82,207,0.92)', shadow: '0 14px 28px rgba(35,82,207,0.22)' },
  { bg: 'rgba(173,198,255,0.24)' }, { bg: 'rgba(79,143,246,0.36)' }, { bg: 'rgba(173,198,255,0.16)' }, { bg: 'rgba(173,198,255,0.18)' }
])

const riskInsights = ref([
  { title: '预测 · 概率 92%', desc: '由于“联调环境参数回灌”与“样本误差回归验证”共用同一测试窗口，周三将出现成员冲突，可能造成 0.6 天额外延迟。' },
  { title: '建议 · 可一键采纳', desc: '建议将“日志补录”任务临时调配给 QA 协作成员，并提前冻结周三的联调资源窗口。' }
])

const riskTasks = ref([
  { name: '联调环境参数回灌', level: '极高', levelClass: 'pill-danger', factor: '环境准备冲突', block: 68, barColor: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', owner: '陈思远' },
  { name: '样本误差回归验证', level: '中等', levelClass: 'pill-warning', factor: '算力窗口拥堵', block: 42, barColor: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', owner: '王雅婷' },
  { name: '测试环境参数冻结', level: '高危', levelClass: 'pill-danger', factor: '阻塞依赖未解除', block: 16, barColor: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', owner: '赵扬' }
])

const burnPoints = ref([
  { a: 74, b: 78 }, { a: 66, b: 70 }, { a: 58, b: 61 }, { a: 51, b: 54 },
  { a: 45, b: 42 }, { a: 36, b: 31 }, { a: 29, b: 22 }, { a: 21, b: 14 }
])

const barChartData = ref([
  { name: '王志强', h: 82, gradient: 'linear-gradient(180deg, var(--color-primary-400), var(--color-primary-700))' },
  { name: '陈思远', h: 92, gradient: 'linear-gradient(180deg, #f7c455, var(--color-warning-600))' },
  { name: '王雅婷', h: 58, gradient: 'linear-gradient(180deg, #38c59b, var(--color-secondary-600))' },
  { name: '赵扬', h: 36, gradient: 'linear-gradient(180deg, #a871ff, var(--color-tertiary-600))' }
])

// 进度报表数据
const progressBarData = ref([
  { name: '待开发', h: 25, gradient: 'linear-gradient(180deg, var(--color-text-secondary), var(--color-text-tertiary))' },
  { name: '开发中', h: 45, gradient: 'linear-gradient(180deg, var(--color-primary-400), var(--color-primary-700))' },
  { name: '测试中', h: 65, gradient: 'linear-gradient(180deg, #f7c455, var(--color-warning-600))' },
  { name: '已完成', h: 88, gradient: 'linear-gradient(180deg, #38c59b, var(--color-secondary-600))' }
])

// 工时分布数据
const hoursDistribution = ref([
  { label: '周一', w: 85, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '7.2h' },
  { label: '周二', w: 92, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '8.1h' },
  { label: '周三', w: 78, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '6.8h' },
  { label: '周四', w: 88, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '7.6h' },
  { label: '周五', w: 72, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '6.3h' },
  { label: '周六', w: 45, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '3.2h' }
])

// 里程碑数据
const milestoneData = ref([
  { label: '需求评审', w: 100, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', status: '已完成' },
  { label: '架构设计', w: 100, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', status: '已完成' },
  { label: '开发完成', w: 85, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', status: '进行中' },
  { label: '测试验收', w: 40, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', status: '进行中' },
  { label: '上线部署', w: 10, gradient: 'linear-gradient(90deg, var(--color-text-tertiary), var(--color-text-secondary))', status: '待开始' }
])

// 进度偏差数据
const deviationData = ref([
  { name: '需求阶段', plan: 100, actual: 100, gradient: 'linear-gradient(180deg, #38c59b, var(--color-secondary-600))' },
  { name: '设计阶段', plan: 100, actual: 95, gradient: 'linear-gradient(180deg, #38c59b, var(--color-secondary-600))' },
  { name: '开发阶段', plan: 75, actual: 65, gradient: 'linear-gradient(180deg, var(--color-primary-400), var(--color-primary-600))' },
  { name: '测试阶段', plan: 40, actual: 25, gradient: 'linear-gradient(180deg, #f7c455, var(--color-warning-600))' }
])

// 资源利用率数据
const resourceUtilization = ref([
  { label: '王志强', w: 88, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', status: '高负荷', statusClass: 'text-warning' },
  { label: '陈思远', w: 72, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', status: '正常', statusClass: 'text-primary' },
  { label: '王雅婷', w: 65, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', status: '正常', statusClass: 'text-primary' },
  { label: '赵扬', w: 45, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', status: '低负荷', statusClass: 'text-secondary' }
])

// 预算执行数据
const budgetData = ref([
  { label: '人力成本', w: 68, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '¥12.5万' },
  { label: '服务器费用', w: 45, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', val: '¥3.2万' },
  { label: '第三方服务', w: 82, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', val: '¥8.8万' },
  { label: '培训费用', w: 25, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', val: '¥1.5万' }
])

// 风险数据
const riskData = ref([
  { label: '技术复杂度', w: 75, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', level: '中', levelClass: 'text-warning' },
  { label: '需求变更', w: 45, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', level: '低', levelClass: 'text-primary' },
  { label: '资源不足', w: 60, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', level: '中', levelClass: 'text-warning' },
  { label: '时间压力', w: 85, gradient: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', level: '高', levelClass: 'text-danger' }
])

// 缺陷密度数据
const defectDensity = ref([
  { label: '前端模块', w: 32, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', val: '0.8/KLOC' },
  { label: '后端模块', w: 45, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))', val: '1.2/KLOC' },
  { label: 'API接口', w: 28, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', val: '0.5/KLOC' },
  { label: '数据库层', w: 58, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', val: '1.5/KLOC' }
])

const bugPoints = ref([
  { a: 48, b: 18 }, { a: 58, b: 25 }, { a: 44, b: 36 }, { a: 39, b: 42 },
  { a: 31, b: 46 }, { a: 22, b: 41 }, { a: 18, b: 33 }, { a: 13, b: 28 }
])

const miniBars = ref([
  { label: '联调环境', w: 78, gradient: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', val: '31h' },
  { label: '样本验证', w: 52, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', val: '19h' },
  { label: '平台组负载', w: 91, gradient: 'linear-gradient(90deg, #a871ff, var(--color-tertiary-600))', val: '91%' },
  { label: 'QA 负载', w: 58, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', val: '58%' }
])

const docList = ref([
  { title: '需求评审纪要', desc: '记录需求边界、时间计划和依赖说明，供 PM、研发与 QA 对齐使用。', pill: '最新版本', pillClass: 'pill-success', metaLabel: '更新时间', metaValue: '今天 10:40' },
  { title: '联调验证说明', desc: '包含当前联调阶段的前置条件、关键风险和任务引用，可自动生成摘要。', pill: 'AI 摘要', pillClass: 'pill-ai', metaLabel: '标签', metaValue: '联调 / 风险' },
  { title: '回归样本池说明', desc: '当前文档仅存在占位，建议下一轮把样本来源、版本和映射关系整理进来。', pill: '待补充', pillClass: 'pill-warning', metaLabel: '责任人', metaValue: 'QA 组' }
])

const isEditModalOpen = ref(false)
const isAiDrawerOpen = ref(false)

const toast = ref({ show: false, title: '', message: '', icon: '' })
const showToast = (title, message, icon) => {
  toast.value = { show: true, title, message, icon }
  setTimeout(() => toast.value.show = false, 3000)
}

const editForm = ref({
  name: '纳米晶体结构优化', code: 'MAT-2026-0414', template: '需求迭代模板', owner: '王志强', team: '材料科学部',
  start: '2026-04-14', end: '2026-05-16', stage: '联调验证', health: '良好', progress: '72%',
  note: '当前阶段集中处理联调验证中的时间偏差与资源窗口冲突，目标是在保持健康度稳定的前提下追回 0.8 天进度。',
  members: '王志强、陈思远、王雅婷、赵扬', subscribers: 'PM、QA、平台主管',
  bio: '聚焦晶体结构稳定性与模型预测精度提升，当前项目以需求迭代模板推进，覆盖概览、成员、看板、甘特、风险与报表多个展示页。'
})

const editNotes = ref([
  { title: '优先同步基线与时间窗', desc: '建议将联调验证的偏差说明写入项目摘要，避免首页卡片、甘特页和风险页的信息口径不一致。' },
  { title: '成员信息建议一起维护', desc: '若项目负责人或核心成员发生变化，建议同时调整成员页和报告订阅人，减少后续样式与文案返工。' }
])

const editMembers = ref([
  { name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47' },
  { name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22' },
  { name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33' }
])

const editChips1 = ref([
  { label: '概览页高亮', on: true },
  { label: '风险页提醒', on: true },
  { label: '报表订阅', on: true },
  { label: '归档状态', on: false }
])

const editChips2 = ref([
  { label: '同步项目看板', on: true },
  { label: '同步甘特页', on: true },
  { label: '同步风险页', on: true },
  { label: '生成变更摘要', on: false },
  { label: '通知协作成员', on: false }
])

const aiContexts = {
  overview: '当前上下文：项目概览',
  members: '当前上下文：成员',
  kanban: '当前上下文：项目看板',
  gantt: '当前上下文：项目甘特图',
  risk: '当前上下文：风险看板',
  reports: '当前上下文：项目报表',
  docs: '当前上下文：项目文档'
}

const aiCards = {
  overview: { title: '根因分析', desc: '联调验证延期的主要原因不是开发落后，而是测试环境准备与数据回灌窗口重叠。建议优先拆出“环境参数回灌”子任务并指定单独负责人。', primary: '生成子任务', secondary: '查看基线对比' },
  members: { title: '负载平衡建议', desc: '当前平台组与 PM 均超过 80% 负载，建议先把回灌日志与回归验证说明拆给 QA 处理，再安排赵扬接手环境冻结任务。', primary: '采纳分配', secondary: '只生成通知' },
  kanban: { title: '阻塞处理建议', desc: '当前 3 个阻塞任务中，有 2 个都依赖“测试环境参数冻结”。优先处理该任务将直接释放下游 2 条任务链。', primary: '设为最高优先级', secondary: '生成提醒' },
  gantt: { title: '基线偏差说明', desc: '“联调验证”条形已超过基线半透明条 2 天，建议优先处理环境参数回灌和 QA 资源安排，以免影响上线验收窗口。', primary: '创建补救计划', secondary: '导出风险摘要' },
  risk: { title: '根因分析浮窗', desc: '根因不在开发速度，而在资源调度。风险在于多个任务争抢同一测试窗口，建议先调度再追赶计划。', primary: '一键协调资源', secondary: '仅生成说明' },
  reports: { title: '周报撰写建议', desc: '当前报表最值得强调的结论是“整体效率提升 12%，但联调节点是唯一主风险”，适合作为周报首段摘要。', primary: '自动生成周报', secondary: '复制 Markdown' },
  docs: { title: '文档建议', desc: '建议优先补齐“回归样本池说明”，并将需求评审纪要自动链接到联调验证任务。', primary: '生成文档提纲', secondary: '生成摘要' }
}

const aiLists = {
  overview: [
    { title: '项目健康预测 · 88% 置信度', desc: '若本周三前恢复联调，项目整体健康度仍可维持“良好”。' },
    { title: '成员建议', desc: '平台组负载已超过阈值，建议将两项回归校验转交给 QA 协作成员处理。' }
  ],
  members: [],
  kanban: [],
  gantt: [
    { title: '关键路径提醒', desc: '开发实现、联调验证、上线验收构成当前最长依赖链，请勿在该链路上新增低优先级任务。' }
  ],
  risk: [],
  reports: [],
  docs: []
}

const aiContext = computed(() => aiContexts[currentTab.value] || aiContexts.overview)
const aiCard = computed(() => aiCards[currentTab.value] || aiCards.overview)
const aiList = computed(() => aiLists[currentTab.value] || [])

watch(() => route.params.tab, () => { isAiDrawerOpen.value = false })
</script>

<style scoped>
.panel-pad { padding: 24px; border-radius: 24px; }
.tab-panel { display: flex; flex-direction: column; gap: 24px; }
.tab-panel > section + section { margin-top: 0; }
.ai-gradient { background: linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42)); }
.col-stack { display: flex; flex-direction: column; gap: 24px; }
.panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
.summary-head { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
.load-list { display: flex; flex-direction: column; gap: 16px; margin-top: 18px; }
.load-head { display: flex; justify-content: space-between; }
.risk-tags { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.chip-group { display: flex; gap: 10px; flex-wrap: wrap; }
.gantt-info-head { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; align-items: center; }
.legend-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
.legend-dot { display: inline-flex; align-items: center; gap: 6px; }
.legend-dot::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: currentColor; display: inline-block; }
.project-edit-modal { width: min(1180px, calc(100vw - 48px)); }
.project-edit-layout { display: grid; grid-template-columns: minmax(300px, 0.92fr) minmax(0, 1.4fr); gap: 20px; }
.project-edit-side { display: flex; flex-direction: column; gap: 18px; }
.project-edit-card { padding: 20px; border-radius: 24px; }
.project-edit-card h3, .project-edit-card p { margin: 0; }
.project-edit-kpis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 18px; }
.project-edit-kpi { padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.28); border: 1px solid rgba(255,255,255,0.58); }
.project-edit-kpi span, .project-edit-kpi strong { display: block; }
.project-edit-kpi span { font-size: 12px; color: var(--color-text-tertiary); }
.project-edit-kpi strong { margin-top: 8px; font-size: 18px; }
.project-edit-meta { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.project-edit-meta-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.28); border: 1px solid rgba(255,255,255,0.58); }
.project-edit-meta-row > div span, .project-edit-meta-row > div strong { display: block; }
.project-edit-meta-row > div span { font-size: 12px; color: var(--color-text-tertiary); }
.project-edit-meta-row > div strong { font-size: 14px; text-align: left; }
.project-edit-member-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.project-edit-member { display: inline-flex; align-items: center; gap: 10px; min-height: 42px; padding: 0 14px 0 8px; border-radius: 999px; background: rgba(255,255,255,0.5); border: 1px solid rgba(216,221,232,0.88); color: var(--color-text-secondary); font-size: 13px; font-weight: 600; }
.project-edit-member img { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.82); }
.project-edit-progress { display: flex; align-items: center; gap: 12px; margin-top: 18px; }
.project-edit-progress .progress-track { flex: 1; }
.project-edit-progress strong { min-width: 44px; text-align: right; }
.project-edit-note-list { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.project-edit-note { padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.58); }
.project-edit-note h4, .project-edit-note p { margin: 0; }
.project-edit-note p { margin-top: 8px; color: var(--color-text-secondary); font-size: 13px; line-height: 1.6; }
.project-edit-main { display: flex; flex-direction: column; gap: 18px; }
.project-edit-card-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
.project-edit-card-head h3, .project-edit-card-head p { margin: 0; }
.project-edit-field-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.project-edit-chip-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.project-edit-textarea .field-input { align-items: flex-start; min-height: 136px; }
.project-edit-textarea textarea { min-height: 108px; }
.role-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 26px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.role-badge.pm { background: rgba(79,143,246,0.14); color: var(--color-primary-700); }
.role-badge.dev { background: rgba(168,113,255,0.14); color: var(--color-tertiary-600); }
.role-badge.qa { background: rgba(56,197,155,0.14); color: var(--color-secondary-600); }
.status-tag.neutral { color: var(--color-text-tertiary); background: rgba(233,236,241,0.8); }
.status-tag.warning { color: #a36b00; background: rgba(252,230,176,0.8); }
.status-tag.danger { color: var(--color-danger-600); background: rgba(255,218,214,0.8); }
.status-tag.success { color: var(--color-secondary-600); background: rgba(156,239,219,0.8); }
.heatmap-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.heat-block { aspect-ratio: 1; border-radius: 10px; }
.app-topbar { padding: 0 10px; }
.topbar-left { gap: 10px; }
.topbar-back-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 180ms ease, transform 180ms ease, color 180ms ease;
}
  .topbar-back-icon:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: translateX(-1px);
  }
  .topbar-back-icon:focus-visible {
    outline: 2px solid rgba(20, 104, 199, 0.45);
    outline-offset: 2px;
  }
  .topbar-back-icon .material-symbols-outlined {
    font-size: 18px;
  }
/* 优先级样式 */
.priority-p0 { color: #ef4444; }
.priority-p1 { color: #f59e0b; }
.priority-p2 { color: #9ca3af; }

/* AI项目建议弹窗样式 */
.ai-suggestion-modal {
  width: min(750px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  padding: 20px;
  border-radius: 20px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.suggestion-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-tertiary-400), var(--color-tertiary-600));
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-header h3 {
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.confidence-badge {
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(56, 197, 155, 0.1);
  color: var(--color-secondary-700);
  font-size: 12px;
  font-weight: 600;
}

.suggestion-item p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.suggestion-impact {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(251, 191, 36, 0.08);
}

.suggestion-impact .material-symbols-outlined {
  font-size: 16px;
  color: var(--color-warning-600);
}

.suggestion-impact span {
  font-size: 13px;
  color: var(--color-warning-700);
  font-weight: 500;
}

.conclusion-box {
  margin-top: 20px;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.08), rgba(168, 113, 255, 0.08));
  display: flex;
  gap: 14px;
}

.conclusion-box .material-symbols-outlined {
  font-size: 24px;
  color: var(--color-primary-600);
  flex-shrink: 0;
  margin-top: 2px;
}

.conclusion-box p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* 任务拆解弹窗样式 */
.task-breakdown-modal {
  width: min(800px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.phase-section {
  border-radius: 20px;
  overflow: hidden;
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(216, 221, 232, 0.4);
}

.phase-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(20, 104, 199, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.phase-icon .material-symbols-outlined {
  font-size: 16px;
  color: var(--color-primary-600);
}

.phase-header h3 {
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.task-count {
  font-size: 13px;
  color: var(--color-text-tertiary);
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(233, 236, 241, 0.8);
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.15);
}

.task-card {
  padding: 16px;
  border-radius: 16px;
}

.task-header {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.priority-tag {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.priority-p0 {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger-600);
}

.priority-p1 {
  background: rgba(251, 191, 36, 0.1);
  color: var(--color-warning-600);
}

.priority-p2 {
  background: rgba(107, 114, 128, 0.1);
  color: var(--color-text-secondary);
}

.priority-p3 {
  background: rgba(107, 114, 128, 0.08);
  color: var(--color-text-tertiary);
}

.status-tag {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.status-success {
  background: rgba(47, 198, 138, 0.1);
  color: var(--color-secondary-600);
}

.status-warning {
  background: rgba(251, 191, 36, 0.1);
  color: var(--color-warning-600);
}

.status-neutral {
  background: rgba(107, 114, 128, 0.08);
  color: var(--color-text-tertiary);
}

.task-card h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.task-progress .progress-track {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(233, 236, 241, 0.8);
}

.task-progress .progress-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600));
}

.task-progress span {
  font-size: 12px;
  color: var(--color-text-tertiary);
  min-width: 36px;
  text-align: right;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 6px;
}

.task-assignee .material-symbols-outlined {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.task-assignee span {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* AI智能分配建议弹窗样式 */
.ai-allocation-modal {
  width: min(750px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.allocation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.allocation-item {
  padding: 20px;
  border-radius: 20px;
}

.allocation-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.allocation-header h3 {
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.allocation-transfer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
}

.transfer-item {
  flex: 1;
  text-align: center;
}

.transfer-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
}

.transfer-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.transfer-info .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-text-secondary);
}

.transfer-info span {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dept-tag {
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(20, 104, 199, 0.1);
  color: var(--color-primary-600);
  font-size: 11px;
}

.transfer-arrow {
  padding: 8px;
  color: var(--color-text-tertiary);
}

.allocation-reason {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* 手动调整弹窗样式 */
.manual-adjust-modal {
  width: min(700px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.adjust-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.adjust-item {
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.member-details {
  flex: 1;
}

.member-details h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.member-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.member-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-value.load-danger {
  color: var(--color-danger-600);
}

.stat-value.load-warning {
  color: var(--color-warning-600);
}

.stat-value.load-success {
  color: var(--color-secondary-600);
}

.stat-value.load-neutral {
  color: var(--color-text-secondary);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn-sm .material-symbols-outlined {
  font-size: 16px;
}

/* AI看板分析弹窗样式 */
.kanban-analysis-modal {
  width: min(800px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.analysis-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
}

.overview-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overview-icon.total {
  background: rgba(20, 104, 199, 0.1);
}

.overview-icon.total .material-symbols-outlined {
  color: var(--color-primary-600);
}

.overview-icon.completed {
  background: rgba(47, 198, 138, 0.1);
}

.overview-icon.completed .material-symbols-outlined {
  color: var(--color-secondary-600);
}

.overview-icon.progress {
  background: rgba(251, 191, 36, 0.1);
}

.overview-icon.progress .material-symbols-outlined {
  color: var(--color-warning-600);
}

.overview-icon.blocked {
  background: rgba(239, 68, 68, 0.1);
}

.overview-icon.blocked .material-symbols-outlined {
  color: var(--color-danger-600);
}

.overview-icon .material-symbols-outlined {
  font-size: 18px;
}

.overview-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.overview-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.insight-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  padding: 16px;
  border-radius: 16px;
  border-left: 4px solid transparent;
}

.insight-warning {
  border-left-color: var(--color-warning-600);
  background: rgba(251, 191, 36, 0.05);
}

.insight-success {
  border-left-color: var(--color-secondary-600);
  background: rgba(47, 198, 138, 0.05);
}

.insight-info {
  border-left-color: var(--color-primary-600);
  background: rgba(20, 104, 199, 0.05);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.insight-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.insight-warning .insight-icon {
  background: rgba(251, 191, 36, 0.15);
}

.insight-warning .insight-icon .material-symbols-outlined {
  color: var(--color-warning-600);
}

.insight-success .insight-icon {
  background: rgba(47, 198, 138, 0.15);
}

.insight-success .insight-icon .material-symbols-outlined {
  color: var(--color-secondary-600);
}

.insight-info .insight-icon {
  background: rgba(20, 104, 199, 0.15);
}

.insight-info .insight-icon .material-symbols-outlined {
  color: var(--color-primary-600);
}

.insight-icon .material-symbols-outlined {
  font-size: 16px;
}

.insight-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.insight-item p {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.insight-impact {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  width: fit-content;
}

.insight-impact .material-symbols-outlined {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.insight-impact span {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
}

.rec-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-tertiary-400), var(--color-tertiary-600));
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rec-content {
  flex: 1;
}

.rec-content strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.rec-content span {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* 风险报告弹窗样式 */
.risk-report-modal {
  width: min(850px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.risk-overview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.risk-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
}

.risk-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.risk-card-icon.high-risk {
  background: rgba(239, 68, 68, 0.15);
}

.risk-card-icon.high-risk .material-symbols-outlined {
  color: var(--color-danger-600);
}

.risk-card-icon.medium-risk {
  background: rgba(251, 191, 36, 0.15);
}

.risk-card-icon.medium-risk .material-symbols-outlined {
  color: var(--color-warning-600);
}

.risk-card-icon.stability {
  background: rgba(47, 198, 138, 0.15);
}

.risk-card-icon.stability .material-symbols-outlined {
  color: var(--color-secondary-600);
}

.risk-card-icon .material-symbols-outlined {
  font-size: 20px;
}

.risk-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.risk-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.risk-trend {
  font-size: 12px;
  font-weight: 500;
}

.risk-trend.up {
  color: var(--color-danger-600);
}

.risk-trend.stable {
  color: var(--color-text-secondary);
}

.risk-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(47, 198, 138, 0.15);
  color: var(--color-secondary-600);
  font-size: 12px;
  font-weight: 500;
}

.executive-summary {
  padding: 16px;
  background: rgba(20, 104, 199, 0.08);
  border-radius: 16px;
  margin-bottom: 20px;
}

.executive-summary h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  gap: 8px;
}

.executive-summary h3 .material-symbols-outlined {
  font-size: 16px;
}

.executive-summary p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.risk-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-category {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.risk-category.high {
  border-left: 4px solid var(--color-danger-600);
}

.risk-category.medium {
  border-left: 4px solid var(--color-warning-600);
}

.risk-category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.risk-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.risk-category.high .risk-badge {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger-600);
}

.risk-category.medium .risk-badge {
  background: rgba(251, 191, 36, 0.15);
  color: var(--color-warning-600);
}

.risk-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.risk-trend-badge {
  margin-left: auto;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.risk-trend-badge.up {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger-600);
}

.risk-trend-badge.stable {
  background: rgba(156, 163, 175, 0.1);
  color: var(--color-text-secondary);
}

.risk-item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.risk-item {
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.findings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.finding-item {
  padding: 16px;
  border-radius: 16px;
}

.finding-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.severity-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.severity-badge.high {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger-600);
}

.severity-badge.medium {
  background: rgba(251, 191, 36, 0.15);
  color: var(--color-warning-600);
}

.finding-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.finding-content {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.finding-recommendation {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(251, 191, 36, 0.1);
}

.finding-recommendation .material-symbols-outlined {
  font-size: 16px;
  color: var(--color-warning-600);
  flex-shrink: 0;
}

.finding-recommendation span {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.heatmap-summary {
  margin-top: 20px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.05);
  border-radius: 16px;
}

.heatmap-summary h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-danger-600);
  display: flex;
  align-items: center;
  gap: 8px;
}

.heatmap-summary h3 .material-symbols-outlined {
  font-size: 16px;
}

.conflict-days {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.conflict-day {
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger-600);
  font-size: 13px;
  font-weight: 500;
}

.heatmap-summary p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* 归档项目弹窗样式 */
.archive-modal, .baseline-modal {
  width: min(520px, calc(100vw - 32px));
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.archive-modal .modal-header,
.baseline-modal .modal-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.archive-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.warning-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(239, 68, 68, 0.02) 100%);
  border-radius: 20px;
  border: 1px solid rgba(239, 68, 68, 0.12);
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.06);
}

.warning-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(239, 68, 68, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.12);
}

.warning-icon {
  font-size: 32px;
  color: var(--color-danger-500);
}

.warning-box h3 {
  margin: 0 0 18px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
}

.warning-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
}

.warning-box li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 12px 14px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.warning-box li:last-child {
  margin-bottom: 0;
}

.warning-box li::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-danger-400), var(--color-danger-500));
  flex-shrink: 0;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.confirm-check {
  margin-top: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.25s;
}

.checkbox-label:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(239, 68, 68, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  position: relative;
  transition: all 0.25s;
  flex-shrink: 0;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, var(--color-danger-500), var(--color-danger-600));
  border-color: var(--color-danger-600);
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 4px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg);
}

.archive-modal .modal-footer,
.baseline-modal .modal-footer {
  margin: 0;
  padding: 18px 24px;
  border-radius: 0 0 24px 24px;
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(20px);
}

.archive-modal .modal-status,
.baseline-modal .modal-status {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.archive-modal .modal-footer-actions,
.baseline-modal .modal-footer-actions {
  gap: 14px;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-danger-500), var(--color-danger-600));
  color: white;
  border: none;
  border-color: transparent;
  box-shadow: 0 4px 18px rgba(239, 68, 68, 0.35);
  padding: 13px 24px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  min-width: 130px;
}

.btn-danger:hover {
  background: linear-gradient(135deg, var(--color-danger-600), var(--color-danger-700));
  box-shadow: 0 6px 22px rgba(239, 68, 68, 0.45);
  transform: translateY(-2px);
}

.btn-danger:active {
  transform: translateY(0);
}

.btn-danger .material-symbols-outlined {
  font-size: 18px;
}

/* 设置基线弹窗样式 */
.baseline-form {
  margin-bottom: 22px;
  padding: 0 8px;
}

.baseline-form label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.baseline-form input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid var(--color-border);
  background: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  transition: all 0.2s;
}

.baseline-form input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(79, 143, 246, 0.1);
}

.baseline-preview {
  margin-bottom: 26px;
  padding: 0 8px;
}

.baseline-preview h3 {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
}

.summary-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.summary-item .material-symbols-outlined {
  font-size: 22px;
  color: var(--color-primary-500);
  margin-bottom: 10px;
}

.summary-item .value {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.summary-item .label {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 4px;
}

.baseline-history {
  margin-bottom: 16px;
  padding: 0 8px;
}

.baseline-history h3 {
  margin: 0 0 14px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.9);
}

.history-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.history-name .status-tag {
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(114, 119, 133, 0.15);
  color: var(--color-text-tertiary);
}

.history-name .status-tag.active {
  background: linear-gradient(135deg, rgba(56, 197, 155, 0.15), rgba(56, 197, 155, 0.08));
  color: var(--color-secondary-600);
}

.history-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* 反馈按钮样式 */
.feedback-btn {
  transition: all 0.3s ease;
}

.btn-secondary.feedback-btn.liked .material-symbols-outlined {
  color: var(--color-secondary-600) !important;
}

.btn-secondary.feedback-btn.disliked .material-symbols-outlined {
  color: var(--color-danger-600) !important;
}

/* 项目建议弹窗样式 */
.add-suggestion-modal, .view-suggestions-modal {
  width: min(650px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.suggestion-form {
  margin-top: 16px;
}

.suggestion-form label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.suggestion-form textarea {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  transition: border-color 0.2s;
}

.suggestion-form textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.suggestion-form textarea::placeholder {
  color: var(--color-text-tertiary);
}

.form-footer {
  margin-top: 10px;
}

.form-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  padding: 16px;
  border-radius: 16px;
}

.suggestion-content p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.6;
}

.suggestion-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.suggestion-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.suggestion-author {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.suggestion-time {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.like-btn:hover {
  background: rgba(47, 198, 138, 0.1);
  border-color: var(--color-secondary-400);
  color: var(--color-secondary-600);
}

.like-btn .material-symbols-outlined {
  font-size: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.empty-state .material-symbols-outlined {
  font-size: 48px;
  color: var(--color-text-tertiary);
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-tertiary);
}

@media (max-width: 1279px) {
  .project-edit-layout, .project-edit-field-grid { grid-template-columns: 1fr; }
}
</style>
