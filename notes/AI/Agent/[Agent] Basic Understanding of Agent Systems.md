# Agent
An agent is defined as any entity that can perceive its **Environment** through **Sensors**, and autonomously take **Actions** through **Actuators** to achieve specific goals.

1. Its intelligence maily comes from **Autonomy** - it can make independent decisions based on its perceptions and internal state to achieve its design goals. <br>
2. There may be other actors in the environment, forming a **multi-agent** environment. <br>

An agent does not complete tasks in one go but interacts with the environment through a continuous loop - **Agent Loop**. 
![Basic loop of agent-environment interaction](https://raw.githubusercontent.com/datawhalechina/Hello-Agents/main/docs/images/1-figures/1757242319667-5.png)
1. **Perception**: Starting point of the loop. <br>
   The agent receives input information from the environment through its sensors. <br>
   This information is called **Observation**, can be:
    - either the user's initial instruction 
    - or feedback on environmental state changes caused by the previous action.
2. **Thought**: After receiving observation information, the agent enters its core decision-making stage. <br>
   For LLM agents, this is typically an **internal reasoning process** driven by LLMs which can be further subdivided into two key links:
   - **Planning**: Based on current observations and its internal memory, the agent updates its understanding of the task and environment and formulates or adjusts an action plan. This may involve decomposing complex goals into a series of more specific subtasks.
   - **Tool Selection**: Based on the current plan, the agent selects the most suitable tool from its available tool library to execute the next step and determines the specific parameters needed to call that tool.
3. **Action**: After decision-making is complete, the agent executes specific actions through its actuators. This typically manifests as calling a selected tool (such as a code interpreter or search engine API), thereby influencing the environment with the intent to change its state.

Action is not the end of the loop. The agent's action causes a **state change** in the environment, which then produces a new **observation** as result feedback and is captured by the agent's **perception** system in the next round of the loop, forming a continuous "perceive-think-act-observe" closed loop. 

# Aget Framework
An Agent framework will provide a general Agent base class or executor that encapsulates the Agent Loop.

A robust agent system should consist of multiple loosely coupled modules:
1. **Model Layer**: Responsible for interacting with LLMs.
2. **Tool Layer**: Provides standardized tool definition, registration, and execution interfaces.
3. **Memory Layer**: Handles short-term and long-term memory, can switch different memory strategies according to needs (such as sliding window, summary memory). 


# Agent Communication Protocol
Agent work faces three fundamental limitations. 
1. **Tool Integration**: Whenever we need to access a new external service (such as GitHub API, database, file system), we must write a specialized Tool class. This is not only labor-intensive, but tools written by different developers cannot be compatible with each other. Second is the 
2. **Capability Expansion**: The agent's capabilities are limited to the predefined tool set and cannot dynamically discover and use new services. 
3. **Lack of collaboration**: When tasks are complex enough to require multiple specialized agents to collaborate (such as researcher + writer + editor), we can only coordinate their work through manual orchestration.

**Communication protocols** can solve these problems. It provides a set of standardized interface specifications that allow agents to access various external services.

**MCP (Model Context Protocol)** is the most popular protocol to standardize the communication method between agents and external tools/resources. MCP defines a unified protocol specification that allows all services to be accessed in the same way, so that we don't need to write specialized adapters for each service.

Without MCP:
```
class GitHubTool(BaseTool):
    """GitHub API Adaptor"""
    def run(self, repo_url):
        # Call APIs
        pass

class DatabaseTool(BaseTool):
    """Database Adaptor"""
    def run(self, query):
        # Database connect and CRUD
        pass

class WeatherTool(BaseTool):
    """Weather API Adaptor"""
    def run(self, location):
        # Call APIs
        pass

# Every new service need to have an adaptor
# Including custom implementation, prompt logic and tool calls
agent.add_tool(GitHubTool())
agent.add_tool(DatabaseTool())
agent.add_tool(WeatherTool())
```

With MCP:
```
from hello_agents.tools import MCPTool

# Connect to MCP Server and access built-in tools
mcp_tool = MCPTool()  # Built-in server provides basic tools

# or connect to seperate MCP Server for each service
github_mcp = MCPTool(server_command=["npx", "-y", "@modelcontextprotocol/server-github"])
database_mcp = MCPTool(server_command=["python", "database_mcp_server.py"])

# No need to write adaptors for services
agent.add_tool(mcp_tool)
agent.add_tool(github_mcp)
agent.add_tool(database_mcp)
```

## MCP Arichitecture
The MCP is based on a **client-server architecture**.
![MCP Architecture](https://mcpcat.io/images/blog/mcp-architecture.png)
Suppose you are using Claude Desktop and asking: "What documents are on my desktop?":
1. **Host**: are LLM applications that want to access data through MCP (e.g. Claude Desktop, IDEs, AI Agents). <br>
   Claude Desktop acts as the Host here, responsible for receiving user questions and interacting with the Claude model. The Host is the interface users directly interact with, managing the entire conversation flow.
2. **Client**: maintain 1-to-1 connections with servers inside the Host applications. <br>
   When the Claude model decides it needs to access the file system, the MCP Client built into the Host is activated. The Client is responsible for establishing connections with the appropriate MCP Server, sending requests, and receiving responses.
3. **Server**: are lightweight programs that each expose specific capabilities through MCP. <br>
   The file system MCP Server is called, executes the actual file scanning operation, accesses the desktop directory, and returns the list of found documents.

## How does MCP work?
![the interaction between an MCP Client and an MCP Server](https://global.discourse-cdn.com/dlai/optimized/3X/3/1/315fa3ff153faf1700fd84260ef2d2bc78264e5f_2_1035x543.jpeg)
1. **Tools** are actions or functions that the client can call. (methods to access data)
2. **Resources** are read-only data exposed by the server. (data)
3. **Prompt Templates** are pre-defined templates for AI interactions.


To develop a MCP Server end with Python SDK-<br>
Defining a **Tool**:
```
@mcp.tool()
def calculate_total_price_with_tax(subtotal: float, tax_rate: float) -> float:
    """
    Args:
        subtotal: The pre-tax amount of the purchase
        tax_rate: The tax rate as a decimal (e.g. 0.15 for 15%)

    Returns:
        The total purchase amount including tax
    """
    return subtotal + (subtotal * tax_rate)
```

Expose a **Resource**:
```
# Direct -> return a list of documents
@mcp.resource(
    "docs://documents",
    mime_type="application/json" # Give the client a hint as to what data you are returning
)
def list_docs():
    # Return a list of document names

# Templated -> return a specific document
@mcp.resource(
    "docs://documents/{doc_id}",
    mime_type="text/plain"
)
def fetch_doc(doc_id: str):
    # Return the contents of a doc
```

Expose a **Prompt Template** -> high quality prompts, efficient prompt engineering:
```
@mcp.prompt(
    name="format",
    description="Rewrites the contents of a document in Markdown format",
)
def format_document(
    doc_id: str,
) -> list[base.Message]:
    # Return a list of messages
```

# References
1. [Building Agent Systems from Scratch : Hello-Agents](https://datawhalechina.github.io/hello-agents/#/)