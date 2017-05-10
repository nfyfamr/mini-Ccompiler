#include <iostream>
#include <string>
#include <algorithm>
#include "minic-pgs.hpp"

using namespace std;

int main(int argc, char** argv)
{

	const string token_file_path = "./config/tokenType";
	const string source_path = "../../test/prime.mc";

	// check if valid input
	if (argc != 2)
	{
		cout << "Usage : minic [file]" << endl;
		exit(1);
	}

	// create minic_pgs
	MinicPGS pgs(token_file_path);

	// parse source file to token vector
	auto tokens = pgs.parse(source_path);

	// print token vector
	for_each(tokens.begin(), tokens.end(),
		[&pgs](Token& token)
		{
			if (token.number == pgs.type_number_of("tident"))
			{
				cout << "token number: " << token.number << "(identifier)" << endl;
				cout << "identifier name: " << token.id << endl;
			}
			else if (token.number == pgs.type_number_of("tnumber"))
			{
				cout << "token number: " << token.number << "(integer value)" << endl;
				cout << "identifier name: " << token.num << endl;
			}
			else
			{
				cout << "token number: " << token.number << endl;
			}
		});

	return 0;
}
