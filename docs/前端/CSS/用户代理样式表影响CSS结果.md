---
title: 用户代理样式表影响CSS结果
createTime: 2025/05/27 11:08:07
permalink: /article/nfuxdb6w/
tags:
- CSS
- 用户代理样式表
- 前端
---
初学css在测试样式时发现无论如何都无法得到期望的计算结果，在控制台中发现是受到了用户代理样式表的影响，浏览器默认为网页提供了以下样式
```css
p {
display: block;
margin-block-start: 1em;
margin-block-end: 1em;
margin-inline-start: 0px;
margin-inline-end: 0px;
unicode-bidi: isolate;
}
```

即使在html中声明`<!DOCTYPE html>`，也不能禁用用户代理样式表，最后使用css重置解决该问题，即将所有元素的`margin`、`padding`等属性设置为`0`，从而提供一个干净的起点
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
