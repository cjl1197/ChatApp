import { View, Text, FlatList, StyleSheet} from 'react-native';
import React, { useState, useEffect} from'react';
import { firebase } from './config';

const FetchUsers = ({ users, setUsers}) => {

    const usersRef = firebase.firestore().collection('users');

    useEffect(() => {
        usersRef
        .onSnapshot(
            querySnapshot => {
                const users = []
                querySnapshot.forEach((doc) => {
                    const { username } = doc.data()
                    users.push({ 
                        id: doc.id,
                        username
                    })
                })
                setUsers(users)
            }
        )
    }, []);


}

export default FetchUsers;