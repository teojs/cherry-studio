import { useAssistant } from '@renderer/hooks/useAssistant'
import { useSettings } from '@renderer/hooks/useSettings'
import { Assistant, Topic } from '@renderer/types'
import { Drawer, Flex } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'

import Inputbar from './Inputbar/Inputbar'
import Messages from './Messages/Messages'
import Settings from './Tabs/SettingsTab'

interface Props {
  assistant: Assistant
  activeTopic: Topic
  setActiveTopic: (topic: Topic) => void
  setActiveAssistant: (assistant: Assistant) => void
}

const Chat: FC<Props> = (props) => {
  const { assistant } = useAssistant(props.assistant.id)
  const { messageStyle, showChatSettings, setShowChatSettings } = useSettings()

  const drawerStyles = {
    body: { padding: '0 8px' },
    mask: { background: 'none' },
    content: { background: 'var(--list-background)' },
    header: { background: 'none' }
  }

  return (
    <Container id="chat" className={messageStyle}>
      <Main id="chat-main" vertical flex={1} justify="space-between">
        <Messages
          key={props.activeTopic.id}
          assistant={assistant}
          topic={props.activeTopic}
          setActiveTopic={props.setActiveTopic}
        />
        <Inputbar assistant={assistant} setActiveTopic={props.setActiveTopic} />
      </Main>
      <Drawer
        width="auto"
        styles={drawerStyles}
        placement="right"
        closable={false}
        onClose={() => setShowChatSettings(false)}
        open={showChatSettings}
        getContainer={false}>
        <Settings assistant={props.assistant} />
      </Drawer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  flex: 1;
  justify-content: space-between;
  height: calc(100vh - var(--navbar-height));
  background-color: var(--chat-background);
  position: relative;
`

const Main = styled(Flex)`
  min-width: 0;
`

export default Chat
