import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = ({userObj, refreshUser}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    
    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        // 기존 displayName과 새로 입력한 newDisplayName이 다른 경우에만 프로필 업데이트
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({displayName:newDisplayName});
            refreshUser(); // 리렌더링을 위한 코드
        }
    };

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" placeholder="Display Name" value={newDisplayName} autoFocus className="formInput" />
                <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop: 10, }} />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};

export default Profile;