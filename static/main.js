const socket = io("/");
const main__chat__window = document.getElementById("main__chat_window");
const videoGrids = document.getElementById("video-grids");
const myVideo = document.createElement("video");
const chat = document.getElementById("chat");
OtherUsername = "";
chat.hidden = true;
myVideo.muted = true;

window.onload = () => {
    $(document).ready(function() {
        $("#getCodeModal").modal("show");
    });
};

var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "",
});

let myVideoStream;
const peers = {};
var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

sendmessage = (text) => {
    if (event.key === "Enter" && text.value != "") {
        socket.emit("messagesend", myname +":"+ text.value);
        text.value = "";
        main__chat_window.scrollTop = main__chat_window.scrollHeight;
    }
};

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream, myname);

        socket.on("user-connected", (id, username) => {
            connectToNewUser(id, stream, username);
            socket.emit("tellName", myname);
        });

        socket.on("user-disconnected", (id) => {
            console.log(peers);
            if (peers[id]) peers[id].close();
        });
    });
peer.on("call", (call) => {
    getUserMedia({ video: true, audio: true },
        function(stream) {
            call.answer(stream); // Answer the call with an A/V stream.
            const video = document.createElement("video");
            call.on("stream", function(remoteStream) {
                addVideoStream(video, remoteStream, OtherUsername);
            });
        },
        function(err) {
            console.log("Failed to get local stream", err);
        }
    );
});

peer.on("open", (id) => {
    socket.emit("join-room", roomId, id, myname);
});


socket.on("createMessage", (message) => {
    var ul = document.getElementById("messageadd");
    var li1 = document.createElement("li");
    li1.className = "name-chat";
    li1.appendChild(document.createTextNode(message.split(":")[0]));
    ul.appendChild(li1);
    var li = document.createElement("li");
    li.className = "message";
    li.appendChild(document.createTextNode(message.split(":")[1]));
    ul.appendChild(li);
});

socket.on("AddName", (username) => {
    OtherUsername = username;
});

const RemoveUnusedDivs = () => {
    //
    alldivs = videoGrids.getElementsByTagName("div");
    for (var i = 0; i < alldivs.length; i++) {
        e = alldivs[i].getElementsByTagName("video").length;
        if (e == 0) {
            alldivs[i].remove();
        }
    }
};

const connectToNewUser = (userId, streams, myname) => {
    const call = peer.call(userId, streams);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
            //   console.log(userVideoStream);
        addVideoStream(video, userVideoStream, myname);
    });
    call.on("close", () => {
        video.remove();
        RemoveUnusedDivs();
    });
    peers[userId] = call;
};

const invitebox = () => {
    $("#getCodeModal").modal("show");
};

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        document.getElementById("mic").style.background = "url('https://artemissssss.github.io/-------------------/img/no-recording.png')";
    } else {
        
        myVideoStream.getAudioTracks()[0].enabled = true;
        document.getElementById("mic").style.background = "url('https://artemissssss.github.io/-------------------/img/microphone-black-shape%20(1).png')";
    }
};

const VideomuteUnmute = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
console.log(myVideoStream.getVideoTracks())
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        
      document.getElementById("video").style.background = "url('https://artemissssss.github.io/-------------------/img/no-video.png')"
    } else {
    
        document.getElementById("video").style.background = "url('https://artemissssss.github.io/-------------------/img/video-camera%20(1).png')"
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const showchat = () => {
    if (chat.hidden == false) {
        chat.hidden = true;
        document.getElementById("about-prog").style.width ="1230px"
        document.getElementById("need-2").style.width ="1230px"
        document.getElementById("mainclone").style.width ="1230px"
        document.getElementById("chat-1").style.background="url('https://artemissssss.github.io/-------------------/img/chat%20(1).png')"
    } else {
        document.getElementById("about-prog").style.width ="958.55px"
        document.getElementById("need-2").style.width ="958.55px"
        document.getElementById("mainclone").style.width ="958.55px"
        document.getElementById("chat-1").style.background="url('https://artemissssss.github.io/-------------------/img/chat.png')"
        chat.hidden = false;
    }
};

const addVideoStream = (videoEl, stream, name) => {
    videoEl.srcObject = stream;
    videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play();
    });
    const h1 = document.createElement("h2");
    const h1name = document.createTextNode(name);
    h1.className = "name-of-user"
    h1.appendChild(h1name);
    const videoGrid = document.createElement("div");
    videoGrid.classList.add("video-grid");
    videoGrid.appendChild(h1);
    videoGrids.appendChild(videoGrid);
    videoGrid.append(videoEl);
    RemoveUnusedDivs();
    let totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
        for (let index = 0; index < totalUsers; index++) {
            document.getElementsByTagName("video")[index].style.width =
                100 / totalUsers + "%";
        }
    }
};
function copyToClipboard(str) {
    var area = document.createElement('textarea');
  
    document.body.appendChild(area);  
      area.value = str;
      area.select();
      document.execCommand("copy");
    document.body.removeChild(area);  
  }
document.getElementById("id-conference").innerHTML = "/join/"+roomId;
document.getElementById("id-conference").addEventListener("click",() =>{
    copyToClipboard("/join/"+roomId)
})
document.getElementById("id-conference").addEventListener("dblclick",() =>{
    copyToClipboard("https://artem-video.herokuapp.com/join/"+roomId)
})