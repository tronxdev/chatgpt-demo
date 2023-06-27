"use server";

import { StatusCodes } from "http-status-codes";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);
const model = process.env.OPENAI_GPT_MODEL as string;

export async function generateConversation(
  messages: ChatCompletionRequestMessage[]
): Promise<{
  created: number;
  message: ChatCompletionRequestMessage | undefined;
}> {
  const { status, statusText, data } = await openAI.createChatCompletion({
    model,
    messages,
  });

  if (status === StatusCodes.OK) {
    return { created: data.created, message: data.choices[0].message };
  } else {
    throw new Error(statusText);
  }
}
