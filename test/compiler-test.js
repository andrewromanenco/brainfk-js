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


QUnit.module( "Compiler" );

QUnit.test( "compile while-free ast", function( assert ) {
    var ast = new AstNode('MoveRight');
    ast.setNext(new AstNode('Increment'));
    ast.next().setNext(new AstNode('MoveLeft'));
    var compiler = new Compiler();
    var program = compiler.compile(ast);
    assert.ok(program && program.byte_code());
    assert.deepEqual(program.byte_code(),
      [{"op": "<>","value": 1},{"op": "+-","value": 1},{"op": "<>","value": -1}]);
});

QUnit.test( "compile ast with while", function( assert ) {
    var ast = new AstNode('MoveRight');
    var while_stmt = new WhileAstNode();
    while_stmt.statements = new AstNode('Decrement');
    ast.setNext(while_stmt);
    ast.next().setNext(new AstNode('MoveLeft'));
    var compiler = new Compiler();
    var program = compiler.compile(ast);
    assert.ok(program && program.byte_code());
    assert.deepEqual(program.byte_code(),
      [{"op": "<>","value": 1},
      {"op": "ifjump",
      "index": 4},
      {"op": "+-","value": -1},
      {"op": "jump", "index": 1},
      {"op": "<>","value": -1}]);
});
