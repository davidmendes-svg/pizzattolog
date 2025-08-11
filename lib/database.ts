import { supabase } from "./supabase/client"

interface FormularioData {
  cte: string
  destino_origem: string
  placa_carreta: string
  motorista: string
  transportadora: string
  pallets: number
  tipo_operacao: string
  agendamento: string
  inicio: string
  chegada: string
  termino: string
}

interface ColaboradorData {
  nome: string
  cargo: string
  turno: string
  foto_url?: string
}

interface SegurancaData {
  titulo: string
  descricao: string
  foto_url?: string
}

interface Checklist5SData {
  area: string
  responsavel: string
  data_checklist: string
  seiri_status: boolean
  seiri_observacao: string
  seiton_status: boolean
  seiton_observacao: string
  seiso_status: boolean
  seiso_observacao: string
  seiketsu_status: boolean
  seiketsu_observacao: string
  shitsuke_status: boolean
  shitsuke_observacao: string
  pontuacao_total: number
}

const dadosColaboradoresPadrao = [
  {
    id: 1,
    nome: "João Silva",
    cargo: "Operador de Empilhadeira",
    turno: "1° turno",
    foto_url: "/professional-man.png",
  },
  {
    id: 2,
    nome: "Maria Santos",
    cargo: "Supervisora de Logística",
    turno: "2° turno",
    foto_url: "/professional-woman-diverse.png",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    cargo: "Auxiliar de Armazém",
    turno: "3° turno",
    foto_url: "/professional-person.png",
  },
]

const dadosSegurancaPadrao = [
  {
    id: 1,
    titulo: "Inspeção de Segurança no Armazém",
    descricao: "Verificação dos equipamentos de segurança",
    foto_url: "/warehouse-safety-inspection.png",
  },
  {
    id: 2,
    titulo: "Verificação de EPIs",
    descricao: "Controle e verificação do uso correto dos EPIs",
    foto_url: "/safety-equipment-check.png",
  },
  {
    id: 3,
    titulo: "Treinamento de Segurança",
    descricao: "Sessão de treinamento sobre procedimentos",
    foto_url: "/safety-training.png",
  },
]

export async function salvarFormulario(data: FormularioData) {
  try {
    const { data: result, error } = await supabase.from("formularios").insert([data]).select()

    if (error) throw error
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao salvar formulário:", error)
    return { success: false, error: error.message }
  }
}

export async function salvarColaborador(data: ColaboradorData) {
  try {
    const { data: result, error } = await supabase.from("colaboradores").insert([data]).select()

    if (error) throw error
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao salvar colaborador:", error)
    return { success: false, error: error.message }
  }
}

export async function excluirColaborador(id: number) {
  try {
    const { error } = await supabase.from("colaboradores").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir colaborador:", error)
    return { success: false, error: error.message }
  }
}

export async function salvarSeguranca(data: SegurancaData) {
  try {
    const { data: result, error } = await supabase.from("seguranca").insert([data]).select()

    if (error) throw error
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao salvar segurança:", error)
    return { success: false, error: error.message }
  }
}

export async function salvarChecklist5S(data: Checklist5SData) {
  try {
    const { data: result, error } = await supabase.from("checklist_5s").insert([data]).select()

    if (error) throw error
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao salvar checklist 5S:", error)
    return { success: false, error: error.message }
  }
}

export async function saveChecklist5S(data: any) {
  return await salvarChecklist5S(data)
}

export async function buscarFormularios() {
  try {
    const { data, error } = await supabase.from("formularios").select("*").order("created_at", { ascending: false })

    if (error) {
      if (error.message.includes("Could not find the table") || error.message.includes("schema cache")) {
        console.log("Tabela formularios não existe ainda, retornando array vazio")
        return []
      }
      throw error
    }
    return data || []
  } catch (error) {
    console.error("Erro ao buscar formulários:", error)
    return []
  }
}

export async function buscarColaboradores() {
  try {
    const { data, error } = await supabase.from("colaboradores").select("*").order("created_at", { ascending: false })

    if (error) {
      if (error.message.includes("Could not find the table") || error.message.includes("schema cache")) {
        console.log("Tabela colaboradores não existe ainda, usando dados padrão")
        return dadosColaboradoresPadrao
      }
      throw error
    }
    return data || dadosColaboradoresPadrao
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error)
    return dadosColaboradoresPadrao
  }
}

export async function buscarSeguranca() {
  try {
    const { data, error } = await supabase.from("seguranca").select("*").order("created_at", { ascending: false })

    if (error) {
      if (error.message.includes("Could not find the table") || error.message.includes("schema cache")) {
        console.log("Tabela seguranca não existe ainda, usando dados padrão")
        return dadosSegurancaPadrao
      }
      throw error
    }
    return data || dadosSegurancaPadrao
  } catch (error) {
    console.error("Erro ao buscar segurança:", error)
    return dadosSegurancaPadrao
  }
}

export async function buscarChecklist5S() {
  try {
    const { data, error } = await supabase.from("checklist_5s").select("*").order("created_at", { ascending: false })

    if (error) {
      if (error.message.includes("Could not find the table") || error.message.includes("schema cache")) {
        console.log("Tabela checklist_5s não existe ainda, retornando array vazio")
        return []
      }
      throw error
    }
    return data || []
  } catch (error) {
    console.error("Erro ao buscar checklist 5S:", error)
    return []
  }
}
