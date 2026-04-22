# Bechmarking
Benchmarking is the systematic process of **evaluating and comparing LLM performance** under controlled conditions.

For locally deployed LLMs, the factors are:
- Model quality
- Latency and throughput
- Hardware efficiency
- Stability and scalability
- Cost-performance trade-offs

## Latency
Latency is how long a user waits, from sending a request to receiving output.

### Time To First Token (TTFT)
TTFT = time from request sent → first token generated.
多久看到第一个字（“响应性”）

###  Tokens Per Second (TPS)
TPS measures generation speed after the first token.
输出展开速度（“流畅性”）

## Resource Utilisation
### GPU Utilisation
The rate of time CUDA kernels are running

## Power Efficiency
Tokens Per Second / Watt

## VRAM Usage
VRAM - Video Random Access Memory - 显存
In locally deployed LLM inference, VRAM is mainly consumed by four components:
1.  Model Weights - The parameters of the neural network
2.  KV Cache - Stores attention key/value tensors for each token
3.  Activations & Temporary Buffers - Intermediate tensors during prefill and decoding; Short-lived but can cause peak usage
4.  Framework & System Overhead - CUDA context, memory pools, runtime buffers; Varies by inference framework

# References
1. [Gemma 4 Runs LOCALLY on 2x RTX 3060 — Full Benchmark (llama.cpp) (31B and 26B-A4B)](https://www.youtube.com/watch?v=8r3oQVHibTI)
2. [Qwen 3.6 vs Gemma 4 Local Ai Benchmarking](https://www.youtube.com/watch?v=xS5wao4H4u4&t=209s)
3. [LLaMA.CPP - LLM inference in C/C++](https://github.com/ggml-org/llama.cpp)