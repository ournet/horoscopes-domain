
import test from 'ava';
import { HoroscopesHelper } from './horoscopes-helper';


test('getSignName', t => {
    t.is(HoroscopesHelper.getSignName(1, '--'), undefined);
    t.deepEqual(HoroscopesHelper.getSignName(1, 'ro'), { slug: 'berbec', name: 'Berbec' });
})

test('generateNumbers', t => {
    let numbers = HoroscopesHelper.generateNumbers(1);
    t.is(numbers.length, 1);
    t.is(numbers[0] < 50, true);
})
