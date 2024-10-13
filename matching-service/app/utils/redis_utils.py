import os
import redis.asyncio as redis

match_channel = 'match_channel'

# Initialize Redis client
async def get_redis():
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = os.getenv("REDIS_PORT", "6379")
    return redis.Redis(host=redis_host, port=int(redis_port), db=0, decode_responses=True)

# Helper function to build a unique queue key based on topic and difficulty
def build_queue_key(topic, difficulty):
    return f"{topic}:{difficulty}"

# Asynchronous task to listen for matches
async def listen_for_matches(redis_client):
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(match_channel)
    async for message in pubsub.listen():
        if message["type"] == "message":
            print(f"Match notification: {message['data']}")
            
# Asynchronous matching logic
async def find_match(user_id, topic, difficulty):
    redis_client = await get_redis()
    queue_key = build_queue_key(topic, difficulty)

    # Check for users in the queue with the same topic and difficulty
    queue_length = await redis_client.llen(queue_key)
    if queue_length > 1:  # There's at least one other user waiting
        for _ in range(queue_length):
            matched_user = await redis_client.rpop(queue_key)  # Pop the first user in queue
            if matched_user != user_id:
                # Remove the current user from the queue
                await redis_client.lrem(queue_key, count=1, value=user_id)
                return matched_user

    # No match found
    return None