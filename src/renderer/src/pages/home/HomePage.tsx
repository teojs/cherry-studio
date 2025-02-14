import { CustomSplitter } from '@renderer/components/Layout'
import AddAssistantPopup from '@renderer/components/Popups/AddAssistantPopup'
import { useAssistants, useDefaultAssistant } from '@renderer/hooks/useAssistant'
import { useSettings } from '@renderer/hooks/useSettings'
import { useActiveTopic } from '@renderer/hooks/useTopic'
import NavigationService from '@renderer/services/NavigationService'
import { Assistant } from '@renderer/types'
import { uuid } from '@renderer/utils'
import { Splitter } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import Chat from './Chat'
import Navbar from './Navbar'
import Assistants from './Tabs/AssistantsTab'
import Topics from './Tabs/TopicsTab'

let _activeAssistant: Assistant

const HomePage: FC = () => {
  const { assistants } = useAssistants()
  const navigate = useNavigate()

  const location = useLocation()
  const state = location.state

  const [activeAssistant, setActiveAssistant] = useState(state?.assistant || _activeAssistant || assistants[0])
  const { activeTopic, setActiveTopic } = useActiveTopic(activeAssistant, state?.topic)
  const { showAssistants, assistantsSize, topicsSize, setAssistantsSize, setTopicsSize } = useSettings()

  const { defaultAssistant } = useDefaultAssistant()
  const { addAssistant } = useAssistants()

  const [isResizing, setIsResizing] = useState(true)
  const [splitterSizes, setSplitterSizes] = useState([assistantsSize, topicsSize, '100%'])

  _activeAssistant = activeAssistant

  const onCreateAssistant = async () => {
    const assistant = await AddAssistantPopup.show()
    assistant && setActiveAssistant(assistant)
  }

  const onCreateDefaultAssistant = () => {
    const assistant = { ...defaultAssistant, id: uuid() }
    addAssistant(assistant)
    setActiveAssistant(assistant)
  }

  const onSplitterResize = (sizes: number[]) => {
    setSplitterSizes(sizes)
  }

  const onSplitterResizeEnd = (sizes: number[]) => {
    setAssistantsSize(sizes[0])
    setTopicsSize(sizes[1])
  }

  useEffect(() => {
    NavigationService.setNavigate(navigate)
  }, [navigate])

  useEffect(() => {
    state?.assistant && setActiveAssistant(state?.assistant)
    state?.topic && setActiveTopic(state?.topic)
  }, [state])

  useEffect(() => {
    setIsResizing(false)
    if (showAssistants) {
      setSplitterSizes([assistantsSize, topicsSize, '100%'])
    } else {
      setSplitterSizes([0, 0, '100%'])
    }
    setTimeout(() => {
      setIsResizing(true)
    }, 200)
  }, [showAssistants])

  return (
    <CustomSplitter
      className="home-page"
      style={{ minWidth: '0' }}
      onResizeEnd={onSplitterResizeEnd}
      onResize={onSplitterResize}
      $isResizing={isResizing}>
      <Splitter.Panel size={splitterSizes[0]} resizable={showAssistants}>
        <Assistants
          activeAssistant={activeAssistant}
          setActiveAssistant={setActiveAssistant}
          onCreateAssistant={onCreateAssistant}
          onCreateDefaultAssistant={onCreateDefaultAssistant}
        />
      </Splitter.Panel>

      <Splitter.Panel size={splitterSizes[1]} resizable={showAssistants}>
        <Topics assistant={activeAssistant} activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
      </Splitter.Panel>

      <Splitter.Panel min="50%">
        <ChatContainer>
          <Navbar activeAssistant={activeAssistant} />
          <Chat
            assistant={activeAssistant}
            activeTopic={activeTopic}
            setActiveTopic={setActiveTopic}
            setActiveAssistant={setActiveAssistant}
          />
        </ChatContainer>
      </Splitter.Panel>
    </CustomSplitter>
  )
}

const ChatContainer = styled.div`
  flex: 1;
  min-width: 0;
`

export default HomePage
