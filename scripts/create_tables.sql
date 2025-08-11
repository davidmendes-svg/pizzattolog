-- Adicionando dados iniciais para teste
-- Criação das tabelas para o sistema de gestão

-- Tabela para formulários de logística
CREATE TABLE IF NOT EXISTS formularios (
  id SERIAL PRIMARY KEY,
  cte VARCHAR(100),
  destino_origem TEXT,
  placa_carreta VARCHAR(20),
  motorista VARCHAR(100),
  transportadora VARCHAR(100),
  pallets INTEGER,
  tipo_operacao VARCHAR(20),
  agendamento TIMESTAMP,
  inicio TIMESTAMP,
  chegada TIMESTAMP,
  termino TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cargo VARCHAR(100),
  turno VARCHAR(50),
  foto_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para diálogos de segurança
CREATE TABLE IF NOT EXISTS seguranca (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200),
  descricao TEXT,
  foto_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para checklist 5S
CREATE TABLE IF NOT EXISTS checklist_5s (
  id SERIAL PRIMARY KEY,
  area VARCHAR(100),
  responsavel VARCHAR(100),
  data_checklist DATE,
  seiri_status BOOLEAN DEFAULT FALSE,
  seiri_observacao TEXT,
  seiton_status BOOLEAN DEFAULT FALSE,
  seiton_observacao TEXT,
  seiso_status BOOLEAN DEFAULT FALSE,
  seiso_observacao TEXT,
  seiketsu_status BOOLEAN DEFAULT FALSE,
  seiketsu_observacao TEXT,
  shitsuke_status BOOLEAN DEFAULT FALSE,
  shitsuke_observacao TEXT,
  pontuacao_total INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais para colaboradores
INSERT INTO colaboradores (nome, cargo, turno, foto_url) VALUES
('João Silva', 'Operador de Empilhadeira', '1° turno', '/professional-man.png'),
('Maria Santos', 'Supervisora de Logística', '2° turno', '/professional-woman-diverse.png'),
('Carlos Oliveira', 'Auxiliar de Armazém', '3° turno', '/professional-person.png')
ON CONFLICT DO NOTHING;

-- Inserir dados iniciais para segurança
INSERT INTO seguranca (titulo, descricao, foto_url) VALUES
('Inspeção de Segurança no Armazém', 'Verificação dos equipamentos de segurança e condições do ambiente de trabalho', '/warehouse-safety-inspection.png'),
('Verificação de EPIs', 'Controle e verificação do uso correto dos equipamentos de proteção individual', '/safety-equipment-check.png'),
('Treinamento de Segurança', 'Sessão de treinamento sobre procedimentos de segurança no trabalho', '/safety-training.png')
ON CONFLICT DO NOTHING;
