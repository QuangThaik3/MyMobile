import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/apiCalls';
import { loginFailure, loginSuccess } from '../redux/userRedux';
import { publicRequest } from '../data/requestMethod';
import LoadingScreen from './LoadingScreen';

const Login = ({ navigation }) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.user);

  const handlePress = () => {
    setChecked(!checked);
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const checkEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Email không hợp lệ');
  };

  const checkPassword = () => {
    const regex = /^(?=.*[#?!@$%^&*-]).{8,}$/;
    const isValid = regex.test(password);
    setPasswordError(isValid ? '' : 'Phải có ít nhất 8 ký tự trong đó có đặc biệt (ví dụ: #?!@$%^&*-)');
  };

  const checkAllErrors = () => {
    checkEmail();
    checkPassword();
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  useEffect(() => {
    checkEmail();
  }, [email]);

  useEffect(() => {
    checkPassword();
  }, [password])

  const getBorderStyle = (inputName) => {
    return {
      borderColor: focusedInput === inputName ? '#244fcf' : '#EBEBEB',
      borderWidth: 1,
      padding: 10,
      marginBottom: 3,
      width: '100%',
      borderRadius: 6,
      textAlign: 'left',
      fontSize: 11.5,
      lineHeight: 24,
      marginTop: 8,
      height: 36.5
    };
  }; 

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: "#353536",
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      checkbox: {
        width: 12,
        height: 12,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#7a7a7c',
        marginRight: 8,
      },
      checkboxChecked: {
        width: 11,
        height: 11,
        borderRadius: 2,
        backgroundColor: '#353536',
        marginRight: 8,
      },
      label: {
        fontSize: 11.5,
      },
});  

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  });

  return unsubscribe;
}, [navigation]);

const handleSubmit = async () => {
  if (isLoggingIn) {
    return;
  }

  setIsLoggingIn(true);
  if (email.length > 0 && password.length > 0 && emailError.length === 0 && passwordError.length === 0) {
    try {
      const res = await publicRequest.post("/auth/login", { email, password });
      dispatch(loginSuccess(res.data));
      navigation.navigate('Home')
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        switch (errorData) {
          case 'Wrong Email':
            setEmailError('Email không đúng');
            break;
          case 'Wrong Password':
            setPasswordError('Password không đúng');
            break;
          default:
            console.error('Unhandled error:', errorMessage);
        }
      } else {
        console.log(err);
      }
      dispatch(loginFailure());
    } finally {
      setIsLoggingIn(false);
    }
  }
};



  return (

  <View style={{ padding: 13, marginBottom: 30 }}>  
    <View>
      <Text style={{ fontSize: 20, fontWeight: 400, marginBottom:20, marginTop: 20 }}>Đăng nhập</Text>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Email: </Text>
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
        <Text style={styles.text}>Mật khẩu: </Text>
        <TextInput
          style={getBorderStyle('matkhau')}
          onFocus={() => handleFocus('matkhau')}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
        {passwordError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{passwordError}</Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <View>
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.checkboxContainer}>
            <View style={checked ? styles.checkboxChecked : styles.checkbox} />
            <Text style={styles.label}>Nhớ mật khẩu</Text>
        </View>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {navigation.navigate('Password')}}>
            <Text style={{ fontSize: 11.7, color: '#244fcf'}}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => {handleSubmit()}} disabled={isFetching || isLoggingIn} style={{ height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center'}}>
        <Text style={{ color: 'white', fontSize: 12 }}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
    <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
        <Text style={{ fontSize: 12 }}>Bạn Chưa Có Tài Khoản?</Text>
        <TouchableOpacity onPress={() => (navigation.navigate('Register'))} >
            <Text style={{ fontSize: 12.3, color: '#244fcf'}}>Tạo tài khoản ngay</Text>
        </TouchableOpacity>
    </View>
  </View>  
  );
};

export default Login;
