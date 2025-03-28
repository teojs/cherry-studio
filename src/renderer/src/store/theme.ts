import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'

export const CustomThemeSchema = z.object({
  primaryColor: z.string().optional(),
  activeBackgroundColor: z.string().optional(),
  activeBorderColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundBlur: z.number().min(0).max(50).optional(),
  blockBackgroundColor: z.string().optional(),
  blockBorderColor: z.string().optional(),
  blockBackgroundBlur: z.number().min(0).max(50).optional(),
  blockSaturation: z.number().min(0).max(200).optional(),
  navbarBackgroundColor: z.string().optional(),
  navbarBlur: z.number().min(0).max(50).optional(),
  navbarSaturation: z.number().min(0).max(200).optional(),
  navbarBorderColor: z.string().optional(),
  navbarRadius: z.array(z.number().min(0).max(20)).length(4).optional(),
  navbarBorders: z.array(z.boolean()).length(4).optional(),
  sidebarBackgroundColor: z.string().optional(),
  sidebarBlur: z.number().min(0).max(50).optional(),
  sidebarSaturation: z.number().min(0).max(200).optional(),
  sidebarWidth: z.number().min(0).max(300).optional(),
  sidebarBorderColor: z.string().optional(),
  sidebarRadius: z.array(z.number().min(0).max(20)).length(4).optional(),
  sidebarBorders: z.array(z.boolean()).length(4).optional(),
  containerBackgroundColor: z.string().optional(),
  containerBackgroundBlur: z.number().min(0).max(50).optional(),
  containerSaturation: z.number().min(0).max(200).optional(),
  containerRadius: z.array(z.number().min(0).max(50)).length(4).optional(),
  containerBorders: z.array(z.boolean()).length(4).optional()
})

/**
 * export config schema
 */
export const CustomThemeConfigSchema = z.object({
  version: z.string(),
  name: z.string(),
  description: z.string().optional(),
  light: CustomThemeSchema,
  dark: CustomThemeSchema
})

export type CustomTheme = z.infer<typeof CustomThemeSchema>
export type CustomThemeConfig = z.infer<typeof CustomThemeConfigSchema>

export const DEFAULT_CUSTOM_THEME: {
  light: CustomTheme
  dark: CustomTheme
} = {
  light: {
    primaryColor: '#00b96b',
    backgroundImage: '',
    backgroundColor: '#F2F2F2',
    backgroundBlur: 0,
    blockBackgroundColor: '#ffffff',
    blockBackgroundBlur: 0,
    blockSaturation: 100,
    navbarBackgroundColor: '#ffffff00',
    navbarBlur: 0,
    navbarBorderColor: '',
    navbarRadius: [0, 0, 0, 0],
    navbarBorders: [false, false, false, false],
    navbarSaturation: 100,
    activeBackgroundColor: '#f2f2f2',
    activeBorderColor: '#00000015',
    sidebarBackgroundColor: '#ffffff00',
    sidebarBlur: 0,
    sidebarWidth: 50,
    sidebarBorderColor: '',
    sidebarRadius: [0, 0, 0, 0],
    sidebarBorders: [false, false, false, false],
    sidebarSaturation: 100,
    blockBorderColor: '#00000015',
    containerBackgroundColor: '#ffffff',
    containerBackgroundBlur: 0,
    containerSaturation: 100,
    containerRadius: [10, 0, 0, 0],
    containerBorders: [true, false, false, true]
  },
  dark: {
    primaryColor: '#00b96b',
    backgroundImage: '',
    backgroundColor: '#141414',
    backgroundBlur: 0,
    blockBackgroundColor: '#1f1f1f',
    blockBackgroundBlur: 0,
    blockSaturation: 100,
    navbarBackgroundColor: '#141414',
    navbarBlur: 0,
    navbarBorderColor: '',
    navbarRadius: [0, 0, 0, 0],
    navbarBorders: [false, false, false, false],
    navbarSaturation: 100,
    activeBackgroundColor: '#222222',
    activeBorderColor: '#ffffff15',
    sidebarBackgroundColor: '#141414',
    sidebarBlur: 0,
    sidebarWidth: 50,
    sidebarBorderColor: '',
    sidebarRadius: [0, 0, 0, 0],
    sidebarBorders: [false, false, false, false],
    sidebarSaturation: 100,
    blockBorderColor: '#ffffff15',
    containerBackgroundColor: '#1f1f1f',
    containerBackgroundBlur: 0,
    containerSaturation: 100,
    containerRadius: [10, 0, 0, 0],
    containerBorders: [true, false, false, true]
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    customTheme: DEFAULT_CUSTOM_THEME
  },
  reducers: {
    setCustomTheme: (state, action: PayloadAction<Pick<CustomThemeConfig, 'light' | 'dark'>>) => {
      state.customTheme = action.payload
    },
    updateCustomTheme: (state, action: PayloadAction<Pick<CustomThemeConfig, 'light' | 'dark'>>) => {
      state.customTheme = { ...state.customTheme, ...action.payload }
    },
    resetCustomTheme: (state) => {
      state.customTheme = DEFAULT_CUSTOM_THEME
    }
  }
})

export const { setCustomTheme, updateCustomTheme, resetCustomTheme } = themeSlice.actions

export default themeSlice.reducer
