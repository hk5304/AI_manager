// 模拟数据文件

// 项目列表数据
export const projects = [
  {
    id: 1,
    name: '智能办公系统',
    status: '进行中',
    progress: 65,
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    manager: '张三',
    members: 8,
    priority: '高',
    tags: ['前端', '后端', '移动端']
  },
  {
    id: 2,
    name: '数据分析平台',
    status: '已完成',
    progress: 100,
    startDate: '2025-10-01',
    endDate: '2026-01-31',
    manager: '李四',
    members: 5,
    priority: '中',
    tags: ['数据', '分析', '可视化']
  },
  {
    id: 3,
    name: '客户管理系统',
    status: '计划中',
    progress: 10,
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    manager: '王五',
    members: 6,
    priority: '高',
    tags: ['CRM', '客户', '管理']
  },
  {
    id: 4,
    name: '在线教育平台',
    status: '进行中',
    progress: 45,
    startDate: '2026-02-01',
    endDate: '2026-07-31',
    manager: '赵六',
    members: 12,
    priority: '中',
    tags: ['教育', '在线', '平台']
  },
  {
    id: 5,
    name: '电商网站重构',
    status: '进行中',
    progress: 75,
    startDate: '2026-01-01',
    endDate: '2026-05-31',
    manager: '孙七',
    members: 10,
    priority: '高',
    tags: ['电商', '前端', '重构']
  }
]

// 项目成员数据
export const projectMembers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'owner',
    status: 'joined',
    avatarColor: '#409eff'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: 'pm',
    status: 'joined',
    avatarColor: '#67c23a'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: 'developer',
    status: 'joined',
    avatarColor: '#e6a23c'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'qa',
    status: 'joined',
    avatarColor: '#f56c6c'
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    role: 'product',
    status: 'pending',
    avatarColor: '#909399'
  }
]

// 组织架构数据
export const orgTree = [
  {
    id: 1,
    name: '技术部',
    expanded: true,
    members: [
      { id: 6, name: '周八', email: 'zhouba@example.com' },
      { id: 7, name: '吴九', email: 'wujiu@example.com' },
      { id: 8, name: '郑十', email: 'zhengshi@example.com' },
      { id: 9, name: '王十一', email: 'wangshiyi@example.com' },
      { id: 10, name: '陈十二', email: 'chenshier@example.com' }
    ]
  },
  {
    id: 2,
    name: '产品部',
    expanded: false,
    members: [
      { id: 11, name: '林十三', email: 'linshisan@example.com' },
      { id: 12, name: '黄十四', email: 'huangshisi@example.com' },
      { id: 13, name: '马十五', email: 'mashiwu@example.com' }
    ]
  },
  {
    id: 3,
    name: '测试部',
    expanded: false,
    members: [
      { id: 14, name: '牛十六', email: 'niushiliu@example.com' },
      { id: 15, name: '杨十七', email: 'yangshiqi@example.com' }
    ]
  },
  {
    id: 4,
    name: '设计部',
    expanded: false,
    members: [
      { id: 16, name: '朱十八', email: 'zhushiba@example.com' },
      { id: 17, name: '秦十九', email: 'qinshijiu@example.com' }
    ]
  }
]

// 任务数据
export const tasks = [
  {
    id: 1,
    title: '首页UI设计',
    description: '完成系统首页的UI设计，包括布局、配色方案和交互效果',
    status: '待开始',
    priority: 'P1',
    dueDate: '2026-03-15',
    assignee: '朱十八',
    projectId: 1,
    estimatedHours: 16,
    actualHours: 0
  },
  {
    id: 2,
    title: '用户登录功能',
    description: '实现用户登录、注册和忘记密码功能',
    status: '进行中',
    priority: 'P0',
    dueDate: '2026-03-10',
    assignee: '王五',
    projectId: 1,
    estimatedHours: 24,
    actualHours: 12
  },
  {
    id: 3,
    title: '数据库设计',
    description: '设计系统的数据库结构，包括表结构和关系',
    status: '已完成',
    priority: 'P1',
    dueDate: '2026-03-05',
    assignee: '吴九',
    projectId: 1,
    estimatedHours: 16,
    actualHours: 18
  },
  {
    id: 4,
    title: 'API接口开发',
    description: '开发系统所需的RESTful API接口',
    status: '进行中',
    priority: 'P1',
    dueDate: '2026-03-20',
    assignee: '周八',
    projectId: 1,
    estimatedHours: 32,
    actualHours: 16
  },
  {
    id: 5,
    title: '测试用例编写',
    description: '编写系统的测试用例，包括功能测试和性能测试',
    status: '待开始',
    priority: 'P2',
    dueDate: '2026-03-25',
    assignee: '牛十六',
    projectId: 1,
    estimatedHours: 20,
    actualHours: 0
  }
]

