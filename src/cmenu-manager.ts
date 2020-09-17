import { MessageContext, Composer } from 'vk-io';
import { HearManager } from '@vk-io/hear';
import {
    Middleware,
    MiddlewareReturn,
    NextMiddleware,
    skipMiddleware,
} from 'middleware-io';

import { AllowArray, ICustomContext, IKeyboardGenerator } from './types';
import { checkMenu, CMenu } from './cmenu';
import { ModifiyContext } from './other';

export class CMenuManager<C extends MessageContext> {
    // @ts-ignore
    private composer = Composer.builder<C>();

    private fallbackHandler: Middleware<C & ICustomContext> = skipMiddleware;

    private composed!: Middleware<C>;

    public menuGenerator: IKeyboardGenerator;

    private hearMan?: HearManager<C>;

    public constructor(menuGenerator: IKeyboardGenerator, hearMan?: HearManager<C>) {
        this.recompose();
        this.menuGenerator = menuGenerator;
        if (hearMan) {
            this.hearMan = hearMan;
        }
    }

    public get length(): number {
        return this.composer.length;
    }

    public get middleware(): Middleware<C & ICustomContext> {
        return (context: C & ICustomContext, next: NextMiddleware): unknown => {
            ModifiyContext(this, context);
            return this.hearMan ? next() : this.composed(context, next);
        };
    }

    public hear<T = {}>(
        hearConditions: AllowArray<CMenu>,
        handler: Middleware<C & T & ICustomContext>
    ): this {
        const rawConditions = !Array.isArray(hearConditions)
            ? [hearConditions]
            : hearConditions;

        const hasConditions = rawConditions.every(Boolean);

        if (!hasConditions) {
            throw new Error('Condition should be not empty');
        }

        const hasConditions2 = rawConditions.every(
            (r) =>
                (r.constructor && r.constructor.name === 'CMenu') ||
                r instanceof CMenu
        );

        if (!hasConditions2) {
            throw new TypeError('Condition should be CMenu');
        }

        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }

        const condition = (condition: CMenu) => (
                text: string | undefined,
                context: C
            ): boolean => {
                const passed = checkMenu(condition, context);

                if (text && condition.isHere(context)) {
                    context.$match = condition.match(text!)!;
                }

                return passed;
            }

        if (this.hearMan) {
            rawConditions.forEach((menu) => this.hearMan!.hear(condition(menu), handler));
            return this;
        }

        const conditions = rawConditions.map(
            condition
        );

        this.composer.use(
            (
                context: C & T & ICustomContext,
                next: NextMiddleware
            ): MiddlewareReturn => {
                const { text } = context;

                const hasSome = conditions.some((condition): boolean =>
                    condition(text, context)
                );

                return hasSome ? handler(context, next) : next();
            }
        );

        this.recompose();

        return this;
    }

    /**
     * A handler that is called when handlers are not found
     */
    public onFallback(handler: Middleware<C & ICustomContext>): this {
        if (this.hearMan) {
            return this;
        }

        this.fallbackHandler = handler;
        this.recompose();

        return this;
    }

    private recompose(): void {
        if (this.hearMan) {
            return;
        }

        this.composed = this.composer
            .clone()
            .use(this.fallbackHandler)
            .compose();
    }
}
