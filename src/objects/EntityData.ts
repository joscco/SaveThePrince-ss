export type EntityData = {
    displayName: string;
    name: EntityName,
    textureName: string
}

export type EntityName = 'cutRiceMaki'

export const CUT_RICE_MAKI: EntityData = {
    name: 'cutRiceMaki',
    displayName: "Maki",
    textureName: 'sushi/cutRiceMaki',
}

export const ENTITIES: EntityData[] = [
    CUT_RICE_MAKI
]