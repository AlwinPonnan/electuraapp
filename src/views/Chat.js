import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Searchbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Chat() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);
    return (
        <View style={styles.container}>
            <Searchbar
                style={styles.searchBar}
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />

            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                    </View>

                </View>

            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
    searchBar: {
        width: wp(95),
        display: "flex",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 15,
        fontSize: 11,
        backgroundColor: "rgba(245, 245, 245, 1)",
        borderColor: "transparent",
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },



    card: {
        width: wp(95),
        borderRadius: 10,
        padding: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",

    },
    cardImage: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 15
    },
    cardHeading: {
        fontFamily: 'Montserrat-Regular', fontSize: 15, color: '#000',
        marginBottom: 3,
    },
    cardSmallData: {
        fontFamily: 'Montserrat-Thin', fontSize: 10, color: '#000000'
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
})