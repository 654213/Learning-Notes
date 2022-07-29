#### redis基本使用

> 用于周报项目中，在其的使用命令

1.下载zip并解压安装redis(我是存储在C盘)

2.修改redis.windows.conf文件，设置maxmemory大小

```
#maxmemory <bytes>
maxmemory 1024000000
```

设置redis密码

```
#requirepass foobared
requirepass a123456
```

3.启动redis: 在**C:\Redis-x64-5.0.14 **输入cmd，打开窗口

```
redis-server.exe redis.windows.conf
```

4.在**C:\Redis-x64-5.0.14**再另外开一个cmd窗口，执行

```
redis-cli.exe
```

5.进行验证

```
auth "a123456"  //这个是在自己修改redis.windowd.conf密码前提下输入验证
get name
set name "xxx"
```

6.将redis加入到windows的服务中(前提是上面两个都成功运行，并且关闭)

```
redis-server --service-install redis.windows.conf --loglevel verbose
```

7.安装成功

```
在任务管理器中可以看到redis-server.exe
                  redis-cli.exe
```

8.启动redis

```
前提是上面两个并没有关闭
启动命令：redis-server --service-start
停止命令：redis-server --service-stop
卸载命令：redis-server --service-uninstall
```

[^Redis可视化管理工具<Redis Desktop Manager : >]: https://github.com/uglide/RedisDesktopManager/releases/tag/0.8.8

1