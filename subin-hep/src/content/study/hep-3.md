---
title: "Lecture Note 03: Decay Rates and Cross Sections"
date: 2026-01-18
category: PP Study
---
# Lecture Note 03: Decay Rates and Cross Sections

**Textbook:** *Modern Particle Physics* by Mark Thomson
**Chapter:** 3. Decay rates and cross sections

This chapter establishes the methodology for the calculations of cross sections and decay rates in relativistic quantum mechanics. It introduces the concepts of Lorentz-invariant phase space and the Lorentz-invariant matrix element to produce a set of **Master Formulas** for experimental observables.

---

## 3.1 Fermi's Golden Rule

Particle physics is largely based on experimental measurements of particle decay rates and interaction cross sections. These phenomena represent transitions between different quantum mechanical states.

In non-relativistic quantum mechanics, transition rates are obtained using **Fermi's golden rule**. The transition rate $\Gamma_{fi}$ from an initial state $|i\rangle$ to a final state $|f\rangle$ is given by:

> **Fermi's Golden Rule**
> $$
> \Gamma_{fi}=2\pi|T_{fi}|^{2}\rho(E_{i}) \quad (3.1)
> $$

* **$T_{fi}$ (Transition Matrix Element):** This is determined by the interaction Hamiltonian $\hat{H}'$. In perturbation theory, it is expanded as:
    $$
    T_{fi}=\langle f|\hat{H}^{\prime}|i\rangle+\sum_{j\ne i}\frac{\langle f|\hat{H}^{\prime}|j\rangle\langle j|\hat{H}^{\prime}|i\rangle}{E_{i}-E_{j}}+\cdot\cdot\cdot
    $$
   
* **$\rho(E_{i})$ (Density of States):** The number of accessible final states per unit energy interval, $\rho(E_{i})=|dn/dE|_{E_{i}}$.

For transitions into a continuum of states, it is often more convenient to express the density of states as an integral over the final state energy $E$ using a delta-function to enforce energy conservation:

$$
\Gamma_{fi}=2\pi\int|T_{fi}|^{2}\delta(E_{i}-E)dn \quad (3.2)
$$


---

## 3.2 Phase Space and Wavefunction Normalisation

To apply Fermi's golden rule to relativistic particles, we must redefine wavefunction normalisation and phase space counting to be Lorentz invariant.

### Non-Relativistic Treatment

In the Born approximation, particles are represented by plane waves $\psi(x,t)$. The matrix element is:
$$
T_{fi}=\langle\psi_{1}\psi_{2}|\hat{H}^{\prime}|\psi_{a}\rangle=\int_{V}\psi_{1}^{*}\psi_{2}^{*}\hat{H}^{\prime}\psi_{a}d^{3}x \quad (3.3, 3.4)
$$

The wavefunctions are of the form:
$$
\psi(x,t)=Ae^{i(p\cdot x-Et)} \quad (3.5)
$$

We normalize these wavefunctions to **one particle** in a cubic volume $V=a^3$, implying $A^2=1/V$.

**Phase Space ($dn$):**
Using periodic boundary conditions, the number of states $dn$ in a momentum range $p \to p+dp$ is $dn = 4\pi p^2 dp \cdot V/(2\pi)^3$.
For a process with $N$ final state particles, the general non-relativistic phase space is defined by the product of individual phase spaces, constrained by momentum conservation:

$$
dn=\prod_{i=1}^{N-1}\frac{d^{3}p_{i}}{(2\pi)^{3}}\delta^{3}(p_{a}-\sum_{i=1}^{N}p_{i})d^{3}p_{N} \quad (3.6)
$$

Written symmetrically:
$$
dn=(2\pi)^{3}\prod_{i=1}^{N}\frac{d^{3}p_{i}}{(2\pi)^{3}}\delta^{3}(p_{a}-\sum_{i=1}^{N}p_{i}) \quad (3.7)
$$


### 3.2.1 Lorentz-Invariant Phase Space

