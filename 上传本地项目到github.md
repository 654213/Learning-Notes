#### 上传本地项目到github

1.第一步：登录github并且安装好git

2.第二步：创建新仓库`New repository`

3.第三步：右键本地项目，进入git bash,执行以下操作：

```
git clone git://github.com/654213/upload.git   (这里我将https-->git)
```

4.第四步：将项目所有文件拷贝到`upload`文件夹

注：upload是github创建的项目名称，项目所有文件不包括`.git` 和 `.gitignore`这两个，这两个应该删除。

5.第五步：进入项目里面：这里注意是`master`分支

```
cd upload
```

6.第六步：执行以下代码就ok

```
git add .
git commit -m "first commit"   //名字自己随便起
git push -u https://github.com/654213/upload.git master
```

