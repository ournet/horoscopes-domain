
import test from 'ava';
import { HoroscopesHelper } from './horoscopes-helper';


test('getSignName', t => {
    t.is(HoroscopesHelper.getSignName(1, '--'), undefined);
    t.deepEqual(HoroscopesHelper.getSignName(1, 'ro'), { slug: 'berbec', name: 'Berbec' });
})
