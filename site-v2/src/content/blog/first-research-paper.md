---
title: "Writing a Research Paper from the Evidence Backwards"
summary: "An approach to drafting a first paper that begins with the research claim, the experimental evidence, and the limits of what the results support."
publishedAt: 2026-10-23
category: "Research practice"
order: 3
legacySlug: "first-research-paper"
---

Writing a research paper is not simply a matter of describing everything completed during a project. A paper makes a contribution that readers should be able to understand, evaluate, and place in relation to existing work.

For a first paper, the hardest part is often not the English, the LaTeX template, or the abstract. It is deciding exactly what the work demonstrates and building a coherent argument around that evidence.

## Define the contribution before drafting the introduction

Try to express the central contribution in a few sentences. What problem is addressed, what changes relative to existing approaches, and which results support that difference?

A contribution does not need to be a completely new class of algorithm. It may be a new formulation, a carefully designed system, a method adapted to a previously unresolved setting, or an empirical finding. But the distinction must be explicit.

Avoid writing a stronger claim than the evidence can sustain. “Improves robustness across environments” requires a different evaluation from “reduces error on a particular benchmark.” The wording of the contribution and the design of the experiment should agree.

## Build an evidence map

Before drafting sections, bring the main results together. For each claim, identify the figure, table, analysis, or proof that supports it.

In an experimental ML paper, this usually means examining the baselines, evaluation metrics, train/validation/test protocol, statistical variability where relevant, and ablations that isolate the contribution of individual components.

Ask what alternative explanation remains. Could a gain come from extra training data, additional features, a different evaluation split, or increased compute? If the experiment cannot distinguish these explanations, the paper should not imply that it can.

This step frequently reveals missing experiments. It is more productive to discover them before writing several pages of conclusions around an incomplete comparison.

## Draft in the order that clarifies the argument

There is no universal writing order, but it is often efficient to begin with the technical material already supported by the work.

**Figures and tables.** Design them to answer a question, not just to display numbers. Captions should identify the experimental condition, metric, and comparison without forcing the reader to search the main text for basic context.

**Methods and experimental setup.** Define the problem, notation, assumptions, datasets or simulation environments, procedures, and implementation choices needed to understand or reproduce the work. Reproducibility is a goal, not a guarantee created by adding more detail indiscriminately.

**Results and interpretation.** Present the observations and explain their significance. The organization of the results should follow the research questions. Be clear when an explanation is a hypothesis rather than something the experiment has directly established.

**Introduction and related work.** Once the contribution and evidence are clear, position them against the most relevant literature. Explain the unresolved issue precisely. Do not construct novelty by dismissing earlier work too broadly or by comparing against an incomplete set of references.

**Abstract and conclusion.** Write them after the argument stabilizes. The abstract should represent the actual question, method, and findings. The conclusion should not introduce claims that were never evaluated.

This order is a drafting aid, not a rigid rule. Different fields and paper types require different structures.

## Revision is a technical process

A useful revision pass goes beyond grammar.

Check whether every central term is defined consistently, equations use compatible notation, all figures are explained, and reported numbers match the tables and experimental records. Examine transitions between sections: does each one answer a question raised by the previous one?

Then read the paper as someone who did not run the experiments. Is the comparison fair? Are the assumptions visible? Can a reader tell what is established, what remains uncertain, and what would be required to reproduce the findings?

Feedback from supervisors and colleagues is especially valuable when it challenges the reasoning, not only the wording. A reviewer who cannot identify the contribution or interpret a plot has exposed a problem worth fixing.

## A paper is an argument readers can inspect

Good scientific writing does not make weak results strong. It makes the problem, methodology, evidence, and limits of the work understandable.

The most useful starting point for a first paper is therefore a question: **What can I demonstrate, and what would another researcher need to see to judge that demonstration?**
