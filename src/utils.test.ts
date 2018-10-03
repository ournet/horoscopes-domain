
import test from 'ava';
import { truncateAt } from './utils';

test('truncateAt', t => {
    t.is(truncateAt('a', 10), 'a');
    t.is(truncateAt('', 10), '');
    t.is(truncateAt('Start  some  text', 20), 'Start  some  text');
    t.is(truncateAt('Start  some  text', 10), 'Start …');
    t.is(truncateAt('Start', 2), '');
})
