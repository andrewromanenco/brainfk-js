/*
 * Copyright 2015 Andrew Romanenco
 * www.romanenco.com
 * andrew@romanenco.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


QUnit.module( "Tokinizer" );

QUnit.test( "good token", function( assert ) {
    var token = new Token('+', 10, 99);
    assert.ok(token);
    assert.strictEqual(token.value(), '+');
    assert.strictEqual(token.line(), 10);
    assert.strictEqual(token.position(), 99);
});

QUnit.test( "good token with no line and pos", function( assert ) {
    var token = new Token('+');
    assert.ok(token);
    assert.strictEqual(token.value(), '+');
    assert.strictEqual(token.line(), -1);
    assert.strictEqual(token.position(), -1);
});

QUnit.test( "bad empty token", function( assert ) {
    raises(function() {
        new Token();
    }, {name:'Error' , message: 'Token must be a string'});
});

QUnit.test( "bad empty token", function( assert ) {
    raises(function() {
        new Token(99);
    }, {name:'Error' , message: 'Token must be a string'});
});

QUnit.test( "token equals to self", function( assert ) {
    var token = new Token('+');
    assert.strictEqual(token.equals(token), true);
});

QUnit.test( "token equals", function( assert ) {
    var token1 = new Token('+');
    var token2 = new Token('+');
    assert.strictEqual(token1.equals(token2), true);
});

QUnit.test( "token not equals to token", function( assert ) {
    var token1 = new Token('+');
    var token2 = new Token('-');
    assert.strictEqual(token1.equals(token2), false);
});

QUnit.test( "token not equals to non-token", function( assert ) {
    var token1 = new Token('+');
    var token2 = "abc";
    assert.strictEqual(token1.equals(token2), false);
});

QUnit.test( "valid source", function( assert ) {
    var tokenizer = new Tokenizer();
    var tokens = tokenizer.tokenize('><+-.,[]');
    assert.strictEqual(tokens.length, 8);
    assert.ok(tokens[0].value() === '>');
    assert.ok(tokens[1].value() === '<');
    assert.ok(tokens[2].value() === '+');
    assert.ok(tokens[3].value() === '-');
    assert.ok(tokens[4].value() === '.');
    assert.ok(tokens[5].value() === ',');
    assert.ok(tokens[6].value() === '[');
    assert.ok(tokens[7].value() === ']');
});

QUnit.test( "valid source with whitespaces", function( assert ) {
    var tokenizer = new Tokenizer();
    var tokens = tokenizer.tokenize(">  <\t+-IGNORED\r\n.,\n[]");
    assert.strictEqual(tokens.length, 8);
    assert.ok(tokens[0].value() === '>');
    assert.ok(tokens[1].value() === '<');
    assert.ok(tokens[2].value() === '+');
    assert.ok(tokens[3].value() === '-');
    assert.ok(tokens[4].value() === '.');
    assert.ok(tokens[5].value() === ',');
    assert.ok(tokens[6].value() === '[');
    assert.ok(tokens[7].value() === ']');
});
