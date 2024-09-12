import { Annotation } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';

const HaikuFlowState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  suggestedWord: Annotation<string>(),
  haiku: Annotation<string>(),
});

export default HaikuFlowState;
