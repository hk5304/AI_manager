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
            <div class="project-actions">
              <button class="btn-secondary" @click.stop="openEditModal(project)">
                <span class="material-symbols-outlined">edit</span>
                编辑
              </button>
            </div>
          </a>
        </section>


      </div>
    </main>
  </div>

  <!-- 新建项目大弹窗 -->
  <div class="modal-shell" :class="{ open: isModalOpen }">
    <div class="modal-backdrop" @click="closeModal"></div>
    <section class="modal-panel-large glass-panel-strong">
      <div class="modal-header-large">
        <div class="modal-header-left">
          <div class="pill pill-ai" style="margin-bottom: 12px;">新建项目</div>
          <h2 class="section-title">创建新项目</h2>
          <p class="page-subtitle">填写项目基本信息、规划项目阶段、组建团队并分配任务</p>
        </div>
        <button class="icon-btn" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
      </div>

      <!-- 步骤指示器 -->
      <div class="modal-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="step-item"
          :class="{ active: currentStep === index, completed: index < currentStep }"
          @click="setStep(index)"
        >
          <span class="step-number">{{ index + 1 }}</span>
          <span class="step-label">{{ step.label }}</span>
          <span v-if="index < currentStep" class="material-symbols-outlined step-check">check</span>
        </div>
      </div>

      <!-- 表单内容区域 -->
      <div class="modal-content-large">
        <!-- 步骤1：项目基本信息 -->
        <div v-if="currentStep === 0" class="form-step">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">项目基本信息</h3>
              <p class="section-caption">填写项目的核心信息，用于项目矩阵展示和筛选</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="field-label">项目名称 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">title</span>
                  <input type="text" v-model="formData.name" placeholder="请输入项目名称" />
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">项目编号 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">tag</span>
                  <input type="text" v-model="formData.code" placeholder="请输入项目编号，如 RD-2026-001" />
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">所属部门 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">building</span>
                  <select v-model="formData.department">
                    <option value="">请选择部门</option>
                    <option value="材料科学部">材料科学部</option>
                    <option value="计算机物理组">计算机物理组</option>
                    <option value="量子计算中心">量子计算中心</option>
                    <option value="生物信息组">生物信息组</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">项目负责人 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">person</span>
                  <select v-model="formData.ownerId">
                    <option value="">请选择负责人</option>
                    <option v-for="user in availableUsers" :key="user.id" :value="user.id">{{ user.name }} ({{ user.role }})</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">项目优先级 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">flag</span>
                  <select v-model="formData.priority">
                    <option value="P0">P0 - 紧急重要</option>
                    <option value="P1">P1 - 重要</option>
                    <option value="P2">P2 - 一般</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">项目状态 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">signal_cellular_alt</span>
                  <select v-model="formData.status">
                    <option value="规划中">规划中</option>
                    <option value="进行中">进行中</option>
                    <option value="已暂停">已暂停</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">时间规划</h3>
              <p class="section-caption">设置项目的开始和截止日期</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="field-label">开始日期 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">calendar_today</span>
                  <input type="date" v-model="formData.startDate" />
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">截止日期 *</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">event</span>
                  <input type="date" v-model="formData.deadline" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">项目摘要</h3>
              <button class="btn-ai-summary" @click="generateAiSummary">
                <span class="material-symbols-outlined">auto_awesome</span>
                AI 智能生成
              </button>
            </div>
            
            <div class="form-group-full">
              <div class="field-input textarea">
                <span class="material-symbols-outlined">article</span>
                <textarea v-model="formData.summary" placeholder="请输入项目目标、背景和预期成果..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤2：项目阶段规划 -->
        <div v-if="currentStep === 1" class="form-step">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">项目阶段规划</h3>
              <div class="section-actions">
                <button class="btn-ai-summary" @click="generateAiPhases">
                  <span class="material-symbols-outlined">auto_awesome</span>
                  AI 一键分配阶段
                </button>
                <button class="btn-secondary" @click="addPhase">
                  <span class="material-symbols-outlined">add</span>
                  添加阶段
                </button>
              </div>
            </div>
            
            <p class="section-caption" style="margin-bottom: 20px;">拆解项目阶段，设置每个阶段的目标、交付物和里程碑节点</p>
            
            <div class="phases-list">
              <div 
                v-for="(phase, index) in formData.phases" 
                :key="phase.id"
                class="phase-card"
              >
                <div class="phase-header">
                  <span class="phase-number">{{ index + 1 }}</span>
                  <input 
                    type="text" 
                    v-model="phase.name" 
                    placeholder="阶段名称"
                    class="phase-name-input"
                  />
                  <button class="btn-delete" @click="removePhase(index)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
                
                <div class="phase-details">
                  <div class="phase-row">
                    <div class="phase-col">
                      <label>阶段目标</label>
                      <input type="text" v-model="phase.objective" placeholder="描述本阶段的核心目标" />
                    </div>
                    <div class="phase-col">
                      <label>交付物</label>
                      <input type="text" v-model="phase.deliverables" placeholder="列举本阶段交付物" />
                    </div>
                  </div>
                  
                  <div class="phase-row">
                    <div class="phase-col">
                      <label>里程碑节点</label>
                      <input type="date" v-model="phase.milestone" />
                    </div>
                    <div class="phase-col">
                      <label>负责人</label>
                      <select v-model="phase.ownerId">
                        <option value="">请选择负责人</option>
                        <option v-for="user in availableUsers" :key="user.id" :value="user.id">{{ user.name }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤3：团队组建 -->
        <div v-if="currentStep === 2" class="form-step">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">团队组建</h3>
              <div class="section-actions">
                <button class="btn-ai-summary" @click="generateAiTeam">
                  <span class="material-symbols-outlined">auto_awesome</span>
                  AI 一键分配成员
                </button>
              </div>
            </div>
            
            <p class="section-caption" style="margin-bottom: 20px;">从公司员工中筛选成员，组建项目团队并确定分工</p>
            
            <!-- 成员搜索 -->
            <div class="member-search">
              <div class="field-input">
                <span class="material-symbols-outlined">search</span>
                <input type="text" v-model="memberSearch" placeholder="搜索员工姓名或角色..." />
              </div>
              <select v-model="memberFilterRole">
                <option value="">全部角色</option>
                <option value="前端">前端</option>
                <option value="后端">后端</option>
                <option value="测试">测试</option>
                <option value="产品">产品</option>
                <option value="设计">设计</option>
              </select>
            </div>
            
            <!-- 可选成员列表 -->
            <div class="members-available">
              <h4>可选成员</h4>
              <div class="members-grid">
                <div 
                  v-for="user in filteredUsers" 
                  :key="user.id"
                  class="member-card"
                  :class="{ selected: isMemberSelected(user.id) }"
                  @click="toggleMember(user)"
                >
                  <img :src="user.avatar" :alt="user.name" />
                  <div class="member-info">
                    <strong>{{ user.name }}</strong>
                    <span class="member-role">{{ user.role }}</span>
                  </div>
                  <span v-if="isMemberSelected(user.id)" class="material-symbols-outlined check-icon">check_circle</span>
                </div>
              </div>
            </div>
            
            <!-- 已选成员 -->
            <div class="members-selected">
              <h4>已选成员 ({{ formData.members.length }})</h4>
              <div class="selected-list">
                <div 
                  v-for="member in formData.members" 
                  :key="member.userId"
                  class="selected-member"
                >
                  <img :src="getUserById(member.userId)?.avatar" :alt="member.name" />
                  <div class="selected-info">
                    <strong>{{ member.name }}</strong>
                    <select v-model="member.role" class="role-select">
                      <option value="前端">前端开发</option>
                      <option value="后端">后端开发</option>
                      <option value="测试">测试工程师</option>
                      <option value="产品">产品经理</option>
                      <option value="设计">UI设计</option>
                      <option value="运维">运维工程师</option>
                    </select>
                  </div>
                  <button class="btn-delete-small" @click="removeMember(member.userId)">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤4：任务分解 -->
        <div v-if="currentStep === 3" class="form-step">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">任务分解</h3>
              <div class="section-actions">
                <button class="btn-ai-summary" @click="generateAiTasks">
                  <span class="material-symbols-outlined">auto_awesome</span>
                  AI 一键生成任务
                </button>
                <button class="btn-secondary" @click="addTask">
                  <span class="material-symbols-outlined">add</span>
                  添加任务
                </button>
              </div>
            </div>
            
            <p class="section-caption" style="margin-bottom: 20px;">将项目拆解为可执行的任务，设置目标、交付物、优先级和截止时间</p>
            
            <div class="tasks-list">
              <div class="tasks-header">
                <div class="task-col task-name">任务名称</div>
                <div class="task-col task-objective">任务目标</div>
                <div class="task-col task-deliverable">交付物</div>
                <div class="task-col task-priority">优先级</div>
                <div class="task-col task-assignee">负责人</div>
                <div class="task-col task-deadline">截止时间</div>
                <div class="task-col task-action"></div>
              </div>
              
              <div 
                v-for="(task, index) in formData.tasks" 
                :key="task.id"
                class="task-row"
              >
                <div class="task-col task-name">
                  <input type="text" v-model="task.name" placeholder="任务名称" />
                </div>
                <div class="task-col task-objective">
                  <input type="text" v-model="task.objective" placeholder="任务目标" />
                </div>
                <div class="task-col task-deliverable">
                  <input type="text" v-model="task.deliverable" placeholder="交付物" />
                </div>
                <div class="task-col task-priority">
                  <select v-model="task.priority">
                    <option value="高">高</option>
                    <option value="中">中</option>
                    <option value="低">低</option>
                  </select>
                </div>
                <div class="task-col task-assignee">
                  <select v-model="task.assigneeId">
                    <option value="">未分配</option>
                    <option v-for="member in formData.members" :key="member.userId" :value="member.userId">{{ member.name }}</option>
                  </select>
                </div>
                <div class="task-col task-deadline">
                  <input type="date" v-model="task.deadline" />
                </div>
                <div class="task-col task-action">
                  <button class="btn-delete" @click="removeTask(index)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤5：审核流程配置 -->
        <div v-if="currentStep === 4" class="form-step">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">审核流程配置</h3>
              <p class="section-caption">设置任务审核规则和里程碑验收标准</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="field-label">任务审核方式</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="formData.reviewType" value="single" />
                    <span>单级审核（直接由组长审核）</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="formData.reviewType" value="multi" />
                    <span>多级审核（组长 → 管理员）</span>
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">审核时限</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">timer</span>
                  <select v-model="formData.reviewDeadline">
                    <option value="1">1个工作日</option>
                    <option value="3">3个工作日</option>
                    <option value="5">5个工作日</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">里程碑验收方式</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="formData.milestoneReview" value="leader" />
                    <span>项目组长验收</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="formData.milestoneReview" value="committee" />
                    <span>评审委员会验收</span>
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label class="field-label">自动提醒</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">bell</span>
                  <select v-model="formData.notificationFrequency">
                    <option value="daily">每日提醒</option>
                    <option value="weekly">每周汇总</option>
                    <option value="critical">仅异常提醒</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- 审核表单模板 -->
            <div class="form-section">
              <h3 class="section-title">审核表单配置</h3>
              <p class="section-caption">自定义审核表单字段</p>
              
              <div class="review-fields">
                <div class="review-field" v-for="(field, index) in formData.reviewFields" :key="index">
                  <input type="text" v-model="field.name" placeholder="字段名称" />
                  <select v-model="field.type">
                    <option value="text">文本</option>
                    <option value="textarea">多行文本</option>
                    <option value="rating">评分</option>
                    <option value="select">下拉选择</option>
                  </select>
                  <button class="btn-delete-small" @click="removeReviewField(index)">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
                <button class="btn-secondary btn-add-field" @click="addReviewField">
                  <span class="material-symbols-outlined">add</span>
                  添加字段
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="modal-footer-large">
        <div class="modal-status">
          <span class="material-symbols-outlined">info</span>
          {{ statusMessage }}
        </div>
        <div class="modal-footer-actions">
          <button v-if="currentStep > 0" class="btn-secondary" @click="prevStep">
            <span class="material-symbols-outlined">arrow_back</span>
            上一步
          </button>
          <button v-if="currentStep < steps.length - 1" class="btn-primary" @click="nextStep">
            下一步
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
          <button v-if="currentStep === steps.length - 1" class="btn-primary" @click="submitProject">
            <span class="material-symbols-outlined">rocket_launch</span>
            {{ currentUser.role === '管理员' ? '立即创建' : '提交审批' }}
          </button>
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

  <!-- 编辑项目大弹窗 -->
  <div class="modal-shell" :class="{ open: isEditModalOpen }">
    <div class="modal-backdrop" @click="closeEditModal"></div>
    <section class="modal-panel-large glass-panel-strong" style="max-height: 92vh;">
      <div class="modal-header-large">
        <div class="modal-header-left">
          <div class="pill pill-primary" style="margin-bottom: 12px;">编辑项目</div>
          <h2 class="section-title">{{ editingProject?.name || '编辑项目' }}</h2>
          <p class="page-subtitle">管理项目成员、任务、看板、甘特图、风险、报表和文档</p>
        </div>
        <button class="icon-btn" @click="closeEditModal"><span class="material-symbols-outlined">close</span></button>
      </div>

      <!-- 编辑Tabs -->
      <div class="edit-tabs">
        <button 
          v-for="tab in editTabs" 
          :key="tab.id"
          class="tab-item"
          :class="{ active: currentEditTab === tab.id }"
          @click="setEditTab(tab.id)"
        >
          <span class="material-symbols-outlined">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- 编辑内容区域 -->
      <div class="modal-content-large edit-content">
        <!-- 成员管理 -->
        <div v-if="currentEditTab === 'members'" class="edit-tab-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">成员管理</h3>
              <p class="section-caption">管理项目成员，分配角色和权限</p>
            </div>
            
            <div class="member-search">
              <div class="field-input">
                <span class="material-symbols-outlined">search</span>
                <input type="text" v-model="memberSearch" placeholder="搜索成员..." />
              </div>
              <select v-model="memberFilterRole">
                <option value="">全部角色</option>
                <option value="项目组长">项目组长</option>
                <option value="前端">前端</option>
                <option value="后端">后端</option>
                <option value="测试">测试</option>
                <option value="产品">产品</option>
                <option value="设计">设计</option>
                <option value="运维">运维</option>
              </select>
            </div>

            <div class="members-grid">
              <div 
                v-for="user in filteredUsers" 
                :key="user.id"
                class="member-card"
                :class="{ selected: editingProject?.members?.some(m => m.userId === user.id) }"
                @click="toggleEditMember(user)"
              >
                <img :src="user.avatar" :alt="user.name" />
                <div class="member-info">
                  <strong>{{ user.name }}</strong>
                  <span class="member-role">{{ user.role }}</span>
                </div>
                <span v-if="editingProject?.members?.some(m => m.userId === user.id)" class="material-symbols-outlined check-icon">check</span>
              </div>
            </div>

            <div v-if="editingProject?.members?.length" class="members-selected">
              <h4>已选成员</h4>
              <div class="selected-list">
                <div v-for="member in editingProject.members" :key="member.userId" class="selected-member">
                  <img :src="getUserById(member.userId)?.avatar || 'https://i.pravatar.cc/80?img=0'" :alt="member.name" />
                  <div class="selected-info">
                    <strong>{{ member.name }}</strong>
                    <select class="role-select" v-model="member.role">
                      <option value="项目组长">项目组长</option>
                      <option value="前端">前端</option>
                      <option value="后端">后端</option>
                      <option value="测试">测试</option>
                      <option value="产品">产品</option>
                      <option value="设计">设计</option>
                      <option value="运维">运维</option>
                    </select>
                  </div>
                  <button class="btn-delete-small" @click="removeEditMember(member.userId)"><span class="material-symbols-outlined">close</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务管理 -->
        <div v-if="currentEditTab === 'tasks'" class="edit-tab-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">任务管理</h3>
              <button class="btn-primary" @click="addEditTask"><span class="material-symbols-outlined">add</span>新建任务</button>
            </div>
            
            <div class="tasks-list">
              <div class="tasks-header">
                <span>任务名称</span>
                <span>目标</span>
                <span>交付物</span>
                <span>优先级</span>
                <span>负责人</span>
                <span>截止日期</span>
                <span>操作</span>
              </div>
              <div v-for="(task, index) in editingProject?.tasks || []" :key="index" class="task-row">
                <div class="task-col"><input type="text" v-model="task.name" placeholder="任务名称" /></div>
                <div class="task-col"><input type="text" v-model="task.objective" placeholder="任务目标" /></div>
                <div class="task-col"><input type="text" v-model="task.deliverable" placeholder="交付物" /></div>
                <div class="task-col">
                  <select v-model="task.priority">
                    <option value="高">高</option>
                    <option value="中">中</option>
                    <option value="低">低</option>
                  </select>
                </div>
                <div class="task-col">
                  <select v-model="task.assigneeId">
                    <option value="">选择负责人</option>
                    <option v-for="member in editingProject?.members" :key="member.userId" :value="member.userId">{{ member.name }}</option>
                  </select>
                </div>
                <div class="task-col"><input type="date" v-model="task.deadline" /></div>
                <div class="task-col task-action"><button class="btn-delete-small" @click="removeEditTask(index)"><span class="material-symbols-outlined">delete</span></button></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目看板 -->
        <div v-if="currentEditTab === 'board'" class="edit-tab-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">项目看板</h3>
              <p class="section-caption">编辑看板列和任务卡片</p>
            </div>
            
            <div class="kanban-editor">
              <div class="kanban-columns">
                <div v-for="(column, index) in (editingProject?.kanbanColumns || defaultKanbanColumns)" :key="index" class="kanban-column">
                  <div class="kanban-column-header">
                    <input type="text" v-model="column.name" class="column-name-input" />
                    <button class="btn-delete-small" @click="removeKanbanColumn(index)"><span class="material-symbols-outlined">close</span></button>
                  </div>
                  <div class="kanban-cards">
                    <div v-for="(card, cardIndex) in column.cards" :key="cardIndex" class="kanban-card">
                      <input type="text" v-model="card.title" placeholder="任务标题" class="card-title" />
                      <p>{{ card.description }}</p>
                      <div class="card-footer">
                        <span class="priority-tag" :class="card.priority">{{ card.priority }}</span>
                      </div>
                    </div>
                    <button class="add-card-btn" @click="addKanbanCard(index)"><span class="material-symbols-outlined">add</span>添加卡片</button>
                  </div>
                </div>
                <button class="add-column-btn" @click="addKanbanColumn"><span class="material-symbols-outlined">add</span>添加列</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 甘特图 -->
        <div v-if="currentEditTab === 'gantt'" class="edit-tab-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">甘特图</h3>
              <p class="section-caption">编辑项目时间线和里程碑</p>
            </div>
            
            <div class="gantt-editor">
              <div class="gantt-header">
                <div class="gantt-label">任务</div>
                <div class="gantt-timeline">
                  <div v-for="week in 8" :key="week" class="gantt-week">
                    <span>W{{ week }}</span>
                  </div>
                </div>
              </div>
              <div class="gantt-body">
                <div v-for="(phase, index) in (editingProject?.phases || [])" :key="index" class="gantt-row">
                  <div class="gantt-label">{{ phase.name }}</div>
                  <div class="gantt-timeline">
                    <div class="gantt-bar" :style="{ left: (index * 12) + '%', width: '20%' }"></div>
                  </div>
                </div>
              </div>
              <div class="gantt-controls">
                <button class="btn-secondary">导出图片</button>
                <button class="btn-secondary">导出数据</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 风险看板 -->
        <div v-if="currentEditTab === 'risk'" class="edit-tab-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">风险看板</h3>
              <button class="btn-primary" @click="addRiskItem"><span class="material-symbols-outlined">add</span>新增风险</button>
            </div>
            
            <div class="risk-board">
              <div class="risk-column">
                <h4 class="risk-column-title">低风险</h4>
                <div class="risk-cards">
                  <div v-for="(risk, index) in (editingProject?.lowRisks || [])" :key="index" class="risk-card">
                    <h5>{{ risk.title }}</h5>
                    <p>{{ risk.description }}</p>
                    <div class="risk-meta">
                      <span class="risk-probability">{{ risk.probability }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="risk-column">
                <h4 class="risk-column-title">中风险</h4>
                <div class="risk-cards">
                  <div v-for="(risk, index) in (editingProject?.mediumRisks || [])" :key="index" class="risk-card">
                    <h5>{{ risk.title }}</h5>
                    <p>{{ risk.description }}</p>
                    <div class="risk-meta">
                      <span class="risk-probability">{{ risk.probability }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="risk-column">
                <h4 class="risk-column-title">高风险</h4>
                <div class="risk-cards">
                  <div v-for="(risk, index) in (editingProject?.highRisks || [])" :key="index" class="risk-card">
                    <h5>{{ risk.title }}</h5>
                    <p>{{ risk.description }}</p>
                    <div class="risk-meta">
                      <span class="risk-probability">{{ risk.probability }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 报表管理 -->
        <div v-if="currentEditTab === 'reports'" class="edit-tab-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">报表管理</h3>
              <button class="btn-primary" @click="uploadReport"><span class="material-symbols-outlined">upload</span>上传报表</button>
            </div>
            
            <div class="reports-grid">
              <div v-for="(report, index) in (editingProject?.reports || defaultReports)" :key="index" class="report-card">
                <div class="report-icon">
                  <span class="material-symbols-outlined">bar_chart</span>
                </div>
                <div class="report-info">
                  <h4>{{ report.name }}</h4>
                  <p class="report-date">{{ report.date }}</p>
                </div>
                <div class="report-actions">
                  <button class="btn-secondary" @click="viewReport(report)">查看</button>
                  <button class="btn-delete-small" @click="deleteReport(index)"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文档管理 -->
        <div v-if="currentEditTab === 'documents'" class="edit-tab-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">文档管理</h3>
              <button class="btn-primary" @click="uploadDocument"><span class="material-symbols-outlined">upload</span>上传文档</button>
            </div>
            
            <div class="documents-grid">
              <div v-for="(doc, index) in (editingProject?.documents || defaultDocuments)" :key="index" class="document-card">
                <div class="document-icon" :class="getDocIconClass(doc.type)">
                  <span class="material-symbols-outlined">{{ getDocIcon(doc.type) }}</span>
                </div>
                <div class="document-info">
                  <h4>{{ doc.name }}</h4>
                  <p class="document-size">{{ doc.size }}</p>
                </div>
                <div class="document-actions">
                  <button class="btn-secondary" @click="downloadDocument(doc)">下载</button>
                  <button class="btn-delete-small" @click="deleteDocument(index)"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="modal-footer-large">
        <button class="btn-secondary" @click="closeEditModal">取消</button>
        <button class="btn-primary" @click="saveProjectChanges">
          <span class="material-symbols-outlined">save</span>保存修改
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const { projects, addProject } = useProjects()

const isModalOpen = ref(false)
const isAiDrawerOpen = ref(false)
const toast = ref({ show: false, title: '', message: '', icon: '' })

// 编辑弹窗状态
const isEditModalOpen = ref(false)
const currentEditTab = ref('members')
const editingProject = ref(null)

const currentStep = ref(0)
const steps = [
  { id: 'info', label: '基本信息' },
  { id: 'phases', label: '阶段规划' },
  { id: 'team', label: '团队组建' },
  { id: 'tasks', label: '任务分解' },
  { id: 'review', label: '审核配置' }
]

// 编辑项目的tabs
const editTabs = [
  { id: 'members', label: '成员管理', icon: 'people' },
  { id: 'tasks', label: '任务管理', icon: 'task_list' },
  { id: 'board', label: '项目看板', icon: 'view_board' },
  { id: 'gantt', label: '甘特图', icon: 'timeline' },
  { id: 'risk', label: '风险看板', icon: 'alert_triangle' },
  { id: 'reports', label: '报表', icon: 'bar_chart' },
  { id: 'documents', label: '文档', icon: 'folder_open' }
]

const memberSearch = ref('')
const memberFilterRole = ref('')

// 可选用户列表
const availableUsers = ref([
  { id: 1, name: '王志强', role: '项目组长', avatar: 'https://i.pravatar.cc/80?img=1' },
  { id: 2, name: '李明', role: '前端', avatar: 'https://i.pravatar.cc/80?img=2' },
  { id: 3, name: '张华', role: '后端', avatar: 'https://i.pravatar.cc/80?img=3' },
  { id: 4, name: '王芳', role: '测试', avatar: 'https://i.pravatar.cc/80?img=4' },
  { id: 5, name: '刘洋', role: '产品', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 6, name: '陈静', role: '设计', avatar: 'https://i.pravatar.cc/80?img=6' },
  { id: 7, name: '赵伟', role: '后端', avatar: 'https://i.pravatar.cc/80?img=7' },
  { id: 8, name: '孙丽', role: '前端', avatar: 'https://i.pravatar.cc/80?img=8' },
  { id: 9, name: '周强', role: '运维', avatar: 'https://i.pravatar.cc/80?img=9' },
  { id: 10, name: '吴敏', role: '测试', avatar: 'https://i.pravatar.cc/80?img=10' }
])

// 表单数据
const formData = ref({
  name: '',
  code: '',
  department: '',
  ownerId: '',
  priority: 'P1',
  status: '规划中',
  startDate: '',
  deadline: '',
  summary: '',
  phases: [
    { id: 1, name: '需求分析', objective: '', deliverables: '', milestone: '', ownerId: '' },
    { id: 2, name: '开发', objective: '', deliverables: '', milestone: '', ownerId: '' },
    { id: 3, name: '测试', objective: '', deliverables: '', milestone: '', ownerId: '' },
    { id: 4, name: '上线', objective: '', deliverables: '', milestone: '', ownerId: '' }
  ],
  members: [],
  tasks: [],
  reviewType: 'single',
  reviewDeadline: '3',
  milestoneReview: 'leader',
  notificationFrequency: 'weekly',
  reviewFields: [
    { name: '完成度', type: 'rating' },
    { name: '质量评估', type: 'rating' },
    { name: '审核意见', type: 'textarea' }
  ]
})

// 搜索关键词
const searchKeyword = ref('')

// 排序状态
const sortField = ref('')
const sortOrder = ref('asc')

// 健康度优先级映射
const healthPriority = {
  '完成': 4,
  '良好': 3,
  '风险': 2,
  '严重': 1
}

// 搜索并排序后的项目列表
const sortedProjects = computed(() => {
  let list = [...projects.value]
  
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    list = list.filter(project => {
      const projectName = project.name.toLowerCase()
      const ownerName = project.owner.name.toLowerCase()
      return projectName.includes(keyword) || ownerName.includes(keyword)
    })
  }
  
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
    const priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2 }
    list.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 2
      const priorityB = priorityOrder[b.priority] || 2
      return sortOrder.value === 'asc' ? priorityA - priorityB : priorityB - priorityA
    })
  }
  
  return list
})

