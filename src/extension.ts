import * as vscode from 'vscode';
import { toArray } from './utils/toArray';
import { transformImport } from './ast/transformImport';
import { ISnippet } from './snippets';
import { getPathName, saveToOsTemp } from './config/getConfig.js';
import { removeConfig } from './config/removeConfig';

export async function activate(context: vscode.ExtensionContext) {
  try {
    const filePath = await getPathName();
    const snippet = require(filePath) as ISnippet[];

    snippet.forEach((item) => {
      const commandName = `liu-snippets.${item.label}`;
      const disposableSnippet = createSnippet(item, commandName);
      context.subscriptions.push(disposableSnippet);
    });

    // 注册命令，删除 文件配置
    const removeFileCommand = vscode.commands.registerCommand('liu-snippets.removeConfigFile', async () => {
      const confirm = await vscode.window.showQuickPick(['确认删除', '取消'], {
        placeHolder: `确认删除文件：${filePath}?`,
      });
      if (confirm === '确认删除') {
        try {
          removeConfig(filePath);
          vscode.window.showInformationMessage(`文件已成功删除：${filePath}`);
        } catch (error) {
          vscode.window.showErrorMessage(`删除失败：${error}`);
        }
      } else {
        vscode.window.showInformationMessage('操作已取消');
      }
    });

    // 注册命令，打开文件配置更改
    const openFileCommand = vscode.commands.registerCommand('liu-snippets.openConfigFile', async () => {
      // 文件不存在写入
      saveToOsTemp(filePath);
      const document = await vscode.workspace.openTextDocument(filePath);
      vscode.window.showTextDocument(document);
    });

    context.subscriptions.push(removeFileCommand, openFileCommand);

    vscode.window.showInformationMessage('插件已激活🚀🚀🚀');
  } catch {
    vscode.window.showInformationMessage('失败了😭😭😭');
  }
}

export function deactivate() {}

function createSnippet(snippet: ISnippet, _commandName: string) {
  const { kind = vscode.CompletionItemKind.Snippet, scope = '*', label, body, description, prefix, replace } = snippet;

  const prefixArray = toArray(prefix);

  return vscode.languages.registerCompletionItemProvider(
    scope,
    {
      provideCompletionItems(document, position) {
        const completion = new vscode.CompletionItem(label, kind);

        completion.insertText = new vscode.SnippetString(replace ? '' : body);

        completion.documentation = new vscode.MarkdownString(description);

        completion.sortText = label;

        completion.additionalTextEdits = genTextEdits(document, position, snippet);

        return [completion];
      },
    },
    ...prefixArray
  );
}

/** 创建生成 TextEdits */
function genTextEdits(document: vscode.TextDocument, position: vscode.Position, snippet: ISnippet) {
  const textEdits: vscode.TextEdit[] = [];

  const importTextEdits = genImportTextEdits(document, snippet);
  textEdits.push(...importTextEdits);

  const removeTextEdits = genRemoveTextEdits(document, position, snippet);
  textEdits.push(...removeTextEdits);

  const replaceTextEdits = genReplaceTextEdits(document, position, snippet);
  textEdits.push(...replaceTextEdits);

  return textEdits;
}

function genReplaceTextEdits(document: vscode.TextDocument, position: vscode.Position, snippet: ISnippet) {
  if (!snippet?.replace) {
    return [];
  }
  return snippet.replace(document, position, vscode);
}

function genRemoveTextEdits(document: vscode.TextDocument, position: vscode.Position, snippet: ISnippet) {
  if (snippet?.remove !== true) {
    return [];
  }
  const line = document.lineAt(position.line);
  const lineText = line.text;
  const range = new vscode.Range(
    new vscode.Position(position.line, 0), // 行首
    new vscode.Position(position.line, lineText.length) // 行尾
  );

  return [vscode.TextEdit.delete(range)];
}

function genImportTextEdits(document: vscode.TextDocument, snippet: ISnippet) {
  if (!snippet?.import) {
    return [];
  }
  const textEdits: vscode.TextEdit[] = [];
  const importStatements = transformImport(document.getText(), snippet.import);
  importStatements.forEach((item) => {
    if (item.line === -1) {
      textEdits.push(vscode.TextEdit.insert(new vscode.Position(0, 0), item.code));
    } else {
      // 因为使用的时候默认+1，所以先-1
      const currentLine = item.line - 1;
      const line = document.lineAt(currentLine);
      const range = new vscode.Range(
        new vscode.Position(currentLine, 0),
        new vscode.Position(currentLine, line.text.length)
      );

      textEdits.push(vscode.TextEdit.replace(range, item.code));
    }
  });
  return textEdits;
}
