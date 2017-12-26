# 
# Copyright (c) 2013 Qualcomm Atheros, Inc.
# Copyright (C) 2006-2011 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=libvorbisidec
PKG_VERSION:=1.0.2+svn16259
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)_$(PKG_VERSION).orig.tar.gz
PKG_SOURCE_URL:=http://ftp.de.debian.org/debian/pool/main/libv/libvorbisidec/
PKG_MD5SUM:=93dd41dd5344a1ad9f51589af6978948

PKG_FIXUP:=autoreconf
PKG_INSTALL:=1

include $(INCLUDE_DIR)/package.mk

define Package/libvorbisidec
  SECTION:=libs
  CATEGORY:=Libraries
  TITLE:=A fixed-point Ogg/Vorbis decoder library
  URL:=http://wiki.xiph.org/index.php/Tremor
  DEPENDS:=+libogg
endef

define Package/libvorbisidec/description
	libvorbisidec is "tremor", a fixed-point implementation of libvorbis.
	It also has libogg built-in. It is suitable as a replacement for 
	libvorbis and libogg in tremor-aware applications.
	Tremor is a decoder only.
endef

TARGET_CFLAGS += $(FPIC)
CONFIGURE_ARGS += --enable-shared --enable-static

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_INSTALL_DIR)/usr/include/tremor $(1)/usr/include/
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libvorbisidec.{a,so*} $(1)/usr/lib/
	$(INSTALL_DIR) $(1)/usr/lib/pkgconfig/
	$(INSTALL_DATA) ./vorbisidec.pc $(1)/usr/lib/pkgconfig/
endef

define Package/libvorbisidec/install
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libvorbisidec.so.* $(1)/usr/lib/
endef

$(eval $(call BuildPackage,libvorbisidec))
