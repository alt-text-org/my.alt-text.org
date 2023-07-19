"use strict";
/*!
 * Copyright (c) 2019 Eddie Antonio Santos
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Yields a series of string indices where a word break should
 * occur. That is, there should be a break BEFORE each string
 * index yielded by this generator.
 *
 * @param text Text to find word boundaries in.
 */
function* findBoundaries(text) {
    // WB1 and WB2: no boundaries if given an empty string.
    if (text.length === 0) {
        // There are no boundaries in an empty string!
        return;
    }
    // This algorithm works by maintaining a sliding window of four SCALAR VALUES.
    //
    //  - Scalar values? JavaScript strings are NOT actually a string of
    //    Unicode code points; some characters are made up of TWO
    //    JavaScript indices. e.g.,
    //        "💩".length === 2;
    //        "💩"[0] === '\uD83D';
    //        "💩"[1] === '\uDCA9';
    //
    //    These characters that are represented by TWO indices are
    //    called "surrogate pairs". Since we don't want to be in the
    //    "middle" of a character, make sure we're always advancing
    //    by scalar values, and NOT indices. That means, we sometimes
    //    need to advance by TWO indices, not just one.
    //  - Four values? Some rules look at what's to the left of
    //    left, and some look at what's to the right of right. So
    //    keep track of this!
    let rightPos;
    let lookaheadPos = 0; // lookahead, one scalar value to the right of right.
    // Before the start of the string is also the start of the string.
    let lookbehind;
    let left = 19 /* sot */;
    let right = 19 /* sot */;
    let lookahead = wordbreakPropertyAt(0);
    // Count RIs to make sure we're not splitting emoji flags:
    let nConsecutiveRegionalIndicators = 0;
    do {
        // Shift all positions, one scalar value to the right.
        rightPos = lookaheadPos;
        lookaheadPos = positionAfter(lookaheadPos);
        // Shift all properties, one scalar value to the right.
        [lookbehind, left, right, lookahead] =
            [left, right, lookahead, wordbreakPropertyAt(lookaheadPos)];
        // Break at the start and end of text, unless the text is empty.
        // WB1: Break at start of text...
        if (left === 19 /* sot */) {
            yield rightPos;
            continue;
        }
        // WB2: Break at the end of text...
        if (right === 20 /* eot */) {
            console.assert(rightPos === text.length);
            yield rightPos;
            break; // Reached the end of the string. We're done!
        }
        // WB3: Do not break within CRLF:
        if (left === 3 /* CR */ && right === 1 /* LF */)
            continue;
        // WB3b: Otherwise, break after...
        if (left === 2 /* Newline */ ||
            left === 3 /* CR */ ||
            left === 1 /* LF */) {
            yield rightPos;
            continue;
        }
        // WB3a: ...and before newlines
        if (right === 2 /* Newline */ ||
            right === 3 /* CR */ ||
            right === 1 /* LF */) {
            yield rightPos;
            continue;
        }
        // HACK: advance by TWO positions to handle tricky emoji
        // combining sequences, that SHOULD be kept together by
        // WB3c, but are prematurely split by WB4:
        if (left === 0 /* Other */ &&
            (right === 14 /* Extend */ || right === 13 /* Format */) &&
            lookahead === 16 /* ZWJ */) {
            // To ensure this is not split, advance TWO positions forward.
            for (let i = 0; i < 2; i++) {
                [rightPos, lookaheadPos] = [lookaheadPos, positionAfter(lookaheadPos)];
            }
            [left, right, lookahead] =
                [lookahead, wordbreakPropertyAt(rightPos), wordbreakPropertyAt(lookaheadPos)];
            // N.B. `left` now MUST be ZWJ, setting it up for WB3c proper.
        }
        // WB3c: Do not break within emoji ZWJ sequences.
        if (left === 16 /* ZWJ */ && isExtendedPictographicAt(rightPos))
            continue;
        // WB3d: Keep horizontal whitespace together
        if (left === 4 /* WSegSpace */ && right == 4 /* WSegSpace */)
            continue;
        // WB4: Ignore format and extend characters
        // This is to keep grapheme clusters together!
        // See: Section 6.2: https://unicode.org/reports/tr29/#Grapheme_Cluster_and_Format_Rules
        // N.B.: The rule about "except after sot, CR, LF, and
        // Newline" already been by WB1, WB2, WB3a, and WB3b above.
        while (right === 13 /* Format */ ||
            right === 14 /* Extend */ ||
            right === 16 /* ZWJ */) {
            // Continue advancing in the string, as if these
            // characters do not exist. DO NOT update left and
            // lookbehind however!
            [rightPos, lookaheadPos] = [lookaheadPos, positionAfter(lookaheadPos)];
            [right, lookahead] = [lookahead, wordbreakPropertyAt(lookaheadPos)];
        }
        // In ignoring the characters in the previous loop, we could
        // have fallen off the end of the string, so end the loop
        // prematurely if that happens!
        if (right === 20 /* eot */) {
            console.assert(rightPos === text.length);
            yield rightPos;
            break;
        }
        // WB4 (continued): Lookahead must ALSO ignore these format,
        // extend, ZWJ characters!
        while (lookahead === 13 /* Format */ ||
            lookahead === 14 /* Extend */ ||
            lookahead === 16 /* ZWJ */) {
            // Continue advancing in the string, as if these
            // characters do not exist. DO NOT update left and right,
            // however!
            lookaheadPos = positionAfter(lookaheadPos);
            lookahead = wordbreakPropertyAt(lookaheadPos);
        }
        // WB5: Do not break between most letters.
        if (isAHLetter(left) && isAHLetter(right))
            continue;
        // Do not break across certain punctuation
        // WB6: (Don't break before apostrophes in contractions)
        if (isAHLetter(left) && isAHLetter(lookahead) &&
            (right === 10 /* MidLetter */ || isMidNumLetQ(right)))
            continue;
        // WB7: (Don't break after apostrophes in contractions)
        if (isAHLetter(lookbehind) && isAHLetter(right) &&
            (left === 10 /* MidLetter */ || isMidNumLetQ(left)))
            continue;
        // WB7a
        if (left === 15 /* Hebrew_Letter */ && right === 6 /* Single_Quote */)
            continue;
        // WB7b
        if (left === 15 /* Hebrew_Letter */ && right === 5 /* Double_Quote */ &&
            lookahead === 15 /* Hebrew_Letter */)
            continue;
        // WB7c
        if (lookbehind === 15 /* Hebrew_Letter */ && left === 5 /* Double_Quote */ &&
            right === 15 /* Hebrew_Letter */)
            continue;
        // Do not break within sequences of digits, or digits adjacent to letters.
        // e.g., "3a" or "A3"
        // WB8
        if (left === 9 /* Numeric */ && right === 9 /* Numeric */)
            continue;
        // WB9
        if (isAHLetter(left) && right === 9 /* Numeric */)
            continue;
        // WB10
        if (left === 9 /* Numeric */ && isAHLetter(right))
            continue;
        // Do not break within sequences, such as 3.2, 3,456.789
        // WB11
        if (lookbehind === 9 /* Numeric */ && right === 9 /* Numeric */ &&
            (left === 7 /* MidNum */ || isMidNumLetQ(left)))
            continue;
        // WB12
        if (left === 9 /* Numeric */ && lookahead === 9 /* Numeric */ &&
            (right === 7 /* MidNum */ || isMidNumLetQ(right)))
            continue;
        // WB13: Do not break between Katakana
        if (left === 17 /* Katakana */ && right === 17 /* Katakana */)
            continue;
        // Do not break from extenders (e.g., U+202F NARROW NO-BREAK SPACE)
        // WB13a
        if ((isAHLetter(left) ||
            left === 9 /* Numeric */ ||
            left === 17 /* Katakana */ ||
            left === 12 /* ExtendNumLet */) &&
            right === 12 /* ExtendNumLet */)
            continue;
        // WB13b
        if ((isAHLetter(right) ||
            right === 9 /* Numeric */ ||
            right === 17 /* Katakana */) && left === 12 /* ExtendNumLet */)
            continue;
        // WB15 & WB16:
        // Do not break within emoji flag sequences. That is, do not break between
        // regional indicator (RI) symbols if there is an odd number of RI
        // characters before the break point.
        if (right === 18 /* Regional_Indicator */) {
            // Emoji flags are actually composed of TWO scalar values, each being a
            // "regional indicator". These indicators correspond to Latin letters. Put
            // two of them together, and they spell out an ISO 3166-1-alpha-2 country
            // code. Since these always come in pairs, NEVER split the pairs! So, if
            // we happen to be inside the middle of an odd numbered of
            // Regional_Indicators, DON'T SPLIT IT!
            nConsecutiveRegionalIndicators += 1;
            if ((nConsecutiveRegionalIndicators % 2) == 1) {
                continue;
            }
        }
        else {
            nConsecutiveRegionalIndicators = 0;
        }
        // WB999: Otherwise, break EVERYWHERE (including around ideographs)
        yield rightPos;
    } while (rightPos < text.length);
    ///// Internal utility functions /////
    /**
     * Returns the position of the start of the next scalar value. This jumps
     * over surrogate pairs.
     *
     * If asked for the character AFTER the end of the string, this always
     * returns the length of the string.
     */
    function positionAfter(pos) {
        if (pos >= text.length) {
            return text.length;
        }
        else if (isStartOfSurrogatePair(text[pos])) {
            return pos + 2;
        }
        return pos + 1;
    }
    /**
     * Return the value of the Word_Break property at the given string index.
     * @param pos position in the text.
     */
    function wordbreakPropertyAt(pos) {
        if (pos < 0) {
            return 19 /* sot */; // Always "start of string" before the string starts!
        }
        else if (pos >= text.length) {
            return 20 /* eot */; // Always "end of string" after the string ends!
        }
        else if (isStartOfSurrogatePair(text[pos])) {
            // Surrogate pairs the next TWO items from the string!
            return property(text[pos] + text[pos + 1]);
        }
        return property(text[pos]);
    }
    function isExtendedPictographicAt(pos) {
        return WordBreakProperty_1.extendedPictographic.test(text.substring(pos, pos + 2));
    }
    // Word_Break rule macros
    // See: https://unicode.org/reports/tr29/#WB_Rule_Macros
    function isAHLetter(prop) {
        return prop === 11 /* ALetter */ ||
            prop === 15 /* Hebrew_Letter */;
    }
    function isMidNumLetQ(prop) {
        return prop === 8 /* MidNumLet */ ||
            prop === 6 /* Single_Quote */;
    }
}
function isStartOfSurrogatePair(character) {
    let codeUnit = character.charCodeAt(0);
    return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
}
/**
 * Return the Word_Break property value for a character.
 * Note that
 * @param character a scalar value
 */
