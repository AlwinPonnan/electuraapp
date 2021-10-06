// import React, { useState } from 'react'
// import { View, Text, ImageBackground, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { images } from '../../utils/globals/Images';
// import Icon from 'react-native-vector-icons/Ionicons';
// export default function Wallet() {
//     const [transactionArr, setTransactionArr] = useState([
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Deducted for your order", deducted: true },
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Added money to your ", deducted: false },
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Added", deducted: false },
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Added", deducted: false },
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Deducted", deducted: true },
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Added", deducted: false },
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Added", deducted: false },
//         { amount: "20", time: "20:05", date: "20 Aug 2022", heading: "Added", deducted: false },
//     ]);

//     const renderTransactions = ({ item, index }) => {
//         return (
//             <>
//                 <View style={styles.transactionCard}>
//                     <Text style={styles.transactionDate}>{item.date}|{item.time}</Text>
//                     <View style={[styles.flexRow, { justifyContent: "space-between", }]}>
//                         <Text style={[styles.transactionHeading, { width: "80%", }]}>{item.heading}</Text>
//                         <Text style={[styles.transactionAmount, { color: item.deducted ? "red" : "green" }]}>₹ {item.amount}</Text>
//                     </View>
//                     <Text style={styles.transactionId}>Transaction ID: 821549235</Text>
//                 </View>
//             </>
//         )
//     }

//     return (
//         <View style={{ width: wp(100), height: "100%", backgroundColor: "white" }}>



//             <View style={styles.walletAmountContainer}>
//                 <Text style={styles.balanceHeading}>My Balance</Text>
//                 <Text style={styles.myBalanceTxt}>₹2500</Text>
//             </View>



//             <Text style={styles.transactionHistorytitle}>Transaction History</Text>
//             <FlatList
//                 style={{ backgroundColor: "transparent" }}
//                 contentContainerStyle={{ backgroundColor: "transparent" }}
//                 data={transactionArr}
//                 renderItem={renderTransactions}
//                 keyExtractor={(item, index) => index}
//             />


//         </View>
//     )
// }
// const styles = StyleSheet.create({

//     ///////////btn
//     backBtn: {
//         marginVertical: 15,
//         width: 50,
//         height: 50,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//     },


//     transactionCard: {
//         backgroundColor: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         paddingHorizontal: 15,
//         borderBottomColor: "#ccc",
//         borderBottomWidth: 1,
//         width: wp(90),
//         paddingVertical: 10,
//         borderRadius: 10,
//         marginVertical: 3,
//         alignSelf: "center",
//     },

//     walletAmountContainer: {
//         backgroundColor: "white",
//         paddingVertical: 25,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//     },


//     ///////txt
//     PageHeading: {
//         fontFamily: "OpenSans-Bold",
//         fontSize: 22,
//         color: "#748A9D",
//         textAlign: "center",
//         flex: 1,
//         marginVertical: 15,
//         height: 50,
//         paddingTop: 8,
//     },
//     transactionHistorytitle: {
//         width: wp(90),
//         marginVertical: 20,
//         fontSize: 16,
//         fontFamily: "OpenSans-Bold",
//         alignSelf: "center",
//     },
//     transactionHeading: {
//         fontFamily: "OpenSans-Bold",
//         fontSize: 16,
//         marginVertical: 0,
//     },
//     notificationDescription: {
//         fontFamily: "OpenSans-SemiBold",
//         fontSize: 14,
//         color: "grey",
//     },
//     transactionDate: {
//         fontFamily: "OpenSans-SemiBold",
//         fontSize: 10,
//         textAlign: "right",
//         marginVertical: 5,
//         color: "grey",
//     },
//     transactionAmount: {
//         fontFamily: "OpenSans-Bold",
//         fontSize: 16,
//         marginVertical: 0,
//     },
//     balanceHeading: {
//         fontFamily: "OpenSans-SemiBold",
//         fontSize: 20,
//         marginVertical: 0,
//         color: "#748A9D",
//     },

//     myBalanceTxt: {
//         fontFamily: "OpenSans-SemiBold",
//         fontSize: 20,
//         marginVertical: 10,
//         color: "#000",
//     },
//     transactionId: {
//         fontSize: 12,
//         paddingTop: 7,
//         marginTop: 15,
//         width: "100%",
//         borderTopWidth: 1,
//         borderTopColor: "rgba(0,0,0,0.1)",
//         // backgroundColor: "red"
//     },


//     /////card
//     NotificationCard: {
//         backgroundColor: "white",
//         borderRadius: 10,
//         marginVertical: 7,
//         width: wp(90),
//         padding: 15,
//         alignSelf: "center",
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.20,
//         shadowRadius: 1.41,

//         elevation: 2,
//     },


//     ///////flex    
//     flexRow: {
//         display: "flex",
//         flexDirection: "row",
//     },
//     flexColumn: {
//         display: "flex",
//         flexDirection: "column",
//     },
// })