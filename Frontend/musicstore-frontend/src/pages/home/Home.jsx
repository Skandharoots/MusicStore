import {useEffect} from 'react';
import './style/Home.scss';

function Home() {

    useEffect(() => {
        document.title = 'Fancy Strings';
    }, []);

    return (
      <div className="Home">
          <a>Home page content</a>
      </div>
    );
}

export default Home;