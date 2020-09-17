import {
    Context,
    IMessageContextSendOptions,
    IUploadSourceMedia,
    KeyboardBuilder,
    MessageContext,
} from 'vk-io';
import { CMenu } from './';

export type AllowArray<T> = T | T[];

export interface HandlerFunction {
    (context: Context): boolean;
}

export interface ICatcherKitStorage {
    /**
     * Набор типов
     */
    types: string[];
    /**
     * Набор ID триггерных стикеров
     */
    stickers: number[];
    /**
     * Триггерные слова
     */
    words: string[];
};

export type ICatcherKitType =
    | ICatcherKitStorage['types']
    | ICatcherKitStorage['stickers']
    | string
    | number;


export interface ICustomContext {
    checkMenu: (menu: CMenu, context: Context) => boolean;

    sendCM: (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions,
        text: string | IMessageContextSendOptions,
        params?: IMessageContextSendOptions
    ) => Promise<MessageContext>;

    replyCM: (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions,
        text: string | IMessageContextSendOptions,
        params?: IMessageContextSendOptions
    ) => Promise<MessageContext>;

    sendPhotosCM: (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions,
        rawSources: AllowArray<IUploadSourceMedia>,
        params: IMessageContextSendOptions
    ) => Promise<MessageContext>;

    sendDocumentsCM: (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions,
        rawSources: AllowArray<IUploadSourceMedia>,
        params: IMessageContextSendOptions
    ) => Promise<MessageContext>;

    sendAudioMessageCM: (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions,
        source: IUploadSourceMedia,
        params: IMessageContextSendOptions
    ) => Promise<MessageContext>;
}

export type IKeyboardGenerator = (context: MessageContext, menuID?: CMenu['cmd'] | null, menuParams?: IKeyboardGeneratorOptions) => KeyboardBuilder;

export interface IKeyboardGeneratorOptions {
    isOneTime?: boolean;
    isInline?: boolean
};
