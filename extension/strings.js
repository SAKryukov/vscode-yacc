/*

Yet Another Change Case

Copyright (c) Sergey A Kryukov
https://github.com/SAKryukov/vscode-yacc
https://www.SAKryukov.org

*/

"use strict";

exports.createStringUtilitySet = definitionSet => {

    const toggleCharacterCase = character => {
        const lower = character.toLowerCase();
        const upper = character.toUpperCase();
        const isLower = lower == character;
        const isUpper = upper == character;
        if (isLower && isUpper)
            return character;
        else
            return isLower ? upper : lower;
    }; //toggleCharacterCase
    
    const toggleCase = text => {
        if (!text) return text;
        const characters = [];
        for (let index = 0; index < text.length; ++index)
            characters.push(toggleCharacterCase(text[index]));
        return characters.join(definitionSet.empty);
    }; //toggleCase
    
    const clearSplit = text => {
        const split = text.split(definitionSet.typography.blankspace);
        const reSplit = [];
        for (const part of split)
            if (part.length > 0) reSplit.push(part);
        return reSplit;
    }; //clearSplit

    const lowerFirstCharacterCase = text =>
        text[0].toLowerCase() + text.substring(1);

    const titleCase = text => {
        const split = clearSplit(text);
        const result = [];
        for (let element of split)
            result.push(element[0].toUpperCase() + element.substring(1).toLowerCase());
        return result.join(definitionSet.typography.blankspace);
    }; //titleCase

    const removeDelimiters = text => {
        return text
            .replaceAll(definitionSet.typography.pathDelimiter, definitionSet.typography.blankspace)
            .replaceAll(definitionSet.typography.dashDelimiter, definitionSet.typography.blankspace)
            .replaceAll(definitionSet.typography.dotDelimiter, definitionSet.typography.blankspace);
    } //removeDelimiters

    return { toggleCase, titleCase, clearSplit, removeDelimiters, lowerFirstCharacterCase, }

};
