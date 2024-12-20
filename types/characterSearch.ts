export type Question = {
    category: string;
    key: string;
    text: string;
}

export type Answer = {
    category: string;
    key: string;
    /**
    * true: Yes, false: No, null: unknown
    */
    value: boolean | null;
}

export type AnswerMap = Map<string, boolean | null>;