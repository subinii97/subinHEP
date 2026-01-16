---
title: HEP - Lecture 01. Introduction to the Standard Model
date: 2026-01-16
category: PP Study
---

# Lecture Note 01: Introduction to the Standard Model

**Textbook:** *Modern Particle Physics* by Mark Thomson
**Chapter:** 1. Introduction

---

## 1. The Standard Model of Particle Physics

The Standard Model (SM) describes the fundamental building blocks of matter and their interactions. It categorizes particles into **Fermions** (matter) and **Bosons** (force carriers).

### 1.1 Fundamental Particles (Fermions)
Matter consists of spin-$1/2$ particles called fermions. They are divided into two groups (Quarks and Leptons) and organized into three generations.

| Generation | **Leptons** (Do not feel Strong Force) | **Quarks** (Feel Strong Force) |
| :---: | :---: | :---: |
| **1st** | Electron ($e^-$), Electron Neutrino ($\nu_e$) | Up ($u$), Down ($d$) |
| **2nd** | Muon ($\mu^-$), Muon Neutrino ($\nu_\mu$) | Charm ($c$), Strange ($s$) |
| **3rd** | Tau ($\tau^-$), Tau Neutrino ($\nu_\tau$) | Top ($t$), Bottom ($b$) |

#### Key Properties
* **Electric Charge ($Q$):**
    * Charged Leptons ($e, \mu, \tau$): $Q = -1$
    * Neutrinos ($\nu$): $Q = 0$
    * Up-type Quarks ($u, c, t$): $Q = +2/3$
    * Down-type Quarks ($d, s, b$): $Q = -1/3$
* **Color Charge:** Quarks carry 'color' (red, green, blue), whereas leptons are 'colorless'.

### 1.2 Force Mediators (Bosons)
Forces are mediated by the exchange of integer-spin bosons.

| Interaction | Mediator (Boson) | Symbol | Mass | Acts on... |
| :---: | :---: | :---: | :---: | :--- |
| **Electromagnetic** | Photon | $\gamma$ | 0 | All charged particles |
| **Strong** | Gluon | $g$ | 0 | Quarks and Gluons |
| **Weak** | W, Z Bosons | $W^\pm, Z^0$ | Massive | All Fermions (Quarks & Leptons) |
| **Higgs Field** | Higgs Boson | $H$ | 125 GeV | Massive particles |

---

## 2. Feynman Diagrams

Feynman diagrams are spacetime diagrams used to represent particle interactions.

### 2.1 Conventions (Thomson Style)
* **Time ($t$):** Flows from **Left to Right**.
* **Space ($\vec{x}$):** Vertical axis.
* **Solid Lines:** Fermions (Quarks, Leptons).
* **Wavy/Coiled Lines:** Bosons ($\gamma, W, Z, g$).

### 2.2 Interaction Vertices
Every interaction is constructed from fundamental 3-point vertices. Conservation laws (Charge, Lepton number, Baryon number) must be strictly obeyed.

1.  **QED Vertex:** Charged fermion emits/absorbs a photon. Flavor is conserved $(e^- \to e^- + \gamma)$.
2.  **QCD Vertex:** Quark emits/absorbs a gluon. Color changes ($u_{\text{red}} \to u_{\text{blue}} + g$).
3.  **Weak Charged Current Vertex ($W^\pm$):**
    * **The only interaction that changes flavor.**
    * Example: $d \to u + W^-$.

### 2.3 Case Study: Beta Decay ($\beta^-$)
The decay of a neutron ($udd$) into a proton ($uud$):
* **Process:** $d \to u + e^- + \bar{\nu}_e$ (mediated by virtual $W^-$).
* **Conservation Check:** Charge is conserved at each vertex (e.g., $-1/3 = +2/3 - 1$).

---

## 3. Experimental Detection

Particles are identified by their unique signatures as they pass through concentric detector layers.

### 3.1 Tracking Chamber (Inner Layer)
* **Function:** Reconstructs trajectories ($\vec{x}(t)$) of **charged particles**.
* **Mechanism:** A magnetic field ($\vec{B}$) bends the particle's path via the Lorentz force.
* **Measurement:** The radius of curvature ($R$) determines the transverse momentum ($p_T$).
* **Formula:** $p_T [\text{GeV}] \approx 0.3 \cdot B [\text{T}] \cdot R [\text{m}]$.

### 3.2 Electromagnetic Calorimeter (ECAL)
* **Function:** Measures energy of light, interacting particles.
* **Target Particles:** Electrons ($e^\pm$) and Photons ($\gamma$).
* **Mechanism:** Induces electromagnetic showers (bremsstrahlung and pair production) to stop the particle completely.

### 3.3 Hadronic Calorimeter (HCAL)
* **Function:** Measures energy of heavy, strongly interacting particles.
* **Target Particles:** Hadrons like Protons ($p$), Neutrons ($n$), and Pions ($\pi$).
* **Mechanism:** Induces hadronic showers via strong interactions with atomic nuclei.

### 3.4 Muon Chambers (Outer Layer)
* **Function:** Detects **Muons ($\mu^\pm$)**.
* **Characteristic:** Muons do not interact strongly and are too heavy to radiate significantly in the ECAL, so they penetrate all inner layers.
* **Note on Neutrinos ($\nu$):** Neutrinos escape all layers undetected. Their presence is inferred from **Missing Transverse Energy** ($\vec{E}_T^{\text{miss}}$).

---
## Summary

* **Standard Model:** Matter consists of Fermions (Quarks, Leptons), and forces are mediated by Bosons ($\gamma, g, W, Z$).
* **Interactions:** The **Weak interaction** ($W^\pm$) is unique as it is the only force capable of changing particle flavor (e.g., $\beta$-decay).
* **Feynman Diagrams:** Interactions obey strict conservation laws (Charge, Lepton/Baryon #) at every vertex.
* **Detection:** Particle identification relies on tracking for momentum ($p_T \approx 0.3BR$) and calorimeters for energy ($E$).