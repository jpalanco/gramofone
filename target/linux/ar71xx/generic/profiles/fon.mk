#
# Copyright (c) 2013 Fon Technology S.L.
# Copyright (C) 2009-2010 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

define Profile/FON2415
	NAME:=Fonera Hub FON2415
	PACKAGES:=kmod-usb-core kmod-usb2 kmod-sound-core kmod-sound-soc-fon2415
endef

define Profile/FON2415/Description
	Package set optimized for the Fonera HUB/Juke/Gramofon/... FON2415 board.
endef

$(eval $(call Profile,FON2415))

define Profile/FON2415_4M
	NAME:=Fonera Hub FON2415 4M
	PACKAGES:=kmod-usb-core kmod-usb2
endef

define Profile/FON2415_4M/Description
	Package set optimized for the Atheros FON2415 reference board 4M.
endef

$(eval $(call Profile,FON2415_4M))
