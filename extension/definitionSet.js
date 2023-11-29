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
        targetClipboard: `Target: ${String.fromCodePoint(0x2610)} clipboard `, //Ballot Box
        targetEditor: `Target: ${String.fromCodePoint(0x2611)} clipboard`, ////Ballot Box with Check
    },
    typography: {
        blankspace: " ",
        dotDelimiter: ".",
        pathDelimiter: "/",
        dashDelimiter: "-",
    },
    empty: "",
};
