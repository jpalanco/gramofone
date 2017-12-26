#
# Copyright (C) 2013 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=python-cleaner
PKG_VERSION:=0.14.3
PKG_RELEASE:=0

include $(INCLUDE_DIR)/package.mk

define Package/python-cleaner
  SUBMENU:=Python
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=python-cleaner
  DEPENDS:=+python +pykka +gst-python +mopidy +mopidy-wahwah +mopidy-rpc
endef

define Package/python-cleaner/description
	Python cleaner forces the install of all necessary gramofon python packages
and modifies the system's python installation: it installs only compiled .pyc
python files and removes unused python modules to spare flash space. Any python
package must be recompiled to return to its original state after applying
python-cleaner.
endef

define Build/Compile
        echo "Nothing to do here...";
endef

define Package/python-cleaner/install
	$(INSTALL_DIR) $(1)/root/
	$(INSTALL_DATA) ./files/files_to_erase.sh $(1)/root/
endef

define Package/python-cleaner/postinst
	python -m compileall $${IPKG_INSTROOT}/usr/lib/python2.7/
	sh $${IPKG_INSTROOT}/root/files_to_erase.sh $${IPKG_INSTROOT}
	rm $${IPKG_INSTROOT}/root/files_to_erase.sh
	find $${IPKG_INSTROOT}/usr/lib/python2.7/ -name "*.py" -exec rm -rf {} \;
endef


$(eval $(call BuildPackage,python-cleaner))
