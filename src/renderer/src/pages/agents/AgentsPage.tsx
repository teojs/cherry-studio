import { SearchOutlined } from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import ListItem from '@renderer/components/ListItem'
import Scrollbar from '@renderer/components/Scrollbar'
import { createAssistantFromAgent } from '@renderer/services/AssistantService'
import { Agent } from '@renderer/types'
import { uuid } from '@renderer/utils'
import { Col, Empty, Input, Row } from 'antd'
import { groupBy, omit } from 'lodash'
import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

import { getAgentsFromSystemAgents, useSystemAgents } from '.'
import { groupTranslations } from './agentGroupTranslations'
import AgentCard from './components/AgentCard'
import MyAgents from './components/MyAgents'

const AgentsPage: FC = () => {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeGroup, setActiveGroup] = useState('我的')
  const systemAgents = useSystemAgents()

  const agentGroups = useMemo(() => {
    const groupList = groupBy(getAgentsFromSystemAgents(systemAgents), 'group')
    return { 我的: [], 精选: [], ...groupList } as Record<string, Agent[]>
  }, [systemAgents])
  console.log(agentGroups)

  const { t, i18n } = useTranslation()

  const onAddAgentConfirm = useCallback(
    (agent: Agent) => {
      window.modal.confirm({
        title: agent.name,
        content: (
          <AgentPrompt>
            <ReactMarkdown className="markdown">{agent.description || agent.prompt}</ReactMarkdown>
          </AgentPrompt>
        ),
        width: 600,
        icon: null,
        closable: true,
        maskClosable: true,
        centered: true,
        okButtonProps: { type: 'primary' },
        okText: t('agents.add.button'),
        onOk: () => createAssistantFromAgent(agent)
      })
    },
    [t]
  )

  const getAgentFromSystemAgent = useCallback((agent: (typeof systemAgents)[number]) => {
    return {
      ...omit(agent, 'group'),
      name: agent.name,
      id: uuid(),
      topics: [],
      type: 'agent'
    }
  }, [])

  const getLocalizedGroupName = useCallback(
    (group: string) => {
      const currentLang = i18n.language
      return groupTranslations[group]?.[currentLang] || group
    },
    [i18n.language]
  )

  const renderAgentList = useCallback(
    (group: string) => {
      if (!search.trim() && group === '我的') {
        return <MyAgents onClick={onAddAgentConfirm} search={search} />
      }

      let agents: Agent[] = []

      if (search.trim()) {
        const uniqueAgents = new Map<string, Agent>()

        Object.entries(agentGroups).forEach(([, agents]) => {
          agents.forEach((agent) => {
            if (
              (agent.name.toLowerCase().includes(search.toLowerCase()) ||
                agent.description?.toLowerCase().includes(search.toLowerCase())) &&
              !uniqueAgents.has(agent.name)
            ) {
              uniqueAgents.set(agent.name, agent)
            }
          })
        })
        agents = Array.from(uniqueAgents.values())
      } else {
        agents = agentGroups[group] || []
      }

      return agents.length > 0 ? (
        <Row gutter={[20, 20]}>
          {agents.map((agent, index) => (
            <Col span={6} key={agent.id || index}>
              <AgentCard
                onClick={() => onAddAgentConfirm(getAgentFromSystemAgent(agent as any))}
                agent={agent as any}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <EmptyView>
          <Empty description={t('agents.search.no_results')} />
        </EmptyView>
      )
    },
    [agentGroups, getAgentFromSystemAgent, onAddAgentConfirm, search, t]
  )

  const handleSearch = () => {
    if (searchInput.trim() === '') {
      setSearch('')
      setActiveGroup('我的')
    } else {
      setActiveGroup('')
      setSearch(searchInput)
    }
  }

  const handleSearchClear = () => {
    setSearch('')
    setActiveGroup('我的')
  }

  const handleGroupClick = (group: string) => () => {
    setSearch('')
    setSearchInput('')
    setActiveGroup(group)
  }

  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none', justifyContent: 'space-between' }}>
          {t('agents.title')}
          <Input
            placeholder={t('common.search')}
            className="nodrag"
            style={{ width: '30%', height: 28 }}
            size="small"
            variant="filled"
            allowClear
            onClear={handleSearchClear}
            suffix={<SearchOutlined onClick={handleSearch} />}
            value={searchInput}
            maxLength={50}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
          />
          <div style={{ width: 80 }} />
        </NavbarCenter>
      </Navbar>

      <Main id="content-container">
        <AgentsGroupList>
          {Object.entries(agentGroups).map(([group]) => (
            <ListItem
              active={activeGroup === group && !search.trim()}
              key={group}
              title={getLocalizedGroupName(group)}
              style={{ margin: '0 8px' }}
              onClick={handleGroupClick(group)}>
              <div
                style={{
                  textAlign: i18n.language.startsWith('zh') ? 'center' : 'left'
                }}>
                {getLocalizedGroupName(group)}
              </div>
            </ListItem>
          ))}
        </AgentsGroupList>
        <AgentsList>{renderAgentList(activeGroup)}</AgentsList>
      </Main>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`

const AgentsGroupList = styled(Scrollbar).attrs({ className: 'module-card' })`
  height: calc(100vh - var(--navbar-height));
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  border-right: 0.5px solid var(--color-border);
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
`

const Main = styled.div`
  flex: 1;
  display: flex;
`

const AgentsList = styled(Scrollbar)`
  height: calc(100vh - var(--navbar-height));
  flex: 1;
  padding: 16px;
`

const AgentPrompt = styled.div`
  max-height: 60vh;
  overflow-y: scroll;
  max-width: 560px;
`

const EmptyView = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--color-text-secondary);
`

export default AgentsPage
