import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import DragableList from '@renderer/components/DragableList'
import CopyIcon from '@renderer/components/Icons/CopyIcon'
import ListItem from '@renderer/components/ListItem'
import Scrollbar from '@renderer/components/Scrollbar'
import { getModelLogo } from '@renderer/config/models'
import { useAgents } from '@renderer/hooks/useAgents'
import { useAssistant, useAssistants } from '@renderer/hooks/useAssistant'
import { modelGenerating } from '@renderer/hooks/useRuntime'
import { useSettings } from '@renderer/hooks/useSettings'
import AssistantSettingsPopup from '@renderer/pages/settings/AssistantSettings'
import { getDefaultTopic } from '@renderer/services/AssistantService'
import { EVENT_NAMES, EventEmitter } from '@renderer/services/EventService'
import { Assistant } from '@renderer/types'
import { uuid } from '@renderer/utils'
import { Avatar, Button, Dropdown } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { last, omit } from 'lodash'
import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
  activeAssistant: Assistant
  setActiveAssistant: (assistant: Assistant) => void
  onCreateDefaultAssistant: () => void
  onCreateAssistant: () => void
}

const Assistants: FC<Props> = ({
  activeAssistant,
  setActiveAssistant,
  onCreateAssistant,
  onCreateDefaultAssistant
}) => {
  const { assistants, removeAssistant, addAssistant, updateAssistants } = useAssistants()
  const [dragging, setDragging] = useState(false)
  const { removeAllTopics } = useAssistant(activeAssistant.id)
  const { clickAssistantToShowTopic, topicPosition } = useSettings()
  const { t } = useTranslation()
  const { addAgent } = useAgents()

  const onDelete = useCallback(
    (assistant: Assistant) => {
      const _assistant: Assistant | undefined = last(assistants.filter((a) => a.id !== assistant.id))
      _assistant ? setActiveAssistant(_assistant) : onCreateDefaultAssistant()
      removeAssistant(assistant.id)
    },
    [assistants, onCreateDefaultAssistant, removeAssistant, setActiveAssistant]
  )

  const getMenuItems = useCallback(
    (assistant: Assistant) =>
      [
        {
          label: t('assistants.edit.title'),
          key: 'edit',
          icon: <EditOutlined />,
          onClick: () => AssistantSettingsPopup.show({ assistant })
        },
        {
          label: t('assistants.copy.title'),
          key: 'duplicate',
          icon: <CopyIcon />,
          onClick: async () => {
            const _assistant: Assistant = { ...assistant, id: uuid(), topics: [getDefaultTopic(assistant.id)] }
            addAssistant(_assistant)
            setActiveAssistant(_assistant)
          }
        },
        {
          label: t('assistants.clear.title'),
          key: 'clear',
          icon: <MinusCircleOutlined />,
          onClick: () => {
            window.modal.confirm({
              title: t('assistants.clear.title'),
              content: t('assistants.clear.content'),
              centered: true,
              okButtonProps: { danger: true },
              onOk: removeAllTopics
            })
          }
        },
        {
          label: t('assistants.save.title'),
          key: 'save-to-agent',
          icon: <SaveOutlined />,
          onClick: async () => {
            const agent = omit(assistant, ['model', 'emoji'])
            agent.id = uuid()
            agent.type = 'agent'
            addAgent(agent)
            window.message.success({
              content: t('assistants.save.success'),
              key: 'save-to-agent'
            })
          }
        },
        { type: 'divider' },
        {
          label: t('common.delete'),
          key: 'delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => {
            window.modal.confirm({
              title: t('assistants.delete.title'),
              content: t('assistants.delete.content'),
              centered: true,
              okButtonProps: { danger: true },
              onOk: () => onDelete(assistant)
            })
          }
        }
      ] as ItemType[],
    [addAgent, addAssistant, onDelete, removeAllTopics, setActiveAssistant, t]
  )

  const onSwitchAssistant = useCallback(
    async (assistant: Assistant) => {
      await modelGenerating()

      if (topicPosition === 'left' && clickAssistantToShowTopic) {
        EventEmitter.emit(EVENT_NAMES.SWITCH_TOPIC_SIDEBAR)
      }

      setActiveAssistant(assistant)
    },
    [clickAssistantToShowTopic, setActiveAssistant, topicPosition]
  )

  return (
    <Container className="assistants-tab">
      <Header>
        <Title>{t('assistants.title')}</Title>
      </Header>
      <DragableList
        list={assistants}
        onUpdate={updateAssistants}
        style={{ paddingBottom: dragging ? '34px' : 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}>
        {(assistant) => {
          const isCurrent = assistant.id === activeAssistant?.id
          return (
            <Dropdown key={assistant.id} menu={{ items: getMenuItems(assistant) }} trigger={['contextMenu']}>
              <ListItem
                active={isCurrent}
                style={{ margin: '0 8px' }}
                onClick={() => onSwitchAssistant(assistant)}
                icon={
                  <Avatar size={30} src={getModelLogo(assistant.defaultModel?.id)} style={{ flexShrink: 0 }}>
                    {assistant.emoji || t('chat.default.emoji')}
                  </Avatar>
                }
                title={assistant.name || t('chat.default.name')}
              />
            </Dropdown>
          )
        }}
      </DragableList>
      {!dragging && (
        <Button type="dashed" onClick={onCreateAssistant} icon={<PlusOutlined />} style={{ margin: '0 10px' }}>
          {t('chat.add.assistant.title')}
        </Button>
      )}
    </Container>
  )
}

const Container = styled(Scrollbar)`
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  background-color: var(--list-background);
`

const Header = styled.div`
  display: flex;
  padding: 8px;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-3);
  padding-left: 8px;
`

export default Assistants
