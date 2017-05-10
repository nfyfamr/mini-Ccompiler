#include <string>
#include <map>
#include <vector>


class Token;

class MinicPGS
{

private:
// 	const int NO_KEYWORDS	= 7;
// 	const int ID_LENGTH		= 12;
	std::map<std::string, int> token_type;

	void lexicalError(int); 
	bool isSuperLetter(char) const;
	bool isSuperLetterOrDigit(char) const;
	int getIntNum(char);
	int hexValue(char);

public:
	MinicPGS(const std::string&);
	virtual ~MinicPGS();
	virtual void print_token() const;
	virtual int type_number_of(const char*) const;
	virtual std::vector<Token> parse(const std::string&) const;
};



// tokenType struct
class Token
{
public:
	std::string *raw;
	int number;			// token number;
	union {
		char id[7];
		int num;
	};
};


