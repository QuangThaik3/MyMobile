import { publicRequest, userRequest } from "../data/requestMethod";
import { loginFailure, loginStart, loginSuccess, updateUserInfo } from "./userRedux";

export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try{
        dispatch(loginSuccess(res.data));
    }
    catch (err) {
        dispatch(loginFailure());
    }
};

export const logoutUser = (dispatch) => {
    dispatch(logout());
};

export const updateAvatar = async (dispatch, id) => {
    try {
        const response = await userRequest.get(`/auth/${id}`);
        const userData = response.data;

        dispatch(updateUserInfo(userData));
    } catch (err) {
      console.error("Error updating avatar:", err);
    }
};    

export default login;
