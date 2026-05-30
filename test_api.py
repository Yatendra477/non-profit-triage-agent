import urllib.request, json, time

# Test 1: Health check
print("=== TEST 1: Health Check ===")
res = urllib.request.urlopen("http://localhost:8000/health")
print(json.loads(res.read()))

# Test 2: Triage - Donation message
print()
print("=== TEST 2: Donation message ===")
data = json.dumps({"message": "Hi, I am Sarah from Chicago. I want to donate 500 dollars. My email is sarah@example.com"}).encode()
req = urllib.request.Request("http://localhost:8000/triage", data=data, headers={"Content-Type": "application/json"})
t = time.time()
res = urllib.request.urlopen(req, timeout=60)
elapsed = round((time.time()-t)*1000)
result = json.loads(res.read())
print("Intent:", result["intent"])
print("Urgency:", result["urgency"])
print("Route:", result["route"])
print("Escalated:", result["escalated"])
print("Entities:", result["entities"])
print("Response preview:", result["response"][:150])
print("Time:", elapsed, "ms")

# Test 3: Triage - Emergency message
print()
print("=== TEST 3: Emergency message ===")
data2 = json.dumps({"message": "URGENT my mother is stranded without food after the flood. Please help immediately!"}).encode()
req2 = urllib.request.Request("http://localhost:8000/triage", data=data2, headers={"Content-Type": "application/json"})
t2 = time.time()
res2 = urllib.request.urlopen(req2, timeout=60)
elapsed2 = round((time.time()-t2)*1000)
result2 = json.loads(res2.read())
print("Intent:", result2["intent"])
print("Urgency:", result2["urgency"])
print("Route:", result2["route"])
print("Escalated:", result2["escalated"])
print("Time:", elapsed2, "ms")