// 筛选后的用户列表
const filteredUsers = computed(() => {
  return availableUsers.value.filter(user => {
    const matchSearch = !memberSearch.value || user.name.toLowerCase().includes(memberSearch.value.toLowerCase()) || 
                        user.role.toLowerCase().includes(memberSearch.value.toLowerCase())
    const matchRole = !memberFilterRole.value || user.role === memberFilterRole.value
    return matchSearch && matchRole
  })
})

// 状态消息
const statusMessage = computed(() => {
  const messages = [
    '请填写项目基本信息',
    '规划项目阶段和里程碑',
    '选择项目成员并分配角色',
    '分解任务并指派负责人',
    '配置审核流程和验收标准'
  ]
  return messages[currentStep.value]
})

const sortByDeadline = () => {
  if (sortField.value === 'deadline') {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = 'deadline'
    sortOrder.value = 'asc'
  }
}

const sortByHealth = () => {
  if (sortField.value === 'health') {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = 'health'
    sortOrder.value = 'asc'
  }
}

const sortByOwner = () => {
  if (sortField.value === 'owner') {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = 'owner'
    sortOrder.value = 'asc'
  }
}

const sortByPriority = () => {
  if (sortField.value === 'priority') {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = 'priority'
    sortOrder.value = 'asc'
  }
}

