import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
        Button, SafeAreaView, TouchableWithoutFeedback,
         KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { auth } from '../firebase/firebase';
import { firebase } from '../firebase/firebase';
import { GlobalContext} from '../../globalContext';

export default function Login({navigation}) {

    const { userID, setUserID} = useContext(GlobalContext);
    const { username, setUsername} = useContext(GlobalContext);
 // text fields input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const usersRef = firebase.firestore().collection('users');
    const [users, setUsers] = useState();
    let id;
    
 // handles login using Firebase Authentication
     const handleLogIn = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with: ', user.email);
                id = user.uid;
                setUserID(id);
                checkUser();
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home Screen");
            }
        })
	return unsubscribe;
            })
            .catch(error => alert(error.message));
            
    };

    const checkUser = () => {
        console.log('should run second');
         usersRef
        .onSnapshot(
            querySnapshot => {
                const users = []
                querySnapshot.forEach((doc) => {
                    const { username, userID } = doc.data()
                    users.push({ 
                        id: doc.id,
                        username,
                        userID
                    })
                })
                setUsers(users)
                users.map(users => {
                    if(users.userID === id) {
                        setUsername(users.username)   
                    }
                })
                
            }
        )
    }

 // checks if user is signed in and redirects to home screen
    useEffect(() => {

        /*const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home Screen");
            }
        })      
        return unsubscribe*/
    }, [])

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
        <SafeAreaView style={styles.main}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
        <View style={styles.container}>
        <View>
        </View>
        <View>
            <Text style={styles.welcome}>Welcome Back</Text>
        </View>
        
        <View>
            <TextInput 
                style={styles.input} 
                textAlign='left'
                placeholder=" Email Address" 
                onChangeText={(val) => setEmail(val)}
            />
            <TextInput style={styles.input} 
                placeholder=" Enter Password" 
                onChangeText={(val) => setPassword(val)}
                secureTextEntry
            />  
            <View style={styles.btnWrapper}>
                <TouchableOpacity 
                    style={styles.loginBtn}
                    onPress={handleLogIn}
                >
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.signUpContainer}>
            <Text>Don't have an account?</Text> 
                <TouchableOpacity onPress={() => navigation.navigate("Sign Up")}>
                    <Text style={styles.signUp}>  Sign Up</Text>
                </TouchableOpacity>
        </View>
        </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
)}



const styles = StyleSheet.create({
main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#c0c0c0',
},
container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
welcome: {
    fontSize: 40,
},
input: {
    height: 55,
    width: 300,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 30,
    paddingLeft: 10,
    margin: 20,
},
btnWrapper: {
    height: 55,
    marginTop: 12,
    backgroundColor: '#3d3d3d',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 30,
},
loginBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 55,
},
loginBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
},
signUpContainer: {
    position: 'absolute',
    bottom: 20, 
    textAlign: 'center',
    flexDirection: 'row',
},
signUp: {
    color: '#0000FF',
    marginLeft: 10,
},
});
