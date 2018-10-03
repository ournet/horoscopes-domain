
import { REPORT_TEXT_MIN_LENGTH, REPORT_TEXT_MAX_LENGTH } from "./config";
import { JoiEntityValidator } from "@ournet/domain";
import Joi = require('joi');
import { Report } from "./report";

export class ReportValidator extends JoiEntityValidator<Report> {
    constructor() {
        super({ createSchema, updateSchema });
    }
}

const schema = {
    id: Joi.string().regex(/^[DWMY]\d{4,8}[A-Z]{2}\d{1,2}$/),
    lang: Joi.string().regex(/^[a-z]{2}$/),
    period: Joi.string().regex(/^[DWMY]\d{4,8}$/),
    text: Joi.string().min(REPORT_TEXT_MIN_LENGTH).max(REPORT_TEXT_MAX_LENGTH).truncate(true),
    sign: Joi.number().integer().min(1).max(12),
    length: Joi.number().integer().min(REPORT_TEXT_MIN_LENGTH).max(REPORT_TEXT_MAX_LENGTH),

    createdAt: Joi.string().isoDate(),
    expiresAt: Joi.date().timestamp('unix').raw(),
}

const createSchema = Joi.object().keys({
    id: schema.id.required(),
    lang: schema.lang.required(),
    text: schema.text.required(),
    sign: schema.sign.required(),
    length: schema.length.required(),
    period: schema.period.required(),

    createdAt: schema.createdAt.required(),
    expiresAt: schema.expiresAt.required(),
}).required();

const updateSchema = Joi.object().keys({
    id: schema.id.required(),
    set: Joi.object().keys({
        text: schema.text,
        length: schema.length,
        expiresAt: schema.expiresAt,
    }),
    delete: Joi.array().max(0),
}).or('set', 'delete').required();
