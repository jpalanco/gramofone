include $(TOPDIR)/rules.mk

PKG_NAME:=libuceasy
PKG_RELEASE:=1
PKG_VERSION:=2014-04-09

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)
PKG_INSTALL_DIR:=$(PKG_BUILD_DIR)/ipkg-install

include $(INCLUDE_DIR)/package.mk

define Package/libuceasy
  SECTION:=fon
  CATEGORY:=Fon
  MANTAINER:=Fon Technology
  TITLE:=UCI API simplification library
  DEPENDS:=+libubox +libuci 
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ./src/* $(PKG_BUILD_DIR)/
endef

define Build/Compile
	$(TARGET_CONFIGURE_OPTS) \
		CFLAGS="$(TARGET_CFLAGS) -std=gnu99" \
		REAL_CFLAGS="$(TARGET_CFLAGS)" \
		LDFLAGS="$(TARGET_LDFLAGS)" \
		CONFIGURE_ARGS="$(CONFIGURE_ARGS)" \
		PKG_BUILD_DIR="$(PKG_BUILD_DIR)" \
		LIBTOOL="$(LIBTOOL)" \
		STAGING_DIR_HOST="$(STAGING_DIR_HOST)" \
		$(MAKE) -C $(PKG_BUILD_DIR)
endef

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_BUILD_DIR)/uceasy.h $(1)/usr/include
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_BUILD_DIR)/libuceasy.so $(1)/usr/lib
endef

define Package/libuceasy/install
	$(INSTALL_DIR) $(1)/lib
	$(CP) $(PKG_BUILD_DIR)/libuceasy.so $(1)/lib/
endef

$(eval $(call BuildPackage,libuceasy))

