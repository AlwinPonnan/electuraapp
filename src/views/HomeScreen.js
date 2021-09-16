import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { light_colors } from '../globals/colors';
import MIcon from 'react-native-vector-icons/MaterialIcons'

export default function HomeScreen() {
    const [productsArr, setProductsArr] = useState([
        {

            name: "Lorem Course",
            categoryName: 'Science',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1475778057357-d35f37fa89dd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min'


        },


        {
            name: "Lorem Course2",
            categoryName: 'Physics',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min'
        },


        {
            name: "Lorem Course3",
            categoryName: 'A.I.',
            teacher: "Mr. CBSE",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1475778057357-d35f37fa89dd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",

        },
        {
            name: "Lorem Course",
            categoryName: 'Science',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min'

        },
    ])
    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} android_ripple={{ color: '#ddd' }}>
                <View style={styles.imgContainer}>
                    <Image style={styles.img} source={{ uri: item.imgUrl }} />
                    {
                        item.courseEstimatedTime &&
                        <View style={styles.courseEstimatedTimeContainer}>
                            <Text style={styles.courseEstimatedTime} >{item.courseEstimatedTime}</Text>
                        </View>
                    }
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.newTag}>New</Text>
                    <Text style={styles.titleText}>{item.name}</Text>
                </View>

                <View style={styles.bottomCardContainer}>
                    <Pressable style={styles.teacherContainer} android_ripple={{ color: '#ddd' }}>
                        <View style={styles.teacherImgContainer}>
                            <Image style={styles.teacherImg} source={{ uri: item.teacherImg }} />
                        </View>
                        <View style={styles.teacherNameContainer}>
                            <Text style={styles.teacherName}>{item.teacher}</Text>
                        </View>
                    </Pressable>
                    <Pressable android_ripple={{ color: "#ddd" }} style={styles.addToLibrary}>
                        <MIcon name="library-add" size={21} />
                    </Pressable>
                </View>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            {/* <FlatList
                style={{ height: 300 }}
                contentContainerStyle={{ height: 250 }}
                horizontal
                data={productsArr}
                renderItem={renderItem}
                // renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                keyExtractor={(item, index) => `${index}`}
            /> */}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    cardContainer: {
        paddingHorizontal: 15,
        overflow: "hidden",
        paddingVertical: 15,
        display: 'flex',
        width: wp(45),
        flexDirection: 'column',
        borderBottomColor: light_colors.lightGrey,
        borderBottomWidth: 1
    },
    imgContainer: {
        position: 'relative',
        display: 'flex',
        flex: 1,
    },
    img: {
        height: hp(27),
        flex: 1,
        borderRadius: 3
    },
    courseEstimatedTimeContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 3,
        bottom: 5,
        right: 5

    },
    courseEstimatedTime: {
        color: light_colors.lightGrey
    },
    titleContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleText: {
        color: 'black',
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        paddingBottom: 7
    },
    newTag: {
        backgroundColor: light_colors.primary,
        color: light_colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
        paddingVertical: 2,
        paddingHorizontal: 5,
        marginRight: 5,
        borderRadius: 3
    },
    descriptionContainer: {

    },
    descriptionText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',

    },
    bottomCardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addToLibrary: {
        padding: 10,
    },

    teacherContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
    },
    teacherImgContainer: {

    },
    teacherImg: {
        height: 20,
        width: 20,
        borderRadius: 100
    },
    teacherNameContainer: {
        paddingLeft: 10
    },
    teacherName: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',

    }

})
