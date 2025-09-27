import { Node, Process } from "@/interfaces";
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
export const GetOneProcess = async (process_id: number)=> {
    const supabase = createSupabaseClient()
    const {data, error} = await supabase.from('processes')
    .select()
    .eq('id', process_id)
    if(error || !data){
        throw new Error(error?.message || 'Failed to get Process')
    }
    return data
}
export const DeleteProcesses = async (process_ids: number[]) => {
    const supabase = createSupabaseClient()
    console.log("process_ids")
    console.log(process_ids[0])
    process_ids.map(async process_id => await supabase.from('processes').delete().eq('id',Number(process_id) ))
}
export const UpdatePositions = async (processes: Node[]) => {
    const supabase = createSupabaseClient()
    processes.map(
        async process => {
            await supabase.from('processes').update({position: process.position}).eq('id', Number(process.id))
        }
    )
}