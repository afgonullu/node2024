import { HumanMessage } from '@langchain/core/messages';
import haikuFlow from './flows/haikuFlow';
import HaikuFlowState from './graphs/haiku.graph';

const generateHaiku = async (message: string) => {
  const result = (await haikuFlow.invoke(
    {
      messages: [new HumanMessage(message)],
    },
    {
      configurable: {
        thread_id: '123',
      },
    },
  )) as typeof HaikuFlowState.State;

  return result.messages[result.messages.length - 1].content;
};

const flows = {
  generateHaiku,
};

export default flows;
