import axios from 'axios';
import {Slide, toast} from "react-toastify";
class LocalStorageHelper {

    static IsUserLogged() {
        LocalStorageHelper.ActiveCheck();
        return localStorage.getItem('userUuid') !== null && localStorage.getItem('userUuid') !== undefined;
    }

    static GetActiveUser() {
        LocalStorageHelper.ActiveCheck();
        return localStorage.getItem('userUuid');
    }

    static getUserName() {
        LocalStorageHelper.ActiveCheck();
        return localStorage.getItem('userName');
    }

    static getJwtToken() {
        LocalStorageHelper.ActiveCheck();
        return localStorage.getItem('credentials');
    }

    static getRefresh() {
        LocalStorageHelper.ActiveCheck();
        return localStorage.getItem('refresh');
    }

    static isUserAdmin() {
        LocalStorageHelper.ActiveCheck();
        return LocalStorageHelper.IsUserLogged() && localStorage.getItem('userRole') !== null && localStorage.getItem('userRole') !== undefined && localStorage.getItem('userRole') === 'ADMIN';
    }

    static ActiveCheck() {
        
        let refreshUntil = new Date(parseInt(localStorage.getItem('refreshUntil'), 10));
        let now = Date.now();
        if (localStorage.getItem('refreshUntil') && refreshUntil - now < 0) {
            LocalStorageHelper.LogoutUser();
        }
    }

    static CommitRefresh() {
        LocalStorageHelper.ActiveCheck();
        let authValidUntil = new Date(parseInt(localStorage.getItem('authValidUntil'), 10));
        let now = Date.now();
        if (authValidUntil && authValidUntil - now < 0) {
            LocalStorageHelper.RefreshToken();
        }
    }


    static RefreshToken() {
        axios.get('api/users/csrf/token')
            .then((r) => {
                axios.post('api/users/refresh-token', {}, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getRefresh(),
                        'X-XSRF-TOKEN': r.data.token,
                    }
                }).then((r => {
                        localStorage.setItem('credentials', r.data.token);
                        localStorage.setItem('refresh', r.data.refreshToken);
                        localStorage.setItem('authValidUntil', Date.now() + (24 * 60 * 60 * 1000));
                    })).catch((e) => {
                        toast.error(e.response.data, {
                            position: "bottom-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            theme: "light",
                            transition: Slide,
                        });
                })
            }).catch(() => {
                toast.error('Cannot fetch token', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                });
            })
    }

    static updateUserFirstName(userName) {
        LocalStorageHelper.ActiveCheck();
        localStorage.setItem('userName', userName);
    }

    static getBasketItems() {
        let items = localStorage.getItem('inBasket');
        if (items === null || items === undefined) {
            localStorage.setItem('inBasket', parseInt(0));
            return 0;
        } else {
            return parseInt(items);
        }
        
    }

    static setBasketItems(diff) {
        let current = localStorage.getItem('inBasket');
        if (current) {
            let newCount = parseInt(current) + diff;
            localStorage.setItem('inBasket', newCount);
        } else {
            localStorage.setItem('inBasket', diff);
        }
        
    }

    static setClearBasketItems() {
        localStorage.setItem('inBasket', parseInt(0));
    }

    static LoginUser(userUuid, userFirstName, jwt, userRole, refresh) {
        localStorage.setItem('userUuid', userUuid);
        localStorage.setItem('authValidUntil', Date.now() + (24 * 60 * 60 * 1000)); // 1 day
        localStorage.setItem('refreshUntil', Date.now() + (31 * 24 * 60 * 60 * 1000)) // 1 month
        localStorage.setItem('userName', userFirstName);
        localStorage.setItem('credentials', jwt);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('userRole', userRole);
    }

    static LogoutUser() {
        localStorage.removeItem("userUuid");
        localStorage.removeItem("authValidUntil");
        localStorage.removeItem("refreshUntil");
        localStorage.removeItem("userName");
        localStorage.removeItem("credentials");
        localStorage.removeItem("refresh");
        localStorage.removeItem("userRole");
        localStorage.setItem("inBasket", 0);
        window.dispatchEvent(new Event('basket'));
    }

}

export default LocalStorageHelper;