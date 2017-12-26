#
# Copyright (C) 2012 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=mopidy-rpc
PKG_VERSION:=0.0.5
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
#PKG_SOURCE_URL:=git@github.com:fonlabs/mopidy-rpc.git
#PKG_SOURCE_URL:=gitosis@veriton.fon.ofi:mopidy-rpc.git
PKG_SOURCE_URL:=git@gitlab.fon.ofi:labs-dev/mopidy-rpc.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=08233c754404866a91fb3f17d4c93396db94a6af
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.gz

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)
PKG_BUILD_DEPENDS:=python

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/mopidy-rpc
  SUBMENU:=Python
  SECTION:=multimedia
  CATEGORY:=Multimedia
  TITLE:=mopidy-rpc
  URL:=http://www.mopidy.com/
  DEPENDS:=+mopidy
endef

define Package/mopidy-rpc/description
  RPC frontend extension for Mopidy
endef

define Build/Compile
	$(INSTALL_DIR) $(PKG_INSTALL_DIR)/usr/lib/python2.7/site-packages/
	cd $(PKG_BUILD_DIR); PYTHONPATH=$(PKG_INSTALL_DIR)/usr/lib/python2.7/site-packages/ \
		 $(CONFIGURE_VARS) $(MAKE_VARS) python ./setup.py install --prefix="$(PKG_INSTALL_DIR)/usr"
endef

define Package/mopidy-rpc/install
	$(INSTALL_DIR) $(1)$(PYTHON_PKG_DIR)
	$(CP) \
	    $(PKG_INSTALL_DIR)$(PYTHON_PKG_DIR)/* \
	    $(1)$(PYTHON_PKG_DIR)
	echo './Mopidy_RPC-$(PKG_VERSION)-py2.7.egg' > $(1)$(PYTHON_PKG_DIR)/Mopidy_RPC.pth
endef

$(eval $(call BuildPackage,mopidy-rpc))
