import { Process } from "@/interfaces";
import { createSupabaseClient } from "../supabase";


export const SaveProcess = async (process: Process)=> {
    const supabase = createSupabaseClient()
    const {data,error} = await supabase.from('processes').insert(process).select()
    if(error || !data) {
        throw new Error(error?.message || 'Failed to save data')
    }
    
}
export const GetAllProcesses = async (product_system_id: number): Promise<Process[]>=> {
    const supabase = createSupabaseClient()
    const {data, error} = await supabase.from('processes')
    .select()
    .eq('product_system_id', product_system_id)
    if(error || !data) {
        throw new Error(error?.message || 'Failed to get Processes')
    }
    return data
}