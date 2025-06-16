<template>
  <a-layout class="app-container">
    <!-- 左侧边栏 -->
    <a-layout-sider
      width="260"
      theme="light"
      class="left-sidebar"
    >
      <div class="new-chat-btn">
        <a-button
          type="primary"
          block
          icon="plus"
          @click="handleNewChat"
        >
          开启新对话
        </a-button>
      </div>

      <a-menu
        mode="inline"
        class="chat-history-menu"
        :default-selected-keys="['today']"
      >
        <a-menu-item-group title="今天" key="today">
          <a-menu-item
            v-for="(item, index) in todaySessions"
            :key="'today-'+index"
          >
            <div class="chat-item">
              <span class="text-ellipsis">{{ item.title }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </a-menu-item>
        </a-menu-item-group>

        <a-menu-item-group title="7 天内" key="7days">
          <a-menu-item
            v-for="(item, index) in weekSessions"
            :key="'week-'+index"
          >
            <div class="chat-item">
              <span class="text-ellipsis">{{ item.title }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </a-menu-item>
        </a-menu-item-group>

        <a-menu-item-group title="30 天内" key="30days">
          <a-menu-item key="month-1">
            <div class="chat-item">
              <span class="text-ellipsis">Make学霸.AI智能扫码登录下载</span>
              <span class="time">2024-03-15</span>
            </div>
          </a-menu-item>
        </a-menu-item-group>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧主区域 -->
    <a-layout class="main-content">
      <!-- 消息区域 -->
      <a-layout-content class="message-container">
        <div class="welcome-message">
          <div class="avatar-wrapper">
            <a-avatar
              :size="64"
              src="https://example.com/ai-avatar.png"
            />
          </div>
          <h2>我是 DeepSeek，很高兴见到你！</h2>
          <p class="sub-text">我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</p>
        </div>

        <div class="message-list">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message-item', message.role]"
          >
            <a-avatar
              :src="message.avatar"
              class="message-avatar"
            />
            <div class="message-content">
              <div class="message-bubble">
                {{ message.content }}
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </a-layout-content>

      <!-- 输入区域 -->
      <a-layout-footer class="input-container">
        <div class="input-wrapper">
          <a-textarea
            v-model="inputMessage"
            placeholder="给 DeepSeek 发送消息"
            :auto-size="{ minRows: 1, maxRows: 4 }"
            @pressEnter="handleSend"
          />
          <div class="action-buttons">
            <a-button
              type="link"
              icon="bulb"
              class="deep-think-btn"
            >
              深度思考 (R1)
            </a-button>
            <a-button
              type="primary"
              @click="handleSend"
              :loading="sending"
            >
              获取搜索
            </a-button>
          </div>
        </div>
        <div class="footer-notice">
          内容由 AI 生成，请仔细甄别
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      inputMessage: '',
      sending: false,
      messages: [
        {
          role: 'assistant',
          content: '你好！我是DeepSeek，有什么可以帮您？',
          time: '10:30 AM',
          avatar: 'https://example.com/ai-avatar.png'
        }
      ],
      todaySessions: [
        { title: 'Vue3全局变量创建方法总结', time: '14:20' },
        { title: 'Vue实现类似DeepSeek聊天界面', time: '11:45' }
      ],
      weekSessions: [
        { title: '获取Parallels Desktop正版授权', time: '3天前' }
      ]
    }
  },
  methods: {
    handleNewChat() {
      this.messages = []
    },
    async handleSend() {
      if (!this.inputMessage.trim()) return
      
      const userMessage = {
        role: 'user',
        content: this.inputMessage,
        time: new Date().toLocaleTimeString(),
        avatar: 'https://example.com/user-avatar.png'
      }
      
      this.sending = true
      this.messages.push(userMessage)
      this.inputMessage = ''

      // 模拟AI回复
      setTimeout(() => {
        this.messages.push({
          role: 'assistant',
          content: `这是关于 "${userMessage.content}" 的模拟回答...`,
          time: new Date().toLocaleTimeString(),
          avatar: 'https://example.com/ai-avatar.png'
        })
        this.sending = false
        this.scrollToBottom()
      }, 1000)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = document.querySelector('.message-list')
        container.scrollTop = container.scrollHeight
      })
    }
  }
}
</script>

<style lang="scss" >
// 颜色变量
$primary-color: #1677ff;
$bg-color: #f5f5f5;
$border-color: #e8e8e8;

.app-container {
  height: 100vh;
  overflow: hidden;

  .left-sidebar {
    border-right: 1px solid $border-color;

    .new-chat-btn {
      padding: 16px;
      border-bottom: 1px solid $border-color;
    }

    .chat-history-menu {
      border-right: 0;

       .ant-menu-item-group-title {
        padding: 16px 24px 8px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }

      .chat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        font-size: 14px;

        .time {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
          margin-left: 8px;
        }
      }
    }
  }

  .main-content {
    display: flex;
    flex-direction: column;

    .message-container {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: white;

      .welcome-message {
        text-align: center;
        margin: 60px 0 100px;

        .avatar-wrapper {
          margin-bottom: 24px;
        }

        h2 {
          font-size: 24px;
          margin-bottom: 16px;
        }

        .sub-text {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }

      .message-list {
        max-width: 800px;
        margin: 0 auto;
        .message-item {
          display: flex;
          margin: 24px 0;

          &.user {
            flex-direction: row-reverse;

            .message-bubble {
              background: $primary-color;
              color: white;

              .message-time {
                color: rgba(255, 255, 255, 0.7);
              }
            }
          }
        }

        .message-avatar {
          flex-shrink: 0;
          margin: 0 12px;
        }

        .message-bubble {
          max-width: 600px;
          padding: 12px 16px;
          border-radius: 8px;
          background: $bg-color;
          position: relative;
          line-height: 1.6;

          .message-time {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
            margin-top: 6px;
          }
        }
      }
    }

    .input-container {
      padding: 16px 24px;
      border-top: 1px solid $border-color;
      background: white;

      .input-wrapper {
        position: relative;
        max-width: 800px;
        margin: 0 auto;
        .ant-input {
          padding-right: 120px;
        }

        .action-buttons {
          position: absolute;
          right: 8px;
          bottom: 8px;
          display: flex;
          gap: 8px;
        }
      }

      .footer-notice {
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-top: 8px;
      }
    }
  }
}

// 公共样式
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
</style>