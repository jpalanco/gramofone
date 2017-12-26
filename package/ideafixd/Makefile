include $(TOPDIR)/rules.mk

PKG_NAME:=ideafixd
PKG_RELEASE:=1
PKG_VERSION:=2014-01-21

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)
PKG_INSTALL_DIR:=$(PKG_BUILD_DIR)/ipkg-install

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk

TARGET_LDFLAGS += $(if $(CONFIG_USE_EGLIBC),-lrt)

define Package/ideafixd
  SECTION:=fon
  CATEGORY:=Fon
  TITLE:=Software WatchDog
  DEPENDS:=+ubus \
	+libubox \
	+libjson-script \
	+libuceasy
endef

define Package/ideafixd_test
  SECTION:=fon
  CATEGORY:=Fon
  TITLE:=ideafixd test script
endef

define Package/ideafixd/description
	Software Watchdog for monitorization of processes based in procd monitor
functionality (version 2dc572df0e3002263c0a4) and Hardware Watchdog.
endef

define Package/ideafixd_test/config
	depends on PACKAGE_ideafixd
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ./src/* $(PKG_BUILD_DIR)/
endef

define Package/ideafixd/install
	$(INSTALL_DIR) $(1)/sbin $(1)/etc/init.d $(1)/etc/config $(1)/lib/functions
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/ideafixd $(1)/sbin/
	$(INSTALL_BIN) ./files/ideafixd.init $(1)/etc/init.d/ideafixd
	$(INSTALL_DATA) ./files/etc/config/ideafixd $(1)/etc/config/ideafixd
	$(INSTALL_DATA) ./files/ideafixd.sh $(1)/lib/functions/
endef

define Package/ideafixd_test/install
	$(INSTALL_DIR) $(1)/bin $(1)/etc
	$(INSTALL_BIN) ./files/test/ideafixtest.sh $(1)/bin/
	$(INSTALL_DATA) ./files/test/processes $(1)/etc/ideafixtest_processes
endef

$(eval $(call BuildPackage,ideafixd))
$(eval $(call BuildPackage,ideafixd_test))
