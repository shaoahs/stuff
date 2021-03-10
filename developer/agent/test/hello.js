/*jshint -W030 */
import chai, {assert, expect} from 'depend:test/chai@3.5.0.js';
import * as slot from 'slot/main';
var should = chai.should(); // jshint ignore:line

var display = slot.display;

describe('Hello 物件測試', () => {
  'use strict';
  before(function () {
    console.log('before !!');
  });

  describe('建立 hello 物件', () => {
    let hello = new display.Hello();
    let net;
    it('理應是一個物件', () => {
      expect(hello).to.be.an('object');
    });
    it('理應傳回字串 ', () => {
      assert.isString(hello.world(), '傳回字串了!');
    });
  });
});
