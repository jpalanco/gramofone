#
# Copyright (C) 2012 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=wahwah
PKG_VERSION:=0.4.6
PKG_RELEASE:=0

PKG_SOURCE_PROTO:=git
#PKG_SOURCE_URL:=git@github.com:fonlabs/wahwah.git
#PKG_SOURCE_URL:=gitosis@veriton.fon.ofi:wahwah.git
PKG_SOURCE_URL:=git@gitlab.fon.ofi:labs-dev/wahwah.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=636529cf1cd946b0c975020945aeab619502dfd3
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.gz

PKG_LICENSE:=PUBLICDOMAIN BSD
PKG_LICENSE_FILES:=

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)
PKG_BUILD_DEPENDS:=python

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/wahwah
  SUBMENU:=Python
  SECTION:=multimedia
  CATEGORY:=Multimedia
  TITLE:=wahwah
endef

define Build/Compile
	$(INSTALL_DIR) $(PKG_INSTALL_DIR)/usr/lib/python2.7/site-packages/
	cd $(PKG_BUILD_DIR); PYTHONPATH=$(PKG_INSTALL_DIR)/usr/lib/python2.7/site-packages/ \
			$(CONFIGURE_VARS) $(MAKE_VARS) python ./setup.py install --prefix="$(PKG_INSTALL_DIR)/usr"
endef

define Package/wahwah/install
	$(INSTALL_DIR) $(1)$(PYTHON_PKG_DIR)
	$(CP) \
	    $(PKG_INSTALL_DIR)$(PYTHON_PKG_DIR)/* \
	    $(1)$(PYTHON_PKG_DIR)
	echo './wahwah-$(PKG_VERSION)-py2.7.egg' > $(1)$(PYTHON_PKG_DIR)/wahwah.pth
endef

$(eval $(call BuildPackage,wahwah))
