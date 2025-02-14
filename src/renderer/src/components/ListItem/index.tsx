import { ReactNode } from 'react'
import styled from 'styled-components'

interface ListItemProps {
  active?: boolean
  icon?: ReactNode
  title?: string
  subtitle?: string
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  onContextMenu?: (e: React.MouseEvent) => void
}

const ListItem = ({
  active,
  icon,
  title,
  subtitle,
  children,
  className = '',
  style,
  onClick,
  onContextMenu
}: ListItemProps) => {
  return (
    <ListItemContainer
      className={`${active ? 'active' : ''} ${className}`}
      style={style}
      onClick={onClick}
      onContextMenu={onContextMenu}>
      {!children ? (
        <ListItemContent>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <TextContainer>
            <TitleText>{title}</TitleText>
            {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
          </TextContainer>
        </ListItemContent>
      ) : (
        children
      )}
    </ListItemContainer>
  )
}

const ListItemContainer = styled.div`
  padding: 8px;
  border-radius: var(--border-radius);
  font-size: 13px;
  position: relative;
  font-family: Ubuntu;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-primary-mute);
  }

  &.active {
    background-color: var(--color-primary-soft);
  }
`

const ListItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  font-size: 13px;
`

const IconWrapper = styled.span``

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const TitleText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SubtitleText = styled.div`
  font-size: 10px;
  color: var(--color-text-soft);
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--color-text-3);
`

export default ListItem
