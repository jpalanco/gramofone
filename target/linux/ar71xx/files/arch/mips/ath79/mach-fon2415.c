/*
 * Fonera HUB/Juke/Gramofon/... FON2415 board support
 *
 * Copyright (c) 2012 Qualcomm Atheros
 * Copyright (c) 2013 Fon Technology S.L.
 * FON2415 board is 16M nor flash and 64M memory.
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
#include <linux/delay.h>
#include <linux/gpio.h>

#include <asm/mach-ath79/ar71xx_regs.h>
#include <asm/mach-ath79/ath79.h>

#include "common.h"
#include "dev-ap9x-pci.h"
#include "dev-audio.h"
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

#define FON2415_GPIO_I2S_MCLK		14
#define FON2415_GPIO_I2S_SD		15
#define FON2415_GPIO_I2S_WS		12
#define FON2415_GPIO_I2S_CLK		13

#define FON2415_GPIO_LED_RED		0
#define FON2415_GPIO_LED_GREEN		1
#define FON2415_GPIO_LED_BLUE		4

#define FON2415_GPIO_BTN		19

#define FON2415_KEYS_POLL_INTERVAL	20	/* msecs */
#define FON2415_KEYS_DEBOUNCE_INTERVAL	(3 * FON2415_KEYS_POLL_INTERVAL)

#define FON2415_MAC0_OFFSET		0
#define FON2415_MAC1_OFFSET		6
#define FON2415_WMAC_CALDATA_OFFSET	0x1000

#define AR9341_SW_PHY_SWAP		(1<<7)
#define AR9341_SW_PHY_ADDR_SWAP		(1<<8)

static struct gpio_led fon2415_leds_gpio[] __initdata = {
	{
		.name		= "fon2415:red:status",
		.gpio		= FON2415_GPIO_LED_RED,
	},
	{
		.name		= "fon2415:green:status",
		.gpio		= FON2415_GPIO_LED_GREEN,
	},
	{
		.name		= "fon2415:blue:status",
		.gpio		= FON2415_GPIO_LED_BLUE,
	}
};

static struct gpio_keys_button fon2415_gpio_keys[] __initdata = {
	{
		.desc		= " button",
		.type		= EV_KEY,
		.code		= KEY_WPS_BUTTON,
		.debounce_interval = FON2415_KEYS_DEBOUNCE_INTERVAL,
		.gpio		= FON2415_GPIO_BTN,
		.active_low	= 1,
	},
};

static struct platform_device fon_config_device = {
	.name		= "fon-config",
	.id		= 0,
};

static void register_fonconfig(void)
{
	platform_device_register(&fon_config_device);
}

static void ath79_setting_switch_data(unsigned int phy_mii_en, unsigned int phy_poll_mask, unsigned int swap_en)
{
	ath79_switch_data.phy4_mii_en = phy_mii_en;
	ath79_switch_data.swap_en = swap_en;
	ath79_switch_data.phy_poll_mask = phy_poll_mask;
}

static struct platform_device fon2415_spdif_codec = {
	.name		= "ak4430-codec",
	.id		= -1,
};

static struct platform_device fon2415_internal_codec = {
	.name		= "ath79-internal-codec",
	.id		= -1,
};

static void __init fon2415_gmac_setup(void)
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

