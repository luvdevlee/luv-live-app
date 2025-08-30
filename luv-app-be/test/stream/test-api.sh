#!/bin/bash

# Stream API Test Script
# Sử dụng: chmod +x test-api.sh && ./test-api.sh

BASE_URL="http://localhost:8000/graphql"
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGIwMjJjYWI1OGY1ZjMyNDVjYTY4YTIiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NjUzNzc1MywiZXhwIjoxNzU2NjI0MTUzfQ.Ybq8XZL3w1idcxj4oDnKAVTYTCv2D_QKhun2pdUWTWM"

echo "🧪 Testing Stream API..."

# Test 1: Get public streams (không cần auth)
echo "📋 Test 1: Get public streams"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetStreams { streams(query: { page: 1, limit: 5 }) { streams { _id title status user { username } } meta { totalCount } } }"
  }' | jq '.'

echo -e "\n"

# Test 2: Get streams simple
echo "📋 Test 2: Get streams simple"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetStreamsSimple { streamsSimple { _id title status user_id } }"
  }' | jq '.'

echo -e "\n"

# Test 3: Create stream (cần auth token)
echo "📋 Test 3: Create stream (cần auth token)"
if [ "$AUTH_TOKEN" != "YOUR_JWT_TOKEN_HERE" ]; then
  curl -X POST $BASE_URL \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
      "query": "mutation CreateStream($input: CreateStreamDto!) { createStream(createStreamDto: $input) { _id title status user_id } }",
      "variables": {
        "input": {
          "title": "Test Stream from Script",
          "description": "Testing from bash script",
          "category": "Testing"
        }
      }
    }' | jq '.'
else
  echo "⚠️  Cần cập nhật AUTH_TOKEN trước khi test mutation"
fi

echo -e "\n"

# Test 4: Get my streams (cần auth token)
echo "📋 Test 4: Get my streams (cần auth token)"
if [ "$AUTH_TOKEN" != "YOUR_JWT_TOKEN_HERE" ]; then
  curl -X POST $BASE_URL \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
      "query": "query GetMyStreams { myStreams(query: { page: 1, limit: 10 }) { streams { _id title status } meta { totalCount } } }"
    }' | jq '.'
else
  echo "⚠️  Cần cập nhật AUTH_TOKEN trước khi test authenticated query"
fi

echo -e "\n"

# Test 5: Search streams
echo "📋 Test 5: Search streams"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query SearchStreams { streams(query: { search: \"gaming\", status: LIVE }) { streams { _id title category } meta { totalCount } } }"
  }' | jq '.'

echo -e "\n✅ Tests completed!"
