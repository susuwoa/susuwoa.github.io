import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/**
 * 配置 单个 note
 */
const computer = defineNoteConfig({
  dir: '计算机',
  link: '/computer/',
  sidebar: 'auto',
})

const kaoyan = defineNoteConfig({
  dir: '考研',
  link: '/kaoyan/',
  sidebar: 'auto',
})

/**
 * 配置 notes
 */
export default defineNotesConfig({
  // 声明所有笔记的目录，(默认配置，通常您不需要声明它)
  dir: '/notes/',
  link: '/',
  // 在这里添加 note 配置
  notes: [computer,kaoyan] 
})