static void __init fon2415_audio_setup(void)
{
	u32 t;

	/* Reset I2S internal controller */
	t = ath79_reset_rr(AR71XX_RESET_REG_RESET_MODULE);
	ath79_reset_wr(AR71XX_RESET_REG_RESET_MODULE, t | AR934X_RESET_I2S );
	udelay(1);

	/* GPIO configuration
	   GPIOs 12,13,14,15 are configured as I2S signal - Output
	   Please note that the value in direction_output doesn't really matter
	   here as GPIOs are configured to relay internal data signal
	*/
	gpio_request(FON2415_GPIO_I2S_CLK, "I2S CLK");
	ath79_gpio_output_select(FON2415_GPIO_I2S_CLK, AR934X_GPIO_OUT_MUX_I2S_CLK);
	gpio_direction_output(FON2415_GPIO_I2S_CLK, 0);

	gpio_request(FON2415_GPIO_I2S_WS, "I2S WS");
	ath79_gpio_output_select(FON2415_GPIO_I2S_WS, AR934X_GPIO_OUT_MUX_I2S_WS);
	gpio_direction_output(FON2415_GPIO_I2S_WS, 0);

	gpio_request(FON2415_GPIO_I2S_SD, "I2S SD");
	ath79_gpio_output_select(FON2415_GPIO_I2S_SD, AR934X_GPIO_OUT_MUX_I2S_SD);
	gpio_direction_output(FON2415_GPIO_I2S_SD, 0);

	gpio_request(FON2415_GPIO_I2S_MCLK, "I2S MCLK");
	ath79_gpio_output_select(FON2415_GPIO_I2S_MCLK, AR934X_GPIO_OUT_MUX_I2S_MCK);
	gpio_direction_output(FON2415_GPIO_I2S_MCLK, 0);

	/* Init stereo block registers in default configuration */
	ath79_audio_setup();
}

#define FON2415_WAN_PHYMASK 0X01
#define FON2415_LAN_PHYMASK 0X1E

static void __init fon2415_setup(void)
{
	u8 *art = (u8 *) KSEG1ADDR(0x1fff0000);
	ath79_register_m25p80(NULL);

	ath79_gpio_function_enable(AR934X_GPIO_FUNC_JTAG_DISABLE);

	ath79_register_leds_gpio(-1, ARRAY_SIZE(fon2415_leds_gpio),
				 fon2415_leds_gpio);
	ath79_register_gpio_keys_polled(-1, FON2415_KEYS_POLL_INTERVAL,
					ARRAY_SIZE(fon2415_gpio_keys),
					fon2415_gpio_keys);
	ath79_register_usb();
	ath79_register_wmac(art + FON2415_WMAC_CALDATA_OFFSET, NULL);

	fon2415_gmac_setup();

	ath79_init_mac(ath79_eth0_data.mac_addr, art + FON2415_MAC0_OFFSET, 0);
	ath79_init_mac(ath79_eth1_data.mac_addr, art + FON2415_MAC1_OFFSET, 0);
	ath79_register_mdio(0, 0);
	ath79_register_mdio(1, 0);

#if 0
	ath79_gpio_input_enable(FON2415_GPIO_UART1_RX);  //GPIO11 for RX
	ath79_gpio_output_enable(FON2415_GPIO_UART1_TX); //GPIO22 for TX
	ath79_gpio_output_select(FON2415_GPIO_UART1_TX, 79);
	ath79_gpio_input_select(FON2415_GPIO_UART1_RX, 38);

	ath79_uart_register(1);
#endif

	ath79_eth0_data.phy_if_mode = PHY_INTERFACE_MODE_MII;
	ath79_eth0_data.speed = SPEED_100;
	ath79_eth0_data.duplex = DUPLEX_FULL;

	if (ath79_switch_data.wan_en)
		ath79_eth0_data.phy_mask = FON2415_WAN_PHYMASK;
	else
		ath79_eth0_data.phy_mask = 0;

	ath79_eth0_data.mii_bus_dev = &ath79_mdio0_device.dev;
	ath79_register_eth(0);

	ath79_eth1_data.phy_if_mode = PHY_INTERFACE_MODE_GMII;
	if (ath79_switch_data.wan_en)
		ath79_eth1_data.phy_mask = FON2415_LAN_PHYMASK;
	else
		ath79_eth1_data.phy_mask = 0X1F;

	ath79_eth1_data.speed = SPEED_100;
	ath79_eth1_data.mii_bus_dev = &ath79_mdio1_device.dev;
	ath79_register_eth(1);
	register_fonconfig();

	/* Audio initialization: PCM/I2S and CODEC */
	fon2415_audio_setup();
	platform_device_register(&fon2415_spdif_codec);
	platform_device_register(&fon2415_internal_codec);
	ath79_audio_device_register();
}

MIPS_MACHINE(ATH79_MACH_FON2415, "FON2415",
	     "Fonera HUB FON2415 board",
	     fon2415_setup);
