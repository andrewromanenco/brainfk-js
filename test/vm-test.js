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


//
// Brainfuck programs are found over the internet; thanks to authors!
//

QUnit.module( "VM" );

QUnit.test( "Hello world!", function( assert ) {
    var input = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
    var tokenizer = new Tokenizer();
    var parser = new Parser();
    var compiler = new Compiler();

    var tokens = tokenizer.tokenize(input);
    var ast = parser.parse(tokens);
    var program = compiler.compile(ast);

    var vm = new VM(program);
    vm.run();

    assert.equal(vm.output_buffer, "Hello World!\n");
});

QUnit.test( "Program to print 'brainfuck'", function( assert ) {
    var input = '>++++[>++++++<-]>-[[<+++++>>+<-]>-]<<[<]>>>>--.<<<-.>>>-.<.<.>---.<<+++.>>>++.<<---.[>]<<.';
    var tokenizer = new Tokenizer();
    var parser = new Parser();
    var compiler = new Compiler();

    var tokens = tokenizer.tokenize(input);
    var ast = parser.parse(tokens);
    var program = compiler.compile(ast);

    var vm = new VM(program);
    vm.run();

    assert.equal(vm.output_buffer, "brainfuck\n");
});

QUnit.test( "Power of 2, stop by limit", function( assert ) {
    var input = '>++++++++++>>+<+[[+++++[>++++++++<-]>.<++++++[>--------<-]+<<]>.>[->[<++>-[<++>-[<++>-[<++>-[<-------->>[-]++<-[<++>-]]]]]]<[>+<-]+>>]<<]';
    var tokenizer = new Tokenizer();
    var parser = new Parser();
    var compiler = new Compiler();

    var tokens = tokenizer.tokenize(input);
    var ast = parser.parse(tokens);
    var program = compiler.compile(ast);

    var vm = new VM(program, 1000);  // will stop after 1000 steps
    vm.run();

    assert.equal(vm.output_buffer, "1\n2\n4\n8\n");
});
