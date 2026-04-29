<template>
  <div class="ai-assistant">
    <div class="ai-toggle" @click="togglePanel" :class="{ active: isPanelOpen }">
      <div class="ai-icon">🤖</div>
    </div>
    <div class="ai-panel" :class="{ open: isPanelOpen }">
      <div class="ai-panel-header">
        <h3>AI 助手</h3>
        <button class="close-btn" @click="togglePanel">×</button>
      </div>
      <div class="ai-messages">
        <div v-for="(msg, index) in messages" :key="index" class="ai-message" :class="{ user: msg.role === 'user' }">
          <div class="message-content">{{ msg.content }}</div>
        </div>
        <div v-if="isLoading" class="ai-message">
          <div class="message-content">
            <div class="loading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="ai-input">
        <input 
          type="text" 
          v-model="inputMessage" 
          placeholder="输入您的问题..."
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useSSE from '../../composables/useSSE'

const isPanelOpen = ref(false)
const inputMessage = ref('')
const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是AI助手，有什么可以帮助你的吗？'
  }
])
const isLoading = ref(false)

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    messages.value.push({
      role: 'user',
      content: inputMessage.value
    })
    isLoading.value = true
    // 模拟AI响应
    setTimeout(() => {
      messages.value.push({
        role: 'assistant',
        content: '这是一条模拟的AI回复。在实际应用中，这里会通过SSE流式获取AI的实时响应。'
      })
      isLoading.value = false
    }, 1000)
    inputMessage.value = ''
  }
}

// 在实际应用中，这里会使用useSSE来连接后端的AI流式接口
// const { connect, messages: sseMessages } = useSSE()
// onMounted(() => {
//   connect('/api/ai/stream')
// })
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.ai-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #722ed1, #1890ff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.ai-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.ai-icon {
  font-size: 24px;
}

.ai-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform: translateY(20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.ai-panel.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.ai-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #722ed1, #1890ff);
  color: white;
}

.ai-panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-messages {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.ai-message {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.ai-message.user {
  align-items: flex-end;
}

.message-content {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.ai-message:not(.user) .message-content {
  background: #f0f2f5;
  border-bottom-left-radius: 4px;
}

.ai-message.user .message-content {
  background: #1890ff;
  color: white;
  border-bottom-right-radius: 4px;
}

.loading {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1890ff;
  animation: pulse 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.ai-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
}

.ai-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.ai-input input:focus {
  border-color: #1890ff;
}

.send-btn {
  margin-left: 8px;
  padding: 0 16px;
  border: none;
  border-radius: 20px;
  background: #1890ff;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn:hover {
  background: #40a9ff;
}

@media (max-width: 768px) {
  .ai-panel {
    width: 300px;
  }
}
</style>