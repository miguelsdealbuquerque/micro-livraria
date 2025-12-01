const eventManager = require('./Observer');

class ProxyQueue {
    constructor() {
        if (ProxyQueue.instance) {
            return ProxyQueue.instance;
        }
        
        this.queue = []; 
        this.isProcessing = false;
        
        ProxyQueue.instance = this;
    }

    add(command) {
        this.queue.push(command);
        eventManager.notify('REQUEST_QUEUED', { queueLength: this.queue.length });
        this.processQueue();
    }

    async processQueue() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const command = this.queue.shift(); 
            
            eventManager.notify('PROCESSING_START', {});
            
            try {
                await command.execute();
            } catch (e) {
                console.error("Erro ao processar comando", e);
            }
            
            eventManager.notify('PROCESSING_END', { remaining: this.queue.length });
        }

        this.isProcessing = false;
    }
}

module.exports = new ProxyQueue();