
import { getRandomIntInclusive, UseCase } from '@ournet/domain';
import { HoroscopeSign, HoroscopePeriod } from './utils';
import { Report } from './report';
import { PhraseRepository } from './phrase-repository';
import { ReportRepository } from './report-repository';
import { HoroscopesHelper } from './horoscopes-helper';
import { Phrase } from './phrase';

export type GenerateReportUseCaseParams = {
    lang: string
    period: string
    sign: HoroscopeSign
}

export class GenerateReportUseCase extends UseCase<GenerateReportUseCaseParams, Report, void> {
    constructor(private phraseRep: PhraseRepository, private reportRep: ReportRepository) {
        super()
    }

    async innerExecute(params: GenerateReportUseCaseParams) {
        const id = HoroscopesHelper.createReportId(params.period, params.lang, params.sign);

        const report = await this.reportRep.getById(id);
        if (report) {
            return report;
        }

        return await this.generateReport(params);
    }

    protected async generateReport(params: GenerateReportUseCaseParams, iteration?: number): Promise<Report> {
        iteration = iteration || 0;

        if (iteration > 5) {
            throw new Error(`Cannot generate report for ${params.sign}, ${params.period}`);
        }

        const phrases = await this.selectPhrases(params);
        if (phrases.length === 0) {
            return this.generateReport(params, iteration + 1);
        }

        const ids = phrases.map(item => item.id);
        const textHash = HoroscopesHelper.createReportTextHash(ids);

        if (await this.reportRep.getByTextHash(textHash)) {
            return this.generateReport(params, iteration + 1);
        }

        const report = HoroscopesHelper.buildReport({
            lang: params.lang,
            period: params.period,
            phrasesIds: ids,
            sign: params.sign,
            text: phrases.map(item => item.text).join('\n'),
        });

        return this.reportRep.create(report);
    }

    protected async selectPhrases(params: GenerateReportUseCaseParams) {
        const period = params.period.substr(0, 1) as HoroscopePeriod;
        const options = getOptions(period);
        const limit = getRandomIntInclusive(options.minPhrases, options.maxPhrases);

        let phrases = await this.phraseRep.random({
            lang: params.lang,
            limit,
            period,
            sign: params.sign,
        });

        if (phrases.length !== limit) {
            // logger.error(`Invalid phrases number founded: ${phrases.length}`);
            return [];
        }

        return this.truncatePhrases(phrases, options.maxLength, options.minLength);
    }

    protected truncatePhrases(list: Phrase[], maxLength: number, minLength: number): Phrase[] {
        if (list[0].text.length > minLength) {
            // logger.info('got minLength phrase');
            return list.slice(0, 1);
        }
        const length = list.map(item => {
            return item.text;
        }).join('\n').length;

        if (length > maxLength && list.length > 1) {
            // logger.info('truncate ' + list.length);
            list.pop();
            return this.truncatePhrases(list, maxLength, minLength);
        }
        return list;
    }
}

function getOptions(period: HoroscopePeriod): Options {
    if (period === 'D') {
        return { minPhrases: 2, maxPhrases: 2, maxLength: 600, minLength: 250 }
    }
    if (period === 'W') {
        return { minPhrases: 2, maxPhrases: 5, maxLength: 1200, minLength: 500 }
    }
    throw new Error(`Invalid period: ${period}`);
}

type Options = {
    maxLength: number
    minLength: number
    minPhrases: number
    maxPhrases: number
}
