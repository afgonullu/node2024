import { ChatAnthropic } from '@langchain/anthropic';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import HaikuFlowState from '../graphs/haiku.graph';

const model = new ChatAnthropic({
  modelName: 'claude-3-haiku-20240307',
  temperature: 0.7,
});

const wordFinderPrompt = ChatPromptTemplate.fromTemplate(
  `Based on the following message history, suggest an appropriate and interesting word that could be used in a haiku: "{messages}"
  Respond with only the word, No Haiku, No additional text.`,
);

const chain = wordFinderPrompt.pipe(model);

const findWordModel = async (state: typeof HaikuFlowState.State) => {
  const messages = state.messages.map((message) => message.content).join('\n');
  const response = await chain.invoke({ messages });

  const suggestedWord = response.content;

  return { suggestedWord };
};

export default findWordModel;
