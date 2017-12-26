#!/bin/sh

PROCESSESFILE=/etc/ideafixtest_processes
npids=0
randomprocess=
randompid=

choose_random_pid() {
	npids=`cat $PROCESSESFILE | wc -l`
	index=`grep -m1 -ao [0-$(($npids-1))] /dev/urandom | sed s/0/$npids/ | head -n1`
	sedargs="${index}p"
	randomprocess=`sed -n $sedargs < $PROCESSESFILE`
	randompid=`pidof $randomprocess`
}

check_instance_running() {
	if [[ -z "$(pgrep $randomprocess)" ]]; then
		return 0
	else 
		return 1
	fi
}

while true; do
	choose_random_pid
	echo "Killing $randomprocess..."
	kill -9 "$randompid"
	sleep 1
	check_instance_running
	if [[  $? -eq 0 ]]; then
		echo "$randomprocess exited OK"
		sleep 5
		check_instance_running
		if [[ $? -eq 1 ]]; then
			echo "$randomprocess respawned OK"
		else
			echo "$randomprocess not respawned KO"
		fi
	else 
		echo "$randomprocess did not exit KO"
	fi
	sleep 1
done

