import test from 'node:test';
import assert from 'node:assert/strict';
import {aggregateReport} from '../lib/analytics';
test('Suppress cohorts below five and never return individual rows',()=>{const report=aggregateReport(Array.from({length:9},(_,i)=>({cohort:i<5?'Large':'Small',week:1,score:70,risk:'low',stressSource:'Work',privateName:'must not leak'})));assert.deepEqual(report.cohorts.map(c=>c.name),['Large']);assert.equal(JSON.stringify(report).includes('must not leak'),false)});
test('Suppress whole report below privacy threshold',()=>{const report=aggregateReport([{cohort:'Small',week:1,score:20,risk:'high',stressSource:'Work'}]);assert.equal(report.suppressed,true);assert.equal(report.groupSize,0);assert.deepEqual(report.trend,[])});
