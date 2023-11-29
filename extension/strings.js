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
        text.length > 0 ? text[0].toLowerCase() + text.substring(1) : text;

    const forEachLine = (text, converter) => {
        const split = text.split(definitionSet.typography.lineSeparator);
        const result = [];
        for (let element of split)
            result.push(converter(element.trim()))
        return result.join(definitionSet.typography.lineSeparator);
    }; //forEachLine

    const titleCaseLine = line => {
        const split = clearSplit(line);
        const result = [];
        for (let element of split)
            result.push(element[0].toUpperCase() + element.substring(1).toLowerCase());
        return result.join(definitionSet.typography.blankspace);
    } //titleCaseLine

    const titleCase = text => forEachLine(text, line => titleCaseLine(line));

    const camelCase = text => forEachLine(text, line => 
        lowerFirstCharacterCase(titleCaseLine(line))
        .replaceAll(definitionSet.typography.blankspace, definitionSet.empty));

    const programmingSyntax = (text, punctuation) => forEachLine(text, line =>
        clearSplit(line).join(punctuation));
    
    const removePunctuation = text => {
        return text
            .replaceAll(definitionSet.typography.dotSeparator, definitionSet.typography.blankspace)
            .replaceAll(definitionSet.typography.pathSeparator, definitionSet.typography.blankspace)
            .replaceAll(definitionSet.typography.dashSeparator, definitionSet.typography.blankspace)
            .replaceAll(definitionSet.typography.underscoreSeparator, definitionSet.typography.blankspace);
    } //removePunctuation

    return { titleCase, camelCase, toggleCase, programmingSyntax, removePunctuation, };

};
