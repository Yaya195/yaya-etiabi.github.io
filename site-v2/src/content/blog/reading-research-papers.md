---
title: "Reading a Research Paper: From Relevance to Evidence"
summary: "A practical distinction between screening a paper for relevance and reading it closely enough to evaluate its claims."
publishedAt: 2026-10-23
category: "Research practice"
order: 1
legacySlug: "reading-research-papers"
---

Reading papers is not a single activity. Sometimes the goal is to decide whether a study belongs in a literature review. Sometimes it is to understand a method well enough to reproduce it, challenge it, or build on it. The second task requires substantially more evidence than the first.

I find it useful to separate **screening** from **critical reading**. Confusing the two leads to two common mistakes: spending hours on papers that are only marginally relevant, and citing strong conclusions from papers that have barely been examined.

## First decide what you need from the paper

Before opening the PDF, make the purpose explicit. Are you looking for the origin of an idea, a competing method, an evaluation protocol, or evidence about a particular claim?

During an initial screen, the title and abstract establish the topic, but the main figures, experimental setting, and stated contributions are often more informative. I look for answers to four questions:

- What problem does the paper actually address?
- What is the central claim or contribution?
- Under what assumptions and experimental conditions was it evaluated?
- Is that setting relevant to the question I am investigating?

A paper can be relevant without being persuasive. It can also be technically strong while addressing a different problem. Those are separate judgments.

## A fast read is a decision, not an evaluation

For an initial pass, I examine the abstract, introduction, figures and tables, evaluation section, and conclusion. I pay particular attention to the comparison being made.

For example, a machine learning paper may report a lower prediction error than a baseline. Before treating that as meaningful evidence, I need to know which dataset was used, how the split was constructed, what the baseline actually implements, and whether both systems operated under comparable information and resource budgets.

A short scan can tell me that these questions matter. It usually cannot tell me whether the answers are satisfactory. If I intend to rely on the result in my own work, I move to a closer read.

## Read the method and evidence together

A deep read begins with the claim and works backward through the evidence supporting it.

**Problem formulation.** Identify the inputs, outputs, objective, assumptions, and constraints. Terms such as *robust*, *efficient*, and *generalizable* only become meaningful once the paper specifies what is varied or measured.

**Method.** Reconstruct the main mechanism. What is learned, estimated, optimized, or communicated? Which parts are novel, and which come from existing methods? A diagram can help, but it should not replace the mathematical or algorithmic description.

**Experimental design.** Determine how the data, scenarios, or simulations were selected. For empirical ML, check whether the training and evaluation partitions are independent in the way the deployment scenario requires. For systems work, inspect the assumptions about channels, hardware, computation, or network conditions.

**Results.** Examine the actual evidence, not only the narrative surrounding it. Which baselines are relevant? Are important ablations missing? Do the reported metrics measure the stated objective? Could the observed gain come from a larger model, a more favorable input, or a different resource budget?

**Limitations.** Identify what the experiment does *not* establish. A result measured in one environment is not automatically evidence of generalization to another.

These questions are useful whether a paper is experimental, theoretical, or systems-oriented, although the appropriate standards of evidence will differ.

## Keep notes that you can use later

I prefer notes organized around claims rather than around the paper's section headings. A concise record includes the research question, main contribution, key assumptions, evaluation setting, strongest result, and an unresolved question or limitation.

The distinction between an **author's claim** and **my assessment** matters. A paper may claim broad applicability while only demonstrating performance on a narrowly defined benchmark. Those two statements should not collapse into one note.

When writing a literature review, return to the source before quoting a number or attributing a technical result. Memory and secondary summaries are poor substitutes for checking the actual experiment.

## The purpose is informed selection

The goal is not to read every paper exhaustively. It is to know which papers deserve that attention, and to make sure the claims you carry into your own research have been examined at the appropriate depth.

A quick read should help you choose what to investigate. A deep read should help you explain what a study shows, why it shows it, and where its evidence stops.