function property(character) {
    // This MUST be a scalar value.
    console.assert(character.length === 1 || character.length === 2);
    // TODO: remove dependence on character.codepointAt()?
    let codepoint = character.codePointAt(0);
    return searchForProperty(codepoint, 0, WordBreakProperty_1.WORD_BREAK_PROPERTY.length - 1);
}
/**
 * Binary search for the word break property of a given CODE POINT.
 */
function searchForProperty(codePoint, left, right) {
    // All items that are not found in the array are assigned the 'Other' property.
    if (right < left) {
        return 0 /* Other */;
    }
    let midpoint = left + ~~((right - left) / 2);
    let candidate = WordBreakProperty_1.WORD_BREAK_PROPERTY[midpoint];
    let nextRange = WordBreakProperty_1.WORD_BREAK_PROPERTY[midpoint + 1];
    let startOfNextRange = nextRange ? nextRange[0 /* Start */] : Infinity;
    if (codePoint < candidate[0 /* Start */]) {
        return searchForProperty(codePoint, left, midpoint - 1);
    }
    else if (codePoint >= startOfNextRange) {
        return searchForProperty(codePoint, midpoint + 1, right);
    }
    // We found it!
    console.assert(candidate[0 /* Start */] <= codePoint);
    console.assert(codePoint < startOfNextRange);
    return candidate[1 /* Value */];
}
//# sourceMappingURL=findBoundaries.js.map