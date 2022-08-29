<div align="center">

# Musicn

🎵 一个下载高品质音乐的命令行工具

<img src="https://user-images.githubusercontent.com/44596995/187193232-c3ac00ea-ec21-47e8-9f29-55c195417286.gif" width="65%" height="40%" />

</div>

## 全局安装

```bash
$ npm i musicn -g
```

## 使用

```bash
$ musicn 周杰伦
# or
$ msc 周杰伦
```

搜索的页码数(默认是第1页):

```bash
$ msc 周杰伦 --number 2
# or
$ msc 周杰伦 -n 2
# or
$ msc -n 2 周杰伦
```

咪咕服务下载(默认是这个服务):

```bash
$ msc 周杰伦
```

酷我服务下载:

```bash
$ msc 周杰伦 --kuwo
# or
$ msc 周杰伦 -k
# or
$ msc -k 周杰伦
```

网易云服务下载:

```bash
$ msc 周杰伦 --wangyi
# or
$ msc 周杰伦 -w
# or
$ msc -w 周杰伦
```

附带歌词下载(默认是不附带):

```bash
$ msc 周杰伦 --lyric
# or
$ msc 周杰伦 -l
# or
$ msc -l 周杰伦
```

自定义下载路径(默认是当前路径):

```bash
$ msc 周杰伦 --path ../music
# or
$ msc 周杰伦 -p ../music
# or
$ msc -p ../music 周杰伦
```

帮助信息:

```bash
$ msc --help
# or
$ msc -h
```

版本信息:

```bash
$ msc --version
# or
$ msc -V
```

## 资源

- 音乐来源: 酷我、网易云和咪咕（API 是从公开的网络中获得）

## 说明

1. 暂时只支持咪咕、酷我和网易云的服务（因一些特殊原因，其余平台暂时是不支持的，其中咪咕支持无损音乐下载，其余服务暂时都只支持普通mp3格式的下载，且会员专属的服务暂时也不支持，后期会继续探索其余平台可用的无损音乐下载）
2. 在 `windows` 桌面端的 `git Bash` 中不支持上下切换选歌，问题是 `inquirer` 不兼容，建议使用其它终端工具
3. node version > 16
4. 此项目仅供个人学习研究，严禁用于商业用途