const getPriorityCount = (priority) => {
  const countMap = { 'P0': 3, 'P1': 2, 'P2': 1 }
  return countMap[priority] || 1
}

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

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false
}

// 编辑项目弹窗方法
const openEditModal = (project) => {
  editingProject.value = { ...project }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingProject.value = null
}

const setEditTab = (tabId) => {
  currentEditTab.value = tabId
}

// 默认看板列
const defaultKanbanColumns = [
  { name: '待办', cards: [{ title: '需求分析', description: '完成用户需求收集', priority: 'high' }] },
  { name: '进行中', cards: [{ title: '系统设计', description: '完成架构设计', priority: 'medium' }] },
  { name: '已完成', cards: [{ title: '项目立项', description: '完成项目审批', priority: 'low' }] }
]

// 默认报表
const defaultReports = [
  { name: '项目进度报告', date: '2026-05-15' },
  { name: '风险评估报告', date: '2026-05-10' },
  { name: '资源使用报告', date: '2026-05-05' }
]

// 默认文档
const defaultDocuments = [
  { name: '项目需求文档.pdf', type: 'pdf', size: '2.3 MB' },
  { name: '技术方案设计.docx', type: 'doc', size: '1.1 MB' },
  { name: '原型设计稿.fig', type: 'fig', size: '8.5 MB' }
]

