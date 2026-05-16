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
        <a class="nav-item active" href="#" @click.prevent="handleNavigate('/dashboard')"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/projects')"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/workbench')"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></a>
        <a class="nav-item notification-nav" href="#" @click.prevent="handleOpenNotifications"><span class="material-symbols-outlined">notifications</span><span>消息通知</span><span class="notification-badge">5</span></a>
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
            <span>全局</span>
            <span>/</span>
            <span>工作台</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索项目、任务、成员或报表..." />
        </label>
        <a class="icon-btn notification-link" href="#" @click.prevent="handleOpenNotifications" aria-label="打开通知中心"><span class="material-symbols-outlined">notifications</span><span class="notification-badge">5</span></a>
        <button class="icon-btn"><span class="material-symbols-outlined">apps</span></button>
        <button class="icon-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack">
        <div class="page-header">
          <div>
            <h1 class="page-title">全局工作台</h1>
            <p class="page-subtitle">待办、AI 日报入口、团队动态与项目健康度的统一入口。</p>
          </div>
          <div class="page-actions">
            <button class="btn-secondary" @click="showMorningReportModal = true"><span class="material-symbols-outlined">sunrise</span>生成晨报</button>
            <button class="btn-primary" @click="generateAiReport"><span class="material-symbols-outlined">bolt</span>生成 AI 日报</button>
          </div>
        </div>

        <section class="grid-2-1">
          <div class="summary-card glass-panel">
            <div class="summary-content">
              <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <span class="pill pill-ai"><span class="material-symbols-outlined">auto_awesome</span>AI 智能简报</span>
                <span class="section-caption">更新时间：今天 09:30</span>
              </div>
              <h2 class="section-title" style="font-size: 38px; margin-top: 22px; line-height: 1.24;">早上好，张工。今天有 4 个关键事项需要优先关注。</h2>
              <p class="page-subtitle" style="max-width: 880px; margin-top: 18px;">纳米材料项目 A 的合成实验成功率本周提升 12%，但“联调验证”里程碑相对基线已延后 2 天；实验二组算力申请集中在周三与周五，成员负载峰值达到 86%；本周共有 3 个 P0 任务待评审，建议今天优先安排联调和代码复核。</p>
              <div class="summary-kpis">
                <div class="summary-kpi">
                  <span>个人待办完成率</span>
                  <strong>73%</strong>
                </div>
                <div class="summary-kpi">
                  <span>阻塞任务</span>
                  <strong>2 项</strong>
                </div>
                <div class="summary-kpi">
                  <span>PBC 达成率</span>
                  <strong>64%</strong>
                </div>
                <div class="summary-kpi">
                  <span>活跃项目</span>
                  <strong>16 个</strong>
                </div>
              </div>
              <div class="summary-actions">
                <button class="btn-primary" @click="viewAiReport"><span class="material-symbols-outlined">arrow_forward</span>查看 AI 日报</button>
                <button class="btn-secondary" @click="handleNavigate('/workbench')"><span class="material-symbols-outlined">task_alt</span>进入个人工作台</button>
                <button class="btn-secondary" @click="showQuickTaskModal = true"><span class="material-symbols-outlined">add_task</span>快速创建任务</button>
              </div>
            </div>
          </div>

          <div class="glass-panel metric-card">
            <div style="display: flex; justify-content: space-between; gap: 14px; align-items: start;">
              <div>
                <h3>团队效率趋势</h3>
                <div class="value" style="font-size: 52px; color: var(--color-primary-700);">142%</div>
              </div>
              <span class="material-symbols-outlined watermark" style="position: static; opacity: 0.22; font-size: 60px; color: var(--color-primary-600);">trending_up</span>
            </div>
            <div class="progress-track" style="margin-top: 18px;">
              <div class="progress-fill" style="width: 72%; background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));"></div>
            </div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 14px;">高于近 30 天平均水平 15.4%，AI 判断主要受“自动化测试改造”和“日报生成效率提升”影响。</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
              <span class="micro-tag p2">高增长</span>
              <span class="micro-tag" style="color: var(--color-tertiary-600); background: rgba(236,220,255,0.72);">低风险</span>
              <span class="micro-tag" style="color: var(--color-secondary-600); background: rgba(156,239,219,0.72);">AI 推荐保持</span>
            </div>
          </div>
        </section>

        <section class="grid-2-1-1">
          <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
            <div style="display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px;">
              <h2 class="section-title" style="font-size: 24px;">我的待办</h2>
              <button class="btn-chip active" @click="handleNavigate('/workbench?tab=kanban')">查看全部</button>
            </div>
            <div class="task-list">
              <div class="task-row">
                <div class="task-icon"><span class="material-symbols-outlined">play_arrow</span></div>
                <div style="flex: 1;">
                  <p class="task-title">完成 Q3 实验室能效评估报告</p>
                  <p class="task-note">截止日期：今天 18:00 · 关联项目：实验基座升级</p>
                </div>
                <span class="pill pill-danger">紧急</span>
              </div>
              <div class="task-row">
                <div class="task-icon pending"><span class="material-symbols-outlined">radio_button_unchecked</span></div>
                <div style="flex: 1;">
                  <p class="task-title">审批 5 号实验室设备维护申请</p>
                  <p class="task-note">来自：李技术员 · 预估工时：0.5d</p>
                </div>
                <span class="pill pill-warning">待审</span>
              </div>
              <div class="task-row" style="opacity: 0.68;">
                <div class="task-icon done"><span class="material-symbols-outlined">check</span></div>
                <div style="flex: 1;">
                  <p class="task-title" style="text-decoration: line-through;">更新周报内容至系统</p>
                  <p class="task-note">已完成 · 日志已同步到 AI 日报草稿</p>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
            <h2 class="section-title" style="font-size: 24px; margin-bottom: 18px;">最近动态</h2>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot" style="background: var(--color-primary-600);"></span>
                <div class="timeline-body">
                  <h4>新文档上传</h4>
                  <p>“碳纳米管合成工艺”已存入项目文档库，关联至项目 A 的第三阶段验证。</p>
                  <span>10 分钟前</span>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot" style="background: var(--color-tertiary-600);"></span>
                <div class="timeline-body">
                  <h4>实验预警</h4>
                  <p>2 号恒温箱温度波动异常，AI 预测 4 小时内将影响第 3 批次实验结果。</p>
                  <span>45 分钟前</span>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot" style="background: #0eb4d6;"></span>
                <div class="timeline-body">
                  <h4>人员变动</h4>
                  <p>新实习生王强已加入“模型评估组”，待 PM 完成项目内身份分配。</p>
                  <span>2 小时前</span>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
            <h2 class="section-title" style="font-size: 24px; margin-bottom: 18px;">项目健康度</h2>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: end;">
                  <strong>核心实验室</strong>
                  <span style="font-weight: 700; color: var(--color-primary-700);">85%</span>
                </div>
                <div class="progress-track" style="margin-top: 10px;"><div class="progress-fill" style="width: 85%; background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));"></div></div>
                <p class="task-note" style="margin-top: 8px;">进度稳步推进</p>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: end;">
                  <strong>材料迭代</strong>
                  <span style="font-weight: 700; color: var(--color-warning-600);">42%</span>
                </div>
                <div class="progress-track" style="margin-top: 10px;"><div class="progress-fill" style="width: 42%; background: linear-gradient(90deg, #f7c455, var(--color-warning-600));"></div></div>
                <p class="task-note" style="margin-top: 8px;">存在资源瓶颈</p>
              </div>
              <div class="glass-soft" style="padding: 16px; border-radius: 18px;">
                <div style="display: flex; justify-content: space-between;">
                  <span class="section-caption">整体交付信心</span>
                  <strong style="color: var(--color-secondary-600);">极高</strong>
                </div>
                <div style="display: flex; gap: 6px; margin-top: 12px;">
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: rgba(216,221,232,0.9);"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="grid-3">
          <div class="glass-panel metric-card">
            <span class="material-symbols-outlined watermark">thermostat</span>
            <h3>实验室平均温湿度</h3>
            <div class="value" style="font-size: 30px;">22.4°C / 45%</div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 10px;">关键环境稳定，暂无异常波动。</p>
          </div>
          <div class="glass-panel metric-card">
            <span class="material-symbols-outlined watermark">memory</span>
            <h3>算力节点在线率</h3>
            <div class="value" style="font-size: 30px;">99.98%</div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 10px;">GPU 集群状态良好，周三夜间有高峰负载。</p>
          </div>
          <div class="glass-panel metric-card">
            <span class="material-symbols-outlined watermark">security</span>
            <h3>安全运行天数</h3>
            <div class="value" style="font-size: 30px;">1,284 天</div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 10px;">本季度无 P1 级安全事件，AI 监测维持稳定。</p>
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
          <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">参考项目矩阵页的展示维度，先完成名称、编号、负责人、标签、状态与截止时间等核心信息配置，创建后可继续进入详情页补充内容。</p>
        </div>
        <button class="icon-btn" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
        <div class="glass-panel" style="padding: 20px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <h3 class="section-title" style="font-size: 18px; margin: 0;">基础信息</h3>
              <p class="section-caption" style="margin-top: 4px; font-size: 12px;">对齐项目矩阵页的核心字段展示</p>
            </div>
            <span class="pill pill-neutral" style="font-size: 11px;">列表主字段</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
            <div>
              <label class="field-label" style="font-size: 13px;">项目名称</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">title</span>
                <input type="text" v-model="formData.name" placeholder="请输入项目名称" />
              </div>
            </div>
            <div>
              <label class="field-label" style="font-size: 13px;">项目编号</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">tag</span>
                <input type="text" v-model="formData.code" placeholder="请输入项目编号" />
              </div>
            </div>
            <div>
              <label class="field-label" style="font-size: 13px;">项目负责人</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">person</span>
                <input type="text" v-model="formData.owner" placeholder="请输入项目负责人" />
              </div>
            </div>
            <div>
              <label class="field-label" style="font-size: 13px;">预计成员数</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">group_add</span>
                <input type="text" v-model="formData.memberCount" placeholder="请输入预计成员数" />
              </div>
            </div>
          </div>
        </div>

        <div class="glass-panel" style="padding: 20px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <h3 class="section-title" style="font-size: 18px; margin: 0;">计划与状态</h3>
              <p class="section-caption" style="margin-top: 4px; font-size: 12px;">用于项目矩阵页的筛选、排序和状态展示</p>
            </div>
            <span class="pill pill-success" style="font-size: 11px;">计划信息</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
            <div>
              <label class="field-label" style="font-size: 13px;">开始日期</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">calendar_today</span>
                <input type="date" v-model="formData.startDate" />
              </div>
            </div>
            <div>
              <label class="field-label" style="font-size: 13px;">截止日期</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">event</span>
                <input type="date" v-model="formData.deadline" />
              </div>
            </div>
          </div>

          <div style="margin-top: 12px;">
            <label class="field-label" style="font-size: 13px;">项目优先级</label>
            <div class="field-input" style="margin-top: 6px;">
              <span class="material-symbols-outlined">flag</span>
              <select v-model="formData.priority">
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>
            </div>
          </div>

          <div style="margin-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="field-label" style="font-size: 13px;">项目摘要</label>
              <button class="btn-ai-summary" @click="generateAiSummary" style="padding: 4px 10px; font-size: 12px;">
                <span class="material-symbols-outlined" style="font-size: 14px;">auto_awesome</span>
                AI 智能摘要
              </button>
            </div>
            <div class="field-input" style="margin-top: 6px;">
              <span class="material-symbols-outlined" style="margin-top: 8px;">article</span>
              <textarea v-model="formData.summary" style="min-height: 60px;">围绕新型复合材料热稳定性验证展开，预期在 6 周内完成需求评审、实验方案对齐、验证实施与结果复盘，并同步沉淀到项目矩阵与风险页。</textarea>
            </div>
          </div>
        </div>

        <div class="glass-panel" style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <h3 class="section-title" style="font-size: 18px; margin: 0;">成员与同步配置</h3>
              <p class="section-caption" style="margin-top: 4px; font-size: 12px;">创建后默认影响成员字段、矩阵页筛选项和各详情页入口</p>
            </div>
            <span class="pill pill-warning" style="font-size: 11px;">协作配置</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
            <div>
              <label class="field-label" style="font-size: 13px;">核心成员</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">group</span>
                <input type="text" placeholder="请输入核心成员" />
              </div>
            </div>
            <div>
              <label class="field-label" style="font-size: 13px;">报告订阅人</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">forward_to_inbox</span>
                <input type="text" placeholder="请输入报告订阅人" />
              </div>
            </div>
            <div>
              <label class="field-label" style="font-size: 13px;">风险提醒频率</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">warning</span>
                <select>
                  <option>每日同步</option>
                  <option>每周同步</option>
                  <option>仅异常提醒</option>
                </select>
              </div>
            </div>
            <div>
              <label class="field-label" style="font-size: 13px;">模板初始化</label>
              <div class="field-input" style="margin-top: 6px;">
                <span class="material-symbols-outlined">auto_fix_high</span>
                <select>
                  <option>自动生成默认结构</option>
                  <option>仅创建空白项目</option>
                  <option>复制最近项目配置</option>
                </select>
              </div>
            </div>
          </div>
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

  <div class="modal-shell" :class="{ open: showAiReportModal }">
    <div class="modal-backdrop" @click="showAiReportModal = false"></div>
    <section class="modal-panel glass-panel-strong ai-report-modal">
      <div class="modal-header">
        <div>
          <span class="pill pill-ai"><span class="material-symbols-outlined">bolt</span>AI 日报</span>
          <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">AI 智能日报</h2>
          <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">基于个人日志与看板更新自动生成的日报汇总</p>
        </div>
        <button class="icon-btn" @click="showAiReportModal = false"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div class="ai-report-content">
        <div class="ai-report-header">
          <div class="ai-report-date">
            <span class="material-symbols-outlined">calendar_today</span>
            <div>
              <strong>{{ aiReportData.date }}</strong>
              <span>作者：{{ aiReportData.author }}</span>
            </div>
          </div>
          <div class="ai-report-score">
            <span>效率评分</span>
            <div class="score-circle">
              <strong>{{ aiReportData.efficiencyScore }}%</strong>
            </div>
          </div>
        </div>

        <div class="ai-report-summary">
          <span class="material-symbols-outlined">lightbulb</span>
          <p>{{ aiReportData.summary }}</p>
        </div>

        <div class="ai-report-sections">
          <div 
            v-for="(section, index) in aiReportData.sections" 
            :key="index" 
            class="ai-report-section glass-panel"
          >
            <div class="section-header">
              <span class="material-symbols-outlined">{{ section.icon }}</span>
              <h3>{{ section.title }}</h3>
            </div>
            <ul class="section-items">
              <li 
                v-for="(item, itemIndex) in section.items" 
                :key="itemIndex"
                :class="`item-${item.status}`"
              >
                <span class="status-dot" :class="`dot-${item.status}`"></span>
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-status">
          <span class="material-symbols-outlined">check_circle</span>
          AI 日报已根据您的个人日志和看板更新自动生成
        </div>
        <div class="modal-footer-actions">
          <button class="btn-secondary" @click="showAiReportModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
          <button class="btn-secondary"><span class="material-symbols-outlined">share</span>分享日报</button>
          <button class="btn-primary"><span class="material-symbols-outlined">download</span>导出日报</button>
        </div>
      </div>
    </section>
  </div>

  <div class="modal-shell" :class="{ open: showQuickTaskModal }">
    <div class="modal-backdrop" @click="showQuickTaskModal = false"></div>
    <section class="modal-panel glass-panel-strong quick-task-modal">
      <div class="modal-header">
        <div>
          <span class="pill pill-primary"><span class="material-symbols-outlined">add_task</span>快速创建任务</span>
          <h2 class="section-title" style="font-size: 24px; margin-top: 12px;">创建新任务</h2>
          <p class="page-subtitle" style="font-size: 14px; margin-top: 8px;">创建的任务将自动进入看板的未完成状态</p>
        </div>
        <button class="icon-btn" @click="showQuickTaskModal = false"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div style="max-height: 50vh; overflow-y: auto; padding-right: 8px;">
        <div class="quick-task-form">
          <div>
            <label class="field-label">任务标题 *</label>
            <div class="field-input">
              <span class="material-symbols-outlined">title</span>
              <input type="text" v-model="quickTaskForm.title" placeholder="请输入任务标题" />
            </div>
          </div>

          <div>
            <label class="field-label">任务描述</label>
            <div class="field-input">
              <span class="material-symbols-outlined">description</span>
              <textarea v-model="quickTaskForm.description" placeholder="请输入任务描述" rows="3"></textarea>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
            <div>
              <label class="field-label">优先级</label>
              <div class="field-input">
                <span class="material-symbols-outlined">flag</span>
                <select v-model="quickTaskForm.priority">
                  <option value="P0">P0 - 紧急</option>
                  <option value="P1">P1 - 高</option>
                  <option value="P2">P2 - 中</option>
                  <option value="P3">P3 - 低</option>
                </select>
              </div>
            </div>
            <div>
              <label class="field-label">截止日期</label>
              <div class="field-input">
                <span class="material-symbols-outlined">event</span>
                <input type="date" v-model="quickTaskForm.dueDate" />
              </div>
            </div>
          </div>

          <div>
            <label class="field-label">负责人</label>
            <div class="field-input">
              <span class="material-symbols-outlined">person</span>
              <input type="text" v-model="quickTaskForm.assignee" placeholder="请输入负责人" />
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-status">
          <span class="material-symbols-outlined">info</span>
          任务创建后将显示在看板的「未完成」列中
        </div>
        <div class="modal-footer-actions">
          <button class="btn-secondary" @click="showQuickTaskModal = false"><span class="material-symbols-outlined">close</span>取消</button>
          <button class="btn-primary" @click="createQuickTask"><span class="material-symbols-outlined">add</span>创建任务</button>
        </div>
      </div>
    </section>
  </div>

  <div class="modal-shell" :class="{ open: showMorningReportModal }">
    <div class="modal-backdrop" @click="showMorningReportModal = false"></div>
    <section class="modal-panel glass-panel-strong morning-report-modal">
      <div class="modal-header">
        <div>
          <span class="pill pill-warning"><span class="material-symbols-outlined">sunrise</span>晨报</span>
          <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">{{ morningReportData.greeting }}</h2>
          <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">{{ morningReportData.date }} · {{ morningReportData.weather }} · {{ morningReportData.temperature }}</p>
        </div>
        <button class="icon-btn" @click="showMorningReportModal = false"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div style="max-height: 70vh; overflow-y: auto; padding-right: 8px;">
        <div class="morning-report-content">
          <div 
            v-for="(section, index) in morningReportData.sections" 
            :key="index" 
            class="morning-section glass-panel"
          >
            <div class="section-header">
              <span class="material-symbols-outlined">{{ section.icon }}</span>
              <h3>{{ section.title }}</h3>
            </div>

            <div v-if="section.tasks" class="task-list">
              <div 
                v-for="(task, taskIndex) in section.tasks" 
                :key="taskIndex"
                class="task-item"
              >
                <div class="task-checkbox">
                  <span class="material-symbols-outlined">circle</span>
                </div>
                <div class="task-content">
                  <p>{{ task.title }}</p>
                  <div class="task-meta">
                    <span :class="`priority-tag priority-${task.priority === '紧急' ? 'danger' : task.priority === '高' ? 'warning' : 'secondary'}`">
                      {{ task.priority }}
                    </span>
                    <span>{{ task.dueTime }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="section.messages" class="message-list">
              <div 
                v-for="(msg, msgIndex) in section.messages" 
                :key="msgIndex"
                class="message-item"
              >
                <div class="message-avatar">
                  <span class="material-symbols-outlined">{{ msg.type === 'meeting' ? 'group' : msg.type === 'alert' ? 'alert-circle' : 'person' }}</span>
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="sender">{{ msg.sender }}</span>
                    <span class="time">{{ msg.time }}</span>
                  </div>
                  <p>{{ msg.content }}</p>
                </div>
              </div>
            </div>

            <div v-if="section.highlights" class="highlight-list">
              <div 
                v-for="(item, itemIndex) in section.highlights" 
                :key="itemIndex"
                :class="`highlight-item highlight-${item.type}`"
              >
                <span class="material-symbols-outlined">{{ item.type === 'success' ? 'check_circle' : item.type === 'warning' ? 'warning' : 'info' }}</span>
                <span>{{ item.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-status">
          <span class="material-symbols-outlined">sunny</span>
          今日晨报已生成，祝您工作顺利！
        </div>
        <div class="modal-footer-actions">
          <button class="btn-secondary" @click="showMorningReportModal = false"><span class="material-symbols-outlined">close</span>关闭</button>
          <button class="btn-primary"><span class="material-symbols-outlined">download</span>导出晨报</button>
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
        <p class="section-caption">当前上下文：全局工作台</p>
      </div>
      <button class="icon-btn" @click="closeAiDrawer"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="ai-card">
      <h4>今日建议</h4>
      <p>建议先处理“联调验证延期 2 天”的里程碑，再安排实验二组负载均衡。若今天 15:00 前完成评审，整体基线偏差可收敛至 0.6 天。</p>
      <div class="ai-actions">
        <button class="btn-primary">一键采纳</button>
        <button class="btn-secondary">手动调整</button>
      </div>
    </div>
    <div class="ai-list">
      <div class="ai-list-item">
        <h4>风险提示 · 92% 置信度</h4>
        <p>项目 A 的联调节点和材料组算力申请集中在周三，建议提前协调资源窗口。</p>
      </div>
      <div class="ai-list-item">
        <h4>日报摘要</h4>
        <p>可直接生成晨报：包含 3 个重点风险、2 个关键进展和 1 个负载建议。</p>
      </div>
      <div class="ai-list-item">
        <h4>PBC 对齐提醒</h4>
        <p>张工本周已有 4 个任务可绑定到“提升团队协作效率”目标，预计达成率可提升 9%。</p>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { pushNotificationPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'
import { useProjects } from '../composables/useProjects'

const router = useRouter()

const currentUser = {
  name: '张工',
  role: '研发总监',
  avatar: 'https://i.pravatar.cc/80?img=12'
}

const { addProject } = useProjects()

const isModalOpen = ref(false)
const isAiDrawerOpen = ref(false)
const showAiReportModal = ref(false)
const showQuickTaskModal = ref(false)
const hasTodayReport = ref(false)
const toast = ref({ show: false, title: '', message: '', icon: '' })

const showMorningReportModal = ref(false)

const quickTaskForm = ref({
  title: '',
  description: '',
  priority: 'P1',
  assignee: '张工',
  dueDate: ''
})

const morningReportData = ref({
  date: '2026年5月16日',
  greeting: '早上好，张工',
  weather: '晴',
  temperature: '22°C',
  sections: [
    {
      title: '今日待办任务',
      icon: 'checklist',
      tasks: [
        { title: '完成Q3实验室能效评估报告', priority: '紧急', dueTime: '今天 18:00', status: 'pending' },
        { title: '审批5号实验室设备维护申请', priority: '高', dueTime: '今天', status: 'pending' },
        { title: '参加项目A周例会', priority: '高', dueTime: '今天 10:00', status: 'pending' },
        { title: '指导实习生基础实验操作', priority: '中', dueTime: '今天 14:00', status: 'pending' }
      ]
    },
    {
      title: '今早收到的消息',
      icon: 'mail',
      messages: [
        { sender: '李技术员', content: '5号实验室设备维护申请已提交，请审批', time: '08:30', type: 'work' },
        { sender: '项目组', content: '项目A周例会时间调整为今天上午10点', time: '08:45', type: 'meeting' },
        { sender: '系统通知', content: '2号恒温箱温度波动异常提醒', time: '09:00', type: 'alert' },
        { sender: '王经理', content: '请尽快提交Q3能效评估报告初稿', time: '09:15', type: 'work' }
      ]
    },
    {
      title: '今日重点关注',
      icon: 'star',
      highlights: [
        { text: '纳米材料项目A合成实验成功率已提升至88%', type: 'success' },
        { text: '联调验证里程碑已延后2天，需优先处理', type: 'warning' },
        { text: '本周共有3个P0任务待评审', type: 'info' },
        { text: '实验二组周三负载峰值预计达92%', type: 'warning' }
      ]
    }
  ]
})

const aiReportData = ref({
  date: '2026年5月16日',
  author: '张工',
  status: '已生成',
  sections: [
    {
      title: '今日工作完成情况',
      icon: 'check_circle',
      items: [
        { text: '完成Q3实验室能效评估报告初稿', status: 'completed' },
        { text: '审批5号实验室设备维护申请', status: 'completed' },
        { text: '更新周报内容至系统', status: 'completed' },
        { text: '参加项目A周例会', status: 'completed' }
      ]
    },
    {
      title: '任务看板更新',
      icon: 'view_quilt',
      items: [
        { text: '项目A "联调验证"任务进度更新至85%', status: 'progress' },
        { text: '新增"材料选型评审"任务（优先级P1）', status: 'new' },
        { text: '完成"文档归档"任务', status: 'completed' },
        { text: '"实验数据分析"任务延期风险提醒', status: 'warning' }
      ]
    },
    {
      title: '个人日志摘要',
      icon: 'file_text',
      items: [
        { text: '纳米材料项目A合成实验成功率提升至88%', status: 'completed' },
        { text: '实验二组负载均衡方案已提交审核', status: 'progress' },
        { text: '整理Q2技术复盘文档', status: 'completed' },
        { text: '指导实习生完成基础实验操作培训', status: 'completed' }
      ]
    },
    {
      title: 'AI智能建议',
      icon: 'auto_awesome',
      items: [
        { text: '建议优先处理"联调验证"任务，当前延期2天', status: 'warning' },
        { text: '实验二组周三负载峰值预计达92%，建议协调资源', status: 'warning' },
        { text: 'PBC目标"提升团队协作效率"本周达成率可提升9%', status: 'completed' },
        { text: '今日15:00前完成P0任务评审可将基线偏差收敛至0.6天', status: 'progress' }
      ]
    }
  ],
  summary: '今日共完成7项任务，3项任务进行中。看板显示1项任务存在延期风险，建议优先处理。整体工作效率良好，继续保持。',
  efficiencyScore: 94
})

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

const handleNavigate = (path) => {
  router.push(path)
}

const handleOpenNotifications = () => {
  pushNotificationPath(router, router.currentRoute.value.fullPath)
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

const viewAiReport = () => {
  if (hasTodayReport.value) {
    showAiReportModal.value = true
  } else {
    showToast('提示', '今日尚未生成AI日报，请先点击右上角"生成AI日报"按钮创建。', 'info')
  }
}

const generateAiReport = () => {
  hasTodayReport.value = true
  showAiReportModal.value = true
  showToast('AI日报已生成', '日报已根据您的个人日志和看板更新自动生成。', 'bolt')
}

const createQuickTask = () => {
  if (!quickTaskForm.value.title.trim()) {
    showToast('提示', '请输入任务标题', 'warning')
    return
  }

  showToast('任务已创建', `任务「${quickTaskForm.value.title}」已添加到看板的未完成列表中。`, 'task_alt')
  
  quickTaskForm.value = {
    title: '',
    description: '',
    priority: 'P1',
    assignee: '张工',
    dueDate: ''
  }
  
  showQuickTaskModal.value = false
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
    deadline: formData.value.deadline,
    priority: formData.value.priority,
    summary: formData.value.summary
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
  transform-origin: top center;
}

.toast-enter-active {
  animation: toastPopIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.toast-leave-active {
  animation: toastPopOut 160ms ease-in both;
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

/* 侧边栏通知菜单样式 */
.notification-nav {
  position: relative;
}

.notification-nav .notification-badge {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--color-danger-500);
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* AI 日报弹窗样式 */
.ai-report-modal {
  width: min(900px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.ai-report-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
}

.ai-report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(168, 113, 255, 0.12), rgba(113, 145, 255, 0.12));
  border: 1px solid rgba(168, 113, 255, 0.2);
  margin-bottom: 20px;
}

.ai-report-date {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ai-report-date .material-symbols-outlined {
  font-size: 32px;
  color: var(--color-tertiary-600);
}

.ai-report-date div strong {
  display: block;
  font-size: 20px;
  color: var(--color-text-primary);
}

.ai-report-date div span {
  display: block;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.ai-report-score {
  text-align: center;
}

.ai-report-score span {
  display: block;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2fc68a, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(47, 198, 138, 0.3);
}

.score-circle strong {
  font-size: 20px;
  color: white;
  font-weight: 700;
}

.ai-report-summary {
  display: flex;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  margin-bottom: 20px;
}

.ai-report-summary .material-symbols-outlined {
  font-size: 28px;
  color: var(--color-warning-600);
  flex-shrink: 0;
}

.ai-report-summary p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-primary);
}

.ai-report-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-report-section {
  padding: 20px;
  border-radius: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-header .material-symbols-outlined {
  font-size: 20px;
  color: var(--color-primary-600);
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.section-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-items li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
}

.section-items .item-completed {
  background: rgba(47, 198, 138, 0.08);
  color: var(--color-secondary-700);
}

.section-items .item-progress {
  background: rgba(20, 104, 199, 0.08);
  color: var(--color-primary-700);
}

.section-items .item-new {
  background: rgba(168, 113, 255, 0.08);
  color: var(--color-tertiary-700);
}

.section-items .item-warning {
  background: rgba(251, 191, 36, 0.08);
  color: var(--color-warning-700);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-completed {
  background: var(--color-secondary-500);
  box-shadow: 0 0 8px rgba(47, 198, 138, 0.4);
}

.dot-progress {
  background: var(--color-primary-500);
  box-shadow: 0 0 8px rgba(20, 104, 199, 0.4);
}

.dot-new {
  background: var(--color-tertiary-500);
  box-shadow: 0 0 8px rgba(168, 113, 255, 0.4);
}

.dot-warning {
  background: var(--color-warning-500);
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
}

/* 快速创建任务弹窗样式 */
.quick-task-modal {
  width: min(500px, calc(100vw - 48px));
}

.quick-task-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quick-task-form .field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.quick-task-form .field-input {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(216, 221, 232, 0.6);
}

.quick-task-form .field-input .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary-500);
  flex-shrink: 0;
  margin-top: 4px;
}

.quick-task-form .field-input input,
.quick-task-form .field-input select,
.quick-task-form .field-input textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text-primary);
}

.quick-task-form .field-input textarea {
  resize: none;
  min-height: 60px;
}

.quick-task-form .field-input select {
  cursor: pointer;
}

.quick-task-form .field-input input::placeholder,
.quick-task-form .field-input textarea::placeholder {
  color: var(--color-text-tertiary);
}

/* 晨报弹窗样式 */
.morning-report-modal {
  width: min(700px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.morning-report-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
}

.morning-section {
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.morning-section:last-child {
  margin-bottom: 0;
}

.morning-section .section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.morning-section .section-header .material-symbols-outlined {
  font-size: 20px;
  color: var(--color-warning-600);
}

.morning-section .section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);
}

.task-checkbox {
  flex-shrink: 0;
  margin-top: 4px;
}

.task-checkbox .material-symbols-outlined {
  font-size: 20px;
  color: var(--color-text-tertiary);
}

.task-content p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-primary);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.task-meta span {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.priority-tag {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px !important;
  font-weight: 600;
}

.priority-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger-600);
}

.priority-warning {
  background: rgba(251, 191, 36, 0.1);
  color: var(--color-warning-600);
}

.priority-secondary {
  background: rgba(107, 114, 128, 0.1);
  color: var(--color-text-secondary);
}

/* 消息列表 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 104, 199, 0.1);
  flex-shrink: 0;
}

.message-avatar .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary-600);
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.message-header .sender {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.message-header .time {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.message-content p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* 重点关注列表 */
.highlight-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 14px;
}

.highlight-success {
  background: rgba(47, 198, 138, 0.08);
  color: var(--color-secondary-700);
}

.highlight-warning {
  background: rgba(251, 191, 36, 0.08);
  color: var(--color-warning-700);
}

.highlight-info {
  background: rgba(20, 104, 199, 0.08);
  color: var(--color-primary-700);
}

.highlight-item .material-symbols-outlined {
  font-size: 18px;
  flex-shrink: 0;
}
</style>
