/**
 * uceasy - UCI API simplification (from hotspotd)
 * All rights reserved by Fon Wireless Ltd.
 *
 */

#include <uci.h>
#include <uci_blob.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <arpa/inet.h>
#include <syslog.h>
#include "uceasy.h"

static struct uci_context *uci = NULL;
static char *package = NULL;
static struct uci_package *uci_package;
static struct uci_blob_param_list _param_list;
static char *sections[MAX_SECTIONS] = {NULL};
static char *config = NULL;

int config_init(const char *name) {
	config_deinit();
	if (!(package = strdup(name))
	|| !(uci = uci_alloc_context()) || uci_load(uci, package, &uci_package))
		return -1;
	config = strdup(name);	
	return 0;
}

void config_free_sections() {
	for(int ii=0; ii<MAX_SECTIONS; ii++) {
		if(sections[ii]) {
			free(sections[ii]);
			sections[ii] = NULL;
		} else {
			break;
		}
	}
}

void config_deinit() {
	if (uci) {
		uci_free_context(uci);
		uci = NULL;
	}
	if (package) {
		free(package);
		package = NULL;
	}
	if (sections[0]) {
		config_free_sections();
	}
	if(config) {
		free(config);
		config = NULL;
	}
}

const char* config_get_string(const char *sec, const char *opt, const char *def) {
	struct uci_ptr ptr = {
		.package = package,
		.section = sec,
		.option = opt
	};
	if (!uci_lookup_ptr(uci, &ptr, NULL, false)
	&& (ptr.flags & UCI_LOOKUP_COMPLETE)) {
		struct uci_element *e = ptr.last;
		if (e->type == UCI_TYPE_SECTION) {
			return uci_to_section(e)->type;
		} else if (e->type == UCI_TYPE_OPTION
		&& ptr.o->type == UCI_TYPE_STRING) {
			return ptr.o->v.string;
		}
	}
	return def;
}

int config_foreach_list(const char *sec, const char *opt, void(*cb)(const char*, void*), void *ctx) {
	struct uci_ptr ptr = {
		.package = package,
		.section = sec,
		.option = opt
	};

	if (uci_lookup_ptr(uci, &ptr, NULL, false)
	|| !(ptr.flags & UCI_LOOKUP_COMPLETE)
	|| ptr.last->type != UCI_TYPE_OPTION
	|| ptr.o->type != UCI_TYPE_LIST)
		return -1;

	struct uci_element *e;
	uci_foreach_element(&ptr.o->v.list, e)
		cb(e->name, ctx);

	return 0;
}

int config_section_exists(const char *name) {
	struct uci_section *s;
	if(!(s = uci_lookup_section(uci, uci_package, name))) {
		return 0;
	}
	return 1;
}

int config_add_section(const char *name, const char *type) {
	int ret;
	
	struct uci_ptr ptr = {
		.p = uci_package,
		.value = name
	};

	if ((ret = uci_add_section(uci, uci_package, type, &(ptr.s)))) {
		return ret;
	}
	return uci_rename(uci, &ptr);
}

int config_del_section(const char *name) {
	struct uci_ptr ptr = {
		.package = package,
		.section = name
	};
	return uci_delete(uci, &ptr);
}

int config_get_type(const char *name, char **type) {
	struct uci_section *s;	
	if(!(s = uci_lookup_section(uci, uci_package, name)))
		return -1;
	
	*type = strdup(s->type);
	return 0;
}

int config_get_sections(char ***_sections, const char *type) {
	struct uci_element *e;
	int ii=0;
	bool all = false;

	if(sections[0]) {
		config_free_sections();
	}

	if (!strcmp(type, "all")) {
		all = true;
	}

	uci_foreach_element(&uci_package->sections, e) {
		struct uci_section *s = uci_to_section(e);
		if (all || !strcmp(s->type, type)) {
			if((sections[ii] = (char *)malloc(strlen(s->e.name)))) {
				strncpy(sections[ii++], s->e.name, strlen(s->e.name)+1);
			} else {
				return -1;
			}
		}
	}
	*_sections = sections;
	return 0;
}

