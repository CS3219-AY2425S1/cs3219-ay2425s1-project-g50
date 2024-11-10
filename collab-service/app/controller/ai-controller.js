import { sendAiMessage } from "../model/repository.js";

// send ai message
export async function sendAiMessageController(req, res) {
  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: "Message content is required" });
  }

  const returnMessage = await sendAiMessage(messages);
  if (returnMessage) {
    res.status(200).json({ data: returnMessage });
  } else {
    res.status(500).json({ error: "Failed to retrieve AI response" });
  }
}
