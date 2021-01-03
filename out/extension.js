"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const vscode = require("vscode");
const CodelensProvider_1 = require("./CodelensProvider");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let disposables = [];
function activate(context) {
    console.log('Congratulations, your extension "urlify-me" is now active!');
    const codelensProvider = new CodelensProvider_1.CodelensProvider();
    vscode_1.languages.registerCodeLensProvider("*", codelensProvider);
    vscode_1.commands.registerCommand("urlify-me.enableCodeLens", () => {
        vscode_1.workspace
            .getConfiguration("urlify-me")
            .update("enableCodeLens", true, true);
    });
    vscode_1.commands.registerCommand("urlify-me.disableCodeLens", () => {
        vscode_1.workspace
            .getConfiguration("urlify-me")
            .update("enableCodeLens", false, true);
    });
    vscode_1.commands.registerCommand("urlify-me.codelensAction", (args) => __awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        let link = args;
        const routeVariables = link.match(/:\w+/g);
        if (routeVariables) {
            try {
                for (var routeVariables_1 = __asyncValues(routeVariables), routeVariables_1_1; routeVariables_1_1 = yield routeVariables_1.next(), !routeVariables_1_1.done;) {
                    const variable = routeVariables_1_1.value;
                    const val = yield vscode.window.showInputBox({
                        ignoreFocusOut: true,
                        prompt: `What would you like to use for ${variable}?`,
                    });
                    if (val) {
                        link = link.replace(variable, val);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (routeVariables_1_1 && !routeVariables_1_1.done && (_a = routeVariables_1.return)) yield _a.call(routeVariables_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            ;
        }
        const newLocal = vscode_1.Uri.parse(link);
        const res = yield vscode_1.env.openExternal(newLocal);
        vscode_1.window.showInformationMessage(`CodeLens Test action clicked with args=${args}`);
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    if (disposables) {
        disposables.forEach((item) => item.dispose());
    }
    disposables = [];
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map