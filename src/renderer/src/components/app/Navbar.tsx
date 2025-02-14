import { isMac } from '@renderer/config/constant'
import { useSettings } from '@renderer/hooks/useSettings'
import { FC, PropsWithChildren } from 'react'
import styled from 'styled-components'

type Props = PropsWithChildren & JSX.IntrinsicElements['div']

export const Navbar: FC<Props> = ({ children, ...props }) => {
  const { windowStyle } = useSettings()

  const macTransparentWindow = isMac && windowStyle === 'transparent'
  const backgroundColor = macTransparentWindow ? 'transparent' : 'var(--navbar-background)'

  return (
    <NavbarContainer {...props} style={{ backgroundColor }}>
      {children}
    </NavbarContainer>
  )
}

export const NavbarLeft: FC<Props> = ({ children, ...props }) => {
  return <NavbarLeftContainer {...props}>{children}</NavbarLeftContainer>
}

export const NavbarCenter: FC<Props> = ({ children, ...props }) => {
  return <NavbarCenterContainer {...props}>{children}</NavbarCenterContainer>
}

export const NavbarRight: FC<Props> = ({ children, ...props }) => {
  return <NavbarRightContainer {...props}>{children}</NavbarRightContainer>
}

const NavbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: var(--navbar-height);
  max-height: var(--navbar-height);
  padding-right: ${isMac ? 0 : 'var(--sidebar-width)'};
  -webkit-app-region: drag;
  border-bottom: var(--border-soft);
`

const NavbarLeftContainer = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  color: var(--color-text-secondary);
`

const NavbarCenterContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 ${isMac ? '16px' : 0};
  font-weight: bold;
  color: var(--color-text-secondary);
`

const NavbarRightContainer = styled.div`
  min-width: var(--topic-list-width);
  display: flex;
  align-items: center;
  padding: 0 12px;
`
