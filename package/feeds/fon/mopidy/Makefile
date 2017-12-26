#
# Copyright (C) 2013 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=mopidy
PKG_VERSION:=0.17.8
PKG_RELEASE:=0

PKG_SOURCE_PROTO:=git
#PKG_SOURCE_URL:=git@github.com:fonlabs/mopidy.git
#PKG_SOURCE_URL:=gitosis@veriton.fon.ofi:mopidy.git
PKG_SOURCE_URL:=git@gitlab.fon.ofi:labs-dev/mopidy.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=16b544dc37ab66e079e2e1b3147b722847468b1b
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.gz

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/mopidy
  SUBMENU:=Python
  SECTION:=multimedia
  CATEGORY:=Multimedia
  TITLE:=mopidy
  DEPENDS:=+python +pykka +gst-python +libuceasy
endef

define Build/Configure
	sh ./files/setuptools-0.6c11-py2.7.egg
endef

define Build/Compile
	$(INSTALL_DIR) $(PKG_INSTALL_DIR)/usr/lib/python2.7/site-packages/
	cd $(PKG_BUILD_DIR); PYTHONPATH=$(PKG_INSTALL_DIR)/usr/lib/python2.7/site-packages/ \
		$(CONFIGURE_VARS) $(MAKE_VARS) python ./setup.py install --prefix="$(PKG_INSTALL_DIR)/usr"
endef

define Package/mopidy/install
	$(INSTALL_DIR) $(1)/root/.config/mopidy/ $(1)/usr/bin/ $(1)/etc/config/
	$(INSTALL_DATA) ./files/mopidy.conf $(1)/root/.config/mopidy/
	$(INSTALL_DATA) ./files/mopidy $(1)/etc/config/
	$(INSTALL_BIN) ./files/mopidy_config_mapper $(1)/usr/bin/
	$(CP) $(PKG_INSTALL_DIR)/* $(1)
	sed -i '1d' $(1)/usr/bin/mopidy*
	sed -i '1 i #!/usr/bin/python'  $(1)/usr/bin/mopidy*
	$(INSTALL_BIN) ./files/mopidy_launch.sh $(1)/usr/bin/
	echo './Mopidy-$(PKG_VERSION)-py2.7.egg' > $(1)$(PYTHON_PKG_DIR)/Mopidy.pth
endef

$(eval $(call BuildPackage,mopidy))
