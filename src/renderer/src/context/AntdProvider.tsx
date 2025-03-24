import { useSettings } from '@renderer/hooks/useSettings'
import { LanguageVarious } from '@renderer/types'
import { ConfigProvider, theme } from 'antd'
import elGR from 'antd/locale/el_GR'
import enUS from 'antd/locale/en_US'
import esES from 'antd/locale/es_ES'
import frFR from 'antd/locale/fr_FR'
import jaJP from 'antd/locale/ja_JP'
import ptPT from 'antd/locale/pt_PT'
import ruRU from 'antd/locale/ru_RU'
import zhCN from 'antd/locale/zh_CN'
import zhTW from 'antd/locale/zh_TW'
import { FC, PropsWithChildren } from 'react'

import { useTheme } from './ThemeProvider'

const AntdProvider: FC<PropsWithChildren> = ({ children }) => {
  const { language, customStyle } = useSettings()
  const { theme: _theme } = useTheme()

  return (
    <ConfigProvider
      locale={getAntdLocale(language)}
      theme={{
        cssVar: true,
        algorithm: [_theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm],
        components: {
          Menu: {
            activeBarBorderWidth: 0,
            darkItemBg: 'transparent'
          },
          Button: {
            boxShadow: 'none',
            boxShadowSecondary: 'none',
            defaultShadow: 'none',
            dangerShadow: 'none',
            primaryShadow: 'none',
            colorBgContainer: 'rgba(255,255,255,0)'
          },
          Input: {
            activeBg: 'rgba(255,255,255,0)',
            hoverBg: 'rgba(255,255,255,0)',
            colorBgBase: 'rgba(255,255,255,0)',
            colorBgContainer: 'rgba(255,255,255,0)'
          },
          Modal: {
            contentBg: 'var(--color-background)',
            paddingLG: 16,
            footerBg: 'none',
            headerBg: 'none'
          },
          Switch: {
            trackMinWidth: 36,
            trackMinWidthSM: 25
          },
          Checkbox: {
            colorBgContainer: 'rgba(255,255,255,0)'
          },
          Card: {
            colorBgContainer: 'var(--color-background)',
            colorBorderSecondary: 'var(--color-background)'
          },
          Tabs: {
            colorBgContainer: 'rgba(255,255,255,0)'
          },
          Radio: {
            colorBgContainer: 'rgba(255,255,255,0)'
          },
          Select: {
            colorBgContainer: 'rgba(255,255,255,0)',
            colorBgElevated: 'rgba(255,255,255,0)'
          },
          DatePicker: {
            colorBgContainer: 'rgba(255,255,255,0)'
          },
          InputNumber: {
            colorBgContainer: 'rgba(255,255,255,0)'
          },
          Slider: {
            railSize: 10,
            borderRadiusXS: 4,
            dotSize: 12
          },
          Table: {
            colorBgContainer: 'var(--color-background)',
            headerBg: 'var(--color-background)',
            colorBorder: 'var(--color-background)',
            colorBorderSecondary: 'var(--color-background)',
            headerSortHoverBg: 'var(--color-background)',
            headerSortActiveBg: 'var(--color-background)'
          },
          Segmented: {
            colorBgContainer: 'var(--color-background)'
            // colorBgElevated: 'var(--color-background)',
            // colorBgSpotlight: 'var(--color-background)',
            // colorBgTextHover: 'var(--color-background)',
          }
        },
        token: {
          colorPrimary: customStyle?.[_theme]?.primaryColor || '#00b96b',
          sizeUnit: 4
        }
      }}>
      {children}
    </ConfigProvider>
  )
}

function getAntdLocale(language: LanguageVarious) {
  switch (language) {
    case 'zh-CN':
      return zhCN
    case 'zh-TW':
      return zhTW
    case 'en-US':
      return enUS
    case 'ru-RU':
      return ruRU
    case 'ja-JP':
      return jaJP
    case 'el-GR':
      return elGR
    case 'es-ES':
      return esES
    case 'fr-FR':
      return frFR
    case 'pt-PT':
      return ptPT
    default:
      return zhCN
  }
}

export default AntdProvider
