import React, { createContext, useState } from "react";
import { firebase } from "../config/firebase";
import * as Google from "expo-google-app-auth";

// Environment
import Constants from "expo-constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        googleLogin: async () => {
          try {
            const { type, idToken, accessToken, user } = await Google.logInAsync({
              expoClientId: Constants.manifest.extra.WEB_CLIENT_ID,
              iosClientId: Constants.manifest.extra.IOS_CLIENT_ID,
              androidClientId: Constants.manifest.extra.ANDROID_CLIENT_ID,
              iosStandaloneAppClientId: Constants.manifest.extra.IOS_STANDALONE_APP_CLIENT_ID,
              androidStandaloneAppClientId: Constants.manifest.extra.ANDROID_STANDALONE_APP_CLIENT_ID,
              scopes: ["profile", "email"],
            });

            if (type === "success") {
              await firebase
                .auth()
                .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

              const credential = firebase.auth.GoogleAuthProvider.credential(
                idToken,
                accessToken
              );

              await firebase.auth().signInWithCredential(credential);

              const uid = firebase.auth().currentUser.uid;
              const usersRef = firebase.database().ref("users/" + uid);

              // Save User data in Firebase Realtime Database
              usersRef.once("value").then((currentUser) => {
                if (!currentUser.exists()) {
                  usersRef.set(user);
                }
              });
            }
          } catch (error) {
            console.log({ error });
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
