# liu-snippets 说明文档

这是你的扩展 "liu-snippets" 的说明文档。在写下简短描述后，我们建议包括以下几个部分。

## 特性

支持配置代码片段时，在文件顶部 导入 import 语句.

## 使用示例

```js
{
    label: "useRef",
    import: "import { useRef } from 'react';\n",
    prefix: "use",
    body: `$1const ref$2 = useRef();`,
    description: "创建 React 的 useRef.",
    scope: ["typescriptreact", "javascriptreact"],
    kind: vscode.CompletionItemKind.Function,
},
```


