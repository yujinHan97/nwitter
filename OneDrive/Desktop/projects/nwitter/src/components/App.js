import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  
  // currentUser에 따라서 로그인 상태를 바꾸기
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 로그인한 정보를 갖고오기 위함
  const [userObj, setUserObj] = useState(null);
  
  // 인증 관련 상태가 바뀌는 것을 감지하는 코드
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(user);
        setUserObj(user);
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />  
      ) : ( // AppRouter 컴포넌트에 userObj를 프롭스로 전달
        "initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
}

export default App;
