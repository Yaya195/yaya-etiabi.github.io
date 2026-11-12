---
title: "Factorized Transformer for Multipath Estimation"
summary: "Joint estimation of multipath delay, angle of arrival and angle of departure from MIMO-OFDM observations."
status: "Under Review"
period: "2026"
tags: ["Transformers", "MIMO-OFDM", "Multipath estimation"]
featured: true
sortOrder: 2
paperUrl: "https://arxiv.org/abs/2611.01491"
paperType: "Preprint"
---

## Problem

Wireless localization and mapping can use the delay and angular parameters of multipath components (MPCs) to infer radio geometry. Recovering multiple propagation paths from received signals is challenging when paths overlap or have weak power.

## Method

The proposed model takes an angle-delay power representation derived from MIMO-OFDM observations. A factorized convolutional feature extractor processes the input, and a query-based Transformer decoder detects a set of propagation paths while estimating their **delay, angle of arrival (AoA) and angle of departure (AoD)**.

## Evaluation

Experiments on ray-tracing-based wireless channels compare path detection, parameter-estimation accuracy, set-level consistency and computational cost with reference methods. Additional positioning and radio-SLAM studies assess whether the estimated MPC parameters are useful as radio-geometric measurements.

## Manuscript

The manuscript is **under review**. The [public preprint](https://arxiv.org/abs/2611.01491) is available on arXiv.
