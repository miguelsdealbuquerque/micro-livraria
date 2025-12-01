const express = require('express');
const cors = require('cors');

// Importação dos Clientes gRPC
const shippingService = require('./shipping');
const inventoryService = require('./inventory');

// Importação dos Padrões
const proxyQueue = require('./patterns/ProxyQueue');
const { SearchProductsCommand, CalculateShippingCommand } = require('./patterns/Commands');
const eventManager = require('./patterns/Observer');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração simples do Observer para logs
eventManager.subscribe('REQUEST_QUEUED', (data) => console.log(`> Nova requisição na fila. Total: ${data.queueLength}`));
eventManager.subscribe('PROCESSING_END', () => console.log(`> Requisição finalizada.`));

/**
 * Retorna a lista de produtos da loja via InventoryService
 * Agora utiliza o Padrão Command e ProxyQueue
 */
app.get('/products', (req, res, next) => {
    // Cria o comando encapsulando a requisição, os parametros e o objeto de resposta
    const command = new SearchProductsCommand(inventoryService, {}, res);
    
    // Envia para o Proxy processar ordenadamente
    proxyQueue.add(command);
});

/**
 * Consulta o frete de envio no ShippingService
 * Agora utiliza o Padrão Command e ProxyQueue
 */
app.get('/shipping/:cep', (req, res, next) => {
    const command = new CalculateShippingCommand(shippingService, { cep: req.params.cep }, res);
    proxyQueue.add(command);
});

/**
 * Inicia o router
 */
app.listen(3000, () => {
    console.log('Controller Service (Proxy) running on http://127.0.0.1:3000');
});