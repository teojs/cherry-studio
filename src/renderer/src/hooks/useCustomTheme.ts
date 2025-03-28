import { useAppDispatch, useAppSelector } from '@renderer/store'
import { CustomThemeConfig, resetCustomTheme, updateCustomTheme } from '@renderer/store/theme'
import { ThemeMode } from '@renderer/types'

export const useCustomTheme = () => {
  const { customTheme } = useAppSelector((state) => state.theme)
  const dispatch = useAppDispatch()

  const setCustomThemeVar = (theme: ThemeMode) => {
    if (!customTheme) return

    const currentTheme = theme === ThemeMode.dark ? 'dark' : 'light'
    const style = customTheme[currentTheme]

    // 更新主色调
    document.body.style.setProperty('--color-primary', style.primaryColor || '')
    // 更新激活色
    document.body.style.setProperty('--color-active-background', style.activeBackgroundColor || '')
    document.body.style.setProperty('--color-active-border', style.activeBorderColor || '')

    // 更新背景图片
    if (style.backgroundImage) {
      document.body.style.setProperty('--custom-background-image', `url("${style.backgroundImage}")`)
    } else {
      document.body.style.setProperty('--custom-background-image', 'none')
    }

    // 更新背景颜色
    document.body.style.setProperty('--custom-background-color', style.backgroundColor || '')

    // 更新背景模糊
    document.body.style.setProperty('--custom-background-blur', `${style.backgroundBlur}px`)

    // 更新模块背景色
    document.body.style.setProperty('--color-background', style.blockBackgroundColor || '')
    document.body.style.setProperty('--custom-block-background-color', style.blockBackgroundColor || '')

    // 更新模块模糊
    document.body.style.setProperty('--custom-block-background-blur', `${style.blockBackgroundBlur}px`)

    // 更新模块鲜明度
    document.body.style.setProperty('--custom-block-saturation', `${style.blockSaturation}%`)

    // 更新导航条背景色
    document.body.style.setProperty('--custom-navbar-background-color', style.navbarBackgroundColor || '')
    // 更新导航条模糊
    document.body.style.setProperty('--custom-navbar-blur', `${style.navbarBlur}px`)
    // 更新导航条鲜明度
    document.body.style.setProperty('--custom-navbar-saturation', `${style.navbarSaturation}%`)
    // 更新导航条边框颜色
    document.body.style.setProperty('--custom-navbar-border-color', style.navbarBorderColor || '')
    // 更新导航条圆角
    if (style.navbarRadius?.length && style.navbarRadius.length > 0) {
      document.body.style.setProperty('--custom-navbar-radius', style.navbarRadius.map((r) => `${r}px`).join(' '))
    }
    // 更新导航条边框
    if (style.navbarBorders?.length && style.navbarBorders.length > 0) {
      document.body.style.setProperty(
        '--custom-navbar-border-width',
        style.navbarBorders.map((b) => (b ? '0.5px' : '0')).join(' ')
      )
    }

    // 更新侧边栏背景色
    document.body.style.setProperty('--custom-sidebar-background-color', style.sidebarBackgroundColor || '')
    // 更新侧边栏模糊
    document.body.style.setProperty('--custom-sidebar-blur', `${style.sidebarBlur}px`)
    // 更新侧边栏鲜明度
    document.body.style.setProperty('--custom-sidebar-saturation', `${style.sidebarSaturation}%`)
    // 更新侧边栏宽度
    document.body.style.setProperty('--sidebar-width', `${style.sidebarWidth}px`)
    // 更新侧边栏边框颜色
    document.body.style.setProperty('--custom-sidebar-border-color', style.sidebarBorderColor || '')
    // 更新侧边栏圆角
    if (style.sidebarRadius?.length && style.sidebarRadius.length > 0) {
      document.body.style.setProperty('--custom-sidebar-radius', style.sidebarRadius.map((r) => `${r}px`).join(' '))
    }
    // 更新侧边栏边框
    if (style.sidebarBorders?.length && style.sidebarBorders.length > 0) {
      document.body.style.setProperty(
        '--custom-sidebar-border-width',
        style.sidebarBorders.map((b) => (b ? '0.5px' : '0')).join(' ')
      )
    }

    // 更新边框颜色
    document.body.style.setProperty('--color-border', style.blockBorderColor || '')

    // 更新内容区圆角
    if (style.containerRadius?.length && style.containerRadius.length > 0) {
      document.body.style.setProperty('--custom-container-radius', style.containerRadius.map((r) => `${r}px`).join(' '))
    }
    // 更新内容区边框
    if (style.containerBorders?.length && style.containerBorders.length > 0) {
      document.body.style.setProperty(
        '--custom-container-border-width',
        style.containerBorders.map((b) => (b ? '0.5px' : '0')).join(' ')
      )
    }
    // 更新主容器背景色
    document.body.style.setProperty('--custom-container-background-color', style.containerBackgroundColor || '')
    // 更新主容器模糊
    document.body.style.setProperty('--custom-container-background-blur', `${style.containerBackgroundBlur}px`)
    // 更新主容器鲜明度
    document.body.style.setProperty('--custom-container-saturation', `${style.containerSaturation}%`)
  }

  return {
    customTheme: customTheme,
    setCustomThemeVar,
    updateCustomTheme(customTheme: Pick<CustomThemeConfig, 'light' | 'dark'>) {
      dispatch(updateCustomTheme(customTheme))
    },
    resetCustomTheme() {
      dispatch(resetCustomTheme())
    }
  }
}
