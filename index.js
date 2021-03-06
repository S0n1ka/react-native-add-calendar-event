import { NativeModules, Platform, PermissionsAndroid } from 'react-native';

const { AddCalendarEvent } = NativeModules;

const _presentCalendarEventDialog = eventConfig => {
  return AddCalendarEvent.presentNewEventDialog(eventConfig);
};

export const presentNewCalendarEventDialog = options => {
  if (Platform.OS === 'android') {
    // it seems unnecessary to check first, but if permission is manually disabled
    // the PermissionsAndroid.request will return granted (a RN bug?)
    return PermissionsAndroid.checkPermission(
      PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR
    ).then(hasPermission => {
      if (hasPermission === true) {
        return _presentCalendarEventDialog(options);
      } else {
        return PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR)
          .then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              return _presentCalendarEventDialog(options);
            } else {
              return Promise.reject('permissionNotGranted');
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
    });
  } else {
    // ios permissions resolved within the native module
    return _presentCalendarEventDialog(options);
  }
};
