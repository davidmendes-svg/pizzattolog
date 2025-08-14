"use client"

import { useState, useEffect } from "react"
import {
  salvarFormulario,
  salvarColaborador,
  excluirColaborador,
  salvarSeguranca,
  saveChecklist5S,
  buscarFormularios,
  buscarColaboradores,
  buscarSeguranca,
  buscarChecklist5S,
} from "@/lib/database"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Users, Shield, BarChart, Info, CheckSquare, Truck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FormData {
  cte: string
  destino: string
  placa: string
  motorista: string
  transportadora: string
  pallets: string
  tipoOperacao: string
  agendamento: string
  inicio: string
  chegada: string
  termino: string
}

interface Colaborador {
  id: number
  nome: string
  cargo: string
  turno: string
  foto: string
}

interface FotoSeguranca {
  id: number
  foto: string
  data: string
}

interface Checklist5S {
  data: string
  responsavel: string
  setor: string
  items: {
    seiri: { classificacao: boolean; observacoes: string }
    seiton: { organizacao: boolean; observacoes: string }
    seiso: { limpeza: boolean; observacoes: string }
    seiketsu: { padronizacao: boolean; observacoes: string }
    shitsuke: { disciplina: boolean; observacoes: string }
  }
}

const transportadoras = [
  "PIZZATTO",
  "LOG SULISTA",
  "WESTROCK",
  "AXON CF LOG",
  "TRANS ATIVA",
  "BRIX CF LOG",
  "COOPERCARGA",
  "COSTA TEIXEIRA",
  "DAIFFER LOGISTICA",
  "DALFER",
  "EAGLE",
  "ESTRELA DO ORIENTE",
  "MCP HORIZONTES/BR",
  "MODULAR",
  "SOLISTICA",
  "TRANSBEM",
  "Outros",
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("formulario")
  const [formData, setFormData] = useState<FormData>({
    cte: "",
    destino: "",
    placa: "",
    motorista: "",
    transportadora: "",
    pallets: "",
    tipoOperacao: "",
    agendamento: "",
    inicio: "",
    chegada: "",
    termino: "",
  })
  const [formularios, setFormularios] = useState<FormData[]>([])

  // Estados para colaboradores
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [showColabPassword, setShowColabPassword] = useState(false)
  const [showColabForm, setShowColabForm] = useState(false)
  const [colabPassword, setColabPassword] = useState("")
  const [novoColaborador, setNovoColaborador] = useState({
    nome: "",
    cargo: "",
    turno: "",
    foto: "",
  })

  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [colaboradorToDelete, setColaboradorToDelete] = useState<number | null>(null)

  // Estados para segurança
  const [fotosSeguranca, setFotosSeguranca] = useState<FotoSeguranca[]>([
    { id: 1, foto: "/warehouse-safety-inspection.png", data: "2024-01-15" },
    { id: 2, foto: "/safety-equipment-check.png", data: "2024-01-14" },
    { id: 3, foto: "/safety-training.png", data: "2024-01-13" },
  ])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showSegPassword, setShowSegPassword] = useState(false)
  const [showSegForm, setShowSegForm] = useState(false)
  const [segPassword, setSegPassword] = useState("")
  const [novaFoto, setNovaFoto] = useState<{ file: File | null; preview: string }>({
    file: null,
    preview: "",
  })

  // Estados para checklist 5S
  const [checklist5S, setChecklist5S] = useState<Checklist5S[]>([])
  const [currentChecklist, setCurrentChecklist] = useState<Checklist5S>({
    data: "",
    responsavel: "",
    setor: "",
    items: {
      seiri: { classificacao: false, observacoes: "" },
      seiton: { organizacao: false, observacoes: "" },
      seiso: { limpeza: false, observacoes: "" },
      seiketsu: { padronizacao: false, observacoes: "" },
      shitsuke: { disciplina: false, observacoes: "" },
    },
  })
  const [showChecklistForm, setShowChecklistForm] = useState(false)

  const [novoChecklist, setNovoChecklist] = useState<Checklist5S>({
    data: "",
    responsavel: "",
    setor: "",
    items: {
      seiri: { classificacao: false, observacoes: "" },
      seiton: { organizacao: false, observacoes: "" },
      seiso: { limpeza: false, observacoes: "" },
      seiketsu: { padronizacao: false, observacoes: "" },
      shitsuke: { disciplina: false, observacoes: "" },
    },
  })

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [formulariosData, colaboradoresData, segurancaData, checklistData] = await Promise.all([
          buscarFormularios(),
          buscarColaboradores(),
          buscarSeguranca(),
          buscarChecklist5S(),
        ])

        setFormularios(formulariosData)

        if (colaboradoresData.length > 0) {
          setColaboradores(
            colaboradoresData.map((c) => ({
              id: c.id,
              nome: c.nome,
              cargo: c.cargo,
              turno: c.turno,
              foto: c.foto_url || "/professional-person.png",
            })),
          )
        } else {
          // Dados padrão se não houver colaboradores no banco
          setColaboradores([
            { id: 1, nome: "João Silva", cargo: "Operador", turno: "turno", foto: "/professional-man.png" },
            {
              id: 2,
              nome: "Maria Santos",
              cargo: "Supervisora",
              turno: "turno",
              foto: "/professional-woman-diverse.png",
            },
            { id: 3, nome: "Carlos Lima", cargo: "Técnico", turno: "turno", foto: "/professional-person.png" },
          ])
        }

        if (segurancaData.length > 0) {
          setFotosSeguranca(
            segurancaData.map((s) => ({
              id: s.id,
              foto: s.foto_url || "/warehouse-safety-inspection.png",
              data: s.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            })),
          )
        } else {
          // Dados padrão se não houver fotos no banco
          setFotosSeguranca([
            { id: 1, foto: "/warehouse-safety-inspection.png", data: "2024-01-15" },
            { id: 2, foto: "/safety-equipment-check.png", data: "2024-01-14" },
            { id: 3, foto: "/safety-training.png", data: "2024-01-13" },
          ])
        }

        if (checklistData.length > 0) {
          setChecklist5S(
            checklistData.map((c) => ({
              data: c.data_checklist,
              responsavel: c.responsavel,
              setor: c.area,
              items: {
                seiri: { classificacao: c.seiri_status, observacoes: c.seiri_observacao },
                seiton: { organizacao: c.seiton_status, observacoes: c.seiton_observacao },
                seiso: { limpeza: c.seiso_status, observacoes: c.seiso_observacao },
                seiketsu: { padronizacao: c.seiketsu_status, observacoes: c.seiketsu_observacao },
                shitsuke: { disciplina: c.shitsuke_status, observacoes: c.shitsuke_observacao },
              },
            })),
          )
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }

    carregarDados()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await salvarFormulario({
        cte: formData.cte,
        destino_origem: formData.destino,
        placa_carreta: formData.placa,
        motorista: formData.motorista,
        transportadora: formData.transportadora,
        pallets: Number.parseInt(formData.pallets) || 0,
        tipo_operacao: formData.tipoOperacao,
        agendamento: formData.agendamento,
        inicio: formData.inicio,
        chegada: formData.chegada,
        termino: formData.termino,
      })

      if (result.success) {
        alert("Formulário enviado com sucesso!")
        setFormData({
          cte: "",
          destino: "",
          placa: "",
          motorista: "",
          transportadora: "",
          pallets: "",
          tipoOperacao: "",
          agendamento: "",
          inicio: "",
          chegada: "",
          termino: "",
        })
        // Recarregar dados
        const novosFormularios = await buscarFormularios()
        setFormularios(novosFormularios)
      } else {
        alert("Erro ao enviar formulário: " + result.error)
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao enviar formulário")
    }
  }

  const handleColabPasswordSubmit = () => {
    if (colabPassword === "mend123") {
      setShowColabPassword(false)
      setShowColabForm(true)
      setColabPassword("")
    } else {
      alert("Senha incorreta!")
    }
  }

  const handleAddColaborador = async () => {
    try {
      const result = await salvarColaborador({
        nome: novoColaborador.nome,
        cargo: novoColaborador.cargo,
        turno: novoColaborador.turno,
        foto_url: novoColaborador.foto || "/professional-person.png",
      })

      if (result.success) {
        alert("Colaborador adicionado com sucesso!")
        setNovoColaborador({ nome: "", cargo: "", turno: "", foto: "" })
        setShowColabForm(false)
        // Recarregar colaboradores
        const novosColaboradores = await buscarColaboradores()
        setColaboradores(
          novosColaboradores.map((c) => ({
            id: c.id,
            nome: c.nome,
            cargo: c.cargo,
            turno: c.turno,
            foto: c.foto_url || "/professional-person.png",
          })),
        )
      } else {
        alert("Erro ao adicionar colaborador: " + result.error)
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao adicionar colaborador")
    }
  }

  const handleDeleteColaborador = async (id: number) => {
    if (colaboradorToDelete) {
      try {
        const result = await excluirColaborador(colaboradorToDelete)

        if (result.success) {
          alert("Colaborador excluído com sucesso!")
          // Recarregar colaboradores
          const novosColaboradores = await buscarColaboradores()
          setColaboradores(
            novosColaboradores.map((c) => ({
              id: c.id,
              nome: c.nome,
              cargo: c.cargo,
              turno: c.turno,
              foto: c.foto_url || "/professional-person.png",
            })),
          )
        } else {
          alert("Erro ao excluir colaborador: " + result.error)
        }
      } catch (error) {
        console.error("Erro:", error)
        alert("Erro ao excluir colaborador")
      }

      setShowDeletePassword(false)
      setDeletePassword("")
      setColaboradorToDelete(null)
    }
  }

  const handleConfirmDelete = () => {
    if (deletePassword === "mend123" && colaboradorToDelete) {
      setColaboradores((prev) => prev.filter((c) => c.id !== colaboradorToDelete))
      setShowDeletePassword(false)
      setDeletePassword("")
      setColaboradorToDelete(null)
      alert("Colaborador excluído com sucesso!")
    } else {
      alert("Senha incorreta!")
    }
  }

  const handleRemoveColaborador = async (id: number) => {
    if (colabPassword === "mend123") {
      try {
        const result = await excluirColaborador(id)
        if (result.success) {
          setColaboradores(colaboradores.filter((c) => c.id !== id))
          setColabPassword("")
          alert("Colaborador removido do banco de dados com sucesso!")
        }
      } catch (error) {
        console.error("Erro ao excluir colaborador:", error)
        alert("Erro ao salvar colaborador. Tente novamente.")
      }
    } else {
      const senha = prompt("Digite a senha para excluir:")
      if (senha === "mend123") {
        try {
          const result = await excluirColaborador(id)
          if (result.success) {
            setColaboradores(colaboradores.filter((c) => c.id !== id))
            alert("Colaborador removido do banco de dados com sucesso!")
          }
        } catch (error) {
          console.error("Erro ao excluir colaborador:", error)
          alert("Erro ao salvar colaborador. Tente novamente.")
        }
      } else {
        alert("Senha incorreta!")
      }
    }
  }

  const handleSegPasswordSubmit = () => {
    if (segPassword === "mend123") {
      setShowSegPassword(false)
      setShowSegForm(true)
      setSegPassword("")
    } else {
      alert("Senha incorreta!")
    }
  }

  const handleAddSeguranca = async () => {
    if (novaFoto.preview) {
      try {
        const result = await salvarSeguranca({
          titulo: "Foto de Segurança",
          descricao: "Nova foto adicionada",
          foto_url: novaFoto.preview,
        })

        if (result.success) {
          alert("Foto de segurança adicionada com sucesso!")
          setNovaFoto({ file: null, preview: "" })
          setShowSegForm(false)
          // Recarregar fotos
          const novasfotos = await buscarSeguranca()
          setFotosSeguranca(
            novasfotos.map((s) => ({
              id: s.id,
              foto: s.foto_url || "/warehouse-safety-inspection.png",
              data: s.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            })),
          )
        } else {
          alert("Erro ao adicionar foto: " + result.error)
        }
      } catch (error) {
        console.error("Erro:", error)
        alert("Erro ao adicionar foto")
      }
    }
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % fotosSeguranca.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + fotosSeguranca.length) % fotosSeguranca.length)
  }

  const handleAddChecklist = async () => {
    try {
      const pontuacao = Object.values(currentChecklist.items).reduce(
        (acc, item) =>
          acc +
          (item.classificacao || item.organizacao || item.limpeza || item.padronizacao || item.disciplina ? 1 : 0),
        0,
      )

      const result = await saveChecklist5S({
        area: currentChecklist.setor,
        responsavel: currentChecklist.responsavel,
        data_checklist: currentChecklist.data,
        seiri_status: currentChecklist.items.seiri.classificacao,
        seiri_observacao: currentChecklist.items.seiri.observacoes,
        seiton_status: currentChecklist.items.seiton.organizacao,
        seiton_observacao: currentChecklist.items.seiton.observacoes,
        seiso_status: currentChecklist.items.seiso.limpeza,
        observacoes: currentChecklist.items.seiso.observacoes,
        seiketsu_status: currentChecklist.items.seiketsu.padronizacao,
        seiketsu_observacao: currentChecklist.items.seiketsu.observacoes,
        shitsuke_status: currentChecklist.items.shitsuke.disciplina,
        shitsuke_observacao: currentChecklist.items.shitsuke.observacoes,
        pontuacao_total: pontuacao,
      })

      if (result.success) {
        alert("Checklist 5S adicionado com sucesso!")
        setCurrentChecklist({
          data: "",
          responsavel: "",
          setor: "",
          items: {
            seiri: { classificacao: false, observacoes: "" },
            seiton: { organizacao: false, observacoes: "" },
            seiso: { limpeza: false, observacoes: "" },
            seiketsu: { padronizacao: false, observacoes: "" },
            shitsuke: { disciplina: false, observacoes: "" },
          },
        })
        setShowChecklistForm(false)
        // Recarregar checklists
        const novosChecklists = await buscarChecklist5S()
        setChecklist5S(
          novosChecklists.map((c) => ({
            data: c.data_checklist,
            responsavel: c.responsavel,
            setor: c.area,
            items: {
              seiri: { classificacao: c.seiri_status, observacoes: c.seiri_observacao },
              seiton: { organizacao: c.seiton_status, observacoes: c.seiton_observacao },
              seiso: { limpeza: c.seiso_status, observacoes: c.seiso_observacao },
              seiketsu: { padronizacao: c.seiketsu_status, observacoes: c.seiketsu_observacao },
              shitsuke: { disciplina: c.shitsuke_status, observacoes: c.shitsuke_observacao },
            },
          })),
        )
      } else {
        alert("Erro ao adicionar checklist: " + result.error)
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao adicionar checklist")
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (activeTab === "seguranca" && fotosSeguranca.length > 1) {
      interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => {
          // Verificação dupla para evitar erros
          if (!fotosSeguranca || fotosSeguranca.length === 0) return 0
          return (prev + 1) % fotosSeguranca.length
        })
      }, 3000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
  }, [activeTab])

  useEffect(() => {
    return () => {
      setCurrentPhotoIndex(0)
      // Forçar limpeza de qualquer timer pendente
      const highestId = setTimeout(() => {}, 0)
      for (let i = 0; i < highestId; i++) {
        clearTimeout(i)
        clearInterval(i)
      }
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-gray-50 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://i.postimg.cc/FzJfb8Yz/fundo.png')" }}
    >
      <div className="min-h-screen">
        <nav className="bg-white/95 shadow-sm border-b backdrop-blur-sm">
          <div className="flex flex-wrap justify-center md:justify-start overflow-x-auto">
            {[
              { key: "formulario", label: "Formulário", icon: FileText },
              { key: "colaboradores", label: "Colaboradores", icon: Users },
              { key: "seguranca", label: "Segurança", icon: Shield },
              { key: "checklist5s", label: "Checklist 5S", icon: CheckSquare },
              { key: "indicadores", label: "Indicadores", icon: BarChart },
              { key: "sobre", label: "Sobre", icon: Info },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3 py-3 md:px-6 md:py-4 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="container mx-auto p-4 md:p-6 max-w-7xl">
          {activeTab === "formulario" && (
            <div className="space-y-6">
              <div className="bg-black/10 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-white text-center drop-shadow-lg">
                  Formulário de Logística
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cte" className="text-white font-semibold drop-shadow-md">
                      CTE
                    </Label>
                    <Input
                      id="cte"
                      value={formData.cte}
                      onChange={(e) => setFormData({ ...formData, cte: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destino" className="text-white font-semibold drop-shadow-md">
                      Destino/Origem
                    </Label>
                    <Input
                      id="destino"
                      value={formData.destino}
                      onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="placa" className="text-white font-semibold drop-shadow-md">
                      Placa da Carreta
                    </Label>
                    <Input
                      id="placa"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motorista" className="text-white font-semibold drop-shadow-md">
                      Motorista
                    </Label>
                    <Input
                      id="motorista"
                      value={formData.motorista}
                      onChange={(e) => setFormData({ ...formData, motorista: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transportadora" className="text-white font-semibold drop-shadow-md">
                      Transportadora
                    </Label>
                    <Select
                      value={formData.transportadora}
                      onValueChange={(value) => setFormData({ ...formData, transportadora: value })}
                    >
                      <SelectTrigger className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg">
                        <SelectItem value="PIZZATTO">PIZZATTO</SelectItem>
                        <SelectItem value="LOG SULISTA">LOG SULISTA</SelectItem>
                        <SelectItem value="WESTROCK">WESTROCK</SelectItem>
                        <SelectItem value="AXON CF LOG">AXON CF LOG</SelectItem>
                        <SelectItem value="TRANS ATIVA">TRANS ATIVA</SelectItem>
                        <SelectItem value="BRIX CF LOG">BRIX CF LOG</SelectItem>
                        <SelectItem value="COOPERCARGA">COOPERCARGA</SelectItem>
                        <SelectItem value="COSTA TEIXEIRA">COSTA TEIXEIRA</SelectItem>
                        <SelectItem value="DAIFFER LOGISTICA">DAIFFER LOGISTICA</SelectItem>
                        <SelectItem value="DALFER">DALFER</SelectItem>
                        <SelectItem value="EAGLE">EAGLE</SelectItem>
                        <SelectItem value="ESTRELA DO ORIENTE">ESTRELA DO ORIENTE</SelectItem>
                        <SelectItem value="MCP HORIZONTES/BR">MCP HORIZONTES/BR</SelectItem>
                        <SelectItem value="MODULAR">MODULAR</SelectItem>
                        <SelectItem value="SOLISTICA">SOLISTICA</SelectItem>
                        <SelectItem value="TRANSBEM">TRANSBEM</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pallets" className="text-white font-semibold drop-shadow-md">
                      Pallets
                    </Label>
                    <Input
                      id="pallets"
                      type="number"
                      value={formData.pallets}
                      onChange={(e) => setFormData({ ...formData, pallets: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoOperacao" className="text-white font-semibold drop-shadow-md">
                      Tipo de Operação
                    </Label>
                    <Select
                      value={formData.tipoOperacao}
                      onValueChange={(value) => setFormData({ ...formData, tipoOperacao: value })}
                    >
                      <SelectTrigger className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg">
                        <SelectItem value="Carga">Carga</SelectItem>
                        <SelectItem value="Descarga">Descarga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agendamento" className="text-white font-semibold drop-shadow-md">
                      Agendamento
                    </Label>
                    <Input
                      id="agendamento"
                      type="datetime-local"
                      value={formData.agendamento}
                      onChange={(e) => setFormData({ ...formData, agendamento: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inicio" className="text-white font-semibold drop-shadow-md">
                      Início
                    </Label>
                    <Input
                      id="inicio"
                      type="datetime-local"
                      value={formData.inicio}
                      onChange={(e) => setFormData({ ...formData, inicio: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chegada" className="text-white font-semibold drop-shadow-md">
                      Chegada
                    </Label>
                    <Input
                      id="chegada"
                      type="datetime-local"
                      value={formData.chegada}
                      onChange={(e) => setFormData({ ...formData, chegada: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="termino" className="text-white font-semibold drop-shadow-md">
                      Término
                    </Label>
                    <Input
                      id="termino"
                      type="datetime-local"
                      value={formData.termino}
                      onChange={(e) => setFormData({ ...formData, termino: e.target.value })}
                      className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-6">
                    <Button
                      type="submit"
                      className="w-full md:w-auto px-12 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
                    >
                      ENVIAR
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "colaboradores" && (
            <div className="bg-black/10 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 relative">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">Colaboradores</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-20">
                {colaboradores.map((colaborador) => (
                  <Card key={colaborador.id} className="overflow-hidden relative">
                    <div className="aspect-square relative">
                      <img
                        src={colaborador.foto || "/placeholder.svg"}
                        alt={colaborador.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <h3 className="font-semibold text-sm md:text-base mb-1">{colaborador.nome}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-1">{colaborador.cargo}</p>
                      <p className="text-xs md:text-sm text-green-600 mb-2">{colaborador.turno}</p>
                      <Button
                        onClick={() => handleDeleteColaborador(colaborador.id)}
                        className="w-8 h-6 bg-red-500 hover:bg-red-600 text-white text-xs py-0 px-0 mx-auto"
                      >
                        ×
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Botão flutuante para adicionar colaborador */}
              {activeTab === "colaboradores" && (
                <button
                  onClick={() => setShowColabPassword(true)}
                  className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-all transform hover:scale-110 z-50"
                >
                  +
                </button>
              )}
            </div>
          )}

          {activeTab === "seguranca" && (
            <div className="bg-black/10 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 relative">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">
                Diálogos de Segurança
              </h2>

              {fotosSeguranca.length > 0 ? (
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={fotosSeguranca[currentPhotoIndex]?.foto || "/placeholder.svg"}
                      alt={`Foto de segurança ${currentPhotoIndex + 1}`}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>

                  {fotosSeguranca.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentPhotoIndex((prev) => (prev === 0 ? fotosSeguranca.length - 1 : prev - 1))
                        }
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % fotosSeguranca.length)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        →
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentPhotoIndex + 1} / {fotosSeguranca.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white text-lg">Nenhuma foto de segurança adicionada ainda.</p>
                </div>
              )}

              {/* Botão flutuante para adicionar foto de segurança */}
              {activeTab === "seguranca" && (
                <button
                  onClick={() => setShowSegPassword(true)}
                  className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-all transform hover:scale-110 z-50"
                >
                  +
                </button>
              )}
            </div>
          )}

          {activeTab === "checklist5s" && (
            <div className="bg-black/10 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 relative">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">Checklist 5S</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20">
                {checklist5S.map((checklist) => (
                  <Card key={checklist.data} className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">
                        {new Date(checklist.data).toLocaleDateString("pt-BR")}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {checklist.responsavel} - {checklist.setor}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Seiri (Classificação)</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${checklist.items.seiri.classificacao ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {checklist.items.seiri.classificacao ? "OK" : "Pendente"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Seiton (Organização)</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${checklist.items.seiton.organizacao ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {checklist.items.seiton.organizacao ? "OK" : "Pendente"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Seiso (Limpeza)</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${checklist.items.seiso.limpeza ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {checklist.items.seiso.limpeza ? "OK" : "Pendente"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Seiketsu (Padronização)</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${checklist.items.seiketsu.padronizacao ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {checklist.items.seiketsu.padronizacao ? "OK" : "Pendente"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Shitsuke (Disciplina)</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${checklist.items.shitsuke.disciplina ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {checklist.items.shitsuke.disciplina ? "OK" : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Botão flutuante para adicionar checklist */}
              {activeTab === "checklist5s" && (
                <button
                  onClick={() => setShowChecklistForm(true)}
                  className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-all transform hover:scale-110 z-50"
                >
                  +
                </button>
              )}
            </div>
          )}

          {activeTab === "indicadores" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-6">Total de Operações</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">📦</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formularios.reduce((total, form) => total + (form.pallets || 0), 0)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Total de Pallets</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">📋</div>
                      <div className="text-2xl font-bold text-green-600">{formularios.length}</div>
                    </div>
                    <div className="text-sm text-gray-600">Total de CTEs</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">⬆️</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {formularios.filter((f) => f.tipo_operacao === "Carga").length}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Operações de Carga</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">⬇️</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formularios.filter((f) => f.tipo_operacao === "Descarga").length}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Operações de Descarga</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">📊</div>
                      <div className="text-2xl font-bold text-red-600">{formularios.length}</div>
                    </div>
                    <div className="text-sm text-gray-600">Total de Operações</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <span className="mr-2">🚛</span>
                      Top 5 Transportadoras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(() => {
                        const transportadoraCount = formularios.reduce(
                          (acc, form) => {
                            if (form.transportadora && form.transportadora.trim()) {
                              acc[form.transportadora] = (acc[form.transportadora] || 0) + 1
                            }
                            return acc
                          },
                          {} as Record<string, number>,
                        )

                        const topTransportadoras = Object.entries(transportadoraCount)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)

                        return topTransportadoras.length > 0 ? (
                          topTransportadoras.map(([nome, count]) => (
                            <div key={nome} className="flex justify-between items-center">
                              <span className="text-gray-700">{nome}</span>
                              <span className="font-semibold text-blue-600">{count}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-4">Nenhum dado de transportadora disponível</div>
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <span className="mr-2">📍</span>
                      Top 5 Destinos/Origens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(() => {
                        const destinoCount = formularios.reduce(
                          (acc, form) => {
                            if (form.destino_origem && form.destino_origem.trim()) {
                              acc[form.destino_origem] = (acc[form.destino_origem] || 0) + 1
                            }
                            return acc
                          },
                          {} as Record<string, number>,
                        )

                        const topDestinos = Object.entries(destinoCount)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)

                        return topDestinos.length > 0 ? (
                          topDestinos.map(([nome, count]) => (
                            <div key={nome} className="flex justify-between items-center">
                              <span className="text-gray-700">{nome}</span>
                              <span className="font-semibold text-green-600">{count}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-4">Nenhum dado de destino/origem disponível</div>
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "sobre" && (
            <div className="bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Transpizzattolog
                </h2>
                <p className="text-white/80 text-lg">Excelência em Logística e Transporte</p>
              </div>

              <div className="space-y-8">
                <Card className="bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-green-600 rounded-full mr-4"></div>
                      <h3 className="text-2xl font-bold text-gray-900">Nossa História</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      A Transpizzattolog é uma empresa líder no setor de logística e transporte, especializada em
                      soluções integradas para movimentação de cargas. Com anos de experiência no mercado, oferecemos
                      serviços de alta qualidade com foco na eficiência, segurança e pontualidade.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Confiabilidade</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Compromisso com a entrega segura e pontual de suas cargas
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Equipe Especializada</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Profissionais qualificados e experientes em logística
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6">
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Frota Moderna</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Veículos modernos e bem mantidos para máxima eficiência
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gradient-to-r from-gray-900/90 to-black/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white text-center mb-8">Nossos Números</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                        <div className="text-white/80">Entregas/Mês</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
                        <div className="text-white/80">Pontualidade</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-orange-400 mb-2">50+</div>
                        <div className="text-white/80">Veículos</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                        <div className="text-white/80">Suporte</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      <Dialog open={showColabPassword} onOpenChange={setShowColabPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Digite a Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={colabPassword}
              onChange={(e) => setColabPassword(e.target.value)}
              placeholder="Digite a senha"
              className="mt-2"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowColabPassword(false)}>
                Cancelar
              </Button>
              <Button onClick={handleColabPasswordSubmit}>Confirmar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showColabForm} onOpenChange={setShowColabForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={novoColaborador.nome}
                onChange={(e) => setNovoColaborador({ ...novoColaborador, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={novoColaborador.cargo}
                onChange={(e) => setNovoColaborador({ ...novoColaborador, cargo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select
                value={novoColaborador.turno}
                onValueChange={(value) => setNovoColaborador({ ...novoColaborador, turno: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1° turno">1° turno</SelectItem>
                  <SelectItem value="2° turno">2° turno</SelectItem>
                  <SelectItem value="3° turno">3° turno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="foto">Foto</Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      setNovoColaborador({ ...novoColaborador, foto: e.target?.result as string })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowColabForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddColaborador}>Adicionar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSegPassword} onOpenChange={setShowSegPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Digite a Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={segPassword}
              onChange={(e) => setSegPassword(e.target.value)}
              placeholder="Digite a senha"
              className="mt-2"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSegPassword(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSegPasswordSubmit}>Confirmar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSegForm} onOpenChange={setShowSegForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Foto de Segurança</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fotoSeg">Foto</Label>
              <Input
                id="fotoSeg"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      setNovaFoto({
                        file,
                        preview: e.target?.result as string,
                      })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
            {novaFoto.preview && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <img
                  src={novaFoto.preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSegForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSeguranca}>Adicionar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showChecklistForm} onOpenChange={setShowChecklistForm}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Checklist 5S</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddChecklist} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={currentChecklist.data}
                  onChange={(e) => setCurrentChecklist({ ...currentChecklist, data: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={currentChecklist.responsavel}
                  onChange={(e) => setCurrentChecklist({ ...currentChecklist, responsavel: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Input
                id="setor"
                value={currentChecklist.setor}
                onChange={(e) => setCurrentChecklist({ ...currentChecklist, setor: e.target.value })}
              />
            </div>

            {/* 5S Items */}
            <div className="space-y-4">
              <h4 className="font-semibold">Itens do 5S</h4>

              {/* Seiri */}
              <div className="space-y-2 p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="seiri"
                    checked={currentChecklist.items.seiri.classificacao}
                    onChange={(e) =>
                      setCurrentChecklist({
                        ...currentChecklist,
                        items: {
                          ...currentChecklist.items,
                          seiri: { ...currentChecklist.items.seiri, classificacao: e.target.checked },
                        },
                      })
                    }
                  />
                  <Label htmlFor="seiri" className="font-medium">
                    Seiri (Classificação)
                  </Label>
                </div>
                <Input
                  placeholder="Observações"
                  value={currentChecklist.items.seiri.observacoes}
                  onChange={(e) =>
                    setCurrentChecklist({
                      ...currentChecklist,
                      items: {
                        ...currentChecklist.items,
                        seiri: { ...currentChecklist.items.seiri, observacoes: e.target.value },
                      },
                    })
                  }
                />
              </div>

              {/* Seiton */}
              <div className="space-y-2 p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="seiton"
                    checked={currentChecklist.items.seiton.organizacao}
                    onChange={(e) =>
                      setCurrentChecklist({
                        ...currentChecklist,
                        items: {
                          ...currentChecklist.items,
                          seiton: { ...currentChecklist.items.seiton, organizacao: e.target.checked },
                        },
                      })
                    }
                  />
                  <Label htmlFor="seiton" className="font-medium">
                    Seiton (Organização)
                  </Label>
                </div>
                <Input
                  placeholder="Observações"
                  value={currentChecklist.items.seiton.observacoes}
                  onChange={(e) =>
                    setCurrentChecklist({
                      ...currentChecklist,
                      items: {
                        ...currentChecklist.items,
                        seiton: { ...currentChecklist.items.seiton, observacoes: e.target.value },
                      },
                    })
                  }
                />
              </div>

              {/* Seiso */}
              <div className="space-y-2 p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="seiso"
                    checked={currentChecklist.items.seiso.limpeza}
                    onChange={(e) =>
                      setCurrentChecklist({
                        ...currentChecklist,
                        items: {
                          ...currentChecklist.items,
                          seiso: { ...currentChecklist.items.seiso, limpeza: e.target.checked },
                        },
                      })
                    }
                  />
                  <Label htmlFor="seiso" className="font-medium">
                    Seiso (Limpeza)
                  </Label>
                </div>
                <Input
                  placeholder="Observações"
                  value={currentChecklist.items.seiso.observacoes}
                  onChange={(e) =>
                    setCurrentChecklist({
                      ...currentChecklist,
                      items: {
                        ...currentChecklist.items,
                        seiso: { ...currentChecklist.items.seiso, observacoes: e.target.value },
                      },
                    })
                  }
                />
              </div>

              {/* Seiketsu */}
              <div className="space-y-2 p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="seiketsu"
                    checked={currentChecklist.items.seiketsu.padronizacao}
                    onChange={(e) =>
                      setCurrentChecklist({
                        ...currentChecklist,
                        items: {
                          ...currentChecklist.items,
                          seiketsu: { ...currentChecklist.items.seiketsu, padronizacao: e.target.checked },
                        },
                      })
                    }
                  />
                  <Label htmlFor="seiketsu" className="font-medium">
                    Seiketsu (Padronização)
                  </Label>
                </div>
                <Input
                  placeholder="Observações"
                  value={currentChecklist.items.seiketsu.observacoes}
                  onChange={(e) =>
                    setCurrentChecklist({
                      ...currentChecklist,
                      items: {
                        ...currentChecklist.items,
                        seiketsu: { ...currentChecklist.items.seiketsu, observacoes: e.target.value },
                      },
                    })
                  }
                />
              </div>

              {/* Shitsuke */}
              <div className="space-y-2 p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="shitsuke"
                    checked={currentChecklist.items.shitsuke.disciplina}
                    onChange={(e) =>
                      setCurrentChecklist({
                        ...currentChecklist,
                        items: {
                          ...currentChecklist.items,
                          shitsuke: { ...currentChecklist.items.shitsuke, disciplina: e.target.checked },
                        },
                      })
                    }
                  />
                  <Label htmlFor="shitsuke" className="font-medium">
                    Shitsuke (Disciplina)
                  </Label>
                </div>
                <Input
                  placeholder="Observações"
                  value={currentChecklist.items.shitsuke.observacoes}
                  onChange={(e) =>
                    setCurrentChecklist({
                      ...currentChecklist,
                      items: {
                        ...currentChecklist.items,
                        shitsuke: { ...currentChecklist.items.shitsuke, observacoes: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowChecklistForm(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar Checklist</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
