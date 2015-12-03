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


// memory model implemented on top of a hash, istead of an array
var Memory = function() {
    this.memory = {};
    this.mem_pointer = 0;
}

Memory.prototype.move = function(steps) {
    this.mem_pointer += steps;
}

Memory.prototype.update = function(diff) {
    this.memory[this.mem_pointer] = this.get() + diff;
}

Memory.prototype.get = function() {
    return this.memory[this.mem_pointer] === undefined?
        0 : this.memory[this.mem_pointer]
}


var TicksLimit = function(ticks) {
    this.ticks = ticks;
}

TicksLimit.prototype.hasMoreTicks = function() {
    if (this.ticks === -1) {
        return true;
    } else if (this.ticks === 0) {
        return false;
    } else {
        return  this.ticks-- > 0;
    }
}

// This vm executes byte code (instance of a program built by the compiler)
// Does not support input operation
// Output goes to internal buffer
var VM = function(compiled_program, ticks_limit) {
    this.bytecode = compiled_program.byte_code();
    this.memory = new Memory();
    this.pc = 0;  // program counter
    this.ticks = ticks_limit === undefined?
        new TicksLimit(-1): new TicksLimit(ticks_limit);
    this.output_buffer = "";
}

VM.prototype.run = function() {
    var op;
    while ((this.pc < this.bytecode.length) && this.ticks.hasMoreTicks()) {
        op = this.bytecode[this.pc++];
        if (op.op === '<>') {
            this.memory.move(op.value);
        } else if (op.op === '+-') {
            this.memory.update(op.value);
        } else if (op.op === 'PRINT') {
            this.output_buffer += String.fromCharCode(this.memory.get());
        } else if (op.op === 'READ') {
            throw {name: "RuntimeError", message: "Not supported in this VM"};
        } else if (op.op === 'ifjump') {
            if (this.memory.get() === 0) {this.pc = op.index;}
        } else if (op.op === 'jump') {
            this.pc = op.index;
        } else {
            throw {name: "RuntimeError", message: "Should never get here :( unkown byte code"};
        }
    }
}