void config_foreach_section_type(const char *t, void (*cb)(struct uci_section*, void*), void *priv) {
	struct uci_element *e;
	uci_foreach_element(&uci_package->sections, e) {
		struct uci_section *s = uci_to_section(e);
		if (!strcmp(t, s->type))
			cb(s, priv);
	}
}

void config_foreach_section_option(struct uci_section *s, void (*cb)(const char*, const char*, void*), void *priv) {
	struct uci_element *e;
	uci_foreach_element(&s->options, e) {
		struct uci_option *o = uci_to_option(e);
		cb(o->e.name, o->v.string, priv);
	}

}

const int config_get_int(const char *sec, const char *opt, int def) {
	const char *val = config_get_string(sec, opt, NULL);
	return (!val) ? def : atoi(val);
}

const bool config_get_bool(const char *sec, const char *opt, bool def) {
	const char *val = config_get_string(sec, opt, NULL);
	if(!val) 
		return def;
	if(!strcmp(val, "true") || (atoi(val) == 1)) {
		return true;
	}
	if(!strcmp(val, "false") || !atoi(val)) {
		return false;
	}
	return def;	
}

int config_set_int(const char *sec, const char *opt, int val) {
	char buf[32];
	sprintf(buf, "%d", val);
	return config_set_string(sec, opt, buf);
}

int config_set_bool(const char *sec, const char *opt, bool val) {
	char buf[2];
	sprintf(buf, "%d", val);
	return config_set_string(sec, opt, buf);
}

int config_get_ipv4(struct in_addr *addr, const char *sec, const char *opt) {
	struct in_addr tmpaddr;
	const char *val = config_get_string(sec, opt, NULL);
	if (!val || inet_pton(AF_INET, val, &tmpaddr) < 0)
		return -1;

	*addr = tmpaddr;
	return 0;
}

int config_get_ipv6(struct in6_addr *addr, const char *sec, const char *opt) {
	struct in6_addr tmpaddr;
	const char *val = config_get_string(sec, opt, NULL);
	if (!val || inet_pton(AF_INET6, val, &tmpaddr) < 0)
		return -1;

	*addr = tmpaddr;
	return 0;
}

int config_set_type(const char *sec, const char *type) 
{
	struct uci_ptr ptr = {
		.package = package,
		.section = sec,
	};

	char extstr[64];
	sprintf(extstr, "%s.%s=%s", config, sec, type);
	if (!uci_lookup_ptr(uci, &ptr, extstr, true)) {
		return uci_set(uci, &ptr);
	} else {
		return -1;
	}
}

static int config_set(const char *sec, const char *opt, const char *val, int list) {
	struct uci_ptr ptr = {
		.package = package,
		.section = sec,
		.option = opt,
		.value = val
	};

	if (uci_lookup_ptr(uci, &ptr, NULL, false)) {
		return -1;
	} else if (list) {
		return uci_add_list(uci, &ptr);
	} else if (val) {
		return uci_set(uci, &ptr);
	} else {
		return uci_delete(uci, &ptr);
	}
	return 0;
}


int config_to_blob(struct blob_buf *b, const char *sec, const struct
uci_blob_param_list param_list)
{
	struct uci_section *s;
	_param_list.params = param_list.params;
	_param_list.n_params = param_list.n_params;

	if(!(s = uci_lookup_section(uci, uci_package, sec))) 
		return -1;
	
	if(!uci_to_blob(b, s, &_param_list)) 
		return -1;
	return 0;
}

int config_add_string(const char *sec, const char *opt, const char *val) {
	return (!val) ? -1 : config_set(sec, opt, val, 1);
}

int config_set_string(const char *sec, const char *opt, const char *val) {
	return config_set(sec, opt, val, 0);
}

int config_commit() {
	struct uci_ptr ptr = { .package = package };
	if (uci_lookup_ptr(uci, &ptr, NULL, false))
		return -1;
	return uci_commit(uci, &ptr.p, false);
}
