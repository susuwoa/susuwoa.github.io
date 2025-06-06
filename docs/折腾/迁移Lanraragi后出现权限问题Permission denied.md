---
title: 迁移Lanraragi后出现权限问题Permission denied
createTime: 2025/06/06 12:47:59
permalink: /article/dnpk28mc/
tags:
- Lanraragi
- Docker
- Linux
---
## 将lanraragi改为用另一台主机运行后出现Redis数据加载问题

原本lanraragi运行在nas上，由于近期新装了一台Mini主机作服务器，便想将服务和存储分离。在新主机上使用docker-compose拉取lanraragi的镜像出现以下错误

```
lanraragi  | Can't load application from file "/home/koyomi/lanraragi/script/lanraragi": Error while reading from Redis server: Connection reset by peer at /usr/local/share/perl5/site_perl/Redis.pm line 321.
lanraragi  | 	...propagated at /home/koyomi/lanraragi/script/../lib/LANraragi.pm line 88.
lanraragi  | Server PID will be at /home/koyomi/lanraragi/temp/server.pid
lanraragi  | 
lanraragi  | 
lanraragi  | ｷﾀ━━━━━━(ﾟ∀ﾟ)━━━━━━!!!!!
lanraragi  | (╯・_>・）╯︵ ┻━┻
lanraragi  | It appears your Redis database is currently not running.
lanraragi  | The program will cease functioning now.
lanraragi  | cat: can't open '/home/koyomi/lanraragi/temp/shinobu.pid-s6': No such file or directory
lanraragi  | sh: you need to specify whom to kill
lanraragi  | cat: can't open '/home/koyomi/lanraragi/temp/minion.pid-s6': No such file or directory
lanraragi  | sh: you need to specify whom to kill
```

docker-compose的配置是这样的

```yml
services:
  lanraragi:
    image: difegue/lanraragi
    container_name: lanraragi
    ports:
      - "23000:23000"
    volumes:
      - /path/to/nas/lANraragi/content:/home/koyomi/lanraragi/content
      - /path/to/nas/Docker/lanraragi/thumb:/home/koyomi/lanraragi/thumb
      - /path/to/nas/Docker/lanraragi/database:/home/koyomi/lanraragi/database
    restart: unless-stopped
```

### 尝试一 配置容器使用权限更高的用户（无果）

尝试为容器配置更高权限的用户，为docker-compose加入配置

```yml
environment:
  - LRR_UID=1000
  - LRR_GID=1000
```

重新运行容器后仍然报错，在使用配置root用户后依然报错

```yml
user: root
environment:
  - LRR_UID=0
  - LRR_GID=0
```

### 尝试二 将thumb目录和database目录移动到新主机上（成功）

将docker使用的thumb目录和database目录移动到新主机上后更改docker-compose配置

```yml
volumes:
  - /path/to/nas/lANraragi/content:/home/koyomi/lanraragi/content
  - /path/to/server/docker/lanraragi/thumb:/home/koyomi/lanraragi/thumb
  - /path/to/server/docker/lanraragi/database:/home/koyomi/lanraragi/database
```

再次运行容器，成功！

## 发现漫画缩略图无法显示，重新生成封面出现Permission denied

容器运行成功，漫画数据和tag等内容都成功加载但是封面无法正常显示。在设置中重新生成封面无效，后台出现以下错误

```
[Minion] [warn] Error while generating thumbnail: mkdir /home/koyomi/lanraragi/content/thumb/45: Permission denied at /home/koyomi/lanraragi/script/../lib/LANraragi/Utils/Archive.pm line 127.
```

### 尝试一 为thumb目录设置权限（无果）

使用`chown`和`chmod`命令设置目录的权限

```bash
sudo chown -R 1000:1000 /path/to/server/docker/lanraragi/thumb
sudo chmod -R 775 /path/to/server/docker/lanraragi/thumb
```

重新生成缩略图依然报错

### 尝试二 解耦缩略图目录与内容目录避免嵌套权限问题

找到lanraragi的一个[issuse](https://github.com/Difegue/LANraragi/issues/953)，根据开发者给出的建议，发现在在lanraragi中缩略图路径映射的是`/home/koyomi/lanraragi/thumb`，但在lanraragi中配置的缩略图路径为`/home/koyomi/lanraragi/content/thumb`

在webui中将其修改为`/home/koyomi/lanraragi/thumb`，重新运行生成缩略图，成功！

