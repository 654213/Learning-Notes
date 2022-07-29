#### ni区别于npm yarn pnpm

> package manager

**使用**

```
npm i -g @antfu/ni

ni
# npm/yarn/pnpm i

ni axios
# npm/pnpm i axios
# yarn add axios

ni @types/node -D
# npm/pnpm i @types/node -D
# yarn add @types/node -D

nr dev --port=3000
# npm/yarn/pnpm dev --port=3000

nrm @types/node -D
#npm uninstall @types/node -D
#yarn/pnpm remove @types/node -D

其中：在命令末尾追加 \? --->表示只打印，不是真正的执行
```

