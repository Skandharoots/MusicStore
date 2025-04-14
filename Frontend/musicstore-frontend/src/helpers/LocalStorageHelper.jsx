import axios from 'axios';
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

    static getBasketItems() {
        return localStorage.getItem("basket");
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
                axios.post("api/users/refresh-token", {}, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getRefresh(),
                        'X-XSRF-TOKEN': r.data.token,
                    }
                }).then((r => {
                    localStorage.setItem('credentials', r.data.token);
                    localStorage.setItem('refresh', r.data.refreshToken);
                    localStorage.setItem('authValidUntil', Date.now() + (60 * 1000));
                })).catch((e) => {
                })
            }).catch(() => {
                
            })
    }

    static updateUserFirstName(userName) {
        LocalStorageHelper.ActiveCheck();
        localStorage.setItem('userName', userName);
    }

    static LoginUser(userUuid, userFirstName, jwt, userRole, refresh) {
        localStorage.setItem('userUuid', userUuid);
        localStorage.setItem('authValidUntil', Date.now() + 86400000); // 1 day
        localStorage.setItem('refreshUntil', Date.now() + 2629746000) // 1 month
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
    }

}

export default LocalStorageHelper;