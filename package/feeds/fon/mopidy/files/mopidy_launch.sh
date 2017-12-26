#!/bin/sh

. $IPKG_INSTROOT/lib/functions.sh

start() {
	
	[ -n $PID ] && stop

	mopidy_config_mapper
	config_load audiod
	config_get_bool _verbose mopidy verbose 0	
	[ $_verbose -gt 0 ] && /usr/bin/mopidy -v 2>&1 | logger -t mopidy &
	[ $_verbose -eq 0 ] && /usr/bin/mopidy 2>&1 | logger -t mopidy &
}

stop() {
	touch /tmp/mopidy_launching_stop

	kill $PID

	tries=0
	sleep 2
	while [ -n "$PID" -a -d "/proc/$PID" -a $tries -lt 3 ]; do
		tries=$(($tries+1))
		kill $PID
		sleep 2
	done	

	[ -n "$PID" -a -d "/proc/$PID" ] && kill -9 $PID && sleep 1
	
	rm /tmp/mopidy_launching_stop
}

restart() {
	start
}

touch /tmp/mopidy_launching

# Exit if mopidy_launch start is already running, wait a little if being stopped
launch_tries=0
while [ -f /tmp/mopidy_launching_stop -a $launch_tries -lt 4 ]; do
	launch_tries=$(($launch_tries+1))
	sleep 2
done

rm /tmp/mopidy_launching

[ -f /tmp/mopidy_launching ] && logger -t mopidy_launch.sh "mopidy already being launched. Exiting." && exit

touch /tmp/mopidy_launching
PID=`ps | grep mopidy | grep python | awk '{print $1}'`
$1
rm /tmp/mopidy_launching
