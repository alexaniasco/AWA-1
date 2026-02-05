import Reactotron from "reactotron-react-js";
const reactotron = Reactotron.configure() // we can use plugins here -- more on this later
  .connect(); // let's connect!

export default reactotron;
