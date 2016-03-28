import TinkerGraph from './structure/TinkerGraph';


export const createGraph = () => {
  return new TinkerGraph()
}

export default {
  createGraph
};
