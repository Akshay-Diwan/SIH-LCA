import { ProductSystem } from "@/interfaces"
import { createSupabaseClient } from "../supabase"

export const SaveProductSystem = async (productSystem: ProductSystem)=> {
    const supabase = createSupabaseClient()
    const {data, error} = await supabase.from('product_systems').insert(productSystem).select()
    if(error || !data) {
        throw new Error(error?.message || 'Failed to save data')
    }
}
export const GetAllProductSystems = async (project_id: number): Promise<ProductSystem[]>=> {
    const supabase = createSupabaseClient()
    const {data, error} = await supabase.from('product_systems')
    .select()
    .eq('project_id', project_id)
    if(error || !data){
        throw new Error(error?.message || 'Failed to get Product Systems')
    }
    return data;
}