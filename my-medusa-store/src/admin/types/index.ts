export type Media = {
    id?: string;
    file_id: string;
    name: string;
    size: number;
    mime_type: string;
    is_thumbnail: boolean;
    url: string;
    file?: File;
}

export type Image = {
    file_id: string;
    name: string;
    size: number;
    mime_type: string;
    url: string;
    file?: File;
};

export type DisplayType = "buttons" | "select" | "images" | "colors";

export type OptionDisplay = {
    id?: string;
    option_id: string;
    display_type: DisplayType;
    title: string;
    option_values?: string[];
    images?: Image[];
    colors?: string[];
};