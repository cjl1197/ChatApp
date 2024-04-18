import React, { useState, useEffect, useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/login'
import Signup from '../screens/signup'
import Home from '../screens/home'
import ChatPage from "../screens/chatpage";
import FindUsers from "../screens/findUsers";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { firebase } from '../firebase/firebase'
import { GlobalContext } from '../../globalContext'


const Stack = createNativeStackNavigator();



export default function Navigator() {

const {username, setUsername} = useContext(GlobalContext);
// const usersRef = firebase.firestore().collection('users');
// const [users, setUsers] = useState();

    

    return (
            <Stack.Navigator screenOptions={{
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: '#3d3d3d',
                }}
            }
                initialRouteName={"Login"}>
                <Stack.Screen 
                    name="Login" 
                    component={Login} 
                    options={{headerBackVisible: false}}
                />
                <Stack.Screen 
                    name="Sign Up" 
                    component={Signup} 
                    options={{headerBackVisible: false}}
                />
                <Stack.Screen 
                    name="Home Screen" 
                    component={Home} 
                    options={{title: (username),
                                headerBackVisible: false,
                    }}
                />
	    	<Stack.Screen
	    		name="Chat Page"
	    		component={ ChatPage }
	    		options={{ title: "Chatting",
					headerBackVisable: true
			}}
	    	/>
	    	<Stack.Screen
	    		name="Find Users"
	    		component={ FindUsers }
	    		options={{  title: "Find Users" }}
	    	/>
            </Stack.Navigator>
    )
}
