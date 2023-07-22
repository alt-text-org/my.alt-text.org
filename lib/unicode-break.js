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
// See: https://unicode.org/reports/tr29/#Default_Word_Boundaries
/**
 * Splits text by its word breaks. Any spans that are composed entirely of
 * whitespace will not be returned. Returns an array of strings.
 *
 * @param text Any valid USVString with words to split.
 */
function split(text) {
    let spans = Array.from(findSpans(text));
    return spans.map(span => span.text).filter(isNonSpace);
}
/**
 * Generator that yields every successive span from the the text.
 * @param text Any valid USVString to segment.
 */
function* findSpans(text) {
    // TODO: don't throw the boundaries into an array.
    let boundaries = Array.from(findBoundaries(text));
    if (boundaries.length === 0) {
        return;
    }
    // All non-empty strings have at least TWO boundaries at the start and end of
    // the string.
    console.assert(boundaries.length >= 2);
    for (let i = 0; i < boundaries.length - 1; i++) {
        let start = boundaries[i];
        let end = boundaries[i + 1];
        yield new LazySpan(text, start, end);
    }
}

const splitter = {
    split,
    findSpans
}

/**
 * A span that does not cut out the substring until it absolutely has to!
 */
class LazySpan {
    constructor(source, start, end) {
        this._source = source;
        this.start = start;
        this.end = end;
    }
    get text() {
        return this._source.substring(this.start, this.end);
    }
    get length() {
        return this.end - this.start;
    }
}
/**
 * Returns true when the chunk does not solely consiste of whitespace.
 *
 * @param chunk a chunk of text. Starts and ends at word boundaries.
 */
function isNonSpace(chunk) {
    return !Array.from(chunk).map(property).every(wb => (wb === 3 /* CR */ ||
        wb === 1 /* LF */ ||
        wb === 2 /* Newline */ ||
        wb === 4 /* WSegSpace */));
}
//# sourceMappingURL=index.js.map