import * as vscode from "vscode";
import { ISnippet, snippets } from "./snippets";

export function activate(context: vscode.ExtensionContext) {
  snippets.forEach((item) => {
    const commandName = `liu-snippets.${item.label}`;
    const disposableCommand = createCommand(item, commandName);
    const disposableSnippet = createSnippet(item, commandName);
    disposableCommand && context.subscriptions.push(disposableCommand);
    context.subscriptions.push(disposableSnippet);
  });

  vscode.window.showInformationMessage("插件已激活🚀🚀🚀");
}

export function deactivate() {}

function createCommand(snippet: ISnippet, commandName: string) {
  if (!snippet.import) {
    return;
  }

  return vscode.commands.registerCommand(commandName, () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("不在编辑器中");
        return;
      }
      const document = editor.document;

      editor
        .edit((editBuilder) => {
          const topPosition = new vscode.Position(0, 0);
          editBuilder.insert(topPosition, snippet.import!);
          return;
        })
        .then(() => {
          vscode.window.showInformationMessage("代码已插入顶部！");
        });
    } catch (e: any) {
      vscode.window.showErrorMessage(
        "Error during AST transformation: " + e.message
      );
    }
  });
}

function createSnippet(snippet: ISnippet, commandName: string) {
  const {
    kind = vscode.CompletionItemKind.Snippet,
    scope = "*",
    label,
    body,
    description,
    prefix,
  } = snippet;

  return vscode.languages.registerCompletionItemProvider(
    scope,
    {
      provideCompletionItems() {
        const completion = new vscode.CompletionItem(label, kind);

        completion.insertText = new vscode.SnippetString(body);

        completion.documentation = new vscode.MarkdownString(description);

        completion.sortText = "a";

        completion.command = {
          command: commandName,
          title: label,
        };
        return [completion];
      },
    },
    prefix
  );
}
