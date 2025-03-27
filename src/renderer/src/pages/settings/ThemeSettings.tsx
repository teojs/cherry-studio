import { DownloadOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useCustomTheme } from '@renderer/hooks/useCustomTheme'
import { useSettings } from '@renderer/hooks/useSettings'
import { useAppDispatch } from '@renderer/store'
import { setCustomCss } from '@renderer/store/settings'
import { type CustomThemeConfig, CustomThemeConfigSchema } from '@renderer/store/theme'
import { Button, Checkbox, Col, ColorPicker, Flex, Image, Input, InputNumber, message, Row, Slider, Upload } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SettingContainer, SettingDivider, SettingGroup, SettingRow, SettingRowTitle, SettingTitle } from './index'

const ThemeSettings: FC = () => {
  const { theme: themeMode } = useTheme()
  const { customCss } = useSettings()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { customTheme, updateCustomTheme, resetCustomTheme } = useCustomTheme()

  const currentTheme = themeMode === 'dark' ? 'dark' : 'light'
  const currentStyle = customTheme[currentTheme]

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
      updateCustomTheme({
        ...customTheme,
        [currentTheme]: {
          ...currentStyle,
          backgroundImage: `file://${uploadedFile.path}`
        }
      })
    }
  }

  const handleBackgroundImageUrlChange = (url: string) => {
    updateCustomTheme({
      ...customTheme,
      [currentTheme]: {
        ...currentStyle,
        backgroundImage: url
      }
    })
  }

  const handleStyleChange = (field: string, value: string | number | boolean | boolean[] | number[]) => {
    updateCustomTheme({
      ...customTheme,
      [currentTheme]: {
        ...currentStyle,
        [field]: value
      }
    })
  }

  const handleExportTheme = () => {
    const themeConfig: CustomThemeConfig = {
      version: '1.0.0',
      name: '自定义主题',
      description: '从Cherry Studio导出的主题配置',
      light: customTheme.light || {},
      dark: customTheme.dark || {}
    }

    // TODO: 使用window.api.file.download
    const blob = new Blob([JSON.stringify(themeConfig, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cherry-theme.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportTheme = async (file: File) => {
    try {
      const text = await file.text()
      const themeConfig = JSON.parse(text)
      const validatedConfig = CustomThemeConfigSchema.parse(themeConfig)

      updateCustomTheme({
        light: validatedConfig.light,
        dark: validatedConfig.dark
      })

      message.success('主题导入成功')
    } catch (error) {
      if (error instanceof Error) {
        message.error(`主题导入失败: ${error.message}`)
      } else {
        message.error('主题导入失败: 无效的主题配置文件')
      }
    }
  }

  const handleResetTheme = () => {
    window.modal.confirm({
      title: '确认重置主题',
      content: '确定要将主题重置为默认值吗？此操作不可恢复。',
      onOk: () => {
        resetCustomTheme()
      }
    })
  }

  return (
    <SettingContainer theme={themeMode}>
      <SettingGroupCard theme={themeMode}>
        <SettingTitle>
          主题颜色
          <Flex gap={8}>
            <Button color="danger" variant="solid" icon={<ReloadOutlined />} onClick={handleResetTheme}>
              重置主题
            </Button>
            <Upload accept=".json" showUploadList={false} customRequest={({ file }) => handleImportTheme(file as File)}>
              <Button color="primary" variant="outlined" icon={<UploadOutlined />}>
                导入主题
              </Button>
            </Upload>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportTheme}>
              导出主题
            </Button>
          </Flex>
        </SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>主题颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.primaryColor}
            onChange={(color) => handleStyleChange('primaryColor', color.toHexString())}
            allowClear
          />
        </SettingRow>

        <SettingRow>
          <SettingRowTitle>激活背景颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.activeBackgroundColor}
            onChange={(color) => handleStyleChange('activeBackgroundColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>激活边框颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.activeBorderColor}
            onChange={(color) => handleStyleChange('activeBorderColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
      </SettingGroupCard>

      <SettingGroupCard theme={themeMode}>
        <SettingTitle>布局设置</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>内容区圆角</SettingRowTitle>
          <Row style={{ width: '138px' }} gutter={[8, 8]}>
            <Col span={12}>
              <InputNumber
                min={0}
                max={50}
                value={currentStyle.containerRadius?.[0]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.containerRadius || [0, 0, 0, 0])]
                  newRadius[0] = value || 0
                  handleStyleChange('containerRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={50}
                value={currentStyle.containerRadius?.[1]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.containerRadius || [0, 0, 0, 0])]
                  newRadius[1] = value || 0
                  handleStyleChange('containerRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={50}
                value={currentStyle.containerRadius?.[3]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.containerRadius || [0, 0, 0, 0])]
                  newRadius[3] = value || 0
                  handleStyleChange('containerRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={50}
                value={currentStyle.containerRadius?.[2]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.containerRadius || [0, 0, 0, 0])]
                  newRadius[2] = value || 0
                  handleStyleChange('containerRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
          </Row>
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>内容区边框</SettingRowTitle>
          <BorderCheckbox>
            <Checkbox
              className="top"
              checked={currentStyle.containerBorders?.[0]}
              onChange={(e) => {
                const newBorders = [...(currentStyle.containerBorders || [false, false, false, false])]
                newBorders[0] = e.target.checked
                handleStyleChange('containerBorders', newBorders)
              }}
            />
            <Checkbox
              className="right"
              checked={currentStyle.containerBorders?.[1]}
              onChange={(e) => {
                const newBorders = [...(currentStyle.containerBorders || [false, false, false, false])]
                newBorders[1] = e.target.checked
                handleStyleChange('containerBorders', newBorders)
              }}
            />
            <Checkbox
              className="bottom"
              checked={currentStyle.containerBorders?.[2]}
              onChange={(e) => {
                const newBorders = [...(currentStyle.containerBorders || [false, false, false, false])]
                newBorders[2] = e.target.checked
                handleStyleChange('containerBorders', newBorders)
              }}
            />
            <Checkbox
              className="left"
              checked={currentStyle.containerBorders?.[3]}
              onChange={(e) => {
                const newBorders = [...(currentStyle.containerBorders || [false, false, false, false])]
                newBorders[3] = e.target.checked
                handleStyleChange('containerBorders', newBorders)
              }}
            />
          </BorderCheckbox>
        </SettingRow>
      </SettingGroupCard>

      <SettingGroupCard theme={themeMode}>
        <SettingTitle>背景设置</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>背景链接</SettingRowTitle>
          <Input
            style={{ maxWidth: '300px' }}
            value={currentStyle.backgroundImage}
            onChange={(e) => handleBackgroundImageUrlChange(e.target.value)}
            placeholder="支持填入网络图片链接"
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>背景图片</SettingRowTitle>
          <Upload
            maxCount={1}
            name="background"
            listType="picture-card"
            showUploadList={false}
            customRequest={({ file }) => handleBackgroundImageChange(file as File)}
            accept="image/*">
            {currentStyle.backgroundImage ? (
              <Image preview={false} src={currentStyle.backgroundImage} />
            ) : (
              <PlusOutlined />
            )}
          </Upload>
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>背景颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.backgroundColor}
            onChange={(color) => handleStyleChange('backgroundColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>模糊程度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={50}
            value={currentStyle.backgroundBlur}
            onChange={(value) => handleStyleChange('backgroundBlur', value)}
          />
        </SettingRow>
      </SettingGroupCard>

      <SettingGroupCard theme={themeMode}>
        <SettingTitle>模块设置</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>背景颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.blockBackgroundColor}
            onChange={(color) => handleStyleChange('blockBackgroundColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>边框颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.blockBorderColor}
            onChange={(color) => handleStyleChange('blockBorderColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>模糊程度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={50}
            value={currentStyle.blockBackgroundBlur}
            onChange={(value) => handleStyleChange('blockBackgroundBlur', value)}
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>鲜明度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={200}
            value={currentStyle.blockSaturation}
            onChange={(value) => handleStyleChange('blockSaturation', value)}
          />
        </SettingRow>
      </SettingGroupCard>

      <SettingGroupCard theme={themeMode}>
        <SettingTitle>导航条设置</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>背景颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.navbarBackgroundColor}
            onChange={(color) => handleStyleChange('navbarBackgroundColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>模糊程度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={50}
            value={currentStyle.navbarBlur}
            onChange={(value) => handleStyleChange('navbarBlur', value)}
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>鲜明度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={200}
            value={currentStyle.navbarSaturation}
            onChange={(value) => handleStyleChange('navbarSaturation', value)}
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>边框宽度</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.navbarBorderColor}
            onChange={(color) => handleStyleChange('navbarBorderColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>导航条圆角</SettingRowTitle>
          <Row style={{ width: '138px' }} gutter={[8, 8]}>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.navbarRadius?.[0]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.navbarRadius || [0, 0, 0, 0])]
                  newRadius[0] = value || 0
                  handleStyleChange('navbarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.navbarRadius?.[1]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.navbarRadius || [0, 0, 0, 0])]
                  newRadius[1] = value || 0
                  handleStyleChange('navbarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.navbarRadius?.[3]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.navbarRadius || [0, 0, 0, 0])]
                  newRadius[3] = value || 0
                  handleStyleChange('navbarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.navbarRadius?.[2]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.navbarRadius || [0, 0, 0, 0])]
                  newRadius[2] = value || 0
                  handleStyleChange('navbarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
          </Row>
        </SettingRow>
      </SettingGroupCard>

      <SettingGroupCard theme={themeMode}>
        <SettingTitle>侧边栏设置</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>背景颜色</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.sidebarBackgroundColor}
            onChange={(color) => handleStyleChange('sidebarBackgroundColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>模糊程度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={50}
            value={currentStyle.sidebarBlur}
            onChange={(value) => handleStyleChange('sidebarBlur', value)}
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>鲜明度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={200}
            value={currentStyle.sidebarSaturation}
            onChange={(value) => handleStyleChange('sidebarSaturation', value)}
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>宽度</SettingRowTitle>
          <CustomSlider
            min={0}
            max={300}
            value={currentStyle.sidebarWidth}
            onChange={(value) => handleStyleChange('sidebarWidth', value)}
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>边框</SettingRowTitle>
          <ColorPicker
            size="small"
            value={currentStyle.sidebarBorderColor}
            onChange={(color) => handleStyleChange('sidebarBorderColor', color.toHexString())}
            allowClear
          />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>侧边栏圆角</SettingRowTitle>
          <Row style={{ width: '138px' }} gutter={[8, 8]}>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.sidebarRadius?.[0]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.sidebarRadius || [0, 0, 0, 0])]
                  newRadius[0] = value || 0
                  handleStyleChange('sidebarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.sidebarRadius?.[1]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.sidebarRadius || [0, 0, 0, 0])]
                  newRadius[1] = value || 0
                  handleStyleChange('sidebarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.sidebarRadius?.[3]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.sidebarRadius || [0, 0, 0, 0])]
                  newRadius[3] = value || 0
                  handleStyleChange('sidebarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={20}
                value={currentStyle.sidebarRadius?.[2]}
                onChange={(value) => {
                  const newRadius = [...(currentStyle.sidebarRadius || [0, 0, 0, 0])]
                  newRadius[2] = value || 0
                  handleStyleChange('sidebarRadius', newRadius)
                }}
                style={{ width: '60px' }}
              />
            </Col>
          </Row>
        </SettingRow>
      </SettingGroupCard>

      <SettingGroupCard theme={themeMode}>
        <SettingTitle>
          {t('settings.display.custom.css')}
          <TitleExtra onClick={() => window.api.openWebsite('https://cherrycss.com/')}>
            {t('settings.display.custom.css.cherrycss')}
          </TitleExtra>
        </SettingTitle>
        <SettingDivider />
        <Input.TextArea
          value={customCss}
          onChange={(e) => dispatch(setCustomCss(e.target.value))}
          placeholder={t('settings.display.custom.css.placeholder')}
          style={{
            minHeight: 200,
            fontFamily: 'monospace'
          }}
        />
      </SettingGroupCard>
    </SettingContainer>
  )
}

export default ThemeSettings

const SettingGroupCard = styled(SettingGroup).attrs({ className: 'module-card' })`
  ${SettingRow} + ${SettingRow} {
    margin-top: 16px;
  }
`

const CustomSlider = styled(Slider)`
  width: 100%;
  max-width: 300px;
`

const BorderCheckbox = styled.div`
  width: 60px;
  height: 60px;
  border: 0.5px solid var(--color-border);
  position: relative;
  border-radius: 4px;
  .left {
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
  }
  .right {
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
  }
  .top {
    position: absolute;
    left: 50%;
    top: -10px;
    transform: translateX(-50%);
  }
  .bottom {
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
  }
`

const TitleExtra = styled.div`
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  opacity: 0.7;
`
