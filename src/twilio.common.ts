import { Observable } from 'tns-core-modules/data/observable';
import { fetch } from 'tns-core-modules/fetch';
import * as dialogs from 'tns-core-modules/ui/dialogs';

let accessTokenUrl: string = undefined;
let accessTokenHeaders: any = {};
export let callListener: any = undefined;
export let pushListener: any = undefined;
export let incomingCallOptions: Object = undefined;

export function initTwilio(url: string, headers: any = {}) {
  accessTokenUrl = url;
  accessTokenHeaders = headers;
}

export function setupCallListener(listener: any) {
  callListener = listener;
}

export function setupPushListener(listener: any) {
  pushListener = listener;
}

export function getAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(accessTokenUrl, {headers: accessTokenHeaders})
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          reject(new Error(`Response with status code: ${response.status}`));
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export abstract class Call {
  public abstract disconnect(): void;
  public abstract mute(value: boolean): void;
}

export abstract class Common extends Observable {
  public accessToken: string;

  constructor(accessToken: string) {
    super();

    this.accessToken = accessToken;
  }

  public abstract makeCall(senderPhoneNumber, phoneNumber, options): Call;
  public abstract toggleAudioOutput(toSpeaker: boolean): void;
}

export function callIt(listener: object, method: string, ...args: any): void {
  if (!listener) {
    console.error('Listener is not defined');
  } else if (typeof listener[method] === 'function') {
    listener[method](...args);
  }
}

export function readIt(listener: object, method: string, ...args: any): any {
  if (!listener) {
    console.error('Listener is not defined');
    return undefined;
  } else if (typeof listener[method] === 'function') {
    let responseVal: any = listener[method](...args);
    if (responseVal === undefined) {
      console.error('Listener does not return any value: ', method);
      return undefined;
    }
    else {
      return responseVal;
    }
  }
}
