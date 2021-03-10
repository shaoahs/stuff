/*jshint -W030 */

import chai, {assert, expect} from 'depend:test/chai@3.5.0.js';
import * as slot from 'slot/main';
var should = chai.should(); // jshint ignore:line

var display = slot.display;

describe('模組單元測試', () => {
  'use strict';

  describe('功能測試', () => {
    var f = display.f;

    it('理應傳回字串 bb1', () => {
      expect(f.bb1()).to.have.string('bb1');
    });
    it('理應傳回字串 bb4', () => {
      expect(f.bb4()).to.have.string('bb4');
    });
    it('理應是數字', () => {
      assert.isNumber(f.b1, '是數字一喔');
    });
    it('理應是數字', () => {
      assert.isNumber(f.b2, '是數字二喔');
    });
  });
});
