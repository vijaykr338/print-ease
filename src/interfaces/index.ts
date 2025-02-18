export interface Config {
    color: "color" | "b&w";
    orientation: "portrait" | "landscape";
    pagesToPrint: "all" | "specific";
    sided: "single" | "double";
    copies: number;
    remarks: string;
    specificRange: string;
    totalPrice:number;
    pageSize: number;
    configured?: boolean;
  };

export interface FileWithConfig{
    file: File;
    config: Config;
}