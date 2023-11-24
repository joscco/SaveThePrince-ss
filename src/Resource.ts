export type Resource = {
    type: ResourceType,
    textureName: string
}

export const WOOD : Resource = {
    type: 'Wood',
    textureName: 'resource/stick'
}
export const STONE : Resource = {
    type: 'Stone',
    textureName: 'resource/stone'
}

export const RESOURCES: Resource[] = [WOOD, STONE]



export type ResourceType = 'Wood' | 'Stone'