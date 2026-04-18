#!/bin/bash
# Enhanced NVIDIA NIM Inference Script with Internet Access
# Supports: GLM-5.1, Kimi K2.5
# Usage: ./nim-inference.sh <model> <prompt> [--search <query>] [--web]

set -euo pipefail

# Load environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env.local if it exists
if [ -f "$PROJECT_DIR/.env.local" ]; then
    set -a
    source "$PROJECT_DIR/.env.local"
    set +a
fi

# Configuration
NVIDIA_API_KEY="${NVIDIA_API_KEY:-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}"
NIM_API_URL="https://integrate.api.nvidia.com/v1"
MODEL="${1:-z-ai/glm-5.1}"

echo "Model: $MODEL"
echo "NVIDIA API Key: ${NVIDIA_API_KEY:0:10}..."

# Function to call NVIDIA NIM API
call_nim() {
    local model="$1"
    local messages="$2"
    local temperature="${3:-0.7}"
    local max_tokens="${4:-2048}"
    
    curl -s -X POST "$NIM_API_URL/chat/completions" \
      -H "Authorization: Bearer $NVIDIA_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"model\": \"$model\",
        \"messages\": $messages,
        \"temperature\": $temperature,
        \"max_tokens\": $max_tokens,
        \"stream\": false
      }" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if 'choices' not in data or len(data['choices']) == 0:
    print('Error: No response from API')
    print(json.dumps(data, indent=2))
    sys.exit(1)
choice = data['choices'][0]
msg = choice.get('message', {})
content = msg.get('content') or msg.get('reasoning') or 'No content'
print(content)
"
}

# Function to search web using Tavily
search_web() {
    local query="$1"
    if [ -z "${TAVILY_API_KEY:-}" ]; then
        echo "TAVILY_API_KEY not set. Skipping web search."
        return
    fi
    
    echo "Searching web: $query"
    curl -s -X POST "https://api.tavily.com/search" \
      -H "Content-Type: application/json" \
      -d "{
        \"api_key\": \"$TAVILY_API_KEY\",
        \"query\": \"$query\",
        \"search_depth\": \"basic\",
        \"include_raw_content\": true,
        \"max_results\": 5
      }" | python3 -c "
import json, sys
data = json.load(sys.stdin)
results = data.get('results', [])
if not results:
    print('No search results')
    sys.exit(0)

output = 'Web Search Results:\\n' + '-'*50 + '\\n'
for i, result in enumerate(results[:5], 1):
    title = result.get('title', 'No title')
    url = result.get('url', 'No URL')
    content = result.get('content', 'No content')[:500]
    output += f'{i}. {title}\\n   URL: {url}\\n   Content: {content}...\\n\\n'

print(output)
"
}

# Function to search web using Brave
search_brave() {
    local query="$1"
    if [ -z "${BRAVE_API_KEY:-}" ]; then
        echo "BRAVE_API_KEY not set. Skipping Brave search."
        return
    fi
    
    echo "Searching Brave: $query"
    curl -s -X POST "https://api.search.brave.com/search/v1/web/search" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -H "X-Subscription-Token: $BRAVE_API_KEY" \
      -d "{
        \"q\": \"$query\",
        \"count\": 5
      }" | python3 -c "
import json, sys
data = json.load(sys.stdin)
results = data.get('web', {}).get('results', [])
if not results:
    print('No Brave search results')
    sys.exit(0)

output = 'Brave Search Results:\\n' + '-'*50 + '\\n'
for i, result in enumerate(results[:5], 1):
    title = result.get('title', 'No title')
    url = result.get('url', 'No URL')
    description = result.get('description', 'No description')
    output += f'{i}. {title}\\n   URL: {url}\\n   {description}\\n\\n'

print(output)
"
}

# Parse arguments
shift
PROMPT=""
SEARCH_QUERY=""
USE_WEB=false

while [ $# -gt 0 ]; do
    case "$1" in
        --search)
            shift
            SEARCH_QUERY="$1"
            shift
            ;;
        --web)
            USE_WEB=true
            shift
            ;;
        *)
            PROMPT="$PROMPT $1"
            shift
            ;;
    esac
done

PROMPT="$(echo "$PROMPT" | sed 's/^ *//;s/ *$//')"

# If no prompt and no search, show help
if [ -z "$PROMPT" ] && [ -z "$SEARCH_QUERY" ] && [ "$USE_WEB" = false ]; then
    echo "Usage: $0 [model] <prompt> [--search <query>] [--web]"
    echo ""
    echo "Models:"
    echo "  z-ai/glm-5.1      - GLM-5.1 (default)"
    echo "  moonshotai/kimi-k2.5 - Kimi K2.5 Vision"
    echo ""
    echo "Options:"
    echo "  --search <query>   - Perform web search before inference"
    echo "  --web             - Enable web browsing mode"
    echo ""
    echo "Examples:"
    echo "  $0 z-ai/glm-5.1 \"What is the capital of France?\""
    echo "  $0 moonshotai/kimi-k2.5 \"Explain AI\" --search \"latest AI research\""
    exit 1
fi

# Build messages array
MESSAGES_JSON="[]"

# Add web search results if requested
if [ -n "$SEARCH_QUERY" ]; then
    SEARCH_RESULTS="$(search_web "$SEARCH_QUERY")"
    if [ -n "$SEARCH_RESULTS" ]; then
        PROMPT="$PROMPT

Context from web search:
$SEARCH_RESULTS"
    fi
fi

if [ "$USE_WEB" = true ]; then
    echo "Web browsing mode enabled. Add instructions for web access in your prompt."
fi

# Call NVIDIA NIM
MESSAGES_JSON=$(python3 -c "
import json, sys
prompt = sys.argv[1]
if not prompt:
    print('[]')
    sys.exit(0)
print(json.dumps([{'role': 'user', 'content': prompt}]))
" "$PROMPT")

call_nim "$MODEL" "$MESSAGES_JSON"
