# Tools Development
Agents might: 
1. call the wrong tools, 
2. call the right tools with the wrong parameters
3. call too many tools
4. process tool responses incorrectly

We can improve this by the following solutions:

## 1. Control the amount of tools
Giving an agent too many tool options increases its decision complexity, making it more likely to select the wrong tool, and behave inefficiently. Excessive tools can overwhelm the agent’s reasoning process and degrade accuracy. 

By consolidating similar or related functionalities into a smaller set of higher-level, well-designed tools, we reduce cognitive load, simplify decision-making, and enable the agent to execute tasks more reliably and efficiently.

## 2. Namespacing tools
**Namespacing (grouping related tools under common prefixes)** can help delineate boundaries between lots of tools.

It has been found that selecting between prefix- and suffix-based namespacing to have non-trivial effects on our tool-use evaluations. Effects vary by LLM.

By selectively implementing tools whose names reflect natural subdivisions of tasks, we can
1. reduce the number of tools and tool descriptions loaded into the agent’s context 
2. offload agentic computation from the agent’s context back into the tool calls themselves


## 3. Prompt-engineering descriptions of tools
One of the most effective methods for improving tools: prompt-engineering your tool descriptions and specs. Because these are loaded into your agents’ context, they can collectively steer agents toward effective tool-calling behaviors. 

If you’re writing tools for an MCP server, tool annotations help disclose which tools require open-world access or make destructive changes.

# Code Execution

# References
1. [Writing effective tools for agents — with agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
2. [Tool (aka Function Calling) Best Practices](https://medium.com/@laurentkubaski/tool-or-function-calling-best-practices-a5165a33d5f1)