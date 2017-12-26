include $(TOPDIR)/rules.mk

PKG_NAME:=webui
PKG_RELEASE:=1
PKG_VERSION:=2014-03-18

#PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)
PKG_INSTALL_DIR:=$(PKG_BUILD_DIR)/ipkg-install

include $(INCLUDE_DIR)/package.mk

define Package/webui
  SECTION:=fon
  CATEGORY:=Fon
  MANTAINER:=Fon Technology
  TITLE:=WebUI
  DEPENDS:=+rpcd-mod-iwinfo
endef

define Build/Prepare
endef

define Build/Compile
endef

define Package/webui/install
	$(INSTALL_DIR) $(1)/www
	$(INSTALL_DATA) ./files/www/*.html $(1)/www/
	mkdir $(1)/www/css/
	$(INSTALL_DATA) ./files/www/css/*.css $(1)/www/css/
	mkdir $(1)/www/fonts/
	$(INSTALL_DATA) ./files/www/fonts/* $(1)/www/fonts/
	mkdir $(1)/www/images/
	$(INSTALL_DATA) ./files/www/images/*.gif $(1)/www/images/
	$(INSTALL_DATA) ./files/www/images/*.png $(1)/www/images/
	mkdir $(1)/www/js/
	$(INSTALL_DATA) ./files/www/js/*.js $(1)/www/js/
endef

$(eval $(call BuildPackage,webui))

