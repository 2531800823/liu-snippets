import * as vscode from "vscode";

export interface ISnippet {
  label: string;
  import?: string;
  prefix: string;
  body: string;
  description: string;
  scope: string[];
  kind: vscode.CompletionItemKind;
}

export const snippets = [
  {
    label: "useRef",
    import: "import { useRef } from 'react';\n",
    prefix: "use",
    body: `$1const ref$2 = useRef();`,
    description: "创建 React 的 useRef.",
    scope: ["typescriptreact", "javascriptreact"],
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: "useState",
    import: "import { useState } from 'react';\n",
    prefix: "use",
    body: `const [state$1, set$1] = useState();`,
    description: "创建 React 的 useState.",
    scope: ["typescriptreact", "javascriptreact"],
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: "useEffect",
    import: "import { useEffect } from 'react';\n",
    prefix: "use",
    body: `useEffect(() => {
		$1
	}, []);`,
    description: "创建 React 的 useEffect.",
    scope: ["typescriptreact", "javascriptreact"],
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: "useSelector",
    import: "import {useSelector} from '@/hooks/useSelector';\n",
    prefix: "usr",
    body: `useSelector([$1])`,
    description: "useSelector.",
    scope: ["typescript", "typescriptreact", "javascript", "javascriptreact"],
    kind: vscode.CompletionItemKind.Function,
  },
];
