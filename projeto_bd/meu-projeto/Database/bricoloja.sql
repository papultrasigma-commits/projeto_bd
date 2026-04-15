-- ==========================================
-- 1. LIMPEZA DA BASE DE DADOS
-- ==========================================
-- Apaga as tabelas se já existirem (A ordem é muito importante! Apagar primeiro as que têm chaves estrangeiras)
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS utilizadores;

-- ==========================================
-- 2. CRIAÇÃO DAS TABELAS
-- ==========================================

-- Tabela de Utilizadores (Inclui a coluna is_admin para o teu login)
CREATE TABLE utilizadores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Tabela de Categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Tabela de Produtos (Com a Chave Estrangeira 'category_id' a ligar à tabela categorias)
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(50),
    price NUMERIC(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categorias(id), -- A LIGAÇÃO ENTRE TABELAS
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    image TEXT,
    stock INTEGER DEFAULT 10,
    delivery BOOLEAN DEFAULT TRUE,
    description TEXT
);

-- ==========================================
-- 3. INSERÇÃO DE DADOS DE TESTE (MOCK DATA)
-- ==========================================

-- Inserir Utilizadores
-- O Simão fica com is_admin = TRUE, o João fica como cliente normal
INSERT INTO utilizadores (name, email, password, is_admin) VALUES 
('Simão (Admin)', 'simao@gmail.com', 'simaoefofinho', TRUE),
('João Bricolage', 'joao@email.com', '123456', FALSE);

-- Inserir Categorias PRIMEIRO (Têm de existir antes de inserirmos os produtos)
INSERT INTO categorias (name, description) VALUES
('ferramentas', 'Ferramentas manuais e elétricas para construção e bricolage.'),
('pintura', 'Tintas, vernizes, trinchas e rolos para todos os tipos de superfícies.'),
('banho', 'Móveis, sanitários e acessórios para a sua casa de banho.'),
('jardim', 'Máquinas, mobiliário e plantas para espaços exteriores.');

-- Inserir Produtos DEPOIS (Usando o category_id correspondente)
-- 1: Ferramentas | 2: Pintura | 3: Banho | 4: Jardim
INSERT INTO produtos (name, brand, price, category_id, image, description) VALUES 
('Aparafusadora Sem Fios 18V', 'BOSCH', 89.99, 1, 'https://placehold.co/400x400?text=Aparafusadora', 'Excelente aparafusadora com bateria incluída.'),
('Tinta Branca Mate 15L Premium', 'ROBBIALAC', 34.50, 2, 'https://placehold.co/400x400?text=Tinta', 'Tinta de interior para paredes e tetos.'),
('Móvel de Casa de Banho Suspenso', 'SENSEA', 149.00, 3, 'https://placehold.co/400x400?text=Movel', 'Móvel moderno com lavatório incluído.'),
('Cortador de Relva a Gasolina', 'STERWINS', 199.90, 4, 'https://placehold.co/400x400?text=Cortador', 'Ideal para jardins até 500m2.');

-- ==========================================
-- 4. VERIFICAÇÃO DE DADOS (QUERIES ÚTEIS)
-- ==========================================

-- Ver todas as categorias
SELECT * FROM categorias;
SELECT * FROM produtos;

-- Ver todos os utilizadores
SELECT id, name, email, is_admin FROM utilizadores;

-- Ver os produtos JUNTAMENTE com o nome da categoria (Query que vais usar no teu Backend Node.js)
SELECT 
    p.id, 
    p.name AS produto, 
    p.brand AS marca,
    p.price AS preco, 
    c.name AS categoria 
FROM produtos p
JOIN categorias c ON p.category_id = c.id;