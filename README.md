<div align="center">

# Musicn

🎵 一个下载高质量音乐的命令行工具

![](https://cdn.jsdelivr.net/gh/miqilin21/static@master/img/20211015144020.gif)

</div>

## 安装

```bash
$ yarn global add musicn
# or
$ npm install musicn -g
```

## 使用

```bash
$ musicn 稻香
```

For short:

```bash
$ msc 稻香
```

## 资源

- 歌曲来源: 咪咕（API 是从公开的网络中获得）

## 说明

1. 部分歌曲支持无损音乐
2. 优先搜索高品质音乐（无损 -> 320K -> 128K）
3. 在 `windows` 的 `git Bash` 中不支持显示下载进度条并且不支持上下切换选歌，问题是 `cli-progress` 不兼容
4. node version > 14