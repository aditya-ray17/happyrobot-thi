#!/bin/bash

# HappyRobot Carrier Sales API Test Script
# Run this script to test all API endpoints

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Testing HappyRobot Carrier Sales API${NC}"
echo "================================================"

# Test 1: Health Check
echo -e "\n${YELLOW}1. Testing Health Check${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/health.json http://localhost:3000/health)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    cat /tmp/health.json
else
    echo -e "${RED}❌ Health check failed (HTTP $response)${NC}"
fi

# Test 2: Load Search
echo -e "\n${YELLOW}2. Testing Load Search${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/loads.json -X POST http://localhost:3000/api/loads/search \
  -H "Content-Type: application/json" \
  -d '{"origin": "Chicago"}')
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Load search passed${NC}"
    cat /tmp/loads.json
else
    echo -e "${RED}❌ Load search failed (HTTP $response)${NC}"
fi

# Test 3: MC Verification
echo -e "\n${YELLOW}3. Testing MC Verification${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/fmcsa.json -X POST http://localhost:3000/api/fmcsa/verify \
  -H "Content-Type: application/json" \
  -d '{"mc_number": "172379"}')
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ MC verification passed${NC}"
    cat /tmp/fmcsa.json
else
    echo -e "${RED}❌ MC verification failed (HTTP $response)${NC}"
fi

# Test 4: Call Recording
echo -e "\n${YELLOW}4. Testing Call Recording${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/call.json -X POST http://localhost:3000/api/calls/record \
  -H "Content-Type: application/json" \
  -d '{"call_id": "test-'$(date +%s)'", "mc_number": "172379", "carrier_name": "Test Carrier", "classification": "booked", "sentiment": "positive"}')
if [ "$response" = "201" ]; then
    echo -e "${GREEN}✅ Call recording passed${NC}"
    cat /tmp/call.json
else
    echo -e "${RED}❌ Call recording failed (HTTP $response)${NC}"
fi

# Test 5: Metrics
echo -e "\n${YELLOW}5. Testing Metrics${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/metrics.json http://localhost:3000/api/metrics)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Metrics retrieval passed${NC}"
    cat /tmp/metrics.json
else
    echo -e "${RED}❌ Metrics retrieval failed (HTTP $response)${NC}"
fi

# Test 6: Error Handling
echo -e "\n${YELLOW}6. Testing Error Handling${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/error.json -X POST http://localhost:3000/api/fmcsa/verify \
  -H "Content-Type: application/json" \
  -d '{}')
if [ "$response" = "400" ]; then
    echo -e "${GREEN}✅ Error handling passed${NC}"
    cat /tmp/error.json
else
    echo -e "${RED}❌ Error handling failed (HTTP $response)${NC}"
fi

echo -e "\n${YELLOW}================================================"
echo -e "🎉 API Testing Complete!${NC}"
echo -e "Check the responses above to verify all endpoints are working."
echo -e "================================================"

# Cleanup
rm -f /tmp/health.json /tmp/loads.json /tmp/fmcsa.json /tmp/call.json /tmp/metrics.json /tmp/error.json
