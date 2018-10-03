
import { PHRASE_TEXT_MIN_LENGTH, PHRASE_TEXT_MAX_LENGTH } from "./config";
import { JoiEntityValidator } from "@ournet/domain";
import Joi = require('joi');
import { Phrase } from "./phrase";

export class PhraseValidator extends JoiEntityValidator<Phrase> {
    constructor() {
        super({ createSchema, updateSchema });
    }
}

const schema = {
    id: Joi.string().regex(/^[a-z0-9]{32}$/),
    lang: Joi.string().regex(/^[a-z]{2}$/),
    source: Joi.string().trim().min(3).max(100),
    text: Joi.string().min(PHRASE_TEXT_MIN_LENGTH).max(PHRASE_TEXT_MAX_LENGTH).truncate(true),
    sign: Joi.number().integer().min(1).max(12),
    length: Joi.number().integer().min(PHRASE_TEXT_MIN_LENGTH).max(PHRASE_TEXT_MAX_LENGTH),
    period: Joi.string().valid(['D', 'W', 'M', 'Y']),

    createdAt: Joi.string().isoDate(),
}

const createSchema = Joi.object().keys({
    id: schema.id.required(),
    lang: schema.lang.required(),
    source: schema.source.required(),
    text: schema.text.required(),
    sign: schema.sign.required(),
    length: schema.length.required(),
    period: schema.period.required(),

    createdAt: schema.createdAt.required(),
}).required();

const updateSchema = Joi.object().keys({
    id: schema.id.required(),
    set: Joi.object().keys({}),
    delete: Joi.array().max(0)
}).or('set', 'delete').required();
