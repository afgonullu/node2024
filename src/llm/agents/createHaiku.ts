import { ChatAnthropic } from '@langchain/anthropic';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import HaikuFlowState from '../graphs/haiku.graph';

const model = new ChatAnthropic({
  modelName: 'claude-3-haiku-20240307',
  temperature: 0.7,
});

const haikuPrompt = ChatPromptTemplate.fromTemplate(
  `For given messages, create a haiku.
  Messages: {messages}
  Include the word chosen by the user.
  Also include the word: {suggestedWord}
  Respond with only the haiku, no additional text.`,
);

const chain = haikuPrompt.pipe(model);

const createHaiku = async (state: typeof HaikuFlowState.State) => {
  const messages = state.messages.map((message) => message.content).join('\n');
  const response = await chain.invoke({
    messages,
    suggestedWord: state.suggestedWord,
  });
  return { haiku: response.content };
};

export default createHaiku;
