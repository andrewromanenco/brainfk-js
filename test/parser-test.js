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


QUnit.module( "Parser" );

QUnit.test( "parse single >", function( assert ) {
    var tokens = [new Token('>')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isMoveRightNode());
    assert.ok(ast.next() === null);
});

QUnit.test( "parse single <", function( assert ) {
    var tokens = [new Token('<')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isMoveLeftNode());
    assert.ok(ast.next() === null);
});

QUnit.test( "parse single +", function( assert ) {
    var tokens = [new Token('+')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isIncrementNode());
    assert.ok(ast.next() === null);
});

QUnit.test( "parse single -", function( assert ) {
    var tokens = [new Token('-')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isDecrementNode());
    assert.ok(ast.next() === null);
});

QUnit.test( "parse single .", function( assert ) {
    var tokens = [new Token('.')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isOutputNode());
    assert.ok(ast.next() === null);
});

QUnit.test( "parse single ,", function( assert ) {
    var tokens = [new Token(',')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isInputNode());
    assert.ok(ast.next() === null);
});

QUnit.test( "parse several non-while", function( assert ) {
    var tokens = [new Token('>'), new Token(',')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isMoveRightNode());
    assert.ok(ast.next().isInputNode());
    assert.ok(ast.next().next() === null);
});

QUnit.test( "parse empty []", function( assert ) {
    var tokens = [new Token('['), new Token(']')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isWhileNode());
    assert.ok(ast.next() === null);
    assert.ok(ast.statements === null);
});

QUnit.test( "parse [+]", function( assert ) {
    var tokens = [new Token('['), new Token('+'), new Token(']')];
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isWhileNode());
    assert.ok(ast.next() === null);
    assert.ok(ast.statements !== null);
    assert.ok(ast.statements.isIncrementNode());
    assert.ok(ast.statements.next() === null);
});

QUnit.test( "unclosed while", function( assert ) {
    raises(function() {
        var tokens = [new Token('>'), new Token('['), new Token('+')];
        var parser = new Parser();
        parser.parse(tokens);
    }, {name: 'ParsingError', message: 'Expected ] not found'});
});

QUnit.test( "unclosed while 2", function( assert ) {
    raises(function() {
        var tokens = [new Token('>'), new Token('['), new Token('+'), new Token('['), new Token(']')];
        var parser = new Parser();
        parser.parse(tokens);
    }, {name: 'ParsingError', message: 'Expected ] not found'});
});

QUnit.test( "extra while end", function( assert ) {
    raises(function() {
        var tokens = [new Token('>'), new Token(']'), new Token('+')];
        var parser = new Parser();
        parser.parse(tokens);
    }, {name: 'ParsingError', message: 'Missing ['});
});

QUnit.test( "parse hello world", function( assert ) {
    var input = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
    var tokens = [];
    for (var i = 0; i < input.length; i++) {
        tokens.push(new Token(input[i]));
    }
    var parser = new Parser();
    var ast = parser.parse(tokens);
    assert.ok(ast);
    assert.ok(ast.isIncrementNode());
});



