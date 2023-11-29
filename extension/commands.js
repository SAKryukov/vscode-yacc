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

    map.set("Lower case", text => text.toLowerCase());
    map.set("Upper case", text => text.toUpperCase());
    map.set("Title case", text => stringUtilitySet.titleCase(text));
    map.set("Camel case", text =>
        stringUtilitySet.lowerFirstCharacterCase(stringUtilitySet.titleCase(text))
        .replaceAll(definitionSet.typography.blankspace, definitionSet.empty));
    map.set("Members", text => stringUtilitySet.clearSplit(text).join(definitionSet.typography.dotDelimiter));
    map.set("Path", text => stringUtilitySet.clearSplit(text).join(definitionSet.typography.pathDelimiter));
    map.set("Dashes", text => stringUtilitySet.clearSplit(text).join(definitionSet.typography.dashDelimiter));
    map.set("Remove delimiters", text => stringUtilitySet.removeDelimiters(text));
    map.set("Toggle case", text => stringUtilitySet.toggleCase(text));
    map.set(definitionSet.volatileCommands.targetClipboard, () => setTargetToClipboard(true));
    map.set(definitionSet.volatileCommands.targetEditor, () => setTargetToClipboard(false));

    const getPick = () => {
        const options = [];
        if (lastCommand != null) 
            options.push(repeatCommandName);
        map.forEach((_, key) => {
            let doUseIt = true;
            if (key == definitionSet.volatileCommands.targetClipboard && targetIsClipboard) doUseIt = false;
            if (key == definitionSet.volatileCommands.targetEditor && !targetIsClipboard) doUseIt = false;
            if (doUseIt)
                options.push(key);
        });
        return options;
    }; //getPick

    this.command = (textEditor, selection, originalText) => {
        const options = getPick();
        vscode.window.showQuickPick(options, {
        placeHolder: definitionSet.volatileCommands.commandSelectionTitle,
        }).then(answer => {
            if (!answer) return;
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