// 编辑成员相关方法
const toggleEditMember = (user) => {
  if (!editingProject.value.members) {
    editingProject.value.members = []
  }
  const index = editingProject.value.members.findIndex(m => m.userId === user.id)
  if (index > -1) {
    editingProject.value.members.splice(index, 1)
  } else {
    editingProject.value.members.push({
      userId: user.id,
      name: user.name,
      role: user.role
    })
  }
}

const removeEditMember = (userId) => {
  const index = editingProject.value.members.findIndex(m => m.userId === userId)
  if (index > -1) {
    editingProject.value.members.splice(index, 1)
  }
}

// 任务管理方法
const addEditTask = () => {
  if (!editingProject.value.tasks) {
    editingProject.value.tasks = []
  }
  const newId = (editingProject.value.tasks.length || 0) + 1
  editingProject.value.tasks.push({
    id: newId,
    name: '',
    objective: '',
    deliverable: '',
    priority: '中',
    assigneeId: '',
    deadline: ''
  })
}

const removeEditTask = (index) => {
  editingProject.value.tasks.splice(index, 1)
}

// 看板管理方法
const addKanbanColumn = () => {
  if (!editingProject.value.kanbanColumns) {
    editingProject.value.kanbanColumns = [...defaultKanbanColumns]
  }
  editingProject.value.kanbanColumns.push({ name: '新列', cards: [] })
}

