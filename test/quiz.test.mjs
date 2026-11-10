import test from 'node:test';
import assert from 'node:assert/strict';
import { makeRound, CATEGORIES } from '../www/js/quiz.js';
import { LESSONS } from '../www/js/lessons.js';

test('every quiz category generates valid questions', () => {
  for (const cat of [...Object.keys(CATEGORIES), 'mixed']) {
    for (let r = 0; r < 30; r++) {
      for (const q of makeRound(cat, 10)) {
        assert.ok(q.options.length >= 2, q.q);
        assert.equal(new Set(q.options).size, q.options.length, `duplicate options: ${q.q}`);
        assert.ok(q.answer >= 0 && q.answer < q.options.length, q.q);
      }
    }
  }
});

test('lesson quizzes are well formed', () => {
  const ids = new Set();
  for (const l of LESSONS) {
    assert.ok(!ids.has(l.id)); ids.add(l.id);
    for (const q of l.quiz) assert.ok(q.answer < q.options.length, `${l.id}: ${q.q}`);
  }
});
