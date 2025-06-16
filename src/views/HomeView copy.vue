<template>
  <div class="chat-container">
    <!-- 左侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-content">
        <h1 class="logo">deepseek</h1>
        <a-button type="primary" class="new-chat-btn" @click="handleNewChat">
          开启新对话
        </a-button>
        <div class="conversation-list">
          <!-- 动态生成对话列表 -->
          <div class="time-section" v-if="todayConversations.length">
            <div class="time-label">今天</div>
            <div
              v-for="conv in todayConversations"
              :key="conv.id"
              class="conv-item"
              :class="{ active: activeConversation === conv.id }"
              @click="switchConversation(conv.id)"
            >
              {{ conv.title }}
            </div>
          </div>
          <!-- 动态生成对话列表 -->
          <div class="time-section" v-if="weekConversations.length">
            <div class="time-label">7天内</div>
            <div
              v-for="conv in weekConversations"
              :key="conv.id"
              class="conv-item"
              :class="{ active: activeConversation === conv.id }"
              @click="switchConversation(conv.id)"
            >
              {{ conv.title }}
            </div>
          </div>
          <div class="time-section" v-if="monthConversations.length">
            <div class="time-label">30天内</div>
            <div
              v-for="conv in monthConversations"
              :key="conv.id"
              class="conv-item"
              :class="{ active: activeConversation === conv.id }"
              @click="switchConversation(conv.id)"
            >
              {{ conv.title }}
            </div>
          </div>
        </div>
        <div class="sidebar-footer">
          <div class="download-app">
            <span>下载App</span>
            <a-badge count="NEW" />
          </div>
          <div class="user-info">个人信息</div>
        </div>
      </div>
    </div>
    <!-- 主聊天区域 -->
    <div class="main-content">
      <!-- 消息列表 -->
      <!-- 消息列表绑定当前对话 -->
      <div class="message-list">
        <!-- <div 
          v-for="(msg, index) in currentMessages"
          :key="index"
          :class="['message-item', msg.role]"
        >
          {{ msg.content }}
        </div> -->
        <div
          class="message-item"
          :class="msg.role"
          v-for="(msg, index) in currentMessages"
          :key="index"
        >
          <div class="avatar">
            <img
              v-if="msg.role === 'user'"
              src = "5f2f58c4893afd346fdff02c5555d6eb"
              alt="用户头像"
            />
            <div v-else class="ai-avatar">
              <svg><!-- AI头像SVG --></svg>
            </div>
          </div>
          <div class="message-container">
            <div class="message-bubble">
              <div class="message-content">{{ msg.content }}</div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
            <div v-if="msg.status === 'sending'" class="status-indicator">
              <div class="dot-flashing"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <span class="input-label">给DeepSeek发送消息</span>
          <div class="action-buttons">
            <a-button class="mode-btn">深度思考 (R1)</a-button>
            <a-button class="mode-btn">联网搜索</a-button>
          </div>
        </div>
        <div class="input-area">
          <a-input
            v-model="inputMessage"
            placeholder="输入消息..."
            class="message-input"
            @keyup.enter="handleSend"
          >
            <a-button
              slot="suffix"
              type="primary"
              shape="circle"
              icon="search"
              :loading="sending"
              @click="handleSend"
            />
          </a-input>
        </div>
        <div class="disclaimer">内容由AI生成，请仔细甄别</div>
      </div>
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  data() {
    return {
      conversations: [
        // 初始化示例数据
        {
          id: uuidv4(),
          title: "示例对话",
          messages: [{ role: "ai", content: "初始欢迎消息..." }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      activeConversation: null,
      inputMessage: "",
      sending: false,
      messages: [
        {
          role: "ai",
          content:
            "我是DeepSeek，很高兴见到你！我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~",
        },
      ],
    };
  },
  mounted() {
    console.log("conversations", this.conversations);
    // 确保初始化时至少有一个对话
    if (this.conversations.length === 0) {
      this.handleNewChat();
    } else {
      this.activeConversation = this.conversations.id;
    }
  },
  methods: {
    // 自动生成对话标题
    updateConversationTitle() {
      const conv = this.conversations.find(
        (c) => c.id === this.activeConversation
      );
      if (conv && conv.messages.length > 0) {
        const firstMessage = conv.messages.content;
        conv.title = firstMessage.substring(0, 20) || "新对话";
      }
    },
    // 切换对话
    switchConversation(convId) {
      this.activeConversation = convId;
    },
    // 新建对话
    handleNewChat() {
      // 修改后的新建对话方法
      const newConversation = {
        id: uuidv4(),
        title: "新对话",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.conversations.unshift(newConversation);
      this.activeConversation = newConversation.id; // 确保设置激活状态
    },
    // 修改后的发送消息方法
    async handleSend() {
      // 新增初始化检查
      if (!this.activeConversation) {
        this.handleNewChat(); // 自动创建新对话
        await this.$nextTick(); // 等待新建对话完成
      }
      if (!this.inputMessage.trim()) return;

      const convIndex = this.conversations.findIndex(
        (c) => c.id === this.activeConversation
      );
      // 添加防御性检查
      if (convIndex === -1) {
        console.error("未找到有效对话");
        return;
      }
      if (!this.inputMessage.trim()) return;

      const newMessage = {
        role: "user",
        content: this.inputMessage,
        timestamp: new Date(),
      };
      console.log("convIndex", convIndex);
      if (convIndex > -1) {
        this.$set(this.conversations[convIndex], "messages", [
          ...this.conversations[convIndex].messages,
          newMessage,
        ]);
        this.$set(this.conversations[convIndex], "updatedAt", new Date());
      }

      // 模拟AI回复
      const aiResponse = {
        role: "ai",
        content: "这是AI回复...",
        timestamp: new Date(),
      };

      setTimeout(() => {
        this.$set(this.conversations[convIndex], "messages", [
          ...this.conversations[convIndex].messages,
          aiResponse,
        ]);
      }, 1000);

      this.inputMessage = "";
    },
  },
  computed: {
    // 当前对话的消息列表
    currentMessages() {
      const conv = this.conversations.find(
        (c) => c.id === this.activeConversation
      );
      return conv ? conv.messages : [];
    },
    // 按时间分类的对话列表
    todayConversations() {
      return this.conversations.filter((conv) => {
        const diff = new Date() - new Date(conv.createdAt);
        return diff < 86400000; // 24小时
      });
    },
    weekConversations() {
      return this.conversations.filter((conv) => {
        const diff = new Date() - new Date(conv.createdAt);
        return diff < 86400000 * 7; // 24小时
      });
    },
    monthConversations() {
      return this.conversations.filter((conv) => {
        const diff = new Date() - new Date(conv.createdAt);
        return diff < 86400000 * 30; // 24小时
      });
    },
  },
  updated() {
    this.$nextTick(() => {
      const container = this.$el.querySelector(".message-list");
      container.scrollTop = container.scrollHeight;
    });
  },
};
</script>
<style lang="scss" scoped>
$deepseek-blue: #1677ff;
$sidebar-bg: #fff;
$border-color: #e5e5e5;
$hover-bg: #f5f5f5;
$text-secondary: #666;

.chat-container {
  display: flex;
  height: 100vh;
  background-color: #fafafa;
  overflow: hidden;

  // 左侧边栏
  .sidebar {
    width: 256px;
    background: $sidebar-bg;
    border-right: 1px solid $border-color;
    display: flex;
    flex-direction: column;

    &-content {
      padding: 12px 8px;
      flex: 1;
      overflow-y: auto;
      height: calc(100vh - 120px);
    }

    .logo {
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.88);
      padding-left: 8px;
      margin-bottom: 20px;
    }

    .new-chat-btn {
      width: 100%;
      height: 40px;
      border-radius: 6px;
      font-weight: 500;
      margin-bottom: 20px;
    }

    .conversation-list {
      .time-section {
        margin-bottom: 16px;

        .time-label {
          color: $text-secondary;
          font-size: 12px;
          padding: 8px;
        }

        .conv-item {
          font-size: 13px;
          padding: 8px 12px;
          margin: 4px 0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: $hover-bg;
            transform: translateX(2px);
          }
        }
      }
    }

    &-footer {
      border-top: 1px solid $border-color;
      padding: 16px;

      .download-app {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        color: $deepseek-blue;
        font-size: 13px;

        ::v-deep .ant-badge-count {
          background: $deepseek-blue;
          box-shadow: none;
        }
      }

      .user-info {
        padding: 8px 0;
        color: $text-secondary;
        font-size: 13px;
      }
    }
  }

  // 主内容区
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;

    // 消息列表
    .message-list {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;

      .message-item {
        display: flex;
        margin: 16px 0;
        transition: all 0.3s ease;

        &.user {
          flex-direction: row-reverse;

          .message-bubble {
            background: $deepseek-blue;
            border-radius: 12px 12px 0 12px;

            &::after {
              content: "";
              position: absolute;
              right: -8px;
              top: 0;
              border: 8px solid transparent;
              border-left-color: $deepseek-blue;
            }
          }
          .message-time {
            text-align: right;
          }
        }

        &.ai {
          .message-bubble {
            background: #fff;
            border-radius: 12px 12px 12px 0;

            &::after {
              content: "";
              position: absolute;
              left: -8px;
              top: 0;
              border: 8px solid transparent;
              border-right-color: #fff;
            }
          }
        }
      }
      .avatar {
        width: 36px;
        height: 36px;
        margin: 0 12px;

        img {
          width: 100%;
          border-radius: 50%;
        }

        .ai-avatar {
          background: #fff;
          border-radius: 50%;
          padding: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

          svg {
            width: 24px;
            height: 24px;
            fill: $deepseek-blue;
          }
        }
      }

      .message-bubble {
        max-width: 70%;
        padding: 12px 16px;
        position: relative;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        animation: messageAppear 0.3s ease;

        .message-content {
          font-size: 14px;
          line-height: 1.6;
          color: inherit;
        }

        .message-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 4px;
        }
      }
      // 加载状态动画
      .dot-flashing {
        position: relative;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: #999;
        animation: dotFlashing 1s infinite alternate;

        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background-color: #999;
          animation: dotFlashing 1s infinite alternate;
        }

        &::before {
          left: -10px;
          animation-delay: 0s;
        }

        &::after {
          left: 10px;
          animation-delay: 0.5s;
        }
      }
      @keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dotFlashing {
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
    }

    // 输入区域
    .input-section {
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
      padding-top: 16px;

      .input-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .input-label {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }

        .mode-btn {
          border-color: $border-color;
          color: $text-secondary;
          margin-left: 8px;
        }
      }

      .input-area {
        position: relative;

        .ant-input {
          border-radius: 8px;
          padding: 12px 40px 12px 16px;
          border-color: $border-color;
        }

        .ant-btn {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          transition: all 0.2s;
        }
      }

      .disclaimer {
        color: #999;
        font-size: 12px;
        margin-top: 8px;
      }
    }
  }
}
</style>
