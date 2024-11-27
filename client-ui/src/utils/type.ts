export interface dataState {
    loading: boolean;
    image_data: string | null;
    result: string | null;
    predict: string | null;
    ecg_1dsignal: string | null;
    ecg_final: string | null;
    image_files:string | null;
    preview: string | null
    gray_image:string | null;
    lead:string | null;
    lead_13:string | null;
    prepossed_lead:string | null;
    prepossed_lead_13:string | null;
    contour_lead:string | null;
}
