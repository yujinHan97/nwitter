import { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");

    // 파이어스토어에서 받은 데이터는 상태로 관리해야 화면에 보여줄 수 있으므로,
    // 빈 배열로 초기화한 상태 nweets를 만들고 forEach 함수와 setNweets로 파이어스토어의 데이터를 저장 
    const [nweets, setNweets] = useState([]); 
    const [attachment, setAttachment] = useState("");

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
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        await dbService.collection("nweets").add({
            text:nweet,
            createdAt:Date.now(),
            creatorId:userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const {
            target : {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget : {result},
            } = finishedEvent;
            setAttachment(result);
        };

        reader.readAsDataURL(theFile);
    };

    // 파일 선택 취소 기능
    const onClearAttachment = () => setAttachment("");

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
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}> Clear </button>
                    </div>
                )}
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