# Debian 13 + 1Panel v2 自动部署

适用环境：Debian GNU/Linux 13、1Panel 社区版 v2.2.5、x86_64。

源码仓库：<https://github.com/LyaQanYi/lyaqanyi.com>

推送 `main` → GitHub 构建并测试 Docker 镜像 → 发布到 GHCR → SSH 更新服务器容器 → 1Panel OpenResty 提供域名与 HTTPS 访问。

首次先发布镜像，再完成服务器初始化，最后启用自动部署。没有设置 `AUTO_DEPLOY=true` 时，工作流只发布镜像，不连接服务器。

## 1. 上传源码，生成第一个镜像

将本项目源码（包括隐藏目录 `.github/`、`Dockerfile`、`deploy/`、`scripts/`、`package-lock.json`、`src/fonts/`）提交并推送到上述仓库的 `main` 分支。不要上传 `node_modules`、`.next`、真实 `.env` 或私钥；`.gitignore` 已配置排除规则。

本仓库正式发布分支为 `main`。首次从其他本地仓库连接时，先检查远程是否已有提交，保留已有历史，不要强制推送覆盖。可以通过 GitHub Desktop 选择本次网站文件完成提交和推送。

在仓库打开 **Actions → Build and deploy website**，等待 `image` 任务成功。它会检查部署脚本、构建 Docker 镜像、启动实际 Linux 容器验证页面/字体/RSS，再推送刚刚测试过的镜像。

在任务的 Summary 中复制 `Image` 后的完整地址，形如：

```text
ghcr.io/lyaqanyi/lyaqanyi.com@sha256:这里是64位摘要
```

后文都要替换成这段真实地址，不能保留中文占位符。

如果 Actions 没有运行，确认分支为 `main`，且 **Settings → Actions → General** 允许使用 Actions。也可以点击 **Run workflow** 并选择 `main`。

## 2. 准备服务器目录和部署账号

### 已通过 1Panel「编辑」创建编排的站点

本次站点已经由 1Panel 创建，实际目录为 `/opt/1panel/docker/compose/lyaqanyi-web/`，其中已有 `.env` 和 `docker-compose.yml`。在这个目录上传 `deploy/deploy.sh` 即可；无需另建编排或覆盖现有配置。

脚本会识别同目录下的 `compose.yaml`、`compose.yml`、`docker-compose.yaml` 或 `docker-compose.yml`，所有更新和回滚都使用该文件及 `lyaqanyi-web` 项目名。若存在多个候选文件，脚本会停止，避免更新错误的编排。

继续配置时，下文的 `/opt/lyaqanyi-site` 都应使用上述实际目录，`compose.yaml` 应使用 `docker-compose.yml`，GitHub 的 `DEPLOY_PATH` 也设置为实际目录。专用部署账号需要能读取编排文件，并写入该目录及 `.env`。这里的目录属于现有 1Panel 编排，不要再次执行第 4 节的创建操作。

### 尚未创建编排的站点

在 1Panel 服务器终端以 root 检查：

```bash
docker version
docker compose version
docker compose up --help | grep -- --wait-timeout
ss -ltnp 'sport = :3100'
```

Docker 必须连接到服务器端，Compose 必须支持 `--wait` 和 `--wait-timeout`。3100 若已占用，在后面的 `.env` 改用空闲端口。

新建专用账号；已经存在则复用：

```bash
useradd --create-home --shell /bin/bash site-deploy
usermod --append --groups docker site-deploy
install -d -o site-deploy -g site-deploy -m 0750 /opt/lyaqanyi-site
install -d -o site-deploy -g site-deploy -m 0700 /home/site-deploy/.ssh
```

这个账号能操作 Docker，权限较高，只配置本仓库使用的专用部署密钥。

通过 1Panel 文件管理上传：

| 本地文件 | 服务器文件 |
| --- | --- |
| `deploy/compose.yaml` | `/opt/lyaqanyi-site/compose.yaml` |
| `deploy/deploy.sh` | `/opt/lyaqanyi-site/deploy.sh` |
| `deploy/.env.example` | `/opt/lyaqanyi-site/.env` |

编辑服务器 `.env`，填写步骤 1 的完整镜像地址：

```dotenv
SITE_IMAGE=ghcr.io/lyaqanyi/lyaqanyi.com@sha256:替换为真实摘要
SITE_PORT=3100
```

以 root 设置权限：

