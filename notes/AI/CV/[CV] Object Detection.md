# 1. Models

## Two-stage Detectors

A Two-Stage Detector is an object detection approach that works in two steps:

找出物体 (Region Proposals) → 识别物体 (Object Recognition)

1. Generate region proposals to identify potential regions where objects might exist
2. Classify these proposals while refining their coordinates



## One-stage Detectors

找出物体同时识别物体 - Detecting objects in images using a single deep neural network

Faster; more suitable for real-time tasks



# 2. Evaluation Metrics

## Precision/Recall

- TP: True Positives
- FP: False Positives 误报 - Precision
- TN: True Negatives
- FN: False Negatives 漏报 - Recall

**Precision**
$$
Precision = \frac{TP}{TP + FP}
$$
Quality of positive predictions (avoiding false positives).
根据误报率高低，反映prediction正例的质量。

**Recall**
$$
Recall = \frac{TP}{TP + FN}
$$
Coverage of actual positives (avoiding false negatives).
根据漏报率高低，反映prediction正例的覆盖率。

**F1-score**
$$
F1Score = 2 \times \frac{Precision \times Recall}{Precision + Recall}
$$
The harmonic mean of Precision and Recall, useful when you want a balance between the two.

![Confusion Matrix](https://cdn.prod.website-files.com/680a070c3b99253410dd3df5/68b076093e586171113e7da9_mAP_fig2.webp)

**IoU - Intersection over union**

IoU measures the overlap between 2 boundaries.
We use that to measure how much our predicted boundary overlaps with the actual boundary.



