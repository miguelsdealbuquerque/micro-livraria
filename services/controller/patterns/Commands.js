class Command {
    constructor(res) {
        this.res = res;
    }
    execute() {
        throw new Error('Método execute deve ser implementado');
    }
}

class SearchProductsCommand extends Command {
    constructor(service, params, res) {
        super(res);
        this.service = service;
        this.params = params;
    }

    execute() {
        return new Promise((resolve) => {
            this.service.SearchAllProducts(null, (err, data) => {
                if (err) {
                    console.error(err);
                    this.res.status(500).send({ error: 'something failed :(' });
                } else {
                    this.res.json(data.products);
                }
                resolve(); 
            });
        });
    }
}

class CalculateShippingCommand extends Command {
    constructor(service, params, res) {
        super(res);
        this.service = service;
        this.cep = params.cep;
    }

    execute() {
        return new Promise((resolve) => {
            this.service.GetShippingRate({ cep: this.cep }, (err, data) => {
                if (err) {
                    console.error(err);
                    this.res.status(500).send({ error: 'something failed :(' });
                } else {
                    this.res.json({
                        cep: this.cep,
                        value: data.value,
                    });
                }
                resolve();
            });
        });
    }
}

module.exports = { SearchProductsCommand, CalculateShippingCommand };