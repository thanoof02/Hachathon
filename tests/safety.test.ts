import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,enforceSafety,questions,type Answer} from '../lib/domain';
const base=():Answer[]=>questions.map((_,question)=>({question,option:0,comment:''}));
test('Every question offers at least five choices',()=>{assert.equal(questions.length,13);for(const q of questions)assert.ok(q.options.length>=5)});
test('Immediate support for sometimes, often and right now regardless of other answers',()=>{for(const option of [2,3,4]){const a=base();a[10].option=option;const result=analyze(a);assert.equal(result.risk_level,'crisis');assert.equal(result.needs_immediate_help,true)}});
test('Rare thoughts encourage high support',()=>{const a=base();a[10].option=1;assert.equal(analyze(a).risk_level,'high')});
test('Critical free text overrides skipped answers',()=>{for(const comment of ['I want to end my life','suicide','I will kill myself','no reason to live']){assert.equal(analyze([{question:2,option:null,comment}]).needs_immediate_help,true)}});
test('An AI response can never lower deterministic risk',()=>{const a=base();a[10].option=4;const urgent=analyze(a);assert.equal(enforceSafety(urgent,analyze(base())).risk_level,'crisis');assert.equal(enforceSafety(urgent,analyze(base())).needs_immediate_help,true)});
test('Skipped questions do not inflate wellbeing score',()=>{const result=analyze(questions.map((_,question)=>({question,option:null,comment:''})));assert.equal(result.overall_wellbeing_score,50);assert.match(result.empathetic_summary,/skipped/)});
test('Maximum burden yields high support with bounded score',()=>{const a=questions.map((q,question)=>({question,option:question===10?0:q.scores.indexOf(Math.max(...q.scores)),comment:''}));const result=analyze(a);assert.equal(result.risk_level,'high');assert.ok(result.overall_wellbeing_score>=0&&result.overall_wellbeing_score<=100)});

