import { Edge, ProcessLink } from "@/interfaces"
import { createSupabaseClient } from "../supabase"


export const GetAllEdges = async (sources: number[]): Promise<ProcessLink[]>=> {
    
    const supabase = createSupabaseClient()
    const edges = await Promise.all(
    sources.map(async (source): Promise<ProcessLink[]> => {
      const { error, data } = await supabase
        .from("process_links")
        .select()
        .eq("source", source)

      if (error || !data) {
        throw new Error(error?.message || "could not fetch links")
      }

      return data
    })
  )

  // `edges` here is ProcessLink[][] → flatten it
  return edges.flat()
}
//     const edges = await sources.map(
//         async (source): Promise<ProcessLink[]>=>{
//         const {error, data} = await supabase.from('process_links')
//         .select()
//         .eq('source', source)
//         if(error || !data) {
//             throw new Error(error?.message || "could not fetch links")
//         }
//         return data
//         }
//     )
//     if(!edges) {
//         return []
//     }
//     console.log("sources...")
//     console.log(sources)
//     console.log("Fetching edges....")
//     console.log(edges)
//     return edges

export const DeleteEdges = async (edges: ProcessLink[])=> {
    const supabase = createSupabaseClient()
    edges.map(
        async edge => await supabase.from('process_links')
    .delete()
    .eq('id', edge.id)
    )
}
export const CreateEdges = async (edges: Edge[])=> {
    const supabase = createSupabaseClient()
    const filteredEdges = edges.filter(edge => edge.source !== 'undefined')
    const newEdges = filteredEdges.map(edge => {
        return {
            source: Number(edge.source),
            target: Number(edge.target),
            targetHandle: edge.targetHandle,
            sourceHandle: edge.sourceHandle,
        }
    })
    const {error, data} = await supabase.from('process_links')
    .insert(newEdges)
    .select()
    if(error || !data) {
        throw new Error(error.message || 'could not save edges')
    }
}
