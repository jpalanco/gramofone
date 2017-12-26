/*
 * ak4430.c  --  AK4430 ALSA SoC Audio driver
 *
 * Copyright 2013 Fon Technology S.L.
 *
 * Author: Alejandro Enrique <alejandro.enrique@fon.com>
 *
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 */

#include <linux/module.h>
#include <sound/soc.h>
#include <sound/pcm.h>

#define DRV_NAME	"ak4430-codec"

#define AK4430_RATES   (SNDRV_PCM_RATE_32000 | SNDRV_PCM_RATE_44100 \
	               | SNDRV_PCM_RATE_48000 | SNDRV_PCM_RATE_88200 \
		       | SNDRV_PCM_RATE_96000 | SNDRV_PCM_RATE_176400 \
		       | SNDRV_PCM_RATE_192000)
/* AK4430 needs 32 bit I2S words, although it will only use the upper 24 bits */
#define AK4430_FORMATS (SNDRV_PCM_FMTBIT_S32_BE)


static struct snd_soc_dai_driver ak4430_dai = {
	.name = "ak4430-hifi",
	.playback = {
		.stream_name = "Playback",
		.channels_min = 2,
		.channels_max = 2,
		.rates = AK4430_RATES,
		.formats = AK4430_FORMATS,
		},
};

static struct snd_soc_codec_driver soc_codec_dev_ak4430;

static __devinit int ak4430_probe(struct platform_device *pdev)
{
	return snd_soc_register_codec(&pdev->dev,
			&soc_codec_dev_ak4430, &ak4430_dai, 1);
}

static int __devexit ak4430_remove(struct platform_device *pdev)
{
	snd_soc_unregister_codec(&pdev->dev);
	return 0;
}

static struct platform_driver ak4430_codec_driver = {
	.driver = {
			.name = DRV_NAME,
			.owner = THIS_MODULE,
	},

	.probe = ak4430_probe,
	.remove = __devexit_p(ak4430_remove),
};

module_platform_driver(ak4430_codec_driver);

MODULE_DESCRIPTION("ASoC ak4430 driver");
MODULE_AUTHOR("Fon Technology S.L.");
MODULE_AUTHOR("Alejandro Enrique <alejandro.enrique@fon.com>");
MODULE_LICENSE("GPL");
MODULE_ALIAS("platform:" DRV_NAME);
