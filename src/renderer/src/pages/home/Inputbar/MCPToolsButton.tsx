import { CodeOutlined } from '@ant-design/icons'
import { useMCPServers } from '@renderer/hooks/useMCPServers'
import { MCPServer } from '@renderer/types'
import { Dropdown, Switch, Tooltip } from 'antd'
import { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
  enabledMCPs: MCPServer[]
  toggelEnableMCP: (server: MCPServer) => void
  ToolbarButton: any
}

const MCPToolsButton: FC<Props> = ({ enabledMCPs, toggelEnableMCP, ToolbarButton }) => {
  const { mcpServers, activedMcpServers } = useMCPServers()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<any>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Check if all active servers are enabled
  const activeServers = mcpServers.filter((s) => s.isActive)

  const anyEnable = activeServers.some((server) => enabledMCPs.some((enabledServer) => enabledServer.id === server.id))

  const enableAll = () => mcpServers.forEach(toggelEnableMCP)

  const disableAll = () =>
    mcpServers.forEach((s) => {
      enabledMCPs.forEach((enabledServer) => {
        if (enabledServer.id === s.id) {
          toggelEnableMCP(s)
        }
      })
    })

  const toggelAll = () => {
    if (anyEnable) {
      disableAll()
    } else {
      enableAll()
    }
  }

  const menu = (
    <div ref={menuRef} className="ant-dropdown-menu">
      <DropdownHeader className="dropdown-header">
        <div className="header-content">
          <h4>{t('settings.mcp.title')}</h4>
          <div className="enable-all-container">
            {/* <span className="enable-all-label">{t('mcp.enable_all')}</span> */}
            <Switch size="small" checked={anyEnable} onChange={toggelAll} />
          </div>
        </div>
      </DropdownHeader>
      <DropdownBody>
        {mcpServers.length > 0 ? (
          mcpServers
            .filter((s) => s.isActive)
            .map((server) => (
              <McpServerItems key={server.id} className="ant-dropdown-menu-item">
                <div className="server-info">
                  <div className="server-name">{server.name}</div>
                  {server.description && (
                    <Tooltip title={server.description} placement="bottom">
                      <div className="server-description">{truncateText(server.description)}</div>
                    </Tooltip>
                  )}
                  {server.baseUrl && <div className="server-url">{server.baseUrl}</div>}
                </div>
                <Switch
                  size="small"
                  checked={enabledMCPs.some((s) => s.id === server.id)}
                  onChange={() => toggelEnableMCP(server)}
                />
              </McpServerItems>
            ))
        ) : (
          <div className="ant-dropdown-menu-item-group">
            <div className="ant-dropdown-menu-item no-results">{t('settings.mcp.noServers')}</div>
          </div>
        )}
      </DropdownBody>
    </div>
  )

  if (activedMcpServers.length === 0) {
    return null
  }

  return (
    <Dropdown
      dropdownRender={() => menu}
      trigger={['click']}
      open={isOpen}
      onOpenChange={setIsOpen}
      overlayClassName="mention-models-dropdown">
      <Tooltip placement="top" title={t('settings.mcp.title')} arrow>
        <ToolbarButton type="text" ref={dropdownRef}>
          <CodeOutlined style={{ color: enabledMCPs.length > 0 ? 'var(--color-primary)' : 'var(--color-icon)' }} />
        </ToolbarButton>
      </Tooltip>
    </Dropdown>
  )
}

const McpServerItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;

  .server-info {
    flex: 1;
    overflow: hidden;

    .server-name {
      font-weight: 500;
      font-size: 14px;
      color: var(--color-text-1);
      max-width: 400px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .server-description {
      font-size: 12px;
      color: var(--color-text-3);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .server-url {
      font-size: 11px;
      color: var(--color-text-4);
      margin-top: 2px;
    }
  }
`

const DropdownHeader = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 4px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  h4 {
    margin: 0;
    color: var(--color-text-1);
    font-size: 14px;
    font-weight: 500;
  }

  .enable-all-container {
    display: flex;
    align-items: center;
    gap: 8px;

    .enable-all-label {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
`

const DropdownBody = styled.div`
  padding-bottom: 10px;
`

export default MCPToolsButton
