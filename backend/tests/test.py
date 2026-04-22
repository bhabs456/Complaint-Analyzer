import pickle

# =========================
# LOAD MODEL + VECTORIZER
# =========================
model = pickle.load(open("../ml_models/model.pkl", "rb"))
vectorizer = pickle.load(open("../ml_models/vectorizer.pkl", "rb"))

# =========================
# TEST DATA (UNSEEN)
# =========================
tests = [
  {"description": "water overflowing from drain and spreading across road causing foul smell", "expected": "sewage"},
  {"description": "heavy rain led to waterlogging and vehicles stuck in traffic for hours", "expected": "sewage"},
  {"description": "electric wire fell on road and is sparking dangerously near pedestrians", "expected": "electricity"},
  {"description": "street completely dark due to multiple streetlights not functioning", "expected": "lighting"},
  {"description": "garbage burning in open area producing thick smoke and air pollution", "expected": "pollution"},
  {"description": "broken road with deep potholes causing accidents and traffic congestion", "expected": "roads"},
  {"description": "water pipe burst leading to continuous leakage and flooding nearby area", "expected": "water"},
  {"description": "sewer blockage causing dirty water to overflow onto main street", "expected": "sewage"},
  {"description": "power cut at night along with non working streetlights creating unsafe conditions", "expected": "electricity"},
  {"description": "dust and smoke from construction site reducing air quality significantly", "expected": "pollution"},

  {"description": "garbage accumulation near market area causing bad smell and hygiene issues", "expected": "sanitation"},
  {"description": "traffic signal failure leading to heavy congestion at busy intersection", "expected": "traffic"},
  {"description": "waterlogging near bus stop due to poor drainage system after rainfall", "expected": "sewage"},
  {"description": "dim streetlights making road visibility very poor during night", "expected": "lighting"},
  {"description": "electric transformer emitting sparks and loud noise near residential area", "expected": "electricity"},
  {"description": "overflowing drain water damaging road surface and creating potholes", "expected": "sewage"},
  {"description": "continuous water leakage from underground pipeline weakening road structure", "expected": "water"},
  {"description": "vehicles stuck due to illegal parking and heavy traffic congestion", "expected": "traffic"},
  {"description": "garbage burning combined with dust causing breathing problems in area", "expected": "pollution"},
  {"description": "cracked and uneven road surface making driving dangerous for commuters", "expected": "roads"},

  {"description": "blocked sewer line causing stagnant dirty water and foul smell", "expected": "sewage"},
  {"description": "frequent power outages disrupting daily life in residential locality", "expected": "electricity"},
  {"description": "streetlights flickering continuously and some completely not working", "expected": "lighting"},
  {"description": "waste not collected for days leading to garbage overflow on streets", "expected": "sanitation"},
  {"description": "water supply contaminated with muddy water affecting households", "expected": "water"}
]


# =========================
# TESTING LOOP
# =========================
correct = 0

for i, test in enumerate(tests):
    text = test["description"]
    expected = test["expected"]

    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]

    if pred == expected:
        print(f"✅ Test {i+1} PASSED")
        correct += 1
    else:
        print(f"❌ Test {i+1} FAILED")
        print(f"   Input: {text}")
        print(f"   Expected: {expected}")
        print(f"   Got: {pred}")

# =========================
# FINAL SCORE
# =========================
total = len(tests)
accuracy = (correct / total) * 100

print(f"\n🎯 Accuracy: {correct}/{total} = {accuracy:.2f}%")