// 日志数据
export const logs = [
  {
    id: 1,
    userId: 1,
    userName: '张三',
    date: '2026-04-24',
    completed: '1. 完成项目需求分析\n2. 确定技术架构\n3. 分配任务给团队成员',
    plan: '1. 开始系统设计\n2. 与产品经理沟通需求细节\n3. 制定项目计划',
    issues: '暂无重大问题，团队协作良好',
    comments: [
      {
        id: 1,
        userId: 2,
        userName: '李四',
        content: '计划安排合理，支持！',
        time: '2026-04-24 15:30'
      }
    ],
    likes: 3
  },
  {
    id: 2,
    userId: 3,
    userName: '王五',
    date: '2026-04-24',
    completed: '1. 完成登录页面开发\n2. 实现密码加密功能\n3. 测试登录流程',
    plan: '1. 开始注册功能开发\n2. 实现忘记密码功能\n3. 优化登录体验',
    issues: '遇到了一些前端样式问题，需要与设计人员沟通',
    comments: [],
    likes: 1
  },
  {
    id: 3,
    userId: 4,
    userName: '赵六',
    date: '2026-04-24',
    completed: '1. 编写测试计划\n2. 设计测试用例\n3. 搭建测试环境',
    plan: '1. 开始功能测试\n2. 编写测试报告\n3. 与开发人员沟通测试结果',
    issues: '测试环境搭建遇到了一些网络问题',
    comments: [
      {
        id: 2,
        userId: 5,
        userName: '孙七',
        content: '测试计划很详细，期待测试结果',
        time: '2026-04-24 16:45'
      }
    ],
    likes: 2
  }
]

// PBC目标数据
export const pbcGoals = [
  {
    id: 1,
    title: '完成智能办公系统开发',
    description: '负责智能办公系统的前端开发工作，确保系统按时上线',
    type: '里程碑型',
    target: '系统正式上线',
    progress: 65,
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    alignedOKR: '提高公司办公效率30%',
    tasks: [2, 4],
    status: '进行中'
  },
  {
    id: 2,
    title: '完成5个功能模块开发',
    description: '在本季度完成5个功能模块的开发工作',
    type: '数值型',
    target: 5,
    current: 3,
    progress: 60,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    alignedOKR: '提升产品功能完整性',
    tasks: [1, 3, 5],
    status: '进行中'
  },
  {
    id: 3,
    title: '技术文档完善',
    description: '完善项目的技术文档，包括架构设计、API文档等',
    type: '里程碑型',
    target: '文档完整并通过审核',
    progress: 80,
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    alignedOKR: '提高代码可维护性',
    tasks: [],
    status: '进行中'
  }
]

// 报表数据
export const reports = {
  progress: [
    { name: '1月', value: 20 },
    { name: '2月', value: 40 },
    { name: '3月', value: 65 },
    { name: '4月', value: 80 },
    { name: '5月', value: 90 },
    { name: '6月', value: 100 }
  ],
  workload: [
    { name: '张三', value: 160 },
    { name: '李四', value: 140 },
    { name: '王五', value: 180 },
    { name: '赵六', value: 120 },
    { name: '孙七', value: 150 }
  ],
  quality: [
    { name: '1月', bugs: 12, resolved: 8 },
    { name: '2月', bugs: 8, resolved: 7 },
    { name: '3月', bugs: 5, resolved: 5 },
    { name: '4月', bugs: 3, resolved: 3 }
  ]
}

// 用户数据
export const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'super_admin' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'admin' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'pm' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'qa' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', role: 'product' },
  { id: 6, name: '周八', email: 'zhouba@example.com', role: 'developer' },
  { id: 7, name: '吴九', email: 'wujiu@example.com', role: 'developer' },
  { id: 8, name: '郑十', email: 'zhengshi@example.com', role: 'developer' }
]
