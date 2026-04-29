import { ref, onUnmounted } from 'vue'

const useSSE = () => {
  const isConnected = ref(false)
  const messages = ref([])
  const error = ref(null)
  let eventSource = null

  const connect = (url, options = {}) => {
    if (eventSource) {
      eventSource.close()
    }

    isConnected.value = true
    error.value = null
    messages.value = []

    try {
      eventSource = new EventSource(url, options)

      eventSource.onopen = () => {
        console.log('SSE connection opened')
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          messages.value.push(data)
        } catch (e) {
          messages.value.push({ content: event.data })
        }
      }

      eventSource.onerror = (e) => {
        console.error('SSE connection error:', e)
        error.value = 'SSE连接错误'
        isConnected.value = false
        eventSource.close()
      }
    } catch (e) {
      console.error('Failed to create EventSource:', e)
      error.value = '创建SSE连接失败'
      isConnected.value = false
    }
  }

  const close = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
      isConnected.value = false
    }
  }

  onUnmounted(() => {
    close()
  })

  return {
    isConnected,
    messages,
    error,
    connect,
    close
  }
}

export default useSSE