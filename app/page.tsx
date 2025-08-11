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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Users,
  Shield,
  BarChart,
  Info,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Truck,
  Package,
  Calendar,
} from "lucide-react"
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
            { id: 1, nome: "João Silva", cargo: "Operador", turno: "1° turno", foto: "/professional-man.png" },
            {
              id: 2,
              nome: "Maria Santos",
              cargo: "Supervisora",
              turno: "2° turno",
              foto: "/professional-woman-diverse.png",
            },
            { id: 3, nome: "Carlos Lima", cargo: "Técnico", turno: "3° turno", foto: "/professional-person.png" },
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

  const handleDeleteColaborador = async () => {
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
        seiso_observacao: currentChecklist.items.seiso.observacoes,
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
    if (fotosSeguranca.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % fotosSeguranca.length)
      }, 3000) // Muda foto a cada 3 segundos

      return () => clearInterval(interval)
    }
  }, [fotosSeguranca.length])

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
          {/* Aba Formulário */}
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

          {/* Aba Colaboradores */}
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

              <Button
                onClick={() => setShowColabPassword(true)}
                className="fixed bottom-6 right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50"
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          )}

          {/* Modal de senha para colaboradores */}
          <Dialog open={showColabPassword} onOpenChange={setShowColabPassword}>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Acesso Restrito</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={colabPassword}
                  onChange={(e) => setColabPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleColabPasswordSubmit()}
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

          {/* Modal de formulário para adicionar colaborador */}
          <Dialog open={showColabForm} onOpenChange={setShowColabForm}>
            <DialogContent className="bg-white/95 backdrop-blur-sm max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Colaborador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome completo"
                  value={novoColaborador.nome}
                  onChange={(e) => setNovoColaborador({ ...novoColaborador, nome: e.target.value })}
                />
                <Input
                  placeholder="Cargo"
                  value={novoColaborador.cargo}
                  onChange={(e) => setNovoColaborador({ ...novoColaborador, cargo: e.target.value })}
                />
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
                <Input
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
                {novoColaborador.foto && (
                  <div className="mt-2">
                    <img
                      src={novoColaborador.foto || "/placeholder.svg"}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowColabForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddColaborador}>Adicionar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDeletePassword} onOpenChange={setShowDeletePassword}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">Digite a senha para excluir o colaborador:</p>
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
                    Confirmar Exclusão
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeletePassword(false)
                      setDeletePassword("")
                      setColaboradorToDelete(null)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Aba Segurança */}
          {/* Modal de senha para segurança */}
          <Dialog open={showSegPassword} onOpenChange={setShowSegPassword}>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Acesso Restrito - Segurança</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={segPassword}
                  onChange={(e) => setSegPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSegPasswordSubmit()}
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

          {/* Modal de formulário para adicionar foto de segurança */}
          <Dialog open={showSegForm} onOpenChange={setShowSegForm}>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Adicionar Foto de Segurança</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Selecionar Foto</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setNovaFoto({
                            file: file,
                            preview: e.target?.result as string,
                          })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {novaFoto.preview && (
                    <div className="mt-2">
                      <img
                        src={novaFoto.preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSegForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddSeguranca}>Adicionar Foto</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {activeTab === "seguranca" && (
            <div className="bg-black/10 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 relative">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">
                Diálogos de Segurança
              </h2>

              <div className="mb-20">
                {fotosSeguranca.length > 0 && (
                  <div className="relative max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                      <img
                        src={fotosSeguranca[currentPhotoIndex].foto || "/placeholder.svg"}
                        alt={`Foto de segurança ${currentPhotoIndex + 1}`}
                        className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                      />
                    </div>

                    <div className="flex justify-between items-center mb-4 px-4">
                      <Button variant="outline" onClick={prevPhoto} disabled={fotosSeguranca.length <= 1} size="sm">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <span className="text-xs md:text-sm text-white drop-shadow">
                        {currentPhotoIndex + 1} de {fotosSeguranca.length}
                      </span>

                      <Button variant="outline" onClick={nextPhoto} disabled={fotosSeguranca.length <= 1} size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-center text-xs md:text-sm text-white drop-shadow">
                      Data: {fotosSeguranca[currentPhotoIndex].data}
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowSegPassword(true)}
                className="fixed bottom-6 right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50"
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          )}

          {/* Aba Checklist 5S */}
          {activeTab === "checklist5s" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Checklist 5S</h2>
                  <p className="text-white drop-shadow mt-2">Metodologia de organização e melhoria contínua</p>
                </div>
              </div>

              {/* Lista de Checklists */}
              <div className="grid gap-4 md:gap-6">
                {checklist5S.map((item, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow bg-black/10 backdrop-blur-sm border-white/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <CardTitle className="text-lg text-white">{item.data}</CardTitle>
                          <CardDescription className="text-white/80">
                            Responsável: {item.responsavel} | Setor: {item.setor}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {Object.values(item.items).every(
                            (i) => i.classificacao || i.organizacao || i.limpeza || i.padronizacao || i.disciplina,
                          ) ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Completo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pendente</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              item.items.seiri.classificacao
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {item.items.seiri.classificacao ? "✓" : "○"}
                          </div>
                          <p className="text-sm font-medium text-white">Seiri</p>
                          <p className="text-xs text-white/60">Classificação</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              item.items.seiton.organizacao
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {item.items.seiton.organizacao ? "✓" : "○"}
                          </div>
                          <p className="text-sm font-medium text-white">Seiton</p>
                          <p className="text-xs text-white/60">Organização</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              item.items.seiso.limpeza ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {item.items.seiso.limpeza ? "✓" : "○"}
                          </div>
                          <p className="text-sm font-medium text-white">Seiso</p>
                          <p className="text-xs text-white/60">Limpeza</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              item.items.seiketsu.padronizacao
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {item.items.seiketsu.padronizacao ? "✓" : "○"}
                          </div>
                          <p className="text-sm font-medium text-white">Seiketsu</p>
                          <p className="text-xs text-white/60">Padronização</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              item.items.shitsuke.disciplina
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {item.items.shitsuke.disciplina ? "✓" : "○"}
                          </div>
                          <p className="text-sm font-medium text-white">Shitsuke</p>
                          <p className="text-xs text-white/60">Disciplina</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {checklist5S.length === 0 && (
                  <Card className="text-center py-12 bg-black/10 backdrop-blur-sm border-white/20">
                    <CardContent>
                      <CheckSquare className="w-12 h-12 mx-auto text-white/60 mb-4" />
                      <h3 className="text-lg font-medium text-white drop-shadow mb-2">Nenhum checklist cadastrado</h3>
                      <p className="text-white/80 drop-shadow">
                        Clique no botão + para adicionar seu primeiro checklist 5S
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {activeTab === "checklist5s" && (
                <Button
                  onClick={() => setShowChecklistForm(true)}
                  className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg z-50"
                  size="icon"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              )}
            </div>
          )}

          {/* Aba Indicadores */}
          {activeTab === "indicadores" && (
            <div className="bg-black/10 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">
                Total de Operações
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
                <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Total Paletes</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          {formularios.reduce((total, f) => total + (Number.parseInt(f.pallets) || 0), 0)}
                        </p>
                      </div>
                      <Package className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Total CTEs</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">{formularios.length}</p>
                      </div>
                      <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Operações Carga</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          {formularios.filter((f) => f.tipoOperacao === "Carga").length}
                        </p>
                      </div>
                      <Truck className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Operações Descarga</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          {formularios.filter((f) => f.tipoOperacao === "Descarga").length}
                        </p>
                      </div>
                      <Package className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Operações Hoje</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          {
                            formularios.filter((f) => f.agendamento.startsWith(new Date().toISOString().split("T")[0]))
                              .length
                          }
                        </p>
                      </div>
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantidade por Transportadora</h3>
                    <div className="space-y-2">
                      {Object.entries(
                        formularios.reduce(
                          (acc, f) => {
                            acc[f.transportadora] = (acc[f.transportadora] || 0) + 1
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                      )
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([transportadora, quantidade]) => (
                          <div key={transportadora} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 truncate">{transportadora}</span>
                            <span className="text-sm font-semibold text-gray-900">{quantidade}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantidade por Destino/Origem</h3>
                    <div className="space-y-2">
                      {Object.entries(
                        formularios.reduce(
                          (acc, f) => {
                            acc[f.destinoOrigem] = (acc[f.destinoOrigem] || 0) + 1
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                      )
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([destino, quantidade]) => (
                          <div key={destino} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 truncate">{destino}</span>
                            <span className="text-sm font-semibold text-gray-900">{quantidade}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Aba Sobre */}
          {activeTab === "sobre" && (
            <div className="bg-black/10 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-300 drop-shadow-lg">
                Transpizzattolog
              </h2>
              <div className="prose max-w-none">
                <p className="text-sm md:text-base text-white drop-shadow mb-4">
                  A Transpizzattolog é uma empresa especializada em logística e transporte, oferecendo soluções
                  completas para movimentação de cargas com excelência operacional e total segurança.
                </p>
                <p className="text-sm md:text-base text-white drop-shadow mb-4">
                  Com anos de experiência no mercado, nossa equipe qualificada trabalha 24/7 para garantir entregas
                  pontuais e operações eficientes, atendendo diversos segmentos industriais.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
                  <div className="bg-blue-500/20 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-white/20">
                    <h3 className="font-semibold text-base md:text-lg mb-2 text-white drop-shadow">Nossa Missão</h3>
                    <p className="text-sm md:text-base text-white drop-shadow">
                      Oferecer serviços de transporte e logística com qualidade superior, garantindo a satisfação total
                      dos nossos clientes através de soluções personalizadas e eficientes.
                    </p>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-white/20">
                    <h3 className="font-semibold text-base md:text-lg mb-2 text-white drop-shadow">Nossa Visão</h3>
                    <p className="text-sm md:text-base text-white drop-shadow">
                      Ser referência nacional em transporte e logística, reconhecida pela confiabilidade, pontualidade e
                      inovação em nossos serviços.
                    </p>
                  </div>
                </div>
                <div className="mt-6 md:mt-8 bg-black/20 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-white/20">
                  <h3 className="font-semibold text-base md:text-lg mb-4 text-white drop-shadow">Nossos Valores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚛</div>
                      <h4 className="font-medium mb-1 text-white drop-shadow">Confiabilidade</h4>
                      <p className="text-xs md:text-sm text-white/80 drop-shadow">Compromisso com prazos e qualidade</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🛡️</div>
                      <h4 className="font-medium mb-1 text-white drop-shadow">Segurança</h4>
                      <p className="text-xs md:text-sm text-white/80 drop-shadow">Proteção total da carga e equipe</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-medium mb-1 text-white drop-shadow">Agilidade</h4>
                      <p className="text-xs md:text-sm text-white/80 drop-shadow">Respostas rápidas e eficientes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showChecklistForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Novo Checklist 5S</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowChecklistForm(false)}>
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Data</label>
                      <Input
                        type="date"
                        value={currentChecklist.data}
                        onChange={(e) => setCurrentChecklist({ ...currentChecklist, data: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Responsável</label>
                      <Input
                        value={currentChecklist.responsavel}
                        onChange={(e) => setCurrentChecklist({ ...currentChecklist, responsavel: e.target.value })}
                        placeholder="Nome do responsável"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Setor</label>
                      <Input
                        value={currentChecklist.setor}
                        onChange={(e) => setCurrentChecklist({ ...currentChecklist, setor: e.target.value })}
                        placeholder="Setor da empresa"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Itens do Checklist</h4>

                    {/* Seiri */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
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
                        <label className="font-medium">Seiri - Classificação</label>
                      </div>
                      <Input
                        placeholder="Observações sobre classificação"
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
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
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
                        <label className="font-medium">Seiton - Organização</label>
                      </div>
                      <Input
                        placeholder="Observações sobre organização"
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
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
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
                        <label className="font-medium">Seiso - Limpeza</label>
                      </div>
                      <Input
                        placeholder="Observações sobre limpeza"
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
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
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
                        <label className="font-medium">Seiketsu - Padronização</label>
                      </div>
                      <Input
                        placeholder="Observações sobre padronização"
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
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
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
                        <label className="font-medium">Shitsuke - Disciplina</label>
                      </div>
                      <Input
                        placeholder="Observações sobre disciplina"
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

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddChecklist} className="bg-green-600 hover:bg-green-700">
                      Salvar Checklist
                    </Button>
                    <Button variant="outline" onClick={() => setShowChecklistForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