const removeKanbanColumn = (index) => {
  editingProject.value.kanbanColumns.splice(index, 1)
}

const addKanbanCard = (columnIndex) => {
  editingProject.value.kanbanColumns[columnIndex].cards.push({
    title: '',
    description: '',
    priority: 'medium'
  })
}

// 风险管理方法
const addRiskItem = () => {
  if (!editingProject.value.mediumRisks) {
    editingProject.value.mediumRisks = []
  }
  editingProject.value.mediumRisks.push({
    title: '',
    description: '',
    probability: 50
  })
}

// 报表管理方法
const uploadReport = () => {
  showToast('报表上传', '报表上传功能已触发', 'upload')
}

const viewReport = (report) => {
  showToast('查看报表', `正在查看 ${report.name}`, 'eye')
}

const deleteReport = (index) => {
  editingProject.value.reports.splice(index, 1)
}

// 文档管理方法
const uploadDocument = () => {
  showToast('文档上传', '文档上传功能已触发', 'upload')
}

const downloadDocument = (doc) => {
  showToast('下载文档', `正在下载 ${doc.name}`, 'download')
}

const deleteDocument = (index) => {
  editingProject.value.documents.splice(index, 1)
}

const getDocIcon = (type) => {
  const icons = {
    pdf: 'picture_as_pdf',
    doc: 'description',
    xlsx: 'table_chart',
    fig: 'image',
    zip: 'archive',
    default: 'insert_drive_file'
  }
  return icons[type] || icons.default
}