The non-relativistic normalization ($1/V$) is not Lorentz invariant because the volume $V$ contracts ($V \to V/\gamma$). To fix this, we adopt a **relativistic normalization** of **$2E$ particles per unit volume**.
* The relativistic wavefunction is $\psi^{\prime}=(2E)^{1/2}\psi$.

We define the **Lorentz-Invariant Matrix Element ($\mathcal{M}_{fi}$)** using these relativistic wavefunctions:

> **Lorentz-Invariant Matrix Element**
> $$
> \mathcal{M}_{fi}=\langle\psi_{1}^{\prime}\psi_{2}^{\prime}\cdot\cdot\cdot|\hat{H}^{\prime}|\psi_{a}^{\prime}\psi_{b}^{\prime}\cdot\cdot\cdot\rangle \quad (3.8)
> $$

This is related to the non-relativistic matrix element $T_{fi}$ by:
$$
\mathcal{M}_{fi}=(2E_{1}\cdot2E_{2}\cdot\cdot\cdot2E_{a}\cdot2E_{b}\cdot\cdot\cdot)^{1/2}T_{fi} \quad (3.9)
$$

### 3.2.2 Fermi's Golden Rule Revisited

Substituting the relativistic definitions into Eq (3.2) for a two-body decay yields an intermediate step:
$$
\Gamma_{fi}=(2\pi)^{4}\int|T_{fi}|^{2}\delta(E_{a}-E_{1}-E_{2})\delta^{3}(p_{a}-p_{1}-p_{2})\frac{d^{3}p_{1}}{(2\pi)^{3}}\frac{d^{3}p_{2}}{(2\pi)^{3}} \quad (3.10)
$$

By replacing $T_{fi}$ with $\mathcal{M}_{fi}$, we obtain the **Lorentz-Invariant form of Fermi's Golden Rule**:

> **Master Formula: Golden Rule (Decay)**
> $$
> \Gamma_{fi}=\frac{(2\pi)^{4}}{2E_{a}}\int|\mathcal{M}_{fi}|^{2}\delta(E_{a}-E_{1}-E_{2})\delta^{3}(p_{a}-p_{1}-p_{2})\frac{d^{3}p_{1}}{(2\pi)^{3}2E_{1}}\frac{d^{3}p_{2}}{(2\pi)^{3}2E_{2}} \quad (3.11)
> $$

* The factor $1/2E_a$ accounts for relativistic time dilation ($\Gamma \propto 1/\gamma$).
* The phase space factors $d^3p/E$ are Lorentz invariant. The proof involves a boost along the z-axis:
    $$
    d^{3}p^{\prime}=\frac{dp_{z}^{\prime}}{dp_{z}}d^{3}p \quad (3.12)
    $$

### 3.2.3 Lorentz-Invariant Phase Space (General N-body)

The expression for the decay rate can be extended to an N-body decay, $a \to 1 + 2 + ... + N$. In this general case, the phase space integral involves the three-momenta of all final-state particles.
The **element of Lorentz-invariant phase space (LIPS)** is defined as:

$$
dLIPS=\prod_{i=1}^{N}\frac{d^{3}p_{i}}{(2\pi)^{3}2E_{i}}
$$

To gain further insight, we can rewrite the energy factors using the Dirac delta-function. Using the property:
$$
\int\delta(E_{i}^{2}-p_{i}^{2}-m_{i}^{2})dE_{i}=\frac{1}{2E_{i}}
$$
the integral over Lorentz-invariant phase space can be expressed as an integral over the four-momenta:
$$
\int \dots dLIPS = \int \dots \prod_{i=1}^{N} (2\pi)^{-3} \delta(p_i^2 - m_i^2) d^4p_i
$$

Using this, the transition rate for a two-body decay (and by extension any decay) can be written in a manifestly covariant form:

> **Covariant Form of the Decay Rate**
> $$
> \Gamma_{fi} = \frac{(2\pi)^4}{2E_a} \int (2\pi)^{-6} |\mathcal{M}_{fi}|^2 \delta^4(p_a - p_1 - p_2) \delta(p_1^2 - m_1^2) \delta(p_2^2 - m_2^2) d^4p_1 d^4p_2
> $$

