import React from 'react';
import { StyleSheet, View,Text ,Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Summary() {

    

    return (
        <View style={[styles.container]}>
           <View style={{padding:20}}><View style={{flexDirection:'row'}}>
                          <AntDesign name='arrowleft' size={20} style={{color:'black'}}/> 
                    <Text style={[styles.topText,{flex:1,marginLeft:20}]}>Summary</Text>
                    <AntDesign name='message1' size={20} style={{color:'black',marginRight:20}}/> 
          <Feather name='bell' size={20} style={{color:'black'}}/> 
          </View>
            
          <View style={[styles.topView,{marginTop:30}]}>
            <Image
                style={[styles.img]}
                source={{
                    uri:'data:image/jpeg;base64,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'
                }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.listTitle]}>Stock Analysis</Text>
                <Text style={[styles.address, {marginTop:5, color: '#929292',}]}>Chris Parkar</Text>
                <Text style={[styles.address, { marginTop:5,color: '#929292' }]}>abc</Text>
                <Text style={[styles.address, {marginTop:7, color: '#929292' }]}>Bought on: On Fri, 15 Oct</Text>
            </View>
            <View style={[styles.topView,{marginTop:-40,backgroundColor:'#085A4E',paddingHorizontal:10,paddingVertical:5,borderRadius:5}]}>
                <Text style={[{ color: '#085A4E', marginRight: 5,fontSize:14,fontFamily:'RedHatText-SemiBold', color:'#fff'}]}>Dispatched</Text>
                <AntDesign name="down" size={12} color={'#FFF'} /></View>
        </View>
</View>

<View style={{backgroundColor:'#F9F9F9',padding:20}}>
<Text style={{fontSize:14,fontFamily:'RedHatText-SemiBold',color:'black'}}>STUDENT DETAILS</Text>
<View style={[styles.border]}></View>

<Text style={{flex:1, fontFamily: "RedHatText-Regular",fontSize:13,color:'black'}}>Total MRP</Text>
<View style={{flexDirection:'row',alignItems:'center'}}>
   <Feather name='phone' size={12} color={'black'}/>
<Text style={{fontFamily: "RedHatText-Regular",fontSize:13,color:'black',marginLeft:15}}>98765-54321</Text>
</View>
<View style={{flexDirection:'row',alignItems:'center',marginTop:7}}>
   <AntDesign name='mail' size={12} color={'black'}/>
<Text style={{fontFamily: "RedHatText-Regular",fontSize:13,color:'black',marginLeft:15}}>roshil@xyz.com</Text>
</View>
</View>



        <View style={{backgroundColor:'#F9F9F9',padding:20,marginTop:30}}>
<Text style={{fontSize:14,fontFamily:'RedHatText-SemiBold',color:'black'}}>PRICE DETAILS (2 Items)</Text>
<View style={[styles.border]}></View>
<View style={{flexDirection:'row'}}>
<Text style={{flex:1, fontFamily: "RedHatText-Regular",fontSize:13,color:'black'}}>Total MRP</Text>
<View style={{flexDirection:'row',alignItems:'center'}}>
   <Feather name='dollar-sign' size={12} color={'black'}/>
<Text style={{fontFamily: "RedHatText-Regular",fontSize:13,color:'black'}}>1400</Text></View>
</View>
<View style={{flexDirection:'row',marginTop:7}}>
<Text style={{flex:1,fontFamily: "RedHatText-Regular",fontSize:13,color:'black'}}>Coupon Discount</Text>
<Text style={{fontFamily: "RedHatText-Regular",fontSize:13,color:'#FFA949'}}>Apply Coupon</Text>
</View>
<View style={[styles.border]}></View>
<Text style={{fontSize:14,fontFamily:'RedHatText-SemiBold',color:'black'}}>Total Amount</Text>
</View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
         flex: 1,
       //  padding:20
            },
            topView: {
                flexDirection: 'row',
                alignItems: 'center',
            
            },
            topText:{
                fontSize:18,
                fontFamily:'RedHatText-SemiBold',
                //fontWeight:'500',
                 },
            img: {
                width: 100,
                height: 140,
                resizeMode: 'contain',
                borderRadius: 5
            },
            border:{
                borderWidth:1,
                borderColor:'#E0E0E0',
                marginVertical:7
            },
            listTitle: {
                fontSize: 15,
               // fontWeight:'500',
                color: 'black',
                fontFamily: 'RedHatText-SemiBold',
            },
            address: {
                fontSize: 12,
               // fontWeight:'400',
                color:'#828282',
                fontFamily: "RedHatText-Regular",
            },
})