---
title: "When Does Machine Learning Belong in a Research Project?"
summary: "Before choosing a model, examine the research question, available data, evaluation design, and what an ML result could legitimately establish."
publishedAt: 2026-10-23
category: "Machine learning"
order: 2
legacySlug: "exploring-ml-research"
---

Machine learning is now available to researchers in almost every discipline. Availability, however, is not a scientific reason to use it. The relevant question is whether a learning-based approach can answer something that a simpler method cannot, or can do so more reliably under the conditions that matter.

The decision begins with the research objective, not the model family.

## Start with the type of claim you want to make

Some questions are naturally predictive: given a collection of measurements, can a system estimate an unknown quantity or classify an observation? Others ask for an explanation, a causal relationship, or a physical mechanism.

These questions require different evidence.

A model that predicts an outcome accurately does not, by itself, establish which variables *cause* that outcome. Feature importance, correlations, and attention weights do not convert a predictive experiment into a causal study. If explanation or intervention is the objective, the research design has to support that objective.

Even for a predictive task, define the target and the operating context before selecting an algorithm. Predicting a position from radio measurements is a different problem when the model is evaluated on new samples from the same environment than when it must work in a previously unseen building.

## Establish a meaningful baseline

The first comparison should not necessarily involve a large neural network.

A classical estimator, a statistical model, a simple classifier, or an existing domain method can establish what performance is already achievable. This provides a reference for judging whether additional model complexity is warranted.

A fair comparison requires matching the relevant conditions. If one method uses extra sensors, more training data, or substantially greater compute, then the reported improvement does not isolate the effect of its learning algorithm.

The objective also determines the metrics. Accuracy or mean error may be essential, but so may calibration, inference latency, memory, energy, data requirements, and the cost of updating the model. These should not be collapsed into a single notion of “better.”

## The data split is part of the scientific question

A surprisingly strong benchmark result can say very little about practical performance if the evaluation split does not reflect the intended use.

For example, measurements collected along the same trajectory can be highly correlated. Randomly dividing individual measurements into training and test sets may assess interpolation among nearby observations rather than generalization to a new trajectory, device, site, or time period.

The same issue appears in other fields: images from one patient, observations from one participant, or records from the same experimental unit may not be independent.

The appropriate split depends on the claim. If the study promises transfer across environments, an environment-held-out evaluation is more informative than a random sample split. If temporal adaptation matters, a chronological protocol may be necessary.

Preprocessing and model selection also belong inside the training and validation procedure. Using test data to select features, normalize inputs, tune hyperparameters, or make repeated design decisions contaminates the final evaluation.

## Ask what the experiment can falsify

A useful early ML experiment is not a search for an impressive number. It is a test of a concrete hypothesis.

Suppose the hypothesis is that combining two sensing modalities improves robustness when one modality becomes unreliable. Then the evaluation should include controlled degradation, comparisons against each modality alone, and clear metrics for robustness. A higher score on a single clean benchmark does not test the same claim.

A credible negative result is informative too. Perhaps the additional modality contributes little, or a simple baseline performs just as well. Either finding can guide the next experiment.

## Assess robustness before scaling up

If a basic approach shows promise, examine whether the result survives changes that matter to the application:

- different data partitions, random seeds, and operating conditions;
- shifts between training and deployment distributions;
- missing or corrupted inputs;
- smaller training sets or limited labels;
- compute, memory, and communication constraints.

Not every project needs all of these tests. The point is to choose them from the scientific and operational claims, rather than appending them as an arbitrary checklist.

## What about foundation models and LLMs?

Foundation models can be useful when pretrained representations address a genuine data or capability gap. But their availability does not remove the need for baselines, reliable evaluation, or an understanding of the input and output requirements.

For many structured or limited-data problems, a smaller model may remain the more appropriate choice. For others, adaptation or transfer from a pretrained model may be justified. The choice should follow evidence.

Machine learning becomes a sound research method when the problem formulation, data, comparisons, and evaluation are aligned. The interesting question is not whether ML can be applied, but what the resulting experiment would allow us to conclude.
