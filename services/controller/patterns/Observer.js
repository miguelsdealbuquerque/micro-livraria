class EventManager {
    constructor() {
        if (EventManager.instance) {
            return EventManager.instance;
        }
        this.listeners = [];
        EventManager.instance = this;
    }

    subscribe(eventType, listener) {
        this.listeners.push({ eventType, listener });
    }

    notify(eventType, data) {
        console.log(`[OBSERVER] Evento: ${eventType}`, data);
        this.listeners
            .filter(l => l.eventType === eventType)
            .forEach(l => l.listener(data));
    }
}

module.exports = new EventManager(); 