import { Observable } from 'tns-core-modules/data/observable';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { isAndroid } from 'tns-core-modules/platform';
import { device } from "tns-core-modules/platform";
import * as Permissions from 'nativescript-permissions';
import { getAccessToken, setupCallListener, setupPushListener, Twilio , unregisterPushNotifications} from 'nativescript-twilio';

declare var android: any;

export class HelloWorldModel extends Observable {
  public message: string;
  public senderPhoneNumber: string = '+34606039750';
  // public phoneNumber: string = '+639171137700';
  public phoneNumber: string = '+14692900583';
  public option1: any = {
    key: '',
    value: '',
  };
  public option2: any = {
    key: '',
    value: '',
  };
  private twilio: Twilio;

  constructor() {
    super();

    if (isAndroid) {
      Permissions.requestPermission(android.Manifest.permission.RECORD_AUDIO, 'Needed for making calls').then(() => {
        console.log('Permission granted!');
      }).catch(() => {
        console.log('Permission is not granted :(');
      });
    }

    let self = this;

    const callListener = {
      onConnectFailure(call, error) {
        dialogs.alert(`connection failure: ${error}`);
        console.log(call);
      },
      onConnected (call) {
        dialogs.alert('call connected');
        console.log(call)
      },
      onDisconnected (call) {
        dialogs.alert('disconnected');
        console.log(call);
      }
    };

    setTimeout(() => {
      console.log('Registering call listeners');
      setupCallListener(callListener);
    }, 100);
    setTimeout(() => {
        // listener for push notifications (incoming calls)
      const pushListener = {
        onPushRegistered(accessToken, deviceToken) {
          console.log('push registration succeded');
        },
        onPushRegisterFailure (error) {
          console.log(`push registration failed: ${error}`);
        },

        onIncomingCall(customParameters) {
          return {
            from: customParameters.from_name
          }
        },

        onAcceptCall(customParameters) {
          console.log('OnAcceptCall fired!', customParameters);
        }
      };
      console.log('Registering push listeners');
      setupPushListener(pushListener);
    },100);
  }

  public onCall(): void {
    console.log('Updating access token:');
    getAccessToken()
      .then((token) => {
        // console.log(`Twilio access token: ${token}`);

        this.twilio = new Twilio(token);

        let options = {};
        if (this.option1.key) {
          options[this.option1.key] = this.option1.value
        }
        if (this.option2.key) {
          options[this.option2.key] = this.option2.value
        }

        let call = this.twilio.makeCall(this.senderPhoneNumber, this.phoneNumber, options);
      })
    .catch((error) => {
      console.error(error);
    })
  }
}
