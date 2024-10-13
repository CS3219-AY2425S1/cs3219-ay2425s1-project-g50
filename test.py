import asyncio
import httpx

# The base URL of your FastAPI app
BASE_URL = "http://localhost:6969"  # Update with the correct port for your service

async def enqueue_user(user_id, topic, difficulty):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{BASE_URL}/match/queue/{user_id}", params={"topic": topic, "difficulty": difficulty})
        return response.json()

async def test_concurrent_enqueues():
    # Simulate concurrent API calls
    topic = "math"
    difficulty = "easy"

    tasks = []
    print("Enqueueing n users...")
    for i in range(10):
        print(f"Enqueueing user {i}")
        tasks.append(enqueue_user(f"u{i}", topic, difficulty))
    print("Enqueueing done!")
    # Run both requests concurrently
    results = await asyncio.gather(*tasks)

    for i, result in enumerate(results):
        print(f"Response {i+1}: {result}")

# Run the test
asyncio.run(test_concurrent_enqueues())
