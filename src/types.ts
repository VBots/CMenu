import { UploadSource } from "vk-io/lib/upload/upload";
// import Updates from "vk-io/lib/updates/updates";
import { MessageContext } from "vk-io";

export {
    MessageContext,
    UploadSource
}

// Whoops
declare type Middleware<T> = (context: T, next: (() => Promise<any>)) => any;
declare type HearFunctionCondition<T, U> = (value: T, context: U) => boolean;
declare type HearCondition<T, U> = HearFunctionCondition<T, U> | RegExp | string;
declare type HearObjectCondition<T extends Record<string, any>> = {
    [P in keyof T]: HearCondition<T[P], T> | HearCondition<T[P], T>[];
};
export interface VKUpdates {
  hear<T = {}>(
    hearConditions:
      | (
          | HearCondition<string | null, T & MessageContext>[]
          | HearCondition<string | null, T & MessageContext>)
      | (
          | HearObjectCondition<T & MessageContext>
          | HearObjectCondition<T & MessageContext>[]),
    handler: Middleware<MessageContext & T>
  ): this;
}

// export interface IContext extends MessageContext {
// 	state: {
//         command: string;
//     };

// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	[key: string]: any;
// }