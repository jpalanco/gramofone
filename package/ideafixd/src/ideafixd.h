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

#ifndef __IDEAFIXD_H
#define __IDEAFIXD_H

#include <libubus.h> 
#include <syslog.h>

extern char *ubus_socket;
int watchdog_tout;
int watchdog_freq;
uint32_t instance_default_respawn_timeout;
uint32_t instance_default_respawn_threshold;
uint32_t instance_default_respawn_retry;

int ideafixd_reload_config(void);
void ideafixd_connect_ubus(void);
void ideafixd_disconnect_ubus(void);
void ubus_init_service(struct ubus_context *ctx);

struct trigger;
void trigger_init(void);
void trigger_event(char *type, struct blob_attr *data);
void trigger_add(struct blob_attr *rule, void *id);
void trigger_del(void *id);

#endif /* __IDEAFIXD_H */
