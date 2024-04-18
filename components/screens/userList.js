import React from 'react';
import { View, Text, FlatList, TouchableHighlight, StyleSheet, Image, Dimensions } from 'react-native';

export default function UserList({ users, onPress }) {
	const screenWidth = Dimensions.get("window").width;

	return (
		<FlatList contentContainerStyle={ styles.center }
			data = { users }
			renderItem = {({ item }) => (
				<TouchableHighlight onPress={() => onPress(item)} style={{ borderRadius: 30, width: screenWidth }}>
					<View style={ styles.item }>
						<Image source={{ width:50,height:50,uri:"https://picsum.photos/50" }}
							style={ styles.picture }/>
						<Text style={{color: 'white', fontSize: '20%'}}>{ item.name }</Text>
					</View>
				</TouchableHighlight>
			)}
			keyExtractor={(item) => item.id}
		/>
		
	);
}
const styles = StyleSheet.create({
	item: {
		padding: 10,
		margin: 5,
		marginLeft: 10,
		marginRight: 10,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#7eb09b",
		borderRadius: 50
	},
	picture: {
		marginRight: 10,
		borderRadius: 50
	},
	center: {
		alignItems: "center",
		justifyContent: "center"
	}
});
