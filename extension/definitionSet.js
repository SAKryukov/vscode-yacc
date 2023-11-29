/*

Yet Another Change Case

Copyright (c) Sergey A Kryukov
https://github.com/SAKryukov/vscode-yacc
https://www.SAKryukov.org

*/

"use strict";

exports.definitionSet = {
    commands: { // should be in sync with json com
        changeCase: "yacc.change.case",
        changeCaseAgain: "yacc.change.case.again",
        changeCaseVisibilityKey: "yacc.change.case.visible",
        changeCaseAgainVisibilityKey: "yacc.change.case.again.visible",
        setContext: "setContext",
    },
    volatileCommands: {
        repeatCommandTitle: "Repeat last operation",
        commandSelectionTitle: "Select Change Case Operation",
        targetClipboard: `${String.fromCodePoint(0x2610)} Clipboard `, //Ballot Box
        targetEditor: `${String.fromCodePoint(0x2611)} Clipboard`, ////Ballot Box with Check
    },
    typography: {
        blankspace: " ",
        dotDelimiter: ".",
        pathDelimiter: "/",
        dashDelimiter: "-",
        underscoreDelimiter: "_",
    },
    empty: "",
};
