#include <cctype>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <map>
#include "minic-pgs.hpp"

using namespace std;

MinicPGS::MinicPGS(const string& token_file_path)
{

	cout << "MinicPGS constructor" << endl;
	
    // open tokenType definition file
	ifstream tf(token_file_path, ifstream::in);
	if (!tf.is_open())
	{
		cout << "Unable to open '" << token_file_path << "' file" << endl;
		// throw error;
		exit(1);
	}

	// read each line and initialize token map
	int i = 0;
	string line, token_name, token_value;
	istringstream iss;
	while (tf.good())
	{
		getline(tf, line);

		// reset read position to entry and push a string 
		iss.clear();
		iss.seekg(0);
		iss.str(line);

		// extract token_name and token_value
		token_name.clear();
		token_value.clear();
		iss >> token_name >> token_value;

		// normalize token_name and token_value
		if (token_name.compare(0, 2, "//") == 0) token_name = "";
		if (token_value.compare(0, 2, "//") == 0) token_value = "";
		
		// skip empty line or comment line
		if (token_name.empty()) continue;

		// insert token definition to token map
		token_type.insert( {token_name,
							token_value.empty() ? i++ : stoi(token_value) } );
	}

	// close tokenType definition file
	tf.close();
}

MinicPGS::~MinicPGS()
{
	cout << "MinicPGS destructor" << endl;
}


void MinicPGS::print_token() const
{
	for (auto it=token_type.begin(); it!=token_type.end(); ++it)
		cout << it->first << "\t-> " << it->second << endl;
}

int MinicPGS::type_number_of(const char* token_name) const
{
	return token_type.at(token_name);
}

vector<Token> MinicPGS::parse(const string& source_path) const
{
	cout << "========== parse ==========" << endl;

	// open minic source file
	ifstream src(source_path, ifstream::in);
	if (!src.is_open())
	{
		cout << "Unable to open '" << source_path << "' file" << endl;
		// throw error;
		exit(1);
	}

	vector<Token> tokenList(50);
	// token.number = tnull;
	char ch;
	// Token token;
	while (src.get(ch))
	{
		Token token;

		// state 1: skip blanks
		if (isspace(ch)) continue;

		// identifier or keyword
		if (isSuperLetter(ch))
		{
			i = 0;
			do {
				if (i < ID_LENGTH) id[i++] = ch;
				ch = getchar();
			} while (isSuperLetterOrDigit(ch));
			if (i >= ID_LENGTH) lexicalError(1);

			id[i] = '\0';
			ungetc(ch, stdin);				// retract

			// find the identifier in the keyword table
			for (index = 0; index < NO_KEYWORDS; index++)
				if (!strcmp(id, keyword[index])) break;

			if (index < NO_KEYWORDS)		// found, keyword exit
				token.number = tnum[index];
			else {							// not found, identifier exit
				token.number = tident;
				strcpy(token.value.id, id);
			}
		}
		// integer constant
		else if (isdigit(ch)) {
			token.number = tnumber;
			token.value.num = getIntNum(ch);
		}
		else switch (ch) {					// special character
			// state 10
			case '/':
				ch = getchar();
				if (ch == '*')				// text comment
					do {
						while (ch != '*') ch = getchar();
						ch = getchar();
					} while (ch != '/');
				else if (ch == '/')			// line comment
					while (getchar() != '\n');
				else if (ch == '=')
					token.number = tdivAssign;
				else {
					token.number = tdiv;
					ungetc(ch, stdin);		// retract
				}


}


// checks if ch is alphabet or underscore(_)
bool MinicPGS::isSuperLetter(char ch) const
{
	return (isalpha(ch) || ch == '_');
}


// checks if ch is alphanumeric or underscore
bool MinicPGS::isSuperLetterOrDigit(char ch) const
{
    // isalnum(int c) checks if the passed character is alphanumeric
    return (isalnum(ch) || ch == '_');
}

