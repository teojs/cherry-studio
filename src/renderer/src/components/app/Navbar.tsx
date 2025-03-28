import { isMac, isWindows } from '@renderer/config/constant'
import type { FC, PropsWithChildren } from 'react'
import type { HTMLAttributes } from 'react'
import styled from 'styled-components'

type Props = PropsWithChildren & HTMLAttributes<HTMLDivElement>

export const Navbar: FC<Props> = ({ children, ...props }) => {
  return <NavbarContainer {...props}>{children}</NavbarContainer>
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
  min-width: 100%;
  display: flex;
  flex-direction: row;
  min-height: var(--navbar-height);
  max-height: var(--navbar-height);
  /* margin-left: ${isMac ? 'calc(var(--sidebar-width) * -1)' : 0};
  padding-left: ${isMac ? 'var(--sidebar-width)' : 0}; */
  -webkit-app-region: drag;
  background-color: var(--custom-navbar-background-color);
  border: var(--custom-navbar-border);
  border-radius: var(--custom-navbar-radius);
  backdrop-filter: blur(var(--custom-navbar-blur)) saturate(var(--custom-navbar-saturation));
`

const NavbarLeftContainer = styled.div`
  min-width: var(--assistants-width);
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  color: var(--color-text-1);
`

const NavbarCenterContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 ${isMac ? '20px' : 0};
  font-weight: bold;
  color: var(--color-text-1);
`

const NavbarRightContainer = styled.div`
  min-width: var(--topic-list-width);
  display: flex;
  align-items: center;
  padding: 0 12px;
  padding-right: ${isWindows ? '140px' : 12};
  justify-content: flex-end;
`