const getDocIconClass = (type) => {
  const classes = {
    pdf: 'doc-icon-pdf',
    doc: 'doc-icon-doc',
    xlsx: 'doc-icon-xlsx',
    fig: 'doc-icon-fig',
    zip: 'doc-icon-zip'
  }
  return classes[type] || ''
}

// 保存项目修改
const saveProjectChanges = () => {
  showToast('保存成功', '项目修改已保存', 'save')
  closeEditModal()
}

const showToast = (title, message, icon) => {
  toast.value = { show: true, title, message, icon }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// 步骤切换
const setStep = (index) => {
  if (index <= currentStep.value) {
    currentStep.value = index
  }
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
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

// AI 一键生成阶段
const generateAiPhases = () => {
  const phaseTemplates = [
    { name: '需求分析', objective: '完成用户需求收集、分析和文档编写', deliverables: '需求规格说明书、原型设计', milestone: '', ownerId: '' },
    { name: '系统设计', objective: '完成系统架构设计和技术方案制定', deliverables: '技术方案文档、架构图', milestone: '', ownerId: '' },
    { name: '开发实现', objective: '按设计文档完成代码开发和单元测试', deliverables: '可运行代码、单元测试报告', milestone: '', ownerId: '' },
    { name: '集成测试', objective: '完成系统集成和功能测试', deliverables: '测试报告、Bug修复记录', milestone: '', ownerId: '' },
    { name: '上线部署', objective: '完成生产环境部署和用户培训', deliverables: '部署文档、培训材料', milestone: '', ownerId: '' }
  ]
  formData.value.phases = phaseTemplates.map((p, i) => ({ ...p, id: i + 1 }))
  showToast('AI 阶段已生成', '已为您智能生成项目阶段规划。', 'auto_awesome')
}

// AI 一键分配团队
const generateAiTeam = () => {
  const suggestedMembers = [
    { userId: 2, name: '李明', role: '前端' },
    { userId: 3, name: '张华', role: '后端' },
    { userId: 4, name: '王芳', role: '测试' },
    { userId: 5, name: '刘洋', role: '产品' }
  ]
  formData.value.members = suggestedMembers
  showToast('AI 团队已生成', '已为您智能推荐项目团队成员。', 'auto_awesome')
}

// AI 一键生成任务
const generateAiTasks = () => {
  const tasks = [
    { id: 1, name: '需求调研', objective: '收集并整理用户需求', deliverable: '需求清单', priority: '高', assigneeId: '', deadline: '' },
    { id: 2, name: '原型设计', objective: '完成产品原型设计', deliverable: '设计稿', priority: '高', assigneeId: '', deadline: '' },
    { id: 3, name: '数据库设计', objective: '设计数据库架构', deliverable: '数据库设计文档', priority: '高', assigneeId: '', deadline: '' },
    { id: 4, name: '前端开发', objective: '完成前端页面开发', deliverable: '前端代码', priority: '中', assigneeId: '', deadline: '' },
    { id: 5, name: '后端开发', objective: '完成后端接口开发', deliverable: '后端代码', priority: '中', assigneeId: '', deadline: '' },
    { id: 6, name: '功能测试', objective: '完成功能测试', deliverable: '测试报告', priority: '高', assigneeId: '', deadline: '' }
  ]
  formData.value.tasks = tasks
  showToast('AI 任务已生成', '已为您智能分解项目任务。', 'auto_awesome')
}

// 添加阶段
const addPhase = () => {
  const newId = formData.value.phases.length + 1
  formData.value.phases.push({
    id: newId,
    name: `阶段${newId}`,
    objective: '',
    deliverables: '',
    milestone: '',
    ownerId: ''
  })
}

// 移除阶段
const removePhase = (index) => {
  formData.value.phases.splice(index, 1)
}

// 检查成员是否已选择
const isMemberSelected = (userId) => {
  return formData.value.members.some(m => m.userId === userId)
}

// 切换成员选择
const toggleMember = (user) => {
  const index = formData.value.members.findIndex(m => m.userId === user.id)
  if (index > -1) {
    formData.value.members.splice(index, 1)
  } else {
    formData.value.members.push({
      userId: user.id,
      name: user.name,
      role: user.role
    })
  }
}

// 获取用户信息
const getUserById = (userId) => {
  return availableUsers.value.find(u => u.id === userId)
}

// 移除成员
const removeMember = (userId) => {
  const index = formData.value.members.findIndex(m => m.userId === userId)
  if (index > -1) {
    formData.value.members.splice(index, 1)
  }
}

// 添加任务
const addTask = () => {
  const newId = formData.value.tasks.length + 1
  formData.value.tasks.push({
    id: newId,
    name: '',
    objective: '',
    deliverable: '',
    priority: '中',
    assigneeId: '',
    deadline: ''
  })
}

// 移除任务
const removeTask = (index) => {
  formData.value.tasks.splice(index, 1)
}

// 添加审核字段
const addReviewField = () => {
  formData.value.reviewFields.push({ name: '', type: 'text' })
}

// 移除审核字段
const removeReviewField = (index) => {
  formData.value.reviewFields.splice(index, 1)
}

// 提交项目
const submitProject = () => {
  const owner = availableUsers.value.find(u => u.id === parseInt(formData.value.ownerId))
  
  addProject({
    name: formData.value.name || '新项目',
    code: formData.value.code || 'RD-' + Date.now(),
    department: formData.value.department,
    owner: owner || { name: '未指定', avatar: 'https://i.pravatar.cc/80?img=0' },
    memberCount: formData.value.members.length,
    deadline: formData.value.deadline,
    priority: formData.value.priority,
    status: formData.value.status,
    progress: 0,
    health: '良好',
    color: '#1468c7',
    tags: ['新建项目'],
    phases: formData.value.phases,
    members: formData.value.members,
    tasks: formData.value.tasks
  })
  
  const isAdmin = currentUser.role === '管理员' || currentUser.role === '超级管理员'
  showToast(
    isAdmin ? '项目已创建' : '申请已提交',
    isAdmin ? '新项目已成功创建。' : '项目申请已提交，等待管理员审批。',
    isAdmin ? 'task_alt' : 'send'
  )
  
  closeModal()
  
  // 重置表单
  formData.value = {
    name: '',
    code: '',
    department: '',
    ownerId: '',
    priority: 'P1',
    status: '规划中',
    startDate: '',
    deadline: '',
    summary: '',
    phases: [
      { id: 1, name: '需求分析', objective: '', deliverables: '', milestone: '', ownerId: '' },
      { id: 2, name: '开发', objective: '', deliverables: '', milestone: '', ownerId: '' },
      { id: 3, name: '测试', objective: '', deliverables: '', milestone: '', ownerId: '' },
      { id: 4, name: '上线', objective: '', deliverables: '', milestone: '', ownerId: '' }
    ],
    members: [],
    tasks: [],
    reviewType: 'single',
    reviewDeadline: '3',
    milestoneReview: 'leader',
    notificationFrequency: 'weekly',
    reviewFields: [
      { name: '完成度', type: 'rating' },
      { name: '质量评估', type: 'rating' },
      { name: '审核意见', type: 'textarea' }
    ]
  };
  currentStep.value = 0;
}
</script>

<style scoped>
/* 大弹窗样式 */
.modal-panel-large {
  width: min(1400px, calc(100vw - 48px));
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.modal-header-large {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 32px;
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.03) 0%, rgba(168, 113, 255, 0.03) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.modal-header-left {
  flex: 1;
}

.modal-header-left h2 {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-tertiary-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
}

.modal-header-left p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.modal-header-large .icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-text-secondary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-header-large .icon-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

/* 步骤指示器 */
.modal-steps {
  display: flex;
  gap: 4px;
  padding: 20px 32px;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.step-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.05), rgba(168, 113, 255, 0.05));
  opacity: 0;
  transition: opacity 0.25s ease;
}

.step-item:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(20, 104, 199, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.step-item:hover::before {
  opacity: 1;
}

.step-item.active {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border-color: var(--color-primary-500);
  box-shadow: 
    0 4px 20px rgba(20, 104, 199, 0.3),
    0 1px 0 rgba(255, 255, 255, 0.2) inset;
  transform: translateY(-2px);
}

.step-item.active::before {
  opacity: 0;
}

.step-item.completed {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.04));
  border-color: rgba(34, 197, 94, 0.2);
}

