#### pnpm区别于npm、yarn

> 1.节约磁盘空间并提升安装速度
>
> 2.创建非扁平化的node_modules文件夹

pnpm官方文档：https://pnpm.io/

已安装Node.js

在Windows下(使用PowerShell):

```
(Invoke-WebRequest 'https://get.pnpm.io/v6.16.js' -UseBasicParsing).Content | node - add --global pnpm
```

通过npm安装

```
npm install -g pnpm
```

升级

```
pnpm add -g pnpm
```

如果pnpm 损坏并且您无法通过重新安装来修复它，您可能需要从 PATH 中将其手动删除。

运行：`which pnpm`来找到pnpm的位置。(Windows下在git bash打开)

```
which pnpm
/c/ProgramData/Microsoft/Windows/Start Menu/Programs/Node.js/pnpm

```

假设您在运行 `pnpm install`时遇到以下错误：

```
C:\src>pnpm install
internal/modules/cjs/loader.js:883
  throw err;
  ^



Error: Cannot find module 'C:\Users\Bence\AppData\Roaming\npm\pnpm-global\4\node_modules\pnpm\bin\pnpm.js'
←[90m    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)←[39m
←[90m    at Function.Module._load (internal/modules/cjs/loader.js:725:27)←[39m
←[90m    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)←[39m
←[90m    at internal/main/run_main_module.js:17:47←[39m {
  code: ←[32m'MODULE_NOT_FOUND'←[39m,
  requireStack: []
}
```

打开上面的该目录并删除所有与 pnpm 相关的文件（如`pnpm.cmd`、 `pnpx.cmd`、 `pnpm`等）。 完成后，再次安装 pnpm。现在，它应该正按照预期工作。

如果您需要从系统中卸载 pnpm CLI 并移除磁盘中的相关文件。

```
npm rm -g pnpm
```

出现输入pnpm -v出现不是内部命令时，参考以下：

```
https://blog.csdn.net/zlw123321/article/details/107133422/
```

**安装pnpm淘宝镜像**

```
pnpm config set registry http://registry.npm tao.org
```

**查看pnpm镜像配置**

```
pnpm config get registry
```

**卸载pnpm淘宝镜像**

```
pnpm config delete registry
```

**使用**

```
pnpm i   //install all dependencies for a project
pnpm add sax  //dependencies
pnpm add -D sax //devDependencies
pnpm add sax@3.0.0   //指定版本
pnpm add -g          //全局安装
pnpm up              //更新所有的依赖，按照package.json里面的范围
pnpm up --latest     //更新所有的依赖，忽视package.json里面的范围
pnpm remove sax      //移除包
pnpm remove sax -g   //移除全局包
```

