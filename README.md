# Fancy Light Card by [@dancing-lizard](https://www.github.com/dancing-lizard)

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

Home Assistant custom light card using iro.js for color pickers

![Screenshot](screenshot.png)

Features:

-   Color, brightness, temperature and effect selection based on device capabilities
-   Flashing
-   Mobile friendly

## Options

| Name   | Type   | Requirement  | Description               | Default                       |
| ------ | ------ | ------------ | ------------------------- | ----------------------------- |
| type   | string | **Required** | `custom:fancy-light-card` |                               |
| entity | string | **Required** | Home Assistant entity ID. |                               |
| name   | string | **Optional** | Card name                 | `Friendly name of the entity` |

## Adding to Home Assistant

### HACS

Add https://github.com/dancing-lizard/fancy-light-card as a custom plugin repository

### Manual

Put fancy-light-card.js into your \$CONFIG/www directory and add the following to your lovelace.yaml

```yaml
resources:
    - url: /local/fancy-light-card.js
      type: module
```

[license-shield]: https://img.shields.io/github/license/dancing-lizard/fancy-light-card.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/dancing-lizard/fancy-light-card.svg?style=for-the-badge
[releases]: https://github.com/dancing-lizard/fancy-light-card/releases
