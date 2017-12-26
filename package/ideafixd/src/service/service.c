/*
 * Copyright (C) 2013 Felix Fietkau <nbd@openwrt.org>
 * Copyright (C) 2013 John Crispin <blogic@openwrt.org>
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

#include <libubox/blobmsg_json.h>
#include <libubox/avl-cmp.h>
#include "../ideafixd.h"
#include "service.h"
#include "instance.h"

struct avl_tree services;
static struct blob_buf b;

enum {
	SERVICE_DEL_ATTR_NAME,
	SERVICE_DEL_ATTR_INSTANCE,
	__SERVICE_DEL_ATTR_MAX,
};

static const struct blobmsg_policy service_del_attrs[__SERVICE_DEL_ATTR_MAX] = {
	[SERVICE_DEL_ATTR_NAME] = { "name", BLOBMSG_TYPE_STRING },
	[SERVICE_DEL_ATTR_INSTANCE] = { "instance", BLOBMSG_TYPE_STRING },
};

static void service_delete(struct service *s)
{
	vlist_flush_all(&s->instances);
	avl_delete(&services, &s->avl);
	if(s->trigger) {
		trigger_del(s);
		free(s->trigger);
		s->trigger = NULL;
	}
	free(s);
	service_validate_del(s);
}

static int service_handle_delete(struct ubus_context *ctx, struct ubus_object *obj,
			struct ubus_request_data *req, const char *method,
			struct blob_attr *msg)
{
	struct blob_attr *tb[__SERVICE_DEL_ATTR_MAX], *cur;
	struct service *s;
	struct service_instance *in;

	blobmsg_parse(service_del_attrs, __SERVICE_DEL_ATTR_MAX, tb, blob_data(msg),
			blob_len(msg));

	cur = tb[SERVICE_DEL_ATTR_NAME];
	if (!cur)
		return UBUS_STATUS_NOT_FOUND;

	s = avl_find_element(&services, blobmsg_data(cur), s, avl);
	if (!s)
		return UBUS_STATUS_NOT_FOUND;

	cur = tb[SERVICE_DEL_ATTR_INSTANCE];
	if (!cur) {
		service_delete(s);
		return 0;
	}

	in = vlist_find(&s->instances, blobmsg_data(cur), in, node);
	if (!in) {
		syslog(LOG_ERR, "instance %s not found\n", (char *) blobmsg_data(cur));
		return UBUS_STATUS_NOT_FOUND;
	}

	vlist_delete(&s->instances, &in->node);

	return 0;
}

enum {
	SERVICE_ATTR_NAME,
	__SERVICE_ATTR_MAX,
};

enum {
	SERVICE_SET_NAME,
	SERVICE_SET_SCRIPT,
	SERVICE_SET_INSTANCES,
	SERVICE_SET_TRIGGER,
	SERVICE_SET_VALIDATE,
	__SERVICE_SET_MAX
};

static const struct blobmsg_policy service_set_attrs[__SERVICE_SET_MAX] = {
	[SERVICE_SET_NAME] = { "name", BLOBMSG_TYPE_STRING },
	[SERVICE_SET_SCRIPT] = { "script", BLOBMSG_TYPE_STRING },
	[SERVICE_SET_INSTANCES] = { "instances", BLOBMSG_TYPE_TABLE },
	[SERVICE_SET_TRIGGER] = { "triggers", BLOBMSG_TYPE_ARRAY },
	[SERVICE_SET_VALIDATE] = { "validate", BLOBMSG_TYPE_ARRAY },
};

static void service_instance_add(struct service *s, struct blob_attr *attr)
{
	struct service_instance *in;

	if (blobmsg_type(attr) != BLOBMSG_TYPE_TABLE)
		return;

	in = calloc(1, sizeof(*in));
	if (!in)
		return;

	instance_init(in, s, attr);
	vlist_add(&s->instances, &in->node, (void *) in->name);
}

static int service_update(struct service *s, struct blob_attr *config, 
		struct blob_attr **tb, bool add)
{
	struct blob_attr *cur;
	int rem;

	if (s->trigger) {
		trigger_del(s);
		free(s->trigger);
		s->trigger = NULL;
	}

	service_validate_del(s);

	if (tb[SERVICE_SET_TRIGGER] && blobmsg_data_len(tb[SERVICE_SET_TRIGGER])) {
		s->trigger = malloc(blob_pad_len(tb[SERVICE_SET_TRIGGER]));
		if (!s->trigger)
			return -1;
		memcpy(s->trigger, tb[SERVICE_SET_TRIGGER],
			blob_pad_len(tb[SERVICE_SET_TRIGGER]));
		trigger_add(s->trigger, s);
	}

	if (tb[SERVICE_SET_VALIDATE] && blobmsg_data_len(tb[SERVICE_SET_VALIDATE])) 
	{
		blobmsg_for_each_attr(cur, tb[SERVICE_SET_VALIDATE], rem)
			service_validate_add(s, cur);
	}

	if (tb[SERVICE_SET_INSTANCES]) {
		if (!add)
			vlist_update(&s->instances);
		blobmsg_for_each_attr(cur, tb[SERVICE_SET_INSTANCES], rem) {
			service_instance_add(s, cur);
		}
		if (!add)
			vlist_flush(&s->instances);
	}

	return 0;
}

static void service_instance_update(struct vlist_tree *tree, 
		struct vlist_node *node_new,
		struct vlist_node *node_old)
{
	struct service_instance *in_o = NULL, *in_n = NULL;

	if (node_old)
		in_o = container_of(node_old, struct service_instance, node);

	if (node_new)
		in_n = container_of(node_new, struct service_instance, node);

	if (in_o && in_n) {
		syslog(LOG_DEBUG, "Update instance %s::%s\n", in_o->srv->name, in_o->name);
		instance_update(in_o, in_n);
		instance_free(in_n);
	} else if (in_o) {
		syslog(LOG_DEBUG, "Free instance %s::%s\n", in_o->srv->name, in_o->name);
		instance_stop(in_o);
		instance_free(in_o);
	} else if (in_n) {
		syslog(LOG_DEBUG, "Create instance %s::%s\n", in_n->srv->name, in_n->name);
		instance_start(in_n);
	}
}

static struct service *service_alloc(const char *name)
{
	struct service *s;
	char *new_name;

	s = calloc_a(sizeof(*s), &new_name, strlen(name) + 1);
	strcpy(new_name, name);

	vlist_init(&s->instances, avl_strcmp, service_instance_update);
	s->instances.keep_old = true;
	s->name = new_name;
	s->avl.key = s->name;
	INIT_LIST_HEAD(&s->validators);

	return s;
}

static int service_handle_set(struct ubus_context *ctx, struct ubus_object *obj,
			struct ubus_request_data *req, const char *method,
			struct blob_attr *msg)
{
	struct blob_attr *tb[__SERVICE_SET_MAX], *cur;
	struct service *s = NULL;
	const char *name;
	int ret = UBUS_STATUS_INVALID_ARGUMENT;
	bool add = !strcmp(method, "add");

	blobmsg_parse(service_set_attrs, __SERVICE_SET_MAX, tb, blob_data(msg),
			blob_len(msg));
	cur = tb[SERVICE_ATTR_NAME];
	if (!cur)
		goto free;

	name = blobmsg_data(cur);

	s = avl_find_element(&services, name, s, avl);
	if (s) {
		syslog(LOG_INFO, "Update service %s\n", name);
		return service_update(s, msg, tb, add);
	}

	syslog(LOG_DEBUG, "Create service %s\n", name);
	s = service_alloc(name);
	if (!s)
		return UBUS_STATUS_UNKNOWN_ERROR;

	ret = service_update(s, msg, tb, add);
	if (ret)
		goto free;

	avl_insert(&services, &s->avl);
	return 0;

free:
	free(msg);
	return ret;
}

enum {
	SERVICE_LIST_ATTR_VERBOSE,
	__SERVICE_LIST_ATTR_MAX,
};

static const struct blobmsg_policy service_list_attrs[__SERVICE_LIST_ATTR_MAX] =
{
	[SERVICE_LIST_ATTR_VERBOSE] = { "verbose", BLOBMSG_TYPE_BOOL },
};

static void service_dump(struct service *s, int verbose)
{
	struct service_instance *in;
	void *c, *i;

	c = blobmsg_open_table(&b, s->name);

	if (avl_is_empty(&s->instances.avl)) {
		blobmsg_close_table(&b, c);
		return;
	}

	i = blobmsg_open_table(&b, "instances");
	vlist_for_each_element(&s->instances, in, node)
		instance_dump(&b, in, verbose);
	blobmsg_close_table(&b, i);
	if (verbose && s->trigger)
		blobmsg_add_blob(&b, s->trigger);
	if (verbose && !list_empty(&s->validators))
		service_validate_dump(&b, s);
	blobmsg_close_table(&b, c);
}

static int service_handle_list(struct ubus_context *ctx, struct ubus_object *obj,
		struct ubus_request_data *req, const char *method,
		struct blob_attr *msg)
{
	struct blob_attr *tb[__SERVICE_LIST_ATTR_MAX];
	struct service *s;
	int verbose = 0;

	blobmsg_parse(service_list_attrs, __SERVICE_LIST_ATTR_MAX, tb,
		blob_data(msg), blob_len(msg));

	if (tb[SERVICE_LIST_ATTR_VERBOSE] &&
			blobmsg_get_bool(tb[SERVICE_LIST_ATTR_VERBOSE]))
		verbose = 1;

	blob_buf_init(&b, 0);
	avl_for_each_element(&services, s, avl)
		service_dump(s, verbose);

	ubus_send_reply(ctx, req, b.head);

	return 0;
}

static struct ubus_method main_object_methods[] = {
	UBUS_METHOD("set", service_handle_set, service_set_attrs),
	UBUS_METHOD("list", service_handle_list, service_list_attrs),
	UBUS_METHOD("delete", service_handle_delete, service_del_attrs),
};

static struct ubus_object_type main_object_type =
	UBUS_OBJECT_TYPE("service", main_object_methods);

static struct ubus_object main_object = {
	.name = "service",
	.type = &main_object_type,
	.methods = main_object_methods,
	.n_methods = ARRAY_SIZE(main_object_methods),
};

void ubus_init_service(struct ubus_context *ctx)
{
	ubus_add_object(ctx, &main_object);
}

void service_init(void)
{
	avl_init(&services, avl_strcmp, false, NULL);
	service_validate_init();
}

