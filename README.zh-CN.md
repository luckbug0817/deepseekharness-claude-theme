# DeepSeek Harness Claude 主题

English · [简体中文](README.zh-CN.md)

`deepseek-claude-web-theme` 是一个用于 **DeepSeek Harness（DSH）Web Profile** 的静态客户端主题插件。它会在兼容的 Harness Web Profile 中注册两套受 Claude 启发的外观主题：

- `claude-sandstone`：暖米白浅色主题
- `claude-ink`：暖炭黑深色主题

它是浏览器端扩展，不是独立 Web 应用，也不会替代 DeepSeek Harness。Node 入口刻意保持为空；浏览器端入口会等待 Profile 提供公开的 `theme` 服务，然后使用 `ctx.theme.register()` 注册两套主题。

## 兼容性与范围

仅在满足以下条件的 DSH Web Profile 中使用：

- 已组合并启用 `@deepseek-ai/dsh-client-ui-theme`；
- 提供公开的 `ctx.theme.register(definition)` 服务；
- Loader/Profile 配置支持加载 DSH 客户端包。

清单中也通过 `dsh.client.inject` 声明了相同的客户端依赖。

本包不会声明对 DSH 内部包的 npm peer dependency。公开 npm 仓库目前无法提供一套可独立解析的完整 DSH 客户端依赖图，因此单独执行 `npm install deepseek-claude-web-theme` **不会**得到可运行的 Profile，也不是支持的安装方式。

插件只调用公开主题服务，不修改任何 Harness 核心文件。选择哪个已注册主题仍由你的 Profile 决定。

## 构建并安装到现有 Profile

请先准备一个可正常运行、兼容的 DSH Web Profile（来自你的 Harness checkout 或部署环境）。不要尝试通过 npm 安装未公开发布的 DSH 包来初始化 Profile。

在本包目录中执行：

```sh
npm ci
npm run bundle
npm pack
```

这会生成 `deepseek-claude-web-theme-0.1.0.tgz`。接着，在**负责解析现有 DSH Profile 依赖的配置包**中安装该本地归档：

```sh
npm install /absolute/path/to/deepseek-claude-web-theme-0.1.0.tgz
```

然后将 `deepseek-claude-web-theme` 加入该 Profile 已组合的 Web 客户端 Loader 条目，并确保 `@deepseek-ai/dsh-client-ui-theme` 已同时启用。请保留原 Profile 的 Loader 写法和包解析规则；它们由兼容的 DSH 运行时决定，而不是由本插件决定。修改 Profile 配置或依赖后，重启 Web 服务。

若插件一直处于等待状态，或显示 `theme` 不可用，说明 Profile 尚未正确组合 UI Theme 客户端服务。请先修复或升级该 Profile；本插件不会提供缺失的 DSH 运行时。

## 选择主题

重启后，打开 Harness Web 的 **Appearance（外观）** 设置，选择以下任意主题：

- **Claude Sandstone**（`claude-sandstone`）
- **Claude Ink**（`claude-ink`）

主题会注册到加载该客户端的 Web 进程中，因此外观选择是进程本地的：不同 Web 进程、浏览器 Profile 或环境会按 Harness 的正常设置行为分别保留自己的选择。本插件不会在进程或用户之间同步设置。

选择器位于 **设置 → 通用设置**，在内置外观模式下方。选择 Claude 主题后会立即应用到当前浏览器，当前选择的按钮会显示为按下状态。选择结果由宿主设置服务保存，因此其持久化与作用范围遵循该服务在当前浏览器/Profile 中的正常行为。

## 截图

以下为 DSH Web **设置 → 通用设置** 的真实截图，已选主题的按钮显示为按下状态：

| Claude Sandstone | Claude Ink |
| --- | --- |
| ![在 DSH Web 设置中选中 Claude Sandstone](docs/images/sandstone.png) | ![在 DSH Web 设置中选中 Claude Ink](docs/images/ink.png) |

## 隐私与资源

发布包只包含 JavaScript 与类型声明；CSS 已打包进 `lib/client.js`。它不会发起网络请求、不收集用户数据、不加载远程字体，也不包含图片或其他外部资源。样式仅使用打包 CSS 与 Profile 主题服务提供的语义化 `--dsw-alias-*` 令牌。

## 手动 Web 冒烟测试

以下步骤需要一个可运行且兼容的 DSH Web Profile，无法仅凭本包完成验证。

1. 按上文安装并组合插件，然后重启 DSH Web 服务。
2. 打开 Web UI，进入 **Appearance（外观）**。
3. 确认能看到 `claude-sandstone` 与 `claude-ink`。
4. 分别选择两套主题，检查页面背景、控件、输入框、代码块，以及会话/输入区滚动条是否更新。
5. 刷新页面，确认主题会按 Profile 的正常设置行为继续保持选中。
6. 禁用或移除插件后重启，确认两项 Claude 主题不再出现，且仍可选择原有内置主题。

## 恢复与卸载

若不想继续使用该主题，先在 **Appearance（外观）** 中切回内置主题。然后从 Profile 组合的 Web 客户端 Loader 条目中删除 `deepseek-claude-web-theme`，重启 Web 服务，并在 Profile 配置包中移除本地依赖：

```sh
npm uninstall deepseek-claude-web-theme
```

本插件不会修改 Harness 核心，因此不需要恢复任何核心文件。

## 开发检查

```sh
npm test
npm run typecheck
npm pack --dry-run
```

`npm test` 会先执行构建，因此在全新 clone 后运行 `npm ci` 再测试时，也会验证打包后的客户端。