.step-number {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.step-item.active .step-number {
  background: rgba(255, 255, 255, 0.2);
}

.step-item.completed .step-number {
  display: none;
}

.step-check {
  font-size: 16px;
  color: #22c55e;
}

.step-item.active .step-check {
  color: white;
}

.step-label {
  font-size: 14px;
  font-weight: 500;
}

.modal-content-large {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
}

.modal-content-large::-webkit-scrollbar {
  width: 6px;
}

.modal-content-large::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 3px;
}

.modal-content-large::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.modal-content-large::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal-footer-large {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.8);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
}

.modal-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.modal-status .material-symbols-outlined {
  color: var(--color-info-500);
  font-size: 16px;
}

/* 表单样式 */
.form-step {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-section {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 12px;
}

.section-caption {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group-full {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-label::after {
  content: '*';
  color: var(--color-danger-500);
  font-size: 14px;
}

.field-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.field-input:hover {
  border-color: rgba(20, 104, 199, 0.15);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.field-input:focus-within {
  border-color: var(--color-primary-500);
  box-shadow: 
    0 0 0 3px rgba(20, 104, 199, 0.08),
    0 2px 12px rgba(20, 104, 199, 0.12);
}

.field-input input,
.field-input select,
.field-input textarea {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--color-text-primary);
}

.field-input input::placeholder,
.field-input select::placeholder,
.field-input textarea::placeholder {
  color: var(--color-text-tertiary);
}

.field-input textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.field-input.textarea {
  align-items: flex-start;
  padding-top: 14px;
}

.field-input .material-symbols-outlined {
  color: var(--color-text-tertiary);
  font-size: 18px;
  flex-shrink: 0;
}

/* 阶段卡片 */
.phases-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.phase-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
}

.phase-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.phase-number {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(20, 104, 199, 0.3);
}

.phase-name-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  padding: 8px 0;
  color: var(--color-text-primary);
}

.phase-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.phase-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.phase-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.phase-col label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.phase-col input,
.phase-col select {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  font-size: 13px;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.phase-col input:focus,
.phase-col select:focus {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgba(20, 104, 199, 0.06);
}

/* 成员选择 */
.member-search {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}

.member-search .field-input {
  flex: 1;
}

.member-search select {
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  font-size: 14px;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
}

.member-search select:hover {
  border-color: rgba(20, 104, 199, 0.15);
}

.member-search select:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(20, 104, 199, 0.08);
}

.members-available,
.members-selected {
  margin-bottom: 28px;
}

.members-available h4,
.members-selected h4 {
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.member-card:hover {
  background: rgba(20, 104, 199, 0.06);
  border-color: rgba(20, 104, 199, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.member-card.selected {
  border-color: var(--color-primary-500);
  background: linear-gradient(145deg, rgba(20, 104, 199, 0.1) 0%, rgba(168, 113, 255, 0.06) 100%);
  box-shadow: 0 0 0 3px rgba(20, 104, 199, 0.08);
}

.member-card img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.06);
}

.member-card.selected img {
  border-color: var(--color-primary-500);
}

.member-info {
  flex: 1;
}

.member-info strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.member-role {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.check-icon {
  color: var(--color-primary-500);
  font-size: 20px;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.selected-member {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.1) 0%, rgba(168, 113, 255, 0.06) 100%);
  border: 1.5px solid rgba(20, 104, 199, 0.25);
  transition: all 0.2s ease;
}

.selected-member:hover {
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.15) 0%, rgba(168, 113, 255, 0.1) 100%);
  border-color: rgba(20, 104, 199, 0.35);
}

.selected-member img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(20, 104, 199, 0.3);
}

.selected-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selected-info strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.role-select {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  font-size: 12px;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-select:hover {
  border-color: rgba(20, 104, 199, 0.2);
}

.role-select:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(20, 104, 199, 0.06);
}

/* 任务列表 */
.tasks-list {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.tasks-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 110px 130px 130px 70px;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.03) 0%, rgba(168, 113, 255, 0.03) 100%);
  font-weight: 600;
  font-size: 12px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.task-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 110px 130px 130px 70px;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  align-items: center;
  transition: background 0.2s ease;
}

.task-row:hover {
  background: rgba(20, 104, 199, 0.03);
}

.task-row:last-child {
  border-bottom: none;
}

.task-col {
  display: flex;
  align-items: center;
}

.task-col input,
.task-col select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  font-size: 13px;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.task-col input:focus,
.task-col select:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(20, 104, 199, 0.06);
}

.task-action {
  justify-content: center;
}

/* 审核流程 */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.6);
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.radio-item:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(20, 104, 199, 0.15);
}

.radio-item input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary-500);
}

