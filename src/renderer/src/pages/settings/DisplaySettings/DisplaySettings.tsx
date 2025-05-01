import { PlusOutlined, SyncOutlined } from '@ant-design/icons'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useSettings } from '@renderer/hooks/useSettings'
import useUserTheme from '@renderer/hooks/useUserTheme'
import { useAppDispatch } from '@renderer/store'
import {
  AssistantIconType,
  DEFAULT_SIDEBAR_ICONS,
  setAssistantIconType,
  setClickAssistantToShowTopic,
  setCustomCss,
  setShowTopicTime,
  setSidebarIcons
} from '@renderer/store/settings'
import { ThemeMode } from '@renderer/types'
import { Button, ColorPicker, Image, Input, Segmented, Slider, Switch, Tooltip, Upload } from 'antd'
import { Info } from 'lucide-react'
import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SettingContainer, SettingDivider, SettingGroup, SettingRow, SettingRowTitle, SettingTitle } from '..'
import SidebarIconsManager from './SidebarIconsManager'

const DisplaySettings: FC = () => {
  const {
    setTheme,
    theme,
    windowStyle,
    setWindowStyle,
    topicPosition,
    setTopicPosition,
    clickAssistantToShowTopic,
    showTopicTime,
    customCss,
    sidebarIcons,
    assistantIconType,
    userTheme
  } = useSettings()
  const { theme: themeMode } = useTheme()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { setUserTheme } = useUserTheme()

  const [visibleIcons, setVisibleIcons] = useState(sidebarIcons?.visible || DEFAULT_SIDEBAR_ICONS)
  const [disabledIcons, setDisabledIcons] = useState(sidebarIcons?.disabled || [])

  const handleWindowStyleChange = useCallback(
    (checked: boolean) => {
      setWindowStyle(checked ? 'transparent' : 'opaque')
    },
    [setWindowStyle]
  )

  const handleColorPrimaryChange = useCallback(
    (colorHex: string) => {
      setUserTheme({
        ...userTheme,
        colorPrimary: colorHex
      })
    },
    [setUserTheme, userTheme]
  )
  const handleBackgroundImageChange = async (file: File) => {
    const fileType = {
      id: file.name,
      name: file.name,
      path: file.path,
      size: file.size,
      ext: `.${file.name.split('.').pop()}`.toLowerCase(),
      count: 1,
      origin_name: file.name,
      type: file.type as any,
      created_at: new Date().toISOString()
    }

    const uploadedFile = await window.api.file.upload(fileType)
    if (uploadedFile) {
      setUserTheme({
        ...userTheme,
        backgroundImage: `file://${encodeURIComponent(uploadedFile.path)}`
      })
    }
  }

  const handleReset = useCallback(() => {
    setVisibleIcons([...DEFAULT_SIDEBAR_ICONS])
    setDisabledIcons([])
    dispatch(setSidebarIcons({ visible: DEFAULT_SIDEBAR_ICONS, disabled: [] }))
  }, [dispatch])

  const themeOptions = useMemo(
    () => [
      {
        value: ThemeMode.light,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="iconfont icon-theme icon-theme-light" />
            <span>{t('settings.theme.light')}</span>
          </div>
        )
      },
      {
        value: ThemeMode.dark,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="iconfont icon-theme icon-dark1" />
            <span>{t('settings.theme.dark')}</span>
          </div>
        )
      },
      {
        value: ThemeMode.auto,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <SyncOutlined />
            <span>{t('settings.theme.auto')}</span>
          </div>
        )
      }
    ],
    [t]
  )

  const assistantIconTypeOptions = useMemo(
    () => [
      { value: 'model', label: t('settings.assistant.icon.type.model') },
      { value: 'emoji', label: t('settings.assistant.icon.type.emoji') },
      { value: 'none', label: t('settings.assistant.icon.type.none') }
    ],
    [t]
  )

  return (
    <SettingContainer theme={themeMode}>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.display.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.theme.title')}</SettingRowTitle>
          <Segmented value={theme} shape="round" onChange={setTheme} options={themeOptions} />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.theme.color_primary')}</SettingRowTitle>
          <ColorPicker
            className="color-picker"
            value={userTheme.colorPrimary}
            onChange={(color) => handleColorPrimaryChange(color.toHexString())}
            showText
            presets={[
              {
                label: 'Presets',
                colors: ['#007BFF', '#F74F9E', '#FF5257', '#F7821B', '#FFC600', '#62BA46', '#000000']
              }
            ]}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>背景设置</SettingRowTitle>
          <Segmented
            value={userTheme.backgroundType}
            shape="round"
            onChange={(value) => setUserTheme({ ...userTheme, backgroundType: value as 'opacity' | 'image' | 'none' })}
            options={[
              { value: 'opacity', label: '透明' },
              { value: 'image', label: '背景图' },
              { value: 'none', label: '无' }
            ]}
          />
        </SettingRow>
        {userTheme.backgroundType === 'image' && (
          <>
            <SettingDivider />
            <SettingRow>
              <SettingRowTitle>上传背景图</SettingRowTitle>
              <Upload
                maxCount={1}
                name="background"
                listType="picture-card"
                showUploadList={false}
                customRequest={({ file }) => handleBackgroundImageChange(file as File)}
                accept="image/*">
                {userTheme.backgroundImage ? (
                  <Image preview={false} src={decodeURIComponent(userTheme.backgroundImage)} />
                ) : (
                  <PlusOutlined />
                )}
              </Upload>
            </SettingRow>
            <SettingDivider />
            <SettingRow>
              <SettingRowTitle>背景模糊</SettingRowTitle>
              <Slider
                style={{ width: '200px' }}
                min={0}
                max={100}
                value={userTheme.backgroundBlur}
                onChange={(value) => setUserTheme({ ...userTheme, backgroundBlur: value })}
              />
            </SettingRow>
            {theme === ThemeMode.dark && (
              <>
                <SettingDivider />
                <SettingRow>
                  <SettingRowTitle>
                    背景亮度
                    <Tooltip title="仅限深色主题" placement="right">
                      <Info size={16} color="var(--color-icon)" style={{ marginLeft: 5, cursor: 'pointer' }} />
                    </Tooltip>
                  </SettingRowTitle>
                  <Slider
                    style={{ width: '200px' }}
                    min={0}
                    max={100}
                    value={userTheme.backgroundBrightness}
                    onChange={(value) => setUserTheme({ ...userTheme, backgroundBrightness: value })}
                  />
                </SettingRow>
              </>
            )}
          </>
        )}
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.display.topic.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.topic.position')}</SettingRowTitle>
          <Segmented
            value={topicPosition || 'right'}
            shape="round"
            onChange={setTopicPosition}
            options={[
              { value: 'left', label: t('settings.topic.position.left') },
              { value: 'right', label: t('settings.topic.position.right') }
            ]}
          />
        </SettingRow>
        <SettingDivider />
        {topicPosition === 'left' && (
          <>
            <SettingRow>
              <SettingRowTitle>{t('settings.advanced.auto_switch_to_topics')}</SettingRowTitle>
              <Switch
                checked={clickAssistantToShowTopic}
                onChange={(checked) => dispatch(setClickAssistantToShowTopic(checked))}
              />
            </SettingRow>
            <SettingDivider />
          </>
        )}
        <SettingRow>
          <SettingRowTitle>{t('settings.topic.show.time')}</SettingRowTitle>
          <Switch checked={showTopicTime} onChange={(checked) => dispatch(setShowTopicTime(checked))} />
        </SettingRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.display.assistant.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.assistant.icon.type')}</SettingRowTitle>
          <Segmented
            value={assistantIconType}
            shape="round"
            onChange={(value) => dispatch(setAssistantIconType(value as AssistantIconType))}
            options={assistantIconTypeOptions}
          />
        </SettingRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{t('settings.display.sidebar.title')}</span>
          <ResetButtonWrapper>
            <Button onClick={handleReset}>{t('common.reset')}</Button>
          </ResetButtonWrapper>
        </SettingTitle>
        <SettingDivider />
        <SidebarIconsManager
          visibleIcons={visibleIcons}
          disabledIcons={disabledIcons}
          setVisibleIcons={setVisibleIcons}
          setDisabledIcons={setDisabledIcons}
        />
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>
          {t('settings.display.custom.css')}
          <TitleExtra onClick={() => window.api.openWebsite('https://cherrycss.com/')}>
            {t('settings.display.custom.css.cherrycss')}
          </TitleExtra>
        </SettingTitle>
        <SettingDivider />
        <Input.TextArea
          value={customCss}
          onChange={(e) => {
            dispatch(setCustomCss(e.target.value))
            window.api.setCustomCss(e.target.value)
          }}
          placeholder={t('settings.display.custom.css.placeholder')}
          style={{
            minHeight: 200,
            fontFamily: 'monospace'
          }}
        />
      </SettingGroup>
    </SettingContainer>
  )
}

const TitleExtra = styled.div`
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  opacity: 0.7;
`
const ResetButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default DisplaySettings
