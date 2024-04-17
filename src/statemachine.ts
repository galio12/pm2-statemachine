
import { assign, createMachine, fromPromise, interpret, setup, createActor, waitFor, log, sendTo, raise, fromObservable } from 'xstate';
import { Pm2Service } from './pm2';
import { of, Observable, interval } from 'rxjs';
const pm22 = require('pm2')

export class StateMachinesService {
    pm2: Pm2Service = new Pm2Service;
    constructor() { }




    pm2state = setup({
        actors: {
            connect: fromPromise<any, any>(async () => {
                await this.pm2.connectPM2();
            }),
            start: fromObservable<any, any>(({ input }) => {
                return this.pm2.startPM2(input.options);
            }),
            disconnect: fromPromise(async () => {
                await this.pm2.disconnect();
            })
        }
    }).
        createMachine({
            id: 'dog',
            initial: 'connect',
            states: {
                connect: {
                    invoke: {
                        src: 'connect',
                        onDone: {
                            target: 'start',
                        },
                        onError: {
                            actions: () => console.log('error')
                        }
                    },
                },
                start: {
                    invoke: {

                        src: 'start',
                        input: ({ }) => ({ options: { script: './src/index.js', name: 'test' } }),
                        onSnapshot: {
                            actions: ({ event }) => console.log(event.snapshot)
                        },
                        onDone: {
                            target: 'disconnect',
                        },
                        onError: {
                            actions: () => console.log('error')
                        }
                    },
                },
                // list: {
                //     invoke: {
                //         src: 'list',
                //         onDone: {
                //             actions: [() => console.log('done list'), assign({ list: ({ event }) => event.output })],
                //             target: 'disconnect'
                //         }
                //     }
                // },
                // kill: {
                //     invoke: {
                //         src: 'killPM2',
                //         onDone: {
                //             // actions: () => console.log('done kill'),
                //             target: 'done'
                //         },
                //         onError: {
                //             actions: () => console.log('error2')
                //         }
                //     }
                // },
                disconnect: {
                    invoke: {
                        src: 'disconnect',
                        onDone: {
                            // actions: () => console.log('done kill'),
                            target: 'done'
                        },
                        onError: {
                            actions: () => console.log('error3')
                        }
                    }
                },
                done: {
                    type: 'final'
                }
            }
        })
}
