import './style/Account.scss';
import {useEffect} from 'react';

function Account() {


    useEffect(() => {
        document.title = 'Account Settings';
    }, []);


    return (
        <div className="account">
            <p>Account page</p>
        </div>
    );
}

export default Account;