```bash
chown site-deploy:site-deploy /opt/lyaqanyi-site/{compose.yaml,deploy.sh,.env}
chmod 0644 /opt/lyaqanyi-site/{compose.yaml,deploy.sh}
chmod 0600 /opt/lyaqanyi-site/.env
```

## 3. 让服务器可以拉取镜像

GHCR 包的可见性与源码仓库分别管理，新包默认可能是私有的。

- 可以公开镜像：进入 GitHub 个人主页 **Packages → lyaqanyi.com → Package settings**，改为 Public。公开镜像允许匿名拉取，其中包含运行网站所需的代码与静态内容。
- 保持私有：创建具有 `read:packages` 权限的 GitHub **personal access token (classic)**，在服务器以 `site-deploy` 账号登录 GHCR：

```bash
su - site-deploy
docker login ghcr.io --username LyaQanYi
```

在 Password 提示中粘贴 token；不要把它写进源码、Compose、聊天或命令参数。后续脚本以同一账号读取保存的凭据。若由 1Panel 拉取私有包，还需在面板的镜像仓库设置中配置对应 GHCR 凭据。

## 4. 在 1Panel 启动网站

在 **容器 → 编排 → 创建编排** 中：

- 名称填写 **`lyaqanyi-web`**，必须与脚本的 Compose project name 一致。
- 选择 **路径选择**，使用 `/opt/lyaqanyi-site/compose.yaml`。
- 环境变量使用同目录 `.env`。若面板有单独编辑框，确保内容与服务器文件一致；检查实际编排路径，不能产生第二套不同目录的配置。
- 创建并启动，等待 `website` 容器显示 healthy。

在服务器检查（端口如有变动，请同步修改）：

```bash
curl -I http://127.0.0.1:3100/
```

应返回 HTTP 200。如果面板无法读取 `.env` 或私有仓库凭据，也可先以 `site-deploy` 运行：

```bash
bash /opt/lyaqanyi-site/deploy.sh 'ghcr.io/lyaqanyi/lyaqanyi.com@sha256:替换为真实摘要'
```

这种方式创建的编排会被 1Panel 识别为 Local。可以在容器列表看日志并操作容器，编排级编辑/启停需用命令行。

## 5. 接入域名与 HTTPS

将 `lyaqanyi.com` 的 DNS A 记录指向服务器公网 IPv4，允许服务器防火墙/云安全组的 80 和 443 端口。AAAA 记录只在配置了可用 IPv6 时添加。

1Panel 网站功能使用 **OpenResty**，已有实例直接复用；未安装则在应用商店安装。先确认它的网络模式，在服务器执行（替换实际容器名）：

```bash
docker inspect --format '{{.HostConfig.NetworkMode}}' OPENRESTY容器名
```

- **结果是 `host`**：创建「反向代理」网站，主域名填写 `lyaqanyi.com`，代理地址填写 **`http://127.0.0.1:3100`**。
- **结果是 bridge 或其他 Docker 网络**：OpenResty 内的 `127.0.0.1` 指向它自身。通过面板为它的编排持久添加现有外部网络 **`lyaqanyi-web`**，保留原有网络，然后代理到 **`http://lyaqanyi-site:3000`**。不要通过暴露公网 3100 端口解决连通性问题。

后一种情况，向 OpenResty 的现有 Compose 合并以下片段，服务名以实际文件为准，不能覆盖整个文件。重建 OpenResty 会短暂影响该实例上的网站：

```yaml
services:
  openresty:
    networks:
      # 保留原有网络，并追加这一项
      - lyaqanyi-web
networks:
  lyaqanyi-web:
    external: true
    name: lyaqanyi-web
```

在网站 HTTPS 设置中申请/选择证书，开启 HTTPS 和 HTTP 跳转 HTTPS。Next.js 路由直接交给代理，不需要额外的单页应用伪静态规则。保持页面反向代理缓存关闭；静态资源会携带 Next.js 的缓存头。

访问 <https://lyaqanyi.com>，并检查 `/work`、`/about` 与 `/feed.xml`。

## 6. 配置部署 SSH 密钥

在你自己的电脑终端生成专用密钥。如果已有同名文件，换一个文件名，不要覆盖：

```bash
ssh-keygen -t ed25519 -C github-lyaqanyi-site -f ~/.ssh/lyaqanyi_deploy -N ''
```

- 公钥 `~/.ssh/lyaqanyi_deploy.pub`：将完整一行追加到服务器 `/home/site-deploy/.ssh/authorized_keys`。可在行首加 `restrict `，禁用端口转发等不需要的功能。
- 私钥 `~/.ssh/lyaqanyi_deploy`：下一步保存到 GitHub Secret，保留完整 BEGIN/END 行。

以 root 修正服务器公钥文件权限：

```bash
chown site-deploy:site-deploy /home/site-deploy/.ssh/authorized_keys
chmod 0600 /home/site-deploy/.ssh/authorized_keys
```

在电脑上验证登录和 Docker 权限：

```bash
ssh -i ~/.ssh/lyaqanyi_deploy -p 22 site-deploy@你的服务器地址 'docker version'
```

22 要换成实际 SSH 端口。GitHub 托管 runner 必须能连接这个 SSH 地址；仅允许内网或指定来源连接的服务器，需要先配置相应访问方式。

获取用于校验服务器身份的 known_hosts：在**可信的 1Panel 服务器终端**执行，填写与下一步 `DEPLOY_HOST` 和 `DEPLOY_SSH_PORT` 相同的值：

```bash
server_address='你的服务器公网地址或域名'
server_ssh_port='22'
host_label="$server_address"
if [ "$server_ssh_port" != '22' ]; then
  host_label="[$server_address]:$server_ssh_port"
fi
awk -v host="$host_label" '{print host " " $1 " " $2}' /etc/ssh/ssh_host_ed25519_key.pub
```

保存输出的整行。这是服务器公钥，不是私钥。工作流会严格验证它；服务器重装或更换主机密钥后，需要重新核实并更新。

## 7. 在 GitHub 开启自动上线

仓库 **Settings → Environments → New environment**，创建 **`production`**，在该环境添加 Secrets：

| Secret | 内容 |
| --- | --- |
| `DEPLOY_HOST` | 服务器公网 IPv4 或域名，不含协议或端口 |
| `DEPLOY_USER` | `site-deploy` |
| `DEPLOY_SSH_KEY` | 专用 SSH 私钥的完整内容 |
| `DEPLOY_KNOWN_HOSTS` | 从可信服务器终端得到的整行 |

在 **Settings → Secrets and variables → Actions → Variables** 添加**仓库级** Variables：

| Variable | 值 |
| --- | --- |
| `AUTO_DEPLOY` | 全部准备好后最后设为 `true`；改为 `false` 可暂停自动上线 |
| `DEPLOY_SSH_PORT` | 实际 SSH 端口，默认 `22` |
| `DEPLOY_PATH` | 默认 `/opt/lyaqanyi-site`，使用英文、数字、点、下划线、斜杠或连字符 |
| `SITE_URL` | 默认 `https://lyaqanyi.com` |

`AUTO_DEPLOY` 必须是仓库级变量，不能只放在 Environment 中，否则任务调度时可能读不到。

回到 **Actions → Build and deploy website → Run workflow → main**，完成首次完整自动部署。今后推送 `main` 即更新服务器；其他分支不会更新正式站点。

`NEXT_PUBLIC_SITE_URL` 在构建时写入页面，因此更换域名要修改 GitHub 的 `SITE_URL` 并重新构建，仅在服务器设置变量不能更新已有页面地址。

## 维护与回退

- 修改网站内容或样式：推送源码即可。
- 修改 `compose.yaml` / `deploy.sh`：需同步服务器配置文件；普通网页更新无需重复上传。
- 日志：1Panel 容器列表 → `website` → 日志。
- 构建或镜像拉取失败：当前网站保留。
- 新容器启动不健康：脚本尝试恢复旧镜像，Actions 仍标记失败。首次部署没有旧版本，无法回退。
- 单容器更新有短暂重启间隙，不保证零停机。
- `restart: unless-stopped` 处理进程退出和服务器重启；健康检查本身不会重启仍在运行但不健康的容器。

以 `site-deploy` 手动回退上一个成功版本：

```bash
bash /opt/lyaqanyi-site/deploy.sh --rollback
```

`.previous-image` 保存上一镜像，`.env` 保存当前部署引用。不要清理 `.previous-image` 指向的本地镜像。面板首次创建的版本，会在下次脚本成功部署时成为可回退版本。

手动停止网站（会下线）：

```bash
cd /opt/lyaqanyi-site
docker compose --project-name lyaqanyi-web --env-file .env --file compose.yaml stop website
```

## 官方参考

- [1Panel 编排](https://1panel.cn/docs/v2/user_manual/containers/compose/)
- [1Panel 反向代理网站](https://1panel.cn/docs/v2/user_manual/websites/website_create/)
- [GitHub 发布镜像](https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images)
- [GHCR 包权限](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages)
- [Next.js standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
