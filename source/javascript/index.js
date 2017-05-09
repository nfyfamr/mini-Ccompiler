const fs = require('fs');


// tsymbol type, represents the token number;
const TSYMBOL = [
	// special symbols
	'tnot',			// 0
	'tnotequ',
	'tmod',
	'tmodAssign',
	'tident',
	'tnumber',
	'tand',
	'tlparen',
	'trparen',
	'tmul',
	'tmulAssign',		// 10
	'tplus',
	'tinc',
	'taddAssign',
	'tcomma',
	'tminus',
	'tdec',
	'tsubAssign',
	'tdiv',
	'tdivAssign',
	'tsemicolon',		// 20
	'tless',
	'tlesse',
	'tassign',
	'tequal',
	'tgreat',
	'tgreate',
	'tlbracket',
	'trbracket',
	'teof',

	// keword symbols
	'const',			// 30
	'else',
	'if',
	'int',
	'return',
	'void',
	'while',
	'lbrace',
	'or',
	'rbrace'
];
TSYMBOL[-1] = 'tnull';

const ID_LENGTH = 7;


class Token {
	constructor(raw, symbol='tnull', value) {
		this.raw = raw;
		this.symbol = symbol;
		this.value = value
	}
}


// Associative object
const special = {
	// state 10
	'/': () => {
		ch = data[++charIndex];
		if (ch === '*') {              // text comment
			charIndex = data.indexOf('*/', charIndex) + 1;
		} else if (ch === '/') {         // line comment
			charIndex = data.indexOf('\n', charIndex);
		} else if (ch === '=') {
			return new Token('/=', 'tdivAssign');
		} else {
			// retract
			--charIndex;
			return new Token('/', 'tdiv');
		}
		return 'comment';
	},

	// state 17
	'!': () => {
		ch = data[++charIndex];
		if (ch === '=') {
			return new Token('!=', 'tnotequ');
		} else {
			// retract
			-- charIndex;
			return new Token('!', 'tnot');
		}
	},

	// state 20
	'%': () => {
		ch = data[++charIndex];
		if (ch === '=') {
			return new Token('%=', 'tmodAssign');
		} else {
			// retract
			--charIndex;
			return new Token('%', 'tmod');
		}
	},

	// state 23
	'&': () => {
		ch = data[++charIndex];
		if (ch === '&') {
			return new Token('&&', 'tand');
		} else {
			// retract
			--charIndex;
			lexicalError(2);
		}
	},

	// state 25
	'*': () => {
		ch = data[++charIndex];
		if (ch === '=') {
			return new Token('*=', 'tmulAssign');
		} else {
			// retract
			--charIndex;
			return new Token('*', 'tmul');
		}
	},


	// state 28
	'+': () => {
		ch = data[++charIndex];
		if (ch === '+') {
			return new Token('++', 'tinc');
		} else if (ch === '=') {
			return new Token('+=', 'taddAssign');
		} else {
			// retract
			--charIndex;
			return new Token('+', 'tpuls');
		}
	},

	// state 32
	'-': () => {
		ch = data[++charIndex];
		if (ch === '-') {
			return new Token('--', 'tdec');
		} else if (ch === '=') {
			return new Token('-=', 'tsubAssign');
		} else {
			// retract
			--charIndex;
			return new Token('-', 'tminus');
		}
	},

	// state 36
	'<': () => {
		ch = data[++charIndex];
		if (ch === '=') {
			return new Token('<=', 'tlesse');
		} else {
			// retract
			--charIndex;
			return new Token('<', 'tless');
		}
	},


	// state 39
	'=': () => {
		ch = data[++charIndex];
		if (ch === '=') {
			return new Token('==', 'tequal');
		} else {
			// retract
			--charIndex;
			return new Token('=', 'tassign');
		}
	},

	// state 42
	'>': () => {
		ch = data[++charIndex];
		if (ch === '=') {
			return new Token('>=', 'tgreate');
		} else {
			// retract
			--charIndex;
			return new Token('>', 'tgreat');
		}
	},

	// state 45
	'|': () => {
		ch = data[++charIndex];
		if (ch == '|') {
			return new Token('||', 'tor');
		} else {
			// retract
			--charIndex;
			lexicalError(3);
		}
	},

	'(': () => {
		return new Token('(', 'tlparen');
	},

	')': () => {
		return new Token(')', 'trparen');
	},

	',': () => {
		return new Token(',', 'tcomma');
	},

	';': () => {
		return new Token(';', 'tsemicolon');
	},

	'[': () => {
		return new Token('[', 'tlbracket');
	},

	']': () => {
		return new Token(']', 'trbracket');
	},

	'{': () => {
		return new Token('{', 'tlbrace');
	},

	'}': () => {
		return new Token('}', 'trbrace');
	}
}


