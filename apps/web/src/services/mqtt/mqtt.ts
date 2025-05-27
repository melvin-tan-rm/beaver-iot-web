/* eslint-disable no-console */
import mqtt from 'mqtt';
import { safeJsonParse } from '@milesight/shared/src/utils/tools';
import { EventEmitter } from '@milesight/shared/src/utils/event-emitter';
import { MQTT_EVENT_TYPE, TOPIC_PREFIX, TOPIC_SUFFIX } from './constant';
import type { IEventEmitter, MqttMessageData, CallbackType } from './types';

interface MqttOptions extends mqtt.IClientOptions {
    url: string;
    debug?: boolean;
}

type MqttMessageDataType = MqttMessageData | undefined;

const DEFAULT_OPTIONS: mqtt.IClientOptions = {
    /** Clean messages while offline */
    clean: true,
    /** Interval between two reconnection */
    reconnectPeriod: 5000,
    /** Time to wait before a CONNACK is received */
    connectTimeout: 6000,
    /**
     * If connection is broken and reconnects, subscribed topics are automatically subscribed again */
    resubscribe: true,
    /**
     * Whether to verify the server certificate chain and address name
     */
    rejectUnauthorized: false,
    /** WebSocket connection options */
    wsOptions: {},
    /** Heartbeat interval to keep alive */
    keepalive: 50,
    /** Whether to reschedule ping when the network is disconnected */
    reschedulePings: true,
};

/**
 * MQTT service class
 */
class MqttService {
    private debug: boolean = false;
    private client: mqtt.MqttClient | null = null;
    private options?: Omit<MqttOptions, 'url' | 'debug'>;
    private readonly eventEmitter: EventEmitter<IEventEmitter> = new EventEmitter(); // Event bus

    status: 'connecting' | 'connected' | 'disconnected' = 'disconnected';

    constructor({ url, debug, ...options }: MqttOptions) {
        if (!options.username || !options.password) {
            throw new Error('MQTT username or password is required');
        }

        this.options = options;
        this.debug = debug || false;
        this.status = 'connecting';
        this.client = mqtt.connect(url, { ...DEFAULT_OPTIONS, ...options });
        this.init();
    }

    private init() {
        if (!this.client) return;

        this.client.on('connect', () => {
            this.status = 'connected';
            this.log('MQTT connected');
        });

        this.client.on('reconnect', () => {
            this.status = 'connecting';
            this.log('MQTT reconnecting...');
        });

        this.client.on('disconnect', () => {
            this.status = 'disconnected';
            this.log('disconnected');
        });

        this.client.on('offline', () => {
            this.status = 'disconnected';
            this.log('MQTT offline');
        });

        this.client.on('error', err => {
            this.status = 'disconnected';
            this.client?.end();
            this.log(['MQTT error:', err]);
        });

        this.client.on('message', (topic, message) => {
            this.log([`MQTT message received: topic=${topic}, message=${message.toString()}`]);

            const data = (safeJsonParse(message.toString()) as MqttMessageDataType) || {};
            const subscriber = this.eventEmitter.getSubscriber(topic);

            if (!subscriber) return;
            subscriber.callbacks.forEach(cb => cb(data, subscriber.attrs));
        });
    }

    /**
     * Handles debug logging with level filtering
     * @description Only outputs logs when debug mode is enabled
     * @param {any | any[]} message - Log content (supports single value or array)
     * @param {'info' | 'warn' | 'error'} [level] - Log level determining console method
     */
    private log(message: any | any[], level?: 'info' | 'warn' | 'error') {
        if (!this.debug) return;

        const logMessage = Array.isArray(message) ? message : [message];
        switch (level) {
            case 'info':
                console.info(...logMessage);
                break;
            case 'warn':
                console.warn(...logMessage);
                break;
            case 'error':
                console.error(...logMessage);
                break;
            default:
                console.log(...logMessage);
                break;
        }
    }

    /**
     * Generates MQTT topic based on event type and direction
     * @description Topic format: {prefix}/{username}/{direction}/{event_suffix}
     * @param {MQTT_EVENT_TYPE} event - Event type that determines the topic suffix
     * @param {'uplink' | 'downlink'} [direction=downlink] - Topic direction (uplink for publishing, downlink for subscribing)
     * @throws {Error} When username is not configured
     * @returns {string} Formatted MQTT topic string
     */
    private genTopic(event: MQTT_EVENT_TYPE, direction: 'uplink' | 'downlink' = 'downlink') {
        if (!this.options?.username) {
            throw new Error('MQTT username is required');
        }
        return `${TOPIC_PREFIX}/${this.options.username}/${direction}/${TOPIC_SUFFIX[event]}`;
    }

    /**
     * Publishes a message to the MQTT server
     * @description Only effective when connection status is 'connected'
     * @param {MQTT_EVENT_TYPE} event - Message event type that determines the topic generation rules
     * @param {any} message - Message content to be sent (automatically serialized to JSON string)
     */
    publish(event: MQTT_EVENT_TYPE, message: any) {
        if (this.status !== 'connected') return;
        const topic = this.genTopic(event, 'uplink');
        this.client?.publish(topic, JSON.stringify(message));
    }

    /**
     * Subscribes to specified MQTT event type
     * @description Only effective when connection status is 'connected'
     * @param {MQTT_EVENT_TYPE} event - Event type that determines the subscription topic
     * @param {CallbackType} callback - Callback function for handling incoming messages
     */
    subscribe(event: MQTT_EVENT_TYPE, callback: CallbackType) {
        if (this.status !== 'connected') return;
        const topic = this.genTopic(event);
        const topics = this.eventEmitter.getTopics();

        if (!topics.includes(topic)) {
            this.client?.subscribe(topic, (err, granted) => {
                if (err) {
                    this.log([`MQTT subscribe ${topic} failed:`, err], 'error');
                } else {
                    this.log([`MQTT subscribe ${topic} success:`, granted]);
                }
            });
        }
        this.eventEmitter.subscribe(topic, callback);
    }

    /**
     * Unsubscribes from specified MQTT event type
     * @description Only effective when connection status is 'connected'
     * @param {MQTT_EVENT_TYPE} event - Event type that determines the subscription topic
     * @param {CallbackType} [callback] - Optional callback function to remove specific subscription
     */
    unsubscribe(event: MQTT_EVENT_TYPE, callback?: CallbackType) {
        if (this.status !== 'connected') return;
        const topic = this.genTopic(event);
        const topics = this.eventEmitter.getTopics();

        if (topics.includes(topic)) {
            this.client?.unsubscribe(topic, (err, granted) => {
                if (err) {
                    this.log([`MQTT unsubscribe ${topic} failed:`, err], 'error');
                } else {
                    this.log([`MQTT unsubscribe ${topic} success:`, granted]);
                }
            });
        }
        this.eventEmitter.unsubscribe(topic, callback);
    }
}

export default MqttService;
