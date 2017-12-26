# 
# Copyright (C) 2008 David Cooper <dave@kupesoft.com>
# Copyright (C) 2006-2012 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=sox
PKG_VERSION:=14.4.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.bz2
PKG_SOURCE_URL:=@SF/sox
PKG_MD5SUM:=813807c6d6fcd4b0af5c995e61f46687

PKG_FIXUP:=autoreconf

PKG_INSTALL:=1

include $(INCLUDE_DIR)/package.mk

TARGET_LDFLAGS+= \
	-Wl,-rpath-link=$(STAGING_DIR)/usr/lib

# NOTE: libflac is out of date for 8.09's freeze and can't be compiled in

define Package/sox
  SECTION:=sound
  CATEGORY:=Sound
  DEPENDS:=+libvorbis +libvorbisidec +alsa-lib +libgsm +libsndfile
  TITLE:=Sox is a general purpose sound converter/player/recorder
  URL:=http://sox.sourceforge.net/
  MAINTAINER:=Hamish Guthrie <hcg@openwrt.org>
endef

define Package/sox/description
	SoX is a command line utility that can convert various formats
	of computer audio files in to other formats. It can also apply
	various effects to these sound files during the conversion.
	As an added bonus, SoX can play and record audio files on
	several unix-style platforms.
endef

define Build/Configure
	$(call Build/Configure/Default, \
		--disable-external-gsm \
		--enable-oss \
		--disable-alsa \
		--disable-libao \
		--without-libltdl \
		--without-ogg \
		--without-flac \
		--without-ffmpeg \
		--without-amr-wb \
		--without-amr-nb \
		--without-samplerate \
		--without-ladspa \
		--without-mad \
		--without-lame \
		--without-id3tag \
		--without-magic \
		--without-twolame \
		--without-png \
	)
endef

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) \
		$(PKG_INSTALL_DIR)/usr/include \
		$(1)/usr/include/
	$(INSTALL_DIR) $(1)/usr/lib/pkgconfig
	$(CP) \
		$(PKG_INSTALL_DIR)/usr/lib/libsox.{a,so*,la} \
		$(1)/usr/lib/
	$(INSTALL_DATA) \
		$(PKG_INSTALL_DIR)/usr/lib/pkgconfig/* \
		$(1)/usr/lib/pkgconfig/
endef

define Package/sox/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/bin/{play,rec,sox} $(1)/usr/bin/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libsox.so* $(1)/usr/lib/
endef

$(eval $(call BuildPackage,sox))

