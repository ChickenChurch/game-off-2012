// Copyright 2012 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Shared code for classlist_test.html.
 */

goog.provide('goog.dom.classlist_test');
goog.setTestOnly('goog.dom.classlist_test');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.testing.jsunit');


var classlist = goog.dom.classlist;

function testGet() {
  var el = document.createElement('div');
  assertTrue(classlist.get(el).length == 0);
  el.className = 'C';
  assertElementsEquals(['C'], classlist.get(el));
  el.className = 'C D';
  assertElementsEquals(['C', 'D'], classlist.get(el));
  el.className = 'C\nD';
  assertElementsEquals(['C', 'D'], classlist.get(el));
  el.className = ' C ';
  assertElementsEquals(['C'], classlist.get(el));
}

function testContainsWithNewlines() {
  var el = goog.dom.getElement('p1');
  assertTrue('Should not have SOMECLASS', classlist.contains(el, 'SOMECLASS'));
  assertTrue('Should also have OTHERCLASS',
      classlist.contains(el, 'OTHERCLASS'));
  assertFalse('Should not have WEIRDCLASS',
      classlist.contains(el, 'WEIRDCLASS'));
}

function testContainsCaseSensitive() {
  var el = goog.dom.getElement('p2');
  assertFalse('Should not have camelcase',
      classlist.contains(el, 'camelcase'));
  assertFalse('Should not have CAMELCASE',
      classlist.contains(el, 'CAMELCASE'));
  assertTrue('Should have camelCase',
      classlist.contains(el, 'camelCase'));
}

function testAddNotAddingMultiples() {
  var el = document.createElement('div');
  classlist.add(el, 'A');
  assertEquals('A', el.className);
  classlist.add(el, 'A');
  assertEquals('A', el.className);
  classlist.add(el, 'B', 'B');
  assertEquals('A B', el.className);
}

function testAddCaseSensitive() {
  var el = document.createElement('div');
  classlist.add(el, 'A');
  assertTrue(classlist.contains(el, 'A'));
  assertFalse(classlist.contains(el, 'a'));
  classlist.add(el, 'a');
  assertTrue(classlist.contains(el, 'A'));
  assertTrue(classlist.contains(el, 'a'));
  assertEquals('A a', el.className);
}

function testRemove() {
  var el = document.createElement('div');
  el.className = 'A B C';
  classlist.remove(el, 'B');
  assertEquals('A C', el.className);
}

function testRemoveCaseSensitive() {
  var el = document.createElement('div');
  el.className = 'A B C';
  classlist.remove(el, 'b');
  assertEquals('A B C', el.className);
}

function testEnable() {
  var el = goog.dom.getElement('p1');
  classlist.set(el, 'SOMECLASS FIRST');

  assertTrue('Should have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have SOMECLASS class',
      classlist.contains(el, 'SOMECLASS'));

  classlist.enable(el, 'FIRST', false);

  assertFalse('Should not have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have SOMECLASS class',
      classlist.contains(el, 'SOMECLASS'));

  classlist.enable(el, 'FIRST', true);

  assertTrue('Should have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have SOMECLASS class',
      classlist.contains(el, 'SOMECLASS'));
}

function testEnableNotAddingMultiples() {
  var el = document.createElement('div');
  classlist.enable(el, 'A', true);
  assertEquals('A', el.className);
  classlist.enable(el, 'A', true);
  assertEquals('A', el.className);
  classlist.enable(el, 'B', 'B', true);
  assertEquals('A B', el.className);
}

function testSwap() {
  var el = goog.dom.getElement('p1');
  classlist.set(el, 'SOMECLASS FIRST');

  assertTrue('Should have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have FIRST class', classlist.contains(el, 'SOMECLASS'));
  assertFalse('Should not have second class', classlist.contains(el, 'second'));

  classlist.swap(el, 'FIRST', 'second');

  assertFalse('Should not have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have FIRST class', classlist.contains(el, 'SOMECLASS'));
  assertTrue('Should have second class', classlist.contains(el, 'second'));

  classlist.swap(el, 'second', 'FIRST');

  assertTrue('Should have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have FIRST class', classlist.contains(el, 'SOMECLASS'));
  assertFalse('Should not have second class', classlist.contains(el, 'second'));
}

function testToggle() {
  var el = goog.dom.getElement('p1');
  classlist.set(el, 'SOMECLASS FIRST');

  assertTrue('Should have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have SOMECLASS class', classlist.contains(el, 'SOMECLASS'));

  var ret = classlist.toggle(el, 'FIRST');

  assertFalse('Should not have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have SOMECLASS class', classlist.contains(el, 'SOMECLASS'));
  assertFalse('Return value should have been false', ret);

  ret = classlist.toggle(el, 'FIRST');

  assertTrue('Should have FIRST class', classlist.contains(el, 'FIRST'));
  assertTrue('Should have SOMECLASS class', classlist.contains(el, 'SOMECLASS'));
  assertTrue('Return value should have been true', ret);
}

