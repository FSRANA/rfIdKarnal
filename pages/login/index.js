import React, { useState } from "react";
import {useRouter} from 'expo-router';
import { useDispatch } from 'react-redux';


import API, {setClientToken} from '../../shared/api';


import { ImageBackground, Text, TextInput, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [uname,setUname] = useState("");
    const [pwd,setPwd] = useState("");
    const [userdata,setUserdata] = useState(null); 
    const [token,setToken] = useState(null); 


    const [isLoading, setIsLoading] = useState(false);

  

    const attemptLogin = async (event) => {
        if (!uname.trim() || !pwd.trim()) {
          alert("Username or Password is invalid");
          return;
        }
        setIsLoading(true);

        API.post(`login`, {

            username: uname, 
            password: pwd

        }).then(function (response) {
            // console.log(response.data);

            if(response.data.status === 0){
                alert(response.data.message);
            } else {
                // console.log(response.data.data);
                if(response.data.data.role === 'User'){

                    dispatch({ type: 'user/setUserData', payload: response.data.data });
                    dispatch({ type: 'user/setToken', payload: response.data.token });
                    router.push(`/dashboard`);
                } else {
                    alert("Sorry! Only Intallers can login to this app.");
                }
                
                
            }

            setIsLoading(false);

            

        }).catch(function (error) {

            alert(error);
            setIsLoading(false);

        });




        
       
        

      };


    return (
        <View style={{ flex:1,justifyContent:'center',alignItems:'center', backgroundColor:"dodgerblue" }}>
            <View style={{  backgroundColor:"#fff", width:"90%", minHeight:"20%", shadowColor:"#111", borderRadius:20 }}>
                <View style={{ width:"100%", alignItems:"center", padding:10 }}>
                    <Image 
                        source={require('../../assets/images/rfid.png')}
                        style={{ width:65 }}
                        resizeMethod="scale"
                        resizeMode="contain"
                    />
                </View>
                <View>
                    <Text style={{ paddingHorizontal:20,paddingVertical:10,fontWeight:'bold' }}>User Name</Text>
                    <View style={{ alignItems:'center' }}>
                        <TextInput 
                            style={{ 
                                borderColor:"#999999",borderWidth:1,
                                width:"90%", padding:8,
                                paddingHorizontal:15,
                                borderRadius:50
                            }} 
                            placeholder="Enter User Name"
                            placeholderTextColor="#ccc"
                            autoCapitalize="none"
                            cursorColor="purple"
                            value={uname}
                            onChangeText={ uname => setUname(uname) }
                        />
                    </View>
                </View>
                <View>
                    <Text style={{ paddingHorizontal:20,paddingVertical:10,fontWeight:'bold' }}>Password</Text>
                    <View style={{ alignItems:'center' }}>
                        <TextInput 
                            style={{ 
                                borderColor:"#999",borderWidth:1,
                                width:"90%", padding:8,
                                paddingHorizontal:15,
                                borderRadius:50
                            }} 
                            placeholder="Enter Password"
                            placeholderTextColor="#ccc"
                            cursorColor="purple"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            value={pwd}
                            onChangeText={ pwd => setPwd(pwd) }
                            
                        />
                    </View>
                </View>
                <View style={{ alignItems:"center", paddingVertical:30 }}>
                    <TouchableOpacity disabled={isLoading} onPress={attemptLogin} style={{ alignItems:"center", padding:15, backgroundColor:"dodgerblue", width:"90%", borderRadius:50 }}>

                        {isLoading ? (
                            <ActivityIndicator size="small" color={'#fff'} />
                        ): (
                            <Text style={{ color:"#fff", fontWeight:"bold" }}>
                                Login Now
                            </Text>
                        )}
                        
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => { router.push(`/home`) }} style={{ alignItems:"center", padding:15, backgroundColor:"dodgerblue", width:"90%", borderRadius:50 }}>
                        <Text style={{ color:"#fff", fontWeight:"bold" }}>
                            Login Now
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </View>    
            <View style={{alignItems:"center", paddingTop:5 }}>
                <Text style={{ fontWeight:"bold", color:"#ccc" }}>
                    Phoentus Innovations
                </Text>
            </View>
        </View>
    )
}

export default Login;