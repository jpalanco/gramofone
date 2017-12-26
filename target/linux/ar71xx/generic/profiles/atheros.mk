#
# Copyright (c) 2013 Qualcomm Atheros, Inc.
# Copyright (C) 2009-2010 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

define Profile/AP113
	NAME:=Atheros AP113 reference board
	PACKAGES:=kmod-usb-core kmod-usb2
endef

define Profile/AP113/description
	Package set optimized for the Atheros AP113 reference board.
endef

$(eval $(call Profile,AP113))

define Profile/AP121
	NAME:=Atheros AP121 reference board
	PACKAGES:=kmod-usb-core kmod-usb2
endef

define Profile/AP121/Description
	Package set optimized for the Atheros AP121 reference board.
endef

$(eval $(call Profile,AP121))

define Profile/AP121MINI
	NAME:=Atheros AP121-MINI reference board
	PACKAGES:=
endef

define Profile/AP121MINI/Description
	Package set optimized for the Atheros AP121-MINI reference board.
endef

$(eval $(call Profile,AP121MINI))

define Profile/AP123
	NAME:=Atheros AP123 reference board
	PACKAGES:=kmod-usb-core kmod-usb2
endef

define Profile/AP123/Description
	Package set optimized for the Atheros AP123 reference board.
endef

$(eval $(call Profile,AP123))

define Profile/AP123AK4430
	NAME:=Atheros AP123 reference board with AK4430 extension
	PACKAGES:= \
	  kmod-usb-core kmod-usb2 kmod-sound-core kmod-sound-soc-ap123-ak4430
endef

define Profile/AP123AK4430/Description
	Package set optimized for the Atheros AP123 reference board with AK4430 extension.
endef

$(eval $(call Profile,AP123AK4430))

define Profile/AP123TB388
	NAME:=Atheros AP123 reference board with TB388 extension
	PACKAGES:= \
	  kmod-usb-core kmod-usb2 kmod-sound-core kmod-sound-soc-ap123-tb388
endef

define Profile/AP123TB388/Description
	Package set optimized for the Atheros AP123 reference board with TB388 extension.
endef

$(eval $(call Profile,AP123TB388))

define Profile/AP135
	NAME:=Atheros AP135 reference board
	PACKAGES:=kmod-usb-core kmod-usb2 kmod-usb-storage
endef

define Profile/AP135/Description
	Package set optimized for the Atheros AP135 reference board.
endef

$(eval $(call Profile,AP135))

define Profile/AP135DUAL
	NAME:=Atheros AP135 Dual reference board
	PACKAGES:=kmod-usb-core kmod-usb2 kmod-usb-storage
endef

define Profile/AP135DUAL/Description
	Package set optimized for the Atheros AP135 reference board.
	This profile differs from the original AP135 profile as it is configured
	to boot from NOR, but mount the NAND flash as an overlay partition.
endef

$(eval $(call Profile,AP135DUAL))

define Profile/AP136
	NAME:=Atheros AP136 reference board
	PACKAGES:=kmod-usb-core kmod-usb2 kmod-usb-storage
endef

define Profile/AP136/Description
	Package set optimized for the Atheros AP136 reference board.
endef

$(eval $(call Profile,AP136))

define Profile/AP81
	NAME:=Atheros AP81 reference board
	PACKAGES:=kmod-usb-core kmod-usb2
endef

define Profile/AP81/Description
	Package set optimized for the Atheros AP81 reference board.
endef

$(eval $(call Profile,AP81))

define Profile/AP83
	NAME:=Atheros AP83 reference board
	PACKAGES:=kmod-usb-core kmod-usb2 \
		  vsc7385-ucode-ap83 vsc7395-ucode-ap83
endef

define Profile/AP83/Description
	Package set optimized for the Atheros AP83 reference board.
endef

$(eval $(call Profile,AP83))

define Profile/AP96
	NAME:=Atheros AP96 reference board
	PACKAGES:=kmod-usb-core kmod-usb2
endef

define Profile/AP96/Description
	Package set optimized for the Atheros AP96 reference board.
endef

$(eval $(call Profile,AP96))

define Profile/CUS227
       NAME:=Qualcomm Atheros CUS227 board
       PACKAGES:=kmod-usb-core kmod-usb2 kmod-sound-soc-cus227
endef

define Profile/CUS227/Description
       Package set optimized for the Qualcomm Atheros CUS227 reference board.
endef

$(eval $(call Profile,CUS227))

define Profile/DB120
	NAME:=Atheros DB120 reference board
	PACKAGES:=kmod-usb-core kmod-usb2 kmod-usb-storage
endef

define Profile/DB120/Description
	Package set optimized for the Atheros DB120 reference board.
endef

$(eval $(call Profile,DB120))

define Profile/DB120TB388
	NAME:=Atheros DB120 reference board with TB388 extension
	PACKAGES:= \
	  kmod-usb-core kmod-usb2 kmod-sound-core kmod-sound-soc-db120
endef

define Profile/DB120TB388/Description
	Package set optimized for the Atheros DB120 reference board with TB388 extension.
endef

$(eval $(call Profile,DB120TB388))

define Profile/DB120AK4430
	NAME:=Atheros DB120 reference board with AK4430 extension
	PACKAGES:= \
	  kmod-usb-core kmod-usb2 kmod-sound-core kmod-sound-soc-db120-ak4430
endef

define Profile/DB120AK4430/Description
	Package set optimized for the Atheros DB120 reference board with AK4430 extension.
endef

$(eval $(call Profile,DB120AK4430))

define Profile/PB42
	NAME:=Atheros PB42 reference board
	PACKAGES:=kmod-usb-core kmod-usb-ohci kmod-usb2
endef

define Profile/PB42/Description
	Package set optimized for the Atheros PB42 reference board.
endef

$(eval $(call Profile,PB42))

define Profile/PB44
	NAME:=Atheros PB44 reference board
	PACKAGES:=kmod-usb-core kmod-usb-ohci kmod-usb2 \
		  vsc7385-ucode-pb44 vsc7395-ucode-pb44
endef

define Profile/PB44/Description
	Package set optimized for the Atheros PB44 reference board.
endef

$(eval $(call Profile,PB44))

define Profile/PB92
	NAME:=Atheros PB92 reference board
	PACKAGES:=kmod-usb-core kmod-usb2
endef

define Profile/PB92/Description
	Package set optimized for the Atheros PB92 reference board.
endef

$(eval $(call Profile,PB92))
