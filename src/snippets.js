// vs code kind Function
const kindFunction = 2;

const snippets = [
  {
    label: 'useRef',
    import: "import { useRef } from 'react';\n",
    prefix: ['use', 'useRef'],
    body: `const ref$1 = useRef();`,
    description: '创建 React 的 useRef.',
    scope: ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    kind: kindFunction,
  },
  {
    label: 'useState',
    import: "import { useState } from 'react';\n",
    prefix: ['use', 'useState'],
    body: `const [state$1, set$1] = useState();`,
    description: '创建 React 的 useState.',
    scope: ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    kind: kindFunction,
  },
  {
    label: 'useMemo',
    import: "import { useMemo } from 'react';\n",
    prefix: ['use', 'useMemo'],
    body: `useMemo(()=>{$1},[]);`,
    description: '创建 React 的 useMemo.',
    scope: ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    kind: kindFunction,
  },
  {
    label: 'useEffect',
    import: "import { useEffect } from 'react';\n",
    prefix: ['use', 'useEffect'],
    body: `useEffect(() => {
          $1
      }, []);`,
    description: '创建 React 的 useEffect.',
    scope: ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    kind: kindFunction,
  },
  {
    label: 'useSelector',
    import: "import {useSelector} from '@/hooks/useSelector';\n",
    prefix: ['usr', 'useSelector'],
    body: `useSelector([$1])`,
    description: 'useSelector.',
    scope: ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    kind: kindFunction,
  },
  {
    label: 'className',
    prefix: ['cls', 'className'],
    body: `className={s.$1}`,
    description: '快速生成 className.',
    scope: ['typescriptreact', 'javascriptreact'],
    kind: kindFunction,
    remove: false,
  },
  {
    label: 'classnames',
    prefix: ['cls', 'classnames'],
    import: "import classNames from 'classnames';\n",
    body: `className={classNames(s.$1)}`,
    description: '快速插件 classnames',
    scope: ['typescriptreact', 'javascriptreact'],
    kind: kindFunction,
    remove: false,
  },
  {
    label: 'toclassnames',
    prefix: ['tocls', 'toclassnames'],
    import: "import classNames from 'classnames';\n",
    body: ``,
    description: '转换 className 为 插件',
    scope: ['typescriptreact', 'javascriptreact'],
    kind: kindFunction,
    replace: (document, position, vscode) => {
      const line = document.lineAt(position.line);
      const text = line.text;
      const regex = /className={(\w+)\.(\w+)}/g;

      // 替换逻辑，将 className={styles.xxx} 替换为 className={classNames(styles.xxx)}
      const outputCode = text.replace(regex, (match, p1, p2) => {
        return `className={classNames(${p1}.${p2})}`;
      });

      const lineText = line.text;
      const range = new vscode.Range(
        new vscode.Position(position.line, 0), // 行首
        new vscode.Position(position.line, lineText.length) // 行尾
      );

      return [vscode.TextEdit.replace(range, outputCode)];
    },
  },
];

module.exports = snippets;
