"use strict";

const vscode = require("vscode");
const definitionSet = require("./definitionSet").definitionSet;
const commands = require("./commands");

exports.activate = context => {

    let commandMap;
    const updateVisibility = () => {
        vscode.commands.executeCommand(
            definitionSet.commands.setContext,
            definitionSet.commands.changeCaseVisibilityKey,
            vscode.window.activeTextEditor != null);
        vscode.commands.executeCommand(
                definitionSet.commands.setContext,
                definitionSet.commands.changeCaseAgainVisibilityKey,
                vscode.window.activeTextEditor != null && commandMap.canRepeat);
    }; //updateVisibility
    commandMap = new commands.commandMap(definitionSet, vscode, updateVisibility);
    updateVisibility();

    context.subscriptions.push(vscode.commands.registerTextEditorCommand(
        definitionSet.commands.changeCase,
        (textEditor, edit) => {
            textEditor.selections.forEach(selection => {
                const originText = textEditor.document.getText(selection);
                commandMap.command(textEditor, selection, originText);
            });
        }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand(
        definitionSet.commands.changeCaseAgain,
        (textEditor, edit) => {
            textEditor.selections.forEach(selection => {
                const originText = textEditor.document.getText(selection);
                commandMap.repeatCommand(textEditor, selection, originText);
            });
        }));

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(document => 
        updateVisibility()));

}; //exports.activate

exports.deactivate = () => { };
