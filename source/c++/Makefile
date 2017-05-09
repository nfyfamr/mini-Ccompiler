
CC=g++
CFLAGS=-c -std=c++11
OBJECTS=main.o minic-pgs.o


all: $(OBJECTS)
	$(CC) $(OBJECTS) -o minic

%.o : %.cpp
	$(CC)  $(CFLAGS) $< -o $@

clean:
	rm -rf minic *.o

re: clean all
	./minic 123
