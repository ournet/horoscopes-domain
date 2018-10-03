const ellipsize = require('ellipsize');
const standardTextFn = require('standard-text');

export type HoroscopeSign = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type HoroscopePeriod = 'D' | 'W' | 'M' | 'Y';

export function standardText(text: string, lang: string): string {
    return standardTextFn(text, lang);
}

export function truncateAt(text: string, maxLength: number): string {
    return ellipsize(text, maxLength, { truncate: false });
}

export function isLetter(target: string) {
    return target.toUpperCase() !== target.toLowerCase();
}

export function isDigit(target: string) {
    return /^\d+$/.test(target);
}

export function zeroPad(num: number, places: number) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}