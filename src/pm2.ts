import { Observable } from 'rxjs';
import { of } from 'rxjs';

// const pm2: typeof pm2Types = require('pm2');
const pm2 = require('pm2')


export class Pm2Service {
    constructor() { }

    public connectPM2() {
        return new Promise((resolve, reject): any => {
            pm2.connect(false, (err: any) => {
                if (err) {
                    reject(new Error(err));

                }
                return resolve(err);
            });
        });
    }

    public startPM2(options: any): Observable<any> {
        return of(pm2.start(options, (err: any, proc: any) => {
            if (err) {
                throw (err);
            }
        }))
    }

    public disconnect() {
        return new Promise((resolve, reject): any => {
            pm2.disconnect((err: any) => {
                if (err) {
                    reject(new Error(err));
                }
                return resolve(err);
            });
        })
    }
}