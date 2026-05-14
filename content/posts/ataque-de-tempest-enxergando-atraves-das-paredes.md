---
title: "Ataque de Tempest – Enxergando através das paredes"
description: "Espionagem por emissões (TEMPEST): monitores e cabos VGA/HDMI, SDR acessível e software que reconstrói imagens — leitura introdutória para não especialistas."
date: 2021-03-04
canonicalURL: "https://fabiomonreal.com/posts/ataque-de-tempest-enxergando-atraves-das-paredes"
ogImage: "/images/posts/tempest-rtl-sdr-hello.jpg"
ogImageAlt: "Demonstração TEMPEST com RTL-SDR e TempestSDR reconstruindo a palavra HELLO emitida por um monitor"
ogImageWidth: 1200
ogImageHeight: 900
syndicationOf: "https://www.linkedin.com/pulse/ataque-de-tempest-enxergando-atrav%C3%A9s-das-paredes-fabio-monreal/"
lang: pt-BR
translationSlug: tempest-attack-seeing-through-walls
keywords:
  - ataque TEMPEST
  - espionagem eletromagnética
  - Van Eck phreaking
  - SDR
  - RTL-SDR
  - emanações comprometedoras
  - segurança física
  - GR-Tempest
  - TempestSDR
---

> Publicado originalmente no [LinkedIn](https://www.linkedin.com/pulse/ataque-de-tempest-enxergando-atrav%C3%A9s-das-paredes-fabio-monreal/) em 4 de março de 2021.

Um fato curioso sobre tecnologias voltadas a **hardware**, no qual a maioria das pessoas não repara, é a **emissão de ondas eletromagnéticas**. Pensando nisso, não parece nada incomum: tudo que funciona com energia gera algum tipo de **campo magnético** instável e não intencional. A partir daí surge um tipo de ataque interessante — em muitos cenários **difícil de perceber** e **quase impossível de mitigar** sem equipamentos e processos adequados.

O termo **TEMPEST** refere-se a uma técnica de espionagem em que o objetivo é **“escutar” equipamentos eletrônicos** através de **emissões eletromagnéticas** (o mesmo raciocínio pode se estender a sons e vibrações). Um dos pontos mais chamativos é a possibilidade de **espionar monitores de vídeo**, recebendo o sinal eletromagnético emitido por **cabos VGA/HDMI** e outros conectores. Imagine alguém **monitorando as telas de uma empresa** sem tocar no computador alvo: fica à espera de um funcionário de TI (ou de outro departamento) abrir um documento sensível — senhas, dados confidenciais, plantas. Se isso ocorre, abre espaço para um ataque mais direto à infraestrutura ou para **engenharia social**, em que o atacante convence alguém a abrir um arquivo específico para facilitar a captura.

Este artigo tem o **intuito** de esclarecer pessoas **não técnicas** sobre esse tipo de espionagem, com uma descrição breve de como a técnica pode ser utilizada de forma compreensível.

## Do equipamento ao “vídeo vazado”

Todo aparelho eletrônico, ao receber corrente, gera um **campo magnético instável e não intencional**. Esse campo se manifesta como **sinal de radiofrequência**, que varia conforme a **intensidade da corrente** que passa pelo equipamento. Dependendo da situação, é possível explorar essas emissões para capturar informações da frequência e traduzi-las de volta para algo legível ao olho humano — com **software** e uma **antena receptora**.

Como exemplo, a **antena USB SDR RTL2832U** costuma ter um bom custo-benefício. Com ela dá para ouvir, por exemplo, comunicações de aeroportos, tráfego de rádio amador, alguns serviços públicos e até o áudio de emissoras de TV. Aqui o foco é outro: usar a antena para receber **radiofrequências emanadas por uma tela**, de modo que o sinal seja convertido por software novamente em **imagem**.

![Demonstração prática com receptor RTL-SDR e reconstrução da palavra HELLO no TempestSDR](/images/posts/tempest-rtl-sdr-hello.jpg)

*Créditos da imagem: Twitter [@daniel_bilar](https://twitter.com/daniel_bilar)*

## Capturar, tratar e exibir

Abaixo, um exemplo de como a onda é **capturada**, **tratada** e devolvida de forma compreensível:

![Diagrama do fluxo: alvo → medição analógica → gravação de rádio → pré-processamento → análise, com etapas de antena, filtro e amplificação](https://media.licdn.com/dms/image/v2/C4E12AQHc72yNQrbZyA/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1614895881691?e=1779926400&v=beta&t=PAF2SqDeQIOd3KS7sR7exISU5rStf5pIqRJpUo0l5mI)

*Créditos da imagem: Craig Ramsay — [hardwear.io](https://hardwear.io) (2017)*

## Do cabo VGA à imagem reconstruída

Você tem um **aparelho alvo** — neste caso, uma **tela LCD**. A antena capta os sinais emanados pelo **cabo VGA** (ou outro meio físico equivalente), ajusta-se à **frequência correta** para tradução, e um **software** processa e exibe a imagem da tela alvo no equipamento do atacante, como no exemplo seguinte:

![Fluxo GNU Radio Companion / GR-Tempest com imagem reconstruída em tons de cinza](https://media.licdn.com/dms/image/v2/C4E12AQE8zwjGlY15Sg/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1614896484045?e=1779926400&v=beta&t=uc1EEdgRq03T998RTeOlj8ZZ8XQUQxAAAQI8myKFSho)

*Créditos da imagem: software open source [GR-Tempest](https://github.com/git-artes/gr-tempest)*

Na tela do atacante, o alvo era um **monitor LCD** ligado a uma **câmera de segurança** voltada para a entrada do estacionamento de um prédio. Mesmo com imagem **instável**, ainda é possível distinguir detalhes — por exemplo, a **placa de um veículo** que entra no prédio. Isso abre brechas para **engenharia social**, permitindo ao atacante coletar mais contexto sobre o ambiente alvo.

## Riscos, mitigação e expectativa realista

A vulnerabilidade “vem de todos os lados”: existem **soluções de hardware** que tentam **reduzir ou cifrar** emanações, mas o cenário de ameaça continua evoluindo — e, em muitos casos, a conversa passa por **controles físicos**, **zonas controladas** e **hardening** de instalações, não só por software.

Reforçando: em essência, trata-se de um **método de espionagem** — em geral **não há “exploração” direta** do sistema operacional só por captar o vazamento eletromagnético. O risco aparece quando o atacante **vê informação sensível** na imagem reconstruída e isso viabiliza **próximos passos** do ataque.

## Referências

*Nota: resumo e curadoria de fontes públicas; o foco desta publicação não é o detalhe matemático/sinal do método.*

- [GR-Tempest (GitHub)](https://github.com/git-artes/gr-tempest)
- [Van Eck phreaking (Wikipédia, EN)](https://en.wikipedia.org/wiki/Van_Eck_phreaking)
- [EEL7126 / EEL7824 (UFSC — PDF)](https://deel.ufsc.br/files/2012/09/EEL7126_EEL7824-1.pdf)
- [YouTube — TfKSnb8C6Qg](https://www.youtube.com/watch?v=TfKSnb8C6Qg)
- [IIE-FING — espionaje por emisiones electromagnéticas](https://iie.fing.edu.uy/investigacion/grupos/artes/es/proyectos/espionaje-por-emisiones-electromagneticas/)
- [YouTube — oTCu8HTaN3Y](https://www.youtube.com/watch?v=oTCu8HTaN3Y)
- [TempestSDR (GitHub)](https://github.com/martinmarinov/TempestSDR)
- [YouTube — dA7v3f2DYJk](https://www.youtube.com/watch?v=dA7v3f2DYJk)
- [Playlist YouTube](https://www.youtube.com/playlist?list=PLgyC55ufTHCJ9NARNCnoL9QT7isSI9SeV)
