# npm

## npm install 流程

![npm install](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a15bd47e5e940e686801feac038e94b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

1. 读取并检查指令配置

  `npm config` 和 `.npmrc`

  `.npmrc` 权重：项目级 > 用户级 > 全局配置 > npm内置

2. 确定依赖版本

  检查是否存在 `package-lock.json`

  - 存在，进行版本对比，对比的方式与 npm 版本相关，根据最新npm版本处理规则，版本能兼容按照 package-lock 版本安装 , 反之按照 package.json 版本安装

  - 不存在，依据 package.json 确定依赖包的信息

3. 检查是否存在相应依赖的缓存

  - 存在，将换成解压到 `node_module` 
 
  - 不存在，下载资源包，验证完整性并添加至缓存，再解压到 `node_module`, 

    最后，生成 `package-lock.json`

## npm 的依赖管理

-  嵌套安装

   version：`3.x` 前

   1. 依赖层级太深路径过长， windows 路径最大长度为 260 字符 (引发未知问题)

   2. 同一个包被安装多次，导致 `node_module` 体积过大

-  扁平化安装

   version：`3.x` 后

   直接依赖及子依赖优先安装在 `node_module` 根目录
   
   安装到相同依赖时，依据 require 的查找机制，逐级往上找 `node_module` ，判断已安装的依赖版本是否符合将要安装的依赖版本，符合则跳过，不符合则在当前模块 `node_module` 安装该依赖。

   1. 解决包重复问题

   2. 依赖层级减少

- lockfile

  version：`5.x`

  生成一个 `package-lock.json` 用于记录依赖树的信息，描述了 `node_module` 目录下所有包的树状结构

  缺点：

  1. 仍存在幽灵依赖、扁平化算法复杂度高的问题

  2. `npm install` 默认拉取当前大版本下的最新依赖包，若存在小版本的更新，会导致开发者的依赖树不一致，造成 `package-lock.json` 的 git 冲突问题 

缺点：

1. 依赖结构不确定，`npm install` 子依赖被优先安装的版本可能不同

2. `幽灵依赖`

   `package.json` 并没有直接依赖某个包，却能被直接引用，可能导致依赖丢失或版本兼容性差异

   原因：所有包都被提升到模块目录的根目录，项目可以访问到未被添加进当前项目的依赖。（寻找依赖时也会从当前项目根目录在 node_modules 一层一层的往上找）

3. `分身依赖`

   - 不同版本的依赖被重复打包，增加了产物体积
   - 无法共享库实例，引用的得到的是两个独立的实例
   - 重复 TypeScript 类型，可能会造成类型冲突

4. 扁平化算法复杂度高

资源完整性验证：

- 获取 `package-lock.json` 的 `integrity` 字段，得到加密 hash 算法 `fn` 和摘要 `dgest`

- 使用 `fn` 对获取到的资源进行加密，再对加密结果使用 `base64` 编码，得到摘要

- 对比两个摘要，完全相同则表明没有被篡改

# yarn

## 新概念

- yarn 会依据使用频率决定谁被安装在顶层目录 ( 和 `npm deque` 类似 )

- `yarn.lock`  只包含版本锁定，不确定依赖结构，需要结合 `package.json` 确定依赖结构。

- yarn 缓存了所有下载过的包，再次使用时无需重复下载，并且下载方式为 并行 下载

- 提出了工作区的概念，方便实现 `monorepo` 仓库管理，可以通过 `yarn link` 链接工作区的包来直接调用，统一维护依赖树

## 与 npm 的缓存差异

- 结构

  - npm 安装依赖后在用户目录下的 `.npm/.cache` 进行缓存

  - yarn 缓存按照平铺形式生成，可通过 yarn cache dir 查询缓存目录（缓存的内容包括压缩包、`.yarn-metadata.json`、解压文件、bin  文件等），条目命名规则遵循 `{slug}/node_modules/{packageName}` ，其中 slug 由版本、哈希值、uid构成

- 命令

  。。。(不写自己查)

# pnpm

pnpm 将依赖存储在 `~/.pnpm-store` 下，项目安装依赖时从全局的 `store` 检查是否存在对应依赖，存在就创建全局的 `store` 到项目 `node_module/.pnpm` 文件夹的 `硬连接`，`硬连接` 指向磁盘上原始文件所在的 **同一位置** ，再通过 `软连接` 的方式在 `node_module` 下创建 `package.json` 指定的依赖。

```js
node_modules
└─ .pnpm
    └─ ...
└─ react 
```

如上，项目依赖于 react ，上面的 react 是指向 `.pnpm` 的软链接

`.pnpm` 中的每个文件都是来自于公共 `store` 的硬连接，链接到 **真实文件**，每个文件都带着各自 **版本号** ，用于解决 `分身依赖`

- 节省磁盘空间

  采用 pnpm 依赖会被保存在内容可寻址的存储中

- 高效安装依赖

  通过 硬连接 和 软连接 可以更加高效快速的下载依赖包

- 避免幽灵依赖

  使用软连接的方式将项目依赖直接添加进模块文件夹的根目录，包的使用更加可控

## 软链

`pnpm`  利用软连接及包查找规则防止文件路径过长

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53bd1449223f41f38beab289d70bd5d3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

上图查找 react 以及 react 的子依赖的方式如下

1. 项目中引入并使用了 react ，去当前项目目录下的 `node_modules` 下查找 react

2. 找到了 react 后，被软连接链接到 `.pnpm/react` ，接着发现 react 有子依赖 `object-assign` 

3. 去 `.pnpm/react/node_modules` 中找  `object-assign` ，找到 `object-assign` 并被软连接链接到 `.pnpm/object-assign`

4. 如果在当前目录下的 `node_modules` 没有找到，则会一层级一层级的往上查找，直到根目录为止

通过这样的方式有效将 npm 包的长度限制在 `.pnpm/<packageName>@<version>/node_module/<packageName>`的规则

## 硬连

只要我们安装过一次依赖之后，之后再安装一个相同的依赖，都会硬连接到我们的项目中，这样就节省了复制缓存的时间。

存在的缺点就是，对当前这个依赖的修改是同步的，如果我们修改了当前项目中的 `node_modules` 也会影响到其他项目。

## 如何通过硬连找到全局的存储

可以通过 `stat -s 绝对路径` 的方式查找这个文件的 `inode` 索引节点，并且我们可以看到  `st_nlink` 硬连接的数量。

再通过 `find -inum  inode` 的方式来查找这个文件。

## 解决 monorepo hoist

在使用 monorepo 的代码管理模式时，将依赖提升到了项目根目录的 `node_modules` ，并且通过 workspace 的方式依赖项目中的某个 package 。
·
有时候会出现找不到某个模块的问题，因为我们在当前 package 中依赖了某个第三方库，但是并没有在 `package.json`  中声明，但是我们依赖的另一个 package 也依赖了这个三方库并声明了，所以我们可以正常使用这个第三方库。但在上线构建的时候就会报错，因为在编译时会取消 package 的 workspace 状态，变成依据子项目的 `package.json` 从 npm 中拉取依赖。由于这个 package 的 `package.json` 缺少对这个第三方库的声明就会出现模块未找到的问题。

pnpm 原生支持只对特定 `子项目` 安装依赖，同时保持一致的 node_modules 结构，所以只要依赖了某个第三方库就一定要有相应的声明，至于依赖提升及优化的问题由 pnpm 的全新依赖管理机制解决。

# 参考文献

![包管理器的发展史](https://juejin.cn/post/7097906848505806885)