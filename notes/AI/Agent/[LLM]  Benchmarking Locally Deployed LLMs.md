Benchmarking is the systematic process of **evaluating and comparing LLM performance** under controlled conditions.

For locally deployed LLMs, the factors are:
- Model quality
- Latency and throughput
- Hardware efficiency
- Stability and scalability
- Cost-performance trade-offs

# 1. Latency
Latency is how long a user waits, from sending a request to receiving output.

## 1.1 Latency Evaluation Indicators

### Percentile Latency
Percentile latency describes the distribution of request latencies by answering:
“X% of requests finish faster than this time”. It focuses on how latency behaves across fast and slow requests.

Step‑by‑step Calculation:
1. Collect latency values for many requests
2. Sort them from fastest → slowest
3. Pick the value at a given position
   
Example with 100 requests:
1. P50 → the 50th request
2. P90 → the 90th request
3. P99 → the 99th request

**P50 — Median Latency**

P50 is the latency that half of all requests are faster than, representing typical system performance.

- Reflects normal / average user experience
- Mostly affected by:
  - model size
  - prompt length
- Very stable across runs
- Best metric for baseline comparison

**P90 - Tail Latency**

P90 is the latency that 90% of requests are faster than, showing performance under real‑world load.

- Represents slower but common cases
- Sensitive to:
  - moderate concurrency
  - scheduling effects 
- Often used for SLO(Service Level Objective) targets - <br>
    SLO, a specific, measurable performance goal that a service aims to meet for users over a defined time window. 
- Indicates whether the system scales well

**P99 - Extreme Tail Latency**
P99 is the latency that 99% of requests are faster than, representing worst‑case performance and system risk.

- Captures rare but severe slowdowns
- Extremely sensitive to:
  - queueing delays
  - memory / KV cache pressure
  - high concurrency
- Key metric for SLA and stability - <br>
SLA (Service Level Agreement) is a formal, legally binding contract that defines the minimum service performance a provider guarantees to customers.
- Strong indicator of bottlenecks

### Time To First Token (TTFT)
TTFT = time from request sent → first token generated.
多久看到第一个字（“响应性”）

###  Tokens Per Second (TPS)
TPS measures generation speed after the first token.
输出展开速度（“流畅性”）

## 1.2 Latency Factors
```
Total Latency =
  Request handling
+ Tokenization
+ Prefill (prompt processing)
+ Decode (token generation)
+ Scheduling & queueing
+ Hardware overhead
````

### KV Cache

KV Cache (Key‑Value Cache) stores the attention keys and values of previously processed tokens so the model does not recompute them every time a new token is generated. - 保存已经生成过的 token 的注意力 Key 和 Value

Transformer attention needs all previous tokens to generate the next token. Without KV Cache, for token N, we need to recompute attention for tokens `1…N` which leads to complexity grows. While With KV Cache can reuse cached K/V for previous tokens
, and nly compute for the new token, which means decode becomes `O(1)` per token.

### Prefill

Prefill is the time to process the input prompt before generation starts. - 对输入 Prompt 进行编码的时间

Key drivers
- Prompt length (number of tokens)
- Model size (layers × hidden size)
- Attention complexity: O(n²) in sequence length
- KV cache initialization cost
  
Longer prompt ⇒ slower start

### Decode

Decode is the per-token generation cost. - 逐 token 生成的时间成本

Key drivers
- Model size (linear cost per token) - 每个 token 都要跑一遍,随 token 数线性增长
- KV cache read bandwidth
- GPU memory bandwidth
- Token count (output length)

### Time To First Token (TTFT)
TTFT = time from request sent → first token generated.
多久看到第一个字（“响应性”）

###  Tokens Per Second (TPS)
TPS measures generation speed after the first token.
输出展开速度（“流畅性”）

# 2. Resource Utilisation
## 2.1 GPU Utilisation
The rate of time CUDA kernels are running

## 2.2 VRAM Usage
VRAM - Video Random Access Memory - 显存
In locally deployed LLM inference, VRAM is mainly consumed by four components:
1.  Model Weights - The parameters of the neural network
2.  KV Cache - Stores attention key/value tensors for each token
3.  Activations & Temporary Buffers - Intermediate tensors during prefill and decoding; Short-lived but can cause peak usage
4.  Framework & System Overhead - CUDA context, memory pools, runtime buffers; Varies by inference framework

## 2.2 Power Efficiency
Tokens Per Second / Watt

# References
1. [Gemma 4 Runs LOCALLY on 2x RTX 3060 — Full Benchmark (llama.cpp) (31B and 26B-A4B)](https://www.youtube.com/watch?v=8r3oQVHibTI)
2. [Qwen 3.6 vs Gemma 4 Local Ai Benchmarking](https://www.youtube.com/watch?v=xS5wao4H4u4&t=209s)
3. [LLaMA.CPP - LLM inference in C/C++](https://github.com/ggml-org/llama.cpp)