# ibird-i18n

国际化插件。

## 安装

```sh
npm install ibird-i18n
```

## 引用

```js
const app = require('ibird').newApp();
const logger = require('ibird-i18n');

app.import(logger);
```

## 配置示例

国际化配置本质上是`JSON`结构，其中`key`为占位符，`value`为不同语言环境下的显示值；多个语言环境即是存在多份相同`key`的配置文件，例如`en_US.json`：

```json
{
  "locale": "English",
  "app": "ibird",
  "author": "Daniel Yin",
  "license": "Apache-2.0",
  "home": "http://ibird.yinfxs.com",
  "repository": "https://github.com/yinfxs/ibird.git"
}
```

其中`locale`是个特别的`key`，它表示语言环境名称，一般即为对应语言的本地化翻译。

## 插件信息

- **命名空间** - ibird-i18n
- **引用参数**
  - `locales` - 可选，对象类型，国际化配置对象，`key`为语言环境编码，`value`为对应的国际化配置
  - `defaultLocale` - 可选，默认语言环境编码
  - `dir` - 可选，字符串类型，国际化资源文件所在目录，指定后，该目录下所有文件都会被自动注册为国际化配置，且以文件名作为语言编码
- **API**
  - `enabledLocale` - 对象类型，表示当前默认启用的语言环境，共包含`name`（语言编码）和`locale`（国际化配置）两个信息
  - `addLocale(name, locale)` - 新增国际化配置函数，需传递两个参数：`name`（语言编码）和`locale`（国际化配置）
  - `addLocaleDir(dir)` - 新增国际化配置目录
  - `switchLocale(name)` - 切换默认语言环境，需指定语言编码作为参数
  - `removeLocale(name)` - 删除指定的语言环境，需指定语言编码作为参数
  - `clearLocale()` - 清空所有语言配置
  - `getLocale(name)` - 根据语言编码，获取对应的国际化配置
  - `getLocaleList()` - 获取已注册的所有国际化配置列表
  - `getLocaleString(key, params, localeOrName)` - 常用API，获取指定占位符在指定语言环境下的国际化显示值，支持模板渲染
- **路由**
  - 根据语言编码查询对应的国际化配置接口：
    - name - `i18n_name`
    - method - `GET`
    - path - `/i18n/:name`
  - 切换默认国际化配置接口：
    - name - `i18n_switch`
    - method - `GET`
    - path - `/i18n/:name/switch`
  - 国际化列表查询接口：
    - name - `i18n_list`
    - method - `GET`
    - path - `/i18n`

## 模板渲染

在实际应用中，我们的国际化显示信息有时候不是固定值，例如以下国际化配置：

`en_US.json`：

```json
{
  ...
  "login_error": "Username {{login_user}} login failed.",
  ...
}
```

`zh_CN.json`：

```json
{
  ...
  "login_error": "抱歉，账号 {{login_user}} 登录失败，请稍后重试~",
  ...
}
```

这里的`login_user`即为动态值，是需要在使用该国际化占位符时才传递过来的信息，例如：

```js
app.getLocaleString('login_error', { login_user: 'admin' }, 'en_US')
// return: Username admin login failed.

app.getLocaleString('login_error', { login_user: 'admin' }, 'zh_CN')
// return: 抱歉，账号 admin 登录失败，请稍后重试~
```

模板渲染底层引擎为[mustache.js](https://www.npmjs.com/package/mustache)。