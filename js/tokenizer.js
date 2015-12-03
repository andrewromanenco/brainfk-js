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


var Token = function (value, line, position) {
    if (typeof(value) !== 'string') {
        throw {name:'Error' , message: 'Token must be a string'}
    }
    this._value = value;
    this._line = line || -1;
    this._position = position || -1;
};

Token.prototype.value = function() {
    return this._value;
};

Token.prototype.line = function() {
    return this._line;
};

Token.prototype.position = function() {
    return this._position;
};

Token.prototype.equals =function (o) {
    return (o instanceof Token)&&(this.value() === o.value());
};


var Tokenizer = function() {
    this._valid_ones = />|<|\+|\-|\.|,|\[|\]/;
    this._white_space = /.|\r|\n/;  // everything is a whitespace, other than valid ones
};

Tokenizer.prototype.tokenize = function(source) {
    var line_count = 1;
    var pos_count = 1;
    var token_list = [];
    var symbol;
    for (var i = 0; i < source.length; i++) {
        symbol = source[i];
        if (symbol.match(this._valid_ones)) {
            token_list.push(new Token(symbol, line_count, pos_count));
        } else if (!symbol.match(this._white_space)) {
            throw {name: 'SyntaxError', message: 'Unexpected symbol in input'};
        }
        if (symbol === "\n") {
            line_count++;
            pos_count = 1;
        } else {
            pos_count++;
        }
    }
    return token_list;
};
