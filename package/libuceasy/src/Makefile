LDFLAGS?=
LDFLAGS+=-luci -lubox
CFLAGS?=
CFLAGS+=-Wall -Werror -fPIC

all: libuceasy.so 

libuceasy.so: *.c
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS) -shared -Wl,-soname,libuceasy.so

clean:
	rm -rf *.so *.o
