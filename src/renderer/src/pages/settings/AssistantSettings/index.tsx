import Scrollbar from '@renderer/components/Scrollbar'
import { TopView } from '@renderer/components/TopView'
import { useAgent } from '@renderer/hooks/useAgents'
import { useAssistant } from '@renderer/hooks/useAssistant'
import { Assistant } from '@renderer/types'
import { Menu, Modal } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import AssistantKnowledgeBaseSettings from './AssistantKnowledgeBaseSettings'
import AssistantMessagesSettings from './AssistantMessagesSettings'
import AssistantModelSettings from './AssistantModelSettings'
import AssistantPromptSettings from './AssistantPromptSettings'

interface AssistantSettingPopupShowParams {
  assistant: Assistant
}

interface Props extends AssistantSettingPopupShowParams {
  resolve: (assistant: Assistant) => void
}

const AssistantSettingPopupContainer: React.FC<Props> = ({ resolve, ...props }) => {
  const [open, setOpen] = useState(true)
  const { t } = useTranslation()
  const [menu, setMenu] = useState('prompt')

  const _useAssistant = useAssistant(props.assistant.id)
  const _useAgent = useAgent(props.assistant.id)
  const isAgent = props.assistant.type === 'agent'

  const assistant = isAgent ? _useAgent.agent : _useAssistant.assistant
  const updateAssistant = isAgent ? _useAgent.updateAgent : _useAssistant.updateAssistant
  const updateAssistantSettings = isAgent ? _useAgent.updateAgentSettings : _useAssistant.updateAssistantSettings

  const onOk = () => {
    setOpen(false)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const afterClose = () => {
    resolve(assistant)
  }

  const items = [
    {
      key: 'prompt',
      label: t('assistants.settings.prompt')
    },
    {
      key: 'model',
      label: t('assistants.settings.model')
    },
    {
      key: 'messages',
      label: t('assistants.settings.preset_messages')
    },
    {
      key: 'knowledge_base',
      label: t('assistants.settings.knowledge_base')
    }
  ]

  return (
    <StyledModal
      open={open}
      onOk={onOk}
      onClose={onCancel}
      onCancel={onCancel}
      afterClose={afterClose}
      footer={null}
      title={null}
      transitionName="ant-move-down"
      width="70vw"
      height="80vh"
      centered>
      <ContentContainer>
        <MenuContainer>
          <Title>
            <i className="iconfont icon-setting" /> {assistant.name}
          </Title>
          <Menu mode="inline" onClick={(e) => setMenu(e.key as string)} selectedKeys={[menu]} items={items} />
        </MenuContainer>

        <Settings>
          <SettingHeader>{items.find((item) => item.key === menu)?.label}</SettingHeader>
          <SettingContent>
            {menu === 'prompt' && (
              <AssistantPromptSettings
                assistant={assistant}
                updateAssistant={updateAssistant}
                updateAssistantSettings={updateAssistantSettings}
                onOk={onOk}
              />
            )}
            {menu === 'model' && (
              <AssistantModelSettings
                assistant={assistant}
                updateAssistant={updateAssistant}
                updateAssistantSettings={updateAssistantSettings}
              />
            )}
            {menu === 'messages' && (
              <AssistantMessagesSettings
                assistant={assistant}
                updateAssistant={updateAssistant}
                updateAssistantSettings={updateAssistantSettings}
              />
            )}
            {menu === 'knowledge_base' && (
              <AssistantKnowledgeBaseSettings
                assistant={assistant}
                updateAssistant={updateAssistant}
                updateAssistantSettings={updateAssistantSettings}
              />
            )}
          </SettingContent>
        </Settings>
      </ContentContainer>
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  padding-bottom: 0;

  .ant-modal-content {
    padding: 0;
    overflow: hidden;
    border-radius: var(--border-radius-md);
    border: var(--border);
  }
  .ant-modal-close {
    top: 4px;
    right: 4px;
  }
`

const ContentContainer = styled.div`
  height: 80vh;
  display: flex;
  flex: 1;
  flex-direction: row;
`

const MenuContainer = styled.div`
  max-width: 300px;
  background-color: var(--color-background-mute);
  transition: all 0.3s ease-in-out;
  position: relative;
  padding: 0 8px;
  .ant-menu-light {
    background-color: var(--color-background-mute);
  }
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  .iconfont {
    font-size: 20px;
  }
`

const Settings = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 100%; */
  flex: 1;
  overflow-y: auto;
`

const SettingHeader = styled.div`
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border-bottom: var(--border-soft);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const SettingContent = styled(Scrollbar)`
  padding: 16px;
`

export default class AssistantSettingsPopup {
  static show(props: AssistantSettingPopupShowParams) {
    return new Promise<Assistant>((resolve) => {
      TopView.show(
        <AssistantSettingPopupContainer
          {...props}
          resolve={(v) => {
            resolve(v)
            TopView.hide('AssistantSettingsPopup')
          }}
        />,
        'AssistantSettingsPopup'
      )
    })
  }
}
