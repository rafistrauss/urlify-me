// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  ExtensionContext,
  languages,
  commands,
  Disposable,
  workspace,
  window,
  env,
  Uri,
} from "vscode";

import * as vscode from "vscode";

import { CodelensProvider } from "./CodelensProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "urlify-me" is now active!');

  const codelensProvider = new CodelensProvider();

  languages.registerCodeLensProvider("*", codelensProvider);

  commands.registerCommand("urlify-me.enableCodeLens", () => {
    workspace
      .getConfiguration("urlify-me")
      .update("enableCodeLens", true, true);
  });

  commands.registerCommand("urlify-me.disableCodeLens", () => {
    workspace
      .getConfiguration("urlify-me")
      .update("enableCodeLens", false, true);
  });

  commands.registerCommand("urlify-me.codelensAction", async (args: string) => {
    let link = args;

    const routeVariables = link.match(/:\w+/g);

    if (routeVariables) {

      for await (const variable of routeVariables) {
        const val = await vscode.window.showInputBox({
          ignoreFocusOut: true,
          prompt: `What would you like to use for ${variable}?`,
        });
        if (val) {
          link = link.replace(variable, val);
        }
      };

    }
    
    const newLocal = Uri.parse(link);

    const res = await env.openExternal(newLocal);

    window.showInformationMessage(
      `CodeLens Test action clicked with args=${args}`
    );
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (disposables) {
    disposables.forEach((item) => item.dispose());
  }
  disposables = [];
}
