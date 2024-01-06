import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { userRequest } from '../data/requestMethod';
import LoadingScreen from './LoadingScreen';
import { updateUserInfo } from '../redux/userRedux';
import { useDispatch } from 'react-redux';


const User = ({ route }) => {
    const [focusedInput, setFocusedInput] = useState(null);
  
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [ten, setTen] = useState('');
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
  
    const [emailError, setEmailError] = useState('');
    const [telError, setTelError] = useState('');
    const [tenError, setTenError] = useState('');
    const [userError, setUserError] = useState('');

    const id = route.params.id;
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        const fetchUserData = async () => {
            try {
              const response = await userRequest.get(`/auth/${id}`);
              const userData = response.data;
              setTen(userData.ten);
              setEmail(userData.email);
              setTel(userData.dienThoai);
              setUser(userData.username);
              setLoading(false);
            } catch (error) {
              console.error('Error fetching user data:', error);
              setLoading(false);
            }
          };
      
        fetchUserData();
    },[id])
  
  
    const checkAllErrors = () => {
      checkEmail();
      checkTel();
      checkTen();
      checkUser();
    };
  
    const handleFocus = (inputName) => {
      setFocusedInput(inputName);
    };
  
    const handleBlur = () => {
      setFocusedInput(null);
      checkAllErrors();
    };
  
    const getBorderStyle = (inputName) => {
      return {
        borderColor: focusedInput === inputName ? '#244fcf' : '#EBEBEB',
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderRadius: 6,
        textAlign: 'left',
        fontSize: 11.5,
        lineHeight: 24,
        marginTop: 8,
        height: 36.5,
        marginBottom: 3
      };
    }; 
  
    const styles = StyleSheet.create({
      text: {
          fontSize: 12,
          color: "#353536",
      }
    });
  
  
    const checkEmail = () => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = regex.test(email);
      setEmailError(isValid ? '' : 'Email không hợp lệ');
    };
  
    const checkTel = () => {
      const regex = /^0\d{9}$/;
      const isValid = regex.test(tel);
      setTelError(isValid ? '' : 'Số điện thoại không hợp lệ');
    };
  
    const checkTen = () => {
      const isValid = ten.length > 0;
      setTenError(isValid ? '' : 'Vui lòng nhập tên');
    };
  
    const checkUser = () => {
      const isValid = user.length >= 5;
      setUserError(isValid ? '' : 'Username phải có ít nhất 5 ký tự');
    };
  
  
    const handleSubmit = async () => {
      if(email.length > 0 && tel.length > 0 && user.length > 0 && ten.length > 0  && emailError.length == 0 && telError.length == 0 && tenError.length == 0) {
        setLoading(true);
        try {
          const res = await userRequest.put(`/auth/${id}`, {
            ten,
            email,
            dienThoai: tel,
            username: user
          })
          setLoading(false);

          const data = res.data;

          Alert.alert('Cập nhập thành công!');
          dispatch(updateUserInfo(data.user));
        }
        catch (err) {
          if(err.response?.data?.error) {
            const errorMessage = err.response.data.error;
            switch (errorMessage) {
              case 'Username đã tồn tại':
            setUserError('Username đã tồn tại');
            break;
          case 'Email đã tồn tại':
            setEmailError('Email đã tồn tại');
            break;
          case 'Số điện thoại đã tồn tại':
            setTelError('Số điện thoại đã tồn tại');
            break;
          default:
            console.error('Unhandled error:', errorMessage);
            }
          } else {
            console.log(err);
          }
        }
      }
    }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>  
    <View style={{ padding: 13, marginBottom: 30 }}>  
    {loading ? (
      <LoadingScreen />
    ) : (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 400, marginBottom:20, marginTop: 20 }}>Thông tin tài khoản</Text>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Tên, Họ: </Text>
        <TextInput
          style={getBorderStyle('tenHo')}
          onFocus={() => handleFocus('tenHo')}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          onChangeText={setTen}
          value={ten}
        />
        {tenError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{tenError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>E-mail: </Text>
        <TextInput 
        style={getBorderStyle('email')}
        onFocus={() => handleFocus('email')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setEmail}
        value={email}
        />
        {emailError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{emailError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Điện Thoại: </Text>
        <TextInput 
        style={getBorderStyle('dienthoai')}
        onFocus={() => handleFocus('dienthoai')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setTel}
        value={tel}
        />
        {telError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{telError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Username: </Text>
        <TextInput 
        style={getBorderStyle('username')}
        onFocus={() => handleFocus('username')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setUser}
        value={user}
        />
        {userError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{userError}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => (handleSubmit())} style={{ height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center'}}>
        <Text style={{ color: 'white', fontSize: 12 }}>Lưu lại</Text>
      </TouchableOpacity>
    </View>
    )}
  </View>  
  </ScrollView>
  );
};

export default User;
