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

    const optionalRouteSegments = link.match(/\(\/[a-z\-]*\)\?/g);

    const configs = vscode.workspace.getConfiguration('urlify-me');

    const baseUrls: string[] = configs.get('baseUrls') || [];

    const baseUrl = await vscode.window.showQuickPick(baseUrls, {
      canPickMany: false,
      ignoreFocusOut: true,
    });

    if (!baseUrl) {return;}

    link = baseUrl + link;

    if (routeVariables) {

      for await (const variable of routeVariables) {
        const initialValue:string|undefined = context.globalState.get(variable);
        const val = await vscode.window.showInputBox({
          ignoreFocusOut: true,
          prompt: `What would you like to use for ${variable}?`,
          value: initialValue,
        });
        if (val) {
          link = link.replace(variable, val);
          context.globalState.update(variable, val);
        } else {
          return;
        }
      };
      
    }
    
    if (optionalRouteSegments) {
      for await (const variable of optionalRouteSegments) {
        const normalizedVariable = variable.replace(/\(|\)|\?/g, '');
        const yesAnswer = `Use ${normalizedVariable} in route`;
        const yesNo = [yesAnswer, `Don't use ${normalizedVariable} in route`];
        
        const useOptionalRouteSegment = await vscode.window.showQuickPick(yesNo, {
          canPickMany: false,
          ignoreFocusOut: true,

        });

        if (typeof useOptionalRouteSegment === 'undefined') {return;}

        if (useOptionalRouteSegment === yesAnswer) {
          link = link.replace(variable, normalizedVariable);
        } else {
          link = link.replace(variable, '');

        }

      };

    }
    
    const newLocal = Uri.parse(link);

    env.openExternal(newLocal);

  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (disposables) {
    disposables.forEach((item) => item.dispose());
  }
  disposables = [];
}
