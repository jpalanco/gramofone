#
# Copyright (C) 2013 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=pykka
PKG_VERSION:=1.2.0
PKG_RELEASE:=1
PKG_SOURCE:=v$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/jodal/pykka/archive/

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/pykka
  SUBMENU:=Python
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=pykka
  DEPENDS:=+python
endef

define Build/Compile
	cd $(PKG_BUILD_DIR) ; $(CONFIGURE_VARS) $(MAKE_VARS) python ./setup.py install --prefix="$(PKG_INSTALL_DIR)/usr"
endef

define Package/pykka/install
	$(INSTALL_DIR) $(1)
	$(CP) $(PKG_INSTALL_DIR)/* $(1)/
endef

$(eval $(call BuildPackage,pykka))

