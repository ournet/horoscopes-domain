import { HoroscopeSign, isLetter, isDigit, standardText, HoroscopePeriod, zeroPad } from "./utils";
import { BuildReportParams, Report, ReportStats } from "./report";
import { md5, atonic, Dictionary, getWeekNumber, getRandomInt } from "@ournet/domain";
import { PhraseBuildParams, Phrase } from "./phrase";

const SIGN_NAMES: Dictionary<Dictionary<HoroscopeSignName>> = require('../sign-names.json');

export type HoroscopeSignName = {
    slug: string
    name: string
}

export class HoroscopesHelper {

    static getSignName(id: HoroscopeSign, lang: string): HoroscopeSignName | undefined {
        return SIGN_NAMES[id.toString()] && SIGN_NAMES[id.toString()][lang];
    }

    static createReportId(period: string, lang: string, sign: HoroscopeSign) {
        return [period.toUpperCase(), lang.toUpperCase().trim(), sign.toString()].join('');
    }

    static createReportPeriod(period: HoroscopePeriod, target: Date) {
        let value = period.toUpperCase() + target.getUTCFullYear();

        const month = zeroPad(target.getUTCMonth() + 1, 2);
        const week = zeroPad(getWeekNumber(target), 2);
        const day = zeroPad(target.getUTCDate(), 2);

        if (period === 'M') {
            value += month;
        } else if (period === 'W') {
            value += month;
            value += week;
        }
        else if (period === 'D') {
            value += month;
            value += day;
        }

        return value;
    }

    static buildReport(params: BuildReportParams) {

        const text = params.text.trim();
        const lang = params.lang.trim().toLowerCase();
        const createdDate = new Date(params.createdAt || Date.now());

        const report: Report = {
            id: HoroscopesHelper.createReportId(params.period, lang, params.sign),
            text,
            lang,
            createdAt: createdDate.toISOString(),
            textHash: HoroscopesHelper.createReportTextHash(params.phrasesIds),
            length: text.length,
            period: params.period,
            phrasesIds: params.phrasesIds,
            sign: params.sign,
            expiresAt: 1,
            numbers: HoroscopesHelper.generateNumbers(6),
            stats: HoroscopesHelper.generateStats(),
        }

        let ms = createdDate.getTime();

        switch (params.period.substr(0, 1)) {
            case 'D':
                ms += 1000 * 86400 * 1 * 2;
                break;
            case 'W':
                ms += 1000 * 86400 * 7 * 2;
                break;
            case 'M':
                ms += 1000 * 86400 * 31 * 2;
                break;
            case 'Y':
                ms += 1000 * 86400 * 366 * 2;
                break;
        }

        report.expiresAt = Math.floor(ms / 1000);

        return report;
    }

    static buildPhrase(params: PhraseBuildParams) {
        const text = HoroscopesHelper.normalizePhraseText(params.text, params.lang);
        const phrase: Phrase = {
            id: HoroscopesHelper.createPhraseId(text),
            lang: params.lang.trim().toLowerCase(),
            length: text.length,
            period: params.period,
            sign: params.sign,
            source: params.source.trim(),
            text,
            createdAt: params.createAt || new Date().toISOString(),
        };

        return phrase;
    }

    static createReportTextHash(phrasesIds: string[]) {
        return md5(phrasesIds.sort().join(','));
    }

    static createPhraseId(text: string) {
        text = text.split('').filter(item => {
            return item === ' ' || isLetter(item) || isDigit(item);
        }).join('');

        text = atonic(text);

        return md5([text.trim().toLowerCase()].join('|'));
    }

    static normalizePhraseText(text: string, lang: string) {

        text = text.trim()
            .replace(/[\r]/g, '')
            .replace(/\n\s+/g, '\n')
            .replace(/\s+\n/g, '\n')
            .replace(/ {2,}/g, ' ');

        text = standardText(text, lang.toLowerCase());

        return text;
    }

    static generateNumbers(count: number) {
        const numbers = [];
        for (var i = 0; i < count; i++) {
            let number;
            do {
                number = getRandomInt(1, 50);
            } while (numbers.indexOf(number) > -1)
            numbers.push(number);
        }

        return numbers;
    }

    static generateStats() {
        const validNumbers = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
        const stats: ReportStats = {
            health: getRandomInt(0, validNumbers.length - 1),
            love: getRandomInt(0, validNumbers.length - 1),
            success: getRandomInt(0, validNumbers.length - 1),
        };

        stats.health = validNumbers[stats.health];
        stats.love = validNumbers[stats.love];
        stats.success = validNumbers[stats.success];

        return stats;
    }
}
