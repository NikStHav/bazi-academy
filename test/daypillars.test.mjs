import test from 'node:test';
import assert from 'node:assert/strict';
import { stageOf } from '../www/js/stages.js';

test('growth stages follow the classical table', () => {
  assert.equal(stageOf(0, 11).zh, '长生'); // 甲 born in 亥
  assert.equal(stageOf(0, 2).zh, '临官');  // 甲禄在寅
  assert.equal(stageOf(0, 3).zh, '帝旺');  // 甲 peak in 卯
  assert.equal(stageOf(0, 7).zh, '墓');    // 甲 tomb in 未
  assert.equal(stageOf(1, 6).zh, '长生');  // 乙 born in 午
  assert.equal(stageOf(1, 3).zh, '临官');  // 乙禄在卯
  assert.equal(stageOf(1, 2).zh, '帝旺');  // 乙 peak in 寅
  assert.equal(stageOf(2, 10).zh, '墓');   // 丙 tomb in 戌
  assert.equal(stageOf(6, 8).zh, '临官');  // 庚禄在申
  assert.equal(stageOf(8, 0).zh, '帝旺');  // 壬 peak in 子
  assert.equal(stageOf(9, 0).zh, '临官');  // 癸禄在子
  assert.equal(stageOf(9, 3).zh, '长生');  // 癸 born in 卯
});

import { dayPillarProfile } from '../www/js/daypillars.js';
import { pillarFromIndex } from '../www/js/bazi.js';
test('every day pillar has a complete profile', () => {
  for (let i = 0; i < 60; i++) {
    const p = pillarFromIndex(i);
    const pr = dayPillarProfile(p.stem, p.branch);
    assert.equal(pr.index, i);
    assert.ok(pr.image && pr.character && pr.seat && pr.stage.name && pr.seatGodName);
  }
  assert.equal(dayPillarProfile(6, 4).special[0].zh, '魁罡');   // 庚辰
  assert.equal(dayPillarProfile(2, 6).special[0].zh, '羊刃');   // 丙午
  assert.equal(dayPillarProfile(0, 2).special[0].zh, '日禄');   // 甲寅
  assert.equal(dayPillarProfile(8, 8).stage.zh, '长生');        // 壬申: Birth
});
