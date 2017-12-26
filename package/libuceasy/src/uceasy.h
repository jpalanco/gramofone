#ifndef UCEASY_H_
#define UCEASY_H_

#include <netinet/in.h>
#include <uci_blob.h>

#define MAX_SECTIONS 50

int config_init(const char *name);
void config_deinit();
int config_get_sections(char ***_sections, const char *type);
int config_add_section(const char *name, const char *type);
int config_del_section(const char *name);
int config_section_exists(const char *name);
int config_get_type(const char *name, char **type); 
int config_set_type(const char *sec, const char *type);
const char* config_get_string(const char *sec, const char *opt, const char *def);
const int config_get_int(const char *sec, const char *opt, int def);
const  bool config_get_bool(const char *sec, const char *opt, bool def);
int config_get_ipv4(struct in_addr *addr, const char *sec, const char *opt);
int config_get_ipv6(struct in6_addr *addr, const char *sec, const char *opt);
int config_add_string(const char *sec, const char *opt, const char *val);
int config_set_string(const char *sec, const char *opt, const char *val);
int config_set_bool(const char *sec, const char *opt, bool val);
int config_set_int(const char *sec, const char *opt, int val);
int config_foreach_list(const char *sec, const char *opt, void(*cb)(const char*, void*), void *ctx);
int config_commit();
int config_to_blob(struct blob_buf *b, const char *sec, const struct uci_blob_param_list param_list);
void config_foreach_section_type(const char *t, void (*cb)(struct uci_section*, void*), void *priv);
void config_foreach_section_option(struct uci_section *s, void (*cb)(const char*, const char*, void*), void *priv);

#endif /* UCEASY_H_ */
