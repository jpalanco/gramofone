/*
 * Copyright (C) 2014 Fon Wireless Ltd. 
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License version 2.1
 * as published by the Free Software Foundation
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

#include <unistd.h>
#include <stdio.h>
#include <uceasy.h>
#include <string.h>
#include <signal.h>
#include "libubus.h"
#include "ideafixd.h"
#include "service/service.h"
#include "watchdog.h"

static void handle_exit_signal(int signal)
{
	syslog(LOG_INFO,"received signal %d\n", signal);
	watchdog_disable();
	uloop_end();
}

int ideafixd_reload_config(void)
{
	if(config_init("ideafixd")) {
		syslog(LOG_ERR, "could not open config file");
		return -1;
	}
	
	instance_default_respawn_timeout = config_get_int("instance",
			"respawn_timeout", 5);
	instance_default_respawn_threshold = config_get_int("instance",
			"respawn_threshold", 1);
	instance_default_respawn_retry = config_get_int("instance", "respawn_retry",
			5000);
	watchdog_tout = config_get_int("watchdog", "timeout", 30);
	watchdog_freq = config_get_int("watchdog", "frequency", 5);
	return 0;
}

int main(int argc, char **argv)
{
	int ch, ret = 0;

	while ((ch = getopt(argc, argv, "s:")) != -1) {
		switch (ch) {
		case 's':
			ubus_socket = optarg;
			break;
		default:
			break;
		}
	}

	argc -= optind;
	argv += optind;

	openlog("ideafixd", 0, LOG_DAEMON);

	signal(SIGINT, handle_exit_signal);
	signal(SIGTERM, handle_exit_signal);
	
	if(ideafixd_reload_config()) {
		return -1;
	}

	service_init();
	watchdog_init();
	uloop_init();
	ideafixd_connect_ubus();

	syslog(LOG_DEBUG, "Woof Woof! Process monitor started!");
	uloop_run();

	ideafixd_disconnect_ubus();
	uloop_done();
	config_deinit();
	closelog();
	return ret;
}
