# Brainf\*ck-js
Brainf*ck implementation in Javascript.

**This is not just an interpreter; this is real compiler + virtual machine.**

## Language Specification

[Wiki page about Brainf*ck](https://en.wikipedia.org/wiki/Brainfuck).

## Virual machine specification
VM specs are not equal to language specs! The VM works on top of byte code. This byte code can be produced by any language, not necessarily Brainf\*ck. All that you need to do is to write a compiler for language you like.

These are byte code instructions for the vm:

- **{"op": "<>","value": x}** move memory pointer to += x (x can be negative)
- **{"op": "+-","value": x}** update current byte to += x (x can be negative)
- **{"op": "PRINT","value": x}** print current byte
- **{"op": "READ","value": x}** read a value to current byte
- **{op:"ifjump", index: x}** set memory pointer to x, if current byte is zero
- **{op:"jump", index: x}** set memory pointer to x (unconditional goto)

Although  byte code instructions look similar to brainf\*ck specs; there are different in many ways. First of all, single operation can update a byte to any value. Second, there is an unconditional goto instruction; which does not exist in brainf\*ck.

## The process
### Tokenize
Brainf\*ck source get tokenized to a list of tokens. Valid tokens are kept, whitespaces are skipped. Note, this implementation assumes all characters are whitespaces, other than ones specified in language specs.

### Parse
List of tokens is converted to an Abstract Syntax Tree by a [recursive descent parser](https://en.wikipedia.org/wiki/Recursive_descent_parser) implementation.

The parser is implemented by hands and has these rules:

- STATEMENTS -> STATEMENT STATEMENTS | EPSILON
- STATEMENT -> left|right|up|down|write|read|WHILE
- WHILE -> while_start STATEMENTS while_end

### Optimize
This is not implemented as of now. But here are few examples, how an AST can be optimized:

- two left nodes can be merged into one
- if a left node is followed by a right one - both can be deleted

### Compile
Compiler is an implementation of a visitor pattern. It produces byte code according to VM specification.

### Execution
VM reads and executes byte code.

## Testing
The code is covered by unittests, see test directory.

## License
The code is released under Apache License Version 2.0

## Contacts
andrew@romanenco.com<br/>
romanenco.com<br/>
https://twitter.com/andrewromanenco
