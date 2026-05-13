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
      <button class="sidebar-primary-cta" @click="openTaskModal">
        <span class="material-symbols-outlined">add_task</span>
        新建任务
      </button>
      <nav class="sidebar-nav">
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/projects')"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></a>
        <a class="nav-item active" href="#" @click.prevent="handleNavigate('/workbench')"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/reports')"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/settings')"><span class="material-symbols-outlined">settings</span><span>系统设置</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/admin')"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></a>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <div>
          <h2 class="topbar-title">个人工作台</h2>
          <div class="topbar-breadcrumb">
            <span>个人</span>
            <span>/</span>
            <span>日志 · 看板 · PBC</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索个人任务或日志..." />
        </label>
        <a class="icon-btn notification-link" href="#" @click.prevent="handleNavigate('/notifications')" aria-label="打开通知中心"><span class="material-symbols-outlined">notifications</span><span class="notification-badge">5</span></a>
        <button class="icon-btn"><span class="material-symbols-outlined">apps</span></button>
        <button class="icon-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack workbench-page-stack">
        <div class="page-header">
          <div>
            <h1 class="page-title">个人工作台</h1>
            <p class="page-subtitle">结构化日志、个人看板与 PBC 目标集中在同一工作台中，减少切换成本。</p>
          </div>
          <div class="page-actions">
            <div class="tab-switcher">
              <button class="tab-btn" :class="{ active: activeTab === 'logs' }" @click="activeTab = 'logs'">日志</button>
              <button class="tab-btn" :class="{ active: activeTab === 'kanban' }" @click="activeTab = 'kanban'">看板</button>
              <button class="tab-btn" :class="{ active: activeTab === 'pbc' }" @click="activeTab = 'pbc'">PBC</button>
            </div>
          </div>
        </div>

        <!-- 日志模块 -->
        <section v-show="activeTab === 'logs'">
          <!-- 日志切换：看日志 / 写日志 -->
          <div class="glass-panel logs-header">
            <div class="logs-tabs">
              <button class="logs-tab-btn" :class="{ active: logsView === 'view' }" @click="logsView = 'view'">
                <span class="material-symbols-outlined">article</span>
                看日志
              </button>
              <button class="logs-tab-btn" :class="{ active: logsView === 'write' }" @click="logsView = 'write'">
                <span class="material-symbols-outlined">edit_note</span>
                写日志
              </button>
            </div>
            <div v-if="logsView === 'view'" class="logs-filter">
              <button class="btn-chip" :class="{ active: logsFilter === 'my' }" @click="logsFilter = 'my'">我的日志</button>
              <button class="btn-chip" :class="{ active: logsFilter === 'received' }" @click="logsFilter = 'received'">收到的日志</button>
            </div>
          </div>

          <!-- 看日志视图 -->
          <div v-show="logsView === 'view'" class="logs-view-container">
            <div class="timeline">
              <div v-for="log in filteredLogs" :key="log.id" class="log-card glass-panel">
                <div class="log-header">
                  <div class="log-avatar">
                    <img :src="log.avatar" :alt="log.author" />
                  </div>
                  <div class="log-meta">
                    <h4>{{ log.author }}</h4>
                    <span class="log-time">{{ log.time }}</span>
                  </div>
                  <div v-if="log.isMine" class="log-badge pill pill-primary">我的日志</div>
                </div>
                <div class="log-content">
                  <div v-if="log.type === 'daily'" class="log-section">
                    <h5 class="log-section-title">今日完成工作</h5>
                    <p>{{ log.completed }}</p>
                  </div>
                  <div v-if="log.pending" class="log-section">
                    <h5 class="log-section-title">未完成工作</h5>
                    <p>{{ log.pending }}</p>
                  </div>
                  <div v-if="log.needHelp" class="log-section">
                    <h5 class="log-section-title">需协调工作</h5>
                    <p>{{ log.needHelp }}</p>
                  </div>
                </div>
                <div v-if="log.images && log.images.length > 0" class="log-images">
                  <img v-for="(img, index) in log.images" :key="index" :src="img" class="log-image" />
                </div>
                <div v-if="log.attachments && log.attachments.length > 0" class="log-attachments">
                  <div v-for="(file, index) in log.attachments" :key="index" class="log-attachment">
                    <span class="material-symbols-outlined">attach_file</span>
                    <span>{{ file }}</span>
                  </div>
                </div>
                <div class="log-actions">
                  <button class="log-action-btn" @click="toggleLike(log.id)">
                    <span class="material-symbols-outlined" :class="{ 'liked': log.liked }">{{ log.liked ? 'thumb_up' : 'thumb_up_off_alt' }}</span>
                    <span :class="{ 'liked': log.liked }">{{ log.likes }}</span>
                  </button>
                  <button class="log-action-btn" @click="openCommentModal(log.id)">
                    <span class="material-symbols-outlined">message</span>
                    <span>{{ log.comments }}</span>
                  </button>
                  <button class="log-action-btn">
                    <span class="material-symbols-outlined">visibility</span>
                    <span>{{ log.readCount }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 写日志视图 -->
          <div v-show="logsView === 'write'" class="logs-write-container">
            <div class="grid-2-1">
              <div class="editor-block">
                <div class="glass-panel-strong" style="padding: 24px; border-radius: 24px; margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="section-title" style="font-size: 20px;">写日志</h2>
                    <div class="template-selector">
                      <span class="material-symbols-outlined">template</span>
                      <select v-model="selectedTemplate" @change="loadTemplate">
                        <option value="daily">日报模板</option>
                        <option value="weekly">周报模板</option>
                        <option value="project">项目进度</option>
                        <option value="simple">简单汇报</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="glass-panel-strong" style="padding: 24px; border-radius: 24px; margin-bottom: 16px;">
                  <h3 class="section-title" style="font-size: 16px; margin-bottom: 12px;">{{ currentTemplateTitle }}</h3>
                  <div class="field-input">
                    <span class="material-symbols-outlined">article</span>
                    <textarea v-model="logForm.completed" :placeholder="currentTemplatePlaceholder" rows="4"></textarea>
                  </div>
                </div>

                <div v-if="showPending" class="glass-panel-strong" style="padding: 24px; border-radius: 24px; margin-bottom: 16px;">
                  <h3 class="section-title" style="font-size: 16px; margin-bottom: 12px;">未完成工作</h3>
                  <div class="field-input">
                    <span class="material-symbols-outlined">pending_actions</span>
                    <textarea v-model="logForm.pending" placeholder="请输入未完成的工作内容..." rows="3"></textarea>
                  </div>
                </div>

                <div v-if="showNeedHelp" class="glass-panel-strong" style="padding: 24px; border-radius: 24px; margin-bottom: 16px;">
                  <h3 class="section-title" style="font-size: 16px; margin-bottom: 12px;">需协调工作</h3>
                  <div class="field-input">
                    <span class="material-symbols-outlined">help</span>
                    <textarea v-model="logForm.needHelp" placeholder="请输入需要协调的工作内容..." rows="3"></textarea>
                  </div>
                </div>

                <!-- 图片上传 -->
                <div class="glass-panel-strong" style="padding: 24px; border-radius: 24px; margin-bottom: 16px;">
                  <h3 class="section-title" style="font-size: 16px; margin-bottom: 12px;">图片</h3>
                  <div class="upload-area">
                    <button class="upload-btn" @click="triggerImageUpload">
                      <span class="material-symbols-outlined">add_photo_alternate</span>
                      <span>添加图片</span>
                    </button>
                    <input type="file" id="image-upload" accept="image/*" multiple hidden @change="handleImageUpload" />
                    <div v-if="logForm.images.length > 0" class="uploaded-images">
                      <div v-for="(img, index) in logForm.images" :key="index" class="uploaded-image">
                        <img :src="img" />
                        <button class="remove-image" @click="removeImage(index)">
                          <span class="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 附件上传 -->
                <div class="glass-panel-strong" style="padding: 24px; border-radius: 24px; margin-bottom: 16px;">
                  <h3 class="section-title" style="font-size: 16px; margin-bottom: 12px;">附件</h3>
                  <div class="upload-area">
                    <button class="upload-btn" @click="triggerFileUpload">
                      <span class="material-symbols-outlined">attach_file</span>
                      <span>添加附件</span>
                    </button>
                    <input type="file" id="file-upload" multiple hidden @change="handleFileUpload" />
                    <div v-if="logForm.attachments.length > 0" class="uploaded-files">
                      <div v-for="(file, index) in logForm.attachments" :key="index" class="uploaded-file">
                        <span class="material-symbols-outlined">file</span>
                        <span>{{ file }}</span>
                        <button class="remove-file" @click="removeAttachment(index)">
                          <span class="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 发送对象 -->
                <div class="glass-panel-strong" style="padding: 24px; border-radius: 24px; margin-bottom: 16px;">
                  <h3 class="section-title" style="font-size: 16px; margin-bottom: 12px;">发送对象</h3>
                  <div class="recipient-list">
                    <div v-for="recipient in availableRecipients" :key="recipient.id" 
                         class="recipient-item" :class="{ selected: logForm.recipients.includes(recipient.id) }"
                         @click="toggleRecipient(recipient.id)">
                      <img :src="recipient.avatar" :alt="recipient.name" />
                      <span>{{ recipient.name }}</span>
                      <span v-if="recipient.isSelected" class="material-symbols-outlined check-icon">check</span>
                    </div>
                    <button class="add-recipient">
                      <span class="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <div class="send-options">
                    <label class="send-option">
                      <input type="checkbox" v-model="logForm.sendToChat" />
                      <span>通过聊天发送给接收人</span>
                    </label>
                    <label class="send-option">
                      <input type="checkbox" v-model="logForm.onlyReceiverCanSee" />
                      <span>仅接收人可见，不可转发</span>
                    </label>
                    <label class="send-option">
                      <input type="checkbox" v-model="logForm.scheduledSend" />
                      <span>定时发送</span>
                    </label>
                  </div>
                </div>

                <!-- 提交按钮 -->
                <div class="submit-bar">
                  <button class="btn-secondary" @click="saveDraft">
                    <span class="material-symbols-outlined">save</span>
                    保存草稿
                  </button>
                  <button class="btn-primary" @click="submitLog">
                    <span class="material-symbols-outlined">send</span>
                    提交日志
                  </button>
                </div>
              </div>

              <!-- 右侧提示 -->
              <div style="display: flex; flex-direction: column; gap: 24px;">
                <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
                  <h2 class="section-title" style="font-size: 18px;">今日焦点</h2>
                  <div class="summary-kpis" style="margin-top: 16px;">
                    <div class="summary-kpi">
                      <span>待办任务</span>
                      <strong>7 项</strong>
                    </div>
                    <div class="summary-kpi">
                      <span>日志互动</span>
                      <strong>12 条</strong>
                    </div>
                  </div>
                  <p class="page-subtitle" style="font-size: 14px; margin-top: 16px;">AI 判断你今天最值得优先处理的是“联调环境参数回灌”和“P0 代码评审”。</p>
                </div>

                <div class="glass-panel" style="padding: 24px; border-radius: 24px; background: linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42));">
                  <h2 class="section-title" style="font-size: 18px;">AI 日志建议</h2>
                  <p class="page-subtitle" style="font-size: 14px; margin-top: 14px;">你今天完成的 3 个任务中，有 2 个可自动映射到日报“今日完成”模块，并自动补齐风险项描述。</p>
                  <button class="btn-primary" style="margin-top: 16px;" @click="autoFillLog">一键填充</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 评论弹窗 -->
        <div class="modal-shell" :class="{ open: showCommentModal }">
          <div class="modal-backdrop" @click="closeCommentModal"></div>
          <section class="modal-panel glass-panel-strong" style="max-width: 600px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column;">
            <div class="modal-header">
              <div>
                <h2 class="section-title">评论</h2>
                <p class="page-subtitle">查看和回复评论</p>
              </div>
              <button class="icon-btn" @click="closeCommentModal"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="modal-body" style="flex: 1; overflow-y: auto; padding-bottom: 0;">
              <div v-if="currentLogId">
                <div 
                  v-for="comment in logsData.find(l => l.id === currentLogId)?.commentList || []" 
                  :key="comment.id"
                  class="comment-item"
                >
                  <img :src="comment.avatar" class="comment-avatar" />
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-author">{{ comment.author }}</span>
                      <span class="comment-time">{{ comment.time }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                  </div>
                </div>
                <div v-if="!logsData.find(l => l.id === currentLogId)?.commentList?.length" class="empty-comments">
                  <span class="material-symbols-outlined">message</span>
                  <p>暂无评论，快来发表第一条评论吧</p>
                </div>
              </div>
            </div>
            <div class="comment-input-area">
              <input 
                v-model="newComment" 
                type="text" 
                placeholder="输入评论..." 
                class="comment-input"
                @keyup.enter="addComment"
              />
              <button class="btn-primary" @click="addComment"><span class="material-symbols-outlined">send</span>发送</button>
            </div>
          </section>
        </div>

        <!-- 看板模块 -->
        <section v-show="activeTab === 'kanban'">
          <div class="glass-panel filter-bar">
            <button class="btn-chip" :class="{ active: isAllFilterActive }" @click="resetAllFilters">全部状态</button>
            <button class="btn-chip" :class="{ active: priorityFilter !== 'all' }" @click="togglePriorityFilter">{{ priorityFilter === 'all' ? 'P0 / P1' : priorityFilter.toUpperCase() }}</button>
            <button class="btn-chip" :class="{ active: deadlineFilter === 'week' }" @click="toggleDeadlineFilter">本周截止</button>
            <button class="btn-chip" :class="{ active: blockedFilter === 'blocked' }" @click="toggleBlockedFilter">仅阻塞</button>
            <div style="margin-left: auto; display: flex; gap: 12px;">
              <button class="btn-secondary" @click="openColumnModal('add')"><span class="material-symbols-outlined">add_box</span>添加列</button>
              <button class="btn-primary" @click="openKanbanTaskModal('add', null, kanbanData[0]?.id)"><span class="material-symbols-outlined">add</span>新建任务</button>
            </div>
          </div>
          
          <!-- 列管理提示 -->
          <div class="kanban-hint">
            <span class="material-symbols-outlined">info</span>
            <span>拖拽任务可移动到其他列，点击列右侧菜单可管理列设置</span>
          </div>
          
          <div 
            ref="kanbanRef" 
            class="kanban"
            :class="{ dragging: isDragging }"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseLeave"
          >
            <div 
              v-for="column in filteredKanbanData" 
              :key="column.id" 
              class="kanban-column glass-panel"
              :class="{ 'drag-over': dragOverColumn === column.id }"
              @dragover="(e) => handleTaskDragOver(e, column.id)"
              @dragleave="handleTaskDragLeave"
              @drop="handleTaskDrop(column.id)"
            >
              <div class="kanban-column-header">
                <div class="kanban-column-title">
                  <h3>{{ column.name }}</h3>
                  <div v-if="column.wipLimit" class="wip-limit" :class="{ 'wip-warning': column.tasks.length >= column.wipLimit }">
                    <span>{{ column.tasks.length }}/{{ column.wipLimit }}</span>
                  </div>
                  <span v-else class="pill pill-neutral">{{ column.tasks.length }}</span>
                </div>
                <div class="kanban-column-actions">
                  <button class="icon-btn" @click="moveColumn(column.id, 'up')" :disabled="filteredKanbanData.indexOf(column) === 0">
                    <span class="material-symbols-outlined">arrow_upward</span>
                  </button>
                  <button class="icon-btn" @click="moveColumn(column.id, 'down')" :disabled="filteredKanbanData.indexOf(column) === filteredKanbanData.length - 1">
                    <span class="material-symbols-outlined">arrow_downward</span>
                  </button>
                  <div class="dropdown">
                    <button class="icon-btn" @click.stop="toggleColumnMenu(column.id)">
                      <span class="material-symbols-outlined">more_vert</span>
                    </button>
                    <div v-show="showColumnMenu === column.id" class="dropdown-menu">
                      <button @click="openColumnModal('edit', column); showColumnMenu = null">
                        <span class="material-symbols-outlined">edit</span>编辑列
                      </button>
                      <button @click="openKanbanTaskModal('add', null, column.id); showColumnMenu = null">
                        <span class="material-symbols-outlined">add</span>添加任务
                      </button>
                      <hr />
                      <button class="danger" @click="deleteColumn(column.id); showColumnMenu = null">
                        <span class="material-symbols-outlined">delete</span>删除列
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="kanban-tasks">
                <div 
                  v-for="task in column.tasks" 
                  :key="task.id" 
                  class="kanban-card"
                  :class="{ dragging: draggedTask?.id === task.id }"
                  draggable="true"
                  @dragstart="handleTaskDragStart(task, column.id)"
                >
                  <div class="kanban-card-header">
                    <h4>{{ task.title }}</h4>
                    <div class="dropdown">
                      <button class="icon-btn" @click.stop="toggleTaskMenu(task.id)">
                        <span class="material-symbols-outlined">more_vert</span>
                      </button>
                      <div v-show="showTaskMenu === task.id" class="dropdown-menu">
                        <button @click="openKanbanTaskModal('edit', task, column.id); showTaskMenu = null">
                        <span class="material-symbols-outlined">edit</span>编辑任务
                        </button>
                        <button @click="updateTaskProgress(task.id, '100%'); showTaskMenu = null">
                          <span class="material-symbols-outlined">check_circle</span>标记完成
                        </button>
                        <hr />
                        <button class="danger" @click="deleteTask(task.id); showTaskMenu = null">
                          <span class="material-symbols-outlined">delete</span>删除任务
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="kanban-meta">
                    <span :class="['micro-tag', task.priority.toLowerCase()]">{{ task.priority }}</span>
                    <span v-if="task.tag" class="micro-tag" :style="task.isBlocked ? 'color: var(--color-danger-600); background: rgba(255,218,214,0.82);' : ''">{{ task.tag }}</span>
                  </div>
                  <div class="kanban-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: task.progress }"></div>
                    </div>
                    <span class="progress-text">{{ task.progress }}</span>
                  </div>
                  <p class="task-note">{{ task.isBlocked ? '阻塞原因：' : '截止：' }}{{ task.deadline }}</p>
                </div>
                
                <!-- 添加任务按钮 -->
                <button class="add-task-btn" @click="openKanbanTaskModal('add', null, column.id)">
                  <span class="material-symbols-outlined">add</span>
                  添加任务
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- PBC模块 -->
        <section v-show="activeTab === 'pbc'">
          <!-- 头部信息栏 -->
          <div class="glass-panel filter-bar" style="margin-bottom: 24px; justify-content: space-between;">
            <div>
              <h2 class="section-title" style="margin: 0; font-size: 20px;">PBC - {{ pbcData.period }} ({{ pbcData.employeeName }})</h2>
              <span class="page-subtitle" style="font-size: 14px; margin-top: 4px; display: block;">{{ pbcData.project }}</span>
            </div>
            <button class="btn-primary" @click="startWritingPbc"><span class="material-symbols-outlined">add</span>编写 PBC</button>
          </div>

          <!-- PBC表格 -->
          <div class="glass-panel" style="padding: 0; border-radius: 24px; overflow: hidden;">
            <div class="pbc-table-wrapper">
              <table class="pbc-table">
                <thead>
                  <tr>
                    <th class="pbc-th-name">姓名</th>
                    <th class="pbc-th-category">目标类型</th>
                    <th class="pbc-th-title">目标</th>
                    <th class="pbc-th-tasks">关键任务</th>
                    <th class="pbc-th-deadline">完成时间</th>
                    <th class="pbc-th-measure">衡量标准</th>
                    <th class="pbc-th-weight">权重</th>
                    <th class="pbc-th-progress">进度</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="objective in pbcData.objectives" 
                    :key="objective.id"
                    class="pbc-row-clickable"
                    @click="editPbc(objective)"
                  >
                    <td class="pbc-td-name">{{ pbcData.employeeName }}</td>
                    <td>
                      <span 
                        class="pill" 
                        :class="objective.category === 'KPI' ? 'pill-success' : 'pill-warning'"
                      >
                        {{ objective.category }}
                      </span>
                    </td>
                    <td class="pbc-td-title">{{ objective.title }}</td>
                    <td class="pbc-td-tasks">{{ objective.keyTasks }}</td>
                    <td class="pbc-td-deadline">{{ objective.deadline }}</td>
                    <td class="pbc-td-measure">{{ objective.measurement }}</td>
                    <td class="pbc-td-weight">{{ objective.weight }}</td>
                    <td>
                      <div class="mini-progress">
                        <div class="mini-progress-fill" :style="{ width: objective.progress + '%' }"></div>
                      </div>
                      <span class="progress-text">{{ objective.progress }}%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 右侧面板 -->
          <div class="grid-2-1" style="margin-top: 24px;">
            <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
              <h2 class="section-title">周期评估对话</h2>
              
              <!-- 自评区域 -->
              <div class="feedback-section">
                <h3 class="feedback-section-title">自评</h3>
                <div class="feedback-thread" style="margin-top: 12px;">
                  <!-- 暂时评价 -->
                  <div 
                    v-for="feedback in pbcData.feedbacks.filter(f => f.type === 'self' && f.category === 'temporary')" 
                    :key="feedback.id"
                    class="feedback-bubble self temporary"
                  >
                    <div class="feedback-header">
                      <span class="feedback-category">暂时评价</span>
                      <span class="feedback-time">{{ feedback.time }}</span>
                    </div>
                    <div class="feedback-content">{{ feedback.content }}</div>
                  </div>
                  <!-- 总评 -->
                  <div 
                    v-for="feedback in pbcData.feedbacks.filter(f => f.type === 'self' && f.category === 'summary')" 
                    :key="feedback.id"
                    class="feedback-bubble self summary"
                  >
                    <div class="feedback-header">
                      <span class="feedback-category summary-tag">总评</span>
                      <span class="feedback-time">{{ feedback.time }}</span>
                    </div>
                    <div class="feedback-content">{{ feedback.content }}</div>
                  </div>
                </div>
                <!-- 添加自评按钮 -->
                <button class="btn-secondary btn-sm" style="margin-top: 12px;" @click="showAddSelfFeedback = true">
                  <span class="material-symbols-outlined">add</span>添加自评
                </button>
              </div>

              <!-- 上级反馈区域 -->
              <div class="feedback-section" style="margin-top: 24px;">
                <h3 class="feedback-section-title">上级反馈</h3>
                <div class="feedback-thread" style="margin-top: 12px;">
                  <div 
                    v-for="feedback in pbcData.feedbacks.filter(f => f.type === 'manager')" 
                    :key="feedback.id"
                    class="feedback-bubble manager"
                  >
                    <div class="feedback-header">
                      <span class="feedback-category">上级反馈</span>
                      <span class="feedback-time">{{ feedback.time }}</span>
                    </div>
                    <div class="feedback-content">{{ feedback.content }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="glass-panel" style="padding: 24px; border-radius: 24px; background: linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42));">
              <div class="ai-section-header">
                <h2 class="section-title">AI 智能建议</h2>
                <span class="pill pill-ai">AI 生成</span>
              </div>
              
              <!-- AI趋势提示 -->
              <div class="ai-trend-card">
                <div class="ai-trend-icon">
                  <span class="material-symbols-outlined">trending_up</span>
                </div>
                <div class="ai-trend-content">
                  <p class="ai-trend-title">趋势预测</p>
                  <p class="ai-trend-text">
                    按照当前任务完成速度，本周期 PBC 达成率预计将在 <strong>{{ pbcData.aiTrend.days }} 天</strong> 内提升至 <strong>{{ pbcData.aiTrend.prediction }}</strong>
                  </p>
                </div>
              </div>

              <!-- AI建议列表 -->
              <div class="ai-suggestions">
                <p class="ai-suggestions-title">智能建议</p>
                <div class="suggestion-item">
                  <span class="suggestion-icon">1</span>
                  <span>{{ pbcData.aiTrend.suggestion }}</span>
                </div>
                <div class="suggestion-item">
                  <span class="suggestion-icon">2</span>
                  <span>建议优先完成权重较高的目标（如项目管理项目，权重35%），以提升整体达成率。</span>
                </div>
                <div class="suggestion-item">
                  <span class="suggestion-icon">3</span>
                  <span>毕设优化任务进度较低（45%），建议增加投入时间。</span>
                </div>
              </div>

              <!-- AI操作按钮 -->
              <div class="ai-actions">
                <button class="btn-primary">
                  <span class="material-symbols-outlined">bolt</span>AI 生成自评
                </button>
                <button class="btn-secondary">
                  <span class="material-symbols-outlined">bar_chart</span>查看趋势图
                </button>
              </div>
            </div>
          </div>
        </section>

          <!-- 编写/编辑PBC弹窗 -->
          <div class="modal-shell" :class="{ open: isWritingPbc }">
            <div class="modal-backdrop" @click="cancelWritingPbc"></div>
            <section class="modal-panel glass-panel-strong">
              <div class="modal-header">
                <div>
                  <h2 class="section-title">{{ editingPbcId ? '编辑 PBC 目标' : '编写 PBC 目标' }}</h2>
                  <p class="page-subtitle">{{ editingPbcId ? '修改现有的 PBC 目标信息' : '创建一个新的 PBC 目标' }}</p>
                </div>
                <button class="icon-btn" @click="cancelWritingPbc"><span class="material-symbols-outlined">close</span></button>
              </div>
              <div class="modal-body">
                <div class="field-stack">
                  <label class="field-label">目标类型</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">folder</span>
                    <select v-model="writingPbcData.category">
                      <option value="KPI">KPI</option>
                      <option value="重点工作">重点工作</option>
                      <option value="组织建设">组织建设</option>
                    </select>
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">目标名称</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">target</span>
                    <input v-model="writingPbcData.title" type="text" placeholder="请输入目标名称" />
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">关键任务</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">list_alt</span>
                    <textarea v-model="writingPbcData.keyTasks" placeholder="请输入关键任务描述（可换行）"></textarea>
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">完成时间</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">date_range</span>
                    <input v-model="writingPbcData.deadline" type="text" placeholder="如：5月31日" />
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">衡量标准</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">scale</span>
                    <input v-model="writingPbcData.measurement" type="text" placeholder="请输入衡量标准" />
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">权重 (%)</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">weight</span>
                    <input v-model.number="writingPbcData.weight" type="number" placeholder="权重百分比" min="1" max="100" />
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">进度 (%)</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">trending_up</span>
                    <input v-model.number="writingPbcData.progress" type="number" placeholder="当前进度" min="0" max="100" />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn-secondary" @click="cancelWritingPbc"><span class="material-symbols-outlined">close</span>取消</button>
                <button class="btn-primary" @click="savePbc"><span class="material-symbols-outlined">save</span>{{ editingPbcId ? '更新目标' : '保存目标' }}</button>
              </div>
            </section>
          </div>

          <!-- 添加自评弹窗 -->
          <div class="modal-shell" :class="{ open: showAddSelfFeedback }">
            <div class="modal-backdrop" @click="cancelAddSelfFeedback"></div>
            <section class="modal-panel glass-panel-strong" style="max-width: 500px;">
              <div class="modal-header">
                <div>
                  <h2 class="section-title">添加自评</h2>
                  <p class="page-subtitle">记录您的工作评价</p>
                </div>
                <button class="icon-btn" @click="cancelAddSelfFeedback"><span class="material-symbols-outlined">close</span></button>
              </div>
              <div class="modal-body">
                <div class="field-stack">
                  <label class="field-label">评价类型</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">folder</span>
                    <select v-model="newSelfFeedback.category">
                      <option value="temporary">暂时评价</option>
                      <option value="summary">总评</option>
                    </select>
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">评价内容</label>
                  <div class="field-input">
                    <span class="material-symbols-outlined">edit_note</span>
                    <textarea v-model="newSelfFeedback.content" placeholder="请输入评价内容..." rows="5"></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn-secondary" @click="cancelAddSelfFeedback"><span class="material-symbols-outlined">close</span>取消</button>
                <button class="btn-primary" @click="addSelfFeedback"><span class="material-symbols-outlined">save</span>保存评价</button>
              </div>
            </section>
          </div>
      </div>
    </main>
  </div>

  <!-- 新建任务弹窗 -->
  <div class="modal-shell" :class="{ open: isTaskModalOpen }">
    <div class="modal-backdrop" @click="closeTaskModal"></div>
    <section class="modal-panel glass-panel-strong workbench-task-modal">
      <div class="modal-header">
        <div>
          <span class="pill pill-ai">新建任务</span>
          <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">创建个人任务草稿</h2>
          <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">围绕个人工作台的日志、看板和 PBC 场景组织字段，先完成任务的项目归属、优先级、截止时间、日志同步和目标绑定，再进入看板持续推进。</p>
        </div>
        <button class="icon-btn" @click="closeTaskModal"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div class="workbench-task-layout">
        <aside class="workbench-task-side">
          <article class="glass-panel workbench-task-card">
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <span class="pill pill-warning">待处理</span>
              <span class="pill pill-ai">个人协同</span>
            </div>
            <h3 class="section-title" style="font-size: 26px; margin-top: 16px;">新建任务草稿</h3>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 12px;">适合作为工作台的快速任务入口，创建后可直接进入个人看板，也能同步到今日日志和 PBC 目标，减少在多个页面来回维护。</p>

            <div class="workbench-task-kpis">
              <div class="workbench-task-kpi">
                <span>默认状态</span>
                <strong>待开始</strong>
              </div>
              <div class="workbench-task-kpi">
                <span>推荐优先级</span>
                <strong>P1 / P2</strong>
              </div>
              <div class="workbench-task-kpi">
                <span>日志同步</span>
                <strong>可开启</strong>
              </div>
              <div class="workbench-task-kpi">
                <span>PBC 绑定</span>
                <strong>可选</strong>
              </div>
            </div>

            <div class="workbench-task-step-list">
              <div class="workbench-task-step">
                <div class="workbench-task-step-index">1</div>
                <div>
                  <h4>明确任务归属</h4>
                  <p>关联项目、负责人和任务类型会直接影响个人看板的列分布以及后续搜索筛选结果。</p>
                </div>
              </div>
              <div class="workbench-task-step">
                <div class="workbench-task-step-index">2</div>
                <div>
                  <h4>同步日志与提醒</h4>
                  <p>可在创建时决定是否把任务同步到今日日志、明日计划或阻塞问题区，减少重复记录。</p>
                </div>
              </div>
              <div class="workbench-task-step">
                <div class="workbench-task-step-index">3</div>
                <div>
                  <h4>考虑 PBC 绑定</h4>
                  <p>如果任务属于本周期重点推进事项，建议直接绑定目标，便于在工作台里跟踪达成率变化。</p>
                </div>
              </div>
            </div>
          </article>

          <article class="glass-panel workbench-task-card" style="background: linear-gradient(180deg, rgba(236,220,255,0.32), rgba(255,255,255,0.42));">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="material-symbols-outlined" style="color: var(--color-tertiary-600);">psychology</span>
              <h3 class="section-title" style="font-size: 22px;">AI 创建建议</h3>
            </div>
            <div class="workbench-task-step-list">
              <div class="workbench-task-step">
                <div class="workbench-task-step-index">A</div>
                <div>
                  <h4>优先补齐联调收尾任务</h4>
                  <p>如果任务和联调验证相关，建议直接设置为 P1，并补上验证说明，避免在看板中长期停留在“进行中”。</p>
                </div>
              </div>
              <div class="workbench-task-step">
                <div class="workbench-task-step-index">B</div>
                <div>
                  <h4>能绑定 PBC 就不要后补</h4>
                  <p>当前你的工作台里还有 2 个任务尚未绑定目标，新建阶段就补齐会让周期趋势和上级反馈更完整。</p>
                </div>
              </div>
            </div>
            <div class="workbench-task-owner-grid">
              <span class="workbench-task-owner"><img src="https://i.pravatar.cc/80?img=12" alt="张工" />张工</span>
              <span class="workbench-task-owner"><img src="https://i.pravatar.cc/80?img=22" alt="陈思远" />陈思远</span>
              <span class="workbench-task-owner"><img src="https://i.pravatar.cc/80?img=33" alt="王雅婷" />王雅婷</span>
            </div>
          </article>
        </aside>

        <div class="workbench-task-main">
          <article class="glass-panel workbench-task-card">
            <div class="workbench-task-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">基础信息</h3>
                <p class="section-caption" style="margin-top: 6px;">对应个人看板任务卡的主要展示字段</p>
              </div>
              <span class="pill pill-neutral">任务主字段</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">任务名称</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">task</span>
                  <input type="text" value="补齐联调验证说明与样本校验结论" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">关联项目</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">account_tree</span>
                  <select>
                    <option>纳米晶体结构优化</option>
                    <option>深度学习实验室自动化</option>
                    <option>通用事项</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="workbench-task-field-grid" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">负责人</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">person</span>
                  <select>
                    <option>张工</option>
                    <option>陈思远</option>
                    <option>王雅婷</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">任务优先级</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">flag</span>
                  <select>
                    <option>P1</option>
                    <option>P0</option>
                    <option>P2</option>
                    <option>P3</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">任务状态</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">pending_actions</span>
                  <select>
                    <option>待开始</option>
                    <option>进行中</option>
                    <option>待评审</option>
                    <option>已完成</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="workbench-task-template-grid">
              <div class="workbench-task-template active">
                <h4>日志跟进任务</h4>
                <p>适合从今日日志或明日计划中拆出明确动作项，创建后可同步回日志区。</p>
              </div>
              <div class="workbench-task-template">
                <h4>看板推进任务</h4>
                <p>适合在个人看板中持续跟踪的执行项，强调截止时间、优先级和进度表达。</p>
              </div>
              <div class="workbench-task-template">
                <h4>PBC 绑定任务</h4>
                <p>适合直接关联本周期目标，便于后续自动统计任务完成对目标的贡献度。</p>
              </div>
            </div>
          </article>

          <article class="glass-panel workbench-task-card">
            <div class="workbench-task-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">计划与说明</h3>
                <p class="section-caption" style="margin-top: 6px;">用于截止提醒、阻塞标记和任务卡补充说明</p>
              </div>
              <span class="pill pill-success">推进信息</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">开始日期</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">calendar_today</span>
                  <input type="text" value="2026-04-28" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">截止日期</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">event</span>
                  <input type="text" value="2026-04-29 18:00" />
                </div>
              </div>
            </div>

            <div class="workbench-task-field-grid" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">预计工时</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">schedule</span>
                  <input type="text" value="1.5d" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">当前进度</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">progress_activity</span>
                  <input type="text" value="0%" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">风险标记</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">warning</span>
                  <select>
                    <option>无</option>
                    <option>阻塞风险</option>
                    <option>联调风险</option>
                    <option>资源风险</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="workbench-task-status-grid">
              <div class="workbench-task-status-card">
                <span>提醒方式</span>
                <strong>站内 + 企微</strong>
              </div>
              <div class="workbench-task-status-card">
                <span>默认列</span>
                <strong>待开始</strong>
              </div>
              <div class="workbench-task-status-card">
                <span>日志同步</span>
                <strong>今天完成</strong>
              </div>
              <div class="workbench-task-status-card">
                <span>PBC 归属</span>
                <strong>可绑定</strong>
              </div>
            </div>

            <div class="field-stack workbench-task-textarea" style="margin-top: 16px;">
              <label class="field-label">任务说明</label>
              <div class="field-input">
                <span class="material-symbols-outlined" style="margin-top: 16px;">notes</span>
                <textarea>补齐联调验证中的说明文本、样本校验结论与相关引用，确保任务可以从“进行中”顺利推进到“待评审”，并为今日日志和 PBC 绑定保留可追踪依据。</textarea>
              </div>
            </div>

            <div class="workbench-task-chip-row">
              <button class="permission-chip on" type="button">同步到今日日志</button>
              <button class="permission-chip on" type="button">加入明日计划</button>
              <button class="permission-chip" type="button">标记为阻塞</button>
              <button class="permission-chip" type="button">@协作成员</button>
              <button class="permission-chip" type="button">生成子任务</button>
            </div>
          </article>

          <article class="glass-panel workbench-task-card">
            <div class="workbench-task-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">日志与 PBC 绑定</h3>
                <p class="section-caption" style="margin-top: 6px;">对应工作台日志区和 PBC 目标区的联动入口</p>
              </div>
              <span class="pill pill-warning">目标同步</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">日志归属区块</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">article</span>
                  <select>
                    <option>今日完成</option>
                    <option>明日计划</option>
                    <option>阻塞问题</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">绑定 PBC 目标</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">target</span>
                  <select>
                    <option>提升团队协作效率</option>
                    <option>完成协作管理系统首版上线</option>
                    <option>暂不绑定</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="workbench-task-field-grid" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">评审人</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">rate_review</span>
                  <select>
                    <option>陈思远</option>
                    <option>王雅婷</option>
                    <option>张工</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">通知对象</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">forward_to_inbox</span>
                  <input type="text" value="PM、QA、协作成员" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">任务标签</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">sell</span>
                  <input type="text" value="联调 / PBC / 验证说明" />
                </div>
              </div>
            </div>

            <div class="workbench-task-chip-row">
              <button class="permission-chip on" type="button">同步个人看板</button>
              <button class="permission-chip on" type="button">绑定 PBC 趋势</button>
              <button class="permission-chip on" type="button">进入待评审提醒</button>
              <button class="permission-chip" type="button">自动补齐日志草稿</button>
              <button class="permission-chip" type="button">通知上级反馈</button>
            </div>
          </article>
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-status">
          <span class="material-symbols-outlined">add_task</span>
          当前为样式参考弹窗，字段已按日志、看板和 PBC 三个工作台场景组织。
        </div>
        <div class="modal-footer-actions">
          <button class="btn-secondary" @click="closeTaskModal"><span class="material-symbols-outlined">close</span>取消</button>
          <button class="btn-secondary" @click="showToast('任务草稿已保存', '新建任务弹窗中的当前内容已保存为草稿，可继续调整字段与布局。', 'draft')"><span class="material-symbols-outlined">draft</span>保存草稿</button>
          <button class="btn-primary" @click="showToast('任务已创建', '任务草稿已同步到个人看板，并预留日志区与 PBC 目标的联动入口。', 'task_alt')"><span class="material-symbols-outlined">rocket_launch</span>创建任务</button>
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
        <p class="section-caption">当前上下文：个人工作台</p>
      </div>
      <button class="icon-btn" @click="closeAiDrawer"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="ai-card">
      <h4>工作建议</h4>
      <p>建议先生成今日日志草稿，再处理 2 个 P0 任务；这两个动作都可直接提升你的 PBC 达成率，并同步给上级看到进展。</p>
      <div class="ai-actions">
        <button class="btn-primary">立即生成</button>
        <button class="btn-secondary">稍后提醒</button>
      </div>
    </div>
    <div class="ai-list">
      <div class="ai-list-item">
        <h4>看板提醒</h4>
        <p>“设计自动化巡检告警”已接近截止时间，建议今天转为待评审前至少补齐验证说明。</p>
      </div>
      <div class="ai-list-item">
        <h4>PBC 建议</h4>
        <p>当前有 2 个任务尚未绑定目标，自动关联后你的周期趋势会更完整。</p>
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

  <!-- 列管理弹窗 -->
  <div class="modal-shell" :class="{ open: isColumnModalOpen }">
    <div class="modal-backdrop" @click="closeColumnModal"></div>
    <section class="modal-panel glass-panel-strong">
      <div class="modal-header">
        <div>
          <h2 class="section-title">{{ columnModalMode === 'add' ? '添加新列' : '编辑列' }}</h2>
          <p class="page-subtitle">{{ columnModalMode === 'add' ? '创建一个新的看板列' : '修改列的设置' }}</p>
        </div>
        <button class="icon-btn" @click="closeColumnModal"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="modal-body">
        <div class="field-stack">
          <label class="field-label">列名称</label>
          <div class="field-input">
            <span class="material-symbols-outlined">label</span>
            <input v-model="editingColumn.name" type="text" placeholder="请输入列名称" />
          </div>
        </div>
        <div class="field-stack">
          <label class="field-label">WIP 限制（可选）</label>
          <div class="field-input">
            <span class="material-symbols-outlined">limit</span>
            <input v-model.number="editingColumn.wipLimit" type="number" placeholder="不限制请留空" min="1" />
          </div>
          <p class="field-hint">WIP（在制品）限制可以帮助控制该列同时进行的任务数量</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="closeColumnModal"><span class="material-symbols-outlined">close</span>取消</button>
        <button class="btn-primary" @click="saveColumn"><span class="material-symbols-outlined">{{ columnModalMode === 'add' ? 'add' : 'save' }}</span>{{ columnModalMode === 'add' ? '添加列' : '保存修改' }}</button>
      </div>
    </section>
  </div>

  <!-- 看板任务管理弹窗 -->
  <div class="modal-shell" :class="{ open: isKanbanTaskModalOpen }">
    <div class="modal-backdrop" @click="closeKanbanTaskModal"></div>
    <section class="modal-panel glass-panel-strong">
      <div class="modal-header">
        <div>
          <h2 class="section-title">{{ taskModalMode === 'add' ? '添加任务' : '编辑任务' }}</h2>
          <p class="page-subtitle">{{ taskModalMode === 'add' ? '在当前列创建一个新任务' : '修改任务信息' }}</p>
        </div>
        <button class="icon-btn" @click="closeKanbanTaskModal"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="modal-body">
        <div class="field-stack">
          <label class="field-label">任务标题</label>
          <div class="field-input">
            <span class="material-symbols-outlined">task</span>
            <input v-model="editingTask.title" type="text" placeholder="请输入任务标题" />
          </div>
        </div>
        <div class="field-inline">
          <div class="field-stack">
            <label class="field-label">优先级</label>
            <div class="field-input">
              <span class="material-symbols-outlined">flag</span>
              <select v-model="editingTask.priority">
                <option value="P0">P0 - 紧急</option>
                <option value="P1">P1 - 高</option>
                <option value="P2">P2 - 中</option>
                <option value="P3">P3 - 低</option>
              </select>
            </div>
          </div>
          <div class="field-stack">
            <label class="field-label">截止时间</label>
            <div class="field-input">
              <span class="material-symbols-outlined">event</span>
              <input v-model="editingTask.deadline" type="text" placeholder="如：今天 18:00" />
            </div>
          </div>
        </div>
        <div class="field-stack">
          <label class="field-label">标签</label>
          <div class="field-input">
            <span class="material-symbols-outlined">sell</span>
            <input v-model="editingTask.tag" type="text" placeholder="如：里程碑、PBC绑定" />
          </div>
        </div>
        <div class="field-stack">
          <label class="field-label">进度</label>
          <div class="field-input">
            <span class="material-symbols-outlined">progress_activity</span>
            <select v-model="editingTask.progress">
              <option value="0%">0% - 未开始</option>
              <option value="25%">25%</option>
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%">100% - 已完成</option>
            </select>
          </div>
        </div>
        <div class="field-stack">
          <label class="field-label">任务描述</label>
          <div class="field-input">
            <span class="material-symbols-outlined">notes</span>
            <textarea v-model="editingTask.description" rows="3" placeholder="请输入任务描述..."></textarea>
          </div>
        </div>
        <div class="send-options">
          <label class="send-option">
            <input type="checkbox" v-model="editingTask.isBlocked" />
            <span>标记为阻塞</span>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="closeKanbanTaskModal"><span class="material-symbols-outlined">close</span>取消</button>
        <button v-if="taskModalMode === 'edit'" class="btn-danger" @click="deleteTask(editingTask.id); closeKanbanTaskModal()">
          <span class="material-symbols-outlined">delete</span>删除任务
        </button>
        <button class="btn-primary" @click="saveTask"><span class="material-symbols-outlined">{{ taskModalMode === 'add' ? 'add_task' : 'save' }}</span>{{ taskModalMode === 'add' ? '添加任务' : '保存修改' }}</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'

const router = useRouter()
const route = useRoute()

const currentUser = {
  name: '张工',
  role: '研发总监',
  avatar: 'https://i.pravatar.cc/80?img=12'
}

const activeTab = ref('logs')
const logsView = ref('view')
const logsFilter = ref('my')
const isTaskModalOpen = ref(false)
const isAiDrawerOpen = ref(false)
const toast = ref({ show: false, title: '', message: '', icon: '' })

// 日志模板配置
const templates = {
  daily: {
    title: '日报模板',
    placeholder: '请输入今日完成的工作内容...',
    showPending: true,
    showNeedHelp: true
  },
  weekly: {
    title: '周报模板',
    placeholder: '请输入本周工作总结...',
    showPending: true,
    showNeedHelp: true
  },
  project: {
    title: '项目进度汇报',
    placeholder: '请输入项目进度情况...',
    showPending: false,
    showNeedHelp: true
  },
  simple: {
    title: '简单汇报',
    placeholder: '请输入汇报内容...',
    showPending: false,
    showNeedHelp: false
  }
}

const selectedTemplate = ref('daily')

const currentTemplateTitle = computed(() => templates[selectedTemplate.value].title)
const currentTemplatePlaceholder = computed(() => templates[selectedTemplate.value].placeholder)
const showPending = computed(() => templates[selectedTemplate.value].showPending)
const showNeedHelp = computed(() => templates[selectedTemplate.value].showNeedHelp)

// 日志表单数据
const logForm = ref({
  completed: '',
  pending: '',
  needHelp: '',
  images: [],
  attachments: [],
  recipients: [],
  sendToChat: false,
  onlyReceiverCanSee: false,
  scheduledSend: false
})

// 可选接收人列表
const availableRecipients = ref([
  { id: 1, name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22', isSelected: false },
  { id: 2, name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33', isSelected: false },
  { id: 3, name: '李明', avatar: 'https://i.pravatar.cc/80?img=44', isSelected: false },
  { id: 4, name: '赵雪', avatar: 'https://i.pravatar.cc/80?img=55', isSelected: false },
  { id: 5, name: '周杰', avatar: 'https://i.pravatar.cc/80?img=66', isSelected: false }
])

// 模拟日志数据
const logsData = ref([
  {
    id: 1,
    author: '张工',
    avatar: 'https://i.pravatar.cc/80?img=12',
    time: '今天 18:30',
    type: 'daily',
    completed: '1. 完成 Q3 实验室能效评估报告初稿；2. 审核联调验证阶段的任务分配；3. 同步日报结构化字段到工作台。',
    pending: '1. 跟进平台组联调环境准备；2. 与 QA 确认回归验证样本池。',
    needHelp: '当前「联调环境参数回灌」任务仍缺少资源窗口确认，建议今天 15:00 前与平台组和 QA 共同确认。',
    images: [],
    attachments: ['Q3能效评估报告.docx'],
    likes: 5,
    comments: 2,
    readCount: 12,
    liked: false,
    isMine: true,
    commentList: [
      { id: 1, author: '李经理', avatar: 'https://i.pravatar.cc/80?img=44', content: '报告写得很详细，继续加油！', time: '18:45' },
      { id: 2, author: '王小芳', avatar: 'https://i.pravatar.cc/80?img=55', content: '已收到，会尽快确认资源窗口。', time: '19:00' }
    ]
  },
  {
    id: 2,
    author: '陈思远',
    avatar: 'https://i.pravatar.cc/80?img=22',
    time: '今天 17:45',
    type: 'daily',
    completed: '1. 完成项目文档评审；2. 同步技术方案给前端团队；3. 修复了3个线上bug。',
    pending: '',
    needHelp: '',
    images: ['https://picsum.photos/400/300'],
    attachments: [],
    likes: 8,
    comments: 3,
    readCount: 15,
    liked: true,
    isMine: false,
    commentList: [
      { id: 1, author: '张工', avatar: 'https://i.pravatar.cc/80?img=12', content: 'bug修复得很及时，赞！', time: '18:00' },
      { id: 2, author: '技术组', avatar: 'https://i.pravatar.cc/80?img=66', content: '方案已收到，正在评估中。', time: '18:30' },
      { id: 3, author: '产品组', avatar: 'https://i.pravatar.cc/80?img=77', content: '期待后续进展。', time: '18:45' }
    ]
  },
  {
    id: 3,
    author: '王雅婷',
    avatar: 'https://i.pravatar.cc/80?img=33',
    time: '今天 16:20',
    type: 'daily',
    completed: '1. 设计评审会议准备完成；2. 更新了项目进度甘特图；3. 整理了需求文档。',
    pending: '1. 下周计划制定；2. 跨部门协作事项跟进。',
    needHelp: '需要确认设计稿最终版本的截止时间。',
    images: ['https://picsum.photos/400/300', 'https://picsum.photos/400/300'],
    attachments: ['设计稿v2.fig'],
    likes: 12,
    comments: 5,
    readCount: 18,
    liked: false,
    isMine: false,
    commentList: [
      { id: 1, author: '项目经理', avatar: 'https://i.pravatar.cc/80?img=88', content: '设计稿请在本周五前提交。', time: '16:30' },
      { id: 2, author: '前端组', avatar: 'https://i.pravatar.cc/80?img=99', content: '甘特图已同步，会按计划推进。', time: '17:00' },
      { id: 3, author: '张工', avatar: 'https://i.pravatar.cc/80?img=12', content: '需求文档已阅读，有几个疑问稍后沟通。', time: '17:20' },
      { id: 4, author: '测试组', avatar: 'https://i.pravatar.cc/80?img=100', content: '期待设计稿，准备测试用例。', time: '17:45' },
      { id: 5, author: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33', content: '收到，会按时完成！', time: '18:00' }
    ]
  },
  {
    id: 4,
    author: '张工',
    avatar: 'https://i.pravatar.cc/80?img=12',
    time: '昨天 19:00',
    type: 'daily',
    completed: '1. 完成项目启动会；2. 确定了技术架构方案；3. 分配了开发任务。',
    pending: '',
    needHelp: '',
    images: [],
    attachments: [],
    likes: 15,
    comments: 4,
    readCount: 22,
    liked: false,
    isMine: true,
    commentList: [
      { id: 1, author: '李经理', avatar: 'https://i.pravatar.cc/80?img=44', content: '项目启动顺利，继续保持！', time: '19:30' },
      { id: 2, author: '团队成员', avatar: 'https://i.pravatar.cc/80?img=101', content: '任务已收到，会按时完成。', time: '20:00' },
      { id: 3, author: '架构师', avatar: 'https://i.pravatar.cc/80?img=102', content: '技术方案已审核通过。', time: '20:30' },
      { id: 4, author: 'QA负责人', avatar: 'https://i.pravatar.cc/80?img=103', content: '测试计划已制定，同步给大家。', time: '21:00' }
    ]
  }
])

// 过滤后的日志
const filteredLogs = computed(() => {
  if (logsFilter.value === 'my') {
    return logsData.value.filter(log => log.isMine)
  } else {
    return logsData.value.filter(log => !log.isMine)
  }
})

// 评论弹窗相关
const showCommentModal = ref(false)
const currentLogId = ref(null)
const newComment = ref('')

const openCommentModal = (logId) => {
  currentLogId.value = logId
  showCommentModal.value = true
  newComment.value = ''
}

const closeCommentModal = () => {
  showCommentModal.value = false
  currentLogId.value = null
  newComment.value = ''
}

const addComment = () => {
  if (!newComment.value.trim()) {
    showToast('请输入评论内容', '评论内容不能为空', 'warning')
    return
  }
  
  const log = logsData.value.find(l => l.id === currentLogId.value)
  if (log) {
    log.commentList.push({
      id: log.commentList.length + 1,
      author: '我',
      avatar: 'https://i.pravatar.cc/80?img=1',
      content: newComment.value,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
    log.comments++
    showToast('评论已发送', '成功添加评论', 'add')
    newComment.value = ''
  }
}

// 优先级过滤状态
const priorityFilter = ref('all')
const deadlineFilter = ref('all')
const blockedFilter = ref('all')

// 拖拽滚动相关
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const kanbanRef = ref(null)

const isThisWeekDeadline = (deadline) => {
  const weekKeywords = ['今天', '周三', '周五', '本周', '本周五']
  return weekKeywords.some(keyword => deadline.includes(keyword))
}

const isAllFilterActive = computed(() => {
  return priorityFilter.value === 'all' && deadlineFilter.value === 'all' && blockedFilter.value === 'all'
})

const resetAllFilters = () => {
  priorityFilter.value = 'all'
  deadlineFilter.value = 'all'
  blockedFilter.value = 'all'
}

// PBC数据结构
const pbcData = ref({
  employeeName: '绿凯',
  period: '2026年5月',
  project: 'PBC-tob项目-毕设',
  objectives: [
    {
      id: 1,
      category: 'KPI',
      title: 'AI项目管理系统MVP',
      keyTasks: '完成所有页面的功能保证后端接口与前端联系的上',
      deadline: '5月25日',
      measurement: '前端页面均可使用无明显bug',
      weight: 20,
      progress: 85
    },
    {
      id: 2,
      category: 'KPI',
      title: '毕设项目稳定性',
      keyTasks: '修复bug',
      deadline: '5月31日',
      measurement: '及时解决提出的问题，无重大bug',
      weight: 10,
      progress: 60
    },
    {
      id: 3,
      category: 'KPI',
      title: '项目管理项目',
      keyTasks: '一期MVP完成-5月30日完成',
      deadline: '5月31日',
      measurement: '验收可以通过',
      weight: 35,
      progress: 70
    },
    {
      id: 4,
      category: '重点工作',
      title: '毕设优化',
      keyTasks: '及时修复与优化',
      deadline: '5月31日',
      measurement: '在提出问题时可以一天内解决',
      weight: 20,
      progress: 45
    },
    {
      id: 5,
      category: '重点工作',
      title: '组织建设',
      keyTasks: '1、按时完成安排事项\n2、遵守公司规章制度\n3、打卡和日报',
      deadline: '5月31日',
      measurement: '1、leader满意度\n2、行为符合规章制度要求\n3、打卡记录与日报记录，需达到90%',
      weight: 15,
      progress: 90
    }
  ],
  feedbacks: [
    {
      id: 1,
      type: 'self',
      category: 'temporary',
      content: '本周期已完成 5 个关键任务，联调与日报效率改造推进正常，但成员负载治理仍需继续跟进。',
      time: '2024-01-15'
    },
    {
      id: 2,
      type: 'self',
      category: 'summary',
      content: '总体来看，本周期工作进展顺利，各项任务按计划推进。团队协作效率提升明显，但在资源分配和成员负载管理方面仍有改进空间。建议下周期加强智能分配功能的开发，进一步优化工作流程。',
      time: '2024-01-15'
    },
    {
      id: 3,
      type: 'manager',
      content: '方向正确，建议下周期把"负载热力图 + 智能分配"作为核心推进项，并补齐反馈闭环。',
      time: '2024-01-16'
    }
  ],
  aiTrend: {
    prediction: '73%',
    days: 7,
    suggestion: '建议优先绑定两项联调收尾任务。'
  }
})

// 添加自评相关
const showAddSelfFeedback = ref(false)
const newSelfFeedback = ref({
  category: 'temporary',
  content: ''
})

const addSelfFeedback = () => {
  if (!newSelfFeedback.value.content.trim()) {
    showToast('请输入评价内容', '评价内容不能为空', 'warning')
    return
  }
  
  pbcData.value.feedbacks.push({
    id: pbcData.value.feedbacks.length + 1,
    type: 'self',
    category: newSelfFeedback.value.category,
    content: newSelfFeedback.value.content,
    time: new Date().toISOString().split('T')[0]
  })
  
  showToast('自评已添加', '成功添加新的自评内容', 'add')
  cancelAddSelfFeedback()
}

const cancelAddSelfFeedback = () => {
  showAddSelfFeedback.value = false
  newSelfFeedback.value = {
    category: 'temporary',
    content: ''
  }
}

// 编写/编辑PBC相关
const isWritingPbc = ref(false)
const editingPbcId = ref(null)
const writingPbcData = ref({
  category: 'KPI',
  title: '',
  keyTasks: '',
  deadline: '',
  measurement: '',
  weight: 20,
  progress: 0
})

const startWritingPbc = () => {
  isWritingPbc.value = true
  editingPbcId.value = null
  writingPbcData.value = {
    category: 'KPI',
    title: '',
    keyTasks: '',
    deadline: '',
    measurement: '',
    weight: 20,
    progress: 0
  }
}

const editPbc = (objective) => {
  isWritingPbc.value = true
  editingPbcId.value = objective.id
  writingPbcData.value = {
    category: objective.category,
    title: objective.title,
    keyTasks: objective.keyTasks,
    deadline: objective.deadline,
    measurement: objective.measurement,
    weight: objective.weight,
    progress: objective.progress
  }
}

const savePbc = () => {
  if (!writingPbcData.value.title.trim()) {
    showToast('请输入目标名称', '目标名称不能为空', 'warning')
    return
  }
  
  if (editingPbcId.value) {
    // 编辑模式
    const index = pbcData.value.objectives.findIndex(o => o.id === editingPbcId.value)
    if (index !== -1) {
      pbcData.value.objectives[index] = {
        ...pbcData.value.objectives[index],
        ...writingPbcData.value
      }
      showToast('PBC目标已更新', `已成功更新目标"${writingPbcData.value.title}"`, 'update')
    }
  } else {
    // 添加模式
    const newObjective = {
      id: pbcData.value.objectives.length + 1,
      category: writingPbcData.value.category,
      title: writingPbcData.value.title,
      keyTasks: writingPbcData.value.keyTasks,
      deadline: writingPbcData.value.deadline,
      measurement: writingPbcData.value.measurement,
      weight: writingPbcData.value.weight,
      progress: writingPbcData.value.progress
    }
    
    pbcData.value.objectives.push(newObjective)
    showToast('PBC目标已创建', `已成功创建目标"${writingPbcData.value.title}"`, 'add')
  }
  cancelWritingPbc()
}

const cancelWritingPbc = () => {
  isWritingPbc.value = false
  editingPbcId.value = null
  writingPbcData.value = {
    category: 'KPI',
    title: '',
    keyTasks: '',
    deadline: '',
    measurement: '',
    weight: 20,
    progress: 0
  }
}

const toggleBlockedFilter = () => {
  blockedFilter.value = blockedFilter.value === 'all' ? 'blocked' : 'all'
}

// 看板列数据结构
const kanbanData = ref([
  {
    id: 1,
    name: '待开始',
    wipLimit: 5,
    tasks: [
      { id: 1, title: '更新联调验证脚本', priority: 'P1', tag: '里程碑', deadline: '今天 18:00', progress: '0%', description: '更新联调验证脚本以支持新的测试用例' },
      { id: 2, title: '同步样本误差分析结论', priority: 'P2', tag: 'PBC 绑定', deadline: '明天 12:00', progress: '0%', description: '同步样本误差分析结论给相关团队' }
    ]
  },
  {
    id: 2,
    name: '进行中',
    wipLimit: 3,
    tasks: [
      { id: 3, title: '设计自动化巡检告警', priority: 'P0', tag: '阻塞风险', deadline: '周三', progress: '45%', description: '设计自动化巡检告警系统' },
      { id: 4, title: '补齐 SOP 文档结构', priority: 'P3', deadline: '周五', progress: '20%', description: '完善SOP文档结构' }
    ]
  },
  {
    id: 3,
    name: '待评审',
    wipLimit: 4,
    tasks: [
      { id: 5, title: '确认阻塞依赖任务说明', priority: 'P0', tag: '已阻塞', deadline: '协议接口未冻结', progress: '80%', isBlocked: true, description: '确认阻塞依赖任务说明，等待协议接口冻结' }
    ]
  },
  {
    id: 4,
    name: '已完成',
    wipLimit: null,
    tasks: [
      { id: 6, title: '完成本周 PBC 自评', priority: 'P1', deadline: '本周五', progress: '100%', description: '完成本周PBC自评报告' },
      { id: 7, title: '整理团队日报最佳实践', priority: 'P2', tag: '', deadline: '下周一', progress: '100%', description: '整理团队日报最佳实践文档' }
    ]
  }
])

// 拖拽相关状态
const draggedTask = ref(null)
const draggedFromColumn = ref(null)
const dragOverColumn = ref(null)
const showColumnMenu = ref(null)
const showTaskMenu = ref(null)

// 列管理弹窗
const isColumnModalOpen = ref(false)
const editingColumn = ref({ name: '', wipLimit: 5 })
const columnModalMode = ref('add')

// 看板任务管理弹窗
const isKanbanTaskModalOpen = ref(false)
const editingTask = ref({ title: '', priority: 'P2', tag: '', deadline: '', progress: '0%', description: '', isBlocked: false })
const taskModalMode = ref('add')
const currentColumnId = ref(null)

const filteredKanbanData = computed(() => {
  const hasActiveFilter = priorityFilter.value !== 'all' || deadlineFilter.value !== 'all' || blockedFilter.value !== 'all'
  
  return kanbanData.value.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      if (priorityFilter.value !== 'all' && task.priority !== priorityFilter.value.toUpperCase()) {
        return false
      }
      if (deadlineFilter.value === 'week' && !isThisWeekDeadline(task.deadline)) {
        return false
      }
      if (blockedFilter.value === 'blocked' && !task.isBlocked) {
        return false
      }
      return true
    })
  })).filter(column => !hasActiveFilter || column.tasks.length > 0)
})

const togglePriorityFilter = () => {
  if (priorityFilter.value === 'all' || priorityFilter.value === 'p1') {
    priorityFilter.value = 'p0'
  } else {
    priorityFilter.value = 'p1'
  }
}

const toggleDeadlineFilter = () => {
  deadlineFilter.value = deadlineFilter.value === 'all' ? 'week' : 'all'
}

// 拖拽滚动事件处理
const handleMouseDown = (e) => {
  if (!kanbanRef.value) return
  isDragging.value = true
  startX.value = e.pageX - kanbanRef.value.offsetLeft
  scrollLeft.value = kanbanRef.value.scrollLeft
}

const handleMouseMove = (e) => {
  if (!isDragging.value || !kanbanRef.value) return
  e.preventDefault()
  const x = e.pageX - kanbanRef.value.offsetLeft
  const walk = (x - startX.value) * 1.5
  kanbanRef.value.scrollLeft = scrollLeft.value - walk
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleMouseLeave = () => {
  isDragging.value = false
}

const handleNavigate = (path) => {
  router.push(path)
}

onMounted(() => {
  const tab = route.query.tab
  if (tab && ['logs', 'kanban', 'pbc'].includes(tab)) {
    activeTab.value = tab
  }
})

// 日志相关方法
const loadTemplate = () => {
  logForm.value.pending = ''
  logForm.value.needHelp = ''
}

const toggleRecipient = (id) => {
  const index = logForm.value.recipients.indexOf(id)
  if (index > -1) {
    logForm.value.recipients.splice(index, 1)
  } else {
    logForm.value.recipients.push(id)
  }
}

const triggerImageUpload = () => {
  document.getElementById('image-upload').click()
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      logForm.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
  event.target.value = ''
}

const removeImage = (index) => {
  logForm.value.images.splice(index, 1)
}

const triggerFileUpload = () => {
  document.getElementById('file-upload').click()
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    logForm.value.attachments.push(file.name)
  })
  event.target.value = ''
}

const removeAttachment = (index) => {
  logForm.value.attachments.splice(index, 1)
}

const toggleLike = (id) => {
  const log = logsData.value.find(l => l.id === id)
  if (log) {
    if (log.liked) {
      log.likes--
      log.liked = false
    } else {
      log.likes++
      log.liked = true
    }
  }
}

const autoFillLog = () => {
  logForm.value.completed = '1. 完成 Q3 实验室能效评估报告初稿；2. 审核联调验证阶段的任务分配；3. 同步日报结构化字段到工作台。'
  logForm.value.pending = '1. 跟进平台组联调环境准备；2. 与 QA 确认回归验证样本池。'
  showToast('AI 已填充', '日报内容已根据今日任务自动填充', 'auto_awesome')
}

const saveDraft = () => {
  showToast('草稿已保存', '日志草稿已保存，可稍后继续编辑', 'save')
}

const submitLog = () => {
  if (!logForm.value.completed.trim()) {
    showToast('请填写内容', '请至少填写今日完成的工作内容', 'warning')
    return
  }
  showToast('日志已提交', '日志已成功提交并发送给指定接收人', 'send')
  logForm.value = {
    completed: '',
    pending: '',
    needHelp: '',
    images: [],
    attachments: [],
    recipients: [],
    sendToChat: false,
    onlyReceiverCanSee: false,
    scheduledSend: false
  }
}

const openTaskModal = () => {
  isTaskModalOpen.value = true
}

const closeTaskModal = () => {
  isTaskModalOpen.value = false
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

// 看板列管理方法
const openColumnModal = (mode, column = null) => {
  columnModalMode.value = mode
  if (mode === 'edit') {
    editingColumn.value = { ...column }
  } else {
    editingColumn.value = { name: '', wipLimit: 5 }
  }
  isColumnModalOpen.value = true
}

const closeColumnModal = () => {
  isColumnModalOpen.value = false
  editingColumn.value = { name: '', wipLimit: 5 }
}

const saveColumn = () => {
  if (!editingColumn.value.name.trim()) {
    showToast('请输入列名称', '列名称不能为空', 'warning')
    return
  }
  if (columnModalMode.value === 'add') {
    const newId = Math.max(...kanbanData.value.map(c => c.id)) + 1
    kanbanData.value.push({
      id: newId,
      name: editingColumn.value.name,
      wipLimit: editingColumn.value.wipLimit || null,
      tasks: []
    })
    showToast('列已添加', `已成功添加 "${editingColumn.value.name}" 列`, 'add')
  } else {
    const column = kanbanData.value.find(c => c.id === editingColumn.value.id)
    if (column) {
      column.name = editingColumn.value.name
      column.wipLimit = editingColumn.value.wipLimit || null
    }
    showToast('列已更新', `已成功更新 "${editingColumn.value.name}" 列`, 'update')
  }
  closeColumnModal()
}

const deleteColumn = (columnId) => {
  const column = kanbanData.value.find(c => c.id === columnId)
  if (!column) return
  
  if (column.tasks.length > 0) {
    showToast('无法删除', '请先将该列的所有任务移走', 'error')
    return
  }
  
  kanbanData.value = kanbanData.value.filter(c => c.id !== columnId)
  showToast('列已删除', '已成功删除该列', 'delete')
}

const moveColumn = (columnId, direction) => {
  const index = kanbanData.value.findIndex(c => c.id === columnId)
  if (direction === 'up' && index > 0) {
    const temp = kanbanData.value[index]
    kanbanData.value[index] = kanbanData.value[index - 1]
    kanbanData.value[index - 1] = temp
  } else if (direction === 'down' && index < kanbanData.value.length - 1) {
    const temp = kanbanData.value[index]
    kanbanData.value[index] = kanbanData.value[index + 1]
    kanbanData.value[index + 1] = temp
  }
}

// 看板任务管理方法
const openKanbanTaskModal = (mode, task = null, columnId = null) => {
  taskModalMode.value = mode
  currentColumnId.value = columnId
  if (mode === 'edit') {
    editingTask.value = { ...task }
  } else {
    editingTask.value = {
      title: '',
      priority: 'P2',
      tag: '',
      deadline: '',
      progress: '0%',
      description: ''
    }
  }
  isKanbanTaskModalOpen.value = true
}

const closeKanbanTaskModal = () => {
  isKanbanTaskModalOpen.value = false
  editingTask.value = { title: '', priority: 'P2', tag: '', deadline: '', progress: '0%', description: '', isBlocked: false }
  currentColumnId.value = null
}

const saveTask = () => {
  if (!editingTask.value.title.trim()) {
    showToast('请输入任务标题', '任务标题不能为空', 'warning')
    return
  }
  
  const column = kanbanData.value.find(c => c.id === currentColumnId.value)
  if (!column) {
    showToast('错误', '未找到目标列', 'error')
    return
  }
  
  // 检查WIP限制
  if (column.wipLimit && taskModalMode.value === 'add' && column.tasks.length >= column.wipLimit) {
    showToast('WIP限制', `该列已达到WIP限制(${column.wipLimit}个任务)`, 'warning')
    return
  }
  
  if (taskModalMode.value === 'add') {
    const newId = Math.max(...kanbanData.value.flatMap(c => c.tasks.map(t => t.id)), 0) + 1
    column.tasks.push({
      id: newId,
      ...editingTask.value,
      isBlocked: editingTask.value.isBlocked || false
    })
    showToast('任务已添加', '已成功添加新任务', 'add_task')
  } else {
    // 更新任务
    const targetColumn = kanbanData.value.find(c => 
      c.tasks.some(t => t.id === editingTask.value.id)
    )
    if (targetColumn) {
      const taskIndex = targetColumn.tasks.findIndex(t => t.id === editingTask.value.id)
      if (taskIndex > -1) {
        targetColumn.tasks[taskIndex] = { ...editingTask.value }
      }
    }
    showToast('任务已更新', '已成功更新任务', 'update')
  }
  closeKanbanTaskModal()
}

const deleteTask = (taskId) => {
  for (const column of kanbanData.value) {
    const index = column.tasks.findIndex(t => t.id === taskId)
    if (index > -1) {
      column.tasks.splice(index, 1)
      showToast('任务已删除', '已成功删除任务', 'delete')
      return
    }
  }
}

// 拖拽方法
const handleTaskDragStart = (task, columnId) => {
  draggedTask.value = task
  draggedFromColumn.value = columnId
}

const handleTaskDragOver = (e, columnId) => {
  e.preventDefault()
  dragOverColumn.value = columnId
}

const handleTaskDragLeave = () => {
  dragOverColumn.value = null
}

const handleTaskDrop = (targetColumnId) => {
  if (!draggedTask.value || draggedFromColumn.value === targetColumnId) {
    draggedTask.value = null
    draggedFromColumn.value = null
    dragOverColumn.value = null
    return
  }
  
  const targetColumn = kanbanData.value.find(c => c.id === targetColumnId)
  
  // 检查WIP限制
  if (targetColumn.wipLimit && targetColumn.tasks.length >= targetColumn.wipLimit) {
    showToast('WIP限制', `目标列已达到WIP限制(${targetColumn.wipLimit}个任务)`, 'warning')
    draggedTask.value = null
    draggedFromColumn.value = null
    dragOverColumn.value = null
    return
  }
  
  // 从原列移除
  const sourceColumn = kanbanData.value.find(c => c.id === draggedFromColumn.value)
  if (sourceColumn) {
    const taskIndex = sourceColumn.tasks.findIndex(t => t.id === draggedTask.value.id)
    if (taskIndex > -1) {
      sourceColumn.tasks.splice(taskIndex, 1)
    }
  }
  
  // 添加到目标列
  if (targetColumn) {
    targetColumn.tasks.push({ ...draggedTask.value })
  }
  
  showToast('任务已移动', '任务已成功移动到目标列', 'move')
  
  draggedTask.value = null
  draggedFromColumn.value = null
  dragOverColumn.value = null
}

const toggleColumnMenu = (columnId) => {
  showColumnMenu.value = showColumnMenu.value === columnId ? null : columnId
}

const toggleTaskMenu = (taskId) => {
  showTaskMenu.value = showTaskMenu.value === taskId ? null : taskId
}

const updateTaskProgress = (taskId, progress) => {
  for (const column of kanbanData.value) {
    const task = column.tasks.find(t => t.id === taskId)
    if (task) {
      task.progress = progress
      if (progress === '100%') {
        // 移动到已完成列
        const doneColumn = kanbanData.value.find(c => c.name === '已完成')
        if (doneColumn && column.id !== doneColumn.id) {
          const index = column.tasks.findIndex(t => t.id === taskId)
          if (index > -1) {
            column.tasks.splice(index, 1)
            doneColumn.tasks.push(task)
          }
        }
      }
      break
    }
  }
}
</script>

<style scoped>
/* 日志头部样式 */
.logs-header {
  padding: 16px 24px;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.logs-tabs {
  display: flex;
  gap: 8px;
}

.logs-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  background: transparent;
  border: 1px solid rgba(216, 221, 232, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.logs-tab-btn.active {
  background: var(--color-primary-600);
  color: white;
  border-color: var(--color-primary-600);
}

.logs-filter {
  display: flex;
  gap: 8px;
}

/* 日志卡片样式 */
.logs-view-container {
  margin-bottom: 24px;
}

.log-card {
  padding: 24px;
  border-radius: 24px;
  margin-bottom: 16px;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.log-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.log-meta h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.log-time {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.log-badge {
  margin-left: auto;
}

.log-content {
  margin-bottom: 16px;
}

.log-section {
  margin-bottom: 12px;
}

.log-section:last-child {
  margin-bottom: 0;
}

.log-section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin-bottom: 6px;
}

.log-section p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.log-images {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.log-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}

.log-attachments {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.log-attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(216, 221, 232, 0.3);
  border-radius: 12px;
  font-size: 13px;
}

.log-actions {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(216, 221, 232, 0.3);
}

.log-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.log-action-btn:hover {
  color: var(--color-primary-600);
}

.log-action-btn .liked {
  color: var(--color-primary-600);
}

/* 评论弹窗样式 */
.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(216, 221, 232, 0.3);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.comment-author {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.comment-time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--color-text-secondary);
}

.empty-comments .material-symbols-outlined {
  font-size: 48px;
  opacity: 0.5;
  margin-bottom: 12px;
}

.empty-comments p {
  font-size: 14px;
  margin: 0;
}

.comment-input-area {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(216, 221, 232, 0.3);
  background: rgba(255, 255, 255, 0.5);
}

.comment-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(216, 221, 232, 0.5);
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.comment-input:focus {
  border-color: var(--color-primary-400);
}

/* 写日志样式 */
.logs-write-container {
  margin-bottom: 24px;
}

.template-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(216, 221, 232, 0.3);
  border-radius: 12px;
}

.template-selector select {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border: 2px dashed rgba(216, 221, 232, 0.5);
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  border-color: var(--color-primary-400);
  background: rgba(20, 104, 199, 0.05);
}

.uploaded-images {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.uploaded-image {
  position: relative;
  width: 120px;
  height: 120px;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-danger-600);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uploaded-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(216, 221, 232, 0.3);
  border-radius: 12px;
}

.remove-file {
  margin-left: auto;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-tertiary);
}

.recipient-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.recipient-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(216, 221, 232, 0.3);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recipient-item.selected {
  background: var(--color-primary-600);
  color: white;
}

.recipient-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.check-icon {
  font-size: 14px;
}

.add-recipient {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px dashed rgba(216, 221, 232, 0.5);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.send-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.send-option input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.submit-bar {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  background: rgba(216, 221, 232, 0.2);
  border-radius: 24px;
  margin-top: 16px;
}

.submit-bar button {
  min-height: 44px;
  padding: 0 24px;
}

/* Toast 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 看板样式 */
.kanban-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(20, 104, 199, 0.08);
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.kanban {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
}

.kanban::-webkit-scrollbar {
  display: none;
}

.kanban.dragging {
  cursor: grabbing;
}

/* PBC表格样式 */
.pbc-table-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.pbc-table-wrapper::-webkit-scrollbar {
  display: none;
}

.pbc-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.pbc-table th,
.pbc-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(216, 221, 232, 0.3);
}

.pbc-table th {
  background: rgba(20, 104, 199, 0.05);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.pbc-table tbody tr:hover {
  background: rgba(20, 104, 199, 0.03);
}

.pbc-th-name {
  width: 80px;
}

.pbc-th-category {
  width: 100px;
}

.pbc-th-title {
  width: 180px;
}

.pbc-th-tasks {
  width: 250px;
}

.pbc-th-deadline {
  width: 100px;
}

.pbc-th-measure {
  width: 220px;
}

.pbc-th-weight {
  width: 60px;
  text-align: center;
}

.pbc-th-progress {
  width: 120px;
}

.pbc-td-name {
  font-weight: 600;
}

.pbc-td-tasks,
.pbc-td-measure {
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-line;
}

.pbc-td-deadline {
  color: var(--color-primary-600);
  font-weight: 500;
}

.pbc-td-weight {
  text-align: center;
  font-weight: 600;
}

.mini-progress {
  height: 6px;
  background: rgba(216, 221, 232, 0.5);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.pbc-row-clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.pbc-row-clickable:hover {
  background: rgba(20, 104, 199, 0.08) !important;
  transform: scale(1.002);
}

.pbc-row-clickable:active {
  transform: scale(0.998);
}

/* 反馈区域样式 */
.feedback-section {
  padding: 16px;
  background: rgba(20, 104, 199, 0.03);
  border-radius: 12px;
}

.feedback-section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.feedback-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.feedback-bubble.self {
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.1), rgba(20, 104, 199, 0.05));
  border-left: 3px solid var(--color-primary-500);
}

.feedback-bubble.self.summary {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05));
  border-left: 3px solid var(--color-purple-500);
}

.feedback-bubble.manager {
  background: rgba(248, 250, 252, 0.8);
  border-left: 3px solid var(--color-warning-500);
  border: 1px solid rgba(216, 221, 232, 0.5);
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feedback-category {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary-600);
  padding: 2px 8px;
  background: rgba(20, 104, 199, 0.1);
  border-radius: 10px;
}

.feedback-category.summary-tag {
  background: rgba(139, 92, 246, 0.1);
  color: var(--color-purple-600);
}

.feedback-time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.feedback-content {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* AI建议区域样式 */
.ai-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ai-trend-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  margin-bottom: 20px;
}

.ai-trend-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-purple-500));
  border-radius: 12px;
}