// !!!start scirpt
console.log(` 
********************************************************************************************

      #   ##   #    #   ##    ####   ####  #####  # #####  #####    #    # # #    # #  ####  
      #  #  #  #    #  #  #  #      #    # #    # # #    #   #      ##  ## # ##   # # #    # 
      # #    # #    # #    #  ####  #      #    # # #    #   #      # ## # # # #  # # #      
      # ###### #    # ######      # #      #####  # #####    #      #    # # #  # # # #      
 #    # #    #  #  #  #    # #    # #    # #   #  # #        #      #    # # #   ## # #    # 
  ####  #    #   ##   #    #  ####   ####  #    # # #        #      #    # # #    # #  ####  
                                                                                             
                                  ######   #####   #####                                     
                                  #     # #     # #     #                                    
                                  #     # #       #                                          
                                  ######  #  ####  #####                                     
                                  #       #     #       #                                    
                                  #       #     # #     #                                    
                                  #        #####   #####                                     

********************************************************************************************
`);


// get minic source file path
if (process.argv.length !== 3) {
	console.log(`Unvaid arguments!!. \n\tUsage: node index[.js] <source_file_path>`);
	process.exit(1);
}
const sourcePath = process.argv[2];
console.log(`Source path: ${sourcePath}`);


// read minic source file
let data = fs.readFileSync(sourcePath, 'utf8');
console.log(`contents of file: \n${data}`);



// start scan
const tokenList = [];
const length = data.length;
let charIndex = -1;
let ch;
do {
	let token;

	// state 1: skip blanks
	while ( /\s/.test(ch = data[++charIndex]) );

	// eof
	if (ch === undefined) {
		break;
	}
	// identifier or keyword
	// isSuperLetter
	if ( /[a-z_]/.test(ch) ) {
		let id = '';
		do {
			if (id.length < ID_LENGTH) {
				id += ch;
			}
			ch = data[++charIndex];
		// isSuperLetterOrDigit
		} while ( /[a-z0-9_]/.test(ch) );
		if (id.length >= ID_LENGTH) {
			lexicalError(1);
		}

		// retract
		--charIndex;

		// find the identifier in the keyword table
		let ret = TSYMBOL.find( e => e === id );
		if (ret !== undefined) {
			// found, keyword exit
			token = new Token(id, id);
		} else {
			// not found, identifier exit
			token = new Token(id, 'tident', id);
		}
	// isDigit, integer constant
	} else if ( /[0-9]/.test(ch) ) {
		const val = getIntNum(ch);
		token = new Token(val, 'tnumber', val);
	// special character
	} else {

		token = special[ch]();
		if (token === 'comment') {
			continue;
		} else if (token === undefined) {
			console.log(`Current character: ${ch}`);
			lexicalError(4);
			continue;
        }
	}

	tokenList.push(token);
} while (charIndex < length);
// end of scanner
console.log(`
********************************************************************************************

                                      end of scan

********************************************************************************************
`);


tokenList.forEach( e => console.log(e) );


function getIntNum(firstCharacter)
{   
	let num = firstCharacter;
	let ch = data[++charIndex];

	if ((ch === 'x') || (ch === 'X')) {
		num += ch;
	} else {
		// retract
		--charIndex;
	}

	while( /[0-9]/.test(ch = data[++charIndex]) ) {
		num += ch;
	}

	// retract
	--charIndex;
    return parseInt(num);
}

function lexicalError(n)
{   
	const errMsg = [
		"an identifier length must be less than 12.\n",
		"next character must be &.\n",
		"next character must be |.\n",
		"invalid character!!!.\n"
	];
    console.log(` *** Lexical Error : ${errMsg[n]}`);
}
