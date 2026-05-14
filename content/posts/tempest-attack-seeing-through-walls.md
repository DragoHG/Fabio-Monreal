---
title: "TEMPEST Attack: Seeing Through Walls"
description: "TEMPEST-style eavesdropping: display cables, RTL-SDR receivers, and open tools that can rebuild screen images—an introductory read for non-specialists."
date: 2021-03-04
canonicalURL: "https://fabiomonreal.com/en/posts/tempest-attack-seeing-through-walls"
ogImage: "/images/posts/tempest-rtl-sdr-hello.jpg"
ogImageAlt: "TEMPEST demo with RTL-SDR and TempestSDR reconstructing the word HELLO leaked from a monitor"
ogImageWidth: 1200
ogImageHeight: 900
syndicationOf: "https://www.linkedin.com/pulse/ataque-de-tempest-enxergando-atrav%C3%A9s-das-paredes-fabio-monreal/"
lang: en-US
translationSlug: ataque-de-tempest-enxergando-atraves-das-paredes
keywords:
  - TEMPEST attack
  - electromagnetic eavesdropping
  - Van Eck phreaking
  - software-defined radio
  - RTL-SDR
  - compromising emanations
  - physical security
  - GR-Tempest
  - TempestSDR
---

> Originally published on [LinkedIn](https://www.linkedin.com/pulse/ataque-de-tempest-enxergando-atrav%C3%A9s-das-paredes-fabio-monreal/) on March 4, 2021 (Portuguese). This English version keeps the same intent and structure.

Most people rarely think about **electromagnetic emissions** when they look at everyday **hardware**. That is understandable: anything powered by electricity involves changing currents—and changing currents can produce **unintentional**, unstable **magnetic/radio-frequency** signatures. From an attacker’s perspective, those signatures can become a **quiet surveillance channel** that is hard to notice and difficult to mitigate without the right equipment, facility design, and operational discipline.

**TEMPEST** (as commonly discussed in security contexts) refers to techniques for **eavesdropping on electronic equipment** via **electromagnetic emanations** (similar thinking can extend to acoustic and mechanical coupling). One striking scenario is **monitor spying**: recovering information from the RF leakage associated with **VGA/HDMI cabling** and related circuitry—without touching the victim’s machine. Picture an attacker **waiting for someone in IT** (or another team) to open a sensitive document: passwords, confidential data, diagrams. That intelligence can enable a **follow-on attack** on infrastructure or fuel **social engineering** (“please open this exact file while I tune the receiver”).

This article is meant to explain the idea to **non-specialists** in a short, approachable way.

## From hardware to a reconstructed picture

When current flows through electronics, the device generates an **unintentional**, unstable **field** that can be observed as **radio-frequency energy**—its characteristics shift with the **currents and switching activity** inside the equipment. Under the right conditions, part of that energy can be **captured**, **processed**, and turned back into something a human can interpret, using an **antenna** and **software**.

A common classroom/hobby entry point is a low-cost **RTL2832U-based USB SDR**. Those receivers are widely used to listen to broadcast signals, airband traffic, amateur radio, and more. Here the point is narrower: using the same class of hardware to receive **RF energy related to a display**, then using software to reconstruct an **image**.

![Practical demo: RTL-SDR receiver and TempestSDR reconstructing the word HELLO from a target display](/images/posts/tempest-rtl-sdr-hello.jpg)

*Image credit: Twitter [@daniel_bilar](https://twitter.com/daniel_bilar)*

## Capture, condition, display

Below is a simple illustration of how a signal can be **captured**, **conditioned**, and rendered in a human-readable form:

![Block diagram: target → analogue measurement → radio recording → preprocessing → analysis; schematic with antenna, noisy trace, filter, amplifier](https://media.licdn.com/dms/image/v2/C4E12AQHc72yNQrbZyA/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1614895881691?e=1779926400&v=beta&t=PAF2SqDeQIOd3KS7sR7exISU5rStf5pIqRJpUo0l5mI)

*Image credit: Craig Ramsay — [hardwear.io](https://hardwear.io) (2017)*

## From the cable to the attacker’s screen

You have a **target device**—say, an **LCD panel**. An antenna picks up energy related to the **display cable path** (historically discussed a lot with **VGA**), the receiver is tuned to a workable **frequency/conditioning** regime, and **software** turns the capture into a **reconstructed picture** on the attacker’s workstation—similar to the following open-source workflow:

![GNU Radio Companion / GR-Tempest flowgraph with a noisy grayscale reconstruction](https://media.licdn.com/dms/image/v2/C4E12AQE8zwjGlY15Sg/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1614896484045?e=1779926400&v=beta&t=uc1EEdgRq03T998RTeOlj8ZZ8XQUQxAAAQI8myKFSho)

*Image credit: open-source [GR-Tempest](https://github.com/git-artes/gr-tempest) project*

In the attacker’s screenshot, the target was an **LCD monitor** showing a **security camera** aimed at a building parking entrance. Even when the reconstruction looks **noisy**, small details can still leak—enough to read a **license plate** in some setups. That kind of detail can feed **social engineering** and help an attacker build a richer picture of the target environment.

## Risk, mitigation, and what this is (and is not)

Threats rarely arrive from a single direction: there are **hardware-oriented mitigations** aimed at reducing or complicating emanations. Even so, the practical risk story usually blends **physical security**, **facility zoning**, **supply-chain trust**, and **operational habits**—not “a single checkbox” in a desktop antivirus console.

It is worth repeating: this is primarily a **surveillance technique**. It is not the same thing as remotely **exploiting** an OS vulnerability—though what the attacker **learns** from the screen can absolutely enable later, more direct attacks.

## References

*Note: curated public sources; this post is not a deep signal-processing tutorial.*

- [GR-Tempest (GitHub)](https://github.com/git-artes/gr-tempest)
- [Van Eck phreaking (Wikipedia)](https://en.wikipedia.org/wiki/Van_Eck_phreaking)
- [EEL7126 / EEL7824 (UFSC — PDF)](https://deel.ufsc.br/files/2012/09/EEL7126_EEL7824-1.pdf)
- [YouTube — TfKSnb8C6Qg](https://www.youtube.com/watch?v=TfKSnb8C6Qg)
- [IIE-FING — electromagnetic-emission espionage (project page)](https://iie.fing.edu.uy/investigacion/grupos/artes/es/proyectos/espionaje-por-emisiones-electromagneticas/)
- [YouTube — oTCu8HTaN3Y](https://www.youtube.com/watch?v=oTCu8HTaN3Y)
- [TempestSDR (GitHub)](https://github.com/martinmarinov/TempestSDR)
- [YouTube — dA7v3f2DYJk](https://www.youtube.com/watch?v=dA7v3f2DYJk)
- [YouTube playlist](https://www.youtube.com/playlist?list=PLgyC55ufTHCJ9NARNCnoL9QT7isSI9SeV)
