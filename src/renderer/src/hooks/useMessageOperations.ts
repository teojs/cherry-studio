import { EVENT_NAMES, EventEmitter } from '@renderer/services/EventService'
import { estimateMessageUsage } from '@renderer/services/TokenService'
import store, { useAppDispatch, useAppSelector } from '@renderer/store'
import {
  clearStreamMessage,
  clearTopicMessages,
  commitStreamMessage,
  deleteMessageAction,
  resendMessage,
  selectDisplayCount,
  selectTopicLoading,
  selectTopicMessages,
  setStreamMessage,
  setTopicLoading,
  updateMessages,
  updateMessageThunk
} from '@renderer/store/messages'
import type { Assistant, Message, Topic } from '@renderer/types'
import { abortCompletion } from '@renderer/utils/abortController'
import { useCallback } from 'react'

import { TopicManager } from './useTopic'
/**
 * 自定义Hook，提供消息操作相关的功能
 *
 * @param topic 当前主题
 * @returns 一组消息操作方法
 */
export function useMessageOperations(topic: Topic) {
  const dispatch = useAppDispatch()

  /**
   * 删除单个消息
   */
  const deleteMessage = useCallback(
    async (id: string) => {
      await dispatch(deleteMessageAction(topic, id))
    },
    [dispatch, topic]
  )

  /**
   * 删除一组消息（基于askId）
   */
  const deleteGroupMessages = useCallback(
    async (askId: string) => {
      await dispatch(deleteMessageAction(topic, askId, 'askId'))
    },
    [dispatch, topic]
  )

  /**
   * 编辑消息内容
   */
  const editMessage = useCallback(
    async (messageId: string, updates: Partial<Message>) => {
      // 如果更新包含内容变更，重新计算 token
      if ('content' in updates) {
        const messages = store.getState().messages.messagesByTopic[topic.id]
        const message = messages?.find((m) => m.id === messageId)
        if (message) {
          const updatedMessage = { ...message, ...updates }
          const usage = await estimateMessageUsage(updatedMessage)
          updates.usage = usage
        }
      }
      await dispatch(updateMessageThunk(topic.id, messageId, updates))
    },
    [dispatch, topic.id]
  )

  /**
   * 重新发送消息
   */
  const resendMessageAction = useCallback(
    async (message: Message, assistant: Assistant, isMentionModel = false) => {
      return dispatch(resendMessage(message, assistant, topic, isMentionModel))
    },
    [dispatch, topic]
  )

  /**
   * 重新发送用户消息（编辑后）
   */
  const resendUserMessageWithEdit = useCallback(
    async (message: Message, editedContent: string, assistant: Assistant) => {
      // 先更新消息内容
      await editMessage(message.id, { content: editedContent })
      // 然后重新发送
      return dispatch(resendMessage({ ...message, content: editedContent }, assistant, topic))
    },
    [dispatch, editMessage, topic]
  )

  /**
   * 设置流式消息
   */
  const setStreamMessageAction = useCallback(
    (message: Message | null) => {
      dispatch(setStreamMessage({ topicId: topic.id, message }))
    },
    [dispatch, topic.id]
  )

  /**
   * 提交流式消息
   */
  const commitStreamMessageAction = useCallback(
    (messageId: string) => {
      dispatch(commitStreamMessage({ topicId: topic.id, messageId }))
    },
    [dispatch, topic.id]
  )

  /**
   * 清除流式消息
   */
  const clearStreamMessageAction = useCallback(
    (messageId: string) => {
      dispatch(clearStreamMessage({ topicId: topic.id, messageId }))
    },
    [dispatch, topic.id]
  )

  /**
   * 清除会话消息
   */
  const clearTopicMessagesAction = useCallback(
    async (_topicId?: string) => {
      const topicId = _topicId || topic.id
      await dispatch(clearTopicMessages(topicId))
      await TopicManager.clearTopicMessages(topicId)
    },
    [dispatch, topic.id]
  )

  /**
   * 更新消息数据
   */
  const updateMessagesAction = useCallback(
    async (messages: Message[]) => {
      await dispatch(updateMessages(topic, messages))
    },
    [dispatch, topic]
  )

  /**
   * 创建新的上下文（clear message）
   */
  const createNewContext = useCallback(async () => {
    EventEmitter.emit(EVENT_NAMES.NEW_CONTEXT)
  }, [])

  const displayCount = useAppSelector(selectDisplayCount)
  // /**
  //  * 获取当前消息列表
  //  */
  // const getMessages = useCallback(() => messages, [messages])

  /**
   * 暂停消息生成
   */
  // const pauseMessage = useCallback(
  //   // 存的是用户消息的id，也就是助手消息的askId
  //   async (message: Message) => {
  //     // 1. 调用 abort

  //     // 2. 更新消息状态,
  //     // await editMessage(message.id, { status: 'paused', content: message.content })

  //     // 3.更改loading状态
  //     dispatch(setTopicLoading({ topicId: message.topicId, loading: false }))

  //     // 4. 清理流式消息
  //     // clearStreamMessageAction(message.id)
  //   },
  //   [editMessage, dispatch, clearStreamMessageAction]
  // )

  const pauseMessages = useCallback(async () => {
    // 暂停的消息不需要在这更改status,通过catch判断abort错误之后设置message.status
    const streamMessages = store.getState().messages.streamMessagesByTopic[topic.id]
    if (!streamMessages) return
    // 不需要重复暂停
    const askIds = [...new Set(Object.values(streamMessages).map((m) => m?.askId))]

    for (const askId of askIds) {
      askId && abortCompletion(askId)
    }
    dispatch(setTopicLoading({ topicId: topic.id, loading: false }))
  }, [topic.id, dispatch])

  /**
   * 恢复/重发消息
   * 暂时不需要
   */
  const resumeMessage = useCallback(
    async (message: Message, assistant: Assistant) => {
      return resendMessageAction(message, assistant)
    },
    [resendMessageAction]
  )

  return {
    displayCount,
    updateMessages: updateMessagesAction,
    deleteMessage,
    deleteGroupMessages,
    editMessage,
    resendMessage: resendMessageAction,
    resendUserMessageWithEdit,
    setStreamMessage: setStreamMessageAction,
    commitStreamMessage: commitStreamMessageAction,
    clearStreamMessage: clearStreamMessageAction,
    createNewContext,
    clearTopicMessages: clearTopicMessagesAction,
    // pauseMessage,
    pauseMessages,
    resumeMessage
  }
}

export const useTopicMessages = (topic: Topic) => {
  const messages = useAppSelector((state) => selectTopicMessages(state, topic.id))
  return messages
}

export const useTopicLoading = (topic: Topic) => {
  const loading = useAppSelector((state) => selectTopicLoading(state, topic.id))
  return loading
}
