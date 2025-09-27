'use server'

import z from "zod";
import { InputParams, OutputParams, ProcessParams, TableType } from "@/interfaces/index";
// import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { InputParamSchema } from "@/lib/schemas/schema";

// export const createCompanion = async (formData: CreateCompanion) => {
//     const { userId: author} = await auth();
//     const supabase = createSupabaseClient()
    
//     const {data, error} = await supabase.from('companions').insert({...formData, author}).select()
//     if(error || !data) {
//         throw new Error(error?.message || 'Failed to create companion');
//     }
//     return data[0];

// }
export const SaveInTable = async (process_id:number ,row: any, type: TableType )=> {
    const supabase = createSupabaseClient()
    await supabase.from(type)
    .delete()
    .eq('process_id',process_id)
    
    const {data, error} = await supabase.from('input_params').insert(row).select()
    if(error || !data) {
        throw new Error(error?.message || 'Failed to save data')
    }
} 
export const GetTable = async (process_id: number, type: TableType)=>{
    console.log("inside Get Table")
    const supabase =createSupabaseClient()
    const {error, data} = await supabase.from(type)
    .select()
    .eq('process_id', process_id)
    if(error) {
        throw new Error(error?.message || `Could not get ${type}`)
    }
    return data
}
// export const getAllCompanion = async ({limit = 10, page = 1, subject, topic}:) =>{
//     const supabase = createSupabaseClient()
//     console.log("subject : " + subject)
//     let query = supabase.from('companions').select()
//     if(subject && topic) {
//         query = query.ilike('subject',`%${subject}%`)
//                     .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)      
//                 }
//     else if(subject) {
//         query = query.in("subject", [subject]);
//     }
//     else if(topic){
//         query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`) 
//     }
//     query = query.range((page - 1) * limit, page * limit - 1)
//     const {data: companions, error} = await query;
//     if(error || !companions) {
//         throw new Error(error?.message || 'Failed to fetch companions');
//     }
//     console.log("companion: " + Object.keys(companions[0]))
//     console.log("companions : " + Object.keys(companions))
    
//     return companions
// }

// export const getOneCompanion = async (id: string)=> {
//     const supabase = createSupabaseClient()
//     const {data, error} = await supabase.from('companions')
//     .select()
//     .eq('id', id)

//     if(error) return console.log(error)

//     return data[0]

// }