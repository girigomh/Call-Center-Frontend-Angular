export interface LangDefinition {
    id: string;
    country: string;
    label: string;
}
export const AvailableLangs: LangDefinition[]=[
    {
        id: "de",
        country: "at",
        label: "German",
    },
    {
        id: "en",
        country: "us",
        label: "English",
    }
] 