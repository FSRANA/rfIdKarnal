import { View, Text} from 'react-native';
import { useSelector } from 'react-redux';

const Location = () => {
    const userData = useSelector((state) => state.user.userData);
    return (
        <View style={{ alignContent:'center', paddingVertical:10, backgroundColor:'#eee' }}>
            <Text style={{ textAlign:'center', color:'dodgerblue' }}>
                {userData.location.name ?? ''}
            </Text>
        </View>
    )
}

export default Location;