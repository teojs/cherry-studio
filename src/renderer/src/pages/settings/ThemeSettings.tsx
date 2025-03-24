import { PlusOutlined } from '@ant-design/icons'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useSettings } from '@renderer/hooks/useSettings'
import { useAppDispatch } from '@renderer/store'
import { setCustomStyle } from '@renderer/store/settings'
import { Checkbox, Col, ColorPicker, Image, Input, InputNumber, Row, Slider, Upload } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'

import { SettingContainer, SettingDivider, SettingGroup, SettingRow, SettingRowTitle, SettingTitle } from './index'

const ThemeSettings: FC = () => {
  const { theme: themeMode } = useTheme()
  const { customStyle } = useSettings()
  const dispatch = useAppDispatch()

  const currentTheme = themeMode === 'dark' ? 'dark' : 'light'
  const currentStyle = customStyle[currentTheme]

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
      dispatch(
        setCustomStyle({
          ...customStyle,
          [currentTheme]: {
            ...currentStyle,
            backgroundImage: `file://${uploadedFile.path}`
          }
        })
      )
    }
  }

  const handleBackgroundImageUrlChange = (url: string) => {
    dispatch(
      setCustomStyle({
        ...customStyle,
        [currentTheme]: {
          ...currentStyle,
          backgroundImage: url
        }
      })
    )
  }

  const handleStyleChange = (field: string, value: string | number | boolean | boolean[] | number[]) => {
    dispatch(
      setCustomStyle({
        ...customStyle,
        [currentTheme]: {
          ...currentStyle,
          [field]: value
        }
      })
    )
  }

  return (
    <SettingContainer theme={themeMode}>
      <SettingGroupCard theme={themeMode}>
        <SettingTitle>主题颜色</SettingTitle>
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
                value={currentStyle.containerRadius[0]}
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
                value={currentStyle.containerRadius[1]}
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
                value={currentStyle.containerRadius[3]}
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
                value={currentStyle.containerRadius[2]}
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
