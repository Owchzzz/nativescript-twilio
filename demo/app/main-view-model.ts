import { Observable } from 'tns-core-modules/data/observable';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { isAndroid } from 'tns-core-modules/platform';
import { device } from "tns-core-modules/platform";
import * as Permissions from 'nativescript-permissions';
import { getAccessToken, setupCallListener, setupPushListener, Twilio , unregisterPushNotifications} from 'nativescript-twilio';

declare var android: any;

export class HelloWorldModel extends Observable {
  public message: string;
  public senderPhoneNumber: string = ''; // Assign the default phone number from where the call will originate, or the client that it originates from i.e. client:alice
  public phoneNumber: string = ''; // Assign the default receiving phone number or client i.e. +12345678

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
    // Assign Call Listeners
    const callListener = {
      onConnectFailure(call, error) {
        dialogs.alert(`connection failure: ${error}`);
      },
      onConnected (call) {
        dialogs.alert('call connected');
      },
      onDisconnected (call) {
        dialogs.alert('disconnected');
      }
    };

    // Setup Listener for call events
    console.log('Registering call listeners');
    setupCallListener(callListener);
    // Assign listener for push notifications (incoming calls)
    const pushListener = {
      onPushRegistered(accessToken, deviceToken) {
        dialogs.alert('push registration succeded');
      },
      onPushRegisterFailure (error) {
        dialogs.alert(`push registration failed: ${error}`);
      },
      onIncomingCall(customParameters) {
        return {
          from: customParameters.custom_parameter_name
        };
      }
    };

    // Setup Push Listener
    console.log('Registering push listeners');
    setupPushListener(pushListener);
  }

  public onCall(): void {
    console.log('Updating access token:');
    getAccessToken()
      .then((token) => {
        console.log(`Twilio access token: ${token}`);

        // Instantiate Twilio with token provided from server
        this.twilio = new Twilio(token);

        let options = {};
        if (this.option1.key) {
          options[this.option1.key] = this.option1.value;
        }
        if (this.option2.key) {
          options[this.option2.key] = this.option2.value;
        }

        let call = this.twilio.makeCall(this.senderPhoneNumber, this.phoneNumber, options);
      })
    .catch((error) => {
      console.error(error);
      dialogs.alert(error);
    });
  }
}
