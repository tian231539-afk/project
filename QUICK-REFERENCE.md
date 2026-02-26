# 🚀 快速参考 - AI 开发流程卡片

## 📋 一句话总结

**AI 自动开发 + 用户手动验证 + 平台操作部署**

---

## 🎯 三步走流程

```
第 1 步：AI 开发（自动）
├─ 创建项目
├─ 编写代码
└─ 生成文档

第 2 步：用户验证（手动）
├─ 本地测试
├─ GitHub 推送
└─ Vercel 部署

第 3 步：问题修复（协作）
├─ 报告问题
├─ AI 诊断
└─ 用户修复
```

---

## ⚡ 快速命令清单

### AI 自动操作（无感知）

```bash
# 初始化项目（AI 自动执行）
coze init 项目目录 --template nextjs

# 创建文件（AI 自动执行）
write_file → page.tsx
write_file → route.ts
```

### 用户手动操作（必需）

```bash
# 1. 本地测试
访问: http://localhost:5000

# 2. 推送 GitHub
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/用户名/仓库名.git
git push -u origin main

# 3. Vercel 部署
访问: https://vercel.com → Add New → Project → Import → Deploy
```

---

## 🔧 关键决策点

| 决策 | 选择 | 原因 |
|------|------|------|
| 前端框架 | Next.js 16 | App Router + API Routes |
| UI 组件 | shadcn/ui | 预装 + 可定制 |
| 样式方案 | Tailwind CSS 4 | 原子化 + 高效 |
| 部署平台 | Vercel | 自动部署 + 免费 |
| 数据存储 | localStorage | 简单 + 无后端 |

---

## ⚠️ 关键注意事项

### 🔴 必须用户手动操作

1. **GitHub 推送**
   - AI 无法访问你的 GitHub
   - 必须 `git push` 上传代码

2. **Vercel 部署**
   - 需要 GitHub 授权
   - 在 Vercel 网页操作

3. **修复 405 错误**
   - 在 GitHub 网页手动创建 API 文件
   - 路径：`src/app/api/xxx/route.ts`

### 🟢 AI 自动完成

1. **项目初始化**
2. **代码编写**
3. **文档生成**
4. **问题诊断**

---

## 📁 文件清单

### AI 自动创建

```
项目代码/
├── src/app/page.tsx          ← 前端页面
├── src/app/api/xxx/route.ts  ← 后端 API
└── 配置文件...

教程文档/
├── INDEX.md                  ← 教程索引
├── README.md                 ← 总览
├── QUICK_START.md            ← 快速上手
└── 其他教程...
```

### 用户需要创建

```
src/app/api/xxx/route.ts      ← 解决 405 错误时
```

---

## 🆘 常见问题速查

| 错误 | 原因 | 解决方法 |
|------|------|----------|
| 405 | API 文件不存在 | 在 GitHub 手动创建 |
| 404 | 页面路径错误 | 检查文件位置 |
| 构建失败 | 代码错误 | 本地 `pnpm run build` 测试 |
| API 调用失败 | 环境变量未配置 | 在 Vercel 配置环境变量 |

---

## 🎯 下次开发流程

### 1. 准备阶段（用户）

```bash
# 确保已安装
✓ Node.js
✓ Git
✓ VS Code

# 确保已注册
✓ GitHub 账号
✓ Vercel 账号
```

### 2. 开发阶段（AI 自动）

```
用户提供需求
    ↓
AI 创建项目
    ↓
AI 编写代码
    ↓
AI 生成文档
```

### 3. 验证阶段（用户）

```bash
# 本地测试
访问 http://localhost:5000

# 推送 GitHub
git push

# Vercel 部署
访问 Vercel 网页部署
```

### 4. 修复阶段（协作）

```
遇到问题
    ↓
用户报告错误
    ↓
AI 诊断问题
    ↓
用户执行修复
```

---

## 📊 时间分配

| 阶段 | 耗时 | 责任方 |
|------|------|--------|
| 需求分析 | 5 分钟 | 用户 + AI |
| AI 开发 | 10-15 分钟 | AI |
| 用户测试 | 5-10 分钟 | 用户 |
| GitHub 推送 | 5 分钟 | 用户 |
| Vercel 部署 | 5-10 分钟 | 用户 |
| 问题修复 | 5-10 分钟 | 协作 |

**总计**：30-50 分钟

---

## 🔗 快速链接

### 教程文档
- 📖 [教程索引](./INDEX.md)
- 🚀 [快速上手](./QUICK_START.md) - 5 分钟
- 🎨 [图文教程](./VISUAL_GUIDE.md) - 15 分钟
- 📚 [完整指南](./COMPLETE_TUTORIAL.md) - 30 分钟

### 平台链接
- **GitHub**: https://github.com
- **Vercel**: https://vercel.com
- **Next.js**: https://nextjs.org

---

## ✅ 开发检查清单

### 开发前
- [ ] 已提供清晰需求
- [ ] 已注册 GitHub 账号
- [ ] 已注册 Vercel 账号

### 开发中
- [ ] AI 已创建项目
- [ ] 本地测试通过
- [ ] 代码已推送到 GitHub

### 部署后
- [ ] Vercel 部署成功
- [ ] 网站可以访问
- [ ] 功能验证通过

---

## 🎓 核心概念速记

```
Next.js
├─ App Router: src/app/page.tsx
├─ API Routes: src/app/api/xxx/route.ts
├─ Server Component: 默认（'use server'）
└─ Client Component: 'use client'

Vercel
├─ 自动部署: 推送 GitHub 自动更新
├─ 环境变量: Settings → Environment Variables
└─ 自定义域名: Settings → Domains

Git
├─ 初始化: git init
├─ 添加: git add .
├─ 提交: git commit -m "消息"
└─ 推送: git push
```

---

## 💡 最佳实践

### ✅ DO

1. **及时测试**：AI 完成后立即本地测试
2. **清晰描述**：提供详细的需求和参考
3. **保留文档**：保存 AI 生成的教程文档
4. **定期提交**：每次功能完成后提交代码

### ❌ DON'T

1. **不要跳过测试**：部署前必须本地验证
2. **不要忘记推送**：AI 创建的文件需要手动推送
3. **不要硬编码密钥**：使用环境变量
4. **不要提交敏感文件**：.next、node_modules 等

---

## 📞 获取帮助

### 查看文档
- [完整教程](./COMPLETE_TUTORIAL.md) - 详细步骤
- [常见问题](./COMPLETE_TUTORIAL.md#常见问题) - 错误排查

### 在线资源
- **Next.js 文档**: https://nextjs.org/docs
- **Vercel 文档**: https://vercel.com/docs
- **Stack Overflow**: 搜索 Next.js 标签

---

## 🎉 开始新项目

直接复制这个流程：

```
1. 告诉 AI 需求
2. 等待 AI 开发完成
3. 本地测试功能
4. 推送 GitHub
5. Vercel 部署
6. 访问网站 🚀
```

---

**文档版本**：v1.0
**用途**：快速参考卡片
**下次开发**：先看这个！
