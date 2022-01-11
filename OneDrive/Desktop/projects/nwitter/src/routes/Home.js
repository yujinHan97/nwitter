import { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");

    // 파이어스토어에서 받은 데이터는 상태로 관리해야 화면에 보여줄 수 있으므로,
    // 빈 배열로 초기화한 상태 nweets를 만들고 forEach 함수와 setNweets로 파이어스토어의 데이터를 저장 
    const [nweets, setNweets] = useState([]); 
                              
    // onSnapshot 함수를 이용하여 실시간 데이터베이스 도입
    useEffect(() => {
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id:document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        });
    }, []);
    // console.log(nweets);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text:nweet,
            createdAt:Date.now(),
            creatorId:userObj.uid,
        });
        setNweet("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setNweet(value);
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    value = {nweet}
                    onChange = {onChange}
                    type = "text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet 
                        key={nweet.id} 
                        nweetObj={nweet} 
                        isOwner={nweet.creatorId===userObj.uid}
                    />
                ))}
            </div>
        </>
    );
};

export default Home;