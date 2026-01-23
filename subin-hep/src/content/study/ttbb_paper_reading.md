---
title: Identification of Additional Jets in the ttbb events by using deep neural network
date: 2026-01-23
category: Paper Reading
---

[arXiv:1910.14535](https://arxiv.org/abs/1910.14535)

# Summary
## 1. Introduction
>The study focuses on the production of a top quark pair in association with a Higgs boson ($t\bar{t}H$), specifically where the Higgs decays into a b-quark pair ($b\bar{b}$).
>- **The Problem:** The $t\bar{t}b\bar{b}$ ($ttbb$) process acts as an irreducible non-resonant background to the signal process $t\bar{t}H(b\bar{b})$.
>- **The Goal:** To improve the sensitivity of $t\bar{t}H(b\bar{b})$ searches, it is essential to precisely identify the "additional b jets" (those originating from gluon splitting rather than top quark decay).
>- **The Approach:** The paper compares three methods for identifying these jets in the lepton+jets decay channel: the minimum $\Delta R$ method, Boosted Decision Trees (BDT), and Deep Neural Networks (DNN).

## 2. Simulation and Event Selection
>- **Simulation:** 18 million $ttbb$ events were generated at a center-of-mass energy of 13 TeV using **MADGRAPH5** for generation and **DELPHES** for detector simulation.
>- **Object Definition:** Jets were reconstructed using the anti-$k_T$ algorithm. A jet is defined as an "additional b jet" if it matches a b-quark not from a top quark within $\Delta R < 0.5$.
>- **Selection Criteria:** The analysis focused on the lepton+jets channel (one lepton, multiple jets). Events were categorized based on the number of jets and b-tagged jets. "Matching efficiency" was used as the primary metric to evaluate performance.

## 3. Minimum deltaR analysis
>- **Method:** This approach assumes that additional b jets from gluon splitting tend to have a smaller angular separation ($\Delta R$) between them compared to other jet pairs.
>- **Performance:**
    - For events with exactly 3 b-tagged jets, the matching efficiency was **28%**.
    - For events with at least 4 b-tagged jets, the efficiency was **30%**.
    - Efficiency tends to decrease slightly as the total number of jets increases.

## 4. Multivariate Analysis
>- **Method:** A DNN was implemented using Keras with 4 hidden layers and 100 nodes per layer.
>- **Input Variables:** The model utilized 78 input variables derived from the four-vectors of final state objects (b-tagged jets, lepton, reconstructed W boson, and MET).
>- **Training:** The model was trained to classify jet combinations as "signal" (correctly matched additional b jets) or "background" (wrong combinations).
>- **Results:**
>	- For events with at least 4 b-tagged jets, the DNN achieved a matching efficiency of **38%**.
>	- This represents an **8% improvement** over the minimum $\Delta R$ method.
>	- The DNN performance was consistent with results obtained using BDT.

## 5. Separation of ttH and ttbb
> - The study also tested if the DNN model trained on $ttbb$ events could distinguish $ttH$ events.
> - By analyzing the invariant mass of the two selected b jets, the model trained on $ttH$ events showed a clear peak at the Higgs mass (125 GeV), whereas the $ttbb$ model showed a broad peak, demonstrating that the two processes can be distinguished.


## 6. Conclusions
>The paper concludes that identifying the origin of b jets is crucial for measuring differential cross-sections.
>- **Key Finding:** The DNN method outperforms the simple kinematic method (minimum $\Delta R$) by approximately 3% to 8%, depending on the jet multiplicity.
>- **Recommendation:** Requiring at least 4 b-tagged jets yields the best performance (around 40% efficiency) but requires sufficient statistics, which may be feasible with future High-Luminosity LHC data.