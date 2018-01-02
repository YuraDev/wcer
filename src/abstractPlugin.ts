import { Plugin } from "webpack";
export default abstract class AbstractPlugin implements Plugin {
  context: any;

  abstract apply(options?: any);
}