.radio-item span {
  font-size: 14px;
  color: var(--color-text-primary);
}

.review-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.review-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-field input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  font-size: 13px;
  width: 140px;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.review-field input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(20, 104, 199, 0.06);
}

.review-field select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  font-size: 13px;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.review-field select:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(20, 104, 199, 0.06);
}

/* 删除按钮 */
.btn-delete,
.btn-delete-small {
  padding: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.12) 100%);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-delete:hover,
.btn-delete-small:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.2) 100%);
  transform: scale(1.05);
}

.btn-delete:active,
.btn-delete-small:active {
  transform: scale(0.95);
}

.btn-delete-small {
  padding: 6px;
}

.btn-delete .material-symbols-outlined,
.btn-delete-small .material-symbols-outlined {
  font-size: 16px;
}

/* AI 智能按钮 */
.btn-ai-summary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(168, 113, 255, 0.12) 0%, rgba(113, 145, 255, 0.12) 100%);
  border: 1.5px solid rgba(168, 113, 255, 0.25);
  color: var(--color-tertiary-700);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(168, 113, 255, 0.1);
}

.btn-ai-summary:hover {
  background: linear-gradient(135deg, rgba(168, 113, 255, 0.18) 0%, rgba(113, 145, 255, 0.18) 100%);
  border-color: rgba(168, 113, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(168, 113, 255, 0.15);
}

.btn-ai-summary:active {
  transform: translateY(-1px);
}

.btn-ai-summary .material-symbols-outlined {
  font-size: 18px;
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

@keyframes toastPopIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes toastPopOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
}

/* 响应式布局 */
@media (max-width: 1279px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .members-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .tasks-header,
  .task-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .members-grid {
    grid-template-columns: 1fr;
  }
  
  .phase-row {
    grid-template-columns: 1fr;
  }
  
  .modal-steps {
    flex-wrap: wrap;
  }
  
  .step-item {
    flex: 1;
    min-width: calc(50% - 4px);
    justify-content: center;
  }
}

/* 编辑弹窗样式 */
.edit-tabs {
  display: flex;
  gap: 4px;
  padding: 16px 32px;
  background: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.tab-item:hover {
  background: rgba(20, 104, 199, 0.06);
  color: var(--color-text-primary);
}

.tab-item.active {
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.1) 0%, rgba(168, 113, 255, 0.08) 100%);
  color: var(--color-primary-700);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(20, 104, 199, 0.08);
}

.tab-item .material-symbols-outlined {
  font-size: 18px;
}

.edit-content {
  flex: 1;
  overflow-y: auto;
}

.edit-tab-content {
  padding: 16px 0;
}

/* 项目操作按钮 */
.project-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 看板编辑器 */
.kanban-editor {
  padding: 16px;
}

.kanban-columns {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.kanban-column {
  min-width: 280px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.kanban-column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.column-name-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  font-size: 14px;
  font-weight: 600;
  outline: none;
}

.kanban-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kanban-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 14px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.card-title {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  outline: none;
}

.kanban-card p {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.priority-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.priority-tag.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.priority-tag.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.priority-tag.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.add-card-btn,
.add-column-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-card-btn:hover,
.add-column-btn:hover {
  border-color: var(--color-primary-400);
  color: var(--color-primary-600);
  background: rgba(20, 104, 199, 0.04);
}

.add-column-btn {
  min-width: 280px;
  min-height: 100px;
}

/* 甘特图编辑器 */
.gantt-editor {
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.gantt-header,
.gantt-row {
  display: flex;
  align-items: center;
}

.gantt-label {
  width: 120px;
  padding: 10px;
  font-weight: 600;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
}

.gantt-timeline {
  flex: 1;
  display: flex;
  position: relative;
  height: 40px;
}

.gantt-week {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--color-text-secondary);
  border-right: 1px dashed rgba(0, 0, 0, 0.06);
}

.gantt-week:last-child {
  border-right: none;
}

.gantt-bar {
  position: absolute;
  height: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600));
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(20, 104, 199, 0.2);
}

.gantt-controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
}

/* 风险看板 */
.risk-board {
  display: flex;
  gap: 16px;
}

.risk-column {
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.risk-column-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.risk-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 14px;
  border-left: 4px solid #9ca3af;
}

.risk-column:first-child .risk-card {
  border-left-color: #22c55e;
}

.risk-column:nth-child(2) .risk-card {
  border-left-color: #f59e0b;
}

.risk-column:last-child .risk-card {
  border-left-color: #ef4444;
}

.risk-card h5 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.risk-card p {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.risk-meta {
  display: flex;
  justify-content: flex-end;
}

.risk-probability {
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.06);
  font-size: 11px;
  font-weight: 600;
}

/* 报表网格 */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.report-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.report-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.report-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.1) 0%, rgba(168, 113, 255, 0.08) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-icon .material-symbols-outlined {
  font-size: 24px;
  color: var(--color-primary-600);
}

.report-info {
  flex: 1;
}

.report-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.report-date {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.report-actions {
  display: flex;
  gap: 8px;
}

/* 文档网格 */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.document-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.document-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.document-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-icon-pdf {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.15) 100%);
}

.doc-icon-pdf .material-symbols-outlined {
  color: #ef4444;
}

.doc-icon-doc {
  background: linear-gradient(135deg, rgba(20, 104, 199, 0.1) 0%, rgba(20, 104, 199, 0.15) 100%);
}

.doc-icon-doc .material-symbols-outlined {
  color: var(--color-primary-600);
}

.doc-icon-xlsx {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.15) 100%);
}

.doc-icon-xlsx .material-symbols-outlined {
  color: #22c55e;
}

.doc-icon-fig {
  background: linear-gradient(135deg, rgba(168, 113, 255, 0.1) 0%, rgba(168, 113, 255, 0.15) 100%);
}

.doc-icon-fig .material-symbols-outlined {
  color: var(--color-tertiary-600);
}

.doc-icon-zip {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.15) 100%);
}

.doc-icon-zip .material-symbols-outlined {
  color: #f59e0b;
}

.document-icon .material-symbols-outlined {
  font-size: 24px;
}

.document-info {
  flex: 1;
}

.document-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.document-size {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.document-actions {
  display: flex;
  gap: 8px;
}

/* 响应式编辑弹窗 */
@media (max-width: 1279px) {
  .reports-grid,
  .documents-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .risk-board {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .reports-grid,
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .kanban-columns {
    flex-direction: column;
  }
  
  .kanban-column {
    min-width: 100%;
  }
  
  .add-column-btn {
    min-width: 100%;
  }
}
</style>