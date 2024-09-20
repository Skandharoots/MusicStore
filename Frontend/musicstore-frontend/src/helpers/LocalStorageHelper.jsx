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

    static isUserAdmin() {
        LocalStorageHelper.ActiveCheck();

        return localStorage.getItem('userAdmin') !== null && localStorage.getItem('userAdmin') !== undefined && localStorage.getItem('userAdmin') === 'ADMIN';
    }

    static ActiveCheck() {
        let validUntil = new Date(parseInt(localStorage.getItem('authValidUntil'), 10));
        let now = Date.now();

        if (localStorage.getItem('authValidUntil') && validUntil - now < 0) {
            LocalStorageHelper.LogoutUser();
            window.location.href = '/login';
        }
    }

    static LoginUser(userUuid, userFirstName, jwt, userRole) {
        localStorage.setItem('userUuid', userUuid);
        localStorage.setItem('authValidUntil', Date.now() + (23 * 60 * 60 * 1000)); // 2 hours
        localStorage.setItem('userName', userFirstName);
        localStorage.setItem('credentials', jwt);
        localStorage.setItem('userRole', userRole);
    }

    static LogoutUser() {
        localStorage.removeItem("userUuid");
        localStorage.removeItem("authValidUntil");
        localStorage.removeItem("userName");
        localStorage.removeItem("credentials");
    }

}

export default LocalStorageHelper;