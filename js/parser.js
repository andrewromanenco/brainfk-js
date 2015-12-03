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


var AstNode = function(name){
    this._name = this._validated_name(name);
}

AstNode.prototype._valid_names_list = ['MoveLeft', 'MoveRight',
    'Increment', 'Decrement',
    'Output', 'Input',
    'While'];

AstNode.prototype._validated_name = function(name) {
    if (this._valid_names_list.indexOf(name) === -1) {
        throw {name: 'Error',
            message: 'Attempt to create ast node with unsupported name name'};
    }
    return name;
}

AstNode.prototype.setNext = function(next) {this._next = next};
AstNode.prototype.next = function() {return this._next || null;}

AstNode.prototype.isMoveLeftNode = function() {return this._name === 'MoveLeft'};
AstNode.prototype.isMoveRightNode = function() {return this._name === 'MoveRight'};
AstNode.prototype.isIncrementNode = function() {return this._name === 'Increment'};
AstNode.prototype.isDecrementNode = function() {return this._name === 'Decrement'};
AstNode.prototype.isOutputNode = function() {return this._name === 'Output'};
AstNode.prototype.isInputNode = function() {return this._name === 'Input'};
AstNode.prototype.isWhileNode = function() {return this._name === 'While'};

AstNode.prototype.accept = function(visitor) {visitor.visit(this);}


var WhileAstNode = function() {
    AstNode.call(this, 'While');
    this.statements = null;
}

WhileAstNode.prototype = Object.create(AstNode.prototype);
WhileAstNode.prototype.constructor = WhileAstNode;


var ListWalker = function(tokens_list) {
    this.tokens = tokens_list;
    this.index = 0;
    this.tokens.push(new Token('EOP'));  // end of program marker
};

ListWalker.prototype.next_token = function() {
    if (this.index < this.tokens.length) {
        var t = this.tokens[this.index];
        this.index++;
        return t;
    } else {
        return null;
    }
};

ListWalker.prototype.look_ahead_token =function() {
  if (this.index < this.tokens.length) {
        return this.tokens[this.index];
    } else {
        return null;
    }
};


var Parser = function() {
    var parse_program = function(walker) {
        var statements = parse_statements(walker);
        return statements;
    };
    var parse_statements = function(walker) {
        if (walker.look_ahead_token().value() == ']') {
            return null;
        }
        var statement = parse_single_statement(walker);
        if (statement != null) {
            statement.setNext(parse_statements(walker));
        }
        return statement;
    };
    var parse_single_statement = function(walker) {
        var token = walker.next_token();
        if (token === null) {
            throw {name: 'ParsingError', message: 'Unexpected end of program'};
        }
        switch(token.value()) {
            case 'EOP': return null;
            case '>': return new AstNode('MoveRight');
            case '<': return new AstNode('MoveLeft');
            case '+': return new AstNode('Increment');
            case '-': return new AstNode('Decrement');
            case '.': return new AstNode('Output');
            case ',': return new AstNode('Input');
            case '[': return parse_while(walker);
            case ']': throw {name: 'ParsingError', message: 'Unexpected ]'};
            default: throw {name: 'ParsingError', message: 'Unknown token in input'};
        }
    };
    var parse_while = function(walker) {
        var while_stmt = new WhileAstNode();
        while_stmt.statements = parse_statements(walker);
        var token = walker.next_token();
        if (!token || (token.value() !== ']')) {
            throw {name: 'ParsingError', message: 'Expected ] not found'};
        }
        return while_stmt;
    };

    this.parse = function(tokens_list) {
        var walker = new ListWalker(tokens_list);
        var ast = parse_program(walker);
        if (walker.next_token() !== null) {
            // this is an error, due to unprocessed input left
            throw {name: 'ParsingError', message: 'Missing ['};
        };
        return ast;
    };
};