**Physical Interpretation:**
* The integral now extends over **all** values of the energies and momenta of the final-state particles.
* The delta-functions ensure that the decay rate only has contributions from values of the four-momenta compatible with:
    1.  Overall energy and momentum conservation: $\delta^4(p_a - p_1 - p_2)$
    2.  The Einstein energy-momentum relation (mass-shell condition): $\delta(p_i^2 - m_i^2)$.
* This form elucidates that all the fundamental physics is contained within the matrix element, while the rest describes the kinematics.

---

## 3.3 Particle Decays

The decay rate $\Gamma$ is the probability of decay per unit time. If there are $N$ particles, the number decaying in time $\delta t$ is:
$$
\delta N=-N\Gamma\delta t \quad (3.13)
$$

The total width is the sum of partial widths: $\Gamma = \sum \Gamma_j$.

### 3.3.1 Two-Body Decays

We calculate the decay rate for $a \to 1+2$ in the **rest frame** of particle $a$ ($E_a=m_a, p_a=0$).
Starting from (3.11):
$$
\Gamma_{fi}=\frac{1}{8\pi^{2}m_{a}}\int|\mathcal{M}_{fi}|^{2}\delta(m_{a}-E_{1}-E_{2})\delta^{3}(p_{1}+p_{2})\frac{d^{3}p_{1}}{2E_{1}}\frac{d^{3}p_{2}}{2E_{2}} \quad (3.14)
$$

Integrating over $p_2$ using the delta function sets $p_2 = -p_1$:
$$
\Gamma_{fi}=\frac{1}{8\pi^{2}m_{a}}\int|\mathcal{M}_{fi}|^{2}\frac{1}{4E_{1}E_{2}}\delta(m_{a}-E_{1}-E_{2})d^{3}p_{1} \quad (3.15)
$$

Using spherical coordinates ($d^3p_1 = p_1^2 dp_1 d\Omega$):
$$
\Gamma_{fi}=\frac{1}{8\pi^{2}m_{a}}\int|\mathcal{M}_{fi}|^{2}\delta(m_{a}-\sqrt{m_{1}^{2}+p_{1}^{2}}-\sqrt{m_{2}^{2}+p_{1}^{2}})\frac{p_{1}^{2}}{4E_{1}E_{2}}dp_{1}d\Omega \quad (3.16)
$$

This integral has the form $\int g(p) \delta(f(p)) dp$:
$$
\Gamma_{fi}=\frac{1}{8\pi^{2}m_{a}}\int|\mathcal{M}_{fi}|^{2}g(p_{1})\delta(f(p_{1}))dp_{1}d\Omega \quad (3.17)
$$

Where:
$$
g(p_{1})=\frac{p_{1}^{2}}{4E_{1}E_{2}} \quad (3.18)
$$
$$
f(p_{1})=m_{a}-E_{1}-E_{2} \quad (3.19)
$$

Using the property of the delta function, the result of the momentum integration is:
$$
\int|\mathcal{M}_{fi}|^{2}g(p_{1})\delta(f(p_{1}))dp_{1}=\frac{p^{*}}{4m_{a}}|\mathcal{M}_{fi}|^{2} \quad (3.20)
$$

Substituting this back gives the intermediate result:
$$
\int|\mathcal{M}_{fi}|^{2}\delta(m_{a}-E_{1}-E_{2})\delta^{3}(p_{1}+p_{2})\frac{d^{3}p_{1}}{2E_{1}}\frac{d^{3}p_{2}}{2E_{2}}=\frac{p^{*}}{4m_{a}}\int|\mathcal{M}_{fi}|^{2}d\Omega \quad (3.21)
$$

Combining terms yields the **Master Formula for Two-Body Decay**:

> **Two-Body Decay Rate**
> $$
> \Gamma_{fi}=\frac{p^{*}}{32\pi^{2}m_{a}^{2}}\int|\mathcal{M}_{fi}|^{2}d\Omega \quad (3.22)
> $$


---

## 3.4 Interaction Cross Sections

The interaction rate per target particle $r_b$ is proportional to the incident flux $\phi_a$ and the cross section $\sigma$:
$$
r_{b}=\sigma\phi_{a} \quad (3.23)
$$

For a beam volume $V$, the total interaction rate is:
$$
rate=r_{a}n_{a}V=(n_{b}v\sigma)n_{a}V \quad (3.24)
$$

### 3.4.1 Lorentz-Invariant Flux

The rate can be written as:
$$
rate=(v_{a}+v_{b})n_{a}n_{b}\sigma~V \quad (3.25)
$$

Normalising to 1 particle per volume ($n=1/V$), the single-particle transition rate corresponds to:
$$
\Gamma_{fi}=\frac{(v_{a}+v_{b})}{V}\sigma \quad (3.26)
$$

Substituting this into Fermi's golden rule yields the **General Lorentz-Invariant Cross Section**:

> **Master Formula: Cross Section**
> $$
> \sigma=\frac{(2\pi)^{-2}}{4~E_{a}E_{b}(v_{a}+v_{b})}\int|\mathcal{M}_{fi}|^{2}\delta(E_{a}+E_{b}-E_{1}-E_{2})\delta^{3}(p_{a}+p_{b}-p_{1}-p_{2})\frac{d^{3}p_{1}}{2E_{1}}\frac{d^{3}p_{2}}{2E_{2}} \quad (3.27)
> $$

The denominator is the **Lorentz-invariant flux factor $F$**:
$$
F^{2}=16(E_{a}^{2}p_{b}^{2}+E_{b}^{2}p_{a}^{2}+2E_{a}E_{b}p_{a}p_{b}) \quad (3.28)
$$

Using the collinear relation $(p_{a}\cdot p_{b})^{2}=E_{a}^{2}E_{b}^{2}+p_{a}^{2}p_{b}^{2}+2E_{a}E_{b}p_{a}p_{b}$, $F$ becomes explicitly invariant:
$$
F=4[(p_{a}\cdot p_{b})^{2}-m_{a}^{2}m_{b}^{2}]^{\frac{1}{2}}
$$

### 3.4.2 Scattering in the Centre-of-Mass Frame

In the Centre-of-Mass (CoM) frame, $p_a = -p_b = p_i^*$. The flux factor is $F=4p_{i}^{*}\sqrt{s}$.
Evaluating the phase space integral (analogous to the decay case) gives:
$$
\sigma=\frac{1}{(2\pi)^{2}}\frac{1}{4p_{i}^{*}\sqrt{s}}\int|\mathcal{M}_{fi}|^{2}\delta(\sqrt{s}-E_{1}-E_{2})\delta^{3}(p_{1}+p_{2})\frac{d^{3}p_{1}}{2E_{1}}\frac{d^{3}p_{2}}{2E_{2}} \quad (3.30)
$$

Simplifying gives the **Master Formula for Two-Body Scattering**:

> **CoM Total Cross Section**
> $$
> \sigma=\frac{1}{64\pi^{2}s}\frac{p_{f}^{*}}{p_{i}^{*}}\int|\mathcal{M}_{fi}|^{2}d\Omega^{*} \quad (3.31)
> $$


---

## 3.5 Differential Cross Sections

The differential cross section describes the distribution of scattered particles. From (3.31), we immediately get:
$$
\frac{d\sigma}{d\Omega^{*}}=\frac{1}{64\pi^{2}s}\frac{p_{f}^{*}}{p_{i}^{*}}|\mathcal{M}_{fi}|^{2} \quad (3.33)
$$

### 3.5.1 Differential Cross Section Calculations ($d\sigma/dt$)

