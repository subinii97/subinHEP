---
title: Paper Reading - Attention Is All You Need
date: 2026-01-16
category: Paper Reading
---

# Attention Is All You Need

**Authors:** Ashish Vaswani, et al. (2017)

## Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.

## Key Concepts
1. **Self-Attention:** A mechanism relating different positions of a single sequence in order to compute a representation of the sequence.
2. **Multi-Head Attention:** Allows the model to jointly attend to information from different representation subspaces at different positions.
3. **Positional Encoding:** Since the model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence.

---

## Daily Reflection
The Transformer architecture has revolutionized NLP and beyond. dispense with recurrence allows for significantly more parallelization.