.ai-trend-icon .material-symbols-outlined {
  color: white;
  font-size: 24px;
}

.ai-trend-content {
  flex: 1;
}

.ai-trend-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 6px 0;
}

.ai-trend-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-primary);
  margin: 0;
}

.ai-trend-text strong {
  color: var(--color-primary-600);
}

.ai-suggestions {
  margin-bottom: 20px;
}

.ai-suggestions-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.suggestion-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.ai-actions {
  display: flex;
  gap: 12px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.kanban-column {
  flex-shrink: 0;
  width: 320px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.kanban-column.drag-over {
  border: 2px dashed var(--color-primary-400);
  background: rgba(20, 104, 199, 0.05);
}

.kanban-column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(216, 221, 232, 0.3);
}

.kanban-column-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kanban-column-title h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.wip-limit {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  padding: 4px 10px;
  background: rgba(216, 221, 232, 0.5);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.wip-limit.wip-warning {
  background: rgba(255, 193, 7, 0.2);
  color: var(--color-warning-600);
}

.kanban-column-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.kanban-column-actions .icon-btn {
  width: 32px;
  height: 32px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.kanban-column-actions .icon-btn:hover:not(:disabled) {
  opacity: 1;
}

.kanban-column-actions .icon-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.kanban-tasks {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.kanban-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: grab;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.kanban-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.kanban-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.kanban-card-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  flex: 1;
  line-height: 1.4;
}

.kanban-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(216, 221, 232, 0.5);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  min-width: 40px;
  text-align: right;
}

.add-task-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: 2px dashed rgba(216, 221, 232, 0.5);
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.add-task-btn:hover {
  border-color: var(--color-primary-400);
  background: rgba(20, 104, 199, 0.05);
  color: var(--color-primary-600);
}

/* 下拉菜单 */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 8px;
  min-width: 160px;
  z-index: 100;
}

.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
  transition: background 0.2s;
}

.dropdown-menu button:hover {
  background: rgba(216, 221, 232, 0.5);
}

.dropdown-menu button.danger {
  color: var(--color-danger-600);
}

.dropdown-menu button.danger:hover {
  background: rgba(255, 218, 214, 0.5);
}

.dropdown-menu hr {
  margin: 8px 0;
  border: none;
  border-top: 1px solid rgba(216, 221, 232, 0.5);
}

/* 弹窗样式 */
.modal-shell {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-shell.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal-panel {
  position: relative;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 24px;
  pointer-events: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid rgba(216, 221, 232, 0.3);
}

.modal-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.modal-header p {
  margin: 0;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(216, 221, 232, 0.3);
  background: rgba(216, 221, 232, 0.1);
  border-radius: 0 0 24px 24px;
}

.field-hint {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-top: 8px;
  margin-left: 36px;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background: var(--color-danger-600);
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-danger:hover {
  background: var(--color-danger-700);
}

.field-inline {
  display: flex;
  gap: 16px;
}

.field-inline .field-stack {
  flex: 1;
}
</style>
