/*

Yet Another Change Case

Copyright (c) Sergey A Kryukov
https://github.com/SAKryukov/vscode-yacc
https://www.SAKryukov.org

*/

"use strict";

exports.commandMap = function (definitionSet, vscode, visibilityUpdater) {

    const stringUtilitySet = require("./strings").createStringUtilitySet(definitionSet);

    let lastCommand = null, targetIsClipboard = false;

    const repeatCommandName = definitionSet.volatileCommands.repeatCommandTitle;   
    const map = new Map();

    const setTargetToClipboard = toClipboard => targetIsClipboard = toClipboard;

    map.set("Case", { label: "Case", kind: vscode.QuickPickItemKind.Separator, })
    map.set("Lower case", text => text.toLowerCase())
    map.set("Upper case", text => text.toUpperCase());
    map.set("Title case", text => stringUtilitySet.titleCase(text));
    map.set("Camel case", text =>
        stringUtilitySet.lowerFirstCharacterCase(stringUtilitySet.titleCase(text))
        .replaceAll(definitionSet.typography.blankspace, definitionSet.empty));
    map.set("ToggleSeparator", { label: "Toggle case", kind: vscode.QuickPickItemKind.Separator, })
    map.set("Toggle", text => stringUtilitySet.toggleCase(text));
    map.set("Programming ", { label: "Programming syntax", kind: vscode.QuickPickItemKind.Separator, })
    map.set("Members", text => stringUtilitySet.clearSplit(text).join(definitionSet.typography.dotDelimiter));
    map.set("Kebab case", text => stringUtilitySet.clearSplit(text).join(definitionSet.typography.dashDelimiter));
    map.set("Snake case", text => stringUtilitySet.clearSplit(text).join(definitionSet.typography.underscoreDelimiter));
    map.set("Path", text => stringUtilitySet.clearSplit(text).join(definitionSet.typography.pathDelimiter));
    map.set("Remove punctuation", text => stringUtilitySet.removeDelimiters(text));
    map.set("Where?", { label: "Where the result goes, editor or clipboard?", kind: vscode.QuickPickItemKind.Separator, })    
    map.set(definitionSet.volatileCommands.targetClipboard, () => setTargetToClipboard(true));
    map.set(definitionSet.volatileCommands.targetEditor, () => setTargetToClipboard(false));

    const getPick = () => {
        const options = [];
        if (lastCommand != null) 
            options.push(repeatCommandName);
        map.forEach((value, key) => {
            if (value.constructor == Function) {
                if ((key == definitionSet.volatileCommands.targetClipboard && targetIsClipboard) ||
                    (key == definitionSet.volatileCommands.targetEditor && !targetIsClipboard))
                    return;
                options.push(key);
            } else
                options.push(value);
        });
        return options;
    }; //getPick

    this.command = (textEditor, selection, originalText) => {
        /*
        const quickPick = vscode.window.createQuickPick();
        quickPick.title = "select this and that";
        quickPick.placeHolder = "Bl";
        quickPick.canSelectMany = true;
        const items = [
            { label: "Cases", kind: vscode.QuickPickItemKind.Separator, },
            { label: "Upper case" },
            { label: "Lower case"},
            { label: "Blue", description: "Primary color" },
            { label: "Super!" },
            { label: "Programming", kind: vscode.QuickPickItemKind.Separator, },
            { label: "1", description: "case 1" },
            { label: "2", description: "case 2" },
        ];
        quickPick.items = items;
        quickPick.selectedItems = [ items[3], items[2] ];
        quickPick.show();
        return;
        */
        const options = getPick();
        vscode.window.showQuickPick(options, {
            placeHolder: definitionSet.volatileCommands.commandSelectionTitle,
            //canPickMany: true
        }).then(answer => {
            if (!answer) return;
            //answer = answer.label;
            const toggleTarget =
                answer == definitionSet.volatileCommands.targetClipboard ||
                answer == definitionSet.volatileCommands.targetEditor
            let command;
            if (answer != repeatCommandName) {
                command = map.get(answer);
                if (!toggleTarget)
                    lastCommand = command;
            } else
                command = lastCommand;            
            if (!toggleTarget) {
                if (targetIsClipboard)
                    vscode.env.clipboard.writeText(command(originalText));
                else
                    textEditor.edit(builder => builder.replace(selection, command(originalText)));
                } else
                    command();
            if (visibilityUpdater)
                visibilityUpdater();
        });    
    }; //this.command

    this.repeatCommand = (textEditor, selection, originalText) => {
        if (lastCommand == null) return;
        textEditor.edit(builder =>
            builder.replace(selection, lastCommand(originalText)));
    }; //this.repeatCommand

    Object.defineProperties(this, {
        canRepeat: {
            get: () => lastCommand != null
        }
    });

};
