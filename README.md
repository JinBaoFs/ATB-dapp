# ATB DApp

ATB DApp 是一个运行在 **BNB Smart Chain（BSC）主网**上的 Web3 前端应用，提供钱包连接、USDT 激活、ATB 质押、收益领取、团队数据与提现记录等功能。

> 本仓库仅包含前端代码。用户、收益、签名和记录等数据依赖独立的后端服务，链上操作依赖已部署的智能合约。

## 主要功能

- 使用 RainbowKit 连接 MetaMask、WalletConnect、Trust Wallet、TokenPocket、OKX Wallet 等钱包
- 查询用户 USDT、ATB、LP Token 余额及资金池余额
- 支付 500 USDT 激活服务
- 转入 ATB 完成质押
- 通过后端签名调用合约领取 USDT 或 ATB 收益
- 展示收益、团队等级、直推数据和邀请链接
- 查询提现记录并复制链上地址
- 支持中英文切换及桌面端、移动端响应式布局

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 应用框架 | Next.js 14（App Router）、React 18、TypeScript |
| Web3 | wagmi 1.x、viem 1.x、RainbowKit 1.x |
| UI | Tailwind CSS、daisyUI、Material UI、Swiper |
| 数据请求 | Axios |
| 国际化 | i18next、react-i18next |
| 进程管理 | PM2 |

## 页面路由

| 路由 | 说明 |
| --- | --- |
| `/` | 首页，展示收益与团队概况，并提供 USDT 激活入口 |
| `/service` | ATB 质押、USDT/ATB 收益领取及资金池信息 |
| `/mine` | 个人与团队信息、邀请链接、等级和业绩数据 |
| `/mine/record` | 提现记录 |
| `/404` | 自定义异常页面 |

## 项目结构

```text
ATB-dapp/
├─ public/
│  ├─ images/              # 页面图片与图标
│  └─ locales/             # 多语言资源
├─ src/
│  ├─ app/                 # App Router 页面、布局与 Web3 Provider
│  ├─ components/          # 导航、钱包按钮、通知等公共组件
│  ├─ contract/            # 合约 ABI
│  ├─ hooks/               # 余额查询及合约交互 Hook
│  ├─ includes/            # i18next 初始化配置
│  ├─ lib/                 # 合约地址、请求封装及工具函数
│  └─ server/              # 后端 API 请求封装
├─ ecosystem.config.js     # PM2 配置
├─ next.config.mjs         # Next.js 配置
├─ tailwind.config.ts      # Tailwind CSS 配置
└─ package.json
```

## 本地开发

### 环境要求

- Node.js 18.17 或更高版本
- npm 9 或更高版本
- 可连接 BSC 主网的钱包
- 可用的 WalletConnect Project ID
- 可访问的 ATB 后端服务

### 1. 安装依赖

仓库同时包含 `package-lock.json` 和 `yarn.lock`。以下示例统一使用 npm，请在同一次开发流程中避免混用包管理器。

```bash
npm ci
```

### 2. 配置环境变量

在项目根目录创建 `.env.local`：

```dotenv
# WalletConnect Cloud 中创建项目后获得
NEXT_PUBLIC_WALLET_CONNECT_KEY=your_walletconnect_project_id

# 当前版本暂未在 Provider 中使用，保留供后续接入 Alchemy
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
```

`NEXT_PUBLIC_` 变量会被打包进浏览器代码，不能用于保存私钥、助记词或其他服务端密钥。

### 3. 配置后端代理

API 请求的默认前缀在 `src/lib/fetcher.ts` 中设置为 `/atbapi`。开发或部署环境需要将该路径反向代理到实际后端，例如：

```nginx
location /atbapi/ {
    proxy_pass http://your-api-server/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

仓库根目录的 `setupProxy.js` 是 `http-proxy-middleware` 风格配置，**Next.js 不会自动加载该文件**。本地开发时可使用 Nginx/Caddy 等反向代理，或在 `next.config.mjs` 中自行配置 `rewrites`。

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。进行链上操作前，请确认钱包已切换到 BNB Smart Chain 主网。

## 可用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 创建生产构建 |
| `npm run start` | 启动生产服务器，需先执行构建 |
| `npm run lint` | 运行 Next.js ESLint 检查 |

## 合约配置

当前合约均配置在 BSC 主网（Chain ID `56`），地址集中维护于 `src/lib/contract.ts`。

| 合约 | 地址 |
| --- | --- |
| USDT | `0x55d398326f99059ff775485246999027b3197955` |
| ATB Token | `0xB4d5841Cb352be4b743283dd58B61ecd86655510` |
| ATB Withdraw | `0x9D9c34D891731287492a29468786D6ED7b8aDd05` |
| LP Token | `0x59c16dc9aeb12d89459979529722b63b88c6cb3c` |

如需切换网络或更新合约，请同步修改：

- `src/app/provider.tsx`：钱包支持的网络
- `src/lib/contract.ts`：合约地址、ABI 和 Chain ID
- `src/contract/`：对应合约 ABI

修改后务必在测试环境验证余额精度、授权、转账及签名领取流程。

## 生产部署

### Node.js

```bash
npm ci
npm run build
npm run start
```

生产服务默认监听 `3000` 端口，可通过环境变量 `PORT` 覆盖。

### PM2

项目已提供 `ecosystem.config.js`：

```bash
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
```

无论采用哪种方式，都需要在站点入口配置 HTTPS，并将 `/atbapi` 转发到后端服务。WalletConnect 及多数浏览器钱包在 HTTPS 环境下体验更稳定。

## 开发说明

- 全局 Web3 Provider 位于 `src/app/provider.tsx`，当前只注册 BSC 主网。
- 后端接口集中定义在 `src/server/user.ts`，统一通过 `src/lib/fetcher.ts` 请求。
- 合约读写逻辑主要位于 `src/hooks/usdt.ts` 与 `src/app/service/page.tsx`。
- 界面语言资源位于 `public/locales/`，当前语言选择器开放中文和英文。
- 邀请关系通过 URL 参数传递：首页注册读取 `address`，底部导航及个人页使用 `c` 保留来源参数。

## 安全提示

- 链上交易不可撤销，生产发布前应核验网络、代币精度、收款地址、合约地址和 ABI。
- 不要把私钥、助记词或后端签名密钥提交到仓库，也不要放入任何 `NEXT_PUBLIC_` 环境变量。
- 合约地址和后端返回的支付地址会直接参与资产转移，变更时应经过独立复核。
- 建议先在测试网或隔离环境完成端到端验证，再接入真实资产。

## License

当前仓库未声明开源许可证。如需分发、修改或用于商业用途，请先与项目所有者确认授权范围。
