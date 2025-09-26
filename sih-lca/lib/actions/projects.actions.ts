import { Project } from "@/interfaces"
import { createSupabaseClient } from "../supabase"

export const GetAllProjects = async (user_id: string): Promise<Project[]>=> {
    const supabase = createSupabaseClient()
    const {data, error} = await supabase.from('projects')
    .select()
    .eq('user_id', user_id)
    if(error || !data) {
        throw new Error(error?.message || 'could not fetch data')
    }
    return data;
}
export const CreateProject = async (project: Project):Promise<Project> => {
    const supabase = createSupabaseClient()
    const {data, error} = await supabase.from('projects')
    .insert(project).select()
    if(error || !data) {
        throw new Error(error?.message || 'could not create project')
    }
    return data[0];
}
