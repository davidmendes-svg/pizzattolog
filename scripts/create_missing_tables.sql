-- Criando tabelas que faltam no banco Supabase

-- Tabela para formulários de logística
CREATE TABLE IF NOT EXISTS public.formularios (
    id SERIAL PRIMARY KEY,
    cte VARCHAR(255),
    destino_origem TEXT,
    placa_carreta VARCHAR(50),
    motorista VARCHAR(255),
    transportadora VARCHAR(255),
    pallets INTEGER,
    tipo_operacao VARCHAR(50),
    agendamento TIMESTAMP,
    inicio TIMESTAMP,
    chegada TIMESTAMP,
    termino TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela para colaboradores
CREATE TABLE IF NOT EXISTS public.colaboradores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    turno VARCHAR(50),
    foto TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela para fotos de segurança
CREATE TABLE IF NOT EXISTS public.seguranca (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255),
    descricao TEXT,
    foto TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dados iniciais para colaboradores
INSERT INTO public.colaboradores (nome, cargo, turno, foto) VALUES
('João Silva', 'Operador de Empilhadeira', '1° turno', '/professional-man.png'),
('Maria Santos', 'Supervisora de Logística', '2° turno', '/professional-woman-diverse.png'),
('Carlos Oliveira', 'Auxiliar de Armazém', '3° turno', '/professional-person.png')
ON CONFLICT DO NOTHING;

-- Inserir dados iniciais para segurança
INSERT INTO public.seguranca (titulo, descricao, foto) VALUES
('Inspeção de Segurança no Armazém', 'Verificação dos equipamentos de segurança e condições do ambiente de trabalho', '/warehouse-safety-inspection.png'),
('Verificação de EPIs', 'Controle e verificação dos equipamentos de proteção individual dos colaboradores', '/safety-equipment-check.png'),
('Treinamento de Segurança', 'Sessão de treinamento sobre procedimentos de segurança no trabalho', '/safety-training.png')
ON CONFLICT DO NOTHING;

-- Habilitar RLS (Row Level Security) se necessário
ALTER TABLE public.formularios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seguranca ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas para permitir acesso
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.formularios FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.colaboradores FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.seguranca FOR ALL USING (true);