It is often useful to use the Lorentz-invariant Mandelstam variable $t$:
$$
t=m_{1}^{2}+m_{3}^{2}-2E_{1}^{*}E_{3}^{*}+2p_{1}^{*}p_{3}^{*}cos~\theta^{*} \quad (3.34)
$$

The solid angle element transforms as:
$$
d\Omega^{*}\equiv d(cos~\theta^{*})d\phi^{*}=\frac{dt~d\phi^{*}}{2p_{1}^{*}p_{3}^{*}} \quad (3.35)
$$

Substituting this into the cross section formula gives:
$$
d\sigma=\frac{1}{128\pi^{2}sp_{i}^{*2}}|\mathcal{M}_{fi}|^{2}d\phi^{*}dt \quad (3.36)
$$

Integrating over $\phi^*$ yields the **Lorentz-Invariant Differential Cross Section**:

> **Invariant Differential Cross Section**
> $$
> \frac{d\sigma}{dt}=\frac{1}{64\pi sp_{i}^{*2}}|\mathcal{M}_{fi}|^{2} \quad (3.37)
> $$

The initial CoM momentum is:
$$
p_{i}^{*2}=\frac{1}{4s}[s-(m_{1}+m_{2})^{2}][s-(m_{1}-m_{2})^{2}] \quad (3.38)
$$

### 3.5.2 Laboratory Frame Differential Cross Section

Consider elastic scattering $e^- p \to e^- p$ in the lab frame (proton at rest).
In the high-energy limit ($s \gg m^2$):
$$
{p_{i}}^{*2}\approx\frac{(s-m_{p}^{2})^{2}}{4s}=\frac{E_{1}^{2}m_{p}^{2}}{s} \quad (3.39, 3.40)
$$

To transform from $d\sigma/dt$ to the Lab frame $d\sigma/d\Omega$:
$$
\frac{d\sigma}{d\Omega}=\frac{d\sigma}{dt}|\frac{dt}{d\Omega}|=\frac{1}{2\pi}\frac{dt}{d(cos~\theta)}\frac{d\sigma}{dt} \quad (3.41)
$$

Using the kinematic relations:
$$
t\approx-2E_{1}E_{3}(1-cos~\theta) \quad (3.42)
$$
$$
t=-2m_{p}(E_{1}-E_{3}) \quad (3.43)
$$
$$
E_{3}=\frac{E_{1}m_{p}}{m_{p}+E_{1}-E_{1}cos~\theta} \quad (3.44)
$$

We compute the derivative:
$$
\frac{dt}{d(cos~\theta)}=2E_{3}^{2} \quad (3.46)
$$

Substituting these into the invariant form yields the **Lab Frame Differential Cross Section**:

> **Lab Frame Differential Cross Section**
> $$
> \frac{d\sigma}{d\Omega}=\frac{1}{64\pi^{2}}(\frac{E_{3}}{m_{p}E_{1}})^{2}|\mathcal{M}_{fi}|^{2} \quad (3.47)
> $$

Explicitly in terms of angle:
$$
\frac{d\sigma}{d\Omega}=\frac{1}{64\pi^{2}}(\frac{1}{m_{p}+E_{1}-E_{1}cos~\theta})^{2}|\mathcal{M}_{fi}|^{2} \quad (3.48)
$$

---

### Summary of Master Formulas

> **Decay Rate**
> $$
> \Gamma=\frac{p^{*}}{32\pi^{2}m_{a}^{2}}\int|\mathcal{M}_{fi}|^{2}d\Omega \quad (3.49)
> $$

> **CoM Cross Section**
> $$
> \frac{d\sigma}{d\Omega^{*}}=\frac{1}{64\pi^{2}s}\frac{P_{f}^{*}}{P_{i}^{*}}|\mathcal{M}_{fi}|^{2} \quad (3.50)
> $$

> **Lab Cross Section**
> $$
> \frac{d\sigma}{d\Omega}=\frac{1}{64\pi^{2}}(\frac{E_{3}}{m_{p}E_{1}})^{2}|\mathcal{M}_{fi}|^{2} \quad (3.51)
> $$