import { HoroscopeSign } from "./utils";

export interface Report {
    id: string
    text: string
    period: string
    sign: HoroscopeSign
    phrasesIds: string[]
    lang: string
    length: number
    textHash: string
    numbers: number[]
    stats: ReportStats
    createdAt: string
    expiresAt: number
}

export type ReportStats = {
    success: number
    love: number
    health: number
}

export interface BuildReportParams {
    text: string
    period: string
    sign: HoroscopeSign
    lang: string
    phrasesIds: string[]
    createdAt?: string
}
