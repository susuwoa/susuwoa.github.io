---
title: Minectaft 本地存档转移到服务器
createTime: 2025/05/29 14:37:01
permalink: /article/6pfr0tf9/
tags:
- 游戏
- Linux
- Minecraft
---
## 注意
新版本中不再需要存档转换，直接将本地的saves文件夹中的存档文件夹改名为`world`，并上传至服务器的相应目录中即可。玩家的数据存储在存档文件夹中的`playerdata`文件夹中，在迁移存档后可以直接连接至服务器，不会丢失玩家数据。

## 如果遇到登录后玩家数据丢失的问题

如果遇到登录后玩家数据丢失的问题，检查服务器配置文件`server.properties`中的`online-mode`项。若之前通过正版账号登录，而此次设置为`false`则登录时会以**离线UUID**为文件名创建新的玩家数据。要修正问题，将`online-mode`项修改为`true`即可。

如果有需要，可以通过该网站：<https://zh.minecraft.wiki/w/%E7%8E%A9%E5%AE%B6%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F>，查询玩家名称对应的离线UUID，将`playerdata`文件夹中的对应的玩家数据的文件名改为离线UUID即可（成就数据的文件名需要另外更改）。

📜 这里提供一个修改文件名的bash脚本
```bash title="rename.sh"
#!/bin/sh

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <old_filename> <new_filename>"
    exit 1
fi

OLD_NAME="$1"
NEW_NAME="$2"

find . -type f | while IFS= read -r file; do
    basefile=$(basename "$file")
    filename="${basefile%.*}"
    ext="${basefile##*.}"

    if [ "$filename" = "$ext" ]; then
        ext=""
    fi

    if [ "$filename" = "$OLD_NAME" ]; then
        newfile="$NEW_NAME"
        if [ -n "$ext" ]; then
            newfile="$newfile.$ext"
        fi

        dir=$(dirname "$file")

        mv -- "$file" "$dir/$newfile"
        echo "Renamed: $file -> $dir/$newfile"
    fi
done
```

🛠️ 使用方法：
```bash
sudo bash rename.sh UUID 离线UUID
```