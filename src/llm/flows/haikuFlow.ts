import { MemorySaver, StateGraph } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { createHaiku, findWord } from 'llm/agents';
import HaikuFlowState from '../graphs/haiku.graph';

// Define the function to format the response
const formatResponse = async (state: typeof HaikuFlowState.State) => {
  const { haiku, suggestedWord } = state;
  const formattedResponse = `I've chosen the word "${suggestedWord}" for your haiku. Here it is:\n\n${haiku}`;
  return { messages: [new AIMessage(formattedResponse)] };
};

// Create the graph
const workflow = new StateGraph(HaikuFlowState)
  .addNode('find_word', findWord)
  .addNode('create_haiku', createHaiku)
  .addNode('format_response', formatResponse)
  .addEdge('__start__', 'find_word')
  .addEdge('find_word', 'create_haiku')
  .addEdge('create_haiku', 'format_response')
  .addEdge('format_response', '__end__');

const checkPointer = new MemorySaver();

// Compile the graph
const haikuFlow = workflow.compile({
  checkpointer: checkPointer,
});

export default haikuFlow;
