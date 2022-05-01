const activeSession = JSON.parse(getFromLS("user")).session;
const player = JSON.parse(getFromLS("user"));
const sessionH1 = document.getElementById("session-code");
const lobbyDiv = document.getElementById("lobby-one-div");

sessionH1.innerText = activeSession;

console.log(activeSession);

async function createGroupDiv() {
  const div = document.createElement("div");
  div.classList = "group-div";
  const groupID = await createGroup(activeSession);
  div.addEventListener("click", async () => {
    //Move player to div
    //Update players
    //Update group

    const groupFilter = { _id: groupID.groupID };
    const groupUpdates = { user: player.username };
    await updateGroup({
      filter: groupFilter,
      updates: groupUpdates,
    });
  });
  lobbyDiv.append(div);
}
