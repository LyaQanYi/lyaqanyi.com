# LyaQanYi.com

浅忆QanYi的个人网站，使用 Next.js、React 和 Tailwind CSS。项目、文章与个人资料保存在 `src/content/`。

## 本地开发

使用 Node.js 24 LTS：

```bash
npm ci
npm run dev
```

打开 <http://localhost:3000>。内容编辑见 [内容说明](src/content/README.md)。

## 检查与构建

```bash
npm run lint
npm run build
python3 scripts/test-deploy.py
```

构建使用 Next.js standalone 输出。Dockerfile 会包含运行所需的服务文件、静态资源和本地字体。

## 部署到 Debian + 1Panel

完整步骤见 **[Debian 13 / 1Panel v2 自动部署指南](docs/deployment.md)**。

- 源码仓库：<https://github.com/LyaQanYi/lyaqanyi.com>
- 推送 `main` 后，GitHub Actions 构建并检查 `linux/amd64` 镜像，再发布到 GHCR。
- 首次默认只构建。配置服务器和 SSH 后，将仓库变量 `AUTO_DEPLOY` 设为 `true`，开启自动上线。
- 1Panel 负责容器管理、域名反向代理和 HTTPS。
- `SITE_URL` 是 GitHub 的构建变量，默认 `https://lyaqanyi.com`。更改域名后需重新构建。

部署文件：

| 文件 | 用途 |
| --- | --- |
| `Dockerfile` | 构建生产镜像 |
| `deploy/compose.yaml` | 服务器容器配置 |
| `deploy/.env.example` | 镜像地址、服务端口示例 |
| `deploy/deploy.sh` | 健康检查、更新与回退 |
| `.github/workflows/deploy.yml` | 自动构建和部署 |

服务器的 `.env`、SSH 私钥与登录凭据不应上传到仓库。
