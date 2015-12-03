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


var CompiledProgram = function (byte_code_list) {
    this._byte_code = byte_code_list;
};

CompiledProgram.prototype.byte_code = function() {
    return this._byte_code;
};


var Compiler = function() {
    this._bytecode = [];
};

Compiler.prototype.compile = function(ast) {
    ast.accept(this);
    return new CompiledProgram(this._bytecode);
}

Compiler.prototype.visit = function(astNode) {
    if (astNode.isWhileNode()) {
        this._visitWhile(astNode);
    } else {
        this._visitNonWhile(astNode);
    }
    if (astNode.next() !== null) {
        astNode.next().accept(this);
    }
}

Compiler.prototype._visitWhile = function(whileNode) {
    var current_op_index = this._bytecode.length;
    this._bytecode.push({op:'ifjump'});
    if (whileNode.statements !== null) {
        whileNode.statements.accept(this);
    }
    this._bytecode.push({op:'jump', index: current_op_index});
    this._bytecode[current_op_index].index = this._bytecode.length;
}

Compiler.prototype._visitNonWhile = function(astNode) {
    if (astNode.isMoveRightNode()) {
        this._bytecode.push({op:'<>', value: 1});
    } else if (astNode.isMoveLeftNode()) {
        this._bytecode.push({op:'<>', value: -1});
    } else if (astNode.isIncrementNode()) {
        this._bytecode.push({op:'+-', value: 1});
    } else if (astNode.isDecrementNode()) {
        this._bytecode.push({op:'+-', value: -1});
    } else if (astNode.isOutputNode()) {
        this._bytecode.push({op:'PRINT'});
    } else if (astNode.isInputNode()) {
        this._bytecode.push({op:'READ'});
    } else if (astNode.isWhileNode()) {
        throw {name: "RuntimeError", message: "While node must be processed via visitor"};
    } else {
        throw {name: "RuntimeError", message: "Should never get here :( unknown node in ast"};
    }
}
