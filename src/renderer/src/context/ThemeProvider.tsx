import { isMac } from '@renderer/config/constant'
import { useCustomTheme } from '@renderer/hooks/useCustomTheme'
import { useSettings } from '@renderer/hooks/useSettings'
import { ThemeMode } from '@renderer/types'
import React, { createContext, PropsWithChildren, use, useEffect, useState } from 'react'

interface ThemeContextType {
  theme: ThemeMode
  settingTheme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeMode.light,
  settingTheme: ThemeMode.light,
  toggleTheme: () => {}
})

interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme?: ThemeMode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
  const { theme, setTheme } = useSettings()
  const [_theme, _setTheme] = useState(theme)
  const { setCustomThemeVar } = useCustomTheme()

  const toggleTheme = () => {
    setTheme(theme === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark)
  }

  useEffect((): any => {
    if (theme === ThemeMode.auto || defaultTheme === ThemeMode.auto) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      _setTheme(mediaQuery.matches ? ThemeMode.dark : ThemeMode.light)
      const handleChange = (e: MediaQueryListEvent) => _setTheme(e.matches ? ThemeMode.dark : ThemeMode.light)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      _setTheme(theme)
    }
  }, [defaultTheme, theme])

  useEffect(() => {
    document.body.setAttribute('theme-mode', _theme)
    // 移除迷你窗口的条件判断，让所有窗口都能设置主题
    window.api?.setTheme(_theme === ThemeMode.dark ? 'dark' : 'light')

    // 设置主题变量
    setCustomThemeVar(_theme)
  }, [_theme, setCustomThemeVar])

  useEffect(() => {
    document.body.setAttribute('os', isMac ? 'mac' : 'windows')

    // listen theme change from main process from other windows
    const themeChangeListenerRemover = window.electron.ipcRenderer.on('theme:change', (_, newTheme) => {
      setTheme(newTheme)
    })
    return () => {
      themeChangeListenerRemover()
    }
  })

  return (
    <ThemeContext.Provider value={{ theme: _theme, settingTheme: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => use(ThemeContext)
