<div align="center">

# Musicn

🎵 一个可播放及下载高品质音乐的命令行工具

<img src="https://user-images.githubusercontent.com/44596995/187193232-c3ac00ea-ec21-47e8-9f29-55c195417286.gif" width="65%" height="40%" />

</div>

## 全局安装

```bash
$ npm i musicn -g
# or
$ yarn global add musicn
```

## 使用

```bash
$ musicn 周杰伦
# or
$ msc 周杰伦
```

### 帮助信息:

```bash
$ msc --help
# or
$ msc -h
```

### 开启本地播放链接(手机可扫描二维码)下载及播放:

```bash
$ msc --qrcode
# or
$ msc -q
# or
$ msc -q -P 3000 # 指定端口，-P为大写
```
> 注意：使用手机扫描二维码时，电脑和手机两个设备必须连接到同一个 Wi-Fi；强烈推荐这种方式，既能听歌又能下载歌曲

<div align="center">
  <img src="https://github.com/zonemeen/musicn/assets/44596995/f673ad83-f867-41c5-84c9-9e0c531ecce6" width="75%" height="40%" />
</div>

也可以部署到自己的服务器，具体方法如下：

```shell
git clone https://github.com/zonemeen/musicn.git
cd musicn
npm install
npm run build
node ./bin/cli.js -q
# or
npm i musicn -g # 全局安装musicn
msc -q
```

### 开启本地播放链接是否自动打开浏览器:

```bash
$ msc -q --open
# or
$ msc -q -o
```

### 搜索的页码数(默认是第1页):

```bash
$ msc 周杰伦 --number 2
# or
$ msc 周杰伦 -n 2
# or
$ msc -n 2 周杰伦
```

### 搜索的歌曲数量(默认是20条):

```bash
$ msc 周杰伦 --size 10 -k # kuwo的服务
# or
$ msc 周杰伦 -s 10 -k
# or
$ msc -s 10 -k 周杰伦
```

> 注意：咪咕正常搜索因为api不支持，搜索时的自定义歌曲数量是无效的

### 咪咕服务下载(默认是这个服务):

```bash
$ msc 周杰伦
```

### 酷我服务下载:

```bash
$ msc 周杰伦 --kuwo
# or
$ msc 周杰伦 -k
# or
$ msc -k 周杰伦
```

### 网易云服务下载:

```bash
$ msc 周杰伦 --wangyi
# or
$ msc 周杰伦 -w
# or
$ msc -w 周杰伦
```

### 酷狗服务下载:

```bash
$ msc 周杰伦 --kugou
# or
$ msc 周杰伦 -g
# or
$ msc -g 周杰伦
```

### 附带歌词下载(默认是不附带):

```bash
$ msc 周杰伦 --lyric
# or
$ msc 周杰伦 -l
# or
$ msc -l 周杰伦
```

### 根据歌单id下载:

```bash
$ msc --songListId 206140403
# or
$ msc -i 206140403
# or
$ msc -i 206140403 -n 2
```

### 自定义下载路径(默认是当前路径):

```bash
$ msc 周杰伦 --path ../music
# or
$ msc 周杰伦 -p ../music
# or
$ msc -p ../music 周杰伦
```

### 版本信息:

```bash
$ msc --version
# or
$ msc -v
```

## 资源

- 音乐来源: 酷我、酷狗、网易云和咪咕（API 是从公开的网络中获得）

## 说明

1. 暂时只支持咪咕、酷我、酷狗和网易云的服务（因一些特殊原因，其余平台暂时是不支持的，其中咪咕支持无损音乐下载，其余服务暂时都只支持普通mp3格式的下载，且会员专属的服务暂时也不支持，后期会继续探索其余平台可用的无损音乐下载）
2. 在 `windows` 桌面端的 `git Bash` 中不支持上下切换选歌，问题是 `inquirer` 不兼容，建议使用其它终端工具
3. `Vecel` 因为服务器在海外的缘故，在线播放地址暂时只有咪咕服务有效
4. node version > 16
5. 此项目仅供个人学习研究，严禁用于商业用途
