import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Chat({name}){
	return (
		<View style={{flexDirection: "row"}}>
			<Image source={{uri: "https://picsum.photos/200"}} style={styles.profilePicture}/>
			<Text style={styles.name}>{name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	profilePicture: {
		borderRadius: "50%",
		width: 50,
		height: 50,
		margin: 10,
		marginRight: 5
	},
	name: {
		alignSelf: "center",
		fontSize: 20
	}
});
