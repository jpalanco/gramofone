#!/bin/sh

[ -n $1 ] && interface = -i $1

for dir in /var/run/hostapd-*; do
	[ -d "$dir" ] || continue
	hostapd_cli -p "$dir" ${interface:-} wps_pbc
done
