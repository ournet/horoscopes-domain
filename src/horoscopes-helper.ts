import { HoroscopeSign, isLetter, isDigit, standardText, HoroscopePeriod, zeroPad } from "./utils";
import { BuildReportParams, Report } from "./report";
import { md5, atonic, Dictionary, getWeekNumber } from "@ournet/domain";
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
            textHash: md5(params.phrasesIds.sort().join(',')),
            length: text.length,
            period: params.period,
            phrasesIds: params.phrasesIds,
            sign: params.sign,
            expiresAt: 1,
        }

        let ms = createdDate.getTime();

        switch (params.period) {
            case 'D':
                ms += 1000 * 86400 * 1;
                break;
            case 'W':
                ms += 1000 * 86400 * 14;
                break;
            case 'M':
                ms += 1000 * 86400 * 32;
                break;
            case 'Y':
                ms += 1000 * 86400 * 366;
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
}
