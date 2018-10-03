import {
    RepositoryAccessOptions,
    Repository,
} from '@ournet/domain';
import { Phrase } from './phrase';
import { HoroscopeSign, HoroscopePeriod } from './utils';

export interface RandomPhrasesQueryParams {
    lang: string
    limit: number
    sign: HoroscopeSign
    period: HoroscopePeriod
}

export interface PhraseRepository extends Repository<Phrase> {
    random(params: RandomPhrasesQueryParams, options?: RepositoryAccessOptions<Phrase>): Promise<Phrase[]>
}
