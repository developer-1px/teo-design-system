export interface StoryblokComponent {
    _uid: string;
    component: string;
    [key: string]: any;
}

export interface Story {
    name: string;
    content: {
        body: StoryblokComponent[];
    };
}

export const COMPONENT_TYPES = {
    HERO: 'hero',
    GRID: 'grid',
    FEATURE: 'feature',
    TEASER: 'teaser',
    TEXT: 'text'
} as const;

export type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES];
