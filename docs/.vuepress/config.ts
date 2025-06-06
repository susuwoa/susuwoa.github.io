import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import notes from './notes'

export default defineUserConfig({
  bundler: viteBundler(),

  lang: 'zh-CN',
  title: 'susuwoa\'s blog',
  description: 'susuwoa\'s blog 目前主要是 Python | 前端 | 一些折腾',


  // 主题设置从这里开始
  theme: plumeTheme({

    blog: {
      postList: false, // 禁止生成博客文章列表页
      tagsLink: '/tags/',
      categoriesLink: '/categories/',
      archivesLink: '/archives/',
    },


    navbar: [
      { text: '博客', link: '/' }
    ],

    markdown: {
      codeTree: true,
    }
  })
})
