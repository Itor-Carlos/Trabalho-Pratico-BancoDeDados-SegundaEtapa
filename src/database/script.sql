CREATE SCHEMA fazenda;

SET search_path TO fazenda;

CREATE TYPE status_galpao AS ENUM('vazio','cheio','utilizado');

CREATE TABLE IF NOT EXISTS Produto (
  id_produto INT NOT NULL,
  nome_produto VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_produto));


-- -----------------------------------------------------
-- Table Area
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Area (
  id_area SERIAL NOT NULL,
  tamanho_hectar FLOAT NOT NULL,
  localizacao VARCHAR(45) NOT NULL,
  colheita_disponivel BOOLEAN NOT NULL,
  PRIMARY KEY (id_area));


-- -----------------------------------------------------
-- Table Saca
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Saca (
  id_saca SERIAL NOT NULL,
  peso FLOAT NOT NULL,
  Area_id_area INT NOT NULL,
  PRIMARY KEY (id_saca),
  CONSTRAINT fk_Saca_Area1
    FOREIGN KEY (Area_id_area)
    REFERENCES Area (id_area)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Grao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Grao (
  id_grao INT NOT NULL,
  Produto_id_produto INT NOT NULL,
  tipo_grao VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_grao),
  CONSTRAINT fk_Grao_Produto1
    FOREIGN KEY (Produto_id_produto)
    REFERENCES Produto (id_produto)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Silo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Silo (
  id_silo INT NOT NULL,
  cheio BOOLEAN NOT NULL,
  capacidade INT NOT NULL,
  PRIMARY KEY (id_silo));


-- -----------------------------------------------------
-- Table Pessoa
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Pessoa (
  documento INT NOT NULL,
  telefones VARCHAR(45)[] NOT NULL,
  primeiro_nome VARCHAR(45) NOT NULL,
  sobrenome VARCHAR(45) NOT NULL,
  PRIMARY KEY (documento));


-- -----------------------------------------------------
-- Table Endereco
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Endereco (
  cep INT NOT NULL,
  Pessoa_documento INT NOT NULL,
  numero INT NOT NULL,
  complemento VARCHAR(45) NULL,
  bairro VARCHAR(45) NOT NULL,
  rua VARCHAR(45) NOT NULL,
  PRIMARY KEY (cep, Pessoa_documento),
  CONSTRAINT fk_Endereco_Pessoa1
    FOREIGN KEY (Pessoa_documento)
    REFERENCES Pessoa (documento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Funcionario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Funcionario (
  Pessoa_documento INT NOT NULL,
  data_nascimento DATE NOT NULL,
  idade INT NOT NULL,
  data_admissao DATE NOT NULL,
  salario FLOAT NOT NULL,
  PRIMARY KEY (Pessoa_documento),
  CONSTRAINT fk_Funcionario_Pessoa1
    FOREIGN KEY (Pessoa_documento)
    REFERENCES Pessoa (documento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


CREATE OR REPLACE FUNCTION calcula_idade() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.idade := EXTRACT(YEAR FROM AGE(NEW.data_nascimento));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inserir_funcionario
BEFORE INSERT ON Funcionario
FOR EACH ROW
EXECUTE FUNCTION calcula_idade();


-- -----------------------------------------------------
-- Table Fornecedor
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Fornecedor (
  Pessoa_documento INT NOT NULL,
  nome_fantasia VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  PRIMARY KEY (Pessoa_documento),
  CONSTRAINT fk_Fornecedor_Pessoa1
    FOREIGN KEY (Pessoa_documento)
    REFERENCES Pessoa (documento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Cliente
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Cliente (
  Pessoa_documento INT NOT NULL,
  nome_fantasia VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  PRIMARY KEY (Pessoa_documento),
  CONSTRAINT fk_Cliente_Pessoa1
    FOREIGN KEY (Pessoa_documento)
    REFERENCES Pessoa (documento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Galpao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Galpao (
  id_galpao SERIAL NOT NULL,
  capacidade FLOAT NOT NULL,
  status status_galpao NOT NULL,
  PRIMARY KEY (id_galpao));


-- -----------------------------------------------------
-- Table Tipo_maquinario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Tipo_maquinario (
  id_tipo_maquinario INT NOT NULL,
  nome_maquinario VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_tipo_maquinario));


-- -----------------------------------------------------
-- Table Maquinario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Maquinario (
  id_maquinario INT NOT NULL,
  tipo_maquinario VARCHAR(45) NOT NULL,
  id_tipo_maquinario INT NOT NULL,
  PRIMARY KEY (id_maquinario),
  CONSTRAINT fk_Maquinario_Tipo_maquinario1
    FOREIGN KEY (id_tipo_maquinario)
    REFERENCES Tipo_maquinario (id_tipo_maquinario)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  UNIQUE (id_maquinario, id_tipo_maquinario)
);


-- -----------------------------------------------------
-- Table EnvioCarga
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS EnvioCarga (
  id_envio_carga INT NOT NULL,
  destino VARCHAR(45) NOT NULL,
  data_envio DATE NULL,
  PRIMARY KEY (id_envio_carga));


-- -----------------------------------------------------
-- Table Transacao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Transacao (
  idTransacao INT NOT NULL,
  Fornecedor_Pessoa_documento INT NULL,
  Cliente_Pessoa_documento INT NULL,
  valor FLOAT NOT NULL,
  data TIMESTAMP NOT NULL,
  PRIMARY KEY (idTransacao),
  CONSTRAINT fk_Transacao_Fornecedor1
    FOREIGN KEY (Fornecedor_Pessoa_documento)
    REFERENCES Fornecedor (Pessoa_documento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_Transacao_Cliente1
    FOREIGN KEY (Cliente_Pessoa_documento)
    REFERENCES Cliente (Pessoa_documento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

-- -----------------------------------------------------
-- Table Fertilizante
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Fertilizante (
  idfertilizante INT NOT NULL,
  Produto_id_produto INT NOT NULL,
  nome_produto VARCHAR(45) NOT NULL,
  validade TIMESTAMP NOT NULL,
  PRIMARY KEY (idfertilizante),
  CONSTRAINT fk_Fertilizante_Produto1
    FOREIGN KEY (Produto_id_produto)
    REFERENCES Produto (id_produto)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table fertilizante_has_Transacao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS fertilizante_has_Transacao (
  fertilizante_idfertilizante INT NULL,
  Transacao_idTransacao INT NULL,
  quantidade INT NOT NULL,
  PRIMARY KEY (fertilizante_idfertilizante, Transacao_idTransacao),
  CONSTRAINT fk_fertilizante_has_Transacao_fertilizante1
    FOREIGN KEY (fertilizante_idfertilizante)
    REFERENCES Fertilizante (idfertilizante)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_fertilizante_has_Transacao_Transacao1
    FOREIGN KEY (Transacao_idTransacao)
    REFERENCES Transacao (idTransacao)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Transacao_has_Saca
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Transacao_has_Saca (
  Transacao_idTransacao INT NULL,
  Saca_id_saca INT NULL,
  PRIMARY KEY (Transacao_idTransacao, Saca_id_saca),
  CONSTRAINT fk_Transacao_has_Saca_Transacao1
    FOREIGN KEY (Transacao_idTransacao)
    REFERENCES Transacao (idTransacao)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_Transacao_has_Saca_Saca1
    FOREIGN KEY (Saca_id_saca)
    REFERENCES Saca (id_saca)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Silo_localizado
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Silo_localizado (
  Silo_id_silo INT NULL,
  Area_id_area INT NULL,
  PRIMARY KEY (Silo_id_silo, Area_id_area),
  CONSTRAINT fk_Silo_has_Area_Silo1
    FOREIGN KEY (Silo_id_silo)
    REFERENCES Silo (id_silo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_Silo_has_Area_Area1
    FOREIGN KEY (Area_id_area)
    REFERENCES Area (id_area)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Silo_has_Grao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Silo_has_Grao (
  Silo_id_silo INT NOT NULL,
  Grao_id_grao INT NOT NULL,
  PRIMARY KEY (Silo_id_silo, Grao_id_grao),
  CONSTRAINT fk_Silo_has_Grao_Silo1
    FOREIGN KEY (Silo_id_silo)
    REFERENCES Silo (id_silo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_Silo_has_Grao_Grao1
    FOREIGN KEY (Grao_id_grao)
    REFERENCES Grao (id_grao)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table EnvioCarga_has_Saca
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS EnvioCarga_has_Saca (
  EnvioCarga_id_envio_carga INT NOT NULL,
  Saca_id_saca INT NOT NULL,
  PRIMARY KEY (EnvioCarga_id_envio_carga, Saca_id_saca),
  CONSTRAINT fk_Transporte_has_Saca_Transporte1
    FOREIGN KEY (EnvioCarga_id_envio_carga)
    REFERENCES EnvioCarga (id_envio_carga)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_Transporte_has_Saca_Saca1
    FOREIGN KEY (Saca_id_saca)
    REFERENCES Saca (id_saca)
    ON DELETE NO ACTION
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Galpao_has_Saca
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Galpao_has_Saca (
  Galpao_id_galpao INT NOT NULL,
  Saca_id_saca INT NOT NULL,
  PRIMARY KEY (Galpao_id_galpao, Saca_id_saca),
  CONSTRAINT fk_Galpao_has_Saca_Galpao1
    FOREIGN KEY (Galpao_id_galpao)
    REFERENCES Galpao (id_galpao)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_Galpao_has_Saca_Saca1
    FOREIGN KEY (Saca_id_saca)
    REFERENCES Saca (id_saca)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Manutencoes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Manutencoes (
  id_manutencao INT NOT NULL,
  Maquinario_id_maquinario INT NOT NULL,
  data_manutencao TIMESTAMP NOT NULL,
  descricao_manutencao VARCHAR(45) NULL,
  PRIMARY KEY (id_manutencao),
  CONSTRAINT fk_Historico_manutencoes_Maquinario1
    FOREIGN KEY (Maquinario_id_maquinario)
    REFERENCES Maquinario (id_maquinario)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table Transporte_has_Maquinario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Transporte_has_Maquinario (
  id_envio_carga INT NOT NULL,
  Maquinario_id_maquinario INT NOT NULL,
  id_tipo_maquinario INT NOT NULL,
  PRIMARY KEY (id_envio_carga, Maquinario_id_maquinario, id_tipo_maquinario),
  CONSTRAINT fk_Transporte_has_Maquinario_Transporte1
    FOREIGN KEY (id_envio_carga)
    REFERENCES EnvioCarga (id_envio_carga)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_Transporte_has_Maquinario_Maquinario1
    FOREIGN KEY (Maquinario_id_maquinario , id_tipo_maquinario)
    REFERENCES Maquinario (id_maquinario , id_tipo_maquinario)
    ON DELETE CASCADE
    ON UPDATE CASCADE);