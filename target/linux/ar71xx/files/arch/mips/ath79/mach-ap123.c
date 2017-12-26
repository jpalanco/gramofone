/*
 * Atheros AP123 reference board support
 *
 * Copyright (c) 2012 Qualcomm Atheros
 * Qualcomm Atheros AP123 reference board is 4M nor flash and 16M memory.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */

#include <linux/pci.h>
#include <linux/phy.h>
#include <linux/platform_device.h>
#include <linux/ath9k_platform.h>
#include <linux/ar8216_platform.h>

#include <asm/mach-ath79/ar71xx_regs.h>

#include "common.h"
#include "dev-ap9x-pci.h"
#include "dev-eth.h"
#if 0
#include "dev-uart.h"
#endif
#include "dev-gpio-buttons.h"
#include "dev-leds-gpio.h"
#include "dev-m25p80.h"
#include "dev-spi.h"
#include "dev-usb.h"
#include "dev-wmac.h"
#include "machtypes.h"

#define AP123_GPIO_UART1_RX		22
#define AP123_GPIO_UART1_TX		11
#define AP123_GPIO_LED_WLAN_2G		13
#define AP123_GPIO_LED_STATUS		14
#define AP123_GPIO_LED_WPS		15

#define AP123_GPIO_BTN_WPS		16

#define AP123_KEYS_POLL_INTERVAL	20	/* msecs */
#define AP123_KEYS_DEBOUNCE_INTERVAL	(3 * AP123_KEYS_POLL_INTERVAL)

#define AP123_MAC0_OFFSET		0
#define AP123_MAC1_OFFSET		6
#define AP123_WMAC_CALDATA_OFFSET	0x1000

#define AR9341_SW_PHY_SWAP		(1<<7)
#define AR9341_SW_PHY_ADDR_SWAP		(1<<8)

static struct gpio_led ap123_leds_gpio[] __initdata = {
	{
		.name		= "ap123:green:status",
		.gpio		= AP123_GPIO_LED_STATUS,
		.active_low	= 1,
	},
	{
		.name		= "ap123:green:wps",
		.gpio		= AP123_GPIO_LED_WPS,
		.active_low	= 1,
	},
	{
		.name		= "ap123:green:wlan-2g",
		.gpio		= AP123_GPIO_LED_WLAN_2G,
		.active_low	= 1,
	}
};

static struct gpio_keys_button ap123_gpio_keys[] __initdata = {
	{
		.desc		= "WPS button",
		.type		= EV_KEY,
		.code		= KEY_WPS_BUTTON,
		.debounce_interval = AP123_KEYS_DEBOUNCE_INTERVAL,
		.gpio		= AP123_GPIO_BTN_WPS,
		.active_low	= 1,
	},
};

void ath79_setting_switch_data(unsigned int phy_mii_en, unsigned int phy_poll_mask, unsigned int swap_en)
{
	ath79_switch_data.phy4_mii_en = phy_mii_en;
	ath79_switch_data.swap_en = swap_en;
	ath79_switch_data.phy_poll_mask = phy_poll_mask;
}

static void __init ap123_gmac_setup(void)
{
	void __iomem *base;
	u32 t;

	base = ioremap(AR934X_GMAC_BASE, AR934X_GMAC_SIZE);

	t = __raw_readl(base + AR934X_GMAC_REG_ETH_CFG);
	t &= ~(AR934X_ETH_CFG_SW_ONLY_MODE);
	t |= (AR9341_SW_PHY_SWAP);
	__raw_writel(t, base + AR934X_GMAC_REG_ETH_CFG);
	ath79_switch_data.wan_en = 1;
	if (ath79_switch_data.wan_en)
		ath79_setting_switch_data(1, ~0X1F, 1);
	else
		ath79_setting_switch_data(0, ~0X1F, 0);
	iounmap(base);
}

#define AP123_WAN_PHYMASK 0X01
#define AP123_LAN_PHYMASK 0X1E

static void __init ap123_setup(void)
{
	u8 *art = (u8 *) KSEG1ADDR(0x1fff0000);
	ath79_register_m25p80(NULL);

	ath79_register_leds_gpio(-1, ARRAY_SIZE(ap123_leds_gpio),
				 ap123_leds_gpio);
	ath79_register_gpio_keys_polled(-1, AP123_KEYS_POLL_INTERVAL,
					ARRAY_SIZE(ap123_gpio_keys),
					ap123_gpio_keys);
	ath79_register_usb();
	ath79_register_wmac(art + AP123_WMAC_CALDATA_OFFSET, NULL);

	ap123_gmac_setup();

	ath79_init_mac(ath79_eth0_data.mac_addr, art + AP123_MAC0_OFFSET, 0);
	ath79_init_mac(ath79_eth1_data.mac_addr, art + AP123_MAC1_OFFSET, 0);
	ath79_register_mdio(0, 0);
	ath79_register_mdio(1, 0);

#if 0
	ath79_gpio_input_enable(AP123_GPIO_UART1_RX);  //GPIO11 for RX
	ath79_gpio_output_enable(AP123_GPIO_UART1_TX); //GPIO22 for TX
	ath79_gpio_output_select(AP123_GPIO_UART1_TX, 79);
	ath79_gpio_input_select(AP123_GPIO_UART1_RX, 38);

	ath79_uart_register(1);
#endif

	ath79_eth0_data.phy_if_mode = PHY_INTERFACE_MODE_MII;
	ath79_eth0_data.speed = SPEED_100;
	ath79_eth0_data.duplex = DUPLEX_FULL;

	if (ath79_switch_data.wan_en)
		ath79_eth0_data.phy_mask = AP123_WAN_PHYMASK;
	else
		ath79_eth0_data.phy_mask = 0;

	ath79_eth0_data.mii_bus_dev = &ath79_mdio0_device.dev;
	ath79_register_eth(0);

	ath79_eth1_data.phy_if_mode = PHY_INTERFACE_MODE_GMII;
	if (ath79_switch_data.wan_en)
		ath79_eth1_data.phy_mask = AP123_LAN_PHYMASK;
	else
		ath79_eth1_data.phy_mask = 0X1F;

	ath79_eth1_data.speed = SPEED_100;
	ath79_eth1_data.mii_bus_dev = &ath79_mdio1_device.dev;
	ath79_register_eth(1);
}

MIPS_MACHINE(ATH79_MACH_AP123, "AP123", "Atheros AP123 reference board",
	     ap123_setup);
