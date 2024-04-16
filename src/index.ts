import { createActor } from "xstate";
import { StateMachinesService } from "./statemachine";


function main() {
    const state: StateMachinesService = new StateMachinesService;
    const actor = createActor(state.pm2state);
    actor.subscribe((state: any) => {
        // console.log(state.context.list)
        console.log(state.value);
    })
    actor.start();
